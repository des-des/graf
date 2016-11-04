const test = require('tape')

const createList = require('../lib/list.js')

test('createList exists', t => {
  t.equal(typeof createList, 'function')
  t.end()
})
