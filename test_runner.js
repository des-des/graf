const toTest = [
  'list',
  'map'
]

toTest.forEach(name => {
  require(`./test/${name}.test.js`)
})
