var ProxyMap = require('./set-proxy/proxy');

describe('proxy skip map', function() {
  it('should support basic operations', function() {
    var skip = new ProxyMap();

    expect(skip).to.have.length(0);
    expect(skip.values()).to.eql([]);
    expect(skip.slice()).to.eql([]);
    expect(skip.range()).to.eql([]);

    expect(function() {
      skip.set('__proto__', 14);
    }).to.throw();

    skip.set('5a600e16', 8);
    skip.set('5a600e17', 9);
    expect(skip.set('5a600e18', 10)).to.equal(null);
    expect(skip.set('5a600e17', 12)).to.equal(9);

    expect(skip).to.have.length(3);
    expect(skip.values()).to.eql([{
      key: '5a600e16',
      value: 8
    }, {
      key: '5a600e18',
      value: 10
    }, {
      key: '5a600e17',
      value: 12
    }]);
    expect(skip.values()).to.eql(skip.slice());
    expect(skip.values()).to.eql(skip.range());

    expect(skip.has('5a600e16')).to.be.ok;
    expect(skip.has('5a600e17')).to.be.ok;
    expect(skip.has('5a600e18')).to.be.ok;
    expect(skip.has('5a600e19')).to.not.be.ok;

    expect(skip.get('5a600e16')).to.equal(8);
    expect(skip.get('5a600e17')).to.equal(12);
    expect(skip.get('5a600e18')).to.equal(10);
    expect(skip.get('5a600e19')).to.equal(null);

    expect(skip.del('5a600e16')).to.equal(8);

    expect(skip).to.have.length(2);

    expect(skip.del('5a600e16')).to.equal(null);

    expect(skip).to.have.length(2);

    expect(skip.has('5a600e16')).to.not.be.ok;

    expect(skip.values()).to.eql([{
      key: '5a600e18',
      value: 10
    }, {
      key: '5a600e17',
      value: 12
    }]);
    expect(skip.values()).to.eql(skip.slice());
    expect(skip.values()).to.eql(skip.range());

    skip.set('5a600e16', 10);
    skip.set('5a600e10', 16);
    skip.set('5a600e11', 6);
    skip.set('5a600e12', 17);
    skip.set('5a600e13', 11);
    skip.set('5a600e14', 14);
    skip.set('5a600e15', 19);
    skip.set('5a600e16', 3);

    expect(skip).to.have.length(9);

    // no change, so should be O(1)
    skip.set('5a600e17', 12);

    expect(skip.rank('5a600e17')).to.equal(4);

    expect(skip).to.have.length(9);
    expect(skip.values()).to.eql([{
      key: '5a600e16',
      value: 3
    }, {
      key: '5a600e11',
      value: 6
    }, {
      key: '5a600e18',
      value: 10
    }, {
      key: '5a600e13',
      value: 11
    }, {
      key: '5a600e17',
      value: 12
    }, {
      key: '5a600e14',
      value: 14
    }, {
      key: '5a600e10',
      value: 16
    }, {
      key: '5a600e12',
      value: 17
    }, {
      key: '5a600e15',
      value: 19
    }]);
    expect(skip.values()).to.eql(skip.slice());
    expect(skip.values()).to.eql(skip.range());

    expect(skip.range(14, 16)).to.eql([{
      key: '5a600e14',
      value: 14
    }, {
      key: '5a600e10',
      value: 16
    }]);
  });

  describe('#set', function() {
    it('should implicitly delete', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(skip.set('5a600e14', null)).to.equal(14);
      expect(skip.set('5a600e19', null)).to.equal(null);

      expect(skip).to.have.length(8);
    });
  });

  describe('#values', function() {
    it('should support different fields', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(skip.keys()).to.eql(['5a600e16', '5a600e11',
        '5a600e18', '5a600e13', '5a600e17', '5a600e14', '5a600e10', '5a600e12',
        '5a600e15']);

      expect(skip.values(true)).to.eql([3, 6, 10, 11, 12, 14, 16,
        17, 19]);
    });
  });

  describe('#range', function() {
    it('should support special ranges', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(skip.range(14)).to.eql([{
        key: '5a600e14',
        value: 14
      }, {
        key: '5a600e10',
        value: 16
      }, {
        key: '5a600e12',
        value: 17
      }, {
        key: '5a600e15',
        value: 19
      }]);

      expect(skip.range(null, 10)).to.eql([{
        key: '5a600e16',
        value: 3
      }, {
        key: '5a600e11',
        value: 6
      }, {
        key: '5a600e18',
        value: 10
      }]);

      expect(skip.range(-Infinity, Infinity)).to.eql(skip.values());
      expect(skip.range(null, null)).to.eql(skip.values());
    });
  });

  describe('#count', function() {
    it('should count elements', function() {
      var skip = new ProxyMap();

      expect(skip.count()).to.equal(0);

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);
      skip.set('5a600e19', 14);
      skip.set('5a600f00', 30.0);
      skip.set('5a600f01', 30.5);
      skip.set('5a600f02', 31.0);
      skip.set('5a600f03', 31.5);
      skip.set('5a600f04', 32.0);
      skip.set('5a600f05', 32.0);
      skip.set('5a600f06', 32.0);

      expect(skip.count()).to.eql(skip.range().length);
      expect(skip.count(8)).to.eql(skip.range(8).length);
      expect(skip.count(3, 7)).to.eql(skip.range(3, 7).length);
      expect(skip.count(5, 14)).to.eql(skip.range(5, 14).length);
      expect(skip.count(5, 5)).to.eql(skip.range(5, 5).length);
      expect(skip.count(5, 0)).to.eql(skip.range(5, 0).length);
      expect(skip.count(30, 32)).to.eql(skip.range(30, 32).length);
      expect(skip.count(40)).to.eql(skip.range(40).length);
    });
  });

  describe('#slice', function() {
    it('should support special ranges', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      var array = skip.values();

      expect(skip.slice()).to.eql(array);
      expect(skip.slice(2)).to.eql(array.slice(2));
      expect(skip.slice(8)).to.eql(array.slice(8));
      expect(skip.slice(0, 3)).to.eql(array.slice(0, 3));
      expect(skip.slice(-1)).to.eql(array.slice(-1));
      expect(skip.slice(-4)).to.eql(array.slice(-4));
      expect(skip.slice(-4, -2)).to.eql(array.slice(-4, -2));
      expect(skip.slice(-4, skip.length + 1000)).to.eql(array.slice(-4, skip.length + 1000));
    });
  });

  describe('#intersect', function() {
    it('should intersect two sets', function() {
      var a = new ProxyMap(), b = new ProxyMap();

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

      expect(ProxyMap.intersectKeys(a, b)).to.eql(['5a600e10', '5a600e14',
        '5a600e1c', '5a600e19', '5a600e17', '5a600e15', '5a600e1b']);
      expect(ProxyMap.intersectKeys(b, a)).to.eql(['5a600e1b', '5a600e14',
        '5a600e1c', '5a600e15', '5a600e19', '5a600e10', '5a600e17']);
    });

    it('should intersect three sets', function() {
      var a = new ProxyMap(), b = new ProxyMap(), c = new ProxyMap();

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

      expect(ProxyMap.intersectKeys(c, a, b)).to.eql(['5a600e10', '5a600e14',
        '5a600e1c', '5a600e17']);

      expect(ProxyMap.intersectKeys(c, a, b)).to.eql(c.intersectKeys(a, b));
    });

    it('should intersect four sets', function() {
      var a = new ProxyMap(), b = new ProxyMap(), c = new ProxyMap(), d = new ProxyMap();

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

      d.set('5a600e1c', 400);
      d.set('5a600e17', 500);
      d.set('5a600e1f', 600);
      d.set('5a600e20', 700);

      expect(ProxyMap.intersectKeys(d, c, a, b))
        .to.eql(['5a600e1c', '5a600e17']);
      expect(ProxyMap.intersectKeys(d, c, a, b))
        .to.eql(d.intersectKeys(c, a, b));
    });
  });

  describe('#rank', function() {
    it('should get the correct rank', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(skip.rank('5a600e12')).to.equal(7);
      expect(skip.rank('5a600e13')).to.equal(3);
      expect(skip.rank('5a600e16')).to.equal(0);
      expect(skip.rank('5a600e15')).to.equal(8);

      expect(skip.rank('not in set')).to.equal(-1);
    });
  });

  describe('#del', function() {
    it('should delete special elements', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(skip.del('5a600e15')).to.equal(19);

      expect(skip).to.have.length(8);

      expect(skip.del('5a600e16')).to.equal(3);

      expect(skip).to.have.length(7);

      expect(skip.values()).to.eql([{
        key: '5a600e11',
        value: 6
      }, {
        key: '5a600e18',
        value: 10
      }, {
        key: '5a600e13',
        value: 11
      }, {
        key: '5a600e17',
        value: 12
      }, {
        key: '5a600e14',
        value: 14
      }, {
        key: '5a600e10',
        value: 16
      }, {
        key: '5a600e12',
        value: 17
      }]);
    });

    it('should delete many elements', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(skip.del('5a600e11')).to.equal(6);
      expect(skip.del('5a600e13')).to.equal(11);
      expect(skip.del('5a600e14')).to.equal(14);
      expect(skip.del('5a600e15')).to.equal(19);
      expect(skip.del('5a600e16')).to.equal(3);
      expect(skip.del('5a600e17')).to.equal(12);

      expect(skip.length).to.equal(3);
      expect(skip.values()).to.eql([{
        key: '5a600e18',
        value: 10
      }, {
        key: '5a600e10',
        value: 16
      }, {
        key: '5a600e12',
        value: 17
      }]);
    });
  });

  describe('#gut', function() {
    it('should strip out a range of elements', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(skip.gut(4, 14)).to.equal(5);
      expect(skip).to.have.length(4);

      expect(skip.values()).to.eql([{
        key: '5a600e16',
        value: 3
      }, {
        key: '5a600e10',
        value: 16
      }, {
        key: '5a600e12',
        value: 17
      }, {
        key: '5a600e15',
        value: 19
      }]);
    });

    it('should strip out all the elements', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(skip.gut(3, 19)).to.equal(9);
      expect(skip).to.have.length(0);

      expect(skip.values()).to.eql([]);
    });
  });

  describe('#gutSlice', function() {
    it('should strip out a slice of elements', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(skip.gutSlice(1, 6)).to.equal(5);
      expect(skip).to.have.length(4);

      expect(skip.values()).to.eql([{
        key: '5a600e16',
        value: 3
      }, {
        key: '5a600e10',
        value: 16
      }, {
        key: '5a600e12',
        value: 17
      }, {
        key: '5a600e15',
        value: 19
      }]);
    });

    it('should strip out all elements', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(skip.gutSlice(0, 9)).to.equal(9);
      expect(skip).to.have.length(0);

      expect(skip.values()).to.eql([]);
    });
  });

  describe('#empty', function() {
    it('should remove all elements', function() {
      var skip = new ProxyMap();

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      skip.empty();

      expect(skip).to.have.length(0);
      expect(skip.values()).to.eql([]);
    });
  });

  describe('unique', function() {
    it('should ensure values are unique', function() {
      var skip = new ProxyMap({unique: true});

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(function() {
        skip.set('5a600e19', 11);
      }).to.throw(/unique/);

      // quick exit test
      expect(function() {
        skip.set('5a600dff', skip.head.next[skip.level - 1].next.value.value);
      }).to.throw(/unique/);

      // this test ensures the key < key check doesn't come into play
      expect(function() {
        skip.set('5a600dff', 11);
      }).to.throw(/unique/);

      expect(function() {
        skip.set('5a600e18', 10);
      }).to.not.throw();

      expect(skip).to.have.length(9);

      expect(skip.values()).to.eql([{
        key: '5a600e16',
        value: 3
      }, {
        key: '5a600e11',
        value: 6
      }, {
        key: '5a600e18',
        value: 10
      }, {
        key: '5a600e13',
        value: 11
      }, {
        key: '5a600e17',
        value: 12
      }, {
        key: '5a600e14',
        value: 14
      }, {
        key: '5a600e10',
        value: 16
      }, {
        key: '5a600e12',
        value: 17
      }, {
        key: '5a600e15',
        value: 19
      }])
    });

    it('should revert keys if constraint broken during update', function() {
      var skip = new ProxyMap({unique: true});

      skip.set('5a600e10', 16);
      skip.set('5a600e11', 6);
      skip.set('5a600e12', 17);
      skip.set('5a600e13', 11);
      skip.set('5a600e14', 14);
      skip.set('5a600e15', 19);
      skip.set('5a600e16', 3);
      skip.set('5a600e17', 12);
      skip.set('5a600e18', 10);

      expect(function() {
        skip.set('5a600e13', 14);
      }).to.throw(/unique/);

      expect(skip).to.have.length(9);
      expect(skip.get('5a600e13')).to.equal(11);
    });
  });
});
