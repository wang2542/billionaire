sorted-map
==========

[![Build Status](https://travis-ci.org/globesherpa/sorted-map.png)](https://travis-ci.org/globesherpa/sorted-map)

A sorted map based heavily upon redis' skip list implementation.

Test
====

Run any of the following:

```sh
$ mocha
$ npm test
$ make test
```

_Note:_ remember to `npm install`!

Install
=======

```sh
$ npm install sorted-map
```

API
===

```js
var Map = require('sorted-map');

var map = new Map();

// average O(log(N))
map.set('5a600e16', 8);
map.set('5a600e17', 9);
map.set('5a600e18', 10); // => null
map.set('5a600e17', 12); // => 9

// average O(1)
map.has('5a600e17'); // => true

// average O(1)
map.get('5a600e17'); // => 12

// average O(log(N))
map.del('5a600e16'); // => 8

// average O(1)
map.del('5a600e16'); // => null

map.set('5a600e10', 16);
map.set('5a600e11', 6);
map.set('5a600e12', 17);
map.set('5a600e13', 11);
map.set('5a600e14', 14);
map.set('5a600e15', 19);
map.set('5a600e16', 3);

// average O(log(N)+M) where M is the number of elements between min and max
map.range(14, 16); // [14-16]
// => [{key: '5a600e14', value: 14}, {key: '5a600e10', value: 16}]

map.range(17); // [17-∞)
// => [{key: '5a600e12', value: 17}, {key: '5a600e15', value: 19}]

// average O(log(N)+log(M)) where M as in range
map.count(14, 16); // => 2

// more or less indexOf for the sorted values
// average O(log(N))
map.rank('5a600e16'); // => 0
map.rank('5a600e13'); // => 3
map.rank('5a600e14'); // => 5
map.rank('5a600e15'); // => 8
map.rank('5a600e19'); // => -1

// average O(log(N)+M) where M as in range
map.slice(0, 3);
// => [{key: '5a600e16', value: 3},
//     {key: '5a600e11', value: 6},
//     {key: '5a600e18', value: 10}]

map.slice(-1); // => [{key: '5a600e16', value: 3}]

map.length; // => 9
```

Intersection
------------

```js
var a = new Map(), b = new Map();

a.set('5a600e10', 16);
a.set('5a600e12', 10);
a.set('5a600e14', 9);
a.set('5a600e15', 14);
a.set('5a600e17', 20);
a.set('5a600e18', 13);
a.set('5a600e19', 15);
a.set('5a600e1a', 19);
a.set('5a600e1b', 7);
a.set('5a600e1c', 13);
a.set('5a600e1e', 10);

b.set('5a600e10', 0);
b.set('5a600e11', 15);
b.set('5a600e13', 5);
b.set('5a600e14', 3);
b.set('5a600e15', 14);
b.set('5a600e17', 12);
b.set('5a600e19', 12);
b.set('5a600e1b', 16);
b.set('5a600e1c', 12);
b.set('5a600e1d', 17);
b.set('5a600e1f', 3);

Map.intersect(a, b);
// => ['5a600e10', '5a600e14', '5a600e17', '5a600e19', '5a600e1c', '5a600e15', '5a600e1b']

Map.intersect(b, a);
// => ['5a600e1b', '5a600e14', '5a600e1c', '5a600e15', '5a600e19', '5a600e10', '5a600e17']

// works, but not preferred
a.intersect(b);
// => ['5a600e10', '5a600e14', '5a600e17', '5a600e19', '5a600e1c', '5a600e15', '5a600e1b']

var c = new Map();

c.set('5a600e10', 7);
c.set('5a600e12', 20);
c.set('5a600e13', 9);
c.set('5a600e14', 19);
c.set('5a600e16', 19);
c.set('5a600e17', 1);
c.set('5a600e18', 18);
c.set('5a600e1a', 6);
c.set('5a600e1c', 15);
c.set('5a600e1f', 4);

// for best performance, the smallest set should be first
Map.intersect(c, a, b);
// => ['5a600e10', '5a600e14', '5a600e17', '5a600e1c']
```

Unique
======

You can enable unique values with the unique option, which causes `set` to throw an error if the value provided already belongs to a different key.

```js
var map = new Map({unique: true});

map.set('5a600e10', 16);
map.set('5a600e11', 6);
map.set('5a600e12', 17);
map.set('5a600e13', 11);
map.set('5a600e14', 14);
map.set('5a600e15', 19);
map.set('5a600e16', 3);
map.set('5a600e17', 12);
map.set('5a600e18', 10);

// currently O(log(N)) because it needs to attempt to insert the value
map.set('5a600e19', 11); // throws
map.set('5a600e14', 14); // => 14
```

License
=======

> The MIT License (MIT)

> Copyright &copy; 2014 GlobeSherpa

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
