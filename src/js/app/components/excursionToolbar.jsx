/** @jsx React.DOM */

var React = require("react");
var Reflux      = require('reflux');
var ServiceStore = require('../stores/ServiceStore');
var Actions = require('../actions');

var NewDialog   = require("./newDialog");

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

	toggleGpxVisibility: function(event, item) {
		
		var excursionService = ServiceStore.getService('excursion').getCurrent();
		excursionService.toggleGpxVisibility(this.state.excursionGpxList[0].guid);

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
					value={gpx.guid} />
			);
		});

		var gpxMenu = (
			<div>
				{ gpxMenuItemsList }
				<MenuDivider />
			</div>
		)

    	var gpxTracksMenu = (
    		<IconMenu iconButtonElement={gpxMenuIcon} onItemTouchTap={this.toggleGpxVisibility} openDirection='top-left'>
		      { gpxMenu }
		      <MenuItem primaryText="Add GPX File.." />
		    </IconMenu>
	    );

        return (
            <Toolbar>

				<ToolbarGroup key={1} float="right">
					<FontIcon className="material-icons">center_focus_strong</FontIcon>
					<FontIcon className="material-icons">gps_not_fixed</FontIcon>
					<ToolbarSeparator />

					{ gpxTracksMenu }

				</ToolbarGroup>

			</Toolbar>
        );
    }
});

module.exports = ExcursionToolbar;