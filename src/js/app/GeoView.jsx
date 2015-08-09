/** @jsx React.DOM */

var React = require("react");
var localForage = require('localforage');

var Map     = require("./components/Map");
var LeftNav   = require("./components/leftNav");

var ServiceStore = require('./stores/ServiceStore');
var Actions = require('./actions');

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
		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
			Actions.registerService({
				name: 'fileSystem',
				service: fileSystem
			});
		}, this.errorAccessingFileSystem);

		/* 
		localForage.clear(function(err) {
			console.log('localForage cleared..');
		}); */

		/* window.addEventListener('filePluginIsReady', function(){ 
			console.log('filePluginIsReady');		
		}, false); */
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