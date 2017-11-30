'use strict';

// Dependencies
const uuid = require('uuid');
const baseX = require('base-x');

const length = 22;
const uuidLength = 32;
const base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

// Expose uuid and baseX for convenience
module.exports = {
  uuid,
  baseX,
  customBase: base62,
  length,
  uuidLength
};

/**
 * v4
 */
module.exports.v4 = function v4() {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  if (!args[1]) {
    // Make sure we use a buffer to avoid getting an uuid with dashes
    args[1] = Buffer.alloc(16);
  }

  const id = uuid.v4.apply(self, args);
  return self.encode(id);
};

/**
 * v1
 */
module.exports.v1 = function v1() {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  if (!args[1]) {
    // Make sure we use a buffer to avoid getting an uuid with dashes
    args[1] = Buffer.alloc(16);
  }

  const id = uuid.v1.apply(self, args);
  return self.encode(id);
};

/**
 * encode
 */
module.exports.encode = function encode(input, encoding) {
  encoding = encoding || 'hex';

  if (typeof input === 'string') {
    // remove the dashes to save some space
    input = Buffer.from(input.replace(/-/g, ''), encoding);
  }

  return ensureLength(this.customBase.encode(input), length);
};

/**
 * decode
 */
module.exports.decode = function decode(b62Str, encoding) {
  encoding = encoding || 'hex';
  const res = ensureLength(Buffer.from(this.customBase.decode(b62Str)).toString(encoding), uuidLength);

  // Re-add the dashes so the result looks like an uuid
  const resArray = res.split('');
  [8, 13, 18, 23].forEach((idx) => {
    resArray.splice(idx, 0, '-');
  });

  return resArray.join('');
};

/**
 * ensureLength
 *
 * @api private
 */
const ensureLength = (str, maxLen) => {
  str = String(str);

  if (str.length < maxLen) {
    return padLeft(str, maxLen);
  } else if (str.length > maxLen) {
    return trimLeft(str, maxLen);
  }

  return str;
};

/**
 * padLeft
 *
 * @api private
 */
const padLeft = (str, padding) => {
  str = String(str);
  let pad = '';
  for (let i = str.length; i < padding; i++) {
    pad += '0';
  }
  return pad + str;
};

/**
 * trimLeft
 *
 * @api private
 */
const trimLeft = (str, maxLen) => {
  str = String(str);
  let trim = 0;
  while (str[trim] === '0' && (str.length - trim) > maxLen) {
    trim++;
  }
  return str.slice(trim);
};
