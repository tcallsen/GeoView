/** @jsx React.DOM */

var React = require("react");
var Map     = require("./components/Map");
var localForage = require('localforage');

var GeoView = React.createClass({
    
	getInitialState: function() {
		return {
			fileSystem: null
		};
	},

	componentDidMount: function() {
		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.storeFileSystemRef, this.errorAccessingFileSystem);

		/*
		localForage.clear(function(err) {
			console.log('localForage cleared..');
		}); */

		/* window.addEventListener('filePluginIsReady', function(){ 
			console.log('filePluginIsReady');		
		}, false); */
	},

	storeFileSystemRef: function(fileSystem) {
		this.setState({
			fileSystem: fileSystem
		});
	},

	errorAccessingFileSystem: function(evt) {
		console.log(evt);
		//alert(evt.target.error.code);
	},

    render: function() {
        return (
            <div id="GeoView"> 
              <Map 
              	fileSystem = { this.state.fileSystem } /> 
            </div>
        );
    }
});

module.exports = GeoView;