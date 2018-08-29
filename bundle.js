(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{"./appendChild":1,"hyperx":23}],3:[function(require,module,exports){
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
},{"csjs":8,"insert-css":24}],4:[function(require,module,exports){
'use strict';

module.exports = require('csjs/get-css');

},{"csjs/get-css":7}],5:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs;
module.exports.csjs = csjs;
module.exports.getCss = require('./get-css');

},{"./csjs":3,"./get-css":4}],6:[function(require,module,exports){
'use strict';

module.exports = require('./lib/csjs');

},{"./lib/csjs":12}],7:[function(require,module,exports){
'use strict';

module.exports = require('./lib/get-css');

},{"./lib/get-css":16}],8:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs();
module.exports.csjs = csjs;
module.exports.noScope = csjs({ noscope: true });
module.exports.getCss = require('./get-css');

},{"./csjs":6,"./get-css":7}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./composition":11}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./build-exports":10,"./composition":11,"./css-extract-extends":13,"./css-key":14,"./extract-exports":15,"./scopeify":21}],13:[function(require,module,exports){
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

},{"./composition":11}],14:[function(require,module,exports){
'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';

},{}],15:[function(require,module,exports){
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

},{"./regex":18}],16:[function(require,module,exports){
'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};

},{"./css-key":14}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"./regex":18}],20:[function(require,module,exports){
'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};

},{"./base62-encode":9,"./hash-string":17}],21:[function(require,module,exports){
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

},{"./regex":18,"./replace-animations":19,"./scoped-name":20}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{"hyperscript-attribute-to-property":22}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
var bel = require('bel')
var csjs = require('csjs-inject')

module.exports = displayAddressInput

function displayAddressInput({theme: {classes: css}, type}) {
  return bel`
      <div class=${css.addressField}>
        <div class=${css.keyField}><i class="${css.icon} fa fa-key"></i></div>
        <input class=${css.inputField} placeholder='0x6e2...'>
      </div>`
}

},{"bel":2,"csjs-inject":5}],26:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],27:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./appendChild":26,"dup":2,"hyperx":48}],28:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"csjs":33,"dup":3,"insert-css":51}],29:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"csjs/get-css":32,"dup":4}],30:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./csjs":28,"./get-css":29,"dup":5}],31:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./lib/csjs":37,"dup":6}],32:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"./lib/get-css":41,"dup":7}],33:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./csjs":31,"./get-css":32,"dup":8}],34:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],35:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"./composition":36,"dup":10}],36:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],37:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./build-exports":35,"./composition":36,"./css-extract-extends":38,"./css-key":39,"./extract-exports":40,"./scopeify":46,"dup":12}],38:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"./composition":36,"dup":13}],39:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14}],40:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"./regex":43,"dup":15}],41:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./css-key":39,"dup":16}],42:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],43:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],44:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"./regex":43,"dup":19}],45:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"./base62-encode":34,"./hash-string":42,"dup":20}],46:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"./regex":43,"./replace-animations":44,"./scoped-name":45,"dup":21}],47:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],48:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23,"hyperscript-attribute-to-property":47}],49:[function(require,module,exports){
var bel = require('bel')
var csjs = require('csjs-inject')

module.exports = displayBooleanInput

function displayBooleanInput({theme: {classes: css, colors}, type}) {
  var boolFalse = bel `<div class=${css.false} onclick=${e=>toggle(e)}>false</div>`
  var boolTrue = bel `<div class=${css.true} onclick=${e=>toggle(e)}>true</div>`

  return bel`
    <div class=${css.booleanField}>
      ${boolFalse}
      ${boolTrue}
    </div>
  `

  function toggle (e) {
    if (e.target.innerHTML === 'true') {
      boolFalse.style.color = colors.slateGrey
      boolFalse.style.backgroundColor = colors.dark
      boolTrue.style.color = colors.dark
      boolTrue.style.backgroundColor = colors.aquaMarine

    } else if (e.target.innerHTML === 'false') {
      boolTrue.style.color = colors.slateGrey
      boolTrue.style.backgroundColor = colors.dark
      boolFalse.style.color = colors.dark
      boolFalse.style.backgroundColor = colors.violetRed
    }
  }
}

},{"bel":27,"csjs-inject":30}],50:[function(require,module,exports){
var bel = require('bel')
var csjs = require('csjs-inject')

module.exports = displayStringInput

function displayStringInput({theme: {classes: css}, type}) {
  return bel`
    <div class=${css.stringField}>
      <input class=${css.inputField} placeholder='abc'>
    </div>`
}

},{"bel":27,"csjs-inject":30}],51:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],52:[function(require,module,exports){
var bel = require('bel')
var csjs = require('csjs-inject')
var inputAddress = require("input-address")
var inputInteger = require("input-integer")
var inputBoolean = require("input-boolean")
var inputString = require("input-string")


module.exports = displayArrayInput

function displayArrayInput({theme, type}) {
  var css = theme.classes
  return bel`${displayRightType(theme, type)}`
}

function displayRightType (theme, type) {
  var css = theme.classes
  var col = theme.colors
  var container = bel`<div class=${css.arrayContainer}></div>`
  var arr = getParsedArray(type) // uint8[2][3][] returns  ['', 3, 2]
  var background = [
    col.white,
    col.turquoise,
    col.lavenderGrey,
    col.violetRed,
    col.aquaMarine
  ]
  var count = 0
  next({ container, arr })
  return container


  function next ({ container, arr }) {
    var len = arr.shift()
    if (len === '') {
      len = 1
      container.appendChild(plusminus({ container, arr }))
    }
    for (var i = 0; i < len; i++) append({ container, arr: [...arr] })
  }

  function append ({ container, arr }) {
    if (arr.length) { // recursive step
      var innerContainer = bel`<div class="${css.arrayContainer}"></div>`
      container.appendChild(innerContainer)
      next({ container: innerContainer, arr })
    } else { // final step (stop recursion)
      container.appendChild(returnInputFields(theme, type))
    }
  }

  function plusminus ({ container, arr }) {
    var css = theme.classes
    return bel`<div class=${css.arrayPlusMinus}>
        <i class="${css.arrayMinus} fa fa-minus" onclick=${e=>removeLast(container)}></i>
        <i class="${css.arrayPlus} fa fa-plus" onclick=${e=>append({ container, arr: [...arr] })}></i>
      </div>`
  }

  function removeLast (node) {
    if (node.children.length > 2) node.removeChild(node.lastChild)
  }

}

function returnInputFields (theme, type) {
  if (type.includes("int")) return inputInteger({ theme, type })
  else if (type.includes("byte")) return inputString({ theme, type })
  else if (type.includes("string")) return inputString({ theme, type })
  else if (type.includes("bool")) return inputBoolean({ theme, type })
  else if (type.includes("fixed")) return inputInteger({ theme, type })
  else if (type.includes("address")) return inputAddress({ theme, type })
}

function getParsedArray (type) {
  var arr = []
  var i = type.search(/\[/) // find where array starts (bool[2][])
  var basicType = type.split('[')[0] // split to get basic type (bool, uint8)
  var suffix = type.slice(i) // slice to get the remaining part = suffix ([2][][][])
  suffix.split('][').forEach((x, i)=>{
    if (x.search(/\d/) != -1) { arr.push(x.charAt(x.search(/\d/))) }  // if digit is present, push the digit
    else { arr.push('') } // if no, push empty string
  })
  arr = arr.reverse()
  return arr
}

},{"bel":27,"csjs-inject":30,"input-address":25,"input-boolean":49,"input-integer":102,"input-string":50}],53:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],54:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./appendChild":53,"dup":2,"hyperx":75}],55:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"csjs":60,"dup":3,"insert-css":76}],56:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"csjs/get-css":59,"dup":4}],57:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./csjs":55,"./get-css":56,"dup":5}],58:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./lib/csjs":64,"dup":6}],59:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"./lib/get-css":68,"dup":7}],60:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./csjs":58,"./get-css":59,"dup":8}],61:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],62:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"./composition":63,"dup":10}],63:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],64:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./build-exports":62,"./composition":63,"./css-extract-extends":65,"./css-key":66,"./extract-exports":67,"./scopeify":73,"dup":12}],65:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"./composition":63,"dup":13}],66:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14}],67:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"./regex":70,"dup":15}],68:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./css-key":66,"dup":16}],69:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],70:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],71:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"./regex":70,"dup":19}],72:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"./base62-encode":61,"./hash-string":69,"dup":20}],73:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"./regex":70,"./replace-animations":71,"./scoped-name":72,"dup":21}],74:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],75:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23,"hyperscript-attribute-to-property":74}],76:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],77:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"bel":54,"csjs-inject":57,"dup":49}],78:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],79:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./appendChild":78,"dup":2,"hyperx":100}],80:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"csjs":85,"dup":3,"insert-css":101}],81:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"csjs/get-css":84,"dup":4}],82:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./csjs":80,"./get-css":81,"dup":5}],83:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./lib/csjs":89,"dup":6}],84:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"./lib/get-css":93,"dup":7}],85:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./csjs":83,"./get-css":84,"dup":8}],86:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],87:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"./composition":88,"dup":10}],88:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],89:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./build-exports":87,"./composition":88,"./css-extract-extends":90,"./css-key":91,"./extract-exports":92,"./scopeify":98,"dup":12}],90:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"./composition":88,"dup":13}],91:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14}],92:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"./regex":95,"dup":15}],93:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./css-key":91,"dup":16}],94:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],95:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],96:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"./regex":95,"dup":19}],97:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"./base62-encode":86,"./hash-string":94,"dup":20}],98:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"./regex":95,"./replace-animations":96,"./scoped-name":97,"dup":21}],99:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],100:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23,"hyperscript-attribute-to-property":99}],101:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],102:[function(require,module,exports){
var bel = require('bel')
var csjs = require('csjs-inject')
var validateInput = require('validate-input')

module.exports = displayIntegerInput

/* ---------------------

----------------------- */

function displayIntegerInput({theme: {classes: css}, type}) {
  var num = bel`<input class=${css.integerValue} min="" max="" value="50" oninput=${(e)=>sliderUpdate(e)} onkeydown=${(e)=>keysUpdating(e)}>`
  var slider = bel`<input class=${css.integerSlider} type="range" min="" max="" value="50" step="1" oninput=${(e)=>numUpdate(e)}>`
  var type = intOrUint(type)

  return bel`
    <div class=${css.integerField}>
      ${slider}
      ${num}
    </div>
  `
  function numUpdate (e) {
    num.value = e.target.value;
  }

  function keysUpdating (e) {
    var key = e.which
    var val = parseInt(e.target.value)
    if (key === 38 && val != slider.max) {
      slider.value = num.value = val + 1
    }
    else if (key === 40 && val != slider.min) {
      slider.value = num.value = val - 1
    }
  }

  function sliderUpdate (e) {
    if (e.target.value === '') {
      slider.value = num.value = 0
    } else {
      slider.value = e.target.value
    }
  }

  function intOrUint (t) {
    var type = t.search(/\bint/) != -1 ? 'int' : 'uint'
    if (type === 'int') {
      slider.min = num.min = -100
      slider.max = num.max = 100
    }
    else if (type === 'uint') {
      slider.min = num.min = 0
      slider.max = num.max = 100
    }
  }

}

},{"bel":79,"csjs-inject":82,"validate-input":103}],103:[function(require,module,exports){
module.exports = validateInput

function validateInput ({ type, e }) {
  var value
  if (type === 'int') {
    if (value != parseInt(value, 10)) { alert('Value has to be an integer') }
  }
  else if (type === 'uint') {
    value = e.target.value
    if (value < 0) { alert('Value can not be less than 0') }
    if (value != parseInt(value, 10)) { alert('Value has to be an integer') }
  }
}

},{}],104:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],105:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./appendChild":104,"dup":2,"hyperx":126}],106:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"csjs":111,"dup":3,"insert-css":127}],107:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"csjs/get-css":110,"dup":4}],108:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./csjs":106,"./get-css":107,"dup":5}],109:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./lib/csjs":115,"dup":6}],110:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"./lib/get-css":119,"dup":7}],111:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./csjs":109,"./get-css":110,"dup":8}],112:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],113:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"./composition":114,"dup":10}],114:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],115:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./build-exports":113,"./composition":114,"./css-extract-extends":116,"./css-key":117,"./extract-exports":118,"./scopeify":124,"dup":12}],116:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"./composition":114,"dup":13}],117:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14}],118:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"./regex":121,"dup":15}],119:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./css-key":117,"dup":16}],120:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],121:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],122:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"./regex":121,"dup":19}],123:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"./base62-encode":112,"./hash-string":120,"dup":20}],124:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"./regex":121,"./replace-animations":122,"./scoped-name":123,"dup":21}],125:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],126:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23,"hyperscript-attribute-to-property":125}],127:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],128:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"bel":105,"csjs-inject":108,"dup":50}],129:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],130:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./appendChild":129,"dup":2,"hyperx":151}],131:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"csjs":136,"dup":3,"insert-css":152}],132:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"csjs/get-css":135,"dup":4}],133:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./csjs":131,"./get-css":132,"dup":5}],134:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./lib/csjs":140,"dup":6}],135:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"./lib/get-css":144,"dup":7}],136:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./csjs":134,"./get-css":135,"dup":8}],137:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],138:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"./composition":139,"dup":10}],139:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],140:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./build-exports":138,"./composition":139,"./css-extract-extends":141,"./css-key":142,"./extract-exports":143,"./scopeify":149,"dup":12}],141:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"./composition":139,"dup":13}],142:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14}],143:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"./regex":146,"dup":15}],144:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./css-key":142,"dup":16}],145:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],146:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],147:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"./regex":146,"dup":19}],148:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"./base62-encode":137,"./hash-string":145,"dup":20}],149:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"./regex":146,"./replace-animations":147,"./scoped-name":148,"dup":21}],150:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],151:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23,"hyperscript-attribute-to-property":150}],152:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],153:[function(require,module,exports){
var inputAddress = require("input-address")
var inputArray = require("input-array")
var inputInteger = require("input-integer")
var inputBoolean = require("input-boolean")
var inputString = require("input-string")
var inputContainer = require("input-container")

module.exports = checkInputType

function checkInputType ({ name, theme, type }) {
  var field
  if ((type.search(/\buint/) != -1) || (type.search(/\bint/) != -1)) field = inputInteger({ theme, type })
  if (type.search(/\bbyte/) != -1) field = inputString({ theme, type })
  if (type.search(/\bstring/) != -1) field = inputString({ theme, type })
  if (type.search(/\bfixed/) != -1) field = inputInteger({ theme, type })
  if (type.search(/\bbool/) != -1) field = inputBoolean({ theme, type })
  if (type.search(/\baddress/) != -1) field = inputAddress({ theme, type })
  return inputContainer({ name, theme, type, field })
}


// boolean, int/uint, fixed/ufixed, address, string, byte/bytes, enum, hash 

},{"input-address":25,"input-array":52,"input-boolean":77,"input-container":154,"input-integer":102,"input-string":128}],154:[function(require,module,exports){
var inputArray = require("input-array")
var bel = require('bel')

module.exports = inputContainer

function inputContainer ({ name, theme, type, field }) {
  var input
  if ((type.search(/\]/) != -1)) {
    var arrayInfo = type.split('[')[1]
    var digit = arrayInfo.search(/\d/)
    input = inputArray({ theme, type })
    return template({ name, theme, type, input})
  } else {
    input = field
    return template({ name, theme, type, input})
  }
}

function template({name, theme: {classes: css}, type, input}) {
  return bel`
    <div class=${css.inputContainer}>
      <div class=${css.inputParam}>${name || 'key'} (${type})</div>
      <div class=${css.inputFields}>${input}</div>
    </div>`
}

},{"bel":130,"input-array":52}],155:[function(require,module,exports){
module.exports=[{
  compiler: { version: "0.4.24+commit.e67f0147" },
  language: "Solidity",
  output: {
    abi: [
      {
        constant: false,
        inputs: [{ name: "data", type: "bytes" }],
        name: "byteArrays",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [],
        name: "clear",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "size", type: "uint256" }],
        name: "createMemoryArray",
        outputs: [{ name: "", type: "bytes" }],
        payable: false,
        stateMutability: "pure",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "index", type: "uint256" },
          { name: "flagA", type: "bool" },
          { name: "flagB", type: "bool" }
        ],
        name: "setFlagPair",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "flag", type: "bool[2]" }],
        name: "addFlag",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "newPairs", type: "bool[2][]" }],
        name: "setAllFlagPairs",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "newSize", type: "uint256" }],
        name: "changeFlagArraySize",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    devdoc: { methods: {} },
    userdoc: { methods: {} }
  },
  settings: {
    compilationTarget: { "browser/Untitled.sol": "ArrayContract" },
    evmVersion: "byzantium",
    libraries: {},
    optimizer: { enabled: false, runs: 200 },
    remappings: []
  },
  sources: {
    "browser/Untitled.sol": {
      keccak256:
        "0x16d1586ab97ab12aa92899517fa9c5f3fa5f459e86b6251ea9c5fa5a3b9c91aa",
      urls: [
        "bzzr://8bc07a7f3f0c8ddc4ca4daef71fd74eea482ad1b0ce4c25b82c50754fe0cb993"
      ]
    }
  },
  version: 1
},
{"compiler":{"version":"0.4.24+commit.e67f0147"},"language":"Solidity","output":{"abi":[{"constant":true,"inputs":[],"name":"topBidder","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"auctionClose","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"topBid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"beneficiaryAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_biddingTime","type":"uint256"},{"name":"_beneficiary","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bidder","type":"address"},{"indexed":false,"name":"bidAmount","type":"uint256"}],"name":"topBidIncreased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winner","type":"address"},{"indexed":false,"name":"bidAmount","type":"uint256"}],"name":"auctionResult","type":"event"}],"devdoc":{"methods":{}},"userdoc":{"methods":{"auctionClose()":{"notice":"Auction ends and highest bid is sent to the beneficiary."},"bid()":{"notice":"You may bid on the auction with the value sent along with this transaction. The value may only be refunded if the auction was not won."},"withdraw()":{"notice":"Withdraw a bid that was overbid."}}}},"settings":{"compilationTarget":{"browser/new.sol":"SimpleAuction"},"evmVersion":"byzantium","libraries":{},"optimizer":{"enabled":false,"runs":200},"remappings":[]},"sources":{"browser/new.sol":{"keccak256":"0xce815b13911e2b0466a1a45b9a0464d341f789ff31f2cb0574d91814b42868fc","urls":["bzzr://924b3a45537858a5b74790fa87507c90f348fdd339a4096772778322b48176d6"]}},"version":1},

{"compiler":{"version":"0.4.12-nightly.2017.5.4+commit.025b32d9"},"language":"Solidity","output":{"abi":[{"constant":false,"inputs":[],"name":"purchaseConfirm","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"sellerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"buyerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"abortPurchase","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"purchaseValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"receivedConfirm","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"purchasestate","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"inputs":[],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[],"name":"abortedPurchase","type":"event"},{"anonymous":false,"inputs":[],"name":"confirmedPurchase","type":"event"},{"anonymous":false,"inputs":[],"name":"receivedItem","type":"event"}],"devdoc":{"methods":{}},"userdoc":{"methods":{"abortPurchase()":{"notice":"Purchase is aborted and ether is reclaimed. May only be called by the seller before locking the contract."},"purchaseConfirm()":{"notice":"The purchase confirmed as a buyer. Transaction includes <code data-enlighter-language=\"generic\" class=\"EnlighterJSRAW\">2 * purchaseValue</code> ether. The ether is locked until receivedConfirm is called."},"receivedConfirm()":{"notice":"Confirm that you (the buyerAddress) received the item. This will release the locked ether."}}}},"settings":{"compilationTarget":{"browser/new.sol":"Purchase"},"libraries":{},"optimizer":{"enabled":false,"runs":200},"remappings":[]},"sources":{"browser/new.sol":{"keccak256":"0xd9fe3eb2b4db9728dc6e7930f5aaf9435df43e3bb18eb172da7d77fca9c9428a","urls":["bzzr://309481eb13f97d3428215812f8f2e300e3d6eae15fbb61cc369ec9dfebcc48d0"]}},"version":1},

{"compiler":{"version":"0.4.25-nightly.2018.8.16+commit.a9e7ae29"},"language":"Solidity","output":{"abi":[{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}],"devdoc":{"details":"The Ownable contract has an owner address, and provides basic authorization control functions, this simplifies the implementation of \"user permissions\".","methods":{"constructor":{"details":"The Ownable constructor sets the original `owner` of the contract to the sender account."},"renounceOwnership()":{"details":"Allows the current owner to relinquish control of the contract."},"transferOwnership(address)":{"details":"Allows the current owner to transfer control of the contract to a newOwner.","params":{"_newOwner":"The address to transfer ownership to."}}},"title":"Ownable"},"userdoc":{"methods":{"renounceOwnership()":{"notice":"Renouncing to ownership will leave the contract without an owner. It will not be possible to call the functions with the `onlyOwner` modifier anymore."}}}},"settings":{"compilationTarget":{"browser/Ownable.sol":"Ownable"},"evmVersion":"byzantium","libraries":{},"optimizer":{"enabled":true,"runs":200},"remappings":[]},"sources":{"browser/Ownable.sol":{"keccak256":"0x73b445fc1bbb2a288d9a44d162ec6ea228cc02707de2148722f730cf572f5237","urls":["bzzr://82bc986fbb29e8788dc2968dccc8e6ea6762f50961ea0b7f0d0de1568d58ce7f"]}},"version":1},

{"compiler":{"version":"0.4.24+commit.e67f0147"},"language":"Solidity","output":{"abi":[{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"currBallot","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPreviousWinners","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"startRound","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"prevWinners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"closeRoundEarly","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"closeRound","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_msg","type":"string"}],"name":"log","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_win","type":"address"}],"name":"winLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_addr","type":"address"}],"name":"newBallot","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}],"devdoc":{"methods":{"allowance(address,address)":{"details":"Function to check the amount of tokens that an owner allowed to a spender.","params":{"_owner":"address The address which owns the funds.","_spender":"address The address which will spend the funds."},"return":"A uint256 specifying the amount of tokens still available for the spender."},"balanceOf(address)":{"details":"Gets the balance of the specified address.","params":{"_owner":"The address to query the the balance of."},"return":"An uint256 representing the amount owned by the passed address."},"finishMinting()":{"details":"Function to stop minting new tokens.","return":"True if the operation was successful."},"mint(address,uint256)":{"details":"Function to mint tokens","params":{"_amount":"The amount of tokens to mint.","_to":"The address that will receive the minted tokens."},"return":"A boolean that indicates if the operation was successful."},"renounceOwnership()":{"details":"Allows the current owner to relinquish control of the contract."},"totalSupply()":{"details":"Total number of tokens in existence"},"transferOwnership(address)":{"details":"Allows the current owner to transfer control of the contract to a newOwner.","params":{"_newOwner":"The address to transfer ownership to."}}}},"userdoc":{"methods":{"renounceOwnership()":{"notice":"Renouncing to ownership will leave the contract without an owner. It will not be possible to call the functions with the `onlyOwner` modifier anymore."}}}},"settings":{"compilationTarget":{"gist/AwardToken.sol":"AwardToken"},"evmVersion":"byzantium","libraries":{},"optimizer":{"enabled":false,"runs":200},"remappings":[]},"sources":{"gist/AwardToken.sol":{"keccak256":"0x73a3854a8e477290b8b69a5261bdf21487941c4374b4a83267fb38ba6e1b6d10","urls":["bzzr://e3e01005c97336bf20e994d52520014e8fc821715ec3cf10db3829f9f518bfee"]},"gist/Ballot.sol":{"keccak256":"0x61e0c249dd89ceccb617a6baa6cc13e8c70f56b935c052602a74b04b4d5c48f0","urls":["bzzr://c05e1b9a14ddce2a27cef8366812c7f1609bddbbac59b804d3d31552721d119c"]},"github/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol":{"keccak256":"0x8c5e37342d3f9636554735b684cb26921801c87c4d953c9caf5d667d4c9b9c3b","urls":["bzzr://7d388351ebfdf6c0f83e84a9a380703b164e416f3b8546b699a4c8336e753ac5"]},"github/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol":{"keccak256":"0x84c7090c27cf3657b73d9e26b6b316975fa0bd233b8169f254de0c3b3acfaefc","urls":["bzzr://b983355647976c1daa5de581a1b6a41be9c5adc17cce257b8679649db78f8a11"]},"github/OpenZeppelin/zeppelin-solidity/contracts/token/ERC20/ERC20.sol":{"keccak256":"0x673f572af0517ad91ec96c4799c2d4c3289e7d292b597bdfa1f066c7f5917189","urls":["bzzr://6404b8cb70abbf843f545f40adb716dfab6e2e5c3a63817c83f1f8bc0d122209"]},"github/OpenZeppelin/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol":{"keccak256":"0x93291d648d30d9f17ee9cd40bea4db40997e5974d0b2ecf8d4d73a643ae68b9a","urls":["bzzr://1759f5d9b9215b3f8fb454f6e296411d2d904bc18ae50ad3c354279d417fd7e0"]},"github/OpenZeppelin/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol":{"keccak256":"0x0782167ec5031df141d1efb63ed7159d0d380cdabdcd3deb1731ab88ad6090fb","urls":["bzzr://3f18b04d56e053c85baf197dfaf83d8f90eb7b02f131a9948568f66b81281cde"]}},"version":1},

{"compiler":{"version":"0.4.24+commit.e67f0147"},"language":"Solidity","output":{"abi":[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"proposals","outputs":[{"name":"description","type":"string"},{"name":"title","type":"string"},{"name":"voteCount","type":"uint256"},{"name":"targetAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"desc","type":"string"},{"name":"title","type":"string"},{"name":"targetAddr","type":"address"}],"name":"addProposal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"winningProposal","outputs":[{"name":"currLeader","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"timeOut","outputs":[{"name":"timeOver","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getProposals","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"proposal","type":"address"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"proposalsSender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finish","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"duration","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_msg","type":"string"}],"name":"log","type":"event"}],"devdoc":{"methods":{}},"userdoc":{"methods":{"vote(address)":{"notice":"Give a single vote to proposal $(toProposal)."}}}},"settings":{"compilationTarget":{"gist/Ballot.sol":"Ballot"},"evmVersion":"byzantium","libraries":{},"optimizer":{"enabled":false,"runs":200},"remappings":[]},"sources":{"gist/Ballot.sol":{"keccak256":"0x61e0c249dd89ceccb617a6baa6cc13e8c70f56b935c052602a74b04b4d5c48f0","urls":["bzzr://c05e1b9a14ddce2a27cef8366812c7f1609bddbbac59b804d3d31552721d119c"]}},"version":1}


]

},{}],156:[function(require,module,exports){
var bel = require("bel")
var csjs = require("csjs-inject")
var checkInputType = require('check-input-type')
var metadata = require('metadata.json')

var fonts = [
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  'https://fonts.googleapis.com/css?family=Overpass+Mono" rel="stylesheet'
]
var fontAwesome = bel`<link href=${fonts[0]} rel='stylesheet' type='text/css'>`
var overpassMono = bel`<link href=${fonts[1]} rel='stylesheet' type='text/css'>`
document.head.appendChild(fontAwesome)
document.head.appendChild(overpassMono)

var colors = {
  white: "#ffffff", // borders, font on input background
  dark: "#202020", //background dark
  darkSmoke: '#363636',  // separators
  whiteSmoke: "#D5C5C8", // background light
  lavenderGrey: "#e3e8ee", // inputs background
  slateGrey: "#8a929b", // text
  violetRed: "#b25068",  // used as red in types (bool etc.)
  aquaMarine: "#4b9f98",  // used as green in types (bool etc.)
  turquoise: "#14b9d5",
  yellow: "#F2CD5D",
  androidGreen: "#9BC53D"
}

var css = csjs`
  .preview {
    min-width: 350px;
    font-family: 'Overpass Mono', monospace;
    background-color: ${colors.dark};
    font-size: 12px;
    color: ${colors.whiteSmoke};
  }
  .ulVisible {
    visibility: visible;
    height: 100%;
    padding: 0;
    transition-delay: 0.25s;
  }
  .ulHidden {
    visibility: hidden;
    height: 0;
    transition-delay: 0.25s;
  }
  .contractName {
    font-size: 20px;
    font-weight: bold;
    color: ${colors.whiteSmoke};
    margin: 10px 0 40px 10px;
    min-width: 200px;
    width: 30%;
  }
  .fnName {
    font-size: 16px;
    display: flex;
    color: ${colors.whiteSmoke};
    margin: 10px 5px 20px 10px;
    text-decoration: none;
  }
  .stateMutability {
    margin-left: 5px;
    color: ${colors.whiteSmoke};
    border-radius: 20px;
    border: 1px solid;
    padding: 1px;
    font-size: 9px;
    width: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .constructorFn {
    padding-top: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${colors.darkSmoke};
  }
  .title {
    display: flex;
    align-items: baseline;
    width: 300px;
  }
  .function {
    display: flex;
    flex-direction: column;
    color: ${colors.whiteSmoke};
    padding-top: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${colors.darkSmoke};
  }
  .toggleIcon {
    margin-left: 5px;
    font-size: 16px;
  }
  .title:hover {
    opacity: 0.7;
    cursor: pointer;
  }
  .inputContainer {
    font-family: 'Overpass Mono', monospace;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    font-size: 1em;
    color: ${colors.whiteSmoke};
  }
  .inputParam {
    color: ${colors.whiteSmoke};
    font-size: 1em;
    font-weight: bold;
    display: flex;
    min-width: 230px;
    padding: 10px;
  }
  .inputFields {
    display: flex;
    justify-content: center
  }
  .inputType {
    display: flex;
    justify-content: center;
  }
  .inputField {
    ${inputStyle()}
    font-size: 1em;
    color: ${colors.whiteSmoke};
    text-align: center;
    display: flex;
    width: 100%;
  }
  .inputField::placeholder {
    color: ${colors.whiteSmoke};
    text-align: center;
    opacity: 0.5;
  }
  .icon {
    color: ${colors.dark};
  }
  .integerValue {
    ${inputStyle()}
    font-size: 1em;
    color: ${colors.whiteSmoke};
    display: flex;
    text-align: center;
    width: 25%;
  }
  .integerValue::placeholder {
    color: ${colors.whiteSmoke};
    text-align: center;
    opacity: 0.5;
  }
  .integerSlider {
    width: 75%;
    border: 1px solid ${colors.darkSmoke};
    -webkit-appearance: none;
    height: 0.2px;
  }
  .integerSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 1px solid ${colors.darkSmoke};
    height: 22px;
    width: 10px;
    background: ${colors.slateGrey};
    cursor: pointer;
  }
  .integerField {
    display: flex;
    width: 300px;
    align-items: center;
  }
  .booleanField {
    display: flex;
    width: 300px;
    justify-content: center;
  }
  .stringField {
    display: flex;
    width: 300px;
    justify-content: center;
  }
  .addressField {
    display: flex;
    width: 300px;
    justify-content: center;
  }
  .keyField {
    ${inputStyle()}
    border-right: none;
    background-color: ${colors.aquaMarine}
  }
  .false {
    ${inputStyle()}
    border-right: none;
    background-color: ${colors.violetRed};
    color: ${colors.dark};
    width: 50%;
    text-align: center;
  }
  .true {
    ${inputStyle()}
    color: ${colors.whiteSmoke};
    width: 50%;
    text-align: center;
    cursor: pointer;
  }
  .arrayContainer {
    border: 1px solid ${colors.darkSmoke};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    margin-top: 10px;
  }
  .arrayInput {
    padding: 1px;
    margin: 20px;
  }
  .arrayPlusMinus {
    margin: 10px;
  }
  .arrayPlus {
    cursor: pointer;
  }
  .arrayMinus {
    cursor: pointer;
  }
`;

function inputStyle() {
  return `
    border: 1px solid ${colors.darkSmoke};
    background-color: ${colors.dark};
    padding: 5px 10px;
  `
}


var solcMetadata = metadata[5]  // 4 and 5 are AwardToken and Ballot

function getConstructorName() {
  var file = Object.keys(solcMetadata.settings.compilationTarget)[0]
  return solcMetadata.settings.compilationTarget[file]
}

function getConstructorInput() {
  return solcMetadata.output.abi.map(fn => {
    if (fn.type === "constructor") {
      return treeForm(fn.inputs)
    }
  })
}

function getContractFunctions() {
  return solcMetadata.output.abi.map(x => {
    var obj = {}
    obj.name = x.name
    obj.type = x.type
    obj.inputs = getAllInputs(x)
    obj.stateMutability = x.stateMutability
    return obj
  })
}

function getAllInputs(fn) {
  var inputs = []
  if (fn.inputs) {
    return treeForm(fn.inputs)
  }
}

function treeForm(data) {
  return data.map(x => {
    if (x.components) {
      return bel`<li><div>${x.name} (${x.type})</div><ul>${treeForm(
        x.components
      )}</ul></li>`
    }
    if (!x.components) {
      return contractUI(x)
    }
  })
}

var metadata = {
  compiler: solcMetadata.compiler.version,
  compilationTarget: solcMetadata.settings.compilationTarget,
  constructorName: getConstructorName(),
  constructorInput: getConstructorInput(),
  functions: getContractFunctions()
}

function contractUI(field) {
  var theme = { classes: css, colors}
  var name = field.name
  var type = field.type
  return checkInputType({name, theme, type})
}

/*--------------------
      PAGE
--------------------*/

function displayContractUI() {
  var html = bel`
    <div class=${css.preview}>
      <div class=${css.constructorFn}>
        <div class=${css.contractName}>${metadata.constructorName}</div>
        ${metadata.constructorInput}
      </div>
      <p>${displayFunctions()}</p>
    </div>
  `

  function displayFunctions() {
    return metadata.functions.map(fn => {
      if (fn.type === "function") {
        return bel`
        <div class=${css.function}>
          ${displayFn(fn)}
          <ul class=${css.ulVisible}>${fn.inputs}</ul>
      </div>`
      }
    })
  }

  function displayFn (fn) {
    var label = fn.stateMutability
    var fnName = bel`<a title="${label}" class=${css.fnName}>${fn.name}</a>`
    var toggleIcon = bel`<div class=${css.toggleIcon}><i class="fa fa-chevron-circle-up"></i></div>`
    var col
    if (label === 'pure') { col = colors.yellow }
    else if (label === 'view') {col = colors.androidGreen }
    else if (label === 'nonpayable') {col = colors.turquoise }
    else if (label === 'payable') {col = colors.violetRed }
    fnName.style.color = col
    toggleIcon.style.color = col
    return bel`<div class=${css.title} onclick=${e=>toggle(e)}> ${fnName}  ${toggleIcon} </div>`
  }

  function toggle (e) {
    var params = e.currentTarget.parentNode.children[1]
      var toggleContainer = e.currentTarget.children[1]
      var icon = toggleContainer.children[0]
      toggleContainer.removeChild(icon)
      if (params.className === css.ulVisible.toString()) {
        toggleContainer.appendChild(bel`<i class="fa fa-chevron-circle-down">`)
        params.classList.remove(css.ulVisible)
        params.classList.add(css.ulHidden)
      } else {
        toggleContainer.appendChild(bel`<i class="fa fa-chevron-circle-up">`)
        params.classList.remove(css.ulHidden)
        params.classList.add(css.ulVisible)
      }
  }

  document.body.appendChild(html)
}

displayContractUI()

},{"bel":130,"check-input-type":153,"csjs-inject":133,"metadata.json":155}]},{},[156]);
