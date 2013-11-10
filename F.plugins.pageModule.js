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