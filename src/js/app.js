
var React = require("react");
var GeoView = require("app/GeoView");
var localForage = require('localforage');

var app = {

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
    	
    	/*
    	localForage.config({
		    driver      : localForage.WEBSQL, // Force WebSQL; same as using setDriver()
		    name        : 'myApp',
		    version     : 1.0,
		    size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
		    storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
		    description : 'some description'
		}); */

		var key = 'STORE_KEY';
	      var value = 'some shit from offline';
	      var r = document.getElementById('results')
	      localForage.setItem(key, value, function() {
	        console.log('Saved: ' + value);
	        localForage.getItem(key, function(err, readValue) {
	            alert('Read: : ' + readValue);
	        });
	      });

        var mountNode = document.getElementById('reactAppContainer');

        React.renderComponent(GeoView(), mountNode);

        console.log("React should now be loaded now");

    }

};

app.initialize();

