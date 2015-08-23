'use strict';

var utility		 	= require('../utility'),
	ol 				= require('openlayers'),
	blobUtil 		= require('blob-util');

var Excursion = function(store, args) {

	//store reference to parent store
	this.store = store;

	//save name
	this.name = args.name;

	//logic split based on if .create is called when creating new Excursion or loading from file
	if (!args.loadFromFile) {

		//create gpx data structure
		this.gpx = {};

		//create new gpx if supplied
		if (args.gpx)
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

	this.store.emitStoreUpdate('update');

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

			//if onlyVisible then skip over non-visible gpx features
			if (onlyVisible && !this.gpx[gpxKey].visible) return;

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
	this.store.emitStoreUpdate('update');
}

Excursion.prototype.toJsonBlob = function() {

	//have to create export because of link to parent server
	var excursionExport = {
		name: this.name,
		gpx: this.gpx
	}

	console.log(JSON.stringify(excursionExport));

	return blobUtil.createBlob( [ JSON.stringify(excursionExport) ] , {type: 'application/json'} );

}

module.exports = Excursion;
