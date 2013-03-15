.. _installation:
.. index:: Installation

============
Installation
============

CasperJS can be installed on most Linuxes, OSX and Windows.

Prerequisites
-------------

.. index:: PhantomJS, Python

- PhantomJS_ 1.8.1 or greater. Installation instructions can be found `here <http://phantomjs.org/download.html>`_
- Python_ 2.6 or greater

.. note::

   .. versionadded:: 1.0

   A `Ruby <http://ruby-lang.org/>`_ version of the ``casperjs`` executable is also available in the ``rubybin/`` directory; in order to use the :index:`Ruby` version instead of the Python one:

   .. code-block:: text

       $ ln -sf `pwd`/rubybin/casperjs /usr/local/bin/casperjs

   Or using the ruby interpreter:

   .. code-block:: text

       $ ruby /path/to/casperjs/rubybin/casperjs
       CasperJS version 1.1-DEV at /path/to/casperjs/rubybin/casperjs, using PhantomJS version 1.7.0
       ...

.. index:: Homebrew

Installing from Homebrew (OSX)
------------------------------

Installation of both PhantomJS and CasperJS can be achieved through `Homebrew <http://mxcl.github.com/homebrew/>`_::

   $ brew install casperjs

.. index:: git

Installing from git
-------------------

Installation can be achieved using `git <http://git-scm.com/>`_. The code is mainly hosted on `Github <https://github.com/n1k0/casperjs>`_.

From a stable tag
~~~~~~~~~~~~~~~~~

.. code-block:: text

    $ git clone git://github.com/n1k0/casperjs.git
    $ cd casperjs
    $ git checkout tags/1.0
    $ ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs

Once PhantomJS and CasperJS installed on your machine, you should obtain something like this:

.. code-block:: text

    $ phantomjs --version
    1.8.2
    $ casperjs --version
    1.0

From the master branch
~~~~~~~~~~~~~~~~~~~~~~

The ``master`` branch hosts the current development version of CasperJS.

.. code-block:: text

    $ git clone git://github.com/n1k0/casperjs.git
    $ cd casperjs
    $ git checkout master
    $ ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs

To check your current installed version:

.. code-block:: text

    $ casperjs --version
    1.1-DEV

You are now ready to write your :doc:`first script <quickstart>`!


Installing from an archive
--------------------------

You can download tagged archives of CasperJS code:

**Latest stable version:**

- https://github.com/n1k0/casperjs/zipball/1.0.0 (zip)
- https://github.com/n1k0/casperjs/tarball/1.0.0 (tar.gz)

**Latest development version (master branch):**

- https://github.com/n1k0/casperjs/zipball/master (zip)
- https://github.com/n1k0/casperjs/tarball/master (tar.gz)

Operations are then the same as with a git checkout.


.. index:: Windows

CasperJS on Windows
-------------------

Phantomjs installation additions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- Append ``";C:\phantomjs"`` to your ``PATH`` environment variable.
- Modify this path appropriately if you installed PhantomJS to a different location.

Casperjs installation additions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. versionadded:: 1.0

CasperJS, as of 1.0.0-RC3, ships with a Batch script so you don't need Python nor Ruby to use it.

- Append ``";C:\casperjs\batchbin"`` to your ``PATH`` environment variable.
- Modify this path appropriately if you installed CasperJS to a different location.

You can now run any regular casper scripts that way:

.. code-block:: text

    C:> casperjs.bat myscript.js

Earlier versions of CasperJS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Before 1.0.0-RC3, you had to setup your casper scripts that way::

    phantom.casperPath = 'C:\\casperjs-1.1';
    phantom.injectJs(phantom.casperPath + '\\bin\\bootstrap.js');

    var casper = require('casper').create();

    // do stuff

Run the script using the ``phantom.exe`` program:

.. code-block:: text

    C:> phantomjs.exe myscript.js

.. note::

   There is no output coloration when running CasperJS on Microsoft platforms.


.. index:: Bugs, REPL

Known Bugs & Limitations
------------------------

- Due to its asynchronous nature, CasperJS doesn't work well with `PhantomJS' REPL <http://code.google.com/p/phantomjs/wiki/InteractiveModeREPL>`_.

.. _PhantomJS: http://phantomjs.org/
.. _Python: http://python.org/
