'use strict';

var ServiceStore = require('../stores/ServiceStore');
var ExcursionStore = require('../stores/ExcursionStore');

var Actions = require('../actions');

var WindowService = function() {

	this.size = [ window.innerWidth , window.innerHeight ];

    window.onresize = this.handleWindowResize;

    window.document.addEventListener("resume", this.handleAppResume.bind(this), false);
    window.document.addEventListener("pause", this.handleAppPause.bind(this), false);
    window.document.addEventListener("resign", this.handleAppPause.bind(this), false);

    //for platform browser debug
    //window.onblur = this.handleAppPause.bind(this);
    //window.onfocus = this.handleAppResume.bind(this);

    //detect if previousState saved and load if so
    this.loadPreviousState();

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

    //load previous state (prevents issue where app restarts on load if in background long enough)
    this.loadPreviousState();

    //handle window resize to account for any adjustments made while app was paused/in background
    this.handleWindowResize();

};

WindowService.prototype.handleAppPause = function() {

    console.log('app paused');

    var currentExcursion = ExcursionStore.getCurrent();
    if (currentExcursion) 
        currentExcursion.save({
            path: '/previousState.dat'
        });

};

WindowService.prototype.loadPreviousState = function() {

    ServiceStore.getServicePromise('file').then(function(fileService){

        fileService.exists('/previousState.dat').then(function() {
            
            //file exists
            console.log('previous state EXISTS - loading from /previousState.dat');

            fileService.read('/previousState.dat').then(function(jsonBlob) {
                ExcursionStore.loadFromJsonBlob(jsonBlob);

                //remove previous state file
                fileService.remove('/previousState.dat');

            });

        }, function() {
            
            //file does not exist
            console.log('previous state NOT EXIST - starting fresh');

            //reset current excursion
            ExcursionStore.closeCurrent()

        });

    }.bind(this));

};

module.exports = WindowService;