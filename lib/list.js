const isUndef = x => typeof x === 'undefined'

const list = (head, tail) => {
  const self = {}

  self.head = head
  self.tail = tail

  const length = (isUndef(tail) ? 0 : tail.length) + (isUndef(head) ? 0 : 1)
  self.length = length

  const get = i => {
    if (length === 0) return undefined
    if (i < 0) return undefined
    if (i === 0) return head

    return tail.get(i - 1)
  }
  self.get = get

  return self
}

module.exports = function createList (...args) {
  return args.length === 0
    ? list()
    : list(args[0], createList(...args.slice(1)))
}
