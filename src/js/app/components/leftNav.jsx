/** @jsx React.DOM */

var React = require("react");

var NewDialog   = require("./newDialog");

var mui = require('material-ui'); 
var AppBar = mui.AppBar;
var MuiLeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;

var LeftNav = React.createClass({
    
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

	componentWillReceiveProps: function(nextProps) {
		
		//when filesystem reference is passed in from parent props -> load available excursions
		if (nextProps && nextProps.fileSystem && nextProps.fileSystem.root) this.loadAvailableExcursions(nextProps.fileSystem);

	},

	loadAvailableExcursions: function(fileSystem) {

		console.log('loadAvailableExcursions');

		//retrieve fileSystem from function parameter (when called from componentWillRecieveProps on app boot) or from props
		var fileSystem = fileSystem || this.props.fileSystem;

		var directoryReader = fileSystem.root.createReader();

		var excursionsMenuItems = [];
		directoryReader.readEntries(function(entries) {
			
			entries.forEach( (entry,index) => {
				
				if (entry.isDirectory) return;

				excursionsMenuItems.push({
					key: 'excursion_' + index,
					text: entry.name,
					action: this.loadExcursion.bind(this, entry),
					/* style: {
						overflow: 'hidden'
					} */
				});

			});

			this.setState({
				excursionsMenuItems: excursionsMenuItems
			});

		}.bind(this), this.errorAccessingFileSystem);

	},

	errorAccessingFileSystem: function(evt) {
		console.log(evt);
	},

	loadExcursion: function(menuEntry) {
		alert(menuEntry.name);
	},

	toggleLeftNav: function(event, value) {
		this.refs.muiLeftNav.toggle();
	},

	hangleLeftNavEvent: function(e, selectedIndex, menuItem) {
		menuItem.action();
	},

	toggleNewDialog: function() {
		this.refs.newDialog.refs.dialog.show();
	},

	forceLeftNavUpdate: function() {
		
		this.loadAvailableExcursions();

		//this.forceUpdate();
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
	          		menuItems={concatenatedMenuItems} 
	          		onChange={this.hangleLeftNavEvent} />
	      		<NewDialog 
					ref="newDialog" 
					fileSystem= {this.props.fileSystem}
					forceLeftNavUpdate= {this.forceLeftNavUpdate} />
			</div>
        );
    }
});

module.exports = LeftNav;