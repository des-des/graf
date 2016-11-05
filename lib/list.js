const isUndef = x => typeof x === 'undefined'

const list = (head, tail) => {
  const self = {}

  self.head = head
  self.tail = tail

  self.length = (isUndef(tail) ? 0 : tail.length) + (isUndef(head) ? 0 : 1)

  return self
}

module.exports = function createList (...args) {
  return args.length === 0
    ? list()
    : list(args[0], createList(...args.slice(1)))
}
