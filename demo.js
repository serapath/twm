const bel = require('bel')
const csjs = require('csjs-inject')
document.head.innerHTML = `
  <style>
    html, body {
      display: flex;
      flex-direction: column;
      margin: 0;
      height: 100vh;
      width: 100vw;
    }
  </style>`

const twm = require('./')
function makeBox (color = `hsla(${360*Math.random()},100%,50%,1)`) {
  var box = document.createElement('div')
  box.style = `box-sizing: border-box; padding: 10px; border: 3px dashed ${color};`
  return box
}
var boxes = [...Array(4)].map(makeBox)
boxes.forEach(el => document.body.appendChild(el))

const theme1 = {}
const theme2 = {}

// ;[
//   twm`
//
//   `,
//   twm`
//
//   `,
//   twm(theme1)`
//
//   `,
//   twm(theme2)`
//
//   `,
// ].forEach((el, i) => document.body.appendChild(el))

document.body.innerHTML = `<h1> under construction </h1>`

const css = csjs`.container { border: 5px dotted red; }`
const theme = {}
const ed = { el: bel`<p>EDITOR</b>`, name: 'editor' }
const out = { el: bel`<p>OUTPUT</b>`, name: 'output' }
const sc = { el: bel`<div></div>`, name: 'preview' }
const mb = { el: bel`<p>MENUBAR</b>`, name: 'navbar' }
const mosaic = twm(theme)`
  [[${ed}]] ${out} | ${sc}
  ${mb}`
const [,[,[,editor, output],[,scapp]],[,navbar]] = Array.from(mosaic)
var el = bel`<div class=${css.container}>${mosaic}</div>`
document.body.appendChild(el)
