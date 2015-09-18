/** @jsx React.DOM */

var React = require("react");
var Reflux      = require('reflux');
var ServiceStore = require('../stores/ServiceStore');
var ExcursionStore = require('../stores/ExcursionStore');
var Actions = require('../actions');

var NewDialog   = require("./newDialog");

var mui = require('material-ui'); 
var AppBar = mui.AppBar;
var MuiLeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;

var utility = require('../utility');

var LeftNav = React.createClass({

	mixins: [Reflux.listenToMany({
        handleServiceEvent: ServiceStore
    })],
    
	getInitialState: function() {
		return {
			staticMenuItems: [
				{ text: 'New Excursion', action: this.toggleNewDialog },
				/* { route: 'customization', text: 'Customization' },
				{ route: 'components', text: 'Components' }, */
				{ type: MenuItem.Types.SUBHEADER, text: 'Available Excursions' },
				/* { 
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
				} */
			],
			excursionsMenuItems: [] 
		};
	},

	handleServiceEvent: function(serviceEvent) {

		//detect if filesystem update - if so reload excursions and gpx files
		//if (serviceEvent.name === 'fileSystem') {
		//	this.loadAvailableExcursions(serviceEvent.service);
		//}

	},

	errorAccessingFileSystem: function(evt) {
		console.log(evt);
	},



	toggleLeftNav: function(event, value) {
		this.refs.muiLeftNav.toggle();
	},

	handleLeftNavEvent: function(e, selectedIndex, menuItem) {
		console.log('handleLeftNavEvent', menuItem);
		menuItem.action();
	},

	toggleNewDialog: function() {
		this.refs.newDialog.refs.dialog.show();
	},

    render: function() {
       
    	console.log('LeftNav render');

    	//concatenates the excursionMenuItems (dynamic) with the staticMenuItmes
        var concatenatedMenuItems = this.state.staticMenuItems.concat(this.state.excursionsMenuItems);

        return (
            <div>
	            <MuiLeftNav 
	            	ref="muiLeftNav" 
	          		docked={false} 
	          		disableSwipeToOpen={true}
	          		menuItems={concatenatedMenuItems} 
	          		onChange={this.handleLeftNavEvent} />
	      		<NewDialog 
					ref="newDialog" />
			</div>
        );
    }
});

module.exports = LeftNav;