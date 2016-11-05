const test = require('tape')

const list = require('../lib/list.js')

test('list exists', t => {
  t.equal(typeof list, 'function')
  t.end()
})

test('empty list', t => {
  const emptyList = list()

  t.equal(typeof emptyList, 'object', 'creates a list')
  t.equal(emptyList.length, 0, 'has length 0')
  t.equal(typeof emptyList.head, 'undefined', 'has undefined head')
  t.equal(typeof emptyList.tail, 'undefined', 'has undefined tail')
  t.end()
})

test('list with one elem', t => {
  const l = list(1)

  t.equal(l.length, 1, 'has length 0')
  t.equal(l.head, 1, 'has undefined head')
  t.equal(l.tail.length, 0, 'has undefined tail')
  t.end()
})

test('list with many elems', t => {
  const l = list(0, 1, 2, 3)

  t.equal(l.length, 4, 'has length 0')
  t.equal(l.tail.tail.head, 2, 'can get nested elems')
  t.end()
})
