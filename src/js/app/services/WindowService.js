'use strict';

var ServiceStore = require('../stores/ServiceStore');

var Actions = require('../actions');

var WindowService = function() {

	this.size = [ window.innerWidth , window.innerHeight ]

    window.onresize = this.handleWindowResize;

    window.document.addEventListener("resume", this.handleAppResume.bind(this), false);

};

WindowService.prototype.handleWindowResize = function() {

	console.log('resize detected');

	this.size = [ window.innerWidth , window.innerHeight ];

	Actions.triggerServiceEvent({
        name: 'window',
        event: 'update',
        payload: {
        	size: this.size
        }
    });

};

WindowService.prototype.handleAppResume = function() {

	console.log('app resumed');

	this.handleWindowResize();

};

module.exports = WindowService;