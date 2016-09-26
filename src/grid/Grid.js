export default class Grid {
  constructor (type, la1, lo1, dx, dy, nx, ny, data) {
    this.type = type
    this.la1 = la1
    this.lo1 = lo1
    this.dx = dx
    this.dy = dy
    this.nx = nx
    this.ny = ny
    this.data = data
  }

  get (x, y) {
    if (x > this.nx || y > this.ny) {
      throw new Error(`Out of bounds: ${x}:${y} in ${this.nx}:${this.ny}`)
    }
    return this.data[y * this.nx + x]
  }

  interpolateAt (lat, lng) {
    let fy = (this.la1 - lat) / this.dy
    let fx = (lng - this.lo1) / this.dx
    let y = Math.floor(fy)
    let x = Math.floor(fx)

    if (fy === y && fx === x) {
      return this.get(x, y)
    }

    let g00 = this.get(x, y)
    let g10 = this.get(x + 1, y)
    let g01 = this.get(x, y - 1)
    let g11 = this.get(x + 1, y - 1)

    if (!g00 || !g10 || !g01 || !g11) {
      return null
    }

    return g00.map((v, i) =>
      this.__interpolate(x, y, g00[i], g10[i], g01[i], g11[i])
    )
  }

  __interpolate (x, y, g00, g10, g01, g11) {
    const rx = (1 - x)
    const ry = (1 - y)

    const a = rx * ry
    const b = x * ry
    const c = rx * y
    const d = x * y

    return g00 * a + g10 * b + g01 * c + g11 * d
  }

  lnglat (x, y) {
    return [this.lo1 + x * this.dx - 180, this.la1 - y * this.dy]
  }

  map (cb) {
    let result = []
    for (let y = 0, i = 0; y < this.ny; y++) {
      for (let x = 0; x < this.nx; x++, i++) {
        result[i] = cb(this.data[i], x, y, i)
      }
    }
    return result
  }

  forEach (cb) {
    for (let y = 0, i = 0; y < this.ny; y++) {
      for (let x = 0; x < this.nx; x++, i++) {
        cb(this.data[i], x, y, i)
      }
    }
  }

  isCompatible (other) {
    if (other === this) return true

    return other instanceof Grid &&
      other.type === this.type &&
      other.la1 === this.la1 &&
      other.lo1 === this.lo1 &&
      other.nx === this.nx &&
      other.ny === this.ny
  }
}
