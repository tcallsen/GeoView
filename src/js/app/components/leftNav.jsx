/** @jsx React.DOM */

var React = require("react");
var Reflux      = require('reflux');
var ServiceStore = require('../stores/ServiceStore');
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
		if (serviceEvent.name === 'fileSystem') {
			this.loadAvailableExcursions(serviceEvent.service);
		}

	},

	loadAvailableExcursions: function(fileSystem) {

		console.log('loadAvailableExcursions');

		var fileService = ServiceStore.getService('file');
		fileService.getDirectoryEntries("/exc/").then(function(directoryEntries) {

			var excursionEntries = directoryEntries.filter(function(entry) {
				return utility.endsWith(entry.fullPath, '.exc');
			});

			var excursionsMenuItems = [];

			excursionEntries.forEach( (entry,index) => {
				if (entry.isDirectory) return;
				
				excursionsMenuItems.push({
					key: 'excursion_' + index,
					text: entry.name,
					action: this.loadExcursion.bind(this, entry)
				});

			});

			this.setState({
				excursionsMenuItems: excursionsMenuItems
			});

		}.bind(this));

	},

	errorAccessingFileSystem: function(evt) {
		console.log(evt);
	},

	loadExcursion: function(menuEntry) {

		var excursionService = ServiceStore.getService('excursion');
		var fileService = ServiceStore.getService('file');
		
		fileService.read(menuEntry.fullPath).then(function(jsonBlob) {

			excursionService.loadFromJsonBlob(jsonBlob);

		});


	},

	deleteExcursion: function(menuEntry) {

		var fileSystem = ServiceStore.getService('fileSystem');
        if (fileSystem) {

			fileSystem.root.getFile(menuEntry.fullPath, null, function(fileEntry) {

				fileEntry.remove(function(){
					Actions.triggerServiceEvent({
                        name: 'fileSystem',
                        event: 'update'
                    });
				}, this.errorAccessingFileSystem);

			}, this.errorAccessingFileSystem)

		} else alert('File System not loaded.');

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