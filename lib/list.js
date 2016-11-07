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

  const reduce = (f, acc) => tail.reduce(f, f(acc, head))
  self.reduce = reduce

  const concat = xs => tail.concat(xs).cons(head)
  self.concat = concat

  const map = f => list(f(head), tail.map(f))
  self.map = map

  return self
}

const emptyList = (() => {
  const self = list()

  const get = () => undefined
  self.get = get

  const reduce = (f, acc) => acc
  self.reduce = reduce

  const concat = xs => xs
  self.concat = concat

  const map = () => self
  self.map = map

  return self
})()

module.exports = function createList (...args) {
  return args.length === 0
    ? emptyList
    : list(args[0], createList(...args.slice(1)))
}

module.exports.fromArray = function fromArray (xs) {
  return xs.length === 0
    ? emptyList
    : list(xs[0], fromArray(xs.slice(1)))
}
