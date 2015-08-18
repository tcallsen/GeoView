/** @jsx React.DOM */

var React = require("react");
var Reflux      = require('reflux');
var ServiceStore = require('../stores/ServiceStore');
var Actions = require('../actions');

var utility = require('../utility');

var AddGpxDialog   = require("./addGpxDialog");

var mui = require('material-ui'); 
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var FontIcon = mui.FontIcon;
var ToolbarSeparator = mui.ToolbarSeparator;
var Toggle = mui.Toggle;
var IconMenu = mui.IconMenu;
var MenuItem = require('material-ui/lib/menus/menu-item');
var MenuDivider = require('material-ui/lib/menus/menu-divider');

var ExcursionToolbar = React.createClass({

	mixins: [Reflux.listenToMany({
        handleServiceEvent: ServiceStore
    })],
    
	getInitialState: function() {
		
		//retrieve initial list of GPX files
		var excursionService = ServiceStore.getService('excursion').getCurrent();

		return {
			excursionGpxList: excursionService.getGpxList()
		};

	},

	handleServiceEvent: function(serviceEvent) {

		if (serviceEvent.name === 'excursion' && serviceEvent.event === 'update') {
			this.setState({
				excursionGpxList: serviceEvent.service.getGpxList()
			});
		}

	},

	toggleGpxVisibility: function(guid) {
		var excursionService = ServiceStore.getService('excursion').getCurrent();
		excursionService.toggleGpxVisibility(guid);
	},

	toggleAddGpxFileDialog: function() {
		this.refs.addGpxDialog.refs.dialog.show();
	},

	saveExcursion: function() {

		var fileService = ServiceStore.getService('file');
		var excursionService = ServiceStore.getService('excursion').getCurrent();
		
		var jsonBlob = excursionService.toJsonBlob();

		fileService.write('/exc/' + utility.removeSpaces(excursionService.name) + '.exc', jsonBlob).then(function() {

			alert('Save complete');

			Actions.triggerServiceEvent({
                name: 'fileSystem',
                event: 'update'
            });

		});
		
	},

    render: function() {

    	//build gpx tracks menu
		var gpxMenuIcon = (<FontIcon className="material-icons">swap_calls</FontIcon>);
    	
		var gpxMenuItemsList = [];
		this.state.excursionGpxList.map( (gpx, index) => {
			gpxMenuItemsList.push(
				<MenuItem 
					key={'gpx_'+index}
					primaryText={gpx.name} 
					checked={gpx.visible}
					onClick={this.toggleGpxVisibility.bind(this, gpx.guid)} />
			);
		});

		var gpxMenu = (
			<div>
				{ gpxMenuItemsList }
				<MenuDivider />
			</div>
		)

    	var gpxTracksMenu = (
    		<IconMenu iconButtonElement={gpxMenuIcon} openDirection='top-left'>
		      { gpxMenu }
		      <MenuItem primaryText="Add GPX File.." onClick={this.toggleAddGpxFileDialog} />
		    </IconMenu>
	    );

        return (
            <div>
	            <Toolbar>

					<ToolbarGroup key={1} float="right">
						
						<FontIcon className="material-icons">center_focus_strong</FontIcon>
						<FontIcon className="material-icons">gps_not_fixed</FontIcon>
						<FontIcon className="material-icons" onClick={this.saveExcursion}>save</FontIcon>
						
						<ToolbarSeparator />

						{ gpxTracksMenu }

					</ToolbarGroup>

				</Toolbar>
				<AddGpxDialog 
					ref="addGpxDialog" />
			</div>
        );
    }
});

module.exports = ExcursionToolbar;
