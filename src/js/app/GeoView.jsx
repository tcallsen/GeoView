/** @jsx React.DOM */

var React = require("react");
var localForage = require('localforage');
var Reflux = require("reflux");

var Map     = require("./components/Map");
var LeftNav   = require("./components/leftNav");
var ExcursionToolbar  = require("./components/excursionToolbar");

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
    
	mixins: [Reflux.listenToMany({
        handleServiceEvent: ServiceStore
    })],

	getInitialState: function() {
		return {
			viewingExcursion: false
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

	handleServiceEvent: function(serviceEvent) {

        //detect if excursion update - update GeoView display accordingly
        if (serviceEvent.name === 'excursion' && serviceEvent.event === 'update' && serviceEvent.service) {
        	this.setState({ viewingExcursion: true });
        } else if (serviceEvent.name === 'excursion' && serviceEvent.event === 'update' && typeof serviceEvent.service === 'undefined') {
        	this.setState({ viewingExcursion: false });
        }

    },

	errorAccessingFileSystem: function(evt) {
		console.log(evt);
		//alert(evt.target.error.code);
	},

	toggleLeftNav: function(event, value) {
		this.refs.leftNav.toggleLeftNav();
	},

    render: function() {

    	var style = {
      		mapContainer: {
	      		height: (this.state.viewingExcursion) ? 'calc(100% - 120px)' : 'calc(100% - 64px)' ,
	      		width: '100%'
	    	}
    	};

    	var excursionToolbar = (this.state.viewingExcursion) ?
    		( <ExcursionToolbar /> )
    		: null ;

        return (
            <div id="GeoView"> 
              	<LeftNav
              		ref="leftNav" />
              	<AppBar
				  	title="GeoView"
				  	iconClassNameRight="muidocs-icon-navigation-expand-more"
				  	onLeftIconButtonTouchTap={this.toggleLeftNav} /> 
			  	<div id='mapContainer' style={ style.mapContainer }>
			  		<Map /> 
		  		</div>
		  		{ excursionToolbar }
            </div>
        );
    }
});

GeoView.childContextTypes = {
	muiTheme: React.PropTypes.object
};

module.exports = GeoView;