var React = require("react");
var ol = require('openlayers');
var blobUtil = require('blob-util');
var localForage = require('localforage');

var Map = React.createClass({
      
	getInitialState: function() {

		return {
			map: null,
			vectorLayer: null,
			watchID: null,
      readFromCache: false
		};

	},

	componentDidMount: function() {
      	
        this.initializeMap();

  	},

    initializeMap: function() {

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
 
        var terrainLayer = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'terrain',

                tileUrlFunction: function(tileCoord) {
                    console.log('tileUrlFunction');
                    console.log(tileCoord);
                },

                tileLoadFunction: function(imageTile, src) {
                    
                    var key = imageTile.getTileCoord().join('_');

                    var imgElement = imageTile.getImage();

                    //console.log('tileLoadFunction - ', key);


                    //DETERMINE CACHE MODE                    


                    //ONLY CACHE
                    if (this.state.readFromCache) {

                        console.log('only read from cache');

                        localForage.getItem(key, function(result) {
                            
                            //CHECK CACHE
                            if (result) {
                                
                                console.log('cache @ ' + key);

                                localForage.getItem(key, function(result) {
                                    console.log('reading cached item @ ' + key);
                                    imgElement.src = blobUtil.createObjectURL(blob);
                                });

                            }

                        });
                    }

                    //INET
                    else {

                        console.log('read from inet');

                        //imgElement.src = src;

                        blobUtil.imgSrcToBlob(src, 'image/png', 'Anonymous').then(function (blob) {
                            localForage.setItem(key, blob, function() {
                                console.log('cached item @ ' + key);
                                localForage.getItem(key, function(result) {
                                    console.log('reading cached item @ ' + key);
                                    imgElement.src = blobUtil.createObjectURL(blob);
                                });

                            });
                        // success
                        }).catch(function (err) {
                            console.log('failed to convert blob @ ' + key);
                        });

                    }

                }.bind(this)
            }),
        });

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

          /*
          new ol.layer.Tile({
            source: new ol.source.OSM({
              url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
            })
          })
          */

          terrainLayer
          
          /*
          new ol.layer.Tile({
            source: new ol.source.Stamen({
              layer: 'terrain-labels'
            })
          })
          */

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

      map.on('singleclick', this.toggleMapCacheMode.bind(this));


      this.setState({
        map: map,
        vectorLayer: vectorLayer,
        terrainLayer: terrainLayer,
        watchID: watchID
      });

    },

    toggleMapCacheMode: function() {

        if (this.state.readFromCache) alert('reading from inet');
        else alert('reading from cache');

        /* this.setState({
            readFromCache: !this.state.readFromCache
        }); */

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