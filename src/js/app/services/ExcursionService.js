'use strict';

// HANDLES swapping of excursions
var ExcursionService = {

	excursion: {},

	create: function(args) {

		console.log('new Excursion created');

		this.excursion = new Excursion(args);

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

module.exports = ExcursionService;