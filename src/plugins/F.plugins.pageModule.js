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
        // 'click, focus': ['this.UI.tipTrigger, @#external-el > ul > li','Link1'],
        var eventsLeft, handler, events, selectors;
        this.checkEventsObject(module);
        for (eventsLeft in module.events) {
            if(_.has(module.events, eventsLeft)){
                // Binding the event: 'this' will be the module, not the jQuery
                // element
                handler = this.parseEventsHandler(module, eventsLeft);
                events = this.parseEvents(module, eventsLeft);
                selectors = this.parseSelectors(module, eventsLeft);
                
                this.applyBinding(module, selectors, events, handler);
            }
        }
    },    

    parseEvents: function(module, key) {
        return key.split(',');       
    },

    parseSelectors: function(module, key) {
        var rightSide = module.events[key];
        var selectorsList = _.without(rightSide, _.last(rightSide))[0].split(',');
        var cached = [], external = [], internal = [];

        _.each(selectorsList, function(selector, idx) {
            selector = $.trim(selector);
            // Cached selectors
            if (selector.indexOf('this.') === 0) {                
                cached.push(module.UI['$' + _.last(selector.split('.'))]);
            } else if (selector.indexOf('@') === 0) {
                external.push(selector.substring(1));
            } else {
                internal.push(selector);
            }
        });        

        return {
            cached: cached,
            external: external.join(','),
            internal: internal.join(',')
        };
    },

    parseEventsHandler: function(module, key) {
        var rightSide = module.events[key],
            handlerName;
        handlerName = _.last(rightSide);
        if (_.isUndefined(module[handlerName]) || !_.isFunction(module[handlerName])) {
            throw "Incorrect handler for events " + key;
        }
        return module[handlerName];
    },

    applyBinding: function(module, selectors, events, handler) {
        _.each(events, function(ev) {
            if (selectors.internal.length > 0) {
                module.$el.on(ev,
                              selectors.internal,
                              _.bind(handler, module));
            }                    

            if (selectors.external.length > 0) {
                $(selectors.external).on(ev, _.bind(handler, module));
            }

            if (selectors.cached.length > 0) {
                _.each(selectors.cached, function(cachedSelector) {
                    cachedSelector.on(ev, _.bind(handler, module));
                });
            }
        });   
    },

    checkEventsObject: function(module) {
        var key;
        if (!module.events) {
            return;
        }
        for (key in module.events) {
            if(_.has(module.events, key)){
                if (!module.events[key] || 
                    !_.isArray(module.events[key]) || 
                    module.events[key].length !== 2) {
                    throw "event object is incorrect";
                }
            }
        }
    }
};