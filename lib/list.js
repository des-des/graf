const isUndef = x => typeof x === 'undefined'

const list = (head, tail) => {
  const self = {}

  self.head = head
  self.tail = tail

  const length = (isUndef(tail) ? 0 : tail.length) + (isUndef(head) ? 0 : 1)
  self.length = length

  const get = i => {
    if (i < 0) return undefined

    return i === 0 ? head : tail.get(i - 1)
  }
  self.get = get

  const cons = x => list(x, self)
  self.cons = cons

  const concat = xs => tail.concat(xs).cons(head)
  self.concat = concat

  return self
}

const emptyList = (() => {
  const self = list()

  const get = () => undefined
  self.get = get

  const concat = xs => xs
  self.concat = concat

  return self
})()

module.exports = function createList (...args) {
  return args.length === 0
    ? emptyList
    : list(args[0], createList(...args.slice(1)))
}
