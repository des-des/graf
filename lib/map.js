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

  const setIn = (xs, v) => set(xs[0], xs.length === 1
    ? v
    : setIn(xs.slice(1), v))
  self.setIn = setIn

  const update = (k, f) => set(k, f(get(k)))
  self.update = update

  return self
}

module.exports = map
