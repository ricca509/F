;(function (undefined) {
    // This is the constructor function. It will be attached to the window object
    // and executed every time we call F(...). Returns a new 'instance' of the library.
    var root, slice, bindAll, resolveNamespace, initModule,
        F = function (args) {
            return new F.fn.init(args);
        };

    root = this;

    slice = Array.prototype.slice;

    bindAll = function (obj) {
        var key;

        for (key in obj) {
            if (_.has(obj, key) && _.isFunction(obj[key])) {
                obj[key] = _.bind(obj[key], obj);
            }
        }
    };

    resolveNamespace = function(nsString) {
        var ns = nsString.split('.'),
            obj = window;

        for (var i = 0, len = ns.length; i < len; ++i) {
            obj = obj[ns[i]];
        }

        return obj;
    };

    initModule = function(module) {
        module.type = module.type || 'default';
        return module;
    };

    // Plugins object for extendibility
    F.plugins = {};

    // Exposed utility methods
    F.init = function (namespace) {
        if (root.F) {
            try {
                delete root.F;
            } catch (ex) {
                root.F = undefined;
            }

            root[namespace] = this;
        }
    };

    // Defines an object in the given namespace
    F.defineModule = function (namespaces, module, callback) {
        var i, l, baseObj;

        baseObj = root;
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

        //bindAll(module);

        if (!_.isUndefined(callback) && _.isFunction(callback)) {
            // TODO: check this to invoke the callback with apply and pass the
            // right context (this)
            callback(module);
        }
    };

    F.createInstance = function(module, opts, onBeforeCreate, onAfterCreate) {
        // An object or string shall be passed.
        if (!_.isObject(module)) {
            if (_.isString(module)) {
                module = resolveNamespace(module);
            } else {
                return;
            }
        }
        var newMod = _.extend({}, module, opts),
            handlerName = newMod.type + 'Module',
            moduleHandler = F.plugins[handlerName],
            decoratedModule;

        // Delegate instantiation
        if(!_.isUndefined(moduleHandler) && _.isFunction(moduleHandler.initModule)) {
            if(!_.isUndefined(onBeforeCreate) && _.isFunction(onBeforeCreate)) {
                onBeforeCreate.call(newMod, newMod);

            }
            // Call the right handler, passing the handler itself as a scope
            decoratedModule = moduleHandler.initModule.call(moduleHandler, newMod);

            if(!_.isUndefined(onAfterCreate) && _.isFunction(onAfterCreate)) {
                onAfterCreate.call(decoratedModule, decoratedModule);
            }

            return decoratedModule;
        } else {
            0;
        }

        return;
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

    // Attach the constructor function to the window object
    root.F = F;
}).call(this);




// Module handlers
// The method that has to be present is the initModule, called by the core F lib

// Default Module
F.plugins.defaultModule = {
    initModule: function (module) {
        return module;
    }
};
// Page Module
F.plugins.pageModule = {
    initModule: function (module) {

        this.assignDefaultProps(module);
        this.resolveSelectors(module);
        this.bindEvents(module);

        if(!_.isUndefined(module.init) && _.isFunction(module.init)) {
            module.init.call(module);
        }

        return module;
    },

    assignDefaultProps: function(module) {
        module.el = module.el || 'body';
        module.$el = $(module.el);
        module.$ = _.bind(module.$el.find, module.$el);
    },

    resolveSelectors: function(module) {
        var key,
            newSelectors = {};
        for (key in module.UI) {           
            if(_.has(module.UI, key)){
                newSelectors['$' + key] = module.$(module.UI[key]);                
            }
        }
        _.extend(module.UI, newSelectors);
    },    

    bindEvents: function(module) {
        var selectorLeft, handler, parsedEventSelector;
        if (!module.events) {
            return;
        }
        for (selectorLeft in module.events) {
            if(module.events.hasOwnProperty(selectorLeft)){
                // Binding the event: 'this' will be the module, not the jQuery
                // element
                handler = this.resolveEventHandler(module, module.events[selectorLeft]);
                parsedEventSelector = this.parseEventSelector(selectorLeft);
                module.$el.on(parsedEventSelector.ev,
                              parsedEventSelector.selector,
                              _.bind(handler, module));
                
            }
        }
    },

    parseEventSelector: function(eventSelector) {        
        var splitEventSelector = eventSelector.split(' ');

        return {
            ev: _.first(splitEventSelector),
            selector: _.rest(splitEventSelector, 1).join(' ')
        };
    },

    resolveEventHandler: function(module, handlerName) {
        if (_.isUndefined(module[handlerName]) || !_.isFunction(module[handlerName])) {
            return;
        }
        return module[handlerName];
    }
};