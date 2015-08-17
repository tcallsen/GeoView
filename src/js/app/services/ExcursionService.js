'use strict';

var Actions = require('../actions');
var utility = require('../utility');
var blobUtil = require('blob-util');
var ol = require('openlayers');

// HANDLES swapping of excursions
var ExcursionService = {

	excursion: {},

	create: function(args) {

		console.log('new Excursion created');

		this.excursion = new Excursion(this, args);

		//emit excursion out to app
		this.triggerUpdate();

		return this.excursion;

	},

	getCurrent: function() {
		return this.excursion;
	},

	triggerUpdate: function() {
		//emit excursion out to app
		Actions.triggerServiceEvent({
            name: 'excursion',
            event: 'update',
            service: this.excursion
        });
	}

}

// EXCURSION functionality
var Excursion = function(parentExcursionService, args) {

	//save reference to parent Excursion Service
	this.parentExcursionService = parentExcursionService;

	//save name
	this.name = args.name;

	//create gpx data structure
	this.gpx = {};

	//create new gpx
	this.gpx[utility.getGuid()] = {
		name: args.gpx.name,
		blob: args.gpx.blob,
		visible: true
	}

};

Excursion.prototype.getGpxList = function() {

	var returnArray = [];

	for (var key in this.gpx) {
		if (this.gpx.hasOwnProperty(key)) {
			
			var gpx = this.gpx[key];
			
			returnArray.push({
				name: gpx.name,
				guid: key,
				visible: gpx.visible
			});

		}
	}

	return returnArray;

};

Excursion.prototype.getGpxFeatures = function(guid) {

	return blobUtil.blobToBinaryString(this.gpx[guid].blob).then(function(gpxPlainText){

		//retrieve blob in plaintext and parse into OL features
		var gpxFeatures = new ol.format.GPX().readFeatures(gpxPlainText);

		//convert featues tp EPSG:3857
		gpxFeatures.forEach( feature => feature.getGeometry().transform( 'EPSG:4326', 'EPSG:3857') );

		return gpxFeatures;

	});

}

Excursion.prototype.toggleGpxVisibility = function(guid) {
	this.gpx[guid].visible = !this.gpx[guid].visible;
	this.parentExcursionService.triggerUpdate();
}



module.exports = ExcursionService;
