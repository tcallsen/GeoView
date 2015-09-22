/** @jsx React.DOM */

var React 			= require("react"),
	Reflux      	= require('reflux'),
	ServiceStore 	= require('../stores/ServiceStore'),
	ExcursionStore 	= require('../stores/ExcursionStore'),
	ExcursionGpxAddDialog = require('./excursionGpxAddDialog'),
	Excursion 		= require('../objects/Excursion'),
	Actions 		= require('../actions'),
	utility 		= require('../utility'),
	{ 
		TextField,
		FontIcon,
		List,
		ListItem,
		ListDivider,
		FontIcon,
		Checkbox
	} 				= require('material-ui');

var ExcursionPullout = React.createClass({

	mixins: [Reflux.listenToMany({
        //handleServiceEvent: ServiceStore
    })],
    
	getInitialState: function() {
		
		return { 
			gpsTrackingEnabled: false,
			displayExcursionGpxAddDialog: false
		};

	},

	handleServiceEvent: function(serviceEvent) {

		/* if (serviceEvent.name === 'location' && serviceEvent.event === 'update' && this.state.gpsTrackingEnabled != serviceEvent.payload.enabled) {
			this.setState({
				gpsTrackingEnabled: serviceEvent.payload.enabled
			});
		} */

    },

    // EXCURSION TITLE actions

    createNewExcursion: function(excursionName) {

    	ExcursionStore.create({
            name: excursionName || 'New Excursion',
        });

    },

    handleExcursionFocus: function(event) {
    	if (!this.props.excursion) this.refs.excursionNameTextField.clearValue();
    },

    handleExcursionBlur: function(event) {

    	console.log('updateExcursionName');

    	//make sure excursion name has been changed or entered - else revert to New Excursion
    	var excursionName = this.refs.excursionNameTextField.getValue().trim();
    	if (excursionName === '')
    		this.refs.excursionNameTextField.setValue( (this.props.excursion) ? this.props.excursion.name : "New Excursion" );
    	else {

    		//if no excursion exists - create a new one
    		if (!this.props.excursion) this.createNewExcursion(excursionName);
    		//if excursion exists - update name
    		else {

    			var excursion = ExcursionStore.getCurrent();
    			excursion.name = excursionName;

    			ExcursionStore.emitStoreUpdate()

    		}

    	}

    	console.log('current excursion:', ExcursionStore.getCurrent());

    },

    // GPX MENU Actions

	toggleGpxVisibility: function(guid) {
		
		console.log('toggleGpxVisibility', guid);

		this.props.excursion.toggleGpxVisibility(guid);
	},

	toggleExcursionGpxAddDialog: function() {
		if (this.state.displayExcursionGpxAddDialog) this.refs.excursionGpxAddDialog.refs.dialog.dismiss();
		this.setState({
			displayExcursionGpxAddDialog: !this.state.displayExcursionGpxAddDialog
		});
	},

    render: function() {

    	console.log('ExcursionPullout render', this.state.displayExcursionGpxAddDialog);

    	var style = {
    		pulloutContainer: {
    			height: (this.props.visible) ? 'calc(100% - 64px)' : 0
    		}
    	};

    	//GPX MENU
    	var gpxMenuItems =[];
    	if (this.props.excursion) {

	    	// GPX TRAKS MENU - add excursion gpx files if excursion set
			Object.keys(this.props.excursion.gpx).forEach( (key, index) => {
				var gpx = this.props.excursion.gpx[key];
				gpxMenuItems.push(
					<ListItem 
						key={'gpx_'+index}
						primaryText={gpx.name} 
						leftCheckbox={ <Checkbox onClick={this.toggleGpxVisibility.bind(this,key)} defaultChecked={gpx.visible} /> } />
				);
			});

	    }

		//add divider if needed
		if (gpxMenuItems.length) gpxMenuItems.push( <ListDivider /> );

		//add the 'add gpx file' entry
		gpxMenuItems.push( <ListItem primaryText="Add GPX File.." onClick={this.toggleExcursionGpxAddDialog} /> );

        return (
            <div id="pulloutContainer" style={ style.pulloutContainer }>
	            
            	<TextField
					ref="excursionNameTextField"
					className="excursionTitle"
					onFocus={this.handleExcursionFocus}
					onBlur={this.handleExcursionBlur}
					defaultValue={ (this.props.excursion) ? this.props.excursion.name : "New Excursion" } />

				<ul id="topRightActionMenu">
					{ (this.props.excursion) ? <li><FontIcon onClick={Excursion.prototype.save.bind(this.props.excursion)} className="material-icons">save</FontIcon></li> : null }
					<li><FontIcon onClick={this.props.toggleExcusionPullout} className="material-icons">keyboard_arrow_down</FontIcon></li>
				</ul>

				<List style={{clear:'both'}}>
					{ gpxMenuItems }
				</List>

				{ (this.state.displayExcursionGpxAddDialog) ?
					<ExcursionGpxAddDialog 
						ref="excursionGpxAddDialog"
						createNewExcursion={this.createNewExcursion}
						excursion={this.props.excursion}
						toggleExcursionGpxAddDialog={this.toggleExcursionGpxAddDialog} /> :
					null }

			</div>
        );
    }
});

module.exports = ExcursionPullout;
