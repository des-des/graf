const test = require('tape')

const { cNode, mem, iArray, flatMap } = require('./graf.js')

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
  const three = iArray([1, 2, 3]);

  t.equal(three.length, 3, 'length set correctly for longer array');
  t.equal(three[1], 2, 'getter works as expected')

  three[0] = 0;
  t.equal(three[0], 1, 'set index does not change i array')

  const four = three.append(4);

  t.notEqual(three, four, 'append return new iArray')
  t.equal(three[3], undefined, 'and does not change original')
  t.equal(four[3], 4, 'and returns correctly set iArray')

  t.end()
})

test('flatMap', t => {
  const inIArray = x => iArray([x]);
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
  const linkedNodes = n2.query('link')
  t.equal(linkedNodes.length, 1, 'correct number of nodes returned')

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
  t.equal(n3.query('link').length, 0, 'old node does not have new link')
  t.equal(n4.query('link')[0].getLabel(), 'n1', 'new node has correct link')

  t.end()
})

test('chaining queries', t => {
  const n1 = cNode('n1')
  const n2 = cNode('n2')
  const n3 = cNode('n3', [['link', n2], ['link', n1]])
  const n4 = cNode('n3', [['connection', n3]])

  t.deepEqual(
    n4.query('connection', 'link').map(l => l.getLabel()),
    ['n2', 'n1'],
    'seems good'
  );

  t.end()
})
