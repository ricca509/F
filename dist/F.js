;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.F = factory();
    }
}(this, function (undefined) {
    'use strict';
    // This is the constructor function. It will be attached to the window object
    // and executed every time we call F(...). Returns a new 'instance' of the library.
    var initModule,
        F = function (args) {
            return new F.fn.init(args);
        };

    initModule = function (module) {
        module.type = module.type || 'default';
        return module;
    };

    // Exposed utility methods
    F.init = function (namespace) {
    };

    F.resolveNamespace = function (module, ctx) {
        var ns,
            obj = ctx || window;

        if (_.isObject(module)) {
            obj = module;
        } else {
            if (_.isString(module)) {
                ns = module.split('.');
                for (var i = 0, len = ns.length; i < len; ++i) {
                    obj = obj[ns[i]];
                }
            } else {
                throw 'You must pass an object or a namespace string';
            }
        }

        return obj;
    };

    // Defines an object in the given namespace
    F.defineModule = function (namespaces, module, afterDefined) {
        var i, l, baseObj;

        baseObj = window;
        namespaces = namespaces.split(/\./);
        l = namespaces.length;

        // Fallback to an empty object
        module = module || {};

        for (i = 0; i < l; i++) {
            if (!baseObj[namespaces[i]]) {
                if (i === l - 1 && module) {
                    baseObj[namespaces[i]] = initModule(module);
                } else {
                    baseObj[namespaces[i]] = {};
                }
            }
            baseObj = baseObj[namespaces[i]];
        }

        if (!_.isUndefined(afterDefined) && _.isFunction(afterDefined)) {
            afterDefined(module);
        }
    };

    F.extendModule = function (moduleA, moduleB, extendedNamespace, afterExtended) {
        // An object or string shall be passed.
        var extendedModule;
        moduleA = F.resolveNamespace(moduleA);
        moduleB = F.resolveNamespace(moduleB);

        if (moduleA.type && moduleB.type && moduleA.type !== moduleB.type) {
            throw 'Extend object with the same "type" property';
        }

        if (_.isObject(moduleA) && _.isObject(moduleB)) {
            extendedModule = _.merge(moduleA, moduleB);
            F.defineModule(extendedNamespace, extendedModule, afterExtended);
        } else {
            throw 'F can only extend plain objects';
        }
    };

    F.createInstance = function (module, opts, onBeforeCreate, onAfterCreate) {
        // An object or string shall be passed.
        module = F.resolveNamespace(module);

        var newMod = _.merge({}, module, opts);
        var handlerName = newMod.type + 'Module',
            moduleHandler = F.plugins[handlerName],
            decoratedModule;

        // Delegate instantiation
        if (!_.isUndefined(moduleHandler) && _.isFunction(moduleHandler.initModule)) {
            if (!_.isUndefined(onBeforeCreate) && _.isFunction(onBeforeCreate)) {
                onBeforeCreate.call(newMod, newMod);
            }
            // Call the right handler, passing the handler itself as a scope
            decoratedModule = moduleHandler.initModule.call(moduleHandler, newMod);

            // Call the init function of the module if provided
            if (!_.isUndefined(decoratedModule.init) && _.isFunction(decoratedModule.init)) {
                decoratedModule.init.call(decoratedModule);
            }

            if (!_.isUndefined(onAfterCreate) && _.isFunction(onAfterCreate)) {
                onAfterCreate.call(decoratedModule, decoratedModule);
            }

            return decoratedModule;
        } else {
            throw 'No handler found for ' + handlerName + ' module';
        }
    };

    // Create the 'fn' object which is the same as 'prototype' to enable a simpler way to extend the library
    F.fn = F.prototype = {
        // Core functions
        // Add all core functions here, be sure to return 'this' to enable cascading
        init: function (args) {
            // The init function gets called by the constructor.
            // Check args and initialize local variables attaching them to 'this'
            if (args === undefined) {
                return this;
            } else {
                this.args = args;
                return this;
            }
        }
    };

    // The prototype object provides shared properties for other objects:
    // assigning the 'F' prototype to the 'init' prototype I'm sure the object
    // I return has all the methods declared for F
    F.fn.init.prototype = F.fn;

    // Plugins object for extendability
    F.plugins = {};

    // Version
    F.version = '0.2.0';

    // Attach the constructor function to the window object
    return F;
}));




