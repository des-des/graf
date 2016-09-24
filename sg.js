const entrySeq = o => Object.keys(o).map(k => ([k, o[k]]))

const valueSeq = o => Object.keys(o).map(k => o[k])

const flatten1 = xss => xss.reduce((ys, xs) => ys.concat(xs), xss)

const mapObj = f => o => entrySeq(o).reduce((out, [k, v]) => {
  const [k_, v_] = f([k, v])
  out[k_] = v_
  return out
}, Object.create(null))

const mapObjVals = f => mapObj(([k, v]) => ([k, f(v)]));

const mapFirst = f => xs => f(xs[0]) + xs.slice(1)
const capitaliseFirst = mapFirst(elem => elem.toUpperCase())

const prop = o => k => o[k]

const isGetter = str => str.indexOf('get') === 0 && str !== 'get';

const graph = (entryNode, selectedLinks) => {
  const holdingNodes = links[holding]
  const out = {}
  holdingNodes.forEach((node) => {
    entrySeq(node).forEach(([methodName, method]) => {
      if (out[methodName]) return;
      out[methodName] = isGetter(methodName) ?
        () => holdingNodes.map(node => node[methodName]()) :
        (...args) => createNode(
          data,
          Object.assign(links, { [holding]: holdingNodes.map(node =>
            node[methodName](...args)
          )}),
          holding
        )
    })
  })

}

const createNode = (data, links_ = {}, holding) => {
  const self = Object.create(null);

  const links = mapObjVals(nodes => !nodes.length ? [nodes] : nodes )(links_)

  entrySeq(data).forEach(([k, v]) => {
    self['get' + capitaliseFirst(k)] = () => v
    self['set' + capitaliseFirst(k)]
      = v => createNode(Object.assign(data, { [k]: v }))
  });

  self.setLink = (k, v) => {
    const relation = links[k]
    return createNode(
      data,
      typeof relation === 'undefined' ?
        object.assign(links, { [k]: [v] }) :
        object.assign(links, { [k]: relation.concat(v) })
    )
  }

  self.setLinks = links =>
    links.reduce((node, link) => node.setLink(link), self)

  self.get = linkKey => createNode(data, links, linkKey)

  self.getString = () => `
[
  ${JSON.stringify(data)}${entrySeq(links).map(([linkKey, nodes]) => `
  ${linkKey}<${nodes.map(node => node.getString())}
  >`)}
]`

  if (holding) {
    const holdingNodes = links[holding]
    const out = {}
    holdingNodes.forEach((node) => {
      entrySeq(node).forEach(([methodName, method]) => {
        if (out[methodName]) return;
        out[methodName] = isGetter(methodName) ?
          () => holdingNodes.map(node => node[methodName]()) :
          (...args) => createNode(
            data,
            Object.assign(links, { [holding]: holdingNodes.map(node =>
              node[methodName](...args)
            )}),
            holding
          )
      })
    })
    return out
  }
  return self
}

const dan = createNode({ name: 'dan' })
const fred = createNode({ name: 'fred' }, { links: [dan] })
const danny = createNode({ name: 'danny' }, { links: [fred] });
// console.log(danny.get('links').setName('eoin').getString().toString())
// console.log(danny.get('links').getString().toString())

const n = danny.get('links').setName('fred2');//.get('links').setName('dan2');
// console.log(n.getString());
// console.log(danny.getString());
// console.log(danny.get('links').get('links').getString());
console.log(danny.get('links').get('links').setName('dan2').getName());
module.exports = createNode
