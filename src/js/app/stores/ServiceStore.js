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
		
		this.emitServiceEvent(args.name, 'mount', this.getService(args.name));

	},

	onTriggerServiceEvent: function(args) {
		this.emitServiceEvent(args.name, args.event, args.payload, args.service || this.getService(args.name));
	},

	emitServiceEvent: function(serviceName, event, payload, service) {

		this.trigger({
			name: serviceName,
			event: event,
			payload: payload,
			service: service
		});

	}

});

module.exports = ServiceStore;