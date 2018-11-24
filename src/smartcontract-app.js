var bel = require("bel")
var csjs = require("csjs-inject")
var glossary = require('glossary')
var validator = require('solidity-validator')
var inputAddress = require("input-address")
var inputArray = require("input-array")
var inputInteger = require("input-integer")
var inputBoolean = require("input-boolean")
var inputString = require("input-string")

var fonts = [
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  'https://fonts.googleapis.com/css?family=Overpass+Mono'
]
var fontAwesome = bel`<link href=${fonts[0]} rel='stylesheet' type='text/css'>`
var overpassMono = bel`<link href=${fonts[1]} rel='stylesheet' type='text/css'>`
document.head.appendChild(fontAwesome)
document.head.appendChild(overpassMono)

var colors = {
  white: "#ffffff", // borders, font on input background
  dark: "#2c323c", //background dark
  darkSmoke: '#21252b',  // separators
  whiteSmoke: "#f5f5f5", // background light
  lavenderGrey: "#e3e8ee", // inputs background
  slateGrey: "#8a929b", // text
  violetRed: "#b25068",  // used as red in types (bool etc.)
  aquaMarine: "#90FCF9",  // used as green in types (bool etc.)
  turquoise: "#14b9d5",
  yellow: "#F2CD5D",
  androidGreen: "#9BC53D"
}

var css = csjs`
  @media only screen and (max-width: 3000px) {
    .preview {
      padding: 5%;
      min-width: 350px;
      height: 100%;
      font-family: 'Overpass Mono', monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: ${colors.dark};
      color: ${colors.whiteSmoke};
    }
    .error {
      border: 1px solid ${colors.violetRed};
      position: relative;
      padding: 1em;
    }
    .errorTitle {
      position: absolute;
      top: -14px;
      left: 20px;
      background-color: ${colors.dark};
      padding: 0 5px 0 5px;
      font-size: 1.3rem;
      color: ${colors.violetRed};
    }
    .errorIcon {
      font-size: 1.3rem;
    }
    .ulVisible {
      visibility: visible;
      height: 100%;
      padding: 0;
    }
    .ulHidden {
      visibility: hidden;
      height: 0;
    }
    .contractName {
      cursor: pointer;
      font-size: 2rem;
      font-weight: bold;
      color: ${colors.whiteSmoke};
      margin: 10px 0 20px 10px;
      min-width: 200px;
      width: 30%;
      display: flex;
      align-items: end;
    }
    .fnName {
      display: flex;
      margin: 10px 5px 20px 0px;
      text-decoration: none;
    }
    .stateMutability {
      margin-left: 5px;
      color: ${colors.whiteSmoke};
      border-radius: 20px;
      border: 1px solid;
      padding: 1px;
      font-size: 1rem;
      width: 65px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .constructorFn {
      padding-top: 18px;
      padding-bottom: 4em;
      width: 650px;
    }
    .functions {
      font-size: 1.3rem;
      width: 650px;
    }
    .title {
      font-size: 1.3rem;
      display: flex;
      align-items: baseline;
      position: absolute;
      top: -25px;
      left: 20px;
      background-color: ${colors.dark};
      padding: 0 5px 0 5px;
    }
    .title:hover {
      cursor: pointer;
    }
    .send {
      display: flex;
      align-items: baseline;
      bottom: -15px;
      right: 20px;
      font-size: 2rem;
      position: absolute;
      color: ${colors.darkSmoke};
      background-color: ${colors.dark};
      padding-right: 5px;
    }
    .send:hover {
      cursor: pointer;
    }
    .function {
      display: flex;
      flex-direction: column;
      color: ${colors.whiteSmoke};
      position: relative;
      margin-left: 20px;
    }
    .ctor {
      border: 3px solid ${colors.darkSmoke};
    }
    .pure {
      color: ${colors.yellow};
    }
    .view {
      color: ${colors.androidGreen};
    }
    .nonpayable {
      color: ${colors.turquoise};
    }
    .payable {
      color: ${colors.violetRed};
    }
    .icon {
      margin-left: 5px;
    }
    .output {
      font-size: 1.5rem;
      display: flex;
      align-self: flex-end;
    }
    .valError {
      color: ${colors.violetRed};
      padding-left: 20px;
      cursor: pointer;
    }
    .valSuccess {
      color: ${colors.aquaMarine};
      padding-left: 20px;
      cursor: pointer;
    }
    .inputContainer {
      font-family: 'Overpass Mono', monospace;
      margin: 15px 0 15px 0;
      display: flex;
      align-items: baseline;
      font-size: 1rem;
      color: ${colors.whiteSmoke};
    }
    .inputParam {
      color: ${colors.whiteSmoke};
      display: flex;
      justify-content: center;
      font-size: 1.1rem;
      display: flex;
      min-width: 230px;
    }
    .inputFields {
    }
    .inputType {
    }
    .inputField {
      ${inputStyle()}
      font-size: 0.9rem;
      color: ${colors.whiteSmoke};
      border-color: ${colors.whiteSmoke};
      background-color: ${colors.darkSmoke};
      text-align: center;
      display: flex;
      width: 100%;
    }
    .inputField::placeholder {
      color: ${colors.whiteSmoke};
      text-align: center;
      opacity: 0.5;
    }
    .integerValue {
      ${inputStyle()}
      font-size: 1rem;
      color: ${colors.whiteSmoke};
      background-color: ${colors.darkSmoke};
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
      border: 1px solid ${colors.whiteSmoke};
      -webkit-appearance: none;
      height: 0.2px;
    }
    .integerSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      border: 1px solid ${colors.whiteSmoke};
      height: 22px;
      width: 10px;
      background: ${colors.darkSmoke};
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
      align-items: baseline;
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
      background-color: ${colors.aquaMarine};
      border-color: ${colors.whiteSmoke};
    }
    .false {
      ${inputStyle()}
      border-right: none;
      background-color: ${colors.violetRed};
      color: ${colors.whiteSmoke};
      width: 50%;
      text-align: center;
      border-color: ${colors.whiteSmoke};
      cursor: pointer;
    }
    .true {
      ${inputStyle()}
      color: ${colors.whiteSmoke};
      border-color: ${colors.whiteSmoke};
      width: 50%;
      text-align: center;
      cursor: pointer;
    }
    .arrayContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
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
  }
  @media only screen and (max-device-width: 480px) {
    html {
      font-size: 30px;
    }
    .constructorFn, .functions {
      width: 80%;
    }
    .title {
      top: -30px;
    }
  }
`

