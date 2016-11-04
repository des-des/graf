const test = require('tape')

const { cNode, mem, iArray, flatMap, node } = require('./graf.js')

test('momoizer', t => {
  const inObj = mem(str => ({ [str]: str }))
  const o1 = inObj('str')
  const o2 = inObj('str')
  const o3 = inObj('string')

  t.equal(o1, o2, 'memoizes')
  t.notEqual(o1, o3, 'gives new result for different arg')

  t.end()
})

test('iArray', t => {
  t.equal(iArray([]).length, 0, 'empty iArray has zero length')
  const three = iArray([1, 2, 3])

  console.log(three)

  t.equal(three.length, 3, 'length set correctly for longer array')
  t.equal(three[1], 2, 'getter works as expected')

  three[0] = 0
  t.equal(three[0], 1, 'set index does not change i array')

  const four = three.append(4)

  t.notEqual(three, four, 'append return new iArray')
  t.equal(three[3], undefined, 'and does not change original')
  t.equal(four[3], 4, 'and returns correctly set iArray')

  t.end()
})

test('flatMap', t => {
  const inIArray = x => iArray([x])
  t.equal(flatMap(inIArray)([1, 2])[1], 2, 'returns flat array')
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
  const linkedNodes = n2.query(['link'])

  t.equal(linkedNodes.length, 1, 'correct number of nodes returned')

  const linkedNode = linkedNodes[0]
  t.equal(n1, linkedNode, 'link successfuly holds something')

  linkedNodes[0] = 'eoin'
  t.equal(linkedNodes[0], n1, 'link array cannot be changed')
  t.equal(linkedNode.getLabel(), 'n1', 'can get label of link')

  t.end()
})

test('adding links', t => {
  const n1 = cNode('n1')
  const n2 = cNode('n2')

  const n3 = n2.addLink(['link', n1])

  t.notEqual(n3, n2, 'adding link creates new node')

  t.equal(n2.query(['link']).length, 0, 'old node does not have new link')
  t.equal(n3.query(['link'])[0].getLabel(), 'n1', 'new node has correct link')

  t.end()
})

test('chaining queries', t => {
  const n1 = cNode('n1')
  const n2 = cNode('n2')
  const n3 = cNode('n3', [['link', n2], ['link', n1]])
  const n4 = cNode('n3', [['connection', n3]])

  t.deepEqual(
    n4.query(['connection', 'link']).map(l => l.getLabel()),
    ['n2', 'n1'],
    'seems good'
  )

  t.end()
})

test('node', t => {
  const n1 = node('n1')
  t.equal(n1.getLabel(), 'n1', 'node accesses underlying cNodes getters')

  const n2 = node('n2')
  const n3 = n2.addLink(['link', n1])

  t.equal(n2, n3, 'node container does not create new instance')

  t.end()
})

test('node, change underlying', t => {
  const n1 = node('n1')
  t.equal(n1.getLabel(), 'n1', 'node accesses underlying cNodes getters')

  const n2 = node('n2')
  const n3 = n2.addLink(['link', n1])

  n1.setLabel('x')
  t.equal(
    n3.query(['link'])[0].getLabel(),
    'x',
    'link works on to changing underlying cNode'
  )

  t.end()
})

test('caching, repeat query', t => {
  const n1 = node('n1')
  const n2 = node('n2', [['n1Link', n1]])
  const n3 = node('n3', [['n2Link', n2]])

  const q1 = n3.query(['n2Link', 'n1Link'])
  const q2 = n3.query(['n2Link', 'n1Link'])

  t.equal(q1, q2, 'same query on same graph returns same object')
  t.end()
})

test('caching, with change', t => {
  const n1 = node('n1')
  const n2 = node('n2', [['n1Link', n1]])

  const q1 = n2.query(['n1Link'])
  n1.setLabel('x')
  const q2 = n2.query(['n1Link'])

  t.notEqual(q1, q2, 'same query on different graph returns different object')

  t.equal(q1[0].getLabel(), 'n1', 'first query holds its result')
  t.equal(q2[0].getLabel(), 'x', 'second query correct')
  t.end()
})

test('bigger test', t => {
  const n1 = node('n1')
  const n2 = node('n2')
  const n3 = node('n3')
  const n4 = node('n4')
  const n5 = node('n5')

  n2.addLink(['l1', n1])
  n3.addLink(['l1', n2])
  n3.addLink(['l1', n4])
  n3.addLink(['l2', n5])
  n4.addLink(['l2', n3])
  n5.addLink(['l1', n4])

  const q1 = n5.query(['l1', 'l2', 'l1'])
  t.deepEqual(
    q1.map(node => node.getLabel()),
    ['n2', 'n4'],
    'bigger query returns correct result'
  )
  const q2 = n5.query(['l1', 'l2', 'l1'])
  t.equal(q1, q2, 'query remembered')

  n2.setLabel('n2_')
  t.equal(q1[0].getLabel(), 'n2', 'query holds value')

  const q3 = n5.query(['l1', 'l2', 'l1'])
  t.notEqual(q2, q3, 'query on new graph is different')
  t.equal(q3[0].getLabel(), 'n2_', 'query on new graph is correct')

  t.end()
})
