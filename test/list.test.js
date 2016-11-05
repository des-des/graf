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
