#!/usr/bin/env python

import json
import os
import platform
import select
import signal
import time
import subprocess
import unittest
import sys
import re
from threading  import Thread

BASE_TIMEOUT = 10
TEST_ROOT = os.path.abspath(os.path.dirname(__file__))
CASPERJS_ROOT = os.path.abspath(os.path.join(TEST_ROOT, '..', '..'))
CASPER_EXEC_FILE = sys.argv[1] if (len(sys.argv) == 2) else 'casperjs'
CASPER_EXEC = os.path.join(CASPERJS_ROOT, 'bin', CASPER_EXEC_FILE)
NEEDS_MONO = CASPER_EXEC.endswith('.exe') and platform.system() != 'Windows'
ENGINE_EXEC = os.environ.get('ENGINE_EXECUTABLE',
                             os.environ.get('PHANTOMJS_EXECUTABLE',
                                            "phantomjs"))
# Make absolute path to engine executable because some tests change the working directory
# and relative path to phantomjs would be invalid.
# Don't make absolute path if the executable is not an actual file path, such as when
# the engine is in the current search PATH.
if os.path.exists(ENGINE_EXEC) and not os.path.isabs(ENGINE_EXEC):
    os.environ['ENGINE_EXECUTABLE'] = os.path.abspath(ENGINE_EXEC)

def exit(message, status):
    print(message)
    sys.exit(status)

def die(message):
    exit(message, 1)

def getEngine(engine_exec):
    rawname = os.environ.get('CASPERJS_ENGINE', engine_exec)
    rawname = os.path.basename(rawname)
    name = re.match('^[a-zA-Z]*', rawname)
    if None == name:
        die("Could not get engine name from %s\n" % (rawname))
    name = name.group(0).lower()
    cmd_args = [engine_exec, '--version']
    version = subprocess.check_output(cmd_args).strip()
    parts = re.match('^[^0-9]*([0-9]+)\.([0-9]+)\.([^\s])', version)
    if None == parts:
        die("Could not get engine version from %s\n" % (version))
    return {
        'NAME': name,
        'VERSION': {
            'MAJOR': parts.group(1),
            'MINOR': parts.group(2),
            'PATCH': parts.group(3)
        }
    }

ENGINE = getEngine(ENGINE_EXEC)

# FIXME: slimerjs is not yet ready to be used as CLI because it is not
# possible to pass arguments to the main script with slimerjs
if 'slimerjs' == ENGINE['NAME']:
    exit("Skip cli tests for slimerjs", 0)

# timeout handling as per https://gist.github.com/kirpit/1306188
# Based on jcollado's solution:
# http://stackoverflow.com/questions/1191374/subprocess-with-timeout/4825933#4825933
# using ideas from https://gist.github.com/wkettler/9235609
class TimeoutException(Exception):
    def __init__(self, cmd, timeout, output=None, err=None):
        self.cmd = cmd
        self.timeout = timeout
        self.output = output
        self.err = err

    def __str__(self):
        return "Command '%s' timed out after %d second(s)." % \
               (self.cmd, self.timeout)


class RetcodeException(Exception):
    def __init__(self, cmd, retcode, output=None, err=None):
        self.cmd = cmd
        self.retcode = retcode
        self.output = output
        self.err = err

    def __str__(self):
        return "Command '%s' returned non-zero exit status %d" % \
               (self.cmd, self.returncode)


class Command(object):
    command = None
    process = None
    status = None
    output, error = '', ''

    def __init__(self, command):
        if isinstance(command, basestring):
            command = shlex.split(command)
        self.command = command

    def __str__(self):
        return "'%s'" % (' '.join(self.command))

    def run(self, timeout=None, **kwargs):
        def target(**kwargs):
            try:
                self.process = subprocess.Popen(self.command, **kwargs)
                self.output, self.error = self.process.communicate()
                self.status = self.process.returncode
            except:
                self.error = traceback.format_exc()
                self.status = -1
        # default stdout and stderr
        if 'stdout' not in kwargs:
            kwargs['stdout'] = subprocess.PIPE
        if 'stderr' not in kwargs:
            kwargs['stderr'] = subprocess.PIPE
        # thread
        thread = Thread(target=target, kwargs=kwargs)
        thread.start()
        thread.join(timeout)
        if thread.is_alive():
            self.process.terminate()
            thread.join(0)
            raise TimeoutException(self.command, timeout, self.output, self.error)
        if self.status:
            raise RetcodeException(self.command, self.status, self.output, self.error)
        return self.output, self.error


