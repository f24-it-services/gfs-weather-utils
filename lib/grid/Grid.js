"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = function () {
  function Grid(type, la1, lo1, dx, dy, nx, ny, data) {
    _classCallCheck(this, Grid);

    this.type = type;
    this.la1 = la1;
    this.lo1 = lo1;
    this.dx = dx;
    this.dy = dy;
    this.nx = nx;
    this.ny = ny;
    this.data = data;
  }

  _createClass(Grid, [{
    key: "get",
    value: function get(x, y) {
      if (x > this.nx || y > this.ny) {
        throw new Error("Out of bounds: " + x + ":" + y + " in " + this.nx + ":" + this.ny);
      }
      return this.data[y * this.nx + x];
    }
  }, {
    key: "interpolateAt",
    value: function interpolateAt(lat, lng) {
      var _this = this;

      var fy = (this.la1 - lat) / this.dy;
      var fx = (lng - this.lo1) / this.dx;
      var y = Math.floor(fy);
      var x = Math.floor(fx);

      // console.log(fy, fx, y, x)

      if (fy === y && fx === x) {
        return this.get(x, y);
      }

      var g00 = this.get(x, y);
      var g10 = this.get(x + 1, y);
      var g01 = this.get(x, y + 1);
      var g11 = this.get(x + 1, y + 1);

      // console.log(g00, g10, g01, g11)

      if (!g00 || !g10 || !g01 || !g11) {
        return null;
      }

      return g00.map(function (v, i) {
        return _this.__interpolate(fx - x, fy - y, g00[i], g10[i], g01[i], g11[i]);
      });
    }
  }, {
    key: "__interpolate",
    value: function __interpolate(x, y, g00, g10, g01, g11) {
      var rx = 1 - x;
      var ry = 1 - y;

      var a = rx * ry;
      var b = x * ry;
      var c = rx * y;
      var d = x * y;
      // console.log(`${g00} * ${a} + ${g10} * ${b} + ${g01} * ${c} + ${g11} * ${d}`)
      return g00 * a + g10 * b + g01 * c + g11 * d;
    }
  }, {
    key: "lnglat",
    value: function lnglat(x, y) {
      return [(180 + this.lo1 + x * this.dx) % 360 - 180, this.la1 - y * this.dy];
    }
  }, {
    key: "map",
    value: function map(cb) {
      var result = [];
      for (var y = 0, i = 0; y < this.ny; y++) {
        for (var x = 0; x < this.nx; x++, i++) {
          result[i] = cb(this.data[i], x, y, i);
        }
      }
      return result;
    }
  }, {
    key: "forEach",
    value: function forEach(cb) {
      for (var y = 0, i = 0; y < this.ny; y++) {
        for (var x = 0; x < this.nx; x++, i++) {
          cb(this.data[i], x, y, i);
        }
      }
    }
  }, {
    key: "isCompatible",
    value: function isCompatible(other) {
      if (other === this) return true;

      return other instanceof Grid && other.type === this.type && other.la1 === this.la1 && other.lo1 === this.lo1 && other.nx === this.nx && other.ny === this.ny;
    }
  }]);

  return Grid;
}();

exports.default = Grid;