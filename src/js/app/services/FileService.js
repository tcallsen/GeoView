'use strict';

var ServiceStore = require('../stores/ServiceStore');
var blobUtil = require('blob-util');

var utility = require('../utility');

var FileService = {

	read: function(path) {

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

	remove: function(path) {

		var fileSystem = ServiceStore.getService('fileSystem');
        if (fileSystem) {

        	return new Promise(function (fulfill, reject) {

        		//define reject path - fileSystem error
        		var fileSystemFail = function(event) { 
			        reject(event);
			    };

			    //define fulfill path - write operation
	            fileSystem.root.getFile(path, null, function(fileEntry) {
	            	fileEntry.remove(function() {
	            		fulfill();
	            	}, fileSystemFail);
	            }, fileSystemFail) 

            });

    	}

	},

	readAsText: function(path) {

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
				            fulfill(evt.target.result);
				        };
				        reader.readAsText(file);
	        		}, fileSystemFail);
	            }, fileSystemFail) 

            });

    	}

	},

	download: function(url, options){

		var fileTransfer = new FileTransfer();
		var uri = encodeURI(url);

		options = options || {};
		var desintationPath = options.desintationPath || 'cdvfile://localhost/persistent/gpx/' + utility.getGuid() + '.gpx';

		return new Promise(function (fulfill, reject) {

			fileTransfer.download(
			    uri,
			    desintationPath,
			    function(entry) {
			        fulfill(entry);
			    },
			    function(error) {
			        reject(error);
			    },
			    true
			);

		});

	},

	getFileEntry: function(path) {

		var fileSystem = ServiceStore.getService('fileSystem');
        if (fileSystem) {

        	return new Promise(function (fulfill, reject) {

        		//define reject path - fileSystem error
        		var fileSystemFail = function(event) { 
			        reject(event);
			    };

			    //define fulfill path - write operation
	            fileSystem.root.getFile(path, null, function(fileEntry) {
	            	fulfill(fileEntry);
	            }, fileSystemFail) 

            });

    	}

	},

	getDirectoryEntries: function(path) {

		var fileSystem = ServiceStore.getService('fileSystem');
        if (fileSystem) {

        	return new Promise(function (fulfill, reject) {

	        	//define reject path - fileSystem error
	    		var fileSystemFail = function(event) { 
			        reject(event);
			    };

	        	fileSystem.root.getDirectory(path, { create: true }, function(directoryEntry) {

	        		var directoryReader = directoryEntry.createReader();

	        		directoryReader.readEntries(function(entries) {
	        			fulfill(entries);
	        		}, fileSystemFail);

	        	}, fileSystemFail)

	    	});

    	}

	}

}

module.exports = FileService;