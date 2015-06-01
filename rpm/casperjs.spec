%define name casperjs
%define version 2
%define release 0

Summary:        open source navigation scripting & testing utility written in Javascript
Name:           %{name}
Version:        %{version}
License:        BSD
Release:        %{release}
Packager:       Jan Schaumann <jschauma@etsy.com>
Group:          Utilities/Misc
Source:         %{name}.tar.gz
BuildRoot:      %{_builddir}/%{name}
BuildArch: 	noarch

%description
CasperJS is an open source navigation scripting & testing utility written
in Javascript and based on PhantomJS.  It eases the process of defining a
full navigation scenario and provides useful high-level functions, methods
& syntactic sugar for doing common tasks

%prep
%setup -c 

%install
#[ "$RPM_BUILD_ROOT" != "/" ] && %__rm -rf "$RPM_BUILD_ROOT"
%__mkdir_p %{buildroot}%{_datadir}/%{name}/bin
%__mkdir_p %{buildroot}%{_datadir}/%{name}/modules
%__mkdir_p %{buildroot}%{_datadir}/%{name}/samples
%__mkdir_p %{buildroot}%{_datadir}/%{name}/tests

%__cp bin/%{name} $RPM_BUILD_ROOT%{_datadir}/%{name}/bin/
%__cp bin/usage.txt $RPM_BUILD_ROOT%{_datadir}/%{name}/bin/
%__cp bin/bootstrap.js $RPM_BUILD_ROOT%{_datadir}/%{name}/bin/
%__cp -R modules/* $RPM_BUILD_ROOT%{_datadir}/%{name}/modules/
%__cp -R samples/*.js $RPM_BUILD_ROOT%{_datadir}/%{name}/samples/
%__cp -R tests/* $RPM_BUILD_ROOT%{_datadir}/%{name}/tests/
%__cp CHANGELOG.md $RPM_BUILD_ROOT%{_datadir}/%{name}/
%__cp CONTRIBUTING.md $RPM_BUILD_ROOT%{_datadir}/%{name}/
%__cp CONTRIBUTORS.md $RPM_BUILD_ROOT%{_datadir}/%{name}/
%__cp LICENSE.md $RPM_BUILD_ROOT%{_datadir}/%{name}/
%__cp README.md $RPM_BUILD_ROOT%{_datadir}/%{name}/
%__cp package.json $RPM_BUILD_ROOT%{_datadir}/%{name}/

%post
ln -sf %{_datadir}/%{name}/bin/casperjs %{_bindir}/%{name}

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(0444,root,root)
%attr(0555,root,root)%{_datadir}/%{name}/bin/casperjs
%attr(0555,root,root)%{_datadir}/%{name}/bin/bootstrap.js
%{_datadir}/%{name}/bin/usage.txt
%{_datadir}/%{name}/CHANGELOG.md
%{_datadir}/%{name}/CONTRIBUTING.md
%{_datadir}/%{name}/CONTRIBUTORS.md
%{_datadir}/%{name}/LICENSE.md
%{_datadir}/%{name}/README.md
%{_datadir}/%{name}/package.json
%{_datadir}/%{name}/modules/*
%{_datadir}/%{name}/samples/*
%{_datadir}/%{name}/tests/*

%changelog
* Fri Nov 15 2013 Yasuo Ohgaki <yohgaki@ohgaki.net>
- update spec for master and other branches

* Mon Dec 24 2012 Nicolas Perriault <nicolas@perriault.net>
- removed 'injector.js' module

* Mon Dec 10 2012 Jan Schaumann <jschauma@etsy.com>
- include 'tests'

* Mon Nov 26 2012 Jan Schaumann <jschauma@etsy.com>
- first rpm version
