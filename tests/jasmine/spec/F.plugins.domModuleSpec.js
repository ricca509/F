F.defineModule('F.Tests.TestdomModule', {
    type: 'dom',
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
        'click': {
            'ul>li.list img, this.UI.articleList, @window, #test, @#external > ul': 'handleLink'
       },
       'focus': {
           'ul>li.list img, this.UI.articleList, @window, #test, @#external > ul': 'handleLink'
       }
    },
    handleLink: function (ev) {
        ev.preventDefault();
    },
    test: function () {
        console.log('Test called');
    },
    init: function () {
        this.test();
        this.a = 10;
    }
});

describe('The plugin F.plugins.domModule', function () {
    // set up the async spec
    var async = new AsyncSpec(this);

    function getFixture (done) {
        $.get('/tests/jasmine/spec/fixtures/dom-test.html', function (data) {
            $('body').append(data);
            done();
        });
    }

    async.beforeEach(function (done) {
        getFixture(done);
    });

    afterEach(function () {
        $('#dom-test-container').remove();
    });

    it('converts the "el" selector in a jQuery element ($el)', function () {
        var instance = F.createInstance(F.Tests.TestdomModule);
        expect(instance.$el).toBeDefined();
        expect(instance.$el.length).toBe(1);
    });

    it('converts the UI object in jQuery elements', function () {
        var instance = F.createInstance(F.Tests.TestdomModule);
        expect(instance.UI).toBeDefined();
        expect(instance.UI.articleList).toBe('#article-list');
        expect(instance.UI.$articleList).toBeDefined();
        expect(instance.UI.$articleList.length).toBe(1);
    });

    it('does not modify the UI element of the module definition', function () {
        F.defineModule('F.Tests.modifiedUI', {
            type: 'dom',
            UI: {
                'button': '.btn'
            }
        });
        var instances = [];
        $('.list').each(function () {
            var $elem = $(this);
            instances.push(F.createInstance('F.Tests.modifiedUI', {
                $el: $elem
            }));
        });

        expect(instances.length).toBe(5);
        expect(Object.keys(instances[0].UI).length).toBe(2);
    });

    it('adds a module.$ function as a shortcut to module.$el.find', function () {
        var instance = F.createInstance(F.Tests.TestdomModule);
        expect(instance.$).toBeDefined();
    });

    it('make sure that module.$ finds only element in the scope of module.$el', function () {
        var instance = F.createInstance(F.Tests.TestdomModule);
        expect(instance.UI.$outside.length).toBe(0);
    });

    it('binds events to selectors', function () {
        var test = 0, handlers = {
            eventHandler: function (e) {
                e.preventDefault();
                test++;
            }
        };
        F.defineModule('Tests.eventsMod', {
            type: 'dom',
            el: '#test',
            UI: {
                link: 'a[href="#"]',
                link1: 'a[href="#1"]'
            },
            events: {
                'click': {
                    'ul#list>li.list span': 'eventHandler',
                    'this.UI.link': 'eventHandler',
                    'this.UI.$link1': 'eventHandler',
                    '@#outside, @#outside2, @#outside3, @#outside4-later': 'eventHandler'
                },
                'hover': {
                    '@#outside': 'eventHandler'
                }
            },
            eventHandler: handlers.eventHandler
        });

        var evMod = F.createInstance(Tests.eventsMod);

        // Click on internal selector
        evMod.$('ul#list>li.list span').eq(0).trigger('click');
        expect(test).toBe(1);

        // Click on cached element
        evMod.UI.$link.trigger('click');
        expect(test).toBe(2);

        evMod.UI.$link1.trigger('click');
        expect(test).toBe(3);

        // Click on external element
        $('#outside').eq(0).trigger('click');
        expect(test).toBe(4);

        // Hover on external element
        $('#outside').eq(0).trigger('hover');
        expect(test).toBe(5);

        // Click on external element
        $('#outside2').eq(0).trigger('click');
        expect(test).toBe(6);

        // Click on external element
        $('#outside3').eq(0).trigger('click');
        expect(test).toBe(7);

        $('#dom-test-container').append('<div id="outside4-later">outside4</div>');

        // Click on external element
        $('#outside4-later').eq(0).trigger('click');
        expect(test).toBe(8);
    });

    it('binds events to the root element (el)', function () {
        var test = 0, handlers = {
            eventHandler: function (e) {
                e.preventDefault();
                test++;
            }
        };

        var evMod = F.createInstance({
            type: 'dom',
            el: 'form#test-form',
            events: {
                'submit': {
                    'this.el': 'eventHandler'
                }
            },
            eventHandler: handlers.eventHandler
        });

        evMod.$el.trigger('submit');
        expect(test).toBe(1);
    });

    it('binds events to the root element ($el)', function () {
        var test = 0, handlers = {
            eventHandler: function (e) {
                e.preventDefault();
                test++;
            }
        };

        var evMod = F.createInstance({
            type: 'dom',
            el: 'form#test-form',
            events: {
                'submit': {
                    'this.$el': 'eventHandler'
                }
            },
            eventHandler: handlers.eventHandler
        });

        evMod.$el.trigger('submit');
        expect(test).toBe(1);
    });

    it('binds events to the window object', function () {
        var test = 0, handlers = {
            eventHandler: function (e) {
                test++;
            }
        };
        F.defineModule('Tests.windowTest', {
            type: 'dom',
            events: {
                'click': {
                    '@window': 'eventHandler'
                }
            },
            eventHandler: handlers.eventHandler
        });

        var instance = F.createInstance('Tests.windowTest');
        $(window).trigger('click');
        expect(test).toBe(1);

    });

    it('binds events to the document object', function () {
        var test = 0, handlers = {
            eventHandler: function (e) {
                test++;
            }
        };
        F.defineModule('Tests.documentTest', {
            type: 'dom',
            events: {
                'click': {
                    '@document': 'eventHandler'
                }
            },
            eventHandler: handlers.eventHandler
        });

        var instance = F.createInstance('Tests.documentTest');
        $(document).trigger('click');
        expect(test).toBe(1);
    });

    it('accept the name of the function (as a string) as event handler', function () {
        var test = 0;

        F.defineModule('Tests.handlerTest', {
            type: 'dom',
            events: {
                'click': {
                    'ul#list': 'handler'
                }
            },
            handler: function () {
                test++;
            }
        });

        F.createInstance('Tests.handlerTest');
        expect(test).toBe(0);
        $('ul#list').trigger('click');
        expect(test).toBe(1);
    });

    it('accept a function as event handler', function () {
        var test = 0, test2 = 0,
            handlers = {
                eventHandler: function () {
                    test++;
                }
            };

        F.defineModule('Tests.handlerTest2', {
            type: 'dom',
            events: {
                'click': {
                    'ul#list':  function () {
                        test2++;
                    },
                    '@#outside': handlers.eventHandler
               }
            }
        });

        F.createInstance('Tests.handlerTest2');
        expect(test).toBe(0);
        expect(test2).toBe(0);
        $('ul#list').trigger('click');
        expect(test2).toBe(1);
        expect(test).toBe(0);
        $('#outside').trigger('click');
        expect(test2).toBe(1);

    });

    it('does not update the $el if it is provided', function () {
        var $el = $('#list');
        F.defineModule('Tests.eventsMod.$elTest', {
            type: 'dom',
            el: '.test'
        });

        var test = F.createInstance('Tests.eventsMod.$elTest', {
            $el: $el
        });

        expect(test.$el).toBe($el);
    });
});

