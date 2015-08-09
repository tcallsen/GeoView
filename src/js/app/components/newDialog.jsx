var React = require("react");

var ServiceStore = require('../stores/ServiceStore');
var Actions     = require('../actions');

var utility = require('../utility');

var mui = require('material-ui'); 
var Dialog = mui.Dialog;
var FlatButton = mui.FlatButton;
var TextField = mui.TextField; 

var NewDialog = React.createClass({
      
  	getInitialState: function() {

  		return {

  		};

  	},

    dismissDialog: function() {
        this.refs.dialog.dismiss();
    },

    createExcursion: function(event) {

        console.log('createExcursion');

        //get excursionName & gpxUrl - return if they do not exist
        var excursionName = this.refs.excursionName.getValue();
        var gpxUrl = this.refs.gpxFileUrl.getValue();
        if (!excursionName || !gpxUrl) return;

        //retrieve gpx file
        var excursionService = ServiceStore.getService('excursion');
        if (excursionService) {

            console.log('createing Excursion');

            excursionService.create({
                name: excursionName
            });

        } else alert('Error retrieving excursionService.');

    },

    downloadGpxFile: function(event) {
        console.log('downloadGpxFile');

        var fileSystem = ServiceStore.getService('fileSystem');
        var fileTransfer = ServiceStore.getService('fileTransfer');
        if (fileSystem && fileTransfer) {

            //make sure parent directory has been created and is available
            fileSystem.root.getDirectory(fileSystem.root.fullPath + 'gpx', {create: true, exclusive: false}, function() {

                //get desintation file handle for write access
                fileSystem.root.getFile(fileSystem.root.fullPath + "gpx/incoming", {create: true, exclusive: false}, 
                    function gotFileEntry(fileEntry) {

                        var destinationPath = 'cdvfile://localhost/persistent/gpx/incoming'.replace("incoming","");//fileEntry.fullPath.replace("incoming","");
                        destinationPath += utility.removeSpaces(excursionName) + '.gpx'; 

                        //download remote file to local file handle
                        fileTransfer.download(
                            gpxUrl,
                            destinationPath,
                            function(theFile) {
                                alert("download complete!");
                            },
                            function(error) {
                                alert("download error source " + error.source);
                                alert("download error target " + error.target);
                                alert("download error code: " + error.code);
                            }
                        ); 
 
                    }.bind(this)
                , this.fileSystemFail);

            }, this.fileSystemFail);

        }

    },

    writeToFile: function() {
        
        console.log('writeToFile');
        var fileName = utility.removeSpaces((new Date()).toString()) + '.txt';

        var fileSystem = ServiceStore.getService('fileSystem');
        if (fileSystem) {
            fileSystem.root.getFile(fileSystem.root.fullPath + fileName, {create: true, exclusive: false}, function gotFileEntry(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    writer.write('taylor was here');
                    writer.onwriteend = function(evt) {
                        Actions.triggerServiceEvent({
                            name: 'fileSystem',
                            event: 'update'
                        });
                    };
                }, this.fileSystemFail);
            }, this.fileSystemFail);
            this.dismissDialog();
        } else alert('File System not loaded.');

    },

    fileSystemFail: function(evt) { 
        alert('filesystem error:');
        alert(evt);
    },

    render: function() {

        console.log('NewDialog render');

        //Custom Actions
        var customActions = [
          <FlatButton
            key="cancel"
            label="Cancel"
            secondary={true}
            onTouchTap={this.dismissDialog} />,
          <FlatButton
            key="create"
            label="Create"
            primary={true}
            onTouchTap={this.createExcursion} /> 
        ];

        //styles
        var style = {
            containerDiv: {
                textAlign: 'center',
                maxWidth: 400
            }
        }
 
        return (
            <Dialog ref="dialog" title="Dialog With Scrollable Content" actions={customActions} autoDetectWindowHeight={true} autoScrollBodyContent={true}>
                <div style={style.containerDiv}>

                    <TextField
                        ref="excursionName"
                        hintText="Excursion Name"
                        floatingLabelText="Excursion Name" />

                    <TextField
                        ref="gpxFileUrl"
                        hintText="GPX File URL"
                        floatingLabelText="GPX File URL" />

                </div>
            </Dialog>
        );

    }
});

module.exports = NewDialog;