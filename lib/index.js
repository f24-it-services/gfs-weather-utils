'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // Export all grid classes ...


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
exports.wrapLngLat = wrapLngLat;
exports.wrapLng = wrapLng;
exports.wrapLat = wrapLat;


/**
 * Runs a series of callbacks in sequence and returns a promise which resolves
 * with the return values in the same order as the callbacks.
 * @param  {function[]} callbacks
 * @param {boolean} withResults = true
 * @return {Promise}
 */
function sequence(callbacks) {
  var withResults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var results = [];
  return callbacks.reduce(function (promise, callback) {
    return promise.then(callback).then(function (result) {
      withResults && results.push(result);
      return results;
    });
  }, Promise.resolve());
}

function wrapLngLat(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      lng = _ref2[0],
      lat = _ref2[1];

  return [wrapLng(lng), wrapLat(lat)];
}

function wrapLng(lng) {
  return ((lng + 180) % 360 + 360) % 360 - 180;
}

function wrapLat(lat) {
  return lat;
}