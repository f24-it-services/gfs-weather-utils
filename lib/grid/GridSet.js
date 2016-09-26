'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _GaussianGrid = require('./GaussianGrid');

var _GaussianGrid2 = _interopRequireDefault(_GaussianGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GridSet = function () {
  function GridSet(grids) {
    _classCallCheck(this, GridSet);

    this.grids = grids;
  }

  _createClass(GridSet, [{
    key: 'combine',
    value: function combine() {
      var _this = this;

      if (!this.grids.length) {
        throw new Error('Cant combine empty set');
      }

      this.grids.forEach(function (g1) {
        _this.grids.forEach(function (g2) {
          if (!g1.isCompatible(g2)) {
            throw new Error('Not a combinable grid: ' + g1 + ' + ' + g2);
          }
        });
      });

      var combined = void 0;
      var first = void 0;
      this.grids.forEach(function (grid, i) {
        if (!combined) combined = new Array(grid.data.length);
        if (!first) first = grid;

        grid.data.forEach(function (val, j) {
          if (!combined[j]) combined[j] = new Array(_this.grids.length);
          combined[j][i] = val;
        });
      });

      switch (first.type) {
        case 0:
          return new _Grid2.default(first.type, first.la1, first.lo1, first.dx, first.dy, first.nx, first.ny, combined);
        case 40:
          return new _GaussianGrid2.default(first.type, first.lo1, first.la1, first.lo2, first.la2, first.np, first.nx, first.ny, first.dx, combined);
      }
    }
  }]);

  return GridSet;
}();

exports.default = GridSet;