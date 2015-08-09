var React = require("react");

var ServiceStore = require('../stores/ServiceStore');
var Actions     = require('../actions');

var mui = require('material-ui'); 
var Dialog = mui.Dialog;
var FlatButton = mui.FlatButton;
var TextField = mui.TextField; 

var NewDialog = React.createClass({
      
  	getInitialState: function() {

  		return {

  		};

  	},

    componentDidMount: function() {
        console.log('NewDialog mount');
  	},

    downloadGpxFile: function(event) {
        console.log('downloadGpxFile');

        this.props.fileSystem.root.getFile("dummy.html", {create: true, exclusive: false}, 
        function gotFileEntry(fileEntry) {
            var sPath = fileEntry.fullPath.replace("dummy.html","");
            var fileTransfer = new FileTransfer();
            fileEntry.remove();

            fileTransfer.download(
                "http://www.w3.org/2011/web-apps-ws/papers/Nitobi.pdf",
                sPath + "theFile.pdf",
                function(theFile) {
                    alert("download complete: " + theFile.toURI());
                    showLink(theFile.toURI());
                },
                function(error) {
                    alert("download error source " + error.source);
                    alert("download error target " + error.target);
                    alert("upload error code: " + error.code);
                }
            );
        }, this.fileSystemFail);
    },

    dismissDialog: function() {
        this.refs.dialog.dismiss();
    },

    writeToFile: function() {
        
        console.log('writeToFile');
        var fileName = (new Date()).toString().replace(/ /g,'').replace(new RegExp(":", "g"),'') + '.txt';

        //alert(fileName);
        //alert(cordova.file.applicationDirectory);

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
            onTouchTap={this.writeToFile} /> 
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
                        hintText="Excursion Name"
                        floatingLabelText="Excursion Name" />

                    <TextField
                        hintText="GPX File URL"
                        floatingLabelText="GPX File URL" />

                </div>
            </Dialog>
        );

    }
});

module.exports = NewDialog;