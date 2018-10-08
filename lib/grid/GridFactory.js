'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _GaussianGrid = require('./GaussianGrid');

var _GaussianGrid2 = _interopRequireDefault(_GaussianGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  fromJSON: function fromJSON(json) {
    if (json.length !== 1) {
      throw new Error('fromJSON() needs an array with exactly one element');
    }

    var _json$ = json[0],
        header = _json$.header,
        data = _json$.data;


    switch (header.gridDefinitionTemplate) {
      // Default Lat/Lng grid
      case 0:
        {
          var la1 = header.la1,
              lo1 = header.lo1,
              dx = header.dx,
              dy = header.dy,
              nx = header.nx,
              ny = header.ny;

          return new _Grid2.default(0, la1, lo1, dx, dy, nx, ny, data);
        }
      // Gaussian Lat/Lng grid
      case 40:
        {
          var _lo = header.lo1,
              _la = header.la1,
              lo2 = header.lo2,
              la2 = header.la2,
              np = header.np,
              _nx = header.nx,
              _ny = header.ny,
              _dx = header.dx,
              _dy = header.dy;

          return new _GaussianGrid2.default(40, _lo, _la, lo2, la2, np, _nx, _ny, _dx, _dy, data);
        }
    }

    throw new Error('Unknown grid definition: ' + header.gridDefinitionTemplate);
  }
};