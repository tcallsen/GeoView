/** @jsx React.DOM */

var React = require("react");
var Reflux      = require('reflux');
var ServiceStore = require('../stores/ServiceStore');
var ExcursionStore = require('../stores/ExcursionStore');
var Excursion = require('../objects/Excursion');
var Actions = require('../actions');

var utility = require('../utility');

var ExcursionLoadDialog = require('./excursionLoadDialog');

var mui = require('material-ui'); 
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var FontIcon = mui.FontIcon;
var ToolbarSeparator = mui.ToolbarSeparator;
var Toggle = mui.Toggle;
var IconMenu = mui.IconMenu;
var MenuItem = require('material-ui/lib/menus/menu-item');
var MenuDivider = require('material-ui/lib/menus/menu-divider');

var ActionToolbar = React.createClass({

	mixins: [Reflux.listenToMany({
        handleServiceEvent: ServiceStore
    })],
    
	getInitialState: function() {
		
		return { 
			gpsTrackingEnabled: false,
			displayExcursionLoadDialog: false
		};

	},

	handleServiceEvent: function(serviceEvent) {

		if (serviceEvent.name === 'location' && serviceEvent.event === 'update' && this.state.gpsTrackingEnabled != serviceEvent.payload.enabled) {
			this.setState({
				gpsTrackingEnabled: serviceEvent.payload.enabled
			});
		}

    },

	// gps and elevation icons

	toggleLocation: function() {
		ServiceStore.getService('location').toggle();
	},

	//excursion context menu actions

	onItemTouchTap: function(event, item) {
		console.log('onItemTouchTap', event, item);
	},

	closeExcursion: function() {
        ExcursionStore.closeCurrent();
	},

	toggleExcursionLoadDialog: function() {
		if (this.state.displayExcursionLoadDialog) this.refs.excursionLoadDialog.refs.dialog.dismiss();
		this.setState({
			displayExcursionLoadDialog: !this.state.displayExcursionLoadDialog
		});
	},
	
	//excursion selection menu

    render: function() {

    	console.log('ActionToolbar render');

    	var style = {
    		excursionTitle: {
    			width: (this.refs.titleSizeAnchor) ? this.refs.titleSizeAnchor.getDOMNode().getBoundingClientRect().left - 40 : 0,
    			//float: 'left'
    		}
    	};

    	
    	// CONTEXT MENU - save open delete

    	var contextMenuIcon = (<FontIcon className="material-icons">more_vert</FontIcon>);
    	var contextMenuItemsList = [
			<MenuItem 
				key={'context_0'}
				primaryText="Open"
				leftIcon={<FontIcon className="material-icons">folder open</FontIcon>}
				onClick={this.toggleExcursionLoadDialog} />,
			<MenuItem 
				key={'context_1'}
				primaryText="Delete"
				leftIcon={<FontIcon className="material-icons">delete</FontIcon>}
				onClick={Excursion.prototype.remove.bind(this.props.excursion)} />,
			<MenuItem 
				key={'context_2'}
				primaryText="Close"
				leftIcon={<FontIcon className="material-icons">close</FontIcon>}
				onClick={this.closeExcursion} />
    	];

    	var contextMenu = (
			<div>
				{ contextMenuItemsList }
			</div>
		);

        return (
            <div>
	            <Toolbar>

					<ToolbarGroup key={1} float="right">

						<h4 className="excursionTitle" onClick={this.props.toggleExcusionPullout} style={ style.excursionTitle }>{ (this.props.excursion) ? this.props.excursion.name : "New Excursion" }</h4>

						<div className="toolbarIconMenu" ref="titleSizeAnchor" style={{float:"left"}}>
				    		<IconMenu iconButtonElement={contextMenuIcon} openDirection='top-left' onItemTouchTap={this.onItemTouchTap}>
								{ contextMenu }
						    </IconMenu>
					    </div>

						<ToolbarSeparator />

						<FontIcon className="material-icons" onClick={this.toggleLocation}>{ (this.state.gpsTrackingEnabled) ? 'gps_fixed' : 'gps_not_fixed' }</FontIcon>
						
						<FontIcon className="material-icons" onClick={this.props.toggleElevationSnackbar}>{ 'trending_up' }</FontIcon>

					</ToolbarGroup>

				</Toolbar>

				{ (this.state.displayExcursionLoadDialog) ?
					<ExcursionLoadDialog 
						ref="excursionLoadDialog"
						toggleExcursionLoadDialog={this.toggleExcursionLoadDialog} /> :
					null }

			</div>

        );
    }
});

module.exports = ActionToolbar;
