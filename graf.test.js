const test = require('tape')

const { cNode, mem } = require('./graf.js')

test('momoizer', t => {
  const inObj = mem(str => ({ [str]: str }))
  const o1 = inObj('str')
  const o2 = inObj('str')
  const o3 = inObj('string')

  t.equal(o1, o2, 'memoizes')
  t.notEqual(o1, o3, 'gives new result for different arg')

  t.end()
})

test('cNode label', t => {
  const n = cNode('n')
  t.equal(n.getLabel(), 'n', 'stores label')

  t.end()
})

test('cNode, change label', t => {
  const n1 = cNode('n1')
  const n2 = n1.setLabel('n2')
  t.notEqual(n1, n2, 'creates new node')
  t.equal(n1.getLabel(), 'n1', 'first node unchaged')
  t.equal(n2.getLabel(), 'n2', 'second node correctly set')

  t.end()
})

test('link', t => {
  const n1 = cNode('n1')
  const n2 = cNode('n2', [['link', n1]])
  const linkedNodes = n2.relation('link')

  t.equal(linkedNodes.length, 1, 'corect number of nodes returned')

  const linkedNode = linkedNodes[0]
  t.equal(n1, linkedNode, 'link successfuly holds something')

  linkedNodes[0] = 'eoin'
  t.equal(linkedNodes[0], n1, 'link array cannot be changed')

  t.end()
})

test('adding links', t => {
  const n1 = cNode('n1')
  const n2 = cNode('n2')
  const n3 = cNode('n3')

  const n4 = n3.addLink(['link', n1])

  t.notEqual(n4, n3, 'adding link creates new node')
  t.equal(n3.relation('link').length, 0, 'old node does not have new link')

  t.end()
})
