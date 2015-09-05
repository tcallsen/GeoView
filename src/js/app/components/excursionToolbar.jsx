/** @jsx React.DOM */

var React = require("react");
var Reflux      = require('reflux');
var ServiceStore = require('../stores/ServiceStore');
var ExcursionStore = require('../stores/ExcursionStore');
var Actions = require('../actions');

var utility = require('../utility');

var AddGpxDialog   = require("./addGpxDialog");

var mui = require('material-ui'); 
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var FontIcon = mui.FontIcon;
var ToolbarSeparator = mui.ToolbarSeparator;
var Toggle = mui.Toggle;
var IconMenu = mui.IconMenu;
var MenuItem = require('material-ui/lib/menus/menu-item');
var MenuDivider = require('material-ui/lib/menus/menu-divider');

var ExcursionToolbar = React.createClass({

	mixins: [Reflux.listenToMany({
        handleServiceEvent: ServiceStore
    })],
    
	getInitialState: function() {
		
		return { 
			gpsTrackingEnabled: false,
		};

	},

	toggleGpxVisibility: function(guid) {
		this.props.excursion.toggleGpxVisibility(guid);
	},

	toggleAddGpxFileDialog: function() {
		this.refs.addGpxDialog.refs.dialog.show();
	},

	toggleLocation: function() {
		ServiceStore.getService('location').toggle();
	},

	saveExcursion: function() {

		var fileService = ServiceStore.getService('file');

		var jsonBlob = this.props.excursion.toJsonBlob();

		fileService.write('/exc/' + utility.removeSpaces(this.props.excursion.name) + '.exc', jsonBlob).then(function() {

			alert('Save complete');

			Actions.triggerServiceEvent({
                name: 'fileSystem',
                event: 'update'
            });

		});
		
	},

	closeExcursion: function() {

		//close current excursion
        ExcursionStore.closeCurrent();

	},

	onItemTouchTap: function(event, item) {
		console.log('onItemTouchTap', event, item);
	},

	onChange: function() {

		alert('onChange');

	},

	handleServiceEvent: function(serviceEvent) {

		if (serviceEvent.name === 'location' && serviceEvent.event === 'update' && this.state.gpsTrackingEnabled != serviceEvent.payload.enabled) {
			this.setState({
				gpsTrackingEnabled: serviceEvent.payload.enabled
			});
		}

    },

    render: function() {

    	var style = {
    		excursionTitle: {
    			width: (this.refs.titleSizeAnchor) ? this.refs.titleSizeAnchor.getDOMNode().getBoundingClientRect().left - 40 : 0
    		}
    	};

    	//build edit menu
    	var editMenuIcon = (<FontIcon className="material-icons">more_vert</FontIcon>);
    	//var leftMenuIcon = ;
    	var editMenuItemsList = [
    		<MenuItem 
				key={'edit_0'}
				primaryText="Edit"
				leftIcon={<FontIcon className="material-icons">mode_edit</FontIcon>}
				onClick={this.toggleGpxVisibility} />,
			<MenuItem 
				key={'edit_1'}
				primaryText="Save"
				leftIcon={<FontIcon className="material-icons">save</FontIcon>}
				onClick={this.saveExcursion} />,
			<MenuItem 
				key={'edit_2'}
				primaryText="Delete"
				leftIcon={<FontIcon className="material-icons">delete</FontIcon>}
				onClick={this.toggleGpxVisibility} />,
			<MenuItem 
				key={'edit_3'}
				primaryText="Close"
				leftIcon={<FontIcon className="material-icons">close</FontIcon>}
				onClick={this.closeExcursion} />

    	];

    	var editMenu = (
			<div>
				{ editMenuItemsList }
			</div>
		);

    	//build gpx tracks menu - add excursion gpx files if excursion set
		var gpxMenuIcon = (<FontIcon className="material-icons">swap_calls</FontIcon>);
		var gpxMenuItemsList = [];
		if (this.props.excursion && this.props.excursion.getGpxList().length) {
			this.props.excursion.getGpxList().map( (gpx, index) => {
				gpxMenuItemsList.push(
					<MenuItem 
						key={'gpx_'+index}
						primaryText={gpx.name} 
						checked={gpx.visible}
						onClick={this.toggleGpxVisibility.bind(this, gpx.guid)} />
				);
			});
		}

		var gpxMenu = (
			<div>
				{ gpxMenuItemsList }
				{ gpxMenuItemsList.length ? <MenuDivider /> : null }
			</div>
		);

    	var gpxTracksMenu = (
    		<div className="toolbarIconMenu">
	    		<IconMenu iconButtonElement={gpxMenuIcon} openDirection='top-left' onItemTouchTap={this.onItemTouchTap}>
					{ gpxMenu }
					<MenuItem primaryText="Add GPX File.." onClick={this.toggleAddGpxFileDialog} />
			    </IconMenu>
		    </div>
	    );

	    //{ gpxTracksMenu }

        return (
            <div>
	            <Toolbar>

					<ToolbarGroup key={1} float="right">

						<h4 id="excursionTitle" style={ style.excursionTitle }>{ (this.props.excursion) ? this.props.excursion.name : "New Excursion" }</h4>

						<div className="toolbarIconMenu" ref="titleSizeAnchor" style={{float:"left"}}>
				    		<IconMenu iconButtonElement={editMenuIcon} openDirection='top-left' onItemTouchTap={this.onItemTouchTap}>
								{ editMenu }
						    </IconMenu>
					    </div>

						<ToolbarSeparator />

						<FontIcon className="material-icons" onClick={this.toggleLocation}>{ (this.state.gpsTrackingEnabled) ? 'gps_fixed' : 'gps_not_fixed' }</FontIcon>
						
						<FontIcon className="material-icons" onClick={this.props.toggleElevationSnackbar}>{ 'trending_up' }</FontIcon>

					</ToolbarGroup>

				</Toolbar>
				<AddGpxDialog 
					ref="addGpxDialog" />
			</div>
        );
    }
});

module.exports = ExcursionToolbar;
