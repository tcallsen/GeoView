/** @jsx React.DOM */

var React 			= require("react"),
	Reflux      	= require('reflux'),
	ServiceStore 	= require('../stores/ServiceStore'),
	ExcursionStore 	= require('../stores/ExcursionStore'),
	Excursion 		= require('../objects/Excursion'),
	Actions 		= require('../actions'),
	utility 		= require('../utility'),
	{ 
		TextField,
		FontIcon
	} 				= require('material-ui');

var ExcursionPullout = React.createClass({

	mixins: [Reflux.listenToMany({
        //handleServiceEvent: ServiceStore
    })],
    
	getInitialState: function() {
		
		return { 
			gpsTrackingEnabled: false,
		};

	},

	handleServiceEvent: function(serviceEvent) {

		/* if (serviceEvent.name === 'location' && serviceEvent.event === 'update' && this.state.gpsTrackingEnabled != serviceEvent.payload.enabled) {
			this.setState({
				gpsTrackingEnabled: serviceEvent.payload.enabled
			});
		} */

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
    		if (!this.props.excursion)
    			ExcursionStore.create({
	                name: excursionName,
	            });
    		//if excursion exists - update name
    		else {

    			var excursion = ExcursionStore.getCurrent();
    			excursion.name = excursionName;

    			ExcursionStore.emitStoreUpdate()

    		}

    	}

    	console.log('current excursion:', ExcursionStore.getCurrent());

    },

	//excursion selection menu

    render: function() {

    	console.log('ExcursionPullout render');

    	var style = {
    		pulloutContainer: {
    			height: (this.props.visible) ? 'calc(100% - 64px)' : 0
    		}
    	};

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

			</div>
        );
    }
});

module.exports = ExcursionPullout;
