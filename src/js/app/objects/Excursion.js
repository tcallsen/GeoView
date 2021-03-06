'use strict';

var utility		 	= require('../utility'),
	ol 				= require('openlayers'),
	blobUtil 		= require('blob-util'),
	Actions 		= require('../actions'),
	ServiceStore    = require('../stores/ServiceStore');

var Excursion = function(store, args) {

	//store reference to parent store
	this.store = store;

	//save name
	this.name = args.name;

	//logic split based on if new Excursion or loading from file
	if (!args.loadFromFile) {

		//create gpx data structure
		this.gpx = {};

		//create new gpx if supplied
		if (args.gpx)
			this.gpx[utility.getGuid()] = {
				name: args.gpx.name || 'GPX File ' + (parseInt(Object.keys(this.gpx).length) + 1),
				content: args.gpx.content,
				elevation: null,
				visible: true
			}

	} else this.gpx = args.gpx;


	// PARSE gpx by performing following actions on each gpx file
	Object.keys(this.gpx).forEach( gpxEntryKey => {

		var gpxEntry = this.gpx[gpxEntryKey];

		//parse gpx.content into open layers feature
		gpxEntry.feature = new ol.format.GPX().readFeatures(gpxEntry.content)[0];

		//highcharts - loop through elevation array and set x elewment to index (date commented out ATM)
		if (gpxEntry.elevation && Array.isArray(gpxEntry.elevation))
			gpxEntry.elevation.forEach( (entry,index) => gpxEntry.elevation[index][0] = index /*new Date(gpxEntry.elevation[index][0])*/ );

	});

	return this;

};

Excursion.prototype.addGpxFile = function(args) {

	//create new gpx
	this.gpx[utility.getGuid()] = {
		name: args.name || 'GPX File ' + (parseInt(Object.keys(this.gpx).length) + 1),
		content: args.content,
		feature: new ol.format.GPX().readFeatures(args.content)[0], //parse gpx into open layers feature
		visible: true
	}

	this.store.emitStoreUpdate('update');

};

Excursion.prototype.removeGpxFile = function(guid) {

	delete this.gpx[guid];

	this.store.emitStoreUpdate('update');

};

Excursion.prototype.save = function(args) {

	var fileService = ServiceStore.getService('file');

	var jsonBlob = this.toJsonBlob();

	var destinationPath = args.path || '/exc/' + utility.removeSpaces(this.name) + '.exc';

	fileService.write(destinationPath, jsonBlob).then(function() {

		//squelch alert in onblur
		if (args.path) console.log('Save complete');
		else alert('Save complete');

		Actions.triggerServiceEvent({
            name: 'fileSystem',
            event: 'update'
        });

	});

};

Excursion.prototype.remove = function() {

	var fileService = ServiceStore.getService('file');

	fileService.remove('/exc/' + utility.removeSpaces(this.name) + '.exc').then(function() {

		alert('Excursion deleted');

		Actions.triggerServiceEvent({
            name: 'fileSystem',
            event: 'update'
        });

		this.store.closeCurrent();

	}.bind(this));

};

Excursion.prototype.getGpxEntry = function(guid) {
	return this.gpx[guid];
};

Excursion.prototype.getGpxFeatures = function(onlyVisible) {

	//gpxFeautres list - populated through loop with feature for each GPX file in excursion
	var gpxFeatures = [];

	Object.keys(this.gpx).forEach( gpxKey => {

		//if onlyVisible then skip over non-visible gpx features
		if (onlyVisible && !this.gpx[gpxKey].visible) return;

		var gpxFeature = this.gpx[gpxKey].feature;

		//if excursion does not include elevation array - parse out elevation array
        if (!this.gpx[gpxKey].elevation) {
        	console.log('parsing elevation array for gpx feature');
        	var timeElevationArray = [];
            gpxFeature.getGeometry().getCoordinates()[0].forEach( (coordPair, index) => {
            	timeElevationArray.push([ index /*new Date(coordPair[3] * 1000)*/ , coordPair[2] ]);
            });
            this.gpx[gpxKey].elevation = timeElevationArray;
        }

		//convert featues tp EPSG:3857 
		gpxFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

		gpxFeatures.push(gpxFeature); //need to remove from array it is returned in

	});

	return gpxFeatures;

}

Excursion.prototype.getGpxProgressIndex = function(gpxKey, position) {

	//assemble current location coord (needle)
	var currentLocationCoord = [ position.coords.longitude , position.coords.latitude ];
	
	//assemble gpx feature geometry (haystack)
	var gpxGeometry = this.gpx[gpxKey].feature.getGeometry();

	//search geo feature for closest point
	var closestPoint = gpxGeometry.getClosestPoint(currentLocationCoord);

	//determine index of closest point in gpxGeometry coordinates array
	var gpxProgressIndex = 0;
	gpxGeometry.getCoordinates()[0].forEach( (coord, index) => {
		if (gpxProgressIndex) return;
		if (closestPoint[0] === coord[0] && closestPoint[1] === coord[1]) gpxProgressIndex = index;
	});

	alert( 'position: [' + position.coords.longitude + ',' + position.coords.latitude  + '] ' +
		'closestPoint: [' + closestPoint[0] + ',' + closestPoint[1]  + '] ' +
		'gpxProgressIndex: ' + gpxProgressIndex );

	return gpxProgressIndex;

}

Excursion.prototype.toggleGpxVisibility = function(guid) {
	this.gpx[guid].visible = !this.gpx[guid].visible;
	this.store.emitStoreUpdate('update');
}

Excursion.prototype.toJsonBlob = function() {

	//filter excursion and gpx objects to remove non-exportable properties
	
	//assemble gpx export
	var gpxExport = {}
	Object.keys(this.gpx).forEach( gpxKey => {
		var gpxEntry = this.gpx[gpxKey];
		gpxExport[gpxKey] = {
			content: gpxEntry.content,
			elevation: gpxEntry.elevation,
			name: gpxEntry.name,
			visible: gpxEntry.visible
		};
	});

	//assemble excursion export
	var excursionExport = {
		name: this.name,
		gpx: gpxExport
	}

	return blobUtil.createBlob( [ JSON.stringify(excursionExport) ] , {type: 'application/json'} );

}

module.exports = Excursion;
