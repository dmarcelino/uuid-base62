'use strict';

// dependencies
var uuid = require('node-uuid');
var b62 = require('b62');

// expose node-uuid and base62 for convenience
module.exports.uuid = uuid;
module.exports.b62 = b62;

/**
 * 
 */
module.exports.v4 = function v4() {
  var self = this;
  var args = Array.prototype.slice.call(arguments);

  if (!args[1]) {
    // make sure we use a buffer to avoid getting an uuid with dashes
    args[1] = new Buffer(16);
  }

  var id = uuid.v4.apply(self, args);
  return self.encode(id);
};


/**
 * 
 */
module.exports.v1 = function v1() {
  var self = this;
  var args = Array.prototype.slice.call(arguments);

  if (!args[1]) {
    // make sure we use a buffer to avoid getting an uuid with dashes
    args[1] = new Buffer(16);
  }

  var id = uuid.v1.apply(self, args);
  return self.encode(id);
};


/**
 * 
 */
module.exports.encode = function encode(input, encoding) {
  encoding = encoding || 'hex';
  
  if (typeof input === 'string') {
    // remove the dashes to save some space
    input = input.replace(/-/g, '');
  }
  return b62.encode(input, encoding);
};

/**
 * 
 */
module.exports.decode = function decode(b62Str, encoding) {
  encoding = encoding || 'hex';
  var res = b62.decode(b62Str, encoding);
  
  // re-add the dashes so the result looks like an uuid
  var resArray = res.split('');
  [8, 13, 18, 23].forEach(function(idx){
    resArray.splice(idx, 0, '-');
  });
  res = resArray.join('');

  return res;
};