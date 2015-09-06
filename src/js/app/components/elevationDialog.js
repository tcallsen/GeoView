var React = require("react");

var Reflux      = require('reflux');
var ServiceStore = require('../stores/ServiceStore');
var Actions     = require('../actions');

var Highcharts = require('highcharts-commonjs');

var utility = require('../utility');

var mui = require('material-ui'); 
var Dialog = mui.Dialog;
var FlatButton = mui.FlatButton;

var ElevationDialog = React.createClass({

  	getInitialState: function() {

        return {

        };

  	},

    getCharConfig: function() {



    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (this.props.excursion && !nextProps.excursion) return true;
        return (!this.props.excursion && nextProps.excursion) ||
            (this.props.excursion && this.props.excursion.name !== nextProps.excursion.name);
    },

    dismissDialog: function() {
        this.refs.dialog.dismiss();
    },

    render: function() {

        console.log('ElevationDialog render');

        //styles
        var style = {
            containerDiv: {
                textAlign: 'center',
                maxWidth: 400
            }
        };

        //Custom Actions
        var customActions = [
          <FlatButton
            key="close"
            label="Close"
            onTouchTap={this.dismissDialog} />
        ];

        var elevationChart = (this.props.excursion) ?
            <p>{this.props.excursion.name}</p> :
            <p>EMPTY</p> ;
 
        return (
            <Dialog ref="dialog" title="Elevation Profile" actions={customActions} autoDetectWindowHeight={true} autoScrollBodyContent={true}> 
                <div style={style.containerDiv}>

                    { elevationChart }

                </div>
            </Dialog>
        );

    }
});

module.exports = ElevationDialog;