function inputStyle() {
  return `
    border: 1px solid ${colors.whiteSmoke};
    background-color: ${colors.dark};
    padding: 5px;
  `
}

var toggleIcon = bel`<div class=${css.icon}><i class="fa fa-plus-circle"></i></div>`
/*--------------------
      PAGE
--------------------*/
module.exports = displayContractUI

function displayContractUI(opts) {
  if (!opts || !opts.metadata) {
    return  bel`
    <div class=${css.preview}>
      <div class=${css.error}>
        <div class=${css.errorTitle}>error <i class="${css.errorIcon} fa fa-exclamation-circle"></i></div>
        ${opts}
      </div>
    </div>
    `
  }

  if (!Array.isArray(opts.metadata)) {
    var solcMetadata = opts.metadata
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
        obj.outputs = getAllOutputs(x)
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

    function getAllOutputs(fn) {
      var outputs = []
      if (fn.outputs) {
        return treeForm(fn.outputs)
      }
    }

    function treeForm(data) {
      return data.map(x => {
        if (x.components) {
          return bel`<li><div>${x.name} (${x.type})</div><ul>${treeForm(x.components)}</ul></li>`
        }
        if (!x.components) {
          return generateInputContainer(x)
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

    var sorted = sort(metadata.functions)
    function sort (functions) {
      return functions.filter(x => x.type === 'function').sort((a, b) => type2num(a) - type2num(b))
      function type2num ({ stateMutability: sm }) {
        if (sm === 'view') return 1
        if (sm === 'nonpayable') return 2
        if (sm === 'pure') return 3
        if (sm === 'payable') return 4
      }
    }

    function generateInputContainer (field) {
      var theme = { classes: css, colors}
      var name = field.name
      var type = field.type
      var inputField = getInputField( {theme, type, cb})
      var inputContainer = bel`
        <div class=${css.inputContainer}>
        <div class=${css.inputParam}>${name || 'key'} (${type})</div>
        <div class=${css.inputFields}>${inputField}</div>
        <div class=${css.output}></div>
        </div>`
      return inputContainer
      function cb (msg) {
        var output = inputContainer.lastChild
        output.innerHTML = msg ? `<a class=${css.valError} title="${msg}"><i class="fa fa-exclamation-circle"></i></a>` : `<a class=${css.valSuccess} title="The value is valid."><i class="fa fa-check-circle"></i></a>`
      }
    }



    function getInputField ({ theme, type, cb}) {
      var field
      if ((type.search(/\]/) != -1)) {
        var arrayInfo = type.split('[')[1]
        var digit = arrayInfo.search(/\d/)
        field = inputArray({ theme, type, cb })
      } else {
        if ((type.search(/\buint/) != -1) || (type.search(/\bint/) != -1)) field = inputInteger({ theme, type, cb })
        if (type.search(/\bbyte/) != -1) field = inputString({ theme, type, cb })
        if (type.search(/\bstring/) != -1) field = inputString({ theme, type, cb })
        if (type.search(/\bfixed/) != -1) field = inputInteger({ theme, type, cb })
        if (type.search(/\bbool/) != -1) field = inputBoolean({ theme, type, cb })
        if (type.search(/\baddress/) != -1) field = inputAddress({ theme, type, cb })
      }
      return field
    }

    function functions (fn, toggleIcon) {
      var label = fn.stateMutability
      var fnName = bel`<a title="${glossary(label)}" class=${css.fnName}>${fn.name}</a>`
      var toggleIcon = bel`<div class=${css.icon}><i class="fa fa-plus-circle"></i></div>`
      var title = bel`<div class=${css.title} onclick=${e=>toggle(e, null, null)}>${fnName} ${toggleIcon}</div>`
      var send = bel`<div class=${css.send} onclick=${e => sendTx(e)}><i class="${css.icon} fa fa-arrow-circle-right"></i></div>`
      var functionClass = css[label]
      return bel`
      <div class="${functionClass} ${css.function}">
        ${title}
        <ul class=${css.ulHidden}>
          ${fn.inputs}
          ${send}
        </ul>
      </div>`
    }

    function sendTx (e) {
      console.log(e.target.parentNode.parentNode.children[0].children[1])
    }

    function toggleAll (e) {
      var fnContainer = e.currentTarget.parentNode.nextSibling
      var constructorToggle = e.currentTarget.children[0]
      var constructorIcon = constructorToggle.children[0]
      constructorToggle.removeChild(constructorIcon)
      var minus = bel`<i class="fa fa-minus-circle">`
      var plus = bel`<i class="fa fa-plus-circle">`
      var icon = constructorIcon.className.includes('plus') ? minus : plus
      constructorToggle.appendChild(icon)
      for (var i = 0; i < fnContainer.children.length; i++) {
        var fn = fnContainer.children[i]
        var e = fn.children[0]
        toggle(e, fn, constructorIcon)
      }
    }

    function toggle (e, fun, constructorIcon) {
      var fn
      var toggleContainer
      // TOGGLE triggered by toggleAll
      if (fun != null) {
        fn = fun
        toggleContainer = e.children[1]
        var fnInputs = fn.children[1]
        // Makes sure all functions are opened or closed before toggleAll executes
        if (constructorIcon.className.includes('plus') && fnInputs.className === css.ulVisible.toString()) {
          fnInputs.classList.remove(css.ulVisible)
          fnInputs.classList.add(css.ulHidden)
        }
        else if (constructorIcon.className.includes('minus') && fnInputs.className === css.ulHidden.toString()) {
          fnInputs.classList.remove(css.ulHidden)
          fnInputs.classList.add(css.ulVisible)
        }
      // TOGGLE triggered with onclick on function title
      } else {
        fn = e.currentTarget.parentNode
        toggleContainer = e.currentTarget.children[1]
      }
      // TOGGLE input fields in a single function
      var params = fn.children[1]
      var icon = toggleContainer.children[0]
      toggleContainer.removeChild(icon)
      if (params.className === css.ulVisible.toString()) {
        toggleContainer.appendChild(bel`<i class="fa fa-plus-circle">`)
        params.classList.remove(css.ulVisible)
        params.classList.add(css.ulHidden)
        fn.style.border = 'none'
        fn.style.marginBottom = 0
      } else {
        toggleContainer.appendChild(bel`<i class="fa fa-minus-circle">`)
        params.classList.remove(css.ulHidden)
        params.classList.add(css.ulVisible)
        fn.style.border = `3px solid ${colors.darkSmoke}`
        fn.style.marginBottom = '2em'
      }
    }

    return bel`
    <div class=${css.preview}>
    <div class=${css.constructorFn}>
      <div class=${css.contractName} onclick=${e=>toggleAll(e)}>
        ${metadata.constructorName}
        <span class=${css.icon}><i class="fa fa-plus-circle"></i></span>
      </div>
      <div class="${css.function} ${css.ctor}">
        ${metadata.constructorInput}
        <div class=${css.send}><i class="${css.icon} fa fa-arrow-circle-right"></i></div>
      </div>
    </div>
    <div class=${css.functions}>${sorted.map(fn => { return functions(fn)})}</div>
    </div>
    `

  }
}
