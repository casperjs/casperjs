.. _cookbook:

.. index:: Cookbook, Examples, Samples

Cookbook
========

.. _github: https://github.com/casperjs/casperjs

This is a collection of scripts and ideas that aim to solve common situations that are encountered by users.  This is by no means an exhaustive list, and we encourage you to contribute your recipes on github_.


Creating a web service
----------------------

.. warning::

    It is worth noting that this is probably not the best of ideas.  You should be careful of things like memory leaks, lack of long term stability (due to said leaks), and the overall memory hog that headless JS can be.


With the above caveat in mind, a web service would look something like:

.. code-block:: javascript

  //filename: server.js

  //define ip and port to web service
  var ip_server = '127.0.0.1:8585';

  //includes web server modules
  var server = require('webserver').create();

  //start web server
  var service = server.listen(ip_server, function(request, response) {
    var links = [];
    var casper = require('casper').create();

    function getLinks() {
      var links = document.querySelectorAll('h3.r a');
      return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href')
      });
    }

    casper.start('http://google.com/', function() {
      // search for 'casperjs' from google form
      this.fill('form[action="/search"]', { q: request.postRaw }, true);
    });

    casper.then(function() {
      // aggregate results for the 'casperjs' search
      links = this.evaluate(getLinks);
    });

    casper.run(function() {
      response.statusCode = 200;

      //sends results as JSON object
      response.write(JSON.stringify(links, null, null));
      response.close();
    });
  });
  console.log('Server running at http://' + ip_server+'/');

You can start the server by executing:

.. code-block:: text

  casperjs server.js

You can then access the results via an HTTP POST request:

.. code-block:: text

  curl --data "casperjs" http://127.0.0.1:8585/

The above command would search for "casperjs" on google and return a JSON array of results.  This is a trivial example and can be expanded into something more complex.
