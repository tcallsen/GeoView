/** @jsx React.DOM */

var React 			= require("react"),
	Reflux      	= require('reflux'),
	ServiceStore 	= require('../stores/ServiceStore'),
	ExcursionStore 	= require('../stores/ExcursionStore'),
	Excursion 		= require('../objects/Excursion'),
	Actions 		= require('../actions'),
	utility 		= require('../utility');

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
	            <h4 className="excursionTitle" onClick={this.props.toggleExcusionPullout} style={ style.excursionTitle }>{ (this.props.excursion) ? this.props.excursion.name : "New Excursion" }</h4>
			</div>
        );
    }
});

module.exports = ExcursionPullout;
