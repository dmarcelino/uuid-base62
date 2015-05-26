var assert = require('assert');
var uuidBase62 = require('../uuid-base62');

describe('uuid-base62', function () {
  describe('v4', function () {
    it('should generate a unique id without any params', function () {
      var res = uuidBase62.v4();
      assert(res);
      assert.equal(typeof res, 'string');
      assert(res.length <= 22);
    });

    it('should convert id back to uuid format', function () {
      var uuid = uuidBase62.v4();
      assert(uuid);

      var res = uuidBase62.decode(uuid);

      assert.equal(typeof res, 'string');
      assert.equal(res.length, 36);

      var parts = res.split('-');
      assert.equal(parts.length, 5);
      parts.forEach(function (group) {
        var num = parseInt(group, 16);
        assert(num > 0);
      });
    });

    it('should generate same encoded uuid from different formats', function () {
      var uuid = 'de305d54-75b4-431b-adb2-eb6b9e546014';
      var uuidB = new Buffer([0xde, 0x30, 0x5d, 0x54, 0x75, 0xb4, 0x43, 0x1b, 0xad, 0xb2, 0xeb, 0x6b, 0x9e, 0x54, 0x60, 0x14]);

      var res = uuidBase62.encode(uuid);
      var resB = uuidBase62.encode(uuidB);

      assert.equal(resB, res);
    });

    it('decoded UUID should match original UUID', function () {
      var uuid = 'de305d54-75b4-431b-adb2-eb6b9e546014';

      var uuidB62 = uuidBase62.encode(uuid);
      var res = uuidBase62.decode(uuidB62);

      assert.equal(res, uuid);
    });
  });
});
