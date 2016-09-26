'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _grid = require('./grid');

Object.keys(_grid).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _grid[key];
    }
  });
});
exports.sequence = sequence;


/**
 * Runs a series of callbacks in sequence and returns a promise which resolves
 * with the return values in the same order as the callbacks.
 * @param  {function[]} callbacks
 * @param {boolean} withResults = true
 * @return {Promise}
 */
function sequence(callbacks) {
  var withResults = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var results = [];
  return callbacks.reduce(function (promise, callback) {
    return promise.then(callback).then(function (result) {
      withResults && results.push(result);
      return results;
    });
  }, Promise.resolve());
} // Export all grid classes ...