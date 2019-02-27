(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/demo/demo.js":[function(require,module,exports){
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

},{"../":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/src/twm.js","bel":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/bel/browser.js","csjs-inject":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs-inject/index.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/bel/appendChild.js":[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/bel/browser.js":[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/bel/appendChild.js","hyperx":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/hyperx/index.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/browser-resolve/empty.js":[function(require,module,exports){

},{}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs-inject/csjs.js":[function(require,module,exports){
(function (global){
'use strict';

var csjs = require('csjs');
var insertCss = require('insert-css');

function csjsInserter() {
  var args = Array.prototype.slice.call(arguments);
  var result = csjs.apply(null, args);
  if (global.document) {
    insertCss(csjs.getCss(result));
  }
  return result;
}

module.exports = csjsInserter;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"csjs":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/index.js","insert-css":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/insert-css/index.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs-inject/get-css.js":[function(require,module,exports){
'use strict';

module.exports = require('csjs/get-css');

},{"csjs/get-css":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/get-css.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs-inject/index.js":[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs;
module.exports.csjs = csjs;
module.exports.getCss = require('./get-css');

},{"./csjs":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs-inject/csjs.js","./get-css":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs-inject/get-css.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/csjs.js":[function(require,module,exports){
'use strict';

module.exports = require('./lib/csjs');

},{"./lib/csjs":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/csjs.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/get-css.js":[function(require,module,exports){
'use strict';

module.exports = require('./lib/get-css');

},{"./lib/get-css":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/get-css.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/index.js":[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs();
module.exports.csjs = csjs;
module.exports.noScope = csjs({ noscope: true });
module.exports.getCss = require('./get-css');

},{"./csjs":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/csjs.js","./get-css":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/get-css.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/base62-encode.js":[function(require,module,exports){
'use strict';

/**
 * base62 encode implementation based on base62 module:
 * https://github.com/andrew/base62.js
 */

var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function encode(integer) {
  if (integer === 0) {
    return '0';
  }
  var str = '';
  while (integer > 0) {
    str = CHARS[integer % 62] + str;
    integer = Math.floor(integer / 62);
  }
  return str;
};

},{}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/build-exports.js":[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

module.exports = function createExports(classes, keyframes, compositions) {
  var keyframesObj = Object.keys(keyframes).reduce(function(acc, key) {
    var val = keyframes[key];
    acc[val] = makeComposition([key], [val], true);
    return acc;
  }, {});

  var exports = Object.keys(classes).reduce(function(acc, key) {
    var val = classes[key];
    var composition = compositions[key];
    var extended = composition ? getClassChain(composition) : [];
    var allClasses = [key].concat(extended);
    var unscoped = allClasses.map(function(name) {
      return classes[name] ? classes[name] : name;
    });
    acc[val] = makeComposition(allClasses, unscoped);
    return acc;
  }, keyframesObj);

  return exports;
}

function getClassChain(obj) {
  var visited = {}, acc = [];

  function traverse(obj) {
    return Object.keys(obj).forEach(function(key) {
      if (!visited[key]) {
        visited[key] = true;
        acc.push(key);
        traverse(obj[key]);
      }
    });
  }

  traverse(obj);
  return acc;
}

},{"./composition":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/composition.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/composition.js":[function(require,module,exports){
'use strict';

module.exports = {
  makeComposition: makeComposition,
  isComposition: isComposition,
  ignoreComposition: ignoreComposition
};

/**
 * Returns an immutable composition object containing the given class names
 * @param  {array} classNames - The input array of class names
 * @return {Composition}      - An immutable object that holds multiple
 *                              representations of the class composition
 */
function makeComposition(classNames, unscoped, isAnimation) {
  var classString = classNames.join(' ');
  return Object.create(Composition.prototype, {
    classNames: { // the original array of class names
      value: Object.freeze(classNames),
      configurable: false,
      writable: false,
      enumerable: true
    },
    unscoped: { // the original array of class names
      value: Object.freeze(unscoped),
      configurable: false,
      writable: false,
      enumerable: true
    },
    className: { // space-separated class string for use in HTML
      value: classString,
      configurable: false,
      writable: false,
      enumerable: true
    },
    selector: { // comma-separated, period-prefixed string for use in CSS
      value: classNames.map(function(name) {
        return isAnimation ? name : '.' + name;
      }).join(', '),
      configurable: false,
      writable: false,
      enumerable: true
    },
    toString: { // toString() method, returns class string for use in HTML
      value: function() {
        return classString;
      },
      configurable: false,
      writeable: false,
      enumerable: false
    }
  });
}

/**
 * Returns whether the input value is a Composition
 * @param value      - value to check
 * @return {boolean} - whether value is a Composition or not
 */
function isComposition(value) {
  return value instanceof Composition;
}

function ignoreComposition(values) {
  return values.reduce(function(acc, val) {
    if (isComposition(val)) {
      val.classNames.forEach(function(name, i) {
        acc[name] = val.unscoped[i];
      });
    }
    return acc;
  }, {});
}

/**
 * Private constructor for use in `instanceof` checks
 */
function Composition() {}

},{}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/csjs.js":[function(require,module,exports){
'use strict';

var extractExtends = require('./css-extract-extends');
var composition = require('./composition');
var isComposition = composition.isComposition;
var ignoreComposition = composition.ignoreComposition;
var buildExports = require('./build-exports');
var scopify = require('./scopeify');
var cssKey = require('./css-key');
var extractExports = require('./extract-exports');

module.exports = function csjsTemplate(opts) {
  opts = (typeof opts === 'undefined') ? {} : opts;
  var noscope = (typeof opts.noscope === 'undefined') ? false : opts.noscope;

  return function csjsHandler(strings, values) {
    // Fast path to prevent arguments deopt
    var values = Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }
    var css = joiner(strings, values.map(selectorize));
    var ignores = ignoreComposition(values);

    var scope = noscope ? extractExports(css) : scopify(css, ignores);
    var extracted = extractExtends(scope.css);
    var localClasses = without(scope.classes, ignores);
    var localKeyframes = without(scope.keyframes, ignores);
    var compositions = extracted.compositions;

    var exports = buildExports(localClasses, localKeyframes, compositions);

    return Object.defineProperty(exports, cssKey, {
      enumerable: false,
      configurable: false,
      writeable: false,
      value: extracted.css
    });
  }
}

/**
 * Replaces class compositions with comma seperated class selectors
 * @param  value - the potential class composition
 * @return       - the original value or the selectorized class composition
 */
function selectorize(value) {
  return isComposition(value) ? value.selector : value;
}

/**
 * Joins template string literals and values
 * @param  {array} strings - array of strings
 * @param  {array} values  - array of values
 * @return {string}        - strings and values joined
 */
function joiner(strings, values) {
  return strings.map(function(str, i) {
    return (i !== values.length) ? str + values[i] : str;
  }).join('');
}

/**
 * Returns first object without keys of second
 * @param  {object} obj      - source object
 * @param  {object} unwanted - object with unwanted keys
 * @return {object}          - first object without unwanted keys
 */
function without(obj, unwanted) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (!unwanted[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

},{"./build-exports":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/build-exports.js","./composition":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/composition.js","./css-extract-extends":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/css-extract-extends.js","./css-key":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/css-key.js","./extract-exports":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/extract-exports.js","./scopeify":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/scopeify.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/css-extract-extends.js":[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

var regex = /\.([^\s]+)(\s+)(extends\s+)(\.[^{]+)/g;

module.exports = function extractExtends(css) {
  var found, matches = [];
  while (found = regex.exec(css)) {
    matches.unshift(found);
  }

  function extractCompositions(acc, match) {
    var extendee = getClassName(match[1]);
    var keyword = match[3];
    var extended = match[4];

    // remove from output css
    var index = match.index + match[1].length + match[2].length;
    var len = keyword.length + extended.length;
    acc.css = acc.css.slice(0, index) + " " + acc.css.slice(index + len + 1);

    var extendedClasses = splitter(extended);

    extendedClasses.forEach(function(className) {
      if (!acc.compositions[extendee]) {
        acc.compositions[extendee] = {};
      }
      if (!acc.compositions[className]) {
        acc.compositions[className] = {};
      }
      acc.compositions[extendee][className] = acc.compositions[className];
    });
    return acc;
  }

  return matches.reduce(extractCompositions, {
    css: css,
    compositions: {}
  });

};

function splitter(match) {
  return match.split(',').map(getClassName);
}

function getClassName(str) {
  var trimmed = str.trim();
  return trimmed[0] === '.' ? trimmed.substr(1) : trimmed;
}

},{"./composition":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/composition.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/css-key.js":[function(require,module,exports){
'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';

},{}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/extract-exports.js":[function(require,module,exports){
'use strict';

var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = extractExports;

function extractExports(css) {
  return {
    css: css,
    keyframes: getExport(css, keyframesRegex),
    classes: getExport(css, classRegex)
  };
}

function getExport(css, regex) {
  var prop = {};
  var match;
  while((match = regex.exec(css)) !== null) {
    var name = match[2];
    prop[name] = name;
  }
  return prop;
}

},{"./regex":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/regex.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/get-css.js":[function(require,module,exports){
'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};

},{"./css-key":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/css-key.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/hash-string.js":[function(require,module,exports){
'use strict';

/**
 * djb2 string hash implementation based on string-hash module:
 * https://github.com/darkskyapp/string-hash
 */

module.exports = function hashStr(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0;
};

},{}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/regex.js":[function(require,module,exports){
'use strict';

var findClasses = /(\.)(?!\d)([^\s\.,{\[>+~#:)]*)(?![^{]*})/.source;
var findKeyframes = /(@\S*keyframes\s*)([^{\s]*)/.source;
var ignoreComments = /(?!(?:[^*/]|\*[^/]|\/[^*])*\*+\/)/.source;

var classRegex = new RegExp(findClasses + ignoreComments, 'g');
var keyframesRegex = new RegExp(findKeyframes + ignoreComments, 'g');

module.exports = {
  classRegex: classRegex,
  keyframesRegex: keyframesRegex,
  ignoreComments: ignoreComments,
};

},{}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/replace-animations.js":[function(require,module,exports){
var ignoreComments = require('./regex').ignoreComments;

module.exports = replaceAnimations;

function replaceAnimations(result) {
  var animations = Object.keys(result.keyframes).reduce(function(acc, key) {
    acc[result.keyframes[key]] = key;
    return acc;
  }, {});
  var unscoped = Object.keys(animations);

  if (unscoped.length) {
    var regexStr = '((?:animation|animation-name)\\s*:[^};]*)('
      + unscoped.join('|') + ')([;\\s])' + ignoreComments;
    var regex = new RegExp(regexStr, 'g');

    var replaced = result.css.replace(regex, function(match, preamble, name, ending) {
      return preamble + animations[name] + ending;
    });

    return {
      css: replaced,
      keyframes: result.keyframes,
      classes: result.classes
    }
  }

  return result;
}

},{"./regex":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/regex.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/scoped-name.js":[function(require,module,exports){
'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};

},{"./base62-encode":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/base62-encode.js","./hash-string":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/hash-string.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/scopeify.js":[function(require,module,exports){
'use strict';

var fileScoper = require('./scoped-name');
var replaceAnimations = require('./replace-animations');
var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = scopify;

function scopify(css, ignores) {
  var makeScopedName = fileScoper(css);
  var replacers = {
    classes: classRegex,
    keyframes: keyframesRegex
  };

  function scopeCss(result, key) {
    var replacer = replacers[key];
    function replaceFn(fullMatch, prefix, name) {
      var scopedName = ignores[name] ? name : makeScopedName(name);
      result[key][scopedName] = name;
      return prefix + scopedName;
    }
    return {
      css: result.css.replace(replacer, replaceFn),
      keyframes: result.keyframes,
      classes: result.classes
    };
  }

  var result = Object.keys(replacers).reduce(scopeCss, {
    css: css,
    keyframes: {},
    classes: {}
  });

  return replaceAnimations(result);
}

},{"./regex":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/regex.js","./replace-animations":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/replace-animations.js","./scoped-name":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs/lib/scoped-name.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/global/document.js":[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/browser-resolve/empty.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/global/window.js":[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/hyperscript-attribute-to-property/index.js":[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/hyperx/index.js":[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/hyperscript-attribute-to-property/index.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/insert-css/index.js":[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/on-load/index.js":[function(require,module,exports){
/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var watch = Object.create(null)
var KEY_ID = 'onloadid' + (new Date() % 9e6).toString(36)
var KEY_ATTR = 'data-' + KEY_ID
var INDEX = 0

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    if (Object.keys(watch).length < 1) return
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === KEY_ATTR) {
        eachAttr(mutations[i], turnon, turnoff)
        continue
      }
      eachMutation(mutations[i].removedNodes, function (index, el) {
        if (!document.documentElement.contains(el)) turnoff(index, el)
      })
      eachMutation(mutations[i].addedNodes, function (index, el) {
        if (document.documentElement.contains(el)) turnon(index, el)
      })
    }
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [KEY_ATTR]
  })
}

module.exports = function onload (el, on, off, caller) {
  on = on || function () {}
  off = off || function () {}
  el.setAttribute(KEY_ATTR, 'o' + INDEX)
  watch['o' + INDEX] = [on, off, 0, caller || onload.caller]
  INDEX += 1
  return el
}

module.exports.KEY_ATTR = KEY_ATTR
module.exports.KEY_ID = KEY_ID

function turnon (index, el) {
  if (watch[index][0] && watch[index][2] === 0) {
    watch[index][0](el)
    watch[index][2] = 1
  }
}

function turnoff (index, el) {
  if (watch[index][1] && watch[index][2] === 1) {
    watch[index][1](el)
    watch[index][2] = 0
  }
}

function eachAttr (mutation, on, off) {
  var newValue = mutation.target.getAttribute(KEY_ATTR)
  if (sameOrigin(mutation.oldValue, newValue)) {
    watch[newValue] = watch[mutation.oldValue]
    return
  }
  if (watch[mutation.oldValue]) {
    off(mutation.oldValue, mutation.target)
  }
  if (watch[newValue]) {
    on(newValue, mutation.target)
  }
}

function sameOrigin (oldValue, newValue) {
  if (!oldValue || !newValue) return false
  return watch[oldValue][3] === watch[newValue][3]
}

function eachMutation (nodes, fn) {
  var keys = Object.keys(watch)
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute(KEY_ATTR)) {
      var onloadid = nodes[i].getAttribute(KEY_ATTR)
      keys.forEach(function (k) {
        if (onloadid === k) {
          fn(k, nodes[i])
        }
      })
    }
    if (nodes[i] && nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

},{"global/document":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/global/document.js","global/window":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/global/window.js"}],"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/src/twm.js":[function(require,module,exports){
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
        min-width: ${width - (2 * margin)}px;
        max-width: ${width - (2 * margin)}px;
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

},{"bel":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/bel/browser.js","csjs-inject":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/csjs-inject/index.js","on-load":"/home/serapath/Desktop/dev/code/@ui-components/repo/twm/node_modules/on-load/index.js"}]},{},["/home/serapath/Desktop/dev/code/@ui-components/repo/twm/demo/demo.js"]);
