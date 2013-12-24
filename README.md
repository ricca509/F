## F library: namespace, structure and speed up your javascript

The F library is built with the purpose of working on multiple page applications easier and faster, giving a structure to the code and allowing the developer to write structured and namespaced code in no time.

### Dependencies
* jQuery
* underscore.js

### Usage 

Basic usage is the best way to show the library's features.

Auto create a namespace from a string:
```
F.defineModule("F.Tests.Module1");
```
Every object (or module) created with the F library has a `type` property. If you do not specify one, the library add `default` for you:

```javascript
> F.Tests.Module1;
Object {type: "default"}
```
Obviously, you can pass an object to define the structure of your module:

```javascript
F.defineModule("F.Tests.UIModule", {
    defaults: {
        numArticles: 5
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
Once you have created a module, you can create an instance of it, similar to the Class > Object relationship:

```javascript
var instance = F.createInstance(F.Tests.TestModule);
```

You can create an instance of an existing module passing the string representing the namespace or the object itself

```javascript
var instance = F.createInstance('F.Tests.TestModule');
```
You can extend the standard instance of a module with additional configuration. Your configuration will be applied to your instance, without modifying the default definition of the module:

```javascript
var instance = F.createInstance(F.Tests.UIModule, {
    el: 'body'
});
```
Every time you create an instance of a module, the F library calls before and after callbacks if provided. The complete call for the 'createInstance' function is the following:

```javascript
var instance = F.createInstance(moduleToCreateInstanceFrom, extendObject, onBefore, onAfter);
```
The core library is very small by purpose and the ability of creating plugins is provided.

#### The `init` function
If you define a `init` function within your module, it will run as soon as you create an instance of the module via the `F.createInstance`

## The pageModule ##

The *pageModule* makes it easy to work with DOM related stuff. It offers:

* declarative event binding
* auto scoping to a root element
* selectors caching.

Make sure to define the right `type` property when you define your module if you want to use the features of the pageModule module:

```javascript
F.defineModule("F.Tests.PageModule", {
    type: 'page'
});
```
#### The `el` element
As in Backbone.js views, the `el` element represent the root element of the module: every operation within the module will be scoped to this element. If you don't declare any 'el', the module will use 'body'.

#### The `$el` element
The module automatically creates a `$el` element, which is a jQuery wrapped element of the `el` element. If you declare both `$el` and `el`, the `$el` will win and `el` will be set to `$el.selector`.

#### The `this.$()` function
Every operation within the module has to be done in the scope of the `el` element. To achieve this, you can use the `this.$()` function. This is the same as using `$el.find()`.

#### The `UI` object
If you want to have a 'shortcut' to often used elements and want the module to cache them for you, you have to use the `UI` element. It is straightforward:

```javascript
UI: {
    articleList: '#article-list',
    moreButton: '#more-button',
    outside: '#outside'
}
```
Shortcut name on the right, jQuery selector on the left. You'll be able to access the elements with `this.UI.name`

#### The `events` object
The declarative event binding is achieved by using the `events` object:

```javascript
events: {
    'click ul#list>li.list span': 'handleLink'
}
```
The first name is always the event name (`click` in this case). 
The remaining words in the string represent the selector list.
On the right side, we have the name of the handler, that has to be declared inside the module.

**Selector type and syntax**
- **Normal** jQuery CSS selector, **scoped** to the el element: just write the plain jQuery selector.

```javascript
events: {
    'click ul#list>li.list span': 'handleLink'
}
```
- **Cached** element, defined in the UI object. Use the normal object sintax:

```javascript
events: {
    'click this.UI.link1': 'handleLink'
}
```
- **External** element: access elements outside el, 'document' and window included. Prepend the `@` symbol before the CSS selector (or `@window`, `@document`)

```javascript
events: {
    'click @#outside': 'handleLink',
    'click @document': 'handleLink',
}
```

### Complete example
The complete list of the properties follows:

```javascript
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
        'click ul#list>li.list span, this.UI.link1, this.UI.link, @#outside': 'handleLink'
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
    }
});
```
