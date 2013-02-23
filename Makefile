.PHONY: default all

default: all

all: selftest clitest jshint

selftest:
	casperjs selftest

clitest:
	python tests/clitests/runtests.py

jshint:
	jshint --config=.jshintconfig .
