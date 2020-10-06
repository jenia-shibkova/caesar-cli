const { StringDecoder } = require('string_decoder');
const { Transform } = require('stream');
const { ENCODE, LETTER_CHAR_CODES } = require('./constants');

class Transformer extends Transform {
  constructor(options) {
    super(options);
    this.shift = options.action === ENCODE ? options.shift : -options.shift;
    this.decoder = new StringDecoder('utf-8');
  }

  letterToChar(letter, minCode, maxCode) {
    const shiftedLetter = letter + this.shift;
    if (shiftedLetter < minCode) {
      return shiftedLetter + maxCode - minCode + 1;
    }
    if (shiftedLetter > maxCode) {
      return shiftedLetter - maxCode + minCode - 1;
    }
    return shiftedLetter;
  }

  coding(letter) {
    const char = letter.charCodeAt();

    if (char >= LETTER_CHAR_CODES.A && char <= LETTER_CHAR_CODES.Z) {
      return String.fromCharCode(this.letterToChar(char, LETTER_CHAR_CODES.A, LETTER_CHAR_CODES.Z));
    } else if (char >= LETTER_CHAR_CODES.a && char <= LETTER_CHAR_CODES.z) {
      return String.fromCharCode(this.letterToChar(char, LETTER_CHAR_CODES.a, LETTER_CHAR_CODES.z));
    }

    return String.fromCharCode(char);
  }

  _transform(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this.decoder.write(chunk);
      let result = '';
      if (chunk.length > 1) {
        for (let i = 0; i < chunk.length; i += 1) {
          result += this.coding(chunk[i]);
        }
      } else {
        result = this.coding(chunk);
      }
      chunk = result;
    }
    callback(null, chunk);
  }
}

module.exports = Transformer;