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
        var eventsLeft, handler, parsedEventSelector;
        if (!module.events) {
            return;
        }
        for (eventsLeft in module.events) {
            if(_.has(module.events, eventsLeft)){
                // Binding the event: 'this' will be the module, not the jQuery
                // element
                handler = this.resolveEventHandler(module, module.events[eventsLeft]);
                parsedEventSelector = this.parseEventSelector(eventsLeft);
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