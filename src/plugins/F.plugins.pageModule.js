// Page Module
(function(F) {
    'use strict';
    var _module;

    var initModule = function(module) {
        _module = module;

        assignDefaultProps();
        resolveSelectors();
        bindEvents();

        if(!_.isUndefined(_module.init) && _.isFunction(_module.init)) {
            _module.init.call(_module);
        }

        return _module;
    };

    var assignDefaultProps = function() {
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

    var resolveSelectors = function() {
        var key,
            newSelectors = {};
        for (key in _module.UI) {
            if(_.has(_module.UI, key)){
                newSelectors['$' + key] = _module.$(_module.UI[key]);
            }
        }
        _.extend(_module.UI, newSelectors);
    };

    var bindEvents = function() {
        // 'click this.UI.tipTrigger, @#external-el > ul > li': Link1'
        var key, handler, events, selectors;
        checkEventsObject();
        for (key in _module.events) {
            if(_.has(_module.events, key)){
                handler = parseEventsHandler(key);
                events = parseEvents(key);
                selectors = parseSelectors(key);
                // Binding the event: 'this' will be the _module, not the jQuery
                // element
                applyBinding(selectors, events, handler);
            }
        }
    };

    var parseEvents = function(key) {
        return _.first(key.split(' '));
    };

    var parseSelectors = function(key) {
        var left = key.split(' ');
        var selectorsList = _.without(left, _.first(left)).join(' ').split(',');
        var cached = [], external = [], internal = [], special = [], tmpEl,
            specialSelectorsList = {
                'document': document,
                'window': window
            };

        _.each(selectorsList, function(selector, idx) {
            selector = F.str.trim(selector);
            if (selector.indexOf('this.') === 0) {
                tmpEl = _module.UI['$' + _.last(selector.split('.'))];
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

    var parseEventsHandler = function(key) {
        var handlerName = _module.events[key];
        if (_.isUndefined(_module[handlerName]) || !_.isFunction(_module[handlerName])) {
            throw "Incorrect handler for events " + key;
        }
        return _module[handlerName];
    };

    var applyBinding = function(selectors, events, handler) {
        if (_.size(selectors.internal) > 0) {
            _module.$el.on(events,
                selectors.internal,
                _.bind(handler, _module));
        }

        if (_.size(selectors.external) > 0) {
            $(selectors.external).on(events, _.bind(handler, _module));
        }

        if (_.size(selectors.special) > 0) {
            _.each(selectors.special, function(specialSelector) {
                $(specialSelector).on(events, _.bind(handler, _module));
            });
        }

        if (_.size(selectors.cached) > 0) {
            _.each(selectors.cached, function(cachedSelector) {
                cachedSelector.on(events, _.bind(handler, _module));
            });
        }
    };

    var checkEventsObject = function() {
        var key;
        if (!_module.events) {
            return;
        }
        for (key in _module.events) {
            if(_.has(_module.events, key)){
                if (!_module.events[key]) {
                    throw "event object is incorrect";
                }
            }
        }
    };

    F.plugins.pageModule = {
        initModule: initModule
    };
}(F));