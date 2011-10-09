phantom.Casper.extend({
    assert: function(condition, message) {
        var status = '[PASS]';
        if (condition === true) {
            testResults.passed++;
        } else {
            status = '[FAIL]';
            testResults.failed++;
        }
        this.echo([status, message].join(' '));
    },

    assertEquals: function(testValue, expected, message) {
        if (expected === testValue) {
            this.echo('[PASS] ' + message);
            testResults.passed++;
        } else {
            this.echo('[FAIL] ' + message);
            this.echo('  got:      ' + testValue);
            this.echo('  expected: ' + expected);
            testResults.failed++;
        }
    },

    assertEvalEquals: function(fn, expected, message) {
        return this.assertEquals(this.evaluate(fn), expected, message);
    }
});