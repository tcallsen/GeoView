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
		name: args.gpx.name || 'GPX File ' + Excursion.prototype.getGpxList().length + 1,
		blob: args.gpx.blob,
		visible: true
	}

};

Excursion.prototype.addGpxFile = function(args) {

	//create new gpx
	this.gpx[utility.getGuid()] = {
		name: args.name || 'GPX File ' + Excursion.prototype.getGpxList().length + 1,
		blob: args.blob,
		visible: true
	}

	this.parentExcursionService.triggerUpdate();

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

Excursion.prototype.getGpxEntry = function(guid) {
	return this.gpx[guid];
};

Excursion.prototype.getGpxFeatures = function(guid, onlyVisible) {

	if (guid) {

		//RETURN FEATURE OF SPECIFIC GPX

		return blobUtil.blobToBinaryString(this.gpx[guid].blob).then(function(gpxPlainText){

			//retrieve blob in plaintext and parse into OL features
			var gpxFeature = new ol.format.GPX().readFeatures(gpxPlainText);

			//convert featues tp EPSG:3857
			gpxFeature.forEach( feature => feature.getGeometry().transform( 'EPSG:4326', 'EPSG:3857') );

			return gpxFeature;

		});

	} else {

		//gpxFeautres list - populated through the promise loop with feature for each GPX file in excursion
		var gpxFeatures = [];

		//refernces for use in closures - so dont have to .bind(this)
		var gpxList = this.getGpxList();
		var _serviceContext = this; //used in retireving gpxFeatures below

		//iteration variables - used to determine if loop needs to continue
		var i = 0;
		var gpxListLength = gpxList.length;

		return new Promise(function (masterFulfill, masterReject) {

			utility.promiseWhile(function() {
			    // Condition for stopping
			    return i < gpxListLength;
			}, function() {
			    // Action to run, should return a promise
			    var gpxEntry = Excursion.prototype.getGpxEntry.call(_serviceContext,gpxList[i].guid);
			    return new Promise(function (fulfill, reject) {

			    	blobUtil.blobToBinaryString(gpxEntry.blob).then(function(gpxPlainText){

						//retrieve blob in plaintext and parse into OL features
						var gpxFeature = new ol.format.GPX().readFeatures(gpxPlainText);

						//convert featues tp EPSG:3857
						gpxFeature.forEach( feature => feature.getGeometry().transform( 'EPSG:4326', 'EPSG:3857') );

						gpxFeatures.push(gpxFeature[0]); //need to remove from array it is returned in

						//handle iteration
						++i;
						fulfill();

					});

				});

			}).then(function() {
			    masterFulfill(gpxFeatures);
			});

		});

	}

}

Excursion.prototype.toggleGpxVisibility = function(guid) {
	this.gpx[guid].visible = !this.gpx[guid].visible;
	this.parentExcursionService.triggerUpdate();
}

module.exports = ExcursionService;