class CasperExecTestBase(unittest.TestCase):
    def setUp(self):
        with open(os.path.join(CASPERJS_ROOT, 'package.json')) as f:
            self.pkg_version = json.load(f).get('version')

    def runCommand(self, cmd, **kwargs):
        failing = kwargs.get('failing', False)
        timeout = kwargs.get('timeout', BASE_TIMEOUT)
        cmd_args = [CASPER_EXEC, '--no-colors'] + cmd.split(' ')
        if NEEDS_MONO:
            cmd_args = ['mono'] + cmd_args;
        try:
            cmd = Command(cmd_args)
            out, err = cmd.run(timeout, stderr=subprocess.STDOUT)
            return out.strip().decode('utf-8')
            if failing:
                raise AssertionError('Command %s has not failed' % cmd)
        except RetcodeException as err:
            if failing:
                return err.output.decode('utf-8')
            raise IOError('Command %s exited: %s \n %s'
                          % (cmd, err.retcode, err.output.decode('utf-8')))
        except TimeoutException as err:
            raise IOError('Command %s timed out after %d seconds:\n%s\n%s'
                          % (cmd, err.timeout, err.output.decode('utf-8'),
                          err.err.decode('utf-8')
                          ))

    def assertCommandOutputEquals(self, cmd, result, **kwargs):
        self.assertEqual(self.runCommand(cmd), result)

    def assertCommandOutputContains(self, cmd, what, **kwargs):
        if not what:
            raise AssertionError('Empty lookup')
        if isinstance(what, (list, tuple)):
            output = self.runCommand(cmd, **kwargs)
            for entry in what:
                self.assertIn(entry, output)
        else:
            self.assertIn(what, self.runCommand(cmd))

    def assertCommandOutputDoesNotContain(self, cmd, what, **kwargs):
        if not what:
            raise AssertionError('Empty lookup')
        if isinstance(what, (list, tuple)):
            output = self.runCommand(cmd, **kwargs)
            for entry in what:
                self.assertNotIn(entry, output)
        else:
            self.assertNotIn(what, self.runCommand(cmd))


class BasicCommandsTest(CasperExecTestBase):
    def test_version(self):
        self.assertCommandOutputEquals('--version', self.pkg_version)

    def test_help(self):
        self.assertCommandOutputContains('--help', self.pkg_version)


class RequireScriptFullPathTest(CasperExecTestBase):
    def test_simple_require(self):
        script_path = os.path.join(TEST_ROOT, 'modules', 'test.js')
        self.assertCommandOutputEquals(script_path, 'hello, world')

    def test_require_coffee(self):
        if ('phantomjs' == ENGINE['NAME'] and 1 < ENGINE['VERSION']['MAJOR']):
            return
        script_path = os.path.join(TEST_ROOT, 'modules', 'test_coffee.js')
        self.assertCommandOutputEquals(script_path, '42')

    def test_node_module_require(self):
        script_path = os.path.join(TEST_ROOT, 'modules', 'test_node_mod.js')
        self.assertCommandOutputEquals(script_path, '42')

    def test_node_module_require_index(self):
        script_path = os.path.join(
            TEST_ROOT, 'modules', 'test_node_mod_index.js')
        self.assertCommandOutputEquals(script_path, '42')

    def test_node_module_require_json_package(self):
        script_path = os.path.join(
            TEST_ROOT, 'modules', 'test_node_mod_json_package.js')
        self.assertCommandOutputEquals(script_path, '42')

    def test_node_module_require_json(self):
        script_path = os.path.join(TEST_ROOT, 'modules', 'test_node_json.js')
        self.assertCommandOutputEquals(script_path, '42')


