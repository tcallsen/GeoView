'use strict';

var ServiceStore = require('../stores/ServiceStore');
var ExcursionStore = require('../stores/ExcursionStore');

var Actions = require('../actions');

var WindowService = function() {

	this.size = [ window.innerWidth , window.innerHeight ];

    this.hasBeenPaused = false;

    window.onresize = this.handleWindowResize;

    window.document.addEventListener("resume", this.handleAppResume.bind(this), false);
    window.document.addEventListener("pause", this.handleAppPause.bind(this), false);
    window.document.addEventListener("resign", this.handleAppPause.bind(this), false);

    //window.onblur = this.handleAppPause.bind(this);
    //window.onfocus = this.handleAppResume.bind(this);

    //detect if previousState saved and load if so
    //this.loadPreviousState();

};

WindowService.prototype.previousStatePath = '/previousState.dat';

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

    if (this.hasBeenPaused) console.log('app resumed after being paused, excursion ' + this.hasBeenPaused);
    else {
        console.log('app resumed');
        this.handleWindowResize();
    }

    this.hasBeenPaused = false;

};

WindowService.prototype.handleAppPause = function() {

    //this.hasBeenPaused = ExcursionStore.getCurrent().name;

    console.log('app paused');

    var currentExcursion = ExcursionStore.getCurrent();
    if (currentExcursion) currentExcursion.save(this.previousStatePath);

};

/* WindowService.prototype.loadPreviousState = function() {

    console.log('loadPreviousState');

    console.log(ServiceStore);

    var fileService = ServiceStore.getService('file');
    fileService.exists(this.previousStatePath).then(function() {
        //file exists
        console.log('file exists');
    }, function() {
        //file does not exist
        console.log('file does not exist');
    });


    //var fileService = ServiceStore.getService('file');      
    //fileService.read(this.previousStatePath).then(function(jsonBlob) {
    //    ExcursionStore.loadFromJsonBlob(jsonBlob);
    //});

}; */

module.exports = WindowService;