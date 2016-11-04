const list = (...args) => {
  if (args.length === 0) return emptyList
  return {}
}

module.exports = list

const emptyList = {
  head: () => { throw new Error('Cannot call head on an empty list') },
  tail: () => { throw new Error('Cannot call tail on an empty list') }
}
