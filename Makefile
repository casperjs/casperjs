.PHONY: default all

default: all

all: selftest clitest jshint

selftest:
	bin/casperjs selftest

clitest:
	python tests/clitests/runtests.py

jshint:
	jshint --config=.jshintconfig .
