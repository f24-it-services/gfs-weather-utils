'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Grid2 = require('./Grid');

var _Grid3 = _interopRequireDefault(_Grid2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GaussianGrid = function (_Grid) {
  _inherits(GaussianGrid, _Grid);

  function GaussianGrid(type, lo1, la1, lo2, la2, np, nx, ny, dx, dy, data) {
    _classCallCheck(this, GaussianGrid);

    var _this = _possibleConstructorReturn(this, (GaussianGrid.__proto__ || Object.getPrototypeOf(GaussianGrid)).call(this, type, la1, lo1, dx, dy, nx, ny, data));

    _this.type = type;
    _this.la1 = la1;
    _this.lo1 = lo1;
    _this.la2 = la2;
    _this.lo2 = lo2;
    _this.np = np;
    _this.nx = nx;
    _this.ny = ny;
    _this.dx = dx;
    _this.data = data;
    _this.latTable = _this.__buildLatTable(np, lo1, la1, lo2, la2);
    return _this;
  }

  _createClass(GaussianGrid, [{
    key: 'lnglat',
    value: function lnglat(x, y) {
      return [this.lo1 + x * this.dx - 180, this.latTable[y]];
    }
  }, {
    key: 'scaleToRegular',
    value: function scaleToRegular(la1, lo1, dx, dy, nx, ny) {
      var groups = [];

      for (var y = 0; y < this.ny; y++) {
        var lat = this.latTable[y];
        var fy = (la1 - lat) / dy;
        var ty = Math.floor(fy);

        if (!groups[ty]) groups[ty] = [];

        for (var x = 0; x < this.nx; x++) {
          var lng = this.dx * x;
          var fx = (lng - lo1) / dx;
          var tx = Math.floor(fx);

          if (!groups[ty][tx]) groups[ty][tx] = [];

          groups[ty][tx].push(this.data[y * this.nx + x]);
        }
      }

      var data = [];

      groups.forEach(function (row, y) {
        row.forEach(function (col, x) {
          data[y * nx + x] = col.reduce(function (p, c) {
            return c > p ? c : p;
          }, 0);
        });
      });

      return new _Grid3.default(0, la1, lo1, dx, dy, nx, ny, data);
    }
  }, {
    key: '__buildLatTable',
    value: function __buildLatTable(np, lo1, la1, lo2, la2) {
      var eps = 3e-14;
      var rad = 180 / Math.PI;
      var np2 = np * 2;
      var lats = new Array(np2);
      var inBounds = function inBounds(lat) {
        return lat < la1 + 0.002 && lat > la2 - 0.002;
      };

      var i = 1;
      while (i <= np) {
        var z = Math.cos(Math.PI * (i - 0.25) / (np2 + 0.5));
        var z1 = void 0;
        do {
          var p1 = 1;
          var p2 = 0;
          var p3 = 0;
          var j = 1;

          while (j <= np2) {
            p3 = p2;
            p2 = p1;
            p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j;
            j++;
          }

          var pp = np2 * (z * p1 - p2) / (z * z - 1);
          z1 = z;
          z = z1 - p1 / pp;
        } while (Math.abs(z - z1) > eps);

        var lat = -Math.atan2(z, Math.sqrt(1 - z * z)) * rad;

        if (inBounds(lat)) {
          lats[i - 1] = (-lat).toFixed(3);
        }
        if (inBounds(-lat)) {
          lats[np2 - i] = lat.toFixed(3);
        }
        i++;
      }

      return lats;
    }
  }]);

  return GaussianGrid;
}(_Grid3.default);

exports.default = GaussianGrid;