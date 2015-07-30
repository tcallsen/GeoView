var React = require("react");

var mui = require('material-ui'); 
var Dialog = mui.Dialog;
var FlatButton = mui.FlatButton; 

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
        var fileName = (new Date()).toString().replace(/ /g,'') + '.txt';

        this.props.fileSystem.root.getFile(fileName, {create: true, exclusive: false}, function gotFileEntry(fileEntry) {
            fileEntry.createWriter(function(writer) {
                writer.write('taylor was here');
                writer.onwriteend = function(evt) {
                    console.log('wrote to file ' + fileName + ' length ' + writer.position);
                };
            }.bind(this), this.fileSystemFail);
        }.bind(this), this.fileSystemFail);
        this.dismissDialog();

    },

    fileSystemFail: function(evt) { 
        console.log('filesystem error:');
        console.log(evt);
    },

    render: function() {

        //Custom Actions
        var customActions = [
          <FlatButton
            label="Cancel"
            secondary={true}
            onTouchTap={this.dismissDialog} />,
          <FlatButton
            label="Save"
            primary={true}
            onTouchTap={this.writeToFile} />
        ];
 
        return (
            <Dialog ref="dialog" title="Dialog With Scrollable Content" actions={customActions}
              autoDetectWindowHeight={true} autoScrollBodyContent={true}>
                <div style={{height: '2000px'}}>Really long content</div>
            </Dialog>
        );

    }
});

module.exports = NewDialog;