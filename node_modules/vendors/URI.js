/*
 * Copyright © 2007 Dominic Mitchell
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * Neither the name of the Dominic Mitchell nor the names of its contributors
 * may be used to endorse or promote products derived from this software
 * without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
 * An URI datatype.  Based upon examples in RFC3986.
 *
 * TODO %-escaping
 * TODO split apart authority
 * TODO split apart query_string (on demand, anyway)
 * TODO handle parameters containing empty strings properly
 * TODO keyword escaping
 *
 * @(#) $Id$
 */

// Globals we introduce.
var URI;
var URIQuery;

// Introduce a new scope to define some private helper functions.
(function () {

    //// HELPER FUNCTIONS /////

    // RFC3986 §5.2.3 (Merge Paths)
    function merge(base, rel_path) {
        var dirname = /^(.*)\//;
        if (base.authority && !base.path) {
            return "/" + rel_path;
        }
        else {
            return base.getPath().match(dirname)[0] + rel_path;
        }
    }

    // Match two path segments, where the second is ".." and the first must
    // not be "..".
    var DoubleDot = /\/((?!\.\.\/)[^\/]*)\/\.\.\//;

    function remove_dot_segments(path) {
        if (!path) {
            return "";
        }
        // Remove any single dots
        var newpath = path.replace(/\/\.\//g, '/');
        // Remove any trailing single dots.
        newpath = newpath.replace(/\/\.$/, '/');
        // Remove any double dots and the path previous.  NB: We can't use
        // the "g", modifier because we are changing the string that we're
        // matching over.
        while (newpath.match(DoubleDot)) {
            newpath = newpath.replace(DoubleDot, '/');
        }
        // Remove any trailing double dots.
        newpath = newpath.replace(/\/([^\/]*)\/\.\.$/, '/');
        // If there are any remaining double dot bits, then they're wrong
        // and must be nuked.  Again, we can't use the g modifier.
        while (newpath.match(/\/\.\.\//)) {
            newpath = newpath.replace(/\/\.\.\//, '/');
        }
        return newpath;
    }

    // give me an ordered list of keys of this object
    function hashkeys(obj) {
        var list = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                list.push(key);
            }
        }
        return list.sort();
    }

    // TODO: Make these do something
    function uriEscape(source) {
        return source;
    }

    function uriUnescape(source) {
        return source;
    }


    //// URI CLASS /////

    // Constructor for the URI object.  Parse a string into its components.
    // note that this 'exports' 'URI' to the 'global namespace'
    URI = function (str) {
        if (!str) {
            str = "";
        }
        // Based on the regex in RFC2396 Appendix B.
        var parser = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;
        var result = str.match(parser);

        // Keep the results in private variables.
        var scheme    = result[1] || null;
        var authority = result[2] || null;
        var path      = result[3] || null;
        var query     = result[4] || null;
        var fragment  = result[5] || null;

        // Set up accessors.
        this.getScheme = function () {
            return scheme;
        };
        this.setScheme = function (newScheme) {
            scheme = newScheme;
        };
        this.getAuthority = function () {
            return authority;
        };
        this.setAuthority = function (newAuthority) {
            authority = newAuthority;
        };
        this.getPath = function () {
            return path;
        };
        this.setPath = function (newPath) {
            path = newPath;
        };
        this.getQuery = function () {
            return query;
        };
        this.setQuery = function (newQuery) {
            query = newQuery;
        };
        this.getFragment = function () {
            return fragment;
        };
        this.setFragment = function (newFragment) {
            fragment = newFragment;
        };
    };

    // Restore the URI to it's stringy glory.
    URI.prototype.toString = function () {
        var str = "";
        if (this.getScheme()) {
            str += this.getScheme() + ":";
        }
        if (this.getAuthority()) {
            str += "//" + this.getAuthority();
        }
        if (this.getPath()) {
            str += this.getPath();
        }
        if (this.getQuery()) {
            str += "?" + this.getQuery();
        }
        if (this.getFragment()) {
            str += "#" + this.getFragment();
        }
        return str;
    };

    // RFC3986 §5.2.2. Transform References;
    URI.prototype.resolve = function (base) {
        var target = new URI();
        if (this.getScheme()) {
            target.setScheme(this.getScheme());
            target.setAuthority(this.getAuthority());
            target.setPath(remove_dot_segments(this.getPath()));
            target.setQuery(this.getQuery());
        }
        else {
            if (this.getAuthority()) {
                target.setAuthority(this.getAuthority());
                target.setPath(remove_dot_segments(this.getPath()));
                target.setQuery(this.getQuery());
            }
            else {
                // XXX Original spec says "if defined and empty"…;
                if (!this.getPath()) {
                    target.setPath(base.getPath());
                    if (this.getQuery()) {
                        target.setQuery(this.getQuery());
                    }
                    else {
                        target.setQuery(base.getQuery());
                    }
                }
                else {
                    if (this.getPath().charAt(0) === '/') {
                        target.setPath(remove_dot_segments(this.getPath()));
                    } else {
                        target.setPath(merge(base, this.getPath()));
                        target.setPath(remove_dot_segments(target.getPath()));
                    }
                    target.setQuery(this.getQuery());
                }
                target.setAuthority(base.getAuthority());
            }
            target.setScheme(base.getScheme());
        }

        target.setFragment(this.getFragment());

        return target;
    };

    URI.prototype.parseQuery = function () {
        return URIQuery.fromString(this.getQuery(), this.querySeparator);
    };

    //// URIQuery CLASS /////

    URIQuery = function () {
        this.params    = {};
        this.separator = "&";
    };

    URIQuery.fromString = function (sourceString, separator) {
        var result = new URIQuery();
        if (separator) {
            result.separator = separator;
        }
        result.addStringParams(sourceString);
        return result;
    };


    // From http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
    // (application/x-www-form-urlencoded).
    //
    // NB: The user can get this.params and modify it directly.
    URIQuery.prototype.addStringParams = function (sourceString) {
        var kvp = sourceString.split(this.separator);
        var list, key, value;
        for (var i = 0; i < kvp.length; i++) {
            // var [key,value] = kvp.split("=", 2) only works on >= JS 1.7
            list  = kvp[i].split("=", 2);
            key   = uriUnescape(list[0].replace(/\+/g, " "));
            value = uriUnescape(list[1].replace(/\+/g, " "));
            if (!this.params.hasOwnProperty(key)) {
                this.params[key] = [];
            }
            this.params[key].push(value);
        }
    };

    URIQuery.prototype.getParam = function (key) {
        if (this.params.hasOwnProperty(key)) {
            return this.params[key][0];
        }
        return null;
    };

    URIQuery.prototype.toString = function () {
        var kvp = [];
        var keys = hashkeys(this.params);
        var ik, ip;
        for (ik = 0; ik < keys.length; ik++) {
            for (ip = 0; ip < this.params[keys[ik]].length; ip++) {
                kvp.push(keys[ik].replace(/ /g, "+") + "=" + this.params[keys[ik]][ip].replace(/ /g, "+"));
            }
        }
        return kvp.join(this.separator);
    };

})();
