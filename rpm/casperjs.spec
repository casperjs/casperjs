%define name	casperjs
%define version	1.0.0
%define release RC4
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
CasperJS is an open source navigation scripting & testing utility written
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
%{prefix}/share/%{name}/modules/casper.js
%{prefix}/share/%{name}/modules/cli.js
%{prefix}/share/%{name}/modules/clientutils.js
%{prefix}/share/%{name}/modules/colorizer.js
%{prefix}/share/%{name}/modules/events.js
%{prefix}/share/%{name}/modules/http.js
%{prefix}/share/%{name}/modules/injector.js
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

%changelog
* Mon Nov 26 2012 Jan Schaumann <jschauma@etsy.com>
- first rpm version
