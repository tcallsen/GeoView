'use strict';

var React             = require('react/addons'),
    Reflux            = require('reflux'),
    Actions           = require('../actions.js'),
    Excursion 		  = require('../objects/Excursion'),
    blobUtil 		  = require('blob-util');

var ExcursionStore = Reflux.createStore({

	listenables: Actions,

	init: function() {
		this.store ={
			excursion: null
		};
	},

	create: function(args) {

		console.log('new Excursion created');

		this.store.excursion = new Excursion(this, args);

		//emit excursion out to app
		this.emitStoreUpdate('mount');

		return this.store.excursion;

	},

	closeCurrent: function() {
		this.store.excursion = null;
		this.emitStoreUpdate('unmount');
	},

	getCurrent: function() {
		return this.store.excursion;
	},

	emitStoreUpdate: function(event) {

		this.trigger({
			event: event,
			current: this.store.excursion,
			store: this.store
		});

	},

	loadFromJsonBlob: function(jsonBlob) {

		blobUtil.blobToBinaryString(jsonBlob).then(function(jsonString) {
			
			//parse json blob into object
			var excursion = JSON.parse(jsonString);

			excursion.loadFromFile = true;

			//create new excursion with object
			this.create(excursion);

		}.bind(this));

	}

});

module.exports = ExcursionStore;