class RequireWithOnlyScriptNameTest(CasperExecTestBase):

    def setUp(self):
        self.currentPath = os.getcwd()
        os.chdir(os.path.join(TEST_ROOT, 'modules'))
        super(RequireWithOnlyScriptNameTest, self).setUp()

    def tearDown(self):
        os.chdir(self.currentPath)
        super(RequireWithOnlyScriptNameTest, self).tearDown()

    def test_simple_require(self):
        self.assertCommandOutputEquals('test.js', 'hello, world')

    def test_simple_patched_require(self):
        self.assertCommandOutputEquals(
            'test_patched_require.js', 'hello, world')

    def test_require_coffee(self):
        if ('phantomjs' == ENGINE['NAME'] and 1 < ENGINE['VERSION']['MAJOR']):
            return
        self.assertCommandOutputEquals('test_coffee.js', '42')

    def test_node_module_require(self):
        self.assertCommandOutputEquals('test_node_mod.js', '42')

    def test_node_module_require_index(self):
        self.assertCommandOutputEquals('test_node_mod_index.js', '42')

    def test_node_module_require_json_package(self):
        self.assertCommandOutputEquals('test_node_mod_json_package.js', '42')

    def test_node_module_require_json(self):
        self.assertCommandOutputEquals('test_node_json.js', '42')


class RequireWithRelativeScriptPathTest(CasperExecTestBase):
    def setUp(self):
        self.currentPath = os.getcwd()
        os.chdir(os.path.join(TEST_ROOT, 'modules'))
        super(RequireWithRelativeScriptPathTest, self).setUp()

    def tearDown(self):
        os.chdir(self.currentPath)
        super(RequireWithRelativeScriptPathTest, self).tearDown()

    def test_simple_require(self):
        self.assertCommandOutputEquals('./test.js', 'hello, world')

    def test_simple_patched_require(self):
        self.assertCommandOutputEquals(
            'test_patched_require.js', 'hello, world')

    def test_require_coffee(self):
        if ('phantomjs' == ENGINE['NAME'] and 1 < ENGINE['VERSION']['MAJOR']):
            return
        self.assertCommandOutputEquals('./test_coffee.js', '42')

    def test_node_module_require(self):
        self.assertCommandOutputEquals('./test_node_mod.js', '42')

    def test_node_module_require_index(self):
        self.assertCommandOutputEquals('./test_node_mod_index.js', '42')

    def test_node_module_require_json_package(self):
        self.assertCommandOutputEquals('./test_node_mod_json_package.js', '42')

    def test_node_module_require_json(self):
        self.assertCommandOutputEquals('./test_node_json.js', '42')

    def test_node_module_require_subdir(self):
        self.assertCommandOutputEquals('./test_node_subdir/test_node_mod.js', '42')


class ScriptOutputTest(CasperExecTestBase):
    def test_simple_script(self):
        script_path = os.path.join(TEST_ROOT, 'scripts', 'script.js')
        self.assertCommandOutputEquals(script_path, 'it works')


class ScriptOptionsTest(CasperExecTestBase):
    def test_script_options(self):
        script_path = os.path.join(TEST_ROOT, 'scripts', 'options.js')
        # Specify a mix of engine and script options.
        # --whoops is special in that it starts with --w, which is a phantomjs engine command.
        #  At one time was mishandled in src/casperjs.cs.
        script_path_script_args = script_path + ' --debug=no --load-images=no --whoops --this-is-a=test --max-disk-cache-size=1024'
        self.assertCommandOutputContains(script_path_script_args, [
            '    "whoops": true,',
            '    "this-is-a": "test"',
        ])

    def test_engine_options(self):
        script_path = os.path.join(TEST_ROOT, 'scripts', 'options.js')
        # Specify a mix of engine and script options.
        # --whoops is special in that it starts with --w, which is a phantomjs engine command.
        #  At one time was mishandled in src/casperjs.cs.
        script_path_script_args = script_path + ' --debug=no --load-images=no --whoops --this-is-a=test --max-disk-cache-size=1024'
        self.assertCommandOutputDoesNotContain(script_path_script_args, [
            '    "debug": "no",',
            '    "load-images": "no",',
            '    "max-disk-cache-size": 1024',
        ])


