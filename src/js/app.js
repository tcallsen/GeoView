
var React = require("react");
var GeoView = require("app/GeoView");

var app = {

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {

        var mountNode = document.getElementById('reactAppContainer');

        React.renderComponent(GeoView(), mountNode);

        console.log("React should now be loaded now");
    }

};

app.initialize();

