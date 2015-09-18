var React = require("react");

var Reflux          = require('reflux'),
    ServiceStore    = require('../stores/ServiceStore'),
    ExcursionStore  = require('../stores/ExcursionStore'),
    Actions         = require('../actions'),
    utility         = require('../utility'),
    { mui,
      Dialog,
      FlatButton }  = require('material-ui');

var ExcrusionLoadDialog = React.createClass({

  	getInitialState: function() {

    		return {

    		};

  	},

    render: function() {

        //Custom Actions
        var customActions = [
          <FlatButton
            key="cancel"
            label="Cancel"
            secondary={true}
            onTouchTap={this.props.toggleExcursionLoadDialog} />,
        ];

        //styles
        var style = {
            containerDiv: {
                textAlign: 'center',
                maxWidth: 400
            }
        }
 
        return (
            <Dialog ref="dialog" openImmediately={true} title="Open Excursion" actions={customActions} autoDetectWindowHeight={true} autoScrollBodyContent={true}>
                <div style={style.containerDiv}>
                    <p>LOAD EXCURSION CONTENT HERE</p>
                </div>
            </Dialog>
        );

    }
});

module.exports = ExcrusionLoadDialog;