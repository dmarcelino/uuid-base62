var assert = require('assert');
var uuidBase62 = require('../uuid-base62');

describe('uuid-base62', function () {
  describe('v4', function () {
    it('should generate a unique id without any params', function () {
      var res = uuidBase62.v4();
      assert(res);
      assert.equal(typeof res, 'string');
      assert.equal(res.length, 22);
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
  
  describe('v1', function () {
    it('should generate a unique id without any params', function () {
      var res = uuidBase62.v1();
      assert(res);
      assert.equal(typeof res, 'string');
      assert.equal(res.length, 22);
    });
  });
  
  describe('encode / decode', function () {
    var fixtures = {
      '0000000000000000000000': '00000000-0000-0000-0000-000000000000',
      '0cBaidlJ84Ggc5JA7IYCgv': '06ad547f-fe02-477b-9473-f7977e4d5e17',
      '4vqyd6OoARXqj9nRUNhtLQ': '941532a0-6be1-443a-a9d5-d57bdf180a52',
      '5FY8KwTsQaUJ2KzHJGetfE': 'ba86b8f0-6fdf-4944-87a0-8a491a19490e',      
      '7N42dgm5tFLK9N8MT7fHC7': 'ffffffff-ffff-ffff-ffff-ffffffffffff'
    };
    
    Object.keys(fixtures).forEach(function(key){
      it('should properly encode ' + fixtures[key], function () {
        assert.equal(uuidBase62.encode(fixtures[key]), key);
      });
      
      it('should properly decode ' + key, function () {
        assert.equal(uuidBase62.decode(key), fixtures[key]);
      });
    });
  });
  
  describe('other bases', function () {
    it('should generate a unique id without any params in base64', function () {
      uuidBase62.customBase = new uuidBase62.baseX("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_");
      var res = uuidBase62.v4();
      assert(res);
      assert.equal(typeof res, 'string');
      assert.equal(res.length, 22);
    });

    it('should encode and decode a uuid in Base64', function () {
      uuidBase62.customBase = new uuidBase62.baseX("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_");
      var uuid = '72be7291-fbf6-400f-87c4-455e23d01cd5';

      var uuidB64 = uuidBase62.encode(uuid);
      assert.equal(uuidB64, '1OLDah-_p03Uv4hlUzQ1Pl');
      
      var res = uuidBase62.decode(uuidB64);
      assert.equal(res, uuid);
    });
  });
});
