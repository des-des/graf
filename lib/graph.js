const list = require('./list.js')
const map = require('./map.js')

let updateCount = 1

const node = spec => {
  let my = spec

  const self = {}

  const createUpdater = update => (...args) => {
    update(...args)
    const newNode = updateCount === my.get('updateNumber')
      ? self
      : node(my.set('updateNumber', updateCount))

    newNode.mutateLinksTo(getUpdatedLinksTo(newNode))

    return newNode
  }

  const getUpdatedLinksTo = newNode => map.fromPairs(
    my.get('linksTo').toPairs().map(getUpdatedLinkTo(newNode)))

  const getUpdatedLinkTo = newNode => linkToAsPair => list(
    linkToAsPair.head,
    linkToAsPair.get(1).updateLink(linkToAsPair.head, newNode)
  )

  const set = createUpdater((key, value) => {
    my = my.update('data', data => data.set(key, value))
  })
  self.set = set

  const mutateLinksTo = newLinksTo => {
    my = my.set('linksTo', newLinksTo)
  }
  self.mutateLinksTo = mutateLinksTo

  const updateLink = createUpdater((tag, newNode) =>
    node(spec.setIn(['linksFrom', tag], newNode)))
  self.updateLink = updateLink
  //
  // const getLinksTo = () => my.get('linksTo')
  // self.getLinksTo = getLinksTo
  //
  // const getData = () => my.toObject()
  // self.getData = getData

  return self
}

module.exports = node
