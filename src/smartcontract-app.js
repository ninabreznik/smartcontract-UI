var bel = require("bel")
var csjs = require("csjs-inject")
var checkInputType = require('check-input-type')
var glossary = require('glossary')

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
      font-size: 2rem;
      font-weight: bold;
      color: ${colors.whiteSmoke};
      margin: 10px 0 40px 10px;
      min-width: 200px;
      width: 30%;
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
    .function {
      display: flex;
      flex-direction: column;
      color: ${colors.whiteSmoke};
      margin-bottom: 2em;
      padding: 1em;
      border: 1px solid ${colors.whiteSmoke};
      position: relative;
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
    .toggleIcon {
      margin-left: 5px;
      font-size: 1.3rem;
    }
    .inputContainer {
      font-family: 'Overpass Mono', monospace;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
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
    .icon {
      color: ${colors.dark};
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
      background-color: ${colors.aquaMarine};
      border-color: ${colors.whiteSmoke};
    }
    .false {
      ${inputStyle()}
      border-right: none;
      background-color: ${colors.violetRed};
      color: ${colors.dark};
      width: 50%;
      text-align: center;
      border-color: ${colors.whiteSmoke};
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
      border: 1px solid ${colors.whiteSmoke};
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
/*--------------------
      PAGE
--------------------*/
module.exports = displayContractUI

function displayContractUI(opts) {
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
          return bel`<li><div>${x.name} (${x.type})</div><ul>${treeForm(x.components)}</ul></li>`
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

    var html = bel`
    <div class=${css.preview}>
    <div class=${css.constructorFn}>
    <div class=${css.contractName}>${metadata.constructorName}</div> ${metadata.constructorInput}
    </div>
    <div class=${css.functions}>${metadata.functions.map(fn => { if (fn.type === "function") return functions(fn)})}</div>
    </div>
    `

    function functions (fn) {
      var label = fn.stateMutability
      var fnName = bel`<a title="${glossary(label)}" class=${css.fnName}>${fn.name}</a>`
      var toggleIcon = bel`<div class=${css.toggleIcon}><i class="fa fa-minus-circle"></i></div>`
      var functionClass = css[label]
      return bel` <div class="${functionClass} ${css.function}">
      <div class=${css.title} onclick=${e=>toggle(e)}>${fnName}  ${toggleIcon}</div>
      <ul class=${css.ulVisible}>${fn.inputs}</ul>
      </div>`
    }

    function toggle (e) {
      var fn = e.currentTarget.parentNode
      var params = fn.children[1]
      var toggleContainer = e.currentTarget.children[1]
      var icon = toggleContainer.children[0]
      toggleContainer.removeChild(icon)
      if (params.className === css.ulVisible.toString()) {
        toggleContainer.appendChild(bel`<i class="fa fa-plus-circle">`)
        params.classList.remove(css.ulVisible)
        params.classList.add(css.ulHidden)
        // remove border and margin-bottom: 0;
        fn.style.border = 'none'
        fn.style.marginBottom = 0
      } else {
        toggleContainer.appendChild(bel`<i class="fa fa-minus-circle">`)
        params.classList.remove(css.ulHidden)
        params.classList.add(css.ulVisible)
        // add border and margin-bottom: 4em;
        console.log(fn)
        fn.style.border = `1px solid ${colors.whiteSmoke}`
        fn.style.marginBottom = '4em'
      }
    }
  } else {
    var html = bel`
    <div class=${css.preview}>
      <div class=${css.error}>
        ${opts.metadata}
      </div>
    </div>
    `
  }

  return html
}
