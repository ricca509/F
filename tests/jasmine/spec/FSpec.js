F.defineModule('F.Tests.TestModule', {
    defaults: {
        numArticles: 5
    },
    el: '#test',
    UI: {
        articleList: '#article-list',
        moreButton: '#more-button',
        outside: '#outside'
    },
    handleLink: function (ev) {
        ev.preventDefault();
    },
    test: function() {
        console.log('Test called');
    },
    init: function() {
        this.test();
        this.a = 10;
    }
});

describe('The F library', function() {

    it('expose a version property of type string', function() {
        expect(F.version).toBeDefined();
        expect(_.isString(F.version)).toBe(true);
    });

    it('can create an object given a complex namespace ("F.Tests.Module1")', function() {
        F.defineModule('F.Tests.Module1');
        expect(F.Tests.type).not.toBeDefined();
        expect(F.Tests.Module1).toBeDefined();
        expect(F.Tests.Module1.type).toBeDefined();
    });

    it('can create a namespace even for a number or a string', function() {
        F.defineModule('F.Tests.NumberMod', 5);
        F.defineModule('F.Tests.StringMod', 'test');

        expect(F.Tests.NumberMod).toBe(5);
        expect(F.Tests.StringMod).toBe('test');
    });

    it('assign the object a "default" type', function() {
        F.defineModule('F.Tests.Module2');
        expect(F.Tests.Module2.type).toBeDefined();
        expect(F.Tests.Module2.type).toBe('default');
    });

    it('calls the "afterDefined" callback when defining a module', function() {
        var callbacks = {
            onAfterDefined: function(module) {
                console.log('defined');
                console.log(module);
            }
        };

        spyOn(callbacks, 'onAfterDefined');

        F.defineModule('F.Tests.Module3', {
            a: 2,
            b: 3
        }, callbacks.onAfterDefined);

        expect(callbacks.onAfterDefined).toHaveBeenCalled();
        expect(callbacks.onAfterDefined.calls.length).toEqual(1);
    });

    it('can create an instance of an existing module ' +
       '(created with "F.defineModule") with the "F.createInstance" method', function() {
        expect(F.Tests.TestModule).toBeDefined();
        var instance = F.createInstance(F.Tests.TestModule);
        expect(instance.type).toBeDefined();
        expect(instance.defaults).toBeDefined();
        expect(instance.defaults.numArticles).toBe(5);
        expect(instance.el).toBe('#test');
    });

    it('can create an instance of an existing module ' +
       'even if the string representing the namespace is passed (\'F.Tests.TestModule\')', function() {
        var instance = F.createInstance('F.Tests.TestModule');
        expect(instance.type).toBeDefined();
    });

    it('can extend the standard instance of a module with additional configuration. ' +
       'Useful to define the root "el" element for every module we instantiate in a loop.' +
       'e.g. "var instance = F.createInstance(F.Tests.TestModule, {el: \'body\'});"', function() {
        expect(F.Tests.TestModule.el).toBe('#test');
        var instance = F.createInstance(F.Tests.TestModule, {
            el: 'body'
        });
        expect(instance.type).toBeDefined();
        expect(instance.el).toBe('body');
    });

    it('calls before and after callbacks if provided', function() {
        var callbacks = {
            onBefore: function(module) {
                console.log('Before');
                console.log(module);
            },
            onAfter: function(module) {
                console.log('After');
                console.log(module);
            }
        };
        spyOn(callbacks, 'onBefore');
        spyOn(callbacks, 'onAfter');
        var instance = F.createInstance(F.Tests.TestModule, {},
            callbacks.onBefore, callbacks.onAfter);

        expect(callbacks.onBefore).toHaveBeenCalled();
        expect(callbacks.onAfter).toHaveBeenCalled();
        expect(callbacks.onBefore.calls.length).toEqual(1);
        expect(callbacks.onAfter.calls.length).toEqual(1);
    });

    it('calls the init function of the module (if provided) when creating an instance', function() {
        var test = 0;
        F.defineModule('F.tests.initTest', {
            init: function() {
                test++;
            }
        });

        expect(test).toBe(0);

        F.createInstance('F.tests.initTest');

        expect(test).toBe(1);
    });

    it('can extend an object with another one', function() {
        var callbacks = {
            onAfterExtended: function(module) {
                console.log('defined');
                console.log(module);
            }
        };

        spyOn(callbacks, 'onAfterExtended');
        expect(_.isFunction(F.extendModule)).toBe(true);

        F.extendModule({
            a: '1',
            b: '2'
        }, {
            c: '3',
            d: '4'
        }, 'F.extended.objC', callbacks.onAfterExtended);

        expect(F.extended.objC).toBeDefined();
        expect(F.extended.objC.a).toBe('1');
        expect(F.extended.objC.b).toBe('2');
        expect(F.extended.objC.c).toBe('3');
        expect(F.extended.objC.d).toBe('4');
        expect(F.extended.objC.type).toBe('default');
        expect(callbacks.onAfterExtended).toHaveBeenCalled();
        expect(callbacks.onAfterExtended.calls.length).toEqual(1);

    });

    it('can extend an module with an object', function() {
        var callbacks = {
            onAfterExtended: function(module) {
                console.log('defined');
                console.log(module);
            }
        };

        spyOn(callbacks, 'onAfterExtended');
        expect(_.isFunction(F.extendModule)).toBe(true);

        F.defineModule('F.extended.objA', {
            one: 'string',
            two: function() {
                return 'function two';
            }
        });

        F.extendModule({
            three: 5,
            four: true
        }, 'F.extended.objA', 'F.extended.objB', callbacks.onAfterExtended);

        expect(F.extended.objB).toBeDefined();
        expect(F.extended.objB.one).toBe('string');
        expect(_.isFunction(F.extended.objB.two)).toBe(true);
        expect(F.extended.objB.three).toBe(5);
        expect(F.extended.objB.four).toBe(true);
        expect(callbacks.onAfterExtended).toHaveBeenCalled();
        expect(callbacks.onAfterExtended.calls.length).toEqual(1);

    });

});
