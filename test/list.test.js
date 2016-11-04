const test = require('tape')

const list = require('../lib/list.js')

test('list exists', t => {
  t.equal(typeof list, 'function')
  t.end()
})

test('empty list', t => {
  const emptyList = list()

  t.equal(typeof emptyList, 'object', 'creates a list')
  t.throws(
    () => { emptyList.head() },
    /Cannot call head on an empty list/,
    'calling head on empty list throws'
  )

  t.throws(
    () => { emptyList.tail() },
    /Cannot call tail on an empty list/,
    'calling tail on empty list throws'
  )
  t.end()
})
