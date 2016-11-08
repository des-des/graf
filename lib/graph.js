const list = require('./list.js')
const map = require('./map.js')

// internal
const node = spec => {
  let my = spec

  const setters = {}
  const getters = {}

  const setMy = k => f => {
    my = my.update(k, f)
  }

  const getGraphUpdateNumber = spec.get('getGraphUpdateNumber')
  const onNewRef = spec.get('onNewRef')

  const updateLinksTo = () => setMy('linksTo')(linksTo =>
    map.fromPairs(linksTo.toPairs().map(getUpdatedLinkToPair)))
  setters.updateLinksTo = updateLinksTo

  const getUpdatedLinkToPair = linkToAsPair => list(
    linkToAsPair.head,
    linkToAsPair.get(1).setLink(linkToAsPair.head, self)
  )

  const set = (key, value) => setMy('data')(data => data.set(key, value))
  setters.set = set

  const setLink = (tag, newNode) => setMy('linksFrom')(linksFrom =>
    linksFrom.set(tag, newNode.setLinkTo(tag, self)))
  setters.setLink = setLink

  // This is in getters as it will not create a new ref
  // node will be internal + wrapped in the end so this is ok
  const setLinkTo = (tag, newNode) => {
    setMy('linksTo')(linksTo => linksTo.set(tag, newNode))
    return self
  }
  getters.setLinkTo = setLinkTo

  const getLink = tag => my.get('linksFrom').get(tag)
  getters.getLink = getLink

  const get = k => my.get('data').get(k)
  getters.get = get

  // when updating the graph, a new update number will be supplied
  // Each node touched by the update will create a new ref
  // Each node touched will do this once and only once
  // onNewRef must be supplied by wrapper to update changing node refs
  const self = Object.keys(setters).reduce((self, funcKey) => {
    self[funcKey] = (...args) => {
      const updateNumber = my.get('updateNumber')
      const graphUpdateNumber = getGraphUpdateNumber()
      if (graphUpdateNumber === updateNumber) {
        setters[funcKey](...args)
        return self
      }

      const newSpec = my.set('updateNumber', graphUpdateNumber)
      const newRef = node(newSpec)[funcKey](...args)
        .updateLinksTo()

      onNewRef(newRef)

      return newRef
    }
    return self
  }, getters)

  // only works for trees, otherwise will overflow
  // const getString = (indent = '') =>
  //   `\n${indent}{` +
  //     my.get('data').toPairs().reduce((s, entry) =>
  //       s + `\n${indent}${entry.head}: ${entry.get(1)}`, '') +
  //     my.get('linksFrom').toPairs().reduce((s, entry) =>
  //       s + `\n${indent}${entry.head}\n${entry.get(1).getString(indent + '  ')}`, '') +
  //     `\n${indent}}`
  //
  // self.getString = getString

  return self
}

module.exports = node
