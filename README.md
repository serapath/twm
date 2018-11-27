# twm
**t**he **w**indow **m**anager


## example
`npm install twm`
```js
/*
  [] === is shown tab (only one per TILE)
  [[]] === is focused (only one per tiler)
  => if multiple tilers are active in the window, the last
  one will take preceedence

  ... | ... === seperates columns
  \n === seperates rows

  a tile with only one tab will automatically show it
*/
var twm = require('twm')

var opts = {
  // optional - initial & current element
  el: document.createElement('div'),
  // optional - tab name
  name: 'preview'
  //
}
```

---

# CONCEPT (tiling window manager ideas)
* @TODO: ...
