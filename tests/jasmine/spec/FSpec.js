describe('The F library', function() {
    F.registerModule("F.Tests.TestModule", {
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

    it('can create an object given a complex namespace', function(){
        F.registerModule("F.Tests.Mdule1");
        expect(F.Tests.Mdule1).toBeDefined();
    });

    it('can create a module given a complex namespace', function() {
        expect(F.Tests.TestModule).toBeDefined();
        expect(F.Tests.TestModule.defaults).toBeDefined();
        expect(F.Tests.TestModule.defaults.numArticles).toBe(5);
        expect(F.Tests.TestModule.el).toBe('#test');
    });

    it('converts the "el" selector in a jQuery element ($el)', function() {
        expect(F.Tests.TestModule.$el).toBeDefined();
        expect(F.Tests.TestModule.$el.length).toBe(1);
    });

    it('converts the UI object in jQuery elements', function() {
        expect(F.Tests.TestModule.UI).toBeDefined();
        expect(F.Tests.TestModule.UI.articleList).toBe('#article-list');
        expect(F.Tests.TestModule.UI.$articleList).toBeDefined();
        expect(F.Tests.TestModule.UI.$articleList.length).toBe(1);
    });

    it('adds a module.$ function as a shortcut to module.$el.find', function() {
        expect(F.Tests.TestModule.$).toBeDefined();
    });

    it('make sure that module.$ find only element in the scope of module.$el', function() {
        expect(F.Tests.TestModule.UI.$outside.length).toBe(0);
    });

    it('can be register under any other name', function() {
        F.init("App");
        expect(window.App).not.toBeUndefined();
    });

});


//----------------------------------//

// F.init("App");
// App.registerModule("App.Views.Comment", {
//     defaults: {
//         numArticles: 5
//     },
//     el: '#test',
//     UI: {
//         articleList: '#article-list',
//         moreButton: '#more-button',
//         outside: '#outside'
//     },
//     events: {
//         'click a[href=#]': 'handleLink'
//     },
//     handleLink: function (ev) {
//         ev.preventDefault();
//     },
//     test: function() {
//         console.log("Test called");
//     },
//     init: function() {
//         this.test();
//         this.a = 10;
//     }
// });

// console.log(App.Views.Comment);

// App.Views.Comment.test();