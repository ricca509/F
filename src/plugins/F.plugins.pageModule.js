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
        module.$ = _.bind(module.$el.find, module.$el);
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
        var selectorLeft, handler, parsedEventSelector;
        if (!module.events) {
            return;
        }
        for (selectorLeft in module.events) {
            if(module.events.hasOwnProperty(selectorLeft)){
                handler = this.resolveEventHandler(module, module.events[selectorLeft]);
                parsedEventSelector = this.parseEventSelector(selectorLeft);
                module.$el.on(parsedEventSelector.ev,
                              parsedEventSelector.selector,
                              handler);

                console.log(module.$el.selector + '.on("' +
                            parsedEventSelector.ev + '", "' +
                            parsedEventSelector.selector + '", ' +
                            'function' + ');');
            }
        }
    },

    parseEventSelector: function(eventSelector) {
        console.log('parseEventSelector ' + eventSelector);
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