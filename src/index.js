// Export all grid classes ...
export * from './grid'

/**
 * Runs a series of callbacks in sequence and returns a promise which resolves
 * with the return values in the same order as the callbacks.
 * @param  {function[]} callbacks
 * @param {boolean} withResults = true
 * @return {Promise}
 */
export function sequence (callbacks, withResults = true) {
  let results = []
  return callbacks.reduce((promise, callback) => {
    return promise.then(callback).then((result) => {
      withResults && results.push(result)
      return results
    })
  }, Promise.resolve())
}

export function wrapLngLat ([lng, lat]) {
  return [
    wrapLng(lng),
    wrapLat(lat)
  ]
}

export function wrapLng (lng) {
  return ((lng + 180) % 360 + 360) % 360 - 180
}

export function wrapLat (lat) {
  return lat
}
