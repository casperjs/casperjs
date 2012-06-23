The `utils` module contains simple functions which circumvent some lacks in the
standard Javascript API.

Usage is pretty much straightforward:

```javascript
var utils = require('utils');

utils.dump({plop: 42});
```

<h3 id="utils.betterTypeOf"><code>utils.betterTypeOf(input)</code></h3>

Provides a better `typeof` operator equivalent, able to retrieve the `Array`
type.

<h3 id="utils.dump"><code>utils.dump(value)</code></h3>

Dumps a JSON representation od passed argument onto the standard output. Useful
for [debugging](debugging.html).

<h3 id="utils.fileExt"><code>utils.fileExt(file)</code></h3>

Retrieves the extension of passed filename.

<h3 id="utils.fillBlanks"><code>utils.fillBlanks(text, pad)</code></h3>

Fills a string with trailing spaces to match `pad` length.

<h3 id="utils.format"><code>utils.format(f)</code></h3>

Formats a string against passed args. `sprintf` equivalent.

<span class="label label-info">Note</span>
This is a port of nodejs `util.format()`.

<h3 id="utils.getPropertyPath"><code>utils.getPropertyPath(Object obj, String path)</code></h3>

<span class="label label-success">Added in 1.0</span>
Retrieves the value of an Object foreign property using a dot-separated
path string:

```javascript
var account = {
    username: 'chuck',
    skills: {
        kick: {
            roundhouse: true
        }
    }
}
utils.getPropertyPath(account, 'skills.kick.roundhouse'); // true
```

**Beware, this function doesn't handle object key names containing a dot.**

<h3 id="utils.inherits"><code>utils.inherits(ctor, superCtor)</code></h3>

Makes a constructor inheriting from another. Useful for subclassing and
[extending](extending.html).

<span class="label label-info">Note</span>
This is a port of nodejs `util.inherits()`.

<h3 id="utils.isArray"><code>utils.isArray(value)</code></h3>

Checks if passed argument is an instance of `Array`.

<h3 id="utils.isCasperObject"><code>utils.isCasperObject(value)</code></h3>

Checks if passed argument is an instance of `Casper`.

<h3 id="utils.isClipRect"><code>utils.isClipRect(value)</code></h3>

Checks if passed argument is a `cliprect` object.

<h3 id="utils.isFunction"><code>utils.isFunction(value)</code></h3>

Checks if passed argument is a function.

<h3 id="utils.isJsFile"><code>utils.isJsFile(file)</code></h3>

Checks if passed filename is a Javascript one (by checking if it has a `.js` or
`.coffee` file extension).

<h3 id="utils.isNull"><code>utils.isNull(value)</code></h3>

Checks if passed argument is a `null`.

<h3 id="utils.isNumber"><code>utils.isNumber(value)</code></h3>

Checks if passed argument is an instance of `Number`.

<h3 id="utils.isObject"><code>utils.isObject(value)</code></h3>

Checks if passed argument is an object.

<h3 id="utils.isString"><code>utils.isString(value)</code></h3>

Checks if passed argument is an instance of `String`.

<h3 id="utils.isType"><code>utils.isType(what, type)</code></h3>

Checks if passed argument has its type matching the `type` argument.

<h3 id="utils.isUndefined"><code>utils.isUndefined(value)</code></h3>

Checks if passed argument is `undefined`.

<h3 id="utils.isWebPage"><code>utils.isWebPage(what)</code></h3>

Checks if passed argument is an instance of native PhantomJS' `WebPage` object.

<h3 id="utils.mergeObjects"><code>utils.mergeObjects(origin, add)</code></h3>

Merges two objects recursively.

<h3 id="utils.node"><code>utils.node(name, attributes)</code></h3>

Creates an (HT|X)ML element, having opitonal `attributes` added.

<h3 id="utils.serialize"><code>utils.serialize(value)</code></h3>

Serializes a value using JSON format. Will serialize functions as strings.
Useful for [debugging](debugging.html) and comparing objects.

<h3 id="utils.unique"><code>utils.unique(array)</code></h3>

Retrieves unique values from within a given `Array`.
