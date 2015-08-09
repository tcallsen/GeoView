'use strict';

var Reflux = require('reflux');

var defaults = {
    preEmit: function (){
        //arguments[0] contains args object for each event
        //e.g. the args in addPointToPage(args)
        ////console.log(arguments);
    },
    shouldEmit: function (args) {
        ////console.log('Add argument checks to prevent default event', args);
        return true;
    },
};

var Actions = Reflux.createActions({
    
    'registerService': {
        preEmit: defaults.preEmit,
        shouldEmit: defaults.shouldEmit
    },

    'triggerServiceEvent': {
        preEmit: defaults.preEmit,
        shouldEmit: defaults.shouldEmit
    }

});

module.exports = Actions;