/** @jsx React.DOM */

var React = require("react");
var localForage = require('localforage');
var Reflux = require("reflux");

var Map     = require("./components/Map");
var LeftNav   = require("./components/leftNav");
var ExcursionToolbar  = require("./components/excursionToolbar");
var ElevationSnackbar  = require("./components/elevationSnackbar");

var ServiceStore = require('./stores/ServiceStore');
var ExcursionStore = require('./stores/ExcursionStore');
var Actions = require('./actions');
 
var FileService = require('./services/FileService');
var LocationService = require('./services/LocationService');

var mui = require('material-ui'); 
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
var ThemeManager = new mui.Styles.ThemeManager();
var AppBar = mui.AppBar;
var Snackbar = mui.Snackbar; 

var GeoView = React.createClass({
    
	mixins: [Reflux.listenToMany({
        handleServiceEvent: ServiceStore,
        handleExcursionUpdate: ExcursionStore
    })],

	getInitialState: function() {
		return {
			excursion: false
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

		// LOCATION SERVICE
		Actions.registerService({
			name: 'location',
			service: new LocationService()
		});

		/*
		// FILE TRANSFER & other services passed in from parent app.js
		this.props.services.forEach( service => {
			Actions.registerService({
				name: service.name,
				service: service.service
			});
		}); */ 

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

	handleExcursionUpdate: function(args) {

        //detect if excursion update - update GeoView display accordingly
        if (args.event && args.current) {
        	this.setState({ excursion: args.current });
        } else if (args.event === 'unmount' || !args.current) {
        	this.setState({ excursion: null });
        }

    },

	errorAccessingFileSystem: function(evt) {
		console.log(evt);
		//alert(evt.target.error.code);
	},

	toggleLeftNav: function(event, value) {
		this.refs.leftNav.toggleLeftNav();
	},

	//forward event handler from excursionToolbar down into ElevationSnackbar component
	toggleElevationSnackbar: function() {
		this.refs.elevationSnackbar.toggleDisplay();
	},

    render: function() {

    	var style = {
      		mapContainer: {
	      		height: (this.state.excursion) ? 'calc(100% - 120px)' : 'calc(100% - 64px)' ,
	      		width: '100%'
	    	}
    	};

    	var excursionToolbar = (this.state.excursion) ?
    		( <ExcursionToolbar 
    			excursion={this.state.excursion}
    			toggleElevationSnackbar={this.toggleElevationSnackbar} /> )
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
		  		<ElevationSnackbar ref="elevationSnackbar" />
		  		{ excursionToolbar }
            </div>
        );
    }
});

GeoView.childContextTypes = {
	muiTheme: React.PropTypes.object
};

module.exports = GeoView;