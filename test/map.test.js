const test = require('tape')

const map = require('../lib/map.js')

test('map.get', t => {
  const m = map({ k1: 'v1', k2: 'k2' })

  t.equal(m.get('k1'), 'v1', 'gives back value')
  t.equal(m.get('k3'), undefined, 'unknown key returns undefined')
  t.end()
})

test('map.set', t => {
  const m1 = map({ k1: 'v1' })
  const m2 = m1.set('k2', 'v2')

  t.notEqual(m1, m2, 'new instance created')
  t.equal(m1.get('k2'), undefined, 'original map not mutated')
  t.equal(m2.get('k2'), 'v2', 'new map correctly set')
  t.end()
})

test('map.update', t => {
  const m1 = map({ k1: 1 })

  t.equal(
    m1.update('k1', v1 => v1 + 1).get('k1'),
    2,
    'value updated successfully'
  )
  t.end()
})

test('map.setIn', t => {
  const m1 = map({ k1: map({ k2: 'v1' }) })
    .setIn(['k1', 'k2'], 'v2')

  t.equal(m1.get('k1').get('k2'), 'v2', 'value set successfully')
  t.end()
})
