var t = casper.test;
var f = require( 'utils' ).format;

t.comment('Tester.testEquals()');
t.assert(casper.test.testEquals(null, null), 'Tester.testEquals() null equality');
t.assertNot(casper.test.testEquals(null, undefined), 'Tester.testEquals() null vs. undefined inequality');
t.assert(casper.test.testEquals("hi", "hi"), 'Tester.testEquals() string equality');
t.assertNot(casper.test.testEquals("hi", "ih"), 'Tester.testEquals() string inequality');
t.assert(casper.test.testEquals(5, 5), 'Tester.testEquals() number equality');
t.assertNot(casper.test.testEquals("5", 5), 'Tester.testEquals() number equality without implicit cast');
t.assert(casper.test.testEquals(5, 5.0), 'Tester.testEquals() number equality with cast');
t.assertNot(casper.test.testEquals(5, 10), 'Tester.testEquals() number inequality');
t.assert(casper.test.testEquals([], []), 'Tester.testEquals() empty array equality');
t.assert(casper.test.testEquals([1,2], [1,2]), 'Tester.testEquals() array equality');
t.assert(casper.test.testEquals([1,2,[1,2,function(){}]], [1,2,[1,2,function(){}]]), 'Tester.testEquals() complex array equality');
t.assertNot(casper.test.testEquals([1,2,[1,2,function(a){}]], [1,2,[1,2,function(b){}]]), 'Tester.testEquals() complex array inequality');
t.assertNot(casper.test.testEquals([1,2], [2,1]), 'Tester.testEquals() shuffled array inequality');
t.assertNot(casper.test.testEquals([1,2], [1,2,3]), 'Tester.testEquals() array length inequality');
t.assert(casper.test.testEquals({}, {}), 'Tester.testEquals() empty object equality');
t.assert(casper.test.testEquals({a:1,b:2}, {a:1,b:2}), 'Tester.testEquals() object length equality');
t.assert(casper.test.testEquals({a:1,b:2}, {b:2,a:1}), 'Tester.testEquals() shuffled object keys equality');
t.assertNot(casper.test.testEquals({a:1,b:2}, {a:1,b:3}), 'Tester.testEquals() object inequality');
t.assert(casper.test.testEquals({1:{name:"bob",age:28}, 2:{name:"john",age:26}}, {1:{name:"bob",age:28}, 2:{name:"john",age:26}}), 'Tester.testEquals() complex object equality');
t.assertNot(casper.test.testEquals({1:{name:"bob",age:28}, 2:{name:"john",age:26}}, {1:{name:"bob",age:28}, 2:{name:"john",age:27}}), 'Tester.testEquals() complex object inequality');
t.assert(casper.test.testEquals(function(x){return x;}, function(x){return x;}), 'Tester.testEquals() function equality');
t.assertNot(casper.test.testEquals(function(x){return x;}, function(y){return y+2;}), 'Tester.testEquals() function inequality');

t.comment( 'Tester.findTestFiles' );
var files = t.findTestFiles( 'suites' );
t.assert( files.length > 28, 'Minimum number of JS files under suites/' );

// ensure that all parents come before first child...
var firstCasper = 'suites/casper/capture.js';
var testsAtRoot = [ 
    'cli.js', 'coffee.coffee', 'error.js', 'fs.js', 
    'injector.js', 'tester.js', 'utils.js', 'xunit.js' 
];
testsAtRoot.forEach( function( item ) {
    assertIndexBefore( t, files, 'suites/' + item, firstCasper );
});

// ensure that all children are in the right order
var testsInChild = [
  'capture.js', 'encode.js', 'exists.js', 'formfill.js', 'hooks.js', 
  'resources.coffee', 'viewport.js' 
];

for ( var i = 1, max = testsInChild.length; i < max; i++ ) {
    assertIndexBefore( t, files, 
                       'suites/casper/' + testsInChild[i-1], 
                       'suites/casper/' + testsInChild[i] );
}

t.done();

function fileIndexOf( files, path ) {    
    var pattern = new RegExp( path );
    for ( var i = 0, max = files.length; i < max; i++ ) {
        if ( files[i].match( pattern ) ) {
            return i;
        }
    }
    return -1;
}

function assertIndexBefore( t, files, itemBefore, itemAfter ) {
    var beforeIdx = fileIndexOf( files, itemBefore );
    var afterIdx  = fileIndexOf( files, itemAfter );
    t.assert( beforeIdx < afterIdx, 
              f( "Expected file index for '%s' (%d) to be before that of '%s' (%d)",
                 itemBefore, beforeIdx, itemAfter, afterIdx ) );
}