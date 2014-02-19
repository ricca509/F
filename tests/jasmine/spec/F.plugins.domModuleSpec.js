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

beforeEach(function () {
    $('body').append('<div id="dom-test-container"><div id="test"><div id="article-list">article-list</div><div id="more-button">more-button</div><ul id="list"><li class="list"><span>1</span></li><li class="list"><span>2</span></li><li class="list"><span>3</span></li><li class="list"><span>4</span></li><li class="list"><span>5</span></li></ul><a href="#">link</a></div><div id="outside">outside</div></div>');
});

//loadFixtures('dom-test.html');

afterEach(function () {
    $('#dom-test-container').remove();
});

describe('The plugin F.plugins.domModule', function () {
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
                link: 'a[href="#"]'
            },
            events: {
                'click': {
                    'ul#list>li.list span': 'eventHandler',
                    'this.UI.link1, this.UI.link': 'eventHandler',
                    '@#outside': 'eventHandler'
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

        // Click on external element
        $('#outside').eq(0).trigger('click');
        expect(test).toBe(3);

        // Hover on external element
        $('#outside').eq(0).trigger('hover');
        expect(test).toBe(4);
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

