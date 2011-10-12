var testResults = {
    passed: 0,
    failed: 0
}, PASS = 'PASS', FAIL = 'FAIL';

phantom.Casper.extend({
    assert: function(condition, message) {
        var status = PASS;
        if (condition === true) {
            style = 'INFO';
            testResults.passed++;
        } else {
            status = FAIL;
            style = 'RED_BAR';
            testResults.failed++;
        }
        this.echo([this.colorizer.colorize(status, style), this.formatMessage(message)].join(' '));
    },

    assertEquals: function(testValue, expected, message) {
        if (expected === testValue) {
            this.echo(this.colorizer.colorize(PASS, 'INFO') + ' ' + this.formatMessage(message));
            testResults.passed++;
        } else {
            this.echo(this.colorizer.colorize(FAIL, 'RED_BAR') + ' ' + this.formatMessage(message, 'WARNING'));
            this.comment('     got:      ' + testValue);
            this.comment('     expected: ' + expected);
            testResults.failed++;
        }
    },

    assertEval: function(fn, message) {
        return this.assert(this.evaluate(fn), message);
    },

    assertEvalEquals: function(fn, expected, message) {
        return this.assertEquals(this.evaluate(fn), expected, message);
    },

    assertMatch: function(subject, pattern, message) {
        return this.assert(pattern.test(subject), message);
    },

    assertTitle: function(expected, message) {
        return this.assertEvalEquals(function() {
            return document.title;
        }, expected, message);
    },

    assertUrlMatch: function(pattern, message) {
        return this.assertMatch(this.getCurrentUrl(), pattern, message);
    },

    comment: function(message) {
        this.echo('# ' + message, 'COMMENT');
    },

    error: function(message) {
        this.echo(message, 'ERROR');
    },

    formatMessage: function(message, style) {
        var parts = /(\w+\(\))(.*)/.exec(message);
        if (!parts) {
            return message;
        }
        return this.colorizer.colorize(parts[1], 'PARAMETER') + this.colorizer.colorize(parts[2], style);
    },

    info: function(message) {
        this.echo(message, 'PARAMETER');
    },

    renderResults: function() {
        var total = testResults.passed + testResults.failed, status, style, result;
        if (testResults.failed > 0) {
            status = FAIL;
            style = 'RED_BAR';
        } else {
            status = PASS;
            style = 'GREEN_BAR';
        }
        result = status + ' ' + total + ' tests executed, ' + testResults.passed + ' passed, ' + testResults.failed + ' failed.';
        if (result.length < 80) {
            result += new Array(80 - result.length + 1).join(' ');
        }
        this.echo(this.colorizer.colorize(result, style));
        this.exit();
    }
});