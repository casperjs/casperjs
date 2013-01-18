/*global kasper*/
/*jshint strict:false maxstatements: 99*/
var utils = require('utils');

kasper.test.begin('click() tests', 2, function(test) {
    kasper.start('tests/site/index.html', function() {
        this.click('a[href="test.html"]');
    }).then(function() {
        test.assertTitle('kasperJS test target', 'kasper.click() can click on a link');
    }).thenClick('a', function() {
        test.assertTitle('kasperJS test form', 'kasper.thenClick() can click on a link');
    }).run(function() {
        test.done();
    });
});

kasper.test.begin('onclick variants tests', 8, function(test) {
    kasper.start('tests/site/click.html', function() {
        test.assert(this.click('#test1'), 'kasper.click() can click an `href="javascript:` link');
        test.assert(this.click('#test2'), 'kasper.click() can click an `href="#"` link');
        test.assert(this.click('#test3'), 'kasper.click() can click an `onclick=".*; return false"` link');
        test.assert(this.click('#test4'), 'kasper.click() can click an unobstrusive js handled link');
        var results = this.getGlobal('results');
        test.assert(results.test1, 'kasper.click() has clicked an `href="javascript:` link');
        test.assert(results.test2, 'kasper.click() has clicked an `href="#"` link');
        test.assert(results.test3, 'kasper.click() has clicked an `onclick=".*; return false"` link');
        test.assert(results.test4, 'kasper.click() has clicked an unobstrusive js handled link');
    }).run(function() {
        test.done();
    });
});

kasper.test.begin('clickLabel tests tests', 8, function(test) {
    kasper.start('tests/site/click.html', function() {
        test.assert(this.clickLabel('test1'),
            'kasper.clickLabel() can click an `href="javascript:` link');
        test.assert(this.clickLabel('test2'),
            'kasper.clickLabel() can click an `href="#"` link');
        test.assert(this.clickLabel('test3'),
            'kasper.clickLabel() can click an `onclick=".*; return false"` link');
        test.assert(this.clickLabel('test4'),
            'kasper.clickLabel() can click an unobstrusive js handled link');
        var results = this.getGlobal('results');
        test.assert(results.test1,
            'kasper.clickLabel() has clicked an `href="javascript:` link');
        test.assert(results.test2,
            'kasper.clickLabel() has clicked an `href="#"` link');
        test.assert(results.test3,
            'kasper.clickLabel() has clicked an `onclick=".*; return false"` link');
        test.assert(results.test4,
            'kasper.clickLabel() has clicked an unobstrusive js handled link');
    }).run(function() {
        test.done();
    });
});

kasper.test.begin('kasper.mouse tests', 4, function(test) {
    kasper.start('tests/site/click.html', function() {
        this.mouse.down(200, 100);
        var results = this.getGlobal('results');
        test.assertEquals(results.testdown, [200, 100],
            'Mouse.down() has pressed button to the specified position');
        this.mouse.up(200, 100);
        results = this.getGlobal('results');
        test.assertEquals(results.testup, [200, 100],
            'Mouse.up() has released button to the specified position');
        this.mouse.move(200, 100);
        results = this.getGlobal('results');
        test.assertEquals(results.testmove, [200, 100],
            'Mouse.move() has moved to the specified position');
        if (utils.gteVersion(phantom.version, '1.8.0')) {
            this.mouse.doubleclick(200, 100);
            results = this.getGlobal('results');
            this.test.assertEquals(results.testdoubleclick, [200, 100],
                'Mouse.doubleclick() double-clicked the specified position');
        } else {
            this.test.pass("Mouse.doubleclick() requires PhantomJS >= 1.8");
        }
    }).run(function() {
        test.done();
    });
});

kasper.test.begin('element focus on click', 1, function(test) {
    kasper.start().then(function() {
        this.page.content = '<form><input type="text" name="foo"></form>'
        this.click('form input[name=foo]')
        this.page.sendEvent('keypress', 'bar');
        test.assertEquals(this.getFormValues('form')['foo'], 'bar',
            'kasper.click() sets the focus on clicked element');
    }).run(function() {
        test.done();
    });
});
