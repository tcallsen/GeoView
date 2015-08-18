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
	},

	loadFromJsonBlob: function(jsonBlob) {

		blobUtil.blobToBinaryString(jsonBlob).then(function(jsonString) {
			
			//parse json blob into object
			var excursion = JSON.parse(jsonString);

			console.log(excursion);

			excursion.loadFromFile = true;

			//create new excursion with object
			this.create(excursion);

		}.bind(this));

	}

}

// EXCURSION functionality
var Excursion = function(parentExcursionService, args) {

	//save reference to parent Excursion Service
	this.parentExcursionService = parentExcursionService;

	//save name
	this.name = args.name;

	//logic split based on if .create is called when creating new Excursion or loading from file
	if (!args.loadFromFile) {

		//create gpx data structure
		this.gpx = {};

		//create new gpx
		this.gpx[utility.getGuid()] = {
			name: args.gpx.name || 'GPX File ' + (parseInt(this.getGpxList().length) + 1),
			content: args.gpx.content,
			visible: true
		}

	} else this.gpx = args.gpx;

	return this;

};

Excursion.prototype.addGpxFile = function(args) {

	//create new gpx
	this.gpx[utility.getGuid()] = {
		name: args.name || 'GPX File ' + (parseInt(this.getGpxList().length) + 1),
		content: args.content,
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

		var gpxPlainText = this.gpx[guid].content;

		//retrieve blob in plaintext and parse into OL features
		var gpxFeature = new ol.format.GPX().readFeatures(gpxPlainText);

		//convert featues tp EPSG:3857
		gpxFeature.forEach( feature => feature.getGeometry().transform( 'EPSG:4326', 'EPSG:3857') );

		return gpxFeature;

	} else {

		//gpxFeautres list - populated through loop with feature for each GPX file in excursion
		var gpxFeatures = [];

		//refernces for use in closures - so dont have to .bind(this)
		var gpxList = this.getGpxList();
		var _serviceContext = this; //used in retireving gpxFeatures below

		Object.keys(this.gpx).forEach( gpxKey => {

			var gpxPlainText = this.gpx[gpxKey].content;

			//retrieve blob in plaintext and parse into OL features
			var gpxFeature = new ol.format.GPX().readFeatures(gpxPlainText);

			//convert featues tp EPSG:3857
			gpxFeature[0].getGeometry().transform( 'EPSG:4326', 'EPSG:3857');

			gpxFeatures.push(gpxFeature[0]); //need to remove from array it is returned in

		});

		return gpxFeatures;

	}

}

Excursion.prototype.toggleGpxVisibility = function(guid) {
	this.gpx[guid].visible = !this.gpx[guid].visible;
	this.parentExcursionService.triggerUpdate();
}

Excursion.prototype.toJsonBlob = function() {

	var _thisExcursion = this;

	var i = 0;
	var gpxKeys = Object.keys(_thisExcursion.gpx);

	var gpxReturn = {};

	//convert gpx blobs to binary string (in preparation for JSON.stringify)
	return new Promise(function (loopFulfill, masterReject) {

		utility.promiseWhile(function() {
		    // Condition for stopping
		    return i < gpxKeys.length;
		}, function() {
		    // Action to run, should return a promise
		    return new Promise(function (fulfill, reject) {

				var gpxEntry = _thisExcursion.gpx[gpxKeys[i]];

				var binaryBlob = blobUtil.blobToBinaryString(gpxEntry.blob).then(function(binaryString) {
					
					//reassign blob property to binaryString
					gpxEntry.blob = binaryString;

					//save updated gpxEntry to gpxReturn object
					gpxReturn[gpxKeys[i]] = gpxEntry;

					//iteration
					++i;
					fulfill();

				});

			});

		}).then(function() {
		    loopFulfill();
		});

	}).then(function() {
	    
		console.log("REACHED THEN");

		//have to create export because of link to parent server
		var excursionExport = {
			name: _thisExcursion.name,
			gpx: gpxReturn
		}

		console.log('excursionExport');
		console.log(excursionExport);

		console.log('_thisExcursion');
		console.log(_thisExcursion);

		//return blobUtil.createBlob( [ JSON.stringify(excursionExport) ] , {type: 'application/json'} );

	});

}

module.exports = ExcursionService;
