// Module handlers
// The method that has to be present is the initModule, called by the core F lib

// Default Module
(function (F) {
    'use strict';
    var _module,

    initModule = function (module) {
        _module = module;
        return _module;
    };

    F.plugins.defaultModule = {
        initModule: initModule
    };
}(F));
