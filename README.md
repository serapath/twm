# twm
**t**he **w**indow **m**anager <!--** (=fixes atom syntax highlighting)-->

## example
`npm install twm`
```js
/*
  [] === is shown tab (only one per TILE)
  => if multiple are present, the last one will take preceedence
  [[]] === is focused (only one per TWM)
  => if multiple TWMs are active in the window, the last
  one's [[]] will take preceedence

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
  // if only TAB in "PANE", a missing "tab name" hides the tab title altogether
}
```

## how does it work?
**@todo:** describe conceptually how the code works
