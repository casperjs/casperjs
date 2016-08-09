/*global casper*/
/*eslint strict:0, max-statements: [1, 99]*/
var utils = require('utils');

casper.test.begin('click() tests', 2, function(test) {
    casper.start('tests/site/index.html', function() {
        this.click('a[href="test.html"]');
    }).then(function() {
        test.assertTitle('CasperJS test target', 'Casper.click() can click on a link');
    }).thenClick('a', function() {
        test.assertTitle('CasperJS test form', 'Casper.thenClick() can click on a link');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('onclick variants tests', 8, function(test) {
    casper.start('tests/site/click.html', function() {
        test.assert(this.click('#test1'), 'Casper.click() can click an `href="javascript:` link');
        test.assert(this.click('#test2'), 'Casper.click() can click an `href="#"` link');
        test.assert(this.click('#test3'), 'Casper.click() can click an `onclick=".*; return false"` link');
        test.assert(this.click('#test4'), 'Casper.click() can click an unobstrusive js handled link');
        var results = this.getGlobal('results');
        // "javascript:" link in Gecko are executed asynchronously, so we don't have result at this time
        if (!test.skipIfEngine(1, {
          name: 'slimerjs',
          message: 'Casper.click() on javascript'
        })) {
            test.assert(results.test1, 'Casper.click() has clicked an `href="javascript:` link');
        }
        test.assert(results.test2, 'Casper.click() has clicked an `href="#"` link');
        test.assert(results.test3, 'Casper.click() has clicked an `onclick=".*; return false"` link');
        test.assert(results.test4, 'Casper.click() has clicked an unobstrusive js handled link');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('clickLabel tests tests', 12, function(test) {
    casper.start('tests/site/click.html', function() {
        test.assert(this.clickLabel('test1'),
            'Casper.clickLabel() can click an `href="javascript:` link');
        test.assert(this.clickLabel('test2'),
            'Casper.clickLabel() can click an `href="#"` link');
        test.assert(this.clickLabel('test3'),
            'Casper.clickLabel() can click an `onclick=".*; return false"` link');
        test.assert(this.clickLabel('test4'),
            'Casper.clickLabel() can click an unobstrusive js handled link');
        test.assert(this.clickLabel('Label with double "quotes"'),
            'Casper.clickLabel() can click the link with double quotes in the label');
        test.assert(this.clickLabel("Label with single 'quotes'"),
            'Casper.clickLabel() can click the link with the single quotes in the label');
        var results = this.getGlobal('results');
        // "javascript:" link in Gecko are executed asynchronously, so we don't have result at this time
        if (!test.skipIfEngine(1, {
          name: 'slimerjs',
          message: 'Casper.click() on javascript'
        })) {
            test.assert(results.test1,
                'Casper.clickLabel() has clicked an `href="javascript:` link');
        }
        test.assert(results.test2,
            'Casper.clickLabel() has clicked an `href="#"` link');
        test.assert(results.test3,
            'Casper.clickLabel() has clicked an `onclick=".*; return false"` link');
        test.assert(results.test4,
            'Casper.clickLabel() has clicked an unobstrusive js handled link');
        test.assert(results.test6,
            'Casper.clickLabel() has clicked the link with double quotes in the label');
        test.assert(results.test7,
            'Casper.clickLabel() has clicked the link with single quotes in the label');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('casper.mouse tests', 4, function(test) {
    casper.start('tests/site/click.html', function() {
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

casper.test.begin('element focus on click', 1, function(test) {
    casper.start().then(function() {
        this.page.content = '<form><input type="text" name="foo"></form>';
        this.click('form input[name=foo]');
        this.page.sendEvent('keypress', 'bar');
        test.assertEquals(this.getFormValues('form').foo, 'bar',
            'Casper.click() sets the focus on clicked element');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('mouse events on click', 3, function(test) {
    casper.start('tests/site/click.html', function() {
        this.click('#test5');
    }).then(function() {
        var results = this.getGlobal('results');
        test.assert(results.test5.indexOf('mousedown') !== -1,
            'Casper.click() triggers mousedown event');
        test.assert(results.test5.indexOf('mouseup') !== -1,
            'Casper.click() triggers mouseup event');
        test.assert(results.test5.indexOf('click') !== -1,
            'Casper.click() triggers click event');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('mouse events on right click', 1, function(test) {
    casper.start('tests/site/click.html', function() {
        this.mouse.rightclick('#test5');
    }).then(function() {
        var results = this.getGlobal('results');

        test.assert(results.test5.indexOf('contextmenu') !== -1,
            'Casper.rightclick() triggers contextmenu event');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('mouse events on right click with x,y co-ordinates', 1, function(test) {
    casper.start('tests/site/click.html', function() {
        this.mouse.rightclick(200, 100);
    }).then(function() {
        var results = this.getGlobal('results');

        test.assertEquals(results.testrightclick, [200, 100],
            'Mouse.move() has moved to the specified position');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('click() on coordinates in selector', 6, function(test) {
    var zone;
    casper.start('tests/site/area.html', function() {
        zone = this.getElementBounds("#contentContainer");
          this.click("#contentContainer",10,20);          
    }).then(function() {
        var results = this.getElementBounds("#thing");
        test.assertEquals(results.left, Math.floor(10-(results.width)/2)+zone.left,
            'click() on specific X position 1');
        test.assertEquals(results.top, Math.floor(20-(results.height)/2)+zone.top,
            'click() on specific Y position 1');
    }).then(function() {
          this.click("#contentContainer",100,200);          
    }).then(function() {
        var results = this.getElementBounds("#thing");
        test.assertEquals(results.left, Math.floor(100-(results.width)/2)+zone.left,
            'click() on specific X position 2');
        test.assertEquals(results.top, Math.floor(200-(results.height)/2)+zone.top,
            'click() on specific Y position 2 ');
    }).then(function() {        
          this.click("#contentContainer","80%","60%");          
    }).then(function() {
        var results = this.getElementBounds("#thing");
        test.assertEquals(results.left, Math.floor((zone.width*0.8)-(results.width)/2)+zone.left,
            'click() on specific X position with percent');
        test.assertEquals(results.top, Math.floor((zone.height*0.6)-(results.height)/2)+zone.top,
            'click() on specific Y position with percent');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('click() on scroll in selector', 4, function(test) {
    var zone;
    casper.start('tests/site/area.html', function() {
        zone = this.getElementBounds("#out");
         this.click("#out");
    }).then(function() {
        var results = this.getElementBounds("#thinga");
        test.assertEquals(results.left, Math.floor((zone.width-results.width)/2)+zone.left,
            'Mouse.click() on default X position 50%');
        test.assertEquals(results.top, Math.floor((zone.height-results.height)/2)+zone.top,
            'Mouse.click() on default Y position 50%');
   }).then(function() {
          this.click("#out",10,20);          
    }).then(function() {
        var results = this.getElementBounds("#thinga");
        test.assertEquals(results.left, Math.floor(10-(results.width)/2)+zone.left,
            'Mouse.click() on specific X position');
        test.assertEquals(results.top, Math.floor(20-(results.height)/2)+zone.top,
            'Mouse.move() on specific Y position');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('casper.mouse() on coordinates in selector', 6, function(test) {
    var zone;
    casper.start('tests/site/area.html', function() {    
        zone = this.getElementBounds("#contentContainer");
         this.mouse.click("#contentContainer");
    }).then(function() {
        var results = this.getElementBounds("#thing");
        test.assertEquals(results.left, Math.floor((zone.width-results.width)/2)+zone.left,
            'Mouse.click() on default X position 50%');
        test.assertEquals(results.top, Math.floor((zone.height-results.height)/2)+zone.top,
            'Mouse.click() on default Y position 50%');
   }).then(function() {
          this.mouse.click("#contentContainer",10,20);          
    }).then(function() {
        var results = this.getElementBounds("#thing");
        test.assertEquals(results.left, Math.floor(10-(results.width)/2)+zone.left,
            'Mouse.click() on specific X position');
        test.assertEquals(results.top, Math.floor(20-(results.height)/2)+zone.top,
            'Mouse.move() on specific Y position');
    }).then(function() {        
          this.mouse.click("#contentContainer","80%","60%");          
    }).then(function() {
        var results = this.getElementBounds("#thing");
        test.assertEquals(results.left, Math.floor((zone.width*0.8)-(results.width)/2)+zone.left,
            'Mouse.click() on specific X position with percent');
        test.assertEquals(results.top, Math.floor((zone.height*0.6)-(results.height)/2)+zone.top,
            'Mouse.click() on specific Y position with percent');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('casper.mouse() on scroll in selector', 4, function(test) {
    var zone;
    casper.start('tests/site/area.html', function() {
        zone = this.getElementBounds("#out");
        this.mouse.click("#out");
    }).then(function() {
        var results = this.getElementBounds("#thinga");
        test.assertEquals(results.left, Math.floor((zone.width-results.width)/2)+zone.left,
            'Mouse.click() on default X position 50%');
        test.assertEquals(results.top, Math.floor((zone.height-results.height)/2)+zone.top,
            'Mouse.click() on default Y position 50%');
   }).then(function() {
          this.mouse.click("#out",10,20);          
    }).then(function() {
        var results = this.getElementBounds("#thinga");        
        test.assertEquals(results.left, Math.floor(10-(results.width)/2)+zone.left,
            'Mouse.click() on specific X position');
        test.assertEquals(results.top, Math.floor(20-(results.height)/2)+zone.top,
            'Mouse.move() on specific Y position');
    }).run(function() {
        test.done();
    });
});
