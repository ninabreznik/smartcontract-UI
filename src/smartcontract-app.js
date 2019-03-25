const bel = require("bel")
const csjs = require("csjs-inject")
const ethers = require('ethers')
const utils = require('ethers').utils
const bigNumber = require('bignumber.js')
const glossary = require('glossary')
const date = require('getDate')
const shortenHexData = require('shortenHexData')
const validator = require('solidity-validator')
const inputAddress = require("input-address")
const inputArray = require("input-array")
const inputInteger = require("input-integer")
const inputBoolean = require("input-boolean")
const inputString = require("input-string")
const copy = require('copy-text-to-clipboard')

// Styling variables

var fonts = [
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  'https://fonts.googleapis.com/css?family=Overpass+Mono'
]
var fontAwesome = bel`<link href=${fonts[0]} rel='stylesheet' type='text/css'>`
var overpassMono = bel`<link href=${fonts[1]} rel='stylesheet' type='text/css'>`
document.head.appendChild(fontAwesome)
document.head.appendChild(overpassMono)

var colors = {
  transparent: "transparent",
  white: "#ffffff", // borders, font on input background
  dark: "#2c323c", //background dark
  darkSmoke: '#21252b',  // separators
  whiteSmoke: "#f5f5f5", // background light
  slateGrey: "#8a929b", // text
  violetRed: "#b25068",  // used as red in types (bool etc.)
  aquaMarine: "#90FCF9",  // used as green in types (bool etc.)
  turquoise: "#14b9d5",
  yellow: "#F2CD5D",
  lavender: "#EDC9FF",
  androidGreen: "#9BC53D"
}

