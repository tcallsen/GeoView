/** @jsx React.DOM */

var React = require("react");
var Map     = require("./components/Map");
var LeftNav   = require("./components/leftNav");
var localForage = require('localforage');

var mui = require('material-ui'); 
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
var ThemeManager = new mui.Styles.ThemeManager();
var AppBar = mui.AppBar;

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

	childContextTypes: {
		muiTheme: React.PropTypes.object
	},

	// Important!
	getChildContext: function() { 
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	},

	storeFileSystemRef: function(fileSystem) {
		
		//generate Excusion list based on available files


		this.setState({
			fileSystem: fileSystem
		});


	},

	errorAccessingFileSystem: function(evt) {
		console.log(evt);
		//alert(evt.target.error.code);
	},

	toggleLeftNav: function(event, value) {
		this.refs.leftNav.toggleLeftNav();
	},

	hangleLeftNavEvent: function(e, selectedIndex, menuItem) {
		menuItem.action();
	},

	toggleNewDialog: function() {
		this.refs.newDialog.refs.dialog.show();
	},

    render: function() {

        return (
            <div id="GeoView"> 
              	<LeftNav
              		ref="leftNav"
              		fileSystem= {this.state.fileSystem} />
              	<AppBar
				  	title="GeoView"
				  	iconClassNameRight="muidocs-icon-navigation-expand-more"
				  	onLeftIconButtonTouchTap={this.toggleLeftNav} /> 
			  	<Map fileSystem= {this.state.fileSystem} /> 
            </div>
        );
    }
});

GeoView.childContextTypes = {
	muiTheme: React.PropTypes.object
};

module.exports = GeoView;