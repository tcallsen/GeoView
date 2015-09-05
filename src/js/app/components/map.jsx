var React = require("react");
var Reflux = require("reflux");

var ServiceStore = require('../stores/ServiceStore');
var ExcursionStore = require('../stores/ExcursionStore');

var ol = require('openlayers');
var blobUtil = require('blob-util');
var localForage = require('localforage');

var Map = React.createClass({
      
    mixins: [Reflux.listenToMany({
        handleServiceEvent: ServiceStore,
        handleExcursionUpdate: ExcursionStore
    })],

    getInitialState: function() {

    	return {
    		map: null,
    		gpsLayer: null,
            excursionLayer: null,
            readFromCache: false 
    	};

    },

	componentDidMount: function() {
      	
        this.initializeMap();

        if (this.state.readFromCache) alert('reading from cache only!');

  	},

    handleExcursionUpdate: function(args) {

        //detect if excursion update - update GeoView display accordingly
        if (args.event && args.current) {
            
            //clear existing features
            this.state.excursionLayer.getSource().clear();

            console.log('excursionService in map');

            //retrieve GPX features and draw on map
            var excursion = ExcursionStore.getCurrent();
            var gpxFeatures = excursion.getGpxFeatures(null, true);

            this.state.excursionLayer.setSource(new ol.source.Vector({
                features: gpxFeatures
            }));

            //center map on all enabled gpx features
            if (gpxFeatures.length) {
                var featureExtent = new ol.extent.createEmpty();
                gpxFeatures.forEach( gpxFeature => ol.extent.extend(featureExtent, gpxFeature.getGeometry().getExtent()) );
                //if (featureExtent !== [0,0,0,0]) this.state.map.getView().fitExtent( featureExtent , this.state.map.getSize() );
                if (featureExtent !== [0,0,0,0]) this.state.map.getView().setCenter( ol.extent.getCenter(featureExtent) );
            }

        } else if (args.event === 'unmount' || !args.current) {
            
            //clear existing features
            this.state.excursionLayer.getSource().clear();

            this.state.excursionLayer.setSource(new ol.source.Vector({
                features: []
            }));

        }

    },

    handleServiceEvent: function(serviceEvent) {

        //detect if excursion update - if so reload excursions and gpx files
        if (serviceEvent.name === 'location' && serviceEvent.event === 'update' && serviceEvent.payload.enabled) {

            //return if position not supplied
            if (!serviceEvent.payload.position) return;

            console.log('location update');

            this.state.gpsLayer.setSource(
                new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.transform( [serviceEvent.payload.position.coords.longitude,serviceEvent.payload.position.coords.latitude] , 'EPSG:4326', 'EPSG:3857'))
                        })
                    ]
                })
            );

            this.state.map.getView().setCenter(ol.proj.transform( [serviceEvent.payload.position.coords.longitude,serviceEvent.payload.position.coords.latitude] , 'EPSG:4326', 'EPSG:3857'));
            
        } else if (serviceEvent.name === 'location' && serviceEvent.event === 'update' && !serviceEvent.payload.enabled) {

            this.state.gpsLayer.setSource(
                new ol.source.Vector({
                    features: []
                })
            );

        }

    },

    initializeMap: function() {

      var gpsLayer = new ol.layer.Vector({
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

        var excursionLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: []
            }),
            style: function(feature, resolution) {
              return [new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: '#0f0',
                  width: 3
                })
              })]
            }
        });
 
        var terrainLayerSource = new ol.source.Stamen({
                layer: 'terrain',

                /*
                tileUrlFunction: function(tileCoord) {
                    console.log('tileUrlFunction');
                    console.log(tileCoord);
                }, */

                /* DISABLING ALL CACHING FOR NOW
                tileLoadFunction: function(imageTile, src) {
                    
                    //console.log('tileLoadFunction');

                    var key = imageTile.getTileCoord().join('_');

                    var imgElement = imageTile.getImage();

                    //console.log('tileLoadFunction - ', key);


                    //DETERMINE CACHE MODE                    


                    //ONLY CACHE
                    if (this.state.readFromCache) {

                        //console.log('only read from cache');

                        localForage.getItem(key, function(err, item) {
                            
                            //CHECK CACHE
                            if (item) {
                              console.log(key + ' read from cache');
                              imgElement.src = blobUtil.createObjectURL(item);
                            }

                        });

                        return true;
                    }

                    //INET
                    else {

                        //console.log('read from inet');

                        //imgElement.src = src;

                        blobUtil.imgSrcToBlob(src, 'image/png', 'Anonymous').then(function (blob) {
                            localForage.setItem(key, blob, function() {
                                //console.log('cached item @ ' + key);
                                localForage.getItem(key, function(err, item) {
                                    //console.log('reading cached item @ ' + key);
                                    imgElement.src = blobUtil.createObjectURL(item);
                                });

                            });
                        // success
                        }).catch(function (err) {
                            console.log('failed to convert blob @ ' + key);
                        });

                    }

                }.bind(this) */
            });

        var terrainLayer = new ol.layer.Tile({
            source: terrainLayerSource
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

          terrainLayer,
          
          /*
          new ol.layer.Tile({
            source: new ol.source.Stamen({
              layer: 'terrain-labels'
            })
          })
          */

          excursionLayer,

          gpsLayer 

          ],
          target: 'map',
          view: new ol.View({
            center: ol.proj.transform( [-111.4997,40.6594], 'EPSG:4326', 'EPSG:3857'),
            zoom: 13,
            maxZoom: 18,
            minZoom: 4,
            projection: 'EPSG:3857'
          })
        });

      map.on('singleclick', this.toggleMapCacheMode);

      this.setState({
        map: map,
        gpsLayer: gpsLayer,
        excursionLayer: excursionLayer,
        terrainLayer: terrainLayer,
        terrainLayerSource: terrainLayerSource
      });

    },

    toggleMapCacheMode: function() {

        this.setState({
            readFromCache: !this.state.readFromCache
        }, function() {
            
            console.log('cache read mode = ' + this.state.readFromCache);

            /*
            this.state.map.getView().setZoom(this.state.map.getView().getZoom() - 1);
            
            if (!this.state.readFromCache) {
              
                console.log('resetting tileLoadFunction');
                
                this.state.terrainLayer.setVisible(false);
                this.state.terrainLayer.setVisible(true);

                this.state.terrainLayer.setSource(this.state.terrainLayerSource);

                this.state.terrainLayer.getSource().setTileLoadFunction(function(imageTile, src) {
                    var imgElement = imageTile.getImage();
                    imgElement.src = src;
                });

            } */

            //this.state.map.un('singleclick', this.toggleMapCacheMode.bind(this));
            //this.state.map.on('singleclick', this.saveCacheToFile.bind(this));

        });

    },

    saveCacheToFile: function() {

        console.log('saving file');

        this.props.fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, function(fileEntry) {
                
            fileEntry.createWriter(function(writer) {
                 
                /* 
                localForage.keys(function(err, keys) {
                    this.writeBlobToFile(keys, 0, writer, {});
                }.bind(this));
                */
                /*
                localForage.iterate(function(value, key, iterationNumber) {
                    // Resulting key/value pair -- this callback
                    // will be executed for every item in the
                    // database.
                    //console.log([key, value]);
                    //console.log(this.props.fileSystem);

                    keyClosure = key;

                    console.log('writing ' + key + ' @ position ' + writer.position);
                    ++writing;

                    writer.write(value);

                }.bind(this)).then(function() {
                    //console.log('Iteration has completed');

                    console.log('writing: ' + writing + ' wrote: ' + wrote);

                });

                writer.onwriteend = function(evt) {
                    //console.log('write complete; writer position: ' + writer.position + ' file length: ' + writer.length);
                    console.log('wrote ' + keyClosure + ' to file.');
                    ++wrote;
                }; */
                    
            }.bind(this), this.fileSystemFail);

        }.bind(this), this.fileSystemFail);

        /*
        if (this.state.readFromCache) alert('reading from inet');
        else alert('reading from cache'); */

        /* this.setState({
            readFromCache: !this.state.readFromCache
        }); */

    },

    writeBlobToFile: function(keys, curKeyIndex, writer, writerPositions) {

        //console.log(curKeyIndex, keys, keys[curKeyIndex]);
        //console.log('writing index ' + keys[curKeyIndex] + ' to file @ ' + writer.position);

        localForage.getItem(keys[curKeyIndex], function(err, item) {
            writer.write(item);
        });

        writer.onwriteend = function(evt) {
            
            console.log('wrote ' + keys[curKeyIndex] + ' to file ending @ ' + writer.position);
            
            //recursively call next write operation
            if (curKeyIndex+1 < keys.length) {
                //add key & position to writerPositions index
                writerPositions[keys[curKeyIndex]] = writer.position;
                this.writeBlobToFile(keys, curKeyIndex+1, writer, writerPositions)
            } else this.writeOperationComplete(writerPositions);

        }.bind(this);

    },

    writeOperationComplete: function(writerPositions) {
        alert('write operation complete');
        console.log(writerPositions);
    },

    fileSystemFail: function(evt) { 
      console.log('filesystem error:');
      console.log(evt);
    },

    render: function() {
    
      return (
          <div id="map"> </div>
      );
    }
});

module.exports = Map;