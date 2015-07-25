var React = require("react");
var ol = require('openlayers');

var Map = React.createClass({
      
	getInitialState: function() {

		return {
			map: null,
			vectorLayer: null,
			watchID: null
		};

	},

	componentDidMount: function() {
      	
		var vectorLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
              features: []
            }),
          style: function(feature, resolution) {
            return [new ol.style.Style({
                image: new ol.style.Circle({
                  fill: new ol.style.Fill({
                    color: 'rgba(56, 169, 217,.4)'
                  }),
                  radius: 10,
                  stroke: new ol.style.Stroke({
                    color: 'rgba(56, 169, 217,1)',
                    width: 1
                  })
                })
              })];
          }
        });

        var watchID = navigator.geolocation.watchPosition(
            function onSuccess(position) {
                
                this.state.vectorLayer.setSource(
                    new ol.source.Vector({
                        features: [
                            new ol.Feature({
                                geometry: new ol.geom.Point(ol.proj.transform( [position.coords.longitude,position.coords.latitude] , 'EPSG:4326', 'EPSG:3857'))
                            })
                        ]
                    })
                );

                this.state.map.getView().setCenter(ol.proj.transform( [position.coords.longitude,position.coords.latitude] , 'EPSG:4326', 'EPSG:3857'));

            }.bind(this),

            // onError Callback receives a PositionError object
            //
            function onError(error) {
                console.log('error dawg');
            }.bind(this)
        );

        var style = {
          'Point': [new ol.style.Style({
            image: new ol.style.Circle({
              fill: new ol.style.Fill({
                color: 'rgba(255,255,0,0.4)'
              }),
              radius: 5,
              stroke: new ol.style.Stroke({
                color: '#ff0',
                width: 1
              })
            })
          })],
          'LineString': [new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#f00',
              width: 3
            })
          })],
          'MultiLineString': [new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#0f0',
              width: 3
            })
          })]
        };
 
        var map = new ol.Map({
          layers: [
              
              /*
              new ol.layer.Tile({
                source: new ol.source.TileWMS( ({
                    url: 'http://ows.terrestris.de/osm/service/',
                    params: {
                        'LAYERS': 'OSM-WMS',
                        'FORMAT': 'image/jpeg',
                        'REQUEST': 'GetMap',
                        'SERVICE': 'WMS',
                        'CRS': null,
                        'SRS': 'EPSG:4326',
                        'STYLES': '',
                        'VERSION': '1.1.1',
                        'TRANSPARENT': 'false',
                        'HEIGHT': 256,
                        'WIDTH': 256
                    },
                    ServerType: 'mapserver'
                })),
            visible: true
          }),
          */

          new ol.layer.Tile({
            source: new ol.source.Stamen({
              layer: 'terrain'
            })
          }),
          new ol.layer.Tile({
            source: new ol.source.Stamen({
              layer: 'terrain-labels'
            })
          })

          , vectorLayer 
          ],
          target: 'map',
          view: new ol.View({
            center: ol.proj.transform( [-89.4000,43.0667], 'EPSG:4326', 'EPSG:3857'),
            zoom: 13,
            maxZoom: 18,
            minZoom: 4,
            projection: 'EPSG:3857'
          })
        });

	    this.setState({
	    	map: map,
	    	vectorLayer: vectorLayer,
	    	watchID: watchID
	    });

  	},

      render: function() {
        
      	var style = {
      		height: '100%',
      		width: '100%'
      	};

        return (
            <div id="map" style={style}> </div>
        );
      }
});

module.exports = Map;