(function (F) {
    'use strict';
    var _module;
    var initModule = function (module) {
        _module = module;
        assignDefaultProps();
        resolveSelectors();
        bindEvents();
        return _module;
    };
    var assignDefaultProps = function () {
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
    var resolveSelectors = function () {
        var key, newSelectors = {};
        for (key in _module.UI) {
            if (_.has(_module.UI, key)) {
                newSelectors['$' + key] = _module.$(_module.UI[key]);
            }
        }
        _.merge(_module.UI, newSelectors);
    };
    var bindEvents = function () {
        var events;
        checkEventsObject();
        for (events in _module.events) {
            if (_.has(_module.events, events)) {
                bindAllSelectorToEvents(events);
            }
        }
    };
    var bindAllSelectorToEvents = function (events) {
        var handler, selectors, leftSide;
        for (leftSide in _module.events[events]) {
            handler = parseEventHandler(leftSide, _module.events[events][leftSide]);
            selectors = parseSelectors(leftSide, _module.events[events][leftSide]);
            applyBinding(selectors, events, handler);
        }
    };
    var parseSelectors = function (key, value) {
        var left = key;
        var selectorsList = left.split(',');
        var cached = [], external = [], internal = [], special = [], tmpEl, specialSelectorsList = {
            document: document,
            window: window
        };
        _.each(selectorsList, function (selector) {
            selector = F.str.trim(selector);
            var splitSelector;
            if (selector.indexOf('this.') === 0) {
                splitSelector = selector.split('.');
                // Remove the "this" from the selector
                splitSelector = _.without(splitSelector, _.first(splitSelector));
                // Add the $ to the last part of the selector if missing
                splitSelector[splitSelector.length - 1] = _.last(splitSelector).indexOf('$') === 0 ?
                    _.last(splitSelector) :
                    '$' + _.last(splitSelector);
                // Resolve the object given _module as context
                tmpEl = F.resolveNamespace(splitSelector.join('.'), _module);
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
    var parseEventHandler = function (key, value) {
        var handler = value;
        if (_.isString(handler)) {
            handler = _module[handler];
        }
        if (_.isUndefined(handler) || !_.isFunction(handler)) {
            throw 'Incorrect handler for events ' + key;
        }
        return handler;
    };
    var applyBinding = function (selectors, events, handler) {
        if (_.size(selectors.internal) > 0) {
            _module.$el.on(events, selectors.internal, _.bind(handler, _module));
        }
        if (_.size(selectors.external) > 0) {
            $('body').on(events, selectors.external, _.bind(handler, _module));
        }
        if (_.size(selectors.special) > 0) {
            _.each(selectors.special, function (specialSelector) {
                $(specialSelector).on(events, _.bind(handler, _module));
            });
        }
        if (_.size(selectors.cached) > 0) {
            _.each(selectors.cached, function (cachedSelector) {
                cachedSelector.on(events, _.bind(handler, _module));
            });
        }
    };
    var checkEventsObject = function () {
        var key;
        if (!_module.events) {
            return;
        }
        for (key in _module.events) {
            if (_.has(_module.events, key)) {
                if (!_module.events[key]) {
                    throw 'event object is incorrect';
                }
            }
        }
    };
    F.plugins.domModule = {
        initModule: initModule
    };
})(F);
