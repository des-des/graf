const toTest = [
  'list'
  // 'graf'
]

toTest.forEach(name => {
  require(`./test/${name}.test.js`)
})
