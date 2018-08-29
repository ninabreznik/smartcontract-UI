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
  body {
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
  .preview {
    min-width: 350px;
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
