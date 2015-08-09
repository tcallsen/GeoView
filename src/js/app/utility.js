'use strict';

var utility   = {};

utility.removeSpaces = function(string){
	return string.replace(/ /g,'').replace(new RegExp(":", "g"),'');
}

module.exports = utility;