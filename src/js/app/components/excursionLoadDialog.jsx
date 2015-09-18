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
            excursionList: []
    		};

  	},

    componentDidMount: function() {

        //get list of excursions from file system and save to state
        ServiceStore.getServicePromise('file').then(function(fileService) {
            fileService.getAvailableExcursions().then(function(excursionList) {
                this.setState({
                    excursionList: excursionList
                });
            }.bind(this));
        }.bind(this));

    },

    loadExcursion: function(menuEntry) {

        var fileService = ServiceStore.getService('file');    
        fileService.read(menuEntry.fullPath).then(function(jsonBlob) {
            ExcursionStore.loadFromJsonBlob(jsonBlob);
        });

        this.props.toggleExcursionLoadDialog();

    },

    render: function() {

        console.log('ExcrusionLoadDialog render');

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
 
        var excursionListItems = []
        this.state.excursionList.forEach( excursionFileEntry => {
            excursionListItems.push( <li onClick={this.loadExcursion.bind(this,excursionFileEntry)}>{excursionFileEntry.name}</li> );
        });

        return (
            <Dialog ref="dialog" openImmediately={true} title="Open Excursion" actions={customActions} autoDetectWindowHeight={true} autoScrollBodyContent={true}>
                <div style={style.containerDiv}>
                    <p>Select and Excurion below to open:</p>
                    <ul>
                        { excursionListItems }
                    </ul>
                </div>
            </Dialog>
        );

    }
});

module.exports = ExcrusionLoadDialog;