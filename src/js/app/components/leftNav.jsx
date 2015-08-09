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

	componentWillReceiveProps: function(nextProps) {
		
		//when filesystem reference is passed in from parent props -> load available excursions
		//if (nextProps && nextProps.fileSystem && nextProps.fileSystem.root) this.loadAvailableExcursions(nextProps.fileSystem);

	},

	handleServiceEvent: function(serviceEvent) {

		//detect if filesystem update - if so reload excursions and gpx files
		if (serviceEvent.name === 'fileSystem') {
			this.loadAvailableExcursions(serviceEvent.service);
			//this.loadAvailableGpxFiles(serviceEvent.service);
		}

	},

	loadAvailableExcursions: function(fileSystem) {

		console.log('loadAvailableExcursions');

		var directoryReader = fileSystem.root.createReader();

		var excursionsMenuItems = [];
		directoryReader.readEntries(function(entries) {
			
			entries.forEach( (entry,index) => {
				
				if (entry.isDirectory) return;

				excursionsMenuItems.push({
					key: 'excursion_' + index,
					text: entry.name,
					action: this.deleteExcursion.bind(this, entry),
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
	          		onChange={this.handleLeftNavEvent} />
	      		<NewDialog 
					ref="newDialog" />
			</div>
        );
    }
});

module.exports = LeftNav;