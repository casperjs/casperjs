%define name	kasperjs
%define version	1.0.0
%define release 1_1
%define prefix	/usr

%define mybuilddir %{_builddir}/%{name}-%{version}-root

Summary:	open source navigation scripting & testing utility written in Javascript
Name:		%{name}
Version:	%{version}
License:	BSD
Release:	%{release}
Packager:	Jan Schaumann <jschauma@etsy.com>
Group:		Utilities/Misc
Source:		%{name}-%{version}.tar.gz
BuildRoot:	/tmp/%{name}-%{version}-root

Requires:	phantomjs

%description
kasperJS is an open source navigation scripting & testing utility written
in Javascript and based on PhantomJS.  It eases the process of defining a
full navigation scenario and provides useful high-level functions, methods
& syntactic sugar for doing common tasks

%prep
%setup -q

%setup
mkdir -p %{mybuilddir}%{prefix}/bin
mkdir -p %{mybuilddir}%{prefix}/share/%{name}/bin
mkdir -p %{mybuilddir}%{prefix}/share/%{name}/modules
mkdir -p %{mybuilddir}%{prefix}/share/%{name}/samples
mkdir -p %{mybuilddir}%{prefix}/share/%{name}/tests

%install
cp bin/%{name} %{mybuilddir}%{prefix}/share/%{name}/bin/
ln -s %{prefix}/share/%{name}/bin/%{name} %{mybuilddir}%{prefix}/bin/%{name}
cp bin/bootstrap.js  %{mybuilddir}%{prefix}/share/%{name}/bin/
# Yes, this tool needs this file in the 'bin' directory.
cp bin/usage.txt %{mybuilddir}%{prefix}/share/%{name}/bin/
cp CHANGELOG.md %{mybuilddir}%{prefix}/share/%{name}/
cp CONTRIBUTING.md %{mybuilddir}%{prefix}/share/%{name}/
cp CONTRIBUTORS.md %{mybuilddir}%{prefix}/share/%{name}/
cp LICENSE.md %{mybuilddir}%{prefix}/share/%{name}/
cp README.md %{mybuilddir}%{prefix}/share/%{name}/
cp package.json %{mybuilddir}%{prefix}/share/%{name}/
cp -R modules/* %{mybuilddir}%{prefix}/share/%{name}/modules/
cp -R samples/* %{mybuilddir}%{prefix}/share/%{name}/samples/
cp -R tests/* %{mybuilddir}%{prefix}/share/%{name}/tests/

%files
%defattr(0444,root,root)
%attr(0555,root,root)%{prefix}/bin/%{name}
%attr(0555,root,root)%{prefix}/share/%{name}/bin/%{name}
%attr(0555,root,root)%{prefix}/share/%{name}/bin/bootstrap.js
%{prefix}/share/%{name}/bin/usage.txt
%{prefix}/share/%{name}/CHANGELOG.md
%{prefix}/share/%{name}/CONTRIBUTING.md
%{prefix}/share/%{name}/CONTRIBUTORS.md
%{prefix}/share/%{name}/LICENSE.md
%{prefix}/share/%{name}/README.md
%{prefix}/share/%{name}/package.json
%{prefix}/share/%{name}/modules/kasper.js
%{prefix}/share/%{name}/modules/cli.js
%{prefix}/share/%{name}/modules/clientutils.js
%{prefix}/share/%{name}/modules/colorizer.js
%{prefix}/share/%{name}/modules/events.js
%{prefix}/share/%{name}/modules/http.js
%{prefix}/share/%{name}/modules/mouse.js
%{prefix}/share/%{name}/modules/querystring.js
%{prefix}/share/%{name}/modules/tester.js
%{prefix}/share/%{name}/modules/utils.js
%{prefix}/share/%{name}/modules/vendors/coffee-script.js
%{prefix}/share/%{name}/modules/xunit.js
%{prefix}/share/%{name}/samples/bbcshots.coffee
%{prefix}/share/%{name}/samples/bbcshots.js
%{prefix}/share/%{name}/samples/cliplay.coffee
%{prefix}/share/%{name}/samples/cliplay.js
%{prefix}/share/%{name}/samples/customevents.coffee
%{prefix}/share/%{name}/samples/customevents.js
%{prefix}/share/%{name}/samples/customlogging.coffee
%{prefix}/share/%{name}/samples/customlogging.js
%{prefix}/share/%{name}/samples/download.coffee
%{prefix}/share/%{name}/samples/download.js
%{prefix}/share/%{name}/samples/dynamic.coffee
%{prefix}/share/%{name}/samples/dynamic.js
%{prefix}/share/%{name}/samples/each.coffee
%{prefix}/share/%{name}/samples/each.js
%{prefix}/share/%{name}/samples/events.coffee
%{prefix}/share/%{name}/samples/events.js
%{prefix}/share/%{name}/samples/extends.coffee
%{prefix}/share/%{name}/samples/extends.js
%{prefix}/share/%{name}/samples/googlelinks.coffee
%{prefix}/share/%{name}/samples/googlelinks.js
%{prefix}/share/%{name}/samples/googlematch.coffee
%{prefix}/share/%{name}/samples/googlematch.js
%{prefix}/share/%{name}/samples/googlepagination.coffee
%{prefix}/share/%{name}/samples/googlepagination.js
%{prefix}/share/%{name}/samples/googletesting.coffee
%{prefix}/share/%{name}/samples/googletesting.js
%{prefix}/share/%{name}/samples/logcolor.coffee
%{prefix}/share/%{name}/samples/logcolor.js
%{prefix}/share/%{name}/samples/metaextract.coffee
%{prefix}/share/%{name}/samples/metaextract.js
%{prefix}/share/%{name}/samples/multirun.coffee
%{prefix}/share/%{name}/samples/multirun.js
%{prefix}/share/%{name}/samples/screenshot.coffee
%{prefix}/share/%{name}/samples/screenshot.js
%{prefix}/share/%{name}/samples/statushandlers.coffee
%{prefix}/share/%{name}/samples/statushandlers.js
%{prefix}/share/%{name}/samples/steptimeout.coffee
%{prefix}/share/%{name}/samples/steptimeout.js
%{prefix}/share/%{name}/samples/timeout.coffee
%{prefix}/share/%{name}/samples/timeout.js
%{prefix}/share/%{name}/tests/site/field-array.html
%{prefix}/share/%{name}/tests/site/images/phantom.png
%{prefix}/share/%{name}/tests/site/result.html
%{prefix}/share/%{name}/tests/site/multiple-forms.html
%{prefix}/share/%{name}/tests/site/global.html
%{prefix}/share/%{name}/tests/site/elementattribute.html
%{prefix}/share/%{name}/tests/site/urls.html
%{prefix}/share/%{name}/tests/site/mouse-events.html
%{prefix}/share/%{name}/tests/site/index.html
%{prefix}/share/%{name}/tests/site/click.html
%{prefix}/share/%{name}/tests/site/page1.html
%{prefix}/share/%{name}/tests/site/prompt.html
%{prefix}/share/%{name}/tests/site/error.html
%{prefix}/share/%{name}/tests/site/dummy.js
%{prefix}/share/%{name}/tests/site/page2.html
%{prefix}/share/%{name}/tests/site/alert.html
%{prefix}/share/%{name}/tests/site/form.html
%{prefix}/share/%{name}/tests/site/confirm.html
%{prefix}/share/%{name}/tests/site/resources.html
%{prefix}/share/%{name}/tests/site/test.html
%{prefix}/share/%{name}/tests/site/page3.html
%{prefix}/share/%{name}/tests/site/visible.html
%{prefix}/share/%{name}/tests/site/waitFor.html
%{prefix}/share/%{name}/tests/sample_modules/csmodule.coffee
%{prefix}/share/%{name}/tests/sample_modules/jsmodule.js
%{prefix}/share/%{name}/tests/testdir/03_a.js
%{prefix}/share/%{name}/tests/testdir/02_b/abc.js
%{prefix}/share/%{name}/tests/testdir/04/02_do.js
%{prefix}/share/%{name}/tests/testdir/04/01_init.js
%{prefix}/share/%{name}/tests/testdir/01_a/abc.js
%{prefix}/share/%{name}/tests/testdir/01_a/def.js
%{prefix}/share/%{name}/tests/testdir/03_b.js
%{prefix}/share/%{name}/tests/suites/kasper/capture.js
%{prefix}/share/%{name}/tests/suites/kasper/prompt.js
%{prefix}/share/%{name}/tests/suites/kasper/resources.coffee
%{prefix}/share/%{name}/tests/suites/kasper/auth.js
%{prefix}/share/%{name}/tests/suites/kasper/alert.js
%{prefix}/share/%{name}/tests/suites/kasper/wait.js
%{prefix}/share/%{name}/tests/suites/kasper/flow.coffee
%{prefix}/share/%{name}/tests/suites/kasper/events.js
%{prefix}/share/%{name}/tests/suites/kasper/evaluate.js
%{prefix}/share/%{name}/tests/suites/kasper/logging.js
%{prefix}/share/%{name}/tests/suites/kasper/xpath.js
%{prefix}/share/%{name}/tests/suites/kasper/elementattribute.js
%{prefix}/share/%{name}/tests/suites/kasper/viewport.js
%{prefix}/share/%{name}/tests/suites/kasper/.kasper
%{prefix}/share/%{name}/tests/suites/kasper/steps.js
%{prefix}/share/%{name}/tests/suites/kasper/exists.js
%{prefix}/share/%{name}/tests/suites/kasper/click.js
%{prefix}/share/%{name}/tests/suites/kasper/mouseevents.js
%{prefix}/share/%{name}/tests/suites/kasper/fetchtext.js
%{prefix}/share/%{name}/tests/suites/kasper/urls.js
%{prefix}/share/%{name}/tests/suites/kasper/open.js
%{prefix}/share/%{name}/tests/suites/kasper/agent.js
%{prefix}/share/%{name}/tests/suites/kasper/formfill.js
%{prefix}/share/%{name}/tests/suites/kasper/request.js
%{prefix}/share/%{name}/tests/suites/kasper/confirm.js
%{prefix}/share/%{name}/tests/suites/kasper/history.js
%{prefix}/share/%{name}/tests/suites/kasper/debug.js
%{prefix}/share/%{name}/tests/suites/kasper/global.js
%{prefix}/share/%{name}/tests/suites/kasper/encode.js
%{prefix}/share/%{name}/tests/suites/kasper/onerror.js
%{prefix}/share/%{name}/tests/suites/kasper/start.js
%{prefix}/share/%{name}/tests/suites/kasper/hooks.js
%{prefix}/share/%{name}/tests/suites/kasper/headers.js
%{prefix}/share/%{name}/tests/suites/kasper/visible.js
%{prefix}/share/%{name}/tests/suites/coffee.coffee
%{prefix}/share/%{name}/tests/suites/require.js
%{prefix}/share/%{name}/tests/suites/cli.js
%{prefix}/share/%{name}/tests/suites/fs.js
%{prefix}/share/%{name}/tests/suites/.kasper
%{prefix}/share/%{name}/tests/suites/tester.js
%{prefix}/share/%{name}/tests/suites/clientutils.js
%{prefix}/share/%{name}/tests/suites/http_status.js
%{prefix}/share/%{name}/tests/suites/xunit.js
%{prefix}/share/%{name}/tests/suites/utils.js
%{prefix}/share/%{name}/tests/selftest.js
%{prefix}/share/%{name}/tests/run.js

%changelog
* Mon Dec 24 2012 Nicolas Perriault <nicolas@perriault.net>
- removed 'injector.js' module

* Mon Dec 10 2012 Jan Schaumann <jschauma@etsy.com>
- include 'tests'

* Mon Nov 26 2012 Jan Schaumann <jschauma@etsy.com>
- first rpm version
