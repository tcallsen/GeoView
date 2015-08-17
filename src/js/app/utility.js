'use strict';

var utility   = {};

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

module.exports = utility;