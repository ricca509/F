## F: a library to namespace, structure and speed up your javascript code

[![Build Status](https://travis-ci.org/ricca509/F.png?branch=master)](https://travis-ci.org/ricca509/F)

The F library is built with the purpose of working on multiple page applications easier and faster, giving a structure to the code and allowing the developer to write structured and namespaced code in no time.

### Dependencies
* jQuery
* underscore.js

### Usage
Just grab the uncompressed version `/dist/F.js` or the minified version `/dist/F.min.js`

## Core module

Basic usage is the best way to show the library's features.

### Include it in your page

In your HTML page, include the dependencies and the library:

```html
<script type="text/javascript" src="/libs/jquery.min.js"></script>
<script type="text/javascript" src="/libs/underscore-min.js"></script>
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
**Extend an module with an object**
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
While the core of the library will remain small by purpose, the following functions are available:
* `F.defineModule(namespaceToCreate, object, afterDefinedCallback);`
* `F.extendModule(moduleToExtend, moduleThatExtends, extendedModuleNamespace, afterExtendedCallback)`
* `F.createInstance(module, opts, onBeforeCreate, onAfterCreate)`
* `F.trimStart(str)`
* `F.trimEnd(str)`
* `F.trim(str)`
* `F.extend` (same as `_.extend`)

## The modules ecosystem

### The *page* module (`type: 'page'`)

The *page* module makes it easy to work with DOM related stuff. It offers:

* declarative event binding
* auto scoping to a root element
* selectors caching (UI declaration)
* jQuery shortcuts

Make sure to define the right `type` property when you define your module if you want to use the features of the *page* module:

```javascript
F.defineModule('F.Tests.PageModule', {
    type: 'page'
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
The key is the hortcut name, the value is the jQuery CSS selector. You'll be able to access the elements with `this.UI.name`

#### The `events` object
The declarative event binding is achieved by using the `events` object:

```javascript
events: {
    'click ul#list>li.list span': 'handleLink'
}
```
The first word is always the event name (`click`, in this case). 
The remaining words in the string represent the selector list.
On the right side, we have the name of the handler function, that has to be declared inside the module.

**Selectors type and syntax**
- **Normal** jQuery CSS selector, **scoped** to the el element: just write the plain jQuery selector.

```javascript
events: {
    'click ul#list>li.list span': 'handleLink'
}
```
- **Cached** element, defined in the UI object: use the normal object sintax.

```javascript
events: {
    'click this.UI.link1': 'handleLink'
}
```
- **External** element, access elements outside el, 'document' and window included: prepend the `@` symbol before the CSS selector (or `@window`, `@document`)

```javascript
events: {
    'click @#outside': 'handleLink',
    'click @document': 'handleLink',
}
```

### Complete example
The complete list of properties for the *pageModule* follows:

```javascript
F.defineModule('F.Tests.PageModule1', {
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
F.plugins.fooModule = {
    initModule: function (module) {
        return module;
    }
};
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
