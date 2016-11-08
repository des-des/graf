const test = require('tape')

const node = require('../lib/graph.js')
const map = require('../lib/map.js')

const mockGraph = () => {
  let updateNum = 0
  let nodeCount = 0
  const incUpdateNum = () => {
    updateNum += 1
    return mockGraph
  }

  const getUpdateNum = () => updateNum
  const nodes = {}
  const createNode = dataObj => {
    const id = nodeCount
    nodeCount += 1

    const newNode = node(map({
      updateNumber: 0,
      data: map(dataObj),
      linksTo: map(),
      linksFrom: map(),
      getGraphUpdateNumber: getUpdateNum,
      onNewRef: ref => {
        nodes[id] = ref
      }
    }))
    nodes[id] = newNode

    return newNode
  }

  return {
    nodes,
    createNode,
    incUpdateNum
  }
}

test('mutable with cycles', t => {
  const g = mockGraph()
  const n0 = g.createNode({ name: 'n0' })
  const n1 = g.createNode({ name: 'n1' })
  n0.setLink('tag', n1)
  n1.setLink('tag', n0)

  t.equal(n0.getLink('tag'), n1)
  t.equal(n1.getLink('tag'), n0)

  t.end()
})

test('immutable', t => {
  const g = mockGraph()
  const n0 = g.createNode({ name: 'n0' })
  const n1 = g.createNode({ name: 'n1' })
  g.incUpdateNum()
  const n0_ = n0.setLink('tag', n1)

  t.equal(n0.getLink('tag'), undefined, 'original node unchaged')
  t.equal(
    n0_.getLink('tag'),
    n1,
    'new node has update, holds old unchanged node'
  )
  t.equal(g.nodes[0], n0_, 'node called onNewRef successfully')

  g.incUpdateNum()
  g.nodes[1].set('name', 'n1!')

  t.equal(g.nodes[1].get('name'), 'n1!', 'name updated and we can get it')
  t.equal(
    g.nodes[0].getLink('tag').get('name'),
    'n1!',
    'graph holds update node'
  )

  t.end()
})
