/** @jsx React.DOM */

var React = require("react");
var Map     = require("./components/Map")

var GeoView = React.createClass({
      render: function() {
        return (
            <div id="GeoView"> 
              <Map /> 
            </div>
        );
      }
});

module.exports = GeoView;