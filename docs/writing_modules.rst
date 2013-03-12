.. _writing_modules:

.. index:: Modules, Modules, Custom module

Writing CasperJS modules
========================

As of 1.1, CasperJS relies on PhantomJS' native ``require()`` function internally though it had to be patched in order to allow requiring casper modules using their full name, eg. ``require('casper')``.

So if you plan to write your own modules and uses casperjs' ones from them, be sure to call the ``patchRequire()`` function::

    // my module, stored in universe.js
    // patching phantomjs' require()
    var require = patchRequire(require);

    // now you're ready to go
    var utils = require('utils');
    var magic = 42;
    exports.answer = function() {
        return utils.format("it's %d", magic);
    };

.. warning::

    When using CoffeeScript ``global.require`` must be passed to ``patchRequire()`` instead of just ``require``.

From your root casper script::

    var universe = require('./universe');
    console.log(universe.answer()); // prints "It's 42"
