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
        if (module.$el) {
            if (!module.$el instanceof jQuery) {
                module.$el = $('body');
            } else {
                module.el = module.$el.length > 0 ? module.$el.selector : undefined;
            }
        } else {
            module.el = module.el || 'body';
            module.$el = $(module.el);
        }

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
        // 'click this.UI.tipTrigger, @#external-el > ul > li': Link1'
        var key, handler, events, selectors;
        this.checkEventsObject(module);
        for (key in module.events) {
            if(_.has(module.events, key)){
                handler = this.parseEventsHandler(module, key);
                events = this.parseEvents(module, key);
                selectors = this.parseSelectors(module, key);
                // Binding the event: 'this' will be the module, not the jQuery
                // element
                this.applyBinding(module, selectors, events, handler);
            }
        }
    },

    parseEvents: function(module, key) {
        return _.first(key.split(' '));
    },

    parseSelectors: function(module, key) {
        var left = key.split(' ');
        var selectorsList = _.without(left, _.first(left)).join(' ').split(',');
        var cached = [], external = [], internal = [], special = [], tmpEl,
            specialSelectorsList = {
                'document': document,
                'window': window
            };

        _.each(selectorsList, function(selector, idx) {
            selector = F.trim(selector);
            if (selector.indexOf('this.') === 0) {
                tmpEl = module.UI['$' + _.last(selector.split('.'))];
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
    },

    parseEventsHandler: function(module, key) {
        var handlerName = module.events[key];
        if (_.isUndefined(module[handlerName]) || !_.isFunction(module[handlerName])) {
            throw "Incorrect handler for events " + key;
        }
        return module[handlerName];
    },

    applyBinding: function(module, selectors, events, handler) {
        if (_.size(selectors.internal) > 0) {
            module.$el.on(events,
                          selectors.internal,
                          _.bind(handler, module));
        }

        if (_.size(selectors.external) > 0) {
            $(selectors.external).on(events, _.bind(handler, module));
        }

        if (_.size(selectors.special) > 0) {
            _.each(selectors.special, function(specialSelector) {
                $(specialSelector).on(events, _.bind(handler, module));
            });
        }

        if (_.size(selectors.cached) > 0) {
            _.each(selectors.cached, function(cachedSelector) {
                cachedSelector.on(events, _.bind(handler, module));
            });
        }
    },

    checkEventsObject: function(module) {
        var key;
        if (!module.events) {
            return;
        }
        for (key in module.events) {
            if(_.has(module.events, key)){
                if (!module.events[key]) {
                    throw "event object is incorrect";
                }
            }
        }
    }
};