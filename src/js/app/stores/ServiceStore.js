'use strict';

var React             = require('react/addons'),
    Reflux            = require('reflux'),
    Actions           = require('../actions.js');

var ServiceStore = Reflux.createStore({

	listenables: Actions,

	init: function() {
		this.store ={
			services: {},
			requestPromises: {}
		};
	},

	getService: function(serviceName) {

		return this.store.services[serviceName];
	},

	getServicePromise: function(serviceName) {
		
		//return promise that immediately fulfills with service, or does so when service is finally registered
		if (this.store.services[serviceName]) {

			//service has been registered - return promise that fulfills with service immediately
			return new Promise(function (fulfill, reject) {
        		fulfill(this.store.services[serviceName]);
            });

		} else {

			//serice has not been registered - return promise that will be fulfilled when service is available
			return new Promise(function (fulfill, reject) {
        		
				//create entry in store.requestPromises, or append to end of existing entry (in the event that there is a queue of waiting promises)
				if (this.store.requestPromises[serviceName]) this.store.requestPromises[serviceName].push(fulfill);
				else this.store.requestPromises[serviceName] = [ fulfill ];

				console.log('getServicePromise');
				console.log(this.store);

            }.bind(this));

		}

	},

	onRegisterService: function(args) {
		
		console.log('registering ', args);
		this.store.services[args.name] = args.service
		
		//trigger service availability to rest of app
		this.onTriggerServiceEvent({
			name: args.name,
			event: 'mount',
			service: this.getService(args.name)
		});

		//check request promises register to provide service retroactively to previous requests
		this.fulfillRequestPromises({
			name: args.name,
			event: 'mount',
			service: this.getService(args.name)
		});

	},

	fulfillRequestPromises: function(args) {

		//check if unfulfilled requests for service name 
		if (this.store.requestPromises[args.name]) {

			//fulfill all request promies - purge list (since all items have been fulfilled)
			this.store.requestPromises[args.name].forEach( requestPromiseFulFill => requestPromiseFulFill(args) );
			delete this.store.requestPromises[args.name]

		}

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
