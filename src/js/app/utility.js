'use strict';

var utility   = {};
var Promise = require('bluebird');

utility.removeSpaces = function(string){
	return string.replace(/ /g,'').replace(new RegExp(":", "g"),'');
};

utility.getGuid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

utility.promiseWhile = function(condition, action) {
    var resolver = Promise.defer();

    var loop = function() {
        if (!condition()) return resolver.resolve();
        return Promise.cast(action())
            .then(loop)
            .catch(resolver.reject);
    };

    process.nextTick(loop);

    return resolver.promise;
}; 

utility.endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

utility.toFeet = function(meters) {
    return Math.round(3.2808 * meters);
}

module.exports = utility;

/* utility.promiseWhile() example


  1)

  //gpxFeautres list - populated through the promise loop with feature for each GPX file in excursion
  var gpxFeatures = [];

  //refernces for use in closures - so dont have to .bind(this)
  var gpxList = this.getGpxList();
  var _serviceContext = this; //used in retireving gpxFeatures below

  //iteration variables - used to determine if loop needs to continue
  var i = 0;
  var gpxListLength = gpxList.length;

  return new Promise(function (masterFulfill, masterReject) {

    utility.promiseWhile(function() {
        // Condition for stopping
        return i < gpxListLength;
    }, function() {
        // Action to run, should return a promise
        var gpxEntry = Excursion.prototype.getGpxEntry.call(_serviceContext,gpxList[i].guid);
        return new Promise(function (fulfill, reject) {

          blobUtil.blobToBinaryString(gpxEntry.blob).then(function(gpxPlainText){

          //retrieve blob in plaintext and parse into OL features
          var gpxFeature = new ol.format.GPX().readFeatures(gpxPlainText);

          //convert featues tp EPSG:3857
          gpxFeature.forEach( feature => feature.getGeometry().transform( 'EPSG:4326', 'EPSG:3857') );

          gpxFeatures.push(gpxFeature[0]); //need to remove from array it is returned in

          //handle iteration
          ++i;
          fulfill();

        });

      });

    }).then(function() {
        masterFulfill(gpxFeatures);
    });

  });



  2)

  //convert gpx blobs to binary string (in preparation for JSON.stringify)
  return new Promise(function (loopFulfill, masterReject) {

    utility.promiseWhile(function() {
        // Condition for stopping
        return i < gpxKeys.length;
    }, function() {
        // Action to run, should return a promise
        return new Promise(function (fulfill, reject) {

        var gpxEntry = _thisExcursion.gpx[gpxKeys[i]];

        var binaryBlob = blobUtil.blobToBinaryString(gpxEntry.blob).then(function(binaryString) {
          
          //reassign blob property to binaryString
          gpxEntry.blob = binaryString;

          //save updated gpxEntry to gpxReturn object
          gpxReturn[gpxKeys[i]] = gpxEntry;

          //iteration
          ++i;
          fulfill();

        });

      });

    }).then(function() {
        loopFulfill();
    });

  }).then(function() {
      
    console.log("REACHED THEN");

    //have to create export because of link to parent server
    var excursionExport = {
      name: _thisExcursion.name,
      gpx: gpxReturn
    }

    console.log('excursionExport');
    console.log(excursionExport);

    console.log('_thisExcursion');
    console.log(_thisExcursion);

    //return blobUtil.createBlob( [ JSON.stringify(excursionExport) ] , {type: 'application/json'} );

  });

*/

