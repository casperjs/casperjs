.. _mouse_module:

====================
The ``mouse`` module
====================

.. index:: Mouse

The ``Mouse`` class
+++++++++++++++++++

The ``Mouse`` class is an abstraction on top of various mouse operations like moving, clicking, double-clicking, rollovers, etc. It requires a ``Casper`` instance as a dependency for accessing the DOM. A mouse object can be created that way::

    var casper = require("casper").create();
    var mouse = require("mouse").create(casper);

.. note::

   A ``casper`` instance has a ``mouse`` property already defined, so you usually don't have to create one by hand in your casper scripts::

       casper.then(function() {
           this.mouse.click(400, 300); // clicks at coordinates x=400; y=300
       });

``click()``
-------------------------------------------------------------------------------

**Signature:**

- ``click(Number x, Number y)``
- ``click(String selector)``
- ``click(String selector, Number x, Number y)``

Performs a click on the first element found matching the provided :doc:`selector expression <../selectors>` or at given coordinates if two numbers are passed::

    casper.then(function() {
        this.mouse.click("#my-link"); // clicks <a id="my-link">hey</a>
        this.mouse.click(400, 300);   // clicks at coordinates x=400; y=300
    });

.. note::

   You may want to directly use :ref:`Casper#click <casper_click>` instead.

``doubleclick()``
-------------------------------------------------------------------------------

**Signature:**

- ``doubleclick(Number x, Number y)``
- ``doubleclick(String selector)``
- ``doubleclick(String selector, Number x, Number y)``

Sends a ``doubleclick`` mouse event onto the element matching the provided arguments::

    casper.then(function() {
        this.mouse.doubleclick("#my-link"); // doubleclicks <a id="my-link">hey</a>
        this.mouse.doubleclick(400, 300);   // doubleclicks at coordinates x=400; y=300
    });

``rightclick()``
-------------------------------------------------------------------------------

**Signature:**

- ``rightclick(Number x, Number y)``
- ``rightclick(String selector)``
- ``rightclick(String selector, Number x, Number y)``

Sends a ``contextmenu`` mouse event onto the element matching the provided arguments::

    casper.then(function() {
        this.mouse.rightclick("#my-link"); // doubleclicks <a id="my-link">hey</a>
        this.mouse.rightclick(400, 300);   // doubleclicks at coordinates x=400; y=300
    });

``down()``
-------------------------------------------------------------------------------

**Signature:**

- ``down(Number x, Number y)``
- ``down(String selector)``
- ``down(String selector, Number x, Number y)``

Sends a ``mousedown`` mouse event onto the element matching the provided arguments::

    casper.then(function() {
        this.mouse.down("#my-link"); // press left button down <a id="my-link">hey</a>
        this.mouse.down(400, 300);   // press left button down at coordinates x=400; y=300
    });

``move()``
-------------------------------------------------------------------------------

**Signature:**

- ``move(Number x, Number y)``
- ``move(String selector)``
- ``move(String selector, Number x, Number y)``

Moves the mouse cursor onto the element matching the provided arguments::

    casper.then(function() {
        this.mouse.move("#my-link"); // moves cursor over <a id="my-link">hey</a>
        this.mouse.move(400, 300);   // moves cursor over coordinates x=400; y=300
    });

``up()``
-------------------------------------------------------------------------------

**Signature:**

- ``up(Number x, Number y)``
- ``up(String selector)``
- ``up(String selector, Number x, Number y)``

Sends a ``mouseup`` mouse event onto the element matching the provided arguments::

    casper.then(function() {
        this.mouse.up("#my-link"); // release left button over <a id="my-link">hey</a>
        this.mouse.up(400, 300);   // release left button over coordinates x=400; y=300
    });
