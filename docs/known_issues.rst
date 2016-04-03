.. _known_issues:

.. index:: Known Issues

Known Issues
============
This is a non-exhaustive list of issues that the CasperJS team is aware of and tracking.

PhantomJS
---------
**Versions below 2.0.0**:

- `phantom-issue-10795: <https://github.com/ariya/phantomjs/issues/10795>`_.
  There is a known issue while doing clicks within the page that causes execution to halt.  It has been fixed in v2.0.0+ in phantomjs.

  It is mentioned in the following issues: `#233: <https://github.com/n1k0/casperjs/issues/223>`_.

::

  console.log('START click');
  console.log(document.getElementById('foo').toString());
  console.log(document.getElementById('foo').click()); // this ends execution
  console.log('END click'); // this never gets called

