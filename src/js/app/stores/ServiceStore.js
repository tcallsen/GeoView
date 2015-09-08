'use strict';

var React             = require('react/addons'),
    Reflux            = require('reflux'),
    Actions           = require('../actions.js');

var ServiceStore = Reflux.createStore({

	listenables: Actions,

	init: function() {
		this.store ={
			services: {}
		};
	},

	getService: function(serviceName) {
		return this.store.services[serviceName];
	},

	/*
	getServices: function() {
		return this.store.services;
	}, */

	onRegisterService: function(args) {
		
		console.log('registering ', args);
		this.store.services[args.name] = args.service
		
		this.onTriggerServiceEvent({
			name: args.name,
			event: 'mount',
			service: this.getService(args.name)
		});

	},

	onTriggerServiceEvent: function(args) {

		this.trigger({
			name: args.name,
			event: args.event || 'update',
			payload: args.payload || {},
			service: args.service || this.getService(args.name)
		});

	}

});

module.exports = ServiceStore;
