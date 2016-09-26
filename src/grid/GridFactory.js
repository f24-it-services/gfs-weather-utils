import Grid from './Grid'
import GaussianGrid from './GaussianGrid'

export default {
  fromJSON (json) {
    if (json.length !== 1) {
      throw new Error('fromJSON() needs an array with exactly one element')
    }

    let {header, data} = json[0]

    switch (header.gridDefinitionTemplate) {
      // Default Lat/Lng grid
      case 0: {
        let {la1, lo1, dx, dy, nx, ny} = header
        return new Grid(0, la1, lo1, dx, dy, nx, ny, data)
      }
      // Gaussian Lat/Lng grid
      case 40: {
        let {lo1, la1, lo2, la2, np, nx, ny, dx, dy} = header
        return new GaussianGrid(40, lo1, la1, lo2, la2, np, nx, ny, dx, dy, data)
      }
    }

    throw new Error(`Unknown grid definition: ${header.gridDefinitionTemplate}`)
  }
}
