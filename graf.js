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

const buildLinkMap = links => links.reduce(addLinkToBins, new Map());

const flatMap = f => xs =>
  xs.reduce((flat, x) => flat.concat(f(x)), iArray([]));

const queryStep = tag => flatMap(cNode => cNode.step(tag))

const cNode = (label, links = []) => {
  const linkMap = buildLinkMap(links);
  const self = {
    addLink: link => cNode(label, [...links, link]),
    setLabel: label => cNode(label, links),
    getLabel: () => label,
    step: tag => linkMap.get(tag) || iArray([]),
    query: (...tags) =>
      tags.reduce((res, tag) => queryStep(tag)(res), iArray([self]))
  }
  return self;
}

module.exports = {
  iArray,
  flatMap,
  mem,
  cNode
}
