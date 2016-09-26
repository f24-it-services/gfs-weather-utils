import Grid from './Grid'

export default class GaussianGrid extends Grid {
  constructor (type, lo1, la1, lo2, la2, np, nx, ny, dx, dy, data) {
    super(type, la1, lo1, dx, dy, nx, ny, data)

    this.type = type
    this.la1 = la1
    this.lo1 = lo1
    this.la2 = la2
    this.lo2 = lo2
    this.np = np
    this.nx = nx
    this.ny = ny
    this.dx = dx
    this.data = data
    this.latTable = this.__buildLatTable(np, lo1, la1, lo2, la2)
  }

  lnglat (x, y) {
    return [this.lo1 + x * this.dx - 180, this.latTable[y]]
  }

  scaleToRegular (la1, lo1, dx, dy, nx, ny) {
    let groups = []

    for (var y = 0; y < this.ny; y++) {
      let lat = this.latTable[y]
      let fy = (la1 - lat) / dy
      let ty = Math.floor(fy)

      if (!groups[ty]) groups[ty] = []

      for (var x = 0; x < this.nx; x++) {
        let lng = this.dx * x
        let fx = (lng - lo1) / dx
        let tx = Math.floor(fx)

        if (!groups[ty][tx]) groups[ty][tx] = []

        groups[ty][tx].push(this.data[y * this.nx + x])
      }
    }

    let data = []

    groups.forEach((row, y) => {
      row.forEach((col, x) => {
        data[y * nx + x] = col.reduce((p, c) => c > p ? c : p, 0)
      })
    })

    return new Grid(0, la1, lo1, dx, dy, nx, ny, data)
  }

  __buildLatTable (np, lo1, la1, lo2, la2) {
    const eps = 3e-14
    const rad = 180 / Math.PI
    const np2 = np * 2
    const lats = new Array(np2)
    const inBounds = (lat) => lat < la1 + 0.002 && lat > la2 - 0.002

    let i = 1
    while (i <= np) {
      let z = Math.cos(Math.PI * (i - 0.25) / (np2 + 0.5))
      let z1
      do {
        let p1 = 1
        let p2 = 0
        let p3 = 0
        let j = 1

        while (j <= np2) {
          p3 = p2
          p2 = p1
          p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j
          j++
        }

        let pp = np2 * (z * p1 - p2) / (z * z - 1)
        z1 = z
        z = z1 - p1 / pp
      } while (Math.abs(z - z1) > eps)

      let lat = -Math.atan2(z, Math.sqrt(1 - z * z)) * rad

      if (inBounds(lat)) {
        lats[i - 1] = (-lat).toFixed(3)
      }
      if (inBounds(-lat)) {
        lats[np2 - i] = lat.toFixed(3)
      }
      i++
    }

    return lats
  }
}
