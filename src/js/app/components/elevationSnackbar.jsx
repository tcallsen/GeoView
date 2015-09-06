var React = require("react");

var Reflux      = require('reflux');
var ServiceStore = require('../stores/ServiceStore');
var ExcursionStore = require('../stores/ExcursionStore');
var Actions     = require('../actions');

var ElevationDialog = require('./elevationDialog');

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

    toggleElevationDialog: function() {
        this.refs.elevationDialog.refs.dialog.show();
    },

    render: function() {

        //styles
        var style = {
            snackbar : {
                bottom: 68,
                right: 10,
                marginLeft: 'auto',
                left: 'auto',
                minWidth: 'auto',
                maxWidth: 'auto',
                width: 'calc(100% - 68px)',
                overflow: 'hidden'
            }
        }
 
        return (
            <div>
                <Snackbar
                    ref="snackbar"
                    message={ "Elevation: " + utility.toFeet(this.state.elevation) + "ft" } 
                    action="more"
                    onActionTouchTap={this.toggleElevationDialog}
                    style={style.snackbar} />
                <ElevationDialog 
                    excursion={this.props.excursion}
                    ref="elevationDialog" />
            </div>
        );

    }
});

module.exports = ElevationSnackbar;