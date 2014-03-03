## F: a library to namespace, structure and speed up your javascript code

[![Build Status](https://travis-ci.org/ricca509/F.png?branch=master)](https://travis-ci.org/ricca509/F)

A small	library	that mainly targets	all	those multiple pages (server side MVC) projects	that usually don’t have a structured javascript code due to the fact that	most of the	job	is done on the server but eventually end up with a load of unstructured, spaghetti code.

The F library is built with the purpose of working on multiple page applications easier and faster, giving a structure to the code and allowing the developer to write structured, namespaced, testable code quickly and easily.

### Dependencies
* Lo-Dash
* jQuery (only if you use the *Dom* module)

### Install it

#### with Bower
```
$ bower install F
```
#### or grab the latest release
https://github.com/ricca509/F/releases

## Core module

Basic usage is the best way to show the library's features.

### Include it in your page

In your HTML page, include the dependencies and the library:

```html
<script type="text/javascript" src="/libs/jquery.min.js"></script>
<script type="text/javascript" src="/libs/lodash.min.js"></script>
<script type="text/javascript" src="/libs/F.min.js"></script>
```

### Create namespaced objects (`F.defineModule`)
**Method signature:**
```javascript
F.defineModule(namespaceToCreate, object, afterDefinedCallback);
```

**Create a namespace** from a string:

```javascript
F.defineModule('F.Tests.Module1');
```
Every object (or module) created with the F library has a `type` property. If you do not specify one, the library add `default` for you:

```javascript
> F.Tests.Module1;
Object {type: "default"}
```
You can pass an **object** to define the structure of your module:

```javascript
F.defineModule('F.Tests.testObject', {
    defaults: {
        numArticles: 5
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

// In the console:
> F.Tests.testObject
Object {defaults: Object, handleLink: function, test: function, init: function, type: "default"}
```
or a **function**:

```javascript
F.defineModule('F.Tests.testFunction', function() {
    var a, b;
    var c = function() {
        // stuff
    }
    
    return {
        doSomething: c
    };
});

// In the console:
> F.Tests.testFunction
function () {
    var a, b;
    var c = function() {
        // stuff
    }
    
    return {
        doSomething: c
    };
}
```

or a **variable**:

```javascript
F.defineModule('F.Tests.testVariable', 'variableValue');

// In the console:
> F.Tests.testVariable
"variableValue"
```
### Extend your modules (`F.extendModule`)
You can extend your modules (only object modules at the moment). This allows you to create reusable modules and make you code simpler, easier to test and debug.

**Method signature:**
```javascript
F.extendModule(moduleToExtend, moduleThatExtends, extendedModuleNamespace, afterExtendedCallback)
```
**Extend a module with an object:**
```javascript
// Define an object module "F.objA"
F.defineModule('F.objA', {
    one: 'string',
    two: function() {
        return 'function two'
    }
});

// Create a new module "F.newExtendedModule"
// extending "F.objA" with a plain object
F.extendModule('F.objA', {
    three: 5,
    four: true
}, 'F.newExtendedModule');
```

**Extend a plain object with another one:**
```javascript
// Create a new module "F.newExtendedModule"
// from two plain objects 
// (the extended object will have the "type" property set to "default")
F.extendModule({
        a: '1',
        b: '2'
    }, {
        c: '3',
        d: '4'
}, 'F.newExtendedModule');
```

### Create instances of your objects (`F.createInstance`)

Once you have created a **module**, you can create **instances** of it, similar to the *Class > Object* relationship:

**Method signature:**
```javascript
F.createInstance(module, opts, onBeforeCreate, onAfterCreate)
```

Example:
```javascript
var instance = F.createInstance(F.Tests.TestModule);
```

You can create instances of an existing module passing the string representing the namespace or the object itself

```javascript
var instance = F.createInstance('F.Tests.TestModule');
```
You can **extend the standard instance** of a module with additional configuration. Your configuration will be applied to your instance, without modifying the default definition of the module:

```javascript
var instance = F.createInstance(F.Tests.UIModule, {
    el: 'body'
});
```
Every time you create an instance of a module, the F library calls `onBefore` and `onAfter` callbacks if provided. The complete call for the `createInstance` function is the following:

```javascript
var instance = F.createInstance(moduleToCreateInstanceFrom, extendObject, onBefore, onAfter);
```

#### The `init` function
If you define a `init` function within your module, it **will run as soon as you create an instance** of the module via the `F.createInstance`.

The *core F library* is pretty much this: a simple way to create namespaces that contain variables, object or functions and create instances of them. This helps maintaining a **structured, globals-free code**.

The power of the library is the fact that, by using a generic modular system, you can define your own module type and let the library call it for you. The next section explore the modules echosystem.

### Helpers functions
While the core of the library will remain small by purpose, there are "addons" that extends it. The following functions are available:

**Core**
* `F.defineModule(namespaceToCreate, object, afterDefinedCallback);`
* `F.extendModule(moduleToExtend, moduleThatExtends, extendedModuleNamespace, afterExtendedCallback)`
* `F.createInstance(module, opts, onBeforeCreate, onAfterCreate)`

**String addon `F.str`**
* `F.str.trimStart(str)`
* `F.str.trimEnd(str)`
* `F.str.trim(str)`

**Events: Publisher/Subscriber addon `F.evt`**
* `F.evt.on(topic, callback)`
* `F.evt.off(topic, index)`
* `F.evt.trigger(topic, args)`

## Addons

### Events Publisher/Subscriber `F.evt`
An events addon can be found under `F.evt`.

#### The `on` method
You can subscribe to an event with the `on` method. You have to pass the event name and a callback.

`F.evt.on(topic, callback)`

returns an index, that can be used to unscribe from the event.

```javascript
var key = F.evt.on('test', function(args) {
    console.log('Test ' + args);
});
```

#### The `trigger` method
You can trigger an event with the `trigger` method, it accepts the name of the event and the arguments you want to publish with the event.

```javascript
var key = F.evt.on('test', function(args) {
    console.log('Test ' + args);
});

F.evt.trigger('test', ['one', 'two']);
```

#### The `off` method
You can unscribe from an event using the event name and the `index` returned by the `on` method.

`F.evt.off(topic, index)`

```javascript
var key = F.evt.on('test', function(args) {
    console.log('Test ' + args);
});

F.evt.trigger('test', ['one', 'two']);

F.evt.off('test', key);
```

## The modules ecosystem

### The *dom* module (`type: 'dom'`)

The *dom* module makes it easy to work with DOM related stuff. It offers:

* declarative event binding
* auto scoping to a root element
* selectors caching (UI declaration)
* jQuery shortcuts

Make sure to define the right `type` property when you define your module if you want to use the features of the *dom* module:

```javascript
F.defineModule('F.Tests.DomModule', {
    type: 'dom'
});
```
#### The `el` element
As in Backbone.js views, the `el` element represent the root element of the module: every operation within the module will be scoped to this element. If you don't declare any 'el', the module will use 'body'.

#### The `$el` element
The module automatically creates a `$el` element, which is a jQuery wrapped element of the `el` element. If you declare both `$el` and `el`, the `$el` will win and `el` will be set to `$el.selector`.

#### The `this.$()` function
Every operation within the module has to be done in the scope of the `el` element. To achieve this, you can use the `this.$()` function. This is the same as using `this.$el.find()` or `$(el).find()`.

#### The `UI` object
If you want to have a 'shortcut' to often used elements and want the module to cache them for you, you have to use the `UI` object. It is pretty straightforward:

```javascript
UI: {
    articleList: '#article-list',
    moreButton: '#more-button',
    outside: '#outside'
}
```
The key is the shortcut name, the value is the jQuery CSS selector. You'll be able to access the elements with `this.UI.name`.
For every key in the UI object, as soon as you'll create an instance of the object you will get the jQuery oject associated to that selector. You can access the jQuery object by preceding the name with a $:

(string selector) `this.UI.articleList` -> (jQuery object) `this.UI.$articleList`

#### The `events` object
The declarative event binding is achieved by using the `events` object:

```javascript
events: {
    'click': {
        'ul#list>li.list span': 'handleLink'
    } 
}
```
The properties of the "events" object are always the event (or events) name (`click`, in this case). 
The value of each property is an object itself. The left side contains the selector as key.
On the right side, we have the name of the handler function as value, that has to be declared inside the module.

**Selectors type and syntax**
- **Normal** jQuery CSS selector, **scoped** to the el element: just write the plain jQuery selector.

```javascript
events: {
    'click': {
    '   ul#list>li.list span': 'handleLink'
    }
}
```
- **Cached** element, defined in the UI object: use the normal object sintax.

```javascript
events: {
    'click': {
        'this.UI.link1': 'handleLink'
    } 
}
```
- **External** element, access elements outside el, 'document' and window included: prepend the `@` symbol before the CSS selector (or `@window`, `@document`)

```javascript
events: {
    'click': {
        '@#outside': 'handleLink',
        '@document': 'handleLink'
    }
}
```

### Complete example
The complete list of properties for the *domModule* follows:

```javascript
F.defineModule('F.Tests.DomModule1', {
    // Always define the type property correctly
    type: 'dom',
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
        'click': {
            'ul#list>li.list span, this.UI.moreButton, @#outside': 'handleLink'
        }
    },
    handleLink: function (ev) {
        ev.preventDefault();
    },
    test: function() {
        console.log('Test called');
    },
    // The init function, if present, is automatically called by the
    // createInstance function for you. Write here the code that you want to 
    // run when the module is instantiated
    init: function() {
    }
});
```

## Writing a module
Defining a new module is easy and make it possible to extend the *F core*, which is small by intention.

### Pick up a name

The first step is to pick up a name for the module. Let's assume we want to create the `fooModule`. When defining a module of this type, we will have to define the `type` property to be `foo`:

```javascript
F.defineModule('F.Tests.fooModule1', {
    type: 'foo',
    ...
}
```
The *F core* library, reading the `type` property of the module (`test`), will search under `F.plugins` an object called `fooModule` (`F.plugins.fooModule`).

### Define the `initModule` function

The `F.plugins.fooModule` will have to expose the `initModule` function. It will be passed an instance of the object, and will have to return it (after having modified it).

An example of an `initModule` defined for our `F.plugins.fooModule` function is as follows:

```javascript
(function(F) {
    'use strict';
    var _module;
    
    var initModule = function (module) {
        _module = module;
        return _module;
    };

    F.plugins.defaultModule = {
        initModule: initModule
    };
}(F));
```

You can find an example under ` /src/plugins/F.plugins.defaultModule.js`

### Create a plugin file for the module and include it in your page
The best place for the `F.plugins.fooModule` is in a file named `F.plugins.fooModule.js`. 

Be sure to include it after the main F include.

```html
<script type="text/javascript" src="/libs/jquery.min.js"></script>
<script type="text/javascript" src="/libs/underscore-min.js"></script>
<script type="text/javascript" src="/libs/F.min.js"></script>
<script type="text/javascript" src="/libs/F.plugins.fooModule.js"></script>
```

### That's it!
