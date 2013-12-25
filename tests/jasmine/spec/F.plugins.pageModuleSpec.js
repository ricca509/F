F.defineModule("F.Tests.TestPageModule", {
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
        'click ul>li.list img, this.UI.articleList, @window, #test, @#external > ul': 'handleLink',
        'focus ul>li.list img, this.UI.articleList, @window, #test, @#external > ul': 'handleLink'
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

beforeEach(function() {
    $('body').append('<div id="dom-test-container"><div id="test"><div id="article-list">article-list</div><div id="more-button">more-button</div><ul id="list"><li class="list"><span>1</span></li><li class="list"><span>2</span></li><li class="list"><span>3</span></li><li class="list"><span>4</span></li><li class="list"><span>5</span></li></ul><a href="#">link</a></div><div id="outside">outside</div></div>');
});

afterEach(function() {
    $('#dom-test-container').remove();
});

describe('The plugin F.plugins.pageModule', function() {
    it('converts the "el" selector in a jQuery element ($el)', function() {

        var instance = F.createInstance(F.Tests.TestPageModule);
        expect(instance.$el).toBeDefined();
        expect(instance.$el.length).toBe(1);
    });

    it('converts the UI object in jQuery elements', function() {
        var instance = F.createInstance(F.Tests.TestPageModule);
        expect(instance.UI).toBeDefined();
        expect(instance.UI.articleList).toBe('#article-list');
        expect(instance.UI.$articleList).toBeDefined();
        expect(instance.UI.$articleList.length).toBe(1);
    });

    it('adds a module.$ function as a shortcut to module.$el.find', function() {
        var instance = F.createInstance(F.Tests.TestPageModule);
        expect(instance.$).toBeDefined();
    });

    it('make sure that module.$ finds only element in the scope of module.$el', function() {
        var instance = F.createInstance(F.Tests.TestPageModule);
        expect(instance.UI.$outside.length).toBe(0);
    });

    it('binds events to selectors', function() {
        var test = 0, handlers = {
            eventHandler: function(e) {
                e.preventDefault();
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
                'click ul#list>li.list span, ul#list>li.list span': 'eventHandler',
                'click this.UI.link1, this.UI.link': 'eventHandler',
                'click @#outside, @#outside': 'eventHandler',
                'hover @#outside': 'eventHandler',
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

    it('binds events to the window object', function() {
        var test = 0, handlers = {
            eventHandler: function(e) {
                test++;
            }
        };
        F.defineModule('Tests.windowTest', {
            type: 'page',
            events: {
                'click @window': 'eventHandler'
            },
            eventHandler: handlers.eventHandler
        });

        var instance = F.createInstance('Tests.windowTest');
        $(window).trigger('click');
        expect(test).toBe(1);

    });

    it('binds events to the document object', function() {
        var test = 0, handlers = {
            eventHandler: function(e) {
                test++;
            }
        };
        F.defineModule('Tests.documentTest', {
            type: 'page',
            events: {
                'click @document': 'eventHandler'
            },
            eventHandler: handlers.eventHandler
        });

        var instance = F.createInstance('Tests.documentTest');
        $(document).trigger('click');
        expect(test).toBe(1);
    });

    it('does not update the $el if it is provided', function() {
        var $el = $('#list');
        F.defineModule('Tests.eventsMod.$elTest', {
            type: 'page',
            el: '.test'
        });

        var test = F.createInstance('Tests.eventsMod.$elTest', {
            $el: $el
        });

        expect(test.$el).toBe($el);
    });
});

