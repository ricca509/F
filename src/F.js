;(function (undefined) {
    'use strict';
    // This is the constructor function. It will be attached to the window object
    // and executed every time we call F(...). Returns a new 'instance' of the library.
    var root, resolveNamespace, initModule,
        F = function (args) {
            return new F.fn.init(args);
        };

    root = this;

    resolveNamespace = function (module) {
        var ns, obj = window;

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

    initModule = function (module) {
        module.type = module.type || 'default';
        return module;
    };

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
    F.defineModule = function (namespaces, module, afterDefined) {
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

        if (!_.isUndefined(afterDefined) && _.isFunction(afterDefined)) {
            afterDefined(module);
        }
    };

    F.extendModule = function (moduleA, moduleB, extendedNamespace, afterExtended) {
        // An object or string shall be passed.
        var extendedModule;
        moduleA = resolveNamespace(moduleA);
        moduleB = resolveNamespace(moduleB);

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
        module = resolveNamespace(module);

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

    // Plugins object for extendibility
    F.plugins = {};

    // Version
    F.version = '0.1.1';

    // Attach the constructor function to the window object
    root.F = F;
}).call(this);



