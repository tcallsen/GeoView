'use strict';

var ServiceStore = require('../stores/ServiceStore');
var blobUtil = require('blob-util');

var FileService = {

	write: function(path, fileBlob){

		var fileSystem = ServiceStore.getService('fileSystem');
        if (fileSystem) {

        	return new Promise(function (fulfill, reject) {

        		//define reject path - fileSystem error
        		var fileSystemFail = function(event) { 
			        reject(event);
			    };

			    //define fulfill path - write operation
	            fileSystem.root.getFile(path, {create: true, exclusive: false}, function(fileEntry) {
	            	fileEntry.createWriter(function(writer) {
	            		writer.onwriteend = function(event) {
				            console.log('write operation complete');
				            fulfill(event);
				        };
				        writer.write(fileBlob);
	        		}, fileSystemFail);
	            }, fileSystemFail) 

            });

    	}

	},

	read: function(path){

		var fileSystem = ServiceStore.getService('fileSystem');
        if (fileSystem) {

        	return new Promise(function (fulfill, reject) {

        		//define reject path - fileSystem error
        		var fileSystemFail = function(event) { 
			        reject(event);
			    };

			    //define fulfill path - write operation
	            fileSystem.root.getFile(path, null, function(fileEntry) {
	            	fileEntry.file(function(file) {
	            		var reader = new FileReader();
	            		reader.onloadend = function(evt) {
				            fulfill(blobUtil.createBlob([evt.target.result], {type: 'text/plain'}));
				        };
				        reader.readAsText(file);
	        		}, fileSystemFail);
	            }, fileSystemFail) 

            });

    	}

	},

	download: function(path){

		var fileSystem = ServiceStore.getService('fileSystem');
        if (fileSystem) {

        	return new Promise(function (fulfill, reject) {

        		//define reject path - fileSystem error
        		var fileSystemFail = function(event) { 
			        reject(event);
			    };

			    //define fulfill path - write operation
	            fileSystem.root.getFile(path, null, function(fileEntry) {
	            	fileEntry.file(function(file) {
	            		var reader = new FileReader();
	            		reader.onloadend = function(evt) {
				            console.log("Read as text");
				            fulfill(evt.target.result);
				        };
				        reader.readAsText(file);
	        		}, fileSystemFail);
	            }, fileSystemFail) 

            });

    	}

	}

}

module.exports = FileService;