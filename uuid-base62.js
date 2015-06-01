'use strict';

// dependencies
var uuid = require('node-uuid');
var baseX = require('base-x');
var base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

// expose node-uuid and baseX for convenience
module.exports.uuid = uuid;
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

  var id = uuid.v4.apply(self, args);
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

  var id = uuid.v1.apply(self, args);
  return self.encode(id);
};


/**
 * encode
 */
module.exports.encode = function encode(input, encoding) {
  encoding = encoding || 'hex';
  
  if (typeof input === 'string') {
    // remove the dashes to save some space
    input = new Buffer(input.replace(/-/g, ''), encoding);
  }
  return ensureLength(this.customBase.encode(input), module.exports.length);
};

/**
 * decode
 */
module.exports.decode = function decode(b62Str, encoding) {
  encoding = encoding || 'hex';
  var res = ensureLength(new Buffer(this.customBase.decode(b62Str)).toString(encoding), module.exports.uuidLength);
  
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