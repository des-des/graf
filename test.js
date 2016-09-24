const test = require('tape')

const node = require('./sg.js')

test('get data', t => {
  const n = node({ name: 'eoin' })
  t.equal(n.getName(), 'eoin')
  t.end()
})

test('can set data', t => {
  const n = node({ name: 'eoin' })
  const n2 = n.setName('eoin2')

  t.notEqual(n, n2, 'creates new object')
  t.equal(n.getName(), 'eoin', 'original node unchanged')
  t.equal(n2.getName(), 'eoin2', 'new node correctly set')
})

test('link', t => {
  const n = node({ name: 'eoin' }, { child: node({ name: 'des' }) })
  t.deepEqual(n.get('child').getName(), ['des'], 'can follow link')

  const n2 = n.get('child').set('name', 'desdes')
  t.equal(n.get('child').getName(), 'des', 'changing links does not mutate')
  t.equal(
    n2.get('child').getName(),
    'desdes',
    'new graph created when linked node is changed'
  )

  t.end()
})

test('chain', t => {
  const n1 = node({ name: '1' })
  const n2 = node({ name: '2' }, { child: n1 })
  const n3 = node({ name: '3' }, { child: n2 })

  const n4 = n1.get('child').get('child').setName('4');

  t.notEqual(n1, n4, 'new graph created');
  t.equal(n4.getName(), '1', 'returns entry node')
  t.equal(
    n4.get('links').get('links').getName(),
    '4',
    'selected node properly set'
  )

  t.end()
})
