let DEBUG = true
DEBUG = false
/* istanbul ignore next */ /* eslint-disable */
const show = (...args) => { if (DEBUG) console.log(...args) }
/* eslint-enable */

const objCreate = props => {
  console.log(props)
  return Object.create(Object.prototype, props)
}
const empty = () => Object.create(null)

const mem = f => {
  let cacheArg, cacheReturn
  return arg => {
    if (arg !== cacheArg) {
      cacheArg = arg
      cacheReturn = f(arg)
    }
    return cacheReturn
  }
}

const objFromEntrySeq = entrySeq => {
  entrySeq.reduce((acc, [key, value]) => {
    acc.key = value
    return acc;
  }, Object.create(null))
}

const iArrayAccessors = arr => objFromEntrySeq(arr.map()){
  const acc = empty()
  arr.forEach((x, i) => { acc[i] = { enumerable: true, get: () => x } })
  return Object.create(null, acc)
}

const iArray = arr => {
  const data = arr.slice();
  const getters =
}

Object.assign(iArrayAccessors, {
  append: (...elems) => iArray([...arr, ...elems]),
  concat: (iArr) => iArray(arr.concat(iArr.mut)),
  map: f => iArray(arr.map(f)),
  one: pred => {
    let i = 0
    while (i < arr.length) {
      if (pred(arr[i], i)) return true
      i += 1
    }
    return false
  },
  reduce: arr.reduce,
}
// }
//   isIArray: { value: true },
//   length: { value: arr.length }
// }))
  // {
  //
  // },
  // Object.keys(arr).reduce((props, index) => {
  //   props[index] = {
  //     enumerable: true,
  //     get: () => arr[index]
  //   }
  //   return props
  // }, { length: { value: arr.length }, mut: { value: [...arr] } })
 // this will be better.

// wip
const hashTree = node =>
  JSON.stringify([node.id, ...node.children.map(child => hashTree(child))])

const addLinkToBins = (links, [tag, node]) =>
  links.set(tag, (links.get(tag) || iArray([])).append(node))

const buildLinkMap = links => links.reduce(addLinkToBins, new Map())

const flatMap = f => xs => xs.reduce((flat, x) => flat.concat(f(x)), iArray([]))

const getId = ((id) => () => (id++).toString())(0)

const cNode = (label, links = []) => {
  const linkMap = buildLinkMap(links)
  const cache = new Map()
  // const self = Object.create(null, {
  //   label: {
  //     get: () => label
  //   },
  //   setLabel: label => cNode(label, links)
  //
  // })
  const self = {
    label,
    id: getId(),
    isCNode: true,
    iArray: mem((self) => iArray([self])),
    addLink: link => cNode(label, [...links, link]),
    setLabel: label => cNode(label, links),
    getLabel: () => label,
    step: tag => linkMap.get(tag) || iArray([]),
    query: tags => {
      if (tags.length === 0) {
        return self.iArray(self)
      }
      const key = JSON.stringify(tags)
      const cachedResult = cache.get(key)
      const step = self.step(tags[0])
      const currentResult =
        flatMap(node => node.query(tags.slice(1)))(step)

      if (cachedResult === undefined) {
        cache.set(key, currentResult)
        return currentResult
      }

      const hasChanged =
        cachedResult.one((cachedNode, i) => cachedNode !== currentResult[i])

      if (hasChanged) {
        cache.set(key, currentResult)
        return currentResult
      }
      return cachedResult
    }
  }
  return self
}

const node = (label, links) => {
  let cNode_ = cNode(label, links)
  return Object.keys(cNode_).reduce((node, key) => {
    node[key] = (...args) => {
      const res = cNode_[key](...args)
      if (res.isCNode) {
        cNode_ = res
        return node
      }
      return res
    }
    return node
  }, {
    isNodeContainer: true,
    id: getId()
  })
}

module.exports = {
  iArray,
  flatMap,
  mem,
  cNode,
  node
}