class ScriptErrorTest(CasperExecTestBase):
    def test_syntax_error(self):
        # phantomjs and slimerjs 'SyntaxError: Parse error'
        # phantomjs2 message is 'SyntaxError: Unexpected token \'!\''
        script_path = os.path.join(TEST_ROOT, 'error', 'syntax.js')
        self.assertCommandOutputContains(script_path, [
            'SyntaxError: ',
        ], failing=True)

    def test_syntax_error_in_test(self):
        # phantomjs and slimerjs message is 'SyntaxError: Parse error'
        # phantomjs2 message is 'SyntaxError: Unexpected token \'!\''
        script_path = os.path.join(TEST_ROOT, 'error', 'syntax.js')
        self.assertCommandOutputContains('test %s' % script_path, [
            'SyntaxError: ',
        ], failing=True)


class TestCommandOutputTest(CasperExecTestBase):
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
            '0 dubious',
            '0 skipped',
        ])

    def test_new_style_test(self):
        # using begin()
        script_path = os.path.join(TEST_ROOT, 'tester', 'passing.js')
        self.assertCommandOutputContains('test ' + script_path, [
            script_path,
            '# true',
            'PASS Subject is strictly true',
            'PASS 1 test executed',
            '1 passed',
            '0 failed',
            '0 dubious',
            '0 skipped',
        ])

    def test_new_failing_test(self):
        # using begin()
        script_path = os.path.join(TEST_ROOT, 'tester', 'failing.js')
        self.assertCommandOutputContains('test ' + script_path, [
            script_path,
            '# true',
            'FAIL Subject is strictly true',
            '#    type: assert',
            '#    file: %s' % script_path,
            '#    subject: false',
            'FAIL 1 test executed',
            '0 passed',
            '1 failed',
            '0 dubious',
            '0 skipped',
        ], failing=True)

    def test_step_throwing_test(self):
        # using begin()
        script_path = os.path.join(TEST_ROOT, 'tester', 'step_throws.js')
        self.assertCommandOutputContains('test ' + script_path, [
            script_path,
            '# step throws',
            'FAIL Error: oops!',
            '#    type: uncaughtError',
            '#    file: %s' % script_path,
            '#    error: oops!',
            'FAIL 1 test executed',
            '0 passed',
            '1 failed',
            '0 dubious',
            '0 skipped',
        ], failing=True)

    def test_waitFor_timeout(self):
        # using begin()
        script_path = os.path.join(TEST_ROOT, 'tester', 'waitFor_timeout.js')
        self.assertCommandOutputContains('test ' + script_path, [
            '"p.nonexistent" still did not exist in',
            '"#encoded" did not have a text change in',
            '"p[style]" never appeared in',
            '/github\.com/ did not load in',
            '/foobar/ did not pop up in',
            '"Lorem ipsum" did not appear in the page in',
            'return false',
            'did not evaluate to something truthy in'
        ], failing=True)

    def test_casper_test_instance_overriding(self):
        script_path = os.path.join(TEST_ROOT, 'tester', 'casper-instance-override.js')
        self.assertCommandOutputContains('test ' + script_path, [
            "Fatal: you can't override the preconfigured casper instance",
        ], failing=True)

    def test_dubious_test(self):
        script_path = os.path.join(TEST_ROOT, 'tester', 'dubious.js')
        self.assertCommandOutputContains('test ' + script_path, [
            script_path,
            'dubious test: 2 tests planned, 1 tests executed',
            'FAIL 1 test executed',
            '1 passed',
            '1 failed',
            '1 dubious',
            '0 skipped',
        ], failing=True)

    def test_exit_test(self):
        script_path = os.path.join(TEST_ROOT, 'tester', 'exit.js')
        self.assertCommandOutputContains('test ' + script_path, [
            script_path,
            '# sample',
            'PASS Subject is strictly true',
            'PASS 1 test executed',
            '1 passed',
            '0 failed',
            '0 dubious',
            '0 skipped.',
            'exited'
        ])

    def test_skipped_test(self):
        script_path = os.path.join(TEST_ROOT, 'tester', 'skipped.js')
        self.assertCommandOutputContains('test ' + script_path, [
            script_path,
            'SKIP 1 test skipped',
            'PASS 1 test executed',
            '1 passed',
            '0 failed',
            '0 dubious',
            '1 skipped',
        ])

    def test_full_suite(self):
        folder_path = os.path.join(TEST_ROOT, 'tester')
        failing_script = os.path.join(folder_path, 'failing.js')
        passing_script = os.path.join(folder_path, 'passing.js')
        mytest_script = os.path.join(folder_path, 'mytest.js')
        self.assertCommandOutputContains(' '.join([
            'test', failing_script, passing_script, mytest_script
        ]), [
            'Test file: %s' % failing_script,
            '# true',
            'FAIL Subject is strictly true',
            '#    type: assert',
            '#    file: %s' % failing_script,
            '#    subject: false',
            'Test file: %s' % mytest_script,
            'PASS ok1',
            'PASS ok2',
            'PASS ok3',
            'Test file: %s' % passing_script,
            '# true',
            'PASS Subject is strictly true',
            'FAIL 5 tests executed',
            '4 passed',
            '1 failed',
            '0 dubious',
            '0 skipped',
            'Details for the 1 failed test:',
            'assert: Subject is strictly true',
        ], failing=True, timeout=3 * BASE_TIMEOUT)

    def test_fail_fast(self):
        folder_path = os.path.join(TEST_ROOT, 'fail-fast', 'standard')
        self.assertCommandOutputContains('test %s --fail-fast' % folder_path, [
            '# test 1',
            '# test 2',
            'fail event fired!',
            '--fail-fast: aborted all remaining tests',
            'FAIL 2 tests executed',
            '1 passed',
            '1 failed',
            '0 dubious',
            '0 skipped',
        ], failing=True, timeout=3 * BASE_TIMEOUT)

    def test_manual_abort(self):
        folder_path = os.path.join(TEST_ROOT, 'fail-fast', 'manual-abort')
        self.assertCommandOutputContains('test %s --fail-fast' % folder_path, [
            '# test abort()',
            'PASS test 1',
            'PASS test 5',
            'this is my abort message',
        ], failing=True, timeout=3 * BASE_TIMEOUT)


