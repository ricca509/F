describe('The plugin F.plugins.pageModule', function() {
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

    it('make sure that module.$ finds only element in the scope of module.$el', function() {
        var instance = F.createInstance(F.Tests.TestModule);
        expect(instance.UI.$outside.length).toBe(0);
    });

    it('binds events to selectors', function() {
        var test = 0, handlers = {
            eventHandler: function(e) {
                test++;
            }
        };
        F.defineModule('Tests.eventsMod', {
            type: 'page',
            el: '#test',
            UI: {
                link: 'a[href="#"]'
            },
            events: {
                'click, hover': ['ul#list>li.list span, this.UI.link, @#outside', 'eventHandler']
            },
            eventHandler: handlers.eventHandler
        });

        var evMod = F.createInstance(Tests.eventsMod);

        // Click on internal selector
        evMod.$('ul#list>li.list span').eq(0).trigger('click');
        expect(test).toBe(1);

        // Click on cached element
        evMod.$('a[href="#"]').eq(0).trigger('click');
        expect(test).toBe(2);

        // Click on external element
        $('#outside').eq(0).trigger('click');
        expect(test).toBe(3);

        // Hover on external element
        $('#outside').eq(0).trigger('hover');
        expect(test).toBe(4);
    });
});
