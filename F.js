var F = (function (undefined) {
    // This is the constructor function. It will be attached to the window object
    // and executed every time we call F(...). Returns a new 'instance' of the library.
    var root, slice, bind, bindAll, pageModule,
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
                self = new F;
 
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

    pageModule = {
        initModule: function (module) {
            console.log('initializing module');
 
            this.assignDefaultProps(module);
            this.resolveSelectors(module);
            this.bindEvents(module);
 
            if(module.init && typeof module.init === 'function') {
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
                    module.UI[key] = module.$(module.UI[key]);
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

    // Utility methods
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
 
    F.registerModule = function (namespaces, module, callback) {
        var i, l, baseObj;

        baseObj = root;
        namespaces = namespaces.split(/\./);
        l = namespaces.length;

        for (i = 0; i < l; i++) {
            if (!baseObj[namespaces[i]]) {
                if (i === l - 1 && module) {
                    baseObj[namespaces[i]] = pageModule.initModule(module);
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

    // The prototype object provides shared properties for other objects:
    // assigning the 'F' prototype to the 'init' prototype I'm sure the object
    // I return has all the methods declared for F
    F.fn.init.prototype = F.fn;

    // Attach the constructor function to the window object
    return root.F = F;
}).call(this);


//----------------------------------//
 
F.init("App");
App.registerModule("App.Views.Comment", {
    defaults: {
        numArticles: 5
    },
    el: '#test',
    UI: {
        articleList: '#article-list',
        moreButton: '#more-button',
        outside: '#outside'
    },
    events: {
        'click a[href=#]': 'handleLink'
    },
    handleLink: function (ev) {
        ev.preventDefault();
    },
    test: function() {
        console.log("Test called");
    },
    init: function() {
        this.test();
        this.a = 10;
    }
});
 
console.log(App.Views.Comment);
 
App.Views.Comment.test();