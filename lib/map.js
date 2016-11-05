const copyObj = o => {
  const c = {}
  Object.keys(o).forEach(k => {
    c[k] = o[k]
  })
  return c
}

const setOnObj = (o, k, v) => {
  o[k] = v
  return o
}

const map = o => {
  const self = {}

  const get = k => o[k]
  self.get = get

  const set = (k, v) => map(setOnObj(copyObj(o), k, v)) // need compose
  self.set = set

  return self
}

module.exports = map
