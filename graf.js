// cNode


const iArray = arr => Object.create(
  { append: elem => iArray([...arr, elem]) },
  Object.keys(arr).reduce((props, index) => {
    props[index] = {
      enumerable: true,
      get: () => arr[index]
    }
    return props;
  }, { length: { value: arr.length } })
);

const addLinkToBins = (links, [tag, node]) =>
  links.set(tag, (links.get(tag) || iArray([])).append(node))

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

const buildLinkMap = links => links.reduce(addLinkToBins, new Map());

const cNode = (label, links = []) => ({
  addLink: link => cNode(label, links.concat(link)),
  setLabel: label => cNode(label, links),
  getLabel: () => label,
  relation: tag => mem(buildLinkMap)(links).get(tag) || [],
})

module.exports = {
  mem,
  cNode
}
