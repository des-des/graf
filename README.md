### graf

simple js graph libary

Always responds with the same object when you walk links to unchanged nodes

eg

```js
const { node } = require('./graf.js')

const nodeVersion = node('6')
const lang = node('nodejs', [['version', nodeVersion]])

const me = node('des-des', [['lang', lang], ['v', nodeVersion]])
const versionQuery = me.query(['lang', 'version'])
console.log(versionQuery[0].getLabel()) // 6
console.log(me.query(['v'])[0].getLabel()) // 6

lang.setLabel('BASIC')
console.log(versionQuery[0].getLabel()) // 6 (unchanged)
const versionQueryAgain = me.query(['lang', 'version'])

console.log(versionQueryAgain === versionQuery) // false
// since the walk has changed

const pasta = node('pasta')
me.addLink(['likes', pasta])

const vQ3 = me.query(['lang', 'version'])
console.log(versionQueryAgain === versionQuery) // true

console.log(me.query(['likes'])[0].getLabel()) // pasta
```

#### Why?

using redux / immutable / react
 1. we keep our redux state flat
 2. we use immutablejs for our redux state
 3. we check shallow equality on props in our components
 4. our state is highly relation
 5. mappings like
 ```js
 state.getIn(['eoin', 'people']).map(pId => state.get(pId))
 ```
 are always going to return new object references

###### Use a graph to store our data?

###### A
 ```js
  eoin.get('friends')
 ```
 has many less lookups than
 ```js
  eoin.get('friend').map(fId => state.get(fId))
 ```
as in this graph implementation nodes hold the ref

###### B
this gives memoization. (no messing with reselect)


###### This is work in progress. Contributions welcome!

###### TODO
 1. Build nice api on top of engine
 2. Clean up object creation protos ect
