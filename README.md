# F library #

The F library is built with the purpose of working on multiple page applications easier and faster, giving a structure to the code and forcing the developer to write structured and namespaced code.

Basic usage is the best way to show the library's features.

Auto create a namespace from a string:
```
#!javascript

F.defineModule("F.Tests.Module1");
```
Every object (we call it module) created with the F library has a 'type' property. If you do not specify one, the library add 'default' for you

```
#!javascript
> F.Tests.Module1;
Object {type: "default"}
```
Obviously, you can pass an object to define the structure of your module:

```
#!javascript

F.defineModule("F.Tests.UIModule", {
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
        'click, hover': ['ul#list>li.list span, this.UI.link1, this.UI.link, @#outside', 'handleLink']
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
```
Once you have created a module, you can create an instance of it, as in the Class > Object relationship:

```
#!javascript
var instance = F.createInstance(F.Tests.TestModule);
```

You can create an instance of an existing module even if you pass the string representing the namespace 

```
#!javascript
var instance = F.createInstance('F.Tests.TestModule');
```
You can extend the standard instance of a module with additional configuration. Your configuration will be applied to your instance, without modifying the default definition of the module:

```
#!javascript

var instance = F.createInstance(F.Tests.UIModule, {
    el: 'body'
});
```
Every time you create an instance of a module, the F library calls before and after callbacks if provided. The complete call for the 'createInstance' function is the following:

```
#!javascript
var instance = F.createInstance(moduleToCreateInstanceFrom, extendObject, onBefore, onAfter);
```
The core library is very small by purpose and the ability of creating plugins is provided. 

## The pageModule ##

The 'pageModule', makes it easy to work with DOM related stuff, it offers:

* declarative event binding
* auto scoping to a root element
* selectors caching.

Make sure to define the right "type" property when you define your module if you want to use the features of the pageModule module:

```
#!javascript
F.defineModule("F.Tests.PageModule", {
    type: 'page'
});
```

The module can handle various stuff, a complete list of the properties follows:

```
#!javascript
F.defineModule("F.Tests.PageModule1", {
    // Always define the type property correctly
    type: 'page',
    // Define the root element of your module.
    // The module will have the scope restricted to this element
    // for increased security
    // The module will create a $el variable with the jQuery element
    // representing your root element
    el: '#test',
    // Define the jQuery elements that you want to cache by declaring their
    // selectors here, the module will create variables inside this object
    // with a $ prefix and a jQuery object for you
    // e.g. (articleList -> $articleList)
    UI: {
        articleList: '#article-list',
        moreButton: '#more-button',
        outside: '#outside'
    },
    // Declarative event binding
    events: {
        'click, hover': ['ul#list>li.list span, this.UI.link1, this.UI.link, @#outside', 'handleLink']
    },
    handleLink: function (ev) {
        ev.preventDefault();
    },
    test: function() {
        console.log("Test called");
    },
    // The init function, if present, is automatically called by the
    // createInstance function for you. Write here the code that you want to 
    // run when the module is instantiated
    init: function() {
        this.test();
        this.a = 10;
    }
});
```

In addition, the module adds a module.$ function as a shortcut to module.$el.find, so if you use module.$('selector'), your search will only find elements within your root element.