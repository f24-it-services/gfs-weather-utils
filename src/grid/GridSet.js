import Grid from './Grid'
import GaussianGrid from './GaussianGrid'

export default class GridSet {
  constructor (grids) {
    this.grids = grids
  }

  combine () {
    if (!this.grids.length) {
      throw new Error('Cant combine empty set')
    }

    this.grids.forEach((g1) => {
      this.grids.forEach((g2) => {
        if (!g1.isCompatible(g2)) {
          throw new Error(`Not a combinable grid: ${g1} + ${g2}`)
        }
      })
    })

    let combined
    let first
    this.grids.forEach((grid, i) => {
      if (!combined) combined = new Array(grid.data.length)
      if (!first) first = grid

      grid.data.forEach((val, j) => {
        if (!combined[j]) combined[j] = new Array(this.grids.length)
        combined[j][i] = val
      })
    })

    switch (first.type) {
      case 0:
        return new Grid(
          first.type,
          first.la1,
          first.lo1,
          first.dx,
          first.dy,
          first.nx,
          first.ny,
          combined
        )
      case 40:
        return new GaussianGrid(
          first.type,
          first.lo1,
          first.la1,
          first.lo2,
          first.la2,
          first.np,
          first.nx,
          first.ny,
          first.dx,
          combined
        )
    }
  }
}
