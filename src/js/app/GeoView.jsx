/** @jsx React.DOM */

var React = require("react");
var Map     = require("./components/Map");
var localForage = require('localforage');

var mui = require('material-ui'); 
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var ThemeManager = new mui.Styles.ThemeManager();

var AppBar = mui.AppBar;
var LeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;

var GeoView = React.createClass({
    
	getInitialState: function() {
		return {
			fileSystem: null,
			menuItems: [
			  { route: 'get-started', text: 'Get Started' },
			  { route: 'customization', text: 'Customization' },
			  { route: 'components', text: 'Components' },
			  { type: MenuItem.Types.SUBHEADER, text: 'Resources' },
			  { 
			     type: MenuItem.Types.LINK, 
			     payload: 'https://github.com/callemall/material-ui', 
			     text: 'GitHub' 
			  },
			  { 
			     text: 'Disabled', 
			     disabled: true 
			  },
			  { 
			     type: MenuItem.Types.LINK, 
			     payload: 'https://www.google.com', 
			     text: 'Disabled Link', 
			     disabled: true 
			  },
			]
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
		this.setState({
			fileSystem: fileSystem
		});
	},

	errorAccessingFileSystem: function(evt) {
		console.log(evt);
		//alert(evt.target.error.code);
	},

	toggleLeftNav: function(event, value) {
		this.refs.leftNav.toggle();
	},

    render: function() {
        
        //enable react 0.13 ...
        var fileSystem = this.state.fileSystem;
    	var map = React.createElement(Map, { fileSystem : fileSystem });

        return (
            <div id="GeoView"> 
              	<LeftNav ref="leftNav" docked={false} menuItems={this.state.menuItems} />
              	<AppBar
				  title="GeoView"
				  iconClassNameRight="muidocs-icon-navigation-expand-more"
				  onLeftIconButtonTouchTap={this.toggleLeftNav} /> 
			  	<Map
			  		fileSystem= {this.props.fileSystem} /> 
            </div>
        );
    }
});

GeoView.childContextTypes = {
	muiTheme: React.PropTypes.object
};

module.exports = GeoView;