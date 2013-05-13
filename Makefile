.PHONY: default test docs selftest clitest jshint

default: test

test: selftest clitest jshint

docs:
	sphinx-build -b html ./docs docs/_build

selftest:
	bin/casperjs selftest

clitest:
	python tests/clitests/runtests.py

jshint:
	jshint .
