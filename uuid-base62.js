'use strict';

// dependencies
var uuidV1 = require('uuid/v1')
var uuidV4 = require('uuid/v4');
var baseX = require('base-x');
var base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

// expose node-uuid and baseX for convenience
module.exports.uuidV1 = uuidV1;
module.exports.uuidV4 = uuidV4;
module.exports.baseX = baseX;
module.exports.customBase = base62;
module.exports.length = 22;
module.exports.uuidLength = 32;

/**
 * v4
 */
module.exports.v4 = function v4() {
  var self = this;
  var args = Array.prototype.slice.call(arguments);

  if (!args[1]) {
    // make sure we use a buffer to avoid getting an uuid with dashes
    args[1] = new Buffer(16);
  }

  var id = uuidV4.apply(self, args);
  return self.encode(id);
};


/**
 * v1
 */
module.exports.v1 = function v1() {
  var self = this;
  var args = Array.prototype.slice.call(arguments);

  if (!args[1]) {
    // make sure we use a buffer to avoid getting an uuid with dashes
    args[1] = new Buffer(16);
  }

  var id = uuidV1.apply(self, args);
  return self.encode(id);
};


/**
 * encode
 */
module.exports.encode = function encode(input, options) {
  options = options || {};

  // Make compatible with previous API.
  options.encoding = typeof options === 'string' ?
    options
  : options.encoding || 'hex';

  options.base = options.base || this.customBase;
  options.length = options.length || module.exports.length;

  if (typeof input === 'string') {
    // remove the dashes to save some space
    input = new Buffer(input.replace(/-/g, ''), options.encoding);
  }
  return ensureLength(options.base.encode(input), options.length);
};

/**
 * decode
 */
module.exports.decode = function decode(b62Str, options) {
  options = options || {};

  // Make compatible with previous API.
  options.encoding = typeof options === 'string' ?
    options
  : options.encoding || 'hex';

  options.base = options.base || this.customBase;
  options.length = options.length || module.exports.uuidLength;

  var res = ensureLength(new Buffer(options.base.decode(b62Str)).toString(options.encoding), options.length);

  // re-add the dashes so the result looks like an uuid
  var resArray = res.split('');
  [8, 13, 18, 23].forEach(function(idx){
    resArray.splice(idx, 0, '-');
  });
  res = resArray.join('');

  return res;
};

/**
 * ensureLength
 *
 * @api private
 */
function ensureLength(str, maxLen){
  str = str + "";
  if(str.length < maxLen){
    return padLeft(str, maxLen);
  }
  else if (str.length > maxLen){
    return trimLeft(str, maxLen);
  }
  return str;
};


/**
 * padLeft
 *
 * @api private
 */
function padLeft(str, padding){
  str = str + "";
  var pad = "";
  for(var i=str.length; i<padding; i++){
    pad += '0';
  }
  return pad + str;
};

/**
 * trimLeft
 *
 * @api private
 */
function trimLeft(str, maxLen){
  str = str + "";
  var trim = 0;
  while(str[trim] === '0' && (str.length - trim) > maxLen){
    trim++;
  }
  return str.slice(trim);
};
