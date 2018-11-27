const bel = require('bel')
const csjs = require('csjs-inject')

/*
  e.g. var el = twm`` // has at least a (hidden) way to open a terminal
  @TODO: global terminal to issue commands to freeze/unfreeze tab content
         e.g. buttonless not closable menubar is not removable otherwse
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
  return el
}
function template (mosaic, theme) {
  // @TODO: re-write non-recursive!
  var opts = mosaic[0]
  var args = mosaic.slice(1)
  var cmd = opts.cmd
  if (cmd === 'tab') return tab(theme, opts, args)
  if (cmd === 'col' || cmd === 'row') return tile(theme, cmd, args)
  return command(opts, args) // @TODO: use to programmatically control TWM
  // console.log(opts)
  // for (var i = 1, len = mosaic.length; i < len; i++) {
  //   var item = mosaic[i]
  //
  //   console.log(mosaic[i])
  // }
  // console.log('----------')
  // return bel`
  //   <div class=${css.tilemosaic}>
  //     ${'menu()'}
  //     ${'elements.map(tab)'}
  //   </div>`
}
function tile (theme, cmd, args) {
  const css = getTheme(theme)
  return bel`
    <div class="${css.tile} ${cmd === 'col' ? css.col : css.row}">
      ${args.map(item => template(item, theme))}
    </div>`
}
function tab (theme, { active = 1 }, args) {
  const css = getTheme(theme)
  var element = args[active - 1].el
  var names = args.map(item => item.name)
  var container = bel`<div class=${css.container}>${element}</div>`
  return bel`
    <div class=${css.tab}>
      ${menu(css, names, active - 1, args, container)}
      ${container}
    </div>`
}
function menu (css, names, active, args, container) {
  var elements = names.map((name, i) => bel`
    <a class=${css.tabname} onclick=${e => onclick(i)}>${name}</a>
  `)
  elements[active].classList.add(css.tabactive)
  return bel`
    <div class=${css.menu}>
      ${elements}
    </div>`
  function onclick (i) {
    elements[active].classList.remove(css.tabactive)
    active = i
    elements[active].classList.add(css.tabactive)
    // debugger
    container.innerHTML = ''
    container.appendChild(args[i].el)
  }
}
function command (opts, args) {
  console.log(opts, args)
  console.error('@TODO: implement custom commands')
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
  return THEMES.get(key) || THEMES.set(key, style(theme)).get(key)
}
)(new Map([]))
// @TODO: maybe use "WeakMap" instead? ...and init on first use?
const style = ({
  font1 = 'Arial',
  text = 'black',
  activeText = 'white',
  color1 = 'green',
  color2 = 'grey',
  color3 = 'grey',
  color4 = 'red',
  color5 = 'blue',
} = {}) => csjs`
.tile {
  box-sizing: border-box;
  display: flex;
  position: relative;
  box-sizing: border-box;
  overflow: auto;
}
.tab {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: ${font1};
  padding: 5px;
  color: ${text};
  background-color: ${color1};
}
.menu {
  box-sizing: border-box;
  padding: 5px 5px 0px;
  height: 23px;
}
.tabname {
  box-sizing: border-box;
  margin: 0px 3px;
  padding: 3px 3px 0px 3px;
  border: 1px dotted white;
  font-weight: 600;
  cursor: pointer;

  background-color: ${color2};
}
.tabactive {
  box-sizing: border-box;
  border-bottom: 1px solid grey;
  color: ${activeText};
}
.container {
  box-sizing: border-box;
  height: calc(100% - 23px);

  background-color: ${color3};
}
.col {
  box-sizing: border-box;
  flex-direction: column;
  padding: 5px;

  background-color: ${color4};
}
.row {
  box-sizing: border-box;
  flex-direction: row;
  padding: 5px;

  background-color: ${color5};
}`
