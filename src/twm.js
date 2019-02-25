const bel = require('bel')
const csjs = require('csjs-inject')
const onload = require('on-load')
/*
  e.g. var el = twm`` // has at least a (hidden) way to open a terminal
  @TODO: global terminal to issue commands to freeze/unfreeze tab content
         e.g. buttonless not closable tabsbar is not removable otherwise
*/
module.exports = twm

function twm (_strings, ..._args) {
  if (_strings.length) return _twm(undefined, _strings, _args)
  else return (strings, ...args) => _twm(_strings, strings, args)
}
function _twm (theme, strings, args) {
  var mosaic = parse(strings, args)
  var el = template(mosaic, theme)
  el.length = mosaic.length
  mosaic.reduce((el, val, key) => (el[key] = val, el), el)
  el.api = ({ cmd, target }) => {
    console.log('cmd', cmd, 'target', target)
  }
  const listeners = { resize: [] }
  el.on = (name, done) => {
    if (name === 'resize') listeners.resize.push(done)
  }
  return el
}
// function onresize (target, callback) {
//   function makeid (el) {
//     return [target.style.width, target.style.height, target.clientWidth, target.clientHeight].join('')
//   }
//   var last = makeid(target)
//   var observer = new MutationObserver(mutations => {
//     for (var i = 0; i < mutations.length; i++) {
//       var m = mutations[i]
//       if (m.type !== 'attributes' || m.attributeName === 'style' || m.attributeName === 'class') {
//         var now = makeid(target)
//         if (now !== last) {
//           last = now
//           callback({
//             width: target.clientWidth,
//             height: target.clientHeight,
//             w: target.offsetWidth,
//             h: target.offsetHeight,
//           })
//           break
//         }
//       }
//     }
//   })
//   observer.observe(target, {
//     attributes: true,
//     childList: true,
//     characterData: true,
//     subtree: true,
//   })
//   return observer
// }
// ------------------------
// function observe (container) {
//   var observer = new MutationObserver(mutations => {
//     for (var i = 0; i < mutations.length; i++) {
//       var m = mutations[i]
//       // @TODO: container is relative and overflow hidden
//       // => make sure children can not visually break out!
//       console.log('OBSERVE', container.children[0])
//       // @TODO: update height/width according to layout changes
//
//       // var obs = onresize(container, ({ width, height, w, h }) => {
//       //   console.log('[size]', width, height)
//       //   console.log('[offset]', w, h)
//       //   /* @TODO:
//       //
//       //     1. we know things changed
//       //     2. update `container` with appropriate height/width
//       //     3. also trigger other "containers" to update their width
//       //       * ,,,
//       //
//       //   */
//       // })
//       // // @TODO: (un)register `obs` on childList change
//       // // @TODO: change size manually on `characterData`
//     }
//   })
//   observer.observe(container, { childList: true, characterData: true })
// }
// const TABS = new Map()
function template (mosaic, theme) {
  var opts = mosaic[0]
  var args = mosaic.slice(1)
  var cmd = opts.cmd
  if (cmd === 'tab') return tab(theme, opts, args)
  if (cmd === 'col' || cmd === 'row') return tile(theme, cmd, args)
  throw new Error('only `tab`, `col` or `row` are supported')

  // return command(opts, args) // @TODO: use to programmatically control TWM
  // console.log(opts)
  // for (var i = 1, len = mosaic.length; i < len; i++) {
  //   var item = mosaic[i]
  //   @TODO: re-write non-recursive!
  //   console.log(mosaic[i])
  // }
}
function tile (theme, cmd, args) {
  const css = getTheme(theme)
  var el = bel`
    <div class="${css.tile} ${cmd === 'col' ? css.col : css.row}">
      ${args.map(item => template(item, theme))}
    </div>`
  onload(el, load, unload)
  return el
  function load (target) {
    var x = setInterval(() => {
      if (isInDOM(target)) {
        clearInterval(x)
        adjustSizes(target, css, 'LOAD TILE')
      }
    }, 50)
  }
  function unload (target) {
    var x = setInterval(() => {
      if (isInDOM(target)) {
        clearInterval(x)
        adjustSizes(target, css, 'UNLOAD TILE')
      }
    }, 50)
  }
}

// @TODO: resize-sensor for ROOT container to
//        adjust on resize
window.addEventListener('resize', event => {

  console.log("RESIZE!!!")
})

