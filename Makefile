.PHONY: default test test-dotNET docs selftest compile-dotNET selftest-dotNET clitest clitest-dotNET lint

default: test

test: selftest clitest lint

test-dotNET: compile-dotNET selftest-dotNET clitest-dotNET lint

docs:
	sphinx-build -b html ./docs docs/_build

selftest:
	bin/casperjs --help
	bin/casperjs selftest

compile-dotNET:
	mcs -langversion:3 -out:bin/casperjs.exe src/casperjs.cs

selftest-dotNET:
	mono bin/casperjs.exe --help
	mono bin/casperjs.exe selftest

clitest:
	python tests/clitests/runtests.py

clitest-dotNET:
	python tests/clitests/runtests.py casperjs.exe

lint:
	eslint .
