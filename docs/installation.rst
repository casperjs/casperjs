.. _installation:
.. index:: Installation

============
Installation
============

CasperJS can be installed on Mac OSX, Windows and most Linuxes.

Prerequisites
-------------

.. index:: PhantomJS, Python, SlimerJS

- PhantomJS_ 1.9.1 or greater. Please read the `installation instructions for PhantomJS <http://phantomjs.org/download.html>`_
- Python_ 2.6 or greater for ``casperjs`` in the ``bin/`` directory

.. note::

   CoffeeScript is not natively supported in PhantomJS versions 2.0.0 and above.  If you are going to use CoffeeScript you'll have to transpile it into vanilla Javascript.  See :ref:`known issues <known_issues>` for more details.

.. versionadded:: 1.1

- **Experimental:** as of 1.1.0-beta1, SlimerJS_ 0.8 or greater to run your tests against Gecko (Firefox) instead of Webkit (just add `--engine=slimerjs` to your command line options). The SlimerJS developers documented `the PhantomJS API compatibility of SlimerJS <https://github.com/laurentj/slimerjs/blob/master/API_COMPAT.md>`_ as well as `the differences between PhantomJS and SlimerJS <http://docs.slimerjs.org/current/differences-with-phantomjs.html>`_. Note that it is known that coffescript support breaks as of SlimerJS_ 0.9.6; we are investigating that issue.

.. versionadded:: 1.1.0-beta4

.. warning::

   Versions before 1.1.0-beta4 that were installed through npm required an unspecific PhantomJS version by means of an npm dependency. This led to lots of confusion and issues against CasperJS not working properly if installed through npm. Starting with 1.1.0 the installation of an engine (PhantomJS, SlimerJS) will be a real prerequisite, regardless of the installation method you choose for CasperJS.

.. index:: Homebrew

Installing from Homebrew (OSX)
------------------------------

Installation of both PhantomJS and CasperJS can be achieved using Homebrew_, a popular package manager for Mac OS X.

Above all, don't forget to update Formulaes::

    $ brew update

For the 1.1.* version (recommended)::

    $ brew install casperjs

If you have already installed casperjs and want to have the last release (stable|devel), use ``upgrade``::

    $ brew upgrade casperjs

Upgrade only update to the latest release branch (1.0.x|1.1.0-dev).

Installing from npm
-------------------

.. versionadded:: 1.1.0-beta3

You can install CasperJS using `npm <http://npmjs.org/>`_:

- For most users (current version 1.1.0-beta4):

    $ npm install -g casperjs

- If you want a specific older version:

    - For beta3: $ npm install -g casperjs@1.1.0-beta3

    - For beta2: $ npm install -g casperjs@1.1.0-beta2

- If you want to install the current master from git using npm:

    $ npm install -g git+https://github.com/casperjs/casperjs.git

.. note::

   The ``-g`` flag makes the ``casperjs`` executable available system-wide.

.. warning::

   While CasperJS is installable via npm, :ref:`it is not a NodeJS module <faq_node>` and will not work with NodeJS out of the box. **You cannot load casper by using require('casperjs') in node.** Note that CasperJS is not capable of using a vast majority of NodeJS modules out there. **Experiment and use your best judgement.**

.. index:: git

Installing from git
-------------------

Installation can be achieved using `git <http://git-scm.com/>`_. The code is mainly hosted on `Github <https://github.com/casperjs/casperjs>`_.

From the master branch
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

    $ git clone git://github.com/casperjs/casperjs.git
    $ cd casperjs
    $ ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs

Once PhantomJS and CasperJS installed on your machine, you should obtain something like this:

.. code-block:: text

    $ phantomjs --version
    1.9.2
    $ casperjs
    CasperJS version 1.1.0-beta4 at /Users/niko/Sites/casperjs, using phantomjs version 1.9.2
    # ...

Or if SlimerJS is your thing:

.. code-block:: text

    $ slimerjs --version
    Innophi SlimerJS 0.8pre, Copyright 2012-2013 Laurent Jouanneau & Innophi
    $ casperjs
    CasperJS version 1.1.0 at /Users/niko/Sites/casperjs, using slimerjs version 0.8.0

You are now ready to write your :doc:`first script <quickstart>`!


Installing from an archive
--------------------------

You can download tagged archives of CasperJS code:

**Latest development version (master branch):**

- https://github.com/casperjs/casperjs/zipball/master (zip)
- https://github.com/casperjs/casperjs/tarball/master (tar.gz)

**Latest stable version:**

- https://github.com/casperjs/casperjs/zipball/1.1.0 (zip)
- https://github.com/casperjs/casperjs/tarball/1.1.0 (tar.gz)

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

.. versionadded:: 1.1.0-beta3

- Append ``";C:\casperjs\bin"`` to your ``PATH`` environment variable (for versions before 1.1.0-beta3 append ``";C:\casperjs\batchbin"`` to your ``PATH`` environment variable).
- Modify this path appropriately if you installed CasperJS to a different location.
- If your computer uses both discrete and integrated graphics you need to disable autoselect and explicitly choose graphics processor - otherwise ``exit()`` will not exit casper.

You can now run any regular casper scripts that way:

.. code-block:: text

    C:> casperjs myscript.js

Colorized output
~~~~~~~~~~~~~~~~

.. note::

   .. versionadded:: 1.1.0-beta1

   Windows users will get colorized output if ansicon_ is installed or if the user is using ConEmu_ with ANSI colors enabled.

.. index:: Bugs, REPL

Compilation (Optionaly)
~~~~~~~~~~~~~~~~~~~~~~~

- .NET Framework 3.5 or greater (or Mono_ 2.10.8 or greater) for ``casperjs.exe`` in the ``bin/`` directory

Known Bugs & Limitations
------------------------

- Due to its asynchronous nature, CasperJS doesn't work well with `PhantomJS' REPL <http://phantomjs.org/repl.html>`_.

.. _Homebrew: http://brew.sh/
.. _PhantomJS: http://phantomjs.org/
.. _Python: http://python.org/
.. _SlimerJS: http://slimerjs.org/
.. _ansicon: https://github.com/adoxa/ansicon
.. _Mono: http://www.mono-project.com/
.. _ConEmu: https://conemu.github.io/
