.PHONY: default test test-dotNET docs selftest compile-dotNET selftest-dotNET clitest clitest-dotNET jshint

default: test

test: selftest clitest jshint

test-dotNET: compile-dotNET selftest-dotNET clitest-dotNET jshint

docs:
	sphinx-build -b html ./docs docs/_build

selftest:
	bin/casperjs selftest

compile-dotNET:
	mcs -langversion:3 -out:bin/casperjs.exe src/casperjs.cs

selftest-dotNET:
	bin/casperjs.exe selftest

clitest:
	python tests/clitests/runtests.py

clitest-dotNET:
	python tests/clitests/runtests.py casperjs.exe

jshint:
	jshint .
