var t = casper.test;

t.comment('Tester.testEquals()');
t.assert(casper.test.testEquals(null, null), 'Tester.testEquals() null equality');
t.assertNot(casper.test.testEquals(null, undefined), 'Tester.testEquals() null vs. undefined inequality');
t.assert(casper.test.testEquals("hi", "hi"), 'Tester.testEquals() string equality');
t.assertNot(casper.test.testEquals("hi", "ih"), 'Tester.testEquals() string inequality');
t.assert(casper.test.testEquals(5, 5), 'Tester.testEquals() number equality');
t.assert(casper.test.testEquals(5, 5.0), 'Tester.testEquals() cast number equality');
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

t.done();