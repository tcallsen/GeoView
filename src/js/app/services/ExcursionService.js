'use strict';

var Actions = require('../actions');
var blobUtil = require('blob-util');

// HANDLES swapping of excursions
var ExcursionService = {

	excursion: {},

	create: function(args) {

		console.log('new Excursion created');

		this.excursion = new Excursion(args);

		//emit excursion out to app
		Actions.triggerServiceEvent({
            name: 'excursion',
            event: 'update',
            service: this.excursion
        });

		return this.excursion;

	},

	getCurrent: function() {
		return this.excursion;
	}

}

// EXCURSION functionality
var Excursion = function(args) {
	
	this.name = args.name;
	this.gpxBlob = args.gpxBlob;

}

Excursion.prototype.getGpxPlainText = function() {
	return blobUtil.blobToBinaryString(this.gpxBlob);
};

module.exports = ExcursionService;