var css = csjs`
  @media only screen and (max-width: 3000px) {
    .preview {
      padding: 5%;
      min-width: 350px;
      min-height: 100vh;
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
      position: absolute;Deploy
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
    .visible {
      visibility: visible;
      height: 100%;
      padding: 0;
    }
    .hidden {
      visibility: hidden;
      height: 0;
    }
    .txReturn {
      border: 3px dashed ${colors.darkSmoke};
      border-top: none;
      min-width: 230px;
      top: -41px;
      left: 20px;
      min-height: 80px;
      width: 624px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .txReturnLeft, .txReturnRight {
      display: flex;
      flex-direction: column;
    }
    .txReturnItem {
      font-size: 0.7rem;
      display: flex;
      color: ${colors.whiteSmoke};
      background-color: ${colors.darkSmoke};
      width: 87%;
      margin: 5% 3%;
      padding: 3%;
      justify-content: space-between;
    }
    .returnJSON {

    }
    .txReturnField {
      display:flex;
      justify-content: flex-start;
      cursor: pointer;
    }
    .txReturnField:hover {
      opacity: 0.8;
    }
    .txReturnTitle {
      font-weight: bold;
      margin-right: 5px;
    }
    .txReturnValue {
      color: ${colors.whiteSmoke};
    }
    .txReturnValue a {
      text-decoration: none;
      color: ${colors.slateGrey};
    }
    .txReturnValue a:hover {
      opacity: 0.8;
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
    .contractName:hover {
      cursor: pointer;
      opacity: 0.9;
    }
    .fnName {
      display: flex;
      margin: 10px 5px 20px 0px;
      text-decoration: none;
      display: flex;
      align-items: center;
    }
    .fnIcon {
      margin-right: 5%;
      font-size: 1.1em;
      position: relative;
      width: 30px;
    }
    .faIcon {
      position: absolute;
      top: -15px;
      left: 0;
    }
    .name {
      font-size: 0.7em;
      margin-bottom: 5px;
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
      top: -20px;
      left: 20px;
      background-color: ${colors.dark};
      padding: 0 5px 0 5px;
    }
    .title:hover {
      cursor: pointer;
      opacity: 0.9;
    }
    .deployTitle {
      font-size: 1.3rem;
      background-color: ${colors.dark};
      padding: 0 5px 0 0;
      font-weight: 800;
    }
    .deploy {
      color: ${colors.whiteSmoke};
      display: flex;
      align-items: center;
      bottom: -16px;
      right: 20px;
      font-size: 1.8rem;
      position: absolute;
      padding: 0 5px;
      background-color: ${colors.dark};
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
      opacity: 0.9;
      cursor: pointer;
    }
    .fnContainer {
      position: relative;
    }
    .function {
      display: flex;
      flex-direction: column;
      position: relative;
      margin-left: 20px;
    }
    .ctor {
      display: flex;
      flex-direction: column;
      position: relative;
      border: 3px dashed ${colors.darkSmoke};
      padding: 20px 0;
      width: 630px;
      margin: 2em 0 0 20px;
    }
    .statsEl {
      display:flex;
      justify-content: space-between;
      cursor: pointer;
    }
    .statsEl:hover {
        opacity: 0.8;
    }
    .statsElTitle {
      margin-right: 5px;
      font-weight: bold;
    }
    .statsElValue {

    }
    .inProgress {
    }
    .deployStats {
      color: ${colors.whiteSmoke};
      display: flex;
      justify-content: left;
      flex-direction: column;
      font-size: 0.8rem;
      min-width: 230px;
      margin: 1% 5%;
    }
    .signature {}
    .date {}
    .pure {
      color: ${colors.yellow};
    }
    .view {
      color: ${colors.lavender};
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
      align-items: center;
      font-size: 1rem;
      color: ${colors.whiteSmoke};
    }
    .inputParam {
      color: ${colors.whiteSmoke};
      display: flex;
      justify-content: center;
      font-size: 0.8rem;
      display: flex;
      min-width: 230px;
    }
    .inputFields {
    }
    .inputType {
    }
    .inputField {
      ${inputStyle()}
      font-size: 0.8rem;
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

/******************************************************************************
  ETHERS
******************************************************************************/

var provider
var contract

async function getProvider() {
  if (window.ethereum) {
    try {
      // Request account access if needed
      await ethereum.enable();
      // Acccounts now exposed
      provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
    } catch (error) {
      // User denied account access...
    }
  } else {
    window.open("https://metamask.io/")
  }
  return provider
}

/*--------------------
      PAGE
--------------------*/
module.exports = displayContractUI

function displayContractUI(result) {   // compilation result metadata
  var opts = {
    metadata: {
      compiler: { version: result[0].compiler.version },
      language: result[0].compiler.language,
      output: {
        abi: result[0].abi,
        devdoc: result[0].metadata.devdoc,
        userdoc: result[0].metadata.userdoc
      },
      bytecode: result[0].binary.bytecodes.bytecode,
      settings: {
        compilationTarget: { '': result[0].sources.compilationTarget },
        evmVersion: result[0].compiler.evmVersion,
        libraries: result[0].sources.libraries,
        optimizer: { enabled: result[0].compiler.optimizer, runs: result[0].compiler.runs },
        remapings: result[0].sources.remappings
      },
      sources: { '': result[0].sources.sourcecode }
    }
}
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
          <div class=${css.inputParam} title="data type: ${type}">${name || 'key'}</div>
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

    function functions (fn) {
      var label = fn.stateMutability
      var fnIcon = ()=>{
        if (label ==='payable' || label === 'nonpayable') return bel`<div class=${css.fnIcon}><i class="fa fa-edit ${css.faIcon}"></i></div>`
        if (label ==='pure') return bel`<div class=${css.fnIcon}><i class="fa fa-cogs ${css.faIcon}"></i></div>`
        if (label ==='view') return bel`<div class=${css.fnIcon}><i class="fa fa-eye ${css.faIcon}"></i></div>`
      }
      var fnName = bel`<a title="${glossary(label)}" class=${css.fnName}>${fnIcon()}<div class=${css.name}>${fn.name}</div></a>`
      var title = bel`<div class=${css.title} onclick=${e=>toggle(e, null, null)}>${fnName}</div>`
      var send = bel`<div class=${css.send} onclick=${e => sendTx(fn.name, label, e)}><i class="${css.icon} fa fa-arrow-circle-right"></i></div>`
      var functionClass = css[label]
      return bel`
      <div class=${css.fnContainer}>
        <div class="${functionClass} ${css.function}">
          ${title}
          <ul class=${css.hidden}>
            ${fn.inputs}
            ${send}
          </ul>
        </div>
      </div>`
    }

    function getArgs(element, selector) {
      var args = []
      var inputs = element.querySelectorAll(`[class^=${selector}]`)
      inputs.forEach(x => {
        let el = x.querySelector('input')
        let val = el.value
        var argument
        if ((el.dataset.type.search(/\buint/) != -1) || (el.dataset.type.search(/\bint/) != -1) || (el.dataset.type.search(/\bfixed/) != -1)) {
          if (val.isBigNumber) {
            let number = bigNumber(Number(val)).toFixed(0)
            argument = ethers.utils.bigNumberify(number.toString())
          } else {
            argument = Number(val)
          }
        }
        if (el.dataset.type.search(/\bbyte/) != -1) argument = val
        if (el.dataset.type.search(/\bstring/) != -1) argument = val
        if (el.dataset.type.search(/\bbool/) != -1) {} // NOT INPUT FIELD, normal DIV
        if (el.dataset.type.search(/\baddress/) != -1) argument = val
        args.push(argument)
      })
      return args
    }

    async function sendTx (name, label, e) {
      let element = e.target.parentNode.parentNode.parentNode.parentNode
      let txReturn = element.querySelector("[class^='txReturn']") || bel`<div class=${css.txReturn}></div>`
      if (contract) {
        let fnName = name
        let args = getArgs(element, 'inputContainer')
        let transaction = await contract.functions[fnName](...args)
        if (label === 'payable' || label === 'nonpayable') {
          let receipt = await transaction.wait()
          let linkToEtherscan = "https://" + provider._network.name  + ".etherscan.io/tx/" + receipt.transactionHash
          txReturn.appendChild(bel`
          <div class=${css.txReturnItem}>
            <div class=${css.txReturnLeft}>
              <div class=${css.txReturnField}>
                <div class=${css.txReturnTitle}>Sent:</div>
                <div class=${css.txReturnValue}>${date}</div>
              </div>
              <div class=${css.txReturnField} onclick=${()=>copy(receipt.transactionHash)}>
                <div class=${css.txReturnTitle} title="Transaction">Transaction:</div>
                <div class=${css.txReturnValue}>${shortenHexData(receipt.transactionHash)}</div>
              </div>
              <div class=${css.txReturnField} onclick=${()=>copy(receipt.from)}>
                <div class=${css.txReturnTitle}>Signed by:</div>
                <div class=${css.txReturnValue}>${shortenHexData(receipt.from)}</div>
              </div>
            </div>
            <div class=${css.txReturnRight} onclick=${()=>copy(transaction.gasPrice._hex)}>
              <div class=${css.txReturnField}>
                <div class=${css.txReturnTitle}>Gas price:</div>
                <div class=${css.txReturnValue}>${parseInt(transaction.gasPrice._hex) || free}</div>
              </div>
              <div class=${css.txReturnField} onclick=${()=>copy(receipt.gasUsed._hex)}>
                <div class=${css.txReturnTitle}>Gas used:</div>
                <div class=${css.txReturnValue}>${parseInt(receipt.gasUsed._hex)}</div>
              </div>
              <div class=${css.txReturnField}>
                <div class=${css.txReturnTitle}>Details:</div>
                <div class=${css.txReturnValue}><a href=${linkToEtherscan} target="_blank">Link to Etherscan</a></div>
              </div>
            </div>
          </div>`)
          element.appendChild(txReturn)
        }
        if (label === 'pure' || label === 'view') {
          txReturn.innerHTML = `
            <div class=${css.txReturnItem}>
              <div class=${css.returnJSON}>
                ${JSON.stringify(transaction, null, 1)}
              </div>
            </div>`
          element.appendChild(txReturn)
        }
      } else {
        let deploy = document.querySelector("[class^='deploy']")
        setTimeout(()=>{deploy.style.color = colors.darkSmoke}, 1000)
        setTimeout(()=>{deploy.style.color = colors.whiteSmoke}, 1500)
        setTimeout(()=>{deploy.style.color = colors.darkSmoke}, 2000)
        setTimeout(()=>{deploy.style.color = colors.whiteSmoke}, 2500)
        setTimeout(()=>{deploy.style.color = colors.darkSmoke}, 3000)
        setTimeout(()=>{deploy.style.color = colors.whiteSmoke}, 3500)
      }
    }

    function toggleAll (e) {
      var fnContainer = e.currentTarget.parentNode.nextSibling
      var constructorToggle = e.currentTarget.children[0]
      var constructorIcon = constructorToggle.children[0]
      constructorToggle.removeChild(constructorIcon)
      var minus = bel`<i class="fa fa-minus-circle" title="Collapse">`
      var plus = bel`<i class="fa fa-plus-circle title='Expand to see the details'">`
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
      function removeLogs (el) {
        var txReturn = el.parentNode.querySelectorAll("[class^='txReturn']")[0]
        if (txReturn) {
          txReturn.classList.remove(css.visible)
          txReturn.classList.add(css.hidden)
          txReturn.style.minHeight = 0
        }
      }
      function addLogs (el) {
        var txReturn = el.parentNode.querySelectorAll("[class^='txReturn']")[0]
        if (txReturn) {
          txReturn.classList.remove(css.hidden)
          txReturn.classList.add(css.visible)
          txReturn.style.minHeight = '80px'
        }
      }
      // TOGGLE triggered by toggleAll
      if (fun != null) {
        fn = fun.children[0]
        toggleContainer = e.children[1]
        var fnInputs = fn.children[1]
        // Makes sure all functions are opened or closed before toggleAll executes
        if (constructorIcon.className.includes('plus') && fnInputs.className === css.visible.toString()) {
          fnInputs.classList.remove(css.visible)
          fnInputs.classList.add(css.hidden)
          removeLogs(fn)
        }
        else if (constructorIcon.className.includes('minus') && fnInputs.className === css.hidden.toString()) {
          fnInputs.classList.remove(css.hidden)
          fnInputs.classList.add(css.visible)
          addLogs(fn)
        }
      // TOGGLE triggered with onclick on function title (toggle single function)
      } else {
        fn = e.currentTarget.parentNode
        toggleContainer = e.currentTarget.children[1]
      }
      // TOGGLE input fields in a single function
      var params = fn.children[1]
      if (params.className === css.visible.toString()) {
        params.classList.remove(css.visible)
        params.classList.add(css.hidden)
        removeLogs(fn)
        fn.style.border = 'none'
        fn.style.marginBottom = 0
      } else {
        params.classList.remove(css.hidden)
        params.classList.add(css.visible)
        addLogs(fn)
        fn.style.border = `3px dashed ${colors.darkSmoke}`
        fn.style.marginBottom = '2em'
      }
    }

// Create and deploy contract using WEB3
    async function deployContract() {
      let abi = solcMetadata.output.abi
      let bytecode = opts.metadata.bytecode
      provider =  await getProvider()
      let signer = await provider.getSigner()
      let element = document.querySelector("[class^='ctor']")
      let factory = await new ethers.ContractFactory(abi, bytecode, signer)
      let instance = await factory.deploy(getArgs(element, 'inputFields'))
      contract = instance
      deployingNotice()
      let deployed = await contract.deployed()
      createDeployStats(contract)
      activateSendTx(contract)
    }

    function deployingNotice() {
      let txReturn = document.querySelector("[class^='txReturn']")
      ctor.innerHTML = `
        <div class=${css.deployStats}>
          <div class=${css.statsEl}>
            <div class=${css.statsElTitle}>Deploying to Ethereum network</div>
            <div class=${css.inProgress}>...</div>
          </div>
        </div>`
      if (txReturn) txReturn.parentNode.removeChild(txReturn)
    }

    function activateSendTx(instance) {
      let sendButtons = document.querySelectorAll("[class^='send']")
      for(var i = 0;i < sendButtons.length;i++) {
        sendButtons[i].style.color = colors.slateGrey
      }
      for(var i = 0;i < sendButtons.length;i++) {
        sendButtons[i].style.color = colors.whiteSmoke
      }
    }

    function createDeployStats (contract) {
      ctor.innerHTML = ''
      ctor.appendChild(bel`
        <div class=${css.deployStats}>
          <div class=${css.statsEl}>
            <div class=${css.statsElTitle}>Deployed:</div>
            <div class=${css.statsElValue}>${date}</div>
          </div>
          <div class=${css.statsEl} title="${contract.deployTransaction.hash}" onclick=${()=>copy(contract.deployTransaction.hash)}>
            <div class=${css.statsElTitle}>Transaction:</div>
            <div class=${css.statsElValue}>${shortenHexData(contract.deployTransaction.hash)}</div>
          </div>
          <div class=${css.statsEl} title="${contract.deployTransaction.from}" onclick=${()=>copy(contract.deployTransaction.from)}>
            <div class=${css.statsElTitle}>Signed by:</div>
            <div class=${css.statsElValue}>${shortenHexData(contract.deployTransaction.from)}</div>
          </div>
          <div class=${css.statsEl} title="${contract.deployTransaction.creates}" onclick=${()=>copy(contract.deployTransaction.creates)}>
            <div class=${css.statsElTitle}>Contract address:</div>
            <div class=${css.statsElValue}>${shortenHexData(contract.deployTransaction.creates)}</div>
          </div>
          <div class=${css.statsEl} onclick=${()=>copy(contract.deployTransaction.gasPrice.toString())}>
            <div class=${css.statsElTitle}>Gas price:</div>
            <div class=${css.statsElValue}>${contract.deployTransaction.gasPrice.toString()}</div>
          </div>
        </div>
      `)
    }

    var ctor = bel`
    <div class="${css.ctor}">
      ${metadata.constructorInput}
      <div class=${css.deploy} onclick=${()=>deployContract()}>
        <div class=${css.deployTitle}>Deploy</div>
        <i class="${css.icon} fa fa-arrow-circle-right"></i>
      </div>
    </div>`

    return bel`
    <div class=${css.preview}>
    <div class=${css.constructorFn}>
      <div class=${css.contractName} onclick=${e=>toggleAll(e)} title="Expand to see the details">
        ${metadata.constructorName}
        <span class=${css.icon}>
          <i class="fa fa-plus-circle" title="Expand to see the details"></i>
        </span>
      </div>
    </div>
    <div class=${css.functions}>${sorted.map(fn => { return functions(fn)})}</div>
    ${ctor}
    </div>
    `

  }
}
