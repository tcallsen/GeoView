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
			menuItems: [
				{ text: 'New Excursion', action: this.toggleNewDialog },
				{ route: 'customization', text: 'Customization' },
				{ route: 'components', text: 'Components' },
				{ type: MenuItem.Types.SUBHEADER, text: 'Available Excursions' },
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
				}
			]
		};
	},

	errorAccessingFileSystem: function(evt) {
		console.log(evt);
		//alert(evt.target.error.code);
	},

	toggleLeftNav: function(event, value) {
		this.refs.muiLeftNav.toggle();
	},

	hangleLeftNavEvent: function(e, selectedIndex, menuItem) {
		menuItem.action();
	},

	toggleNewDialog: function() {
		console.log(this.refs);
		this.refs.newDialog.refs.dialog.show();
	},

    render: function() {
        return (
            <div>
	            <MuiLeftNav 
	            	ref="muiLeftNav" 
	          		docked={false} 
	          		menuItems={this.state.menuItems} 
	          		onChange={this.hangleLeftNavEvent} />
	      		<NewDialog 
					ref="newDialog" 
					fileSystem= {this.props.fileSystem} />
			</div>
        );
    }
});

module.exports = LeftNav;