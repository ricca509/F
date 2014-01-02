(function(F) {
    'use strict';
    // Callbacks bucket
    var calls = {};

    var trigger = function(topic, args) {
        var i, callback;
        if(!calls[topic]) {
            return;
        }

        for (i = 0; i < calls[topic].length; i++) {
            callback = calls[topic][i];
            if (typeof(callback) === 'function') {
                callback.call(null, args);
            }
        }
    };

    var on = function(topic, callback) {
        if(topic.trim().length === 0) {
            return false;
        }
        if(!calls[topic]) {
            calls[topic] = [];
        }
        return calls[topic].push(callback);
    };

    var off = function(topic, index) {
        index = index - 1;
        if (!calls[topic] || !calls[topic][index]) {
            return false;
        }
        calls[topic].splice(index, 1);
        return true;
    };

    F.evt = {
        on: on,
        off: off,
        trigger: trigger
    };
})(F);
