let DEBUG = true
DEBUG = false
const show = (...args) => { if (DEBUG) console.log(...args) };

////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////
const iArray = arr => Object.create(
  {
    append: (...elems) => iArray([...arr, ...elems]),
    concat: (iArr) => iArray(arr.concat(iArr.mut)),
    map: f => iArray(arr.map(f)),
    one: pred => {
      let i = 0
      while(i < arr.length) {
        if (pred(arr[i], i)) return true
        i += 1
      }
      return false
    },
    reduce: arr.reduce,
    isIArray: true
  },
  Object.keys(arr).reduce((props, index) => {
    props[index] = {
      enumerable: true,
      get: () => arr[index]
    }
    return props;
  }, { length: { value: arr.length }, mut: { value: [...arr] } })
) // this will be better.

////////////////////////////////////////////////////////////////////////////////
const addLinkToBins = (links, [tag, node]) =>
  links.set(tag, (links.get(tag) || iArray([])).append(node))

const buildLinkMap = links => links.reduce(addLinkToBins, new Map())

const flatMap = f => xs => xs.reduce((flat, x) => flat.concat(f(x)), iArray([]))
const queryStep = tag => flatMap(cNode => cNode.step(tag))

const getId = ((id) => () => (id++).toString())(0)

const inIArray = () => mem()

const cNode = (label, links = []) => {
  const linkMap = buildLinkMap(links)
  const cache = new Map()
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
      show(`query ${JSON.stringify(tags)}, on node with label ${label}`);
      show('START ', label);
      if (tags.length === 0) {
        show('STOP ', label);
        return self.iArray(self)
      }
      show('continueing query as non empty tags');
      const key = JSON.stringify(tags);
      const cachedResult = cache.get(key)
      show(`there is ${cachedResult ? 'a' : 'no'} cache`);
      const step = self.step(tags[0]);
      const currentResult =
        flatMap(node => node.query(tags.slice(1)))(step)

      if (cachedResult === undefined) {
        cache.set(key, currentResult)
        show('STOP ', label)
        return currentResult
      }
      show('cache and current');
      show(cachedResult[0]);
      show(currentResult[0]);

      const hasChanged =
        cachedResult.one((cachedNode, i) => {
          show('compairing');
          show(i);
          show(cachedNode);
          show(currentResult[i]);
          const res = cachedNode !== currentResult[i]
          show({res});
          return res
        })

      show({ hasChanged });
      if (hasChanged) {
        cache.set(key, currentResult)
        show('STOP ', label);
        return currentResult
      }
      show('STOP ', label);
      return cachedResult
    }
  }
  return self
}

const node = (label, links) => {
  let cNode_ = cNode(label, links)
  return Object.keys(cNode_).reduce((node, key) => {
    node[key] = (...args) => {
      const res = cNode_[key](...args);
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
