.. _known_issues:

.. index:: Known Issues

Known Issues
============
This is a non-exhaustive list of issues that the CasperJS team is aware of and tracking.

PhantomJS
---------
**Versions below 2.0.0**:

- `phantomjs-issue-10795: <https://github.com/ariya/phantomjs/issues/10795>`_

  There is a known issue while doing clicks within the page that causes execution to halt.  It has been fixed in v2.0.0+ in phantomjs.

  It is mentioned in the following issues: `#233 <https://github.com/casperjs/casperjs/issues/223>`_

::

  console.log('START click');
  console.log(document.getElementById('foo').toString());
  console.log(document.getElementById('foo').click()); // this ends execution
  console.log('END click'); // this never gets called

**Version 2.0.0**:

- `phantomjs-issue-12506: <https://github.com/ariya/phantomjs/issues/12506>`_

  Webpage.uploadFile is not working.  It has been fixed in v2.0.1+ in phantomjs.

- `phantomjs-issue-12410: <https://github.com/ariya/phantomjs/issues/12410>`_

  Quote from `PhantomJS 2.0 Release Note <http://phantomjs.org/release-2.0.html>`_:

    "PhantomJS 2 can not run scripts written in CoffeeScript anymore (see issue `12410 <https://github.com/ariya/phantomjs/issues/12410>`_). As a workaround, CoffeeScript users can still compile their scripts to JavaScript first before executing it with PhantomJS."