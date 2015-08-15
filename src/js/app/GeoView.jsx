/** @jsx React.DOM */

var React = require("react");
var localForage = require('localforage');

var Map     = require("./components/Map");
var LeftNav   = require("./components/leftNav");

var ServiceStore = require('./stores/ServiceStore');
var Actions = require('./actions');
 
var ExcursionService = require('./services/ExcursionService');
var FileService = require('./services/FileService');

var mui = require('material-ui'); 
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
var ThemeManager = new mui.Styles.ThemeManager();
var AppBar = mui.AppBar;

var GeoView = React.createClass({
    
	getInitialState: function() {
		return {
			
		};
	},

	componentDidMount: function() {
		
		// REGISTER SERVICES with ServiceStore

		// FILESYSTEM
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
			Actions.registerService({
				name: 'fileSystem',
				service: fileSystem
			});
		}, this.errorAccessingFileSystem);

		/*	PROMISE LIBRARY
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
			
			var promiseFileSystem = CordovaPromiseFS({
				persistent: true, // or false
				storageSize: 20*1024*1024, // storage size in bytes, default 20MB 
				concurrency: 3, // how many concurrent uploads/downloads?
				Promise: require('bluebird') // Your favorite Promise/A+ library! 
			});

			Actions.registerService({
				name: 'fileSystem',
				service: promiseFileSystem
			});
		}, this.errorAccessingFileSystem); */

		// FILE SERVICE
		Actions.registerService({
			name: 'file',
			service: FileService
		});


		// FILE TRANSFER & other services passed in from parent app.js
		this.props.services.forEach( service => {
			Actions.registerService({
				name: service.name,
				service: service.service
			});
		});

		// EXCURSION
		Actions.registerService({
			name: 'excursion',
			service: ExcursionService
		});

		/*
		localForage.clear(function(err) {
			console.log('localForage cleared..');
		}); */

		
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object
	},

	// Important!
	getChildContext: function() { 
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	},

	errorAccessingFileSystem: function(evt) {
		console.log(evt);
		//alert(evt.target.error.code);
	},

	toggleLeftNav: function(event, value) {
		this.refs.leftNav.toggleLeftNav();
	},

    render: function() {

        return (
            <div id="GeoView"> 
              	<LeftNav
              		ref="leftNav" />
              	<AppBar
				  	title="GeoView"
				  	iconClassNameRight="muidocs-icon-navigation-expand-more"
				  	onLeftIconButtonTouchTap={this.toggleLeftNav} /> 
			  	<Map /> 
            </div>
        );
    }
});

GeoView.childContextTypes = {
	muiTheme: React.PropTypes.object
};

module.exports = GeoView;