(function (F) {
    'use strict';
    // Callbacks bucket
    var calls = {};

    var trigger = function (topic, args) {
        var i, callback;
        if (!calls[topic]) {
            return;
        }

        for (i = 0; i < calls[topic].length; i++) {
            callback = calls[topic][i];
            if (typeof(callback) === 'function') {
                callback.call(null, args);
            }
        }
    };

    var on = function (topic, callback) {
        if (topic.trim().length === 0) {
            return false;
        }
        if (!calls[topic]) {
            calls[topic] = [];
        }
        return calls[topic].push(callback);
    };

    var off = function (topic, index) {
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

(function (F) {
    'use strict';
    var _module;
    var initModule = function (module) {
        _module = module;
        assignDefaultProps();
        resolveSelectors();
        bindEvents();
        return _module;
    };
    var assignDefaultProps = function () {
        if (_module.$el) {
            if (!_module.$el instanceof jQuery) {
                _module.$el = $('body');
            } else {
                _module.el = _module.$el.length > 0 ? _module.$el.selector : undefined;
            }
        } else {
            _module.el = _module.el || 'body';
            _module.$el = $(_module.el);
        }
        _module.$ = _.bind(_module.$el.find, _module.$el);
    };
    var resolveSelectors = function () {
        var key, newSelectors = {};
        for (key in _module.UI) {
            if (_.has(_module.UI, key)) {
                newSelectors['$' + key] = _module.$(_module.UI[key]);
            }
        }
        _.merge(_module.UI, newSelectors);
    };
    var bindEvents = function () {
        var events;
        checkEventsObject();
        for (events in _module.events) {
            if (_.has(_module.events, events)) {
                bindAllSelectorToEvents(events);
            }
        }
    };
    var bindAllSelectorToEvents = function (events) {
        var handler, selectors, leftSide;
        for (leftSide in _module.events[events]) {
            handler = parseEventHandler(leftSide, _module.events[events][leftSide]);
            selectors = parseSelectors(leftSide, _module.events[events][leftSide]);
            applyBinding(selectors, events, handler);
        }
    };
    var parseSelectors = function (key, value) {
        var left = key;
        var selectorsList = left.split(',');
        var cached = [], external = [], internal = [], special = [], tmpEl, specialSelectorsList = {
            document: document,
            window: window
        };
        _.each(selectorsList, function (selector) {
            selector = F.str.trim(selector);
            var splitSelector;
            if (selector.indexOf('this.') === 0) {
                splitSelector = selector.split('.');
                // Remove the "this" from the selector
                splitSelector = _.without(splitSelector, _.first(splitSelector));
                // Add the $ to the last part of the selector if missing
                splitSelector[splitSelector.length - 1] = _.last(splitSelector).indexOf('$') === 0 ?
                    _.last(splitSelector) :
                    '$' + _.last(splitSelector);
                // Resolve the object given _module as context
                tmpEl = F.resolveNamespace(splitSelector.join('.'), _module);
                if (tmpEl && tmpEl instanceof jQuery && !_.contains(cached, tmpEl)) {
                    cached.push(tmpEl);
                }
            } else if (selector.indexOf('@') === 0) {
                tmpEl = selector.substring(1);
                if (specialSelectorsList[tmpEl] && !_.contains(special, specialSelectorsList[tmpEl])) {
                    special.push(specialSelectorsList[tmpEl]);
                } else if (!_.contains(external, tmpEl)) {
                    external.push(tmpEl);
                }
            } else {
                if (!_.contains(internal, selector)) {
                    internal.push(selector);
                }
            }
        });
        return {
            cached: cached,
            external: external.join(','),
            internal: internal.join(','),
            special: special
        };
    };
    var parseEventHandler = function (key, value) {
        var handler = value;
        if (_.isString(handler)) {
            handler = _module[handler];
        }
        if (_.isUndefined(handler) || !_.isFunction(handler)) {
            throw 'Incorrect handler for events ' + key;
        }
        return handler;
    };
    var applyBinding = function (selectors, events, handler) {
        if (_.size(selectors.internal) > 0) {
            _module.$el.on(events, selectors.internal, _.bind(handler, _module));
        }
        if (_.size(selectors.external) > 0) {
            $('body').on(events, selectors.external, _.bind(handler, _module));
        }
        if (_.size(selectors.special) > 0) {
            _.each(selectors.special, function (specialSelector) {
                $(specialSelector).on(events, _.bind(handler, _module));
            });
        }
        if (_.size(selectors.cached) > 0) {
            _.each(selectors.cached, function (cachedSelector) {
                cachedSelector.on(events, _.bind(handler, _module));
            });
        }
    };
    var checkEventsObject = function () {
        var key;
        if (!_module.events) {
            return;
        }
        for (key in _module.events) {
            if (_.has(_module.events, key)) {
                if (!_module.events[key]) {
                    throw 'event object is incorrect';
                }
            }
        }
    };
    F.plugins.domModule = {
        initModule: initModule
    };
})(F);