function adjustSizes (target, css, from) {
  console.log(from)
  const parent = target.parentElement
  const children = (!parent.classList.contains(css.tile) &&
    !parent.classList.contains(css.row)  &&
    !parent.classList.contains(css.col)  &&
    !parent.classList.contains(css.tab)) ?
      [] : [... target.parentElement.children]
  if (parent.classList.contains(css.col)) {
    var s = getComputedStyle(parent)
    var p = +s.padding.split('px')[0]
    var b = +s.border.split('px')[0]
    var h = +s.height.split('px')[0] - 2 * (p+b)
    const height = h / (children.length || 1)
    children.forEach(el => {
      var border = 0//30
      var margin = 0//5
      var color = `hsla(${360*Math.random()},100%,60%,1)`
      el.style = `
        border: ${border}px dashed ${color};
        margin: ${margin}px;
        // min-height: ${height - (2 * margin)}px;
        // max-height: ${height - (2 * margin)}px;
      `
    })
  }
  else if (parent.classList.contains(css.row)) {
    var s = getComputedStyle(parent)
    var p = +s.padding.split('px')[0]
    var b = +s.border.split('px')[0]
    var w = +s.width.split('px')[0] - 2 * (p+b)
    const width = w / (children.length || 1)
    children.forEach(el => {
      var border = 0//50
      var margin = 0//10
      var color = `hsla(${360*Math.random()},100%,60%,1)`
      el.style = `
        border: ${border}px dashed ${color};
        margin: ${margin}px;
        // min-width: ${width - (2 * margin)}px;
        // max-width: ${width - (2 * margin)}px;
      `
    })
  }
}
function tab (theme, { active = 1 }, args) {
  const css = getTheme(theme)
  const element = args[active - 1].el
  const names = args.map(item => item.name).filter(x => x)
  const bar = tabsbar(css, names, active - 1, args, el => {
    container.innerHTML = ''
    container.appendChild(el)
  })
  const container = !bar.children.length ?
    bel`<div class=${css.maxcontainer}>${element}</div>`
    : bel`<div class=${css.container}>${element}</div>`
  var el = bel`
    <div class=${css.tab}>
      ${bar}
      ${container}
    </div>`
  onload(el, load, unload)
  return el
  function load (target) {
    var x = setInterval(() => {
      if (isInDOM(target)) {
        clearInterval(x)
        adjustSizes(target, css, 'LOAD TAB')
      }
    }, 50)
  }
  function unload (target) {
    var x = setInterval(() => {
      if (isInDOM(target)) {
        clearInterval(x)
        adjustSizes(target, css, 'UNLOAD TAB')
      }
    }, 50)
  }
}
function tabsbar (css, names, active, args, done) {
  var elements = names.map((name, i) => bel`
    <a class=${css.tabname} onclick=${e => onclick(i)}>${name}</a>
  `)
  if (elements.length) {
    elements[active].classList.add(css.tabactive)
    var el = bel`<div class=${css.tabsbar}>${elements}</div>`
  } else var el = bel`<div></div>`
  return el
  function onclick (i) {
    elements[active].classList.remove(css.tabactive)
    active = i
    elements[active].classList.add(css.tabactive)
    done(args[i].el)
  }
}
function command (opts, args) {
  console.log(opts, args)
  console.error('@TODO: implement custom commands')
  throw new Error('@TODO: implement custom commands')
}
function isInDOM (el) {
  if (!el) return
  do {
    var old = el
  } while (el = el.parentElement)
  if (old === document.documentElement) return true
}
function parse (strings, args) { // @TODO: make it work for real!
  var editor = args[0]
  var output = args[1]
  var scapp = args[2]
  var navbar = args[3]
  return [
    { cmd: 'col' },
      [{cmd: 'row'},
      [{cmd: 'tab', active: 1 }, editor, output],
      [{cmd: 'tab'}, scapp]
    ],
    [{cmd: 'tab'}, navbar]
  ]
}
const getTheme = (THEMES => (theme, key = JSON.stringify(theme)) =>{
  // @TODO: maybe use "WeakMap" instead? ...and init on first use?
  // @TODO: replace with component library
  // @TODO: add hooks to listen for changes
  // @TODO: make updatable (e.g. CSSOM)
  // @TODO: use css variables maybe?
  return THEMES.get(key) || THEMES.set(key, style(theme)).get(key)
})(new Map([]))
const style = ({
  font1 = 'Arial',
  color_text = 'black',
  color_activeText = 'white',
  color_bgPanel = 'green',
  color_bgTab = 'grey',
  color_bgContent = 'grey',
  color_background = 'red',
  color_bgPane = 'blue',
} = {}) => csjs`
.tile {
  box-sizing: border-box;
  display: flex;
  position: relative;
  box-sizing: border-box;
  height: 100%;
  flex-grow: 1;
  overflow: auto;
}
.tab {
  box-sizing: border-box;
  font-family: ${font1};
  color: ${color_text};
  background-color: ${color_bgPanel};
}
.tabsbar {
  box-sizing: border-box;
  display: flex;
  box-sizing: border-box;
  padding-left: 35px;
  height: 23px;
}
.tabname {
  box-sizing: border-box;
  margin: 0px 3px;
  padding: 3px 3px 0px 3px;
  font-size: 14px;
  border: 1px dashed white;
  font-weight: 600;
  cursor: pointer;

  background-color: ${color_bgTab};
}
.tabactive {
  box-sizing: border-box;
  border-bottom: 1px solid ${color_bgContent};
  color: ${color_activeText};
}
.container {
  box-sizing: border-box;
  height: calc(100% - 23px);

  // background-color: ${color_bgContent};

  position: relative;
  overflow: auto;
}
.maxcontainer {
  box-sizing: border-box;
  height: 100%;

  // background-color: ${color_bgContent};

  position: relative;
  overflow: auto;
}
.col {
  box-sizing: border-box;
  flex-direction: column;

  // padding: 20px;
  // background-color: ${color_background};
}
.row {
  box-sizing: border-box;
  flex-direction: row;

  // padding: 20px;
  // background-color: ${color_bgPane};
}`