class XUnitReportTest(CasperExecTestBase):
    XUNIT_LOG = os.path.join(TEST_ROOT, '__log.xml')

    def setUp(self):
        self.clean()

    def tearDown(self):
        self.clean()

    def clean(self):
        if os.path.exists(self.XUNIT_LOG):
            os.remove(self.XUNIT_LOG)

    def test_xunit_report_failing(self):
        script_path = os.path.join(TEST_ROOT, 'tester', 'failing.js')
        command = 'test %s --xunit=%s' % (script_path, self.XUNIT_LOG)
        self.runCommand(command, failing=True)
        self.assertTrue(os.path.exists(self.XUNIT_LOG))
        self.assertTrue(open(self.XUNIT_LOG).read().find('classname="tests/clitests/tester/failing"'))

    def test_xunit_report_passing(self):
        script_path = os.path.join(TEST_ROOT, 'tester', 'passing.js')
        command = 'test %s --xunit=%s' % (script_path, self.XUNIT_LOG)
        self.runCommand(command, failing=False)
        self.assertTrue(os.path.exists(self.XUNIT_LOG))
        self.assertTrue(open(self.XUNIT_LOG).read().find('classname="tests/clitests/tester/passing"'))


if __name__ == '__main__':
    del sys.argv[1:]
    unittest.main()
