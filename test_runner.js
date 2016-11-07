const toTest = [
  'list',
  'map',
  'graph'
]

toTest.forEach(name => {
  require(`./test/${name}.test.js`)
})
