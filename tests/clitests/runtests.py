#!/usr/bin/env python

import json
import os
import signal
import subprocess
import unittest

TEST_ROOT = os.path.abspath(os.path.dirname(__file__))
CASPERJS_ROOT = os.path.abspath(os.path.join(TEST_ROOT, '..', '..'))
CASPER_EXEC = os.path.join(CASPERJS_ROOT, 'bin', 'casperjs')

class TimeoutException(Exception):
    pass

def timeout(timeout_time):
    def timeout_function(f):
        def f2(*args):
            def timeout_handler(signum, frame):
                raise TimeoutException()
            old_handler = signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(timeout_time) # triger alarm in timeout_time seconds
            try:
                retval = f(*args)
            except TimeoutException:
                raise AssertionError('timeout of %ds. exhausted' % timeout_time)
            finally:
                signal.signal(signal.SIGALRM, old_handler)
            signal.alarm(0)
            return retval
        return f2
    return timeout_function

class CasperExecTest(unittest.TestCase):
    def setUp(self):
        with open(os.path.join(CASPERJS_ROOT, 'package.json')) as f:
            self.pkg_version = json.load(f).get('version')

    def runCommand(self, cmd):
        cmd_args = [CASPER_EXEC, '--no-colors'] + cmd.split(' ')
        try:
            return subprocess.check_output(cmd_args).strip()
        except subprocess.CalledProcessError as err:
            raise IOError('Command %s exited with status %s' % (cmd, err.status))

    def assertCommandOutputEquals(self, cmd, result):
        self.assertEquals(self.runCommand(cmd), result)

    def assertCommandOutputContains(self, cmd, what):
        if isinstance(what, (list, tuple)):
            for entry in what:
                self.assertIn(entry, self.runCommand(cmd))
        else:
            self.assertIn(what, self.runCommand(cmd))

    @timeout(20)
    def test_version(self):
        self.assertCommandOutputEquals('--version', self.pkg_version)

    @timeout(20)
    def test_help(self):
        self.assertCommandOutputContains('--help', self.pkg_version)

    @timeout(20)
    def test_require(self):
        script_path = os.path.join(TEST_ROOT, 'modules', 'test.js')
        self.assertCommandOutputEquals(script_path, 'hello, world')

    @timeout(20)
    def test_simple_script(self):
        script_path = os.path.join(TEST_ROOT, 'scripts', 'script.js')
        self.assertCommandOutputEquals(script_path, 'it works')

    @timeout(20)
    def test_simple_test_script(self):
        script_path = os.path.join(TEST_ROOT, 'tester', 'mytest.js')
        self.assertCommandOutputContains('test ' + script_path, [
            script_path,
            'PASS ok1',
            'PASS ok2',
            'PASS ok3',
            '3 tests executed',
            '3 passed',
            '0 failed',
        ])

    @timeout(20)
    def test_new_style_test(self):
        # using begin()
        script_path = os.path.join(TEST_ROOT, 'tester', 'passing.js')
        self.assertCommandOutputContains('test ' + script_path, [
            script_path,
            '# true',
            'PASS Subject is strictly true',
            'PASS 1 tests executed',
            '1 passed',
            '0 failed',
        ])

if __name__ == '__main__':
    unittest.main()
