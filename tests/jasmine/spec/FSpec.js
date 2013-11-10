describe('The F library', function() {
    F.defineModule("F.Tests.TestModule", {
        type: 'page',
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

    it('can create an object given a complex namespace ("F.Tests.Module1")', function(){
        F.defineModule("F.Tests.Module1");
        expect(F.Tests.type).not.toBeDefined();
        expect(F.Tests.Module1).toBeDefined();
        expect(F.Tests.Module1.type).toBeDefined();
    });

    it('assign the object a "default" type', function(){
        F.defineModule("F.Tests.Module2");
        expect(F.Tests.Module2.type).toBeDefined();
        expect(F.Tests.Module2.type).toBe('default');
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

    it('converts the "el" selector in a jQuery element ($el)', function() {
        var instance = F.createInstance(F.Tests.TestModule);
        expect(instance.$el).toBeDefined();
        expect(instance.$el.length).toBe(1);
    });

    it('converts the UI object in jQuery elements', function() {
        var instance = F.createInstance(F.Tests.TestModule);
        expect(instance.UI).toBeDefined();
        expect(instance.UI.articleList).toBe('#article-list');
        expect(instance.UI.$articleList).toBeDefined();
        expect(instance.UI.$articleList.length).toBe(1);
    });

    it('adds a module.$ function as a shortcut to module.$el.find', function() {
        var instance = F.createInstance(F.Tests.TestModule);
        expect(instance.$).toBeDefined();
    });

    it('make sure that module.$ find only element in the scope of module.$el', function() {
        var instance = F.createInstance(F.Tests.TestModule);
        expect(instance.UI.$outside.length).toBe(0);
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
        spyOn(callbacks, "onBefore");
        spyOn(callbacks, "onAfter");
        var instance = F.createInstance(F.Tests.TestModule, {},
            callbacks.onBefore, callbacks.onAfter);

        expect(callbacks.onBefore).toHaveBeenCalled();
        expect(callbacks.onAfter).toHaveBeenCalled();
        expect(callbacks.onBefore.calls.length).toEqual(1);
        expect(callbacks.onAfter.calls.length).toEqual(1);
    });

    it('can be register under any other name', function() {
        F.init("App");
        expect(window.App).not.toBeUndefined();
    });

});
