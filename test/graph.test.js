const test = require('tape')

const node_ = require('../lib/graph.js')
const map = require('../lib/map.js')
// const list = require('../lib/list.js')

const node = (data, updateNumber = 0, linksTo = {}, linksFrom = {}) =>
  node_(map({
    data: map(data),
    linksTo: map(linksTo),
    linksFrom: map(linksFrom),
    updateNumber
  }))

test('try and make a graph', t => {
  const n1 = node({ name: 'n1' })
  const n2 = node(
    {name: 'n2'},
    0,
    { 'link': n1 }
  )

  const n2_ = n2.set('name', 'n2_')
  const n2__ = n2_.set('name', 'n2__')

  t.notEqual(n2, n2_, 'new node is created')
  t.equal(n2_, n2__, 'another update fails to create a new node, (BROKEN)')

  t.end()
})
