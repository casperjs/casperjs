per.start('tests/site/keyboard-events.html');

casper.then(function() {
        this.test.comment('CasperUtils.keyboardEvent()');

    this.test.assert(this.keyboardEvent('keypress', '#test1', '0'), 'CasperUtils.keyboardEvent() can dispatch a keypress event');
    this.test.assert(this.keyboardEvent('keydown', '#test1', '1'), 'CasperUtils.keyboardEvent() can dispatch a keydown event');
    this.test.assert(this.keyboardEvent('keyup', '#test1', '2'), 'CasperUtils.keyboardEvent() can dispatch a keyup event');
    this.test.assert(this.keyboardEvent('keydown', '#test2', 'Down'), 'CasperUtils.keyboardEvent() can dispatch an arrow key');
    this.keyboardEvent('keydown', '#test2', 'Down');
    this.keyboardEvent('keydown', '#test2', 'Down');

    var results = this.getGlobal('results');
    this.test.assertEvalEquals(function() {return document.querySelector('#test1').value;}, "012", 'CasperUtils.keyboardEvent() can set the value of a textarea');
    this.test.assertEvalEquals(function() {return document.querySelector('#test2').selectedIndex;}, 3, 'CasperUtils.keyboardEvent() can update the value of a select');
});

casper.run(function() {
    this.test.done();
});

