;(function (undefined) {
    // This is the constructor function. It will be attached to the window object
    // and executed every time we call F(...). Returns a new 'instance' of the library.
    var root, slice, bind, bindAll, resolveNamespace, initModule,
        F = function (args) {
            return new F.fn.init(args);
        };

    root = this;

    slice = Array.prototype.slice;

    bind = Function.prototype.bind || function (obj) {
        var target, args, bound;

        target = this;
        args = slice.call(arguments, 1);
        bound = function () {
            var F, self;

            if (this instanceof bound) {
                F = function () {};
                F.prototype = target.prototype;
                self = new F();

                result = target.apply(self, args.concat(slice.call(arguments)));

                if (Object(result) === result) {
                    return result;
                }

                return self;
            } else {
                return target.apply(obj, args.concat(slice.call(arguments)));
            }
        };

        return bound;
    };

    bindAll = function (obj) {
        var key;

        for (key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] == "function") {
                obj[key] = bind.call(obj[key], obj);
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

        bindAll(module);

        if (callback) {
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
                onAfterCreate.call(newMod, newMod);
            }

            return decoratedModule;
        } else {
            console.log('No handler found for ' + handlerName + ' module');
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
        console.log('initializing module');

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
        module.$ = module.$el.find.bind(module.$el);
    },

    resolveSelectors: function(module) {
        console.log('Resolving selectors');
        for (var key in module.UI) {
           var val = module.UI[key];

            if(module.UI.hasOwnProperty(key)){
                module.UI['$' + key] = module.$(module.UI[key]);
            }
        }
    },

    bindEvents: function(module) {
        if (!module.events) {
            return;
        }
        for (var ev in module.events) {
            if(module.events.hasOwnProperty(ev)){
                console.log('Binding: ' + module.events[ev] + ' to ' + ev);
            }
        }
    }
};