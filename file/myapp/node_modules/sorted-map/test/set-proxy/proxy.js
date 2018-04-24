// turns sorted-set into sorted-map for comparative testing

var Set = require('sorted-set');
var util = require('util');

function intermod(fn) {
  return function() {
    return fn.apply(this, arguments).map(function(entry) {
      return entry.key;
    });
  };
}

function Entry(key, value) {
  this.key = key;
  this.value = value;
}

function ProxyMap(options) {
  if (!(this instanceof ProxyMap))
    return new ProxyMap(options);
  options || (options = {});
  Set.call(this, {
    unique: options.unique,
    hash: function(entry) {
      return entry.key;
    },
    compare: function(a, b) {
      return a.value - b.value;
    }
  });
  this._entryA = new Entry(null, null);
  this._entryB = new Entry(null, null);
}

util.inherits(ProxyMap, Set);

ProxyMap.intersect = intermod(Set.intersect);
ProxyMap.intersectKeys = intermod(Set.intersectKeys);

var _add = Set.prototype.add;
var _get = Set.prototype.get;
var _has = Set.prototype.has;
var _del = Set.prototype.del;
var _rank = Set.prototype.rank;
var _count = Set.prototype.count;
var _range = Set.prototype.range;
var _slice = Set.prototype.slice;
var _gut = Set.prototype.gut;
var _gutSlice = Set.prototype.gutSlice;
var _values = Set.prototype.values;

ProxyMap.prototype.add = undefined;
ProxyMap.prototype.set = function(key, value) {
  if (value == null)
    return this.del(key);
  var entry = _add.call(this, new Entry(key, value));
  return entry && entry.value;
};

ProxyMap.prototype.get = function(key) {
  this._entryA.key = key;
  var entry = _get.call(this, this._entryA);
  return entry && entry.value;
};

ProxyMap.prototype.has = function(key) {
  this._entryA.key = key;
  return _has.call(this, this._entryA);
};

ProxyMap.prototype.del = function(key) {
  var entry = this.map[key];
  if (entry === undefined)
    return null;
  entry = _del.call(this, entry);
  return entry && entry.value;
};

ProxyMap.prototype.rank = function(key) {
  var entry = this.map[key];
  return entry === undefined ? -1 : _rank.call(this, entry);
};

ProxyMap.prototype.count = function(min, max) {
  min == null && (min = -Infinity);
  max == null && (max = Infinity);
  this._entryA.value = min;
  this._entryB.value = max;
  return _count.call(this, this._entryA, this._entryB);
};

ProxyMap.prototype.range = function(min, max) {
  min == null && (min = -Infinity);
  max == null && (max = Infinity);
  this._entryA.value = min;
  this._entryB.value = max;
  return _range.call(this, this._entryA, this._entryB);
};

ProxyMap.prototype.slice = function(start, end) {
  return _slice.call(this, start, end);
};

ProxyMap.prototype.gut = function(min, max) {
  min == null && (min = -Infinity);
  max == null && (max = Infinity);
  this._entryA.value = min;
  this._entryB.value = max;
  return _gut.call(this, this._entryA, this._entryB);
};

ProxyMap.prototype.gutSlice = function(start, end) {
  return _gutSlice.call(this, start, end);
};

ProxyMap.prototype.keys = function() {
  return _values.call(this).map(function(entry) {
    return entry.key;
  });
};

ProxyMap.prototype.values = function(only) {
  var values = _values.call(this);
  return only ? values.map(function(entry) {
    return entry.value;
  }) : values;
};

ProxyMap.prototype.intersect = intermod(Set.prototype.intersect);
ProxyMap.prototype.intersectKeys = intermod(Set.prototype.intersectKeys);

module.exports = ProxyMap;
