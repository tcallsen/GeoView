var React = require("react");

var Reflux      = require('reflux');
var ServiceStore = require('../stores/ServiceStore');
var ExcursionStore = require('../stores/ExcursionStore');
var Actions     = require('../actions');

var utility = require('../utility');

var mui = require('material-ui'); 
var Snackbar = mui.Snackbar;

var ElevationSnackbar = React.createClass({

    mixins: [Reflux.listenToMany({
        handleServiceEvent: ServiceStore,
    })],

  	getInitialState: function() {

  		return {
          displayElevationSnackbar: false,
          elevation: 1000
  		};

  	},

    toggleDisplay: function() {

        this.setState({
            displayElevationSnackbar: !this.state.displayElevationSnackbar
        }, function() {

        if (this.state.displayElevationSnackbar) this.refs.snackbar.show();
        else this.refs.snackbar.dismiss();

        });

    },

    handleServiceEvent: function(serviceEvent) {

        //only update elevation if snackbar is visible
        if (!this.state.displayElevationSnackbar) return false;

        //detect if excursion update - if so reload excursions and gpx files
        if (serviceEvent.name === 'location' && serviceEvent.event === 'update' && serviceEvent.payload.enabled) {

            //return if position not supplied
            if (!serviceEvent.payload.position || !serviceEvent.payload.position.coords) return;
            
            this.setState({
                elevation: serviceEvent.payload.position.coords.altitude
            });

        }

    },

    render: function() {

        //styles
        var style = {
            snackbar : {
                bottom: 68,
                right: 10,
                marginLeft: 'auto',
                left: 'auto' 
            }
        }
 
        return (
            <Snackbar
                ref="snackbar"
                message={"Elevation: " + this.state.elevation} 
                action="undo" 
                style={style.snackbar} />
        );

    }
});

module.exports = ElevationSnackbar;