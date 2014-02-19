(function (F) {
    'use strict';
    // String helpers
    var trimStart = function (str) {
        return str.replace(/^\s+/, '');
    },

    trimEnd = function (str) {
        return str.replace(/\s+$/, '');
    },

    trim = function (str) {
        return str.replace(/(^\s+|\s+$)/g,'');
    };

    F.str = {
        trimStart: trimStart,
        trimEnd: trimEnd,
        trim: trim
    };
}(F));
