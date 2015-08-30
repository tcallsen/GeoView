'use strict';

var ServiceStore = require('../stores/ServiceStore');

var utility = require('../utility'),
	Actions = require('../actions');

var LocationService = function() {

	this.enabled = null;
	this.position = null;
	//this.track = [];
	this.watchId = null;

	this.toggle(true);

};

LocationService.prototype.getPosition = function() {

	if (this.position) return this.position;
	else return false;

};

LocationService.prototype.toggle = function(forceMode) {

	//toggle this.enabled flag
	if (typeof forceMode != 'undefined') this.enabled = forceMode;
	else this.enabled = !this.enabled;

	//set navigator position watcher if enabled
	if (this.enabled) this.watchId = navigator.geolocation.watchPosition(this.triggerLocationUpdate.bind(this), this.locationError.bind(this));
	else {
		
		//clear navigator geolocation watch
		navigator.geolocation.clearWatch(this.watchId);

		//transmit "disabled" message through application
		Actions.triggerServiceEvent({
	        name: 'location',
	        event: 'update',
	        payload: {
	        	enabled: false,
	        	position: null
	        }
	    });

    }

};

LocationService.prototype.triggerLocationUpdate = function(position) {

	console.log('triggerLocationUpdate');
	
	//save position to service
	this.position = position;
	//this.track.push(position);

	Actions.triggerServiceEvent({
        name: 'location',
        event: 'update',
        payload: {
        	enabled: true,
        	position: position
        }
    });

};

LocationService.prototype.locationError = function(error) {

	console.log('locationError');

	//transmit "disabled" message through application
	Actions.triggerServiceEvent({
        name: 'location',
        event: 'update',
        payload: {
        	enabled: false,
        	position: null
        }
    });	

};

module.exports = LocationService;