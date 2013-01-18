/*global kasper*/
/*jshint strict:false maxstatements:99*/
kasper.test.begin('mouseEvent() tests', 16, function(test) {
    kasper.start('tests/site/mouse-events.html', function() {
        test.assert(this.mouseEvent('mousedown', '#test1'), 'kasper.mouseEvent() can dispatch a mousedown event');
        test.assert(this.mouseEvent('mousedown', '#test2'), 'kasper.mouseEvent() can dispatch a mousedown event handled by unobstrusive js');
        test.assert(this.mouseEvent('mouseup', '#test3'), 'kasper.mouseEvent() can dispatch a mouseup event');
        test.assert(this.mouseEvent('mouseup', '#test4'), 'kasper.mouseEvent() can dispatch a mouseup event handled by unobstrusive js');
        test.assert(this.mouseEvent('mouseover', '#test5'), 'kasper.mouseEvent() can dispatch a mouseover event');
        test.assert(this.mouseEvent('mouseover', '#test6'), 'kasper.mouseEvent() can dispatch a mouseover event handled by unobstrusive js');
        test.assert(this.mouseEvent('mouseout', '#test7'), 'kasper.mouseEvent() can dispatch a mouseout event');
        test.assert(this.mouseEvent('mouseout', '#test8'), 'kasper.mouseEvent() can dispatch a mouseout event handled by unobstrusive js');
    });

    kasper.then(function() {
        var results = this.getGlobal('results');
        test.assert(results.test1, 'kasper.mouseEvent() triggered mousedown');
        test.assert(results.test2, 'kasper.mouseEvent() triggered mousedown via unobstrusive js');
        test.assert(results.test3, 'kasper.mouseEvent() triggered mouseup');
        test.assert(results.test4, 'kasper.mouseEvent() triggered mouseup via unobstrusive js');
        test.assert(results.test5, 'kasper.mouseEvent() triggered mouseover');
        test.assert(results.test6, 'kasper.mouseEvent() triggered mouseover via unobstrusive js');
        test.assert(results.test7, 'kasper.mouseEvent() triggered mouseout');
        test.assert(results.test8, 'kasper.mouseEvent() triggered mouseout via unobstrusive js');
    });

    kasper.run(function() {
        test.done();
    });
});
