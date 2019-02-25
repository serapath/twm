const bel = require('bel')
const csjs = require('csjs-inject')

const twm = require('../')

function addBox (el) {
  var box = makeBox()
  document.body.appendChild(box)
  box.appendChild(el)
}
function makeBox (color = `hsla(${360*Math.random()},100%,50%,1)`) {
  var box = document.createElement('div')
  box.className = css.box
  box.style = `border: 3px dashed ${color};`
  return box
}

function makeStuff () {
  const ed = { el: bel`<p>EDITOR</b>`, name: 'editor' }
  const out = { el: bel`<p>OUTPUT</b>`, name: 'output' }
  const sc = { el: bel`<div>xxx</div>`, name: 'preview' }
  const mb = { el: bel`<p>MENUBAR</b>`, name: 'navbar' }
  return [ed, out, sc, mb]
}

setTimeout(async () => {
  const [ed1, out1, sc1, mb1] = makeStuff()
  const [ed2, out2, sc2, mb2] = makeStuff()
  const [ed3, out3, sc3, mb3] = makeStuff()
  const [ed4, out4, sc4, mb4] = makeStuff()
  ;[
    twm`
      [[${ed1}]] ${out1} | ${sc1}
      ${mb1}
    `,
    twm`
      [[${ed2}]] ${out2} | ${sc2}
      ${mb2}
    `,
    twm({ theme: {} })`
      [[${ed3}]] ${out3} | ${sc3}
      ${mb3}
    `,
    twm({ theme: {} })`
      [[${ed4}]] ${out4} | ${sc4}
      ${mb4}
    `,
  ].forEach(addBox)

  // const mosaic = twm(theme)`
  //   [[${ed}]] ${out} | ${sc}
  //   ${mb}`
  // const [,[,[,editor, output],[,scapp]],[,navbar]] = Array.from(mosaic)

}, 0)

document.head.innerHTML = `<style>
  html, body { height: 100vh; width: 100vw; }
</style>`
document.body.innerHTML = `<h1> under construction </h1>`
const css = csjs`.box {
  display: inline-block;
  box-sizing: border-box;
  margin: 10px; padding: 10px;
  height: 40%; width: 45%;
}`
