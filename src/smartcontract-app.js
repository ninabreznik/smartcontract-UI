const bel = require("bel")
const csjs = require("csjs-inject")
const Web3 = require('web3')
const ethers = require('ethers')
const glossary = require('glossary')
const date = require('getDate')
const shortenHexData = require('shortenHexData')
const validator = require('solidity-validator')
const inputAddress = require("input-address")
const inputArray = require("input-array")
const inputInteger = require("input-integer")
const inputBoolean = require("input-boolean")
const inputString = require("input-string")

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
    .ulVisible {
      visibility: visible;
      height: 100%;
      padding: 0;
    }
    .ulHidden {
      visibility: hidden;
      height: 0;
    }
    .txReturn {
      border: 3px dashed ${colors.darkSmoke};
      border-top: none;
      min-width: 230px;
      top: -41px;
      left: 20px;
      height: 80px;
      width: 624px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .txReturnLeft, .txReturnRight {
      display: flex;
      flex-direction: column;
    }
    .txReturnBody {
      font-size: 0.7rem;
      display: flex;
      color: ${colors.whiteSmoke};
      width: 100%;
      margin: 1% 5%;
      justify-content: space-evenly;
    }
    .txReturnField {
      display:flex;
      justify-content: flex-start;
    }
    .txReturnTitle {}
    .txReturnValue {}
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
      border: 2px dashed ${colors.darkSmoke};
      padding: 20px 0;
      width: 630px;
      margin: 2em 0 0 20px;
    }
    .statsEl {
      display:flex;
      justify-content: flex-start;
    }
    .statsElTitle {
      min-width: 220px;
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
    .icon:hover {
      opacity: 0.9;
      cursor: pointer;
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

/******************************************************************************
  ETHERS
******************************************************************************/

var provider
var contract

async function getProvider() {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      // Acccounts now exposed
      provider = new ethers.providers.Web3Provider(web3.currentProvider)
    } catch (error) {
      // User denied account access...
    }
  } else {
    window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn")
  }
  return provider
}

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
      var send = bel`<div class=${css.send} onclick=${e => sendTx(fn.name, e)}><i class="${css.icon} fa fa-arrow-circle-right"></i></div>`
      var functionClass = css[label]
      return bel`
      <div class=${css.fnContainer}>
        <div class="${functionClass} ${css.function}">
          ${title}
          <ul class=${css.ulHidden}>
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
        args.push(x.querySelector('input').value)
      })
      return args
    }

    async function sendTx (name, e) {
      let element = e.target.parentNode.parentNode.parentNode.parentNode
      let txReturn = element.querySelector("[class^='txReturn']") || bel`<div class=${css.txReturn}></div>`
      if (contract) {
        let fnName = name
        let args = getArgs(element, 'inputContainer')
        let overrides = {
          // The address to execute the call as
          from: provider,
          // The maximum units of gas for the transaction to use
          gasLimit: 23000,
        }
        let transaction = await contract[fnName](...args)
        let receipt = await provider.getTransactionReceipt(transaction.hash)
        console.log(receipt)
        console.log(transaction)
        txReturn.innerHTML = `
          <div class=${css.txReturnBody}>
          <div class=${css.txReturnLeft}>
            <div class=${css.txReturnField}>
              <div class=${css.txReturnTitle}>Sent: </div>
              <div class=${css.txReturnValue}>${date}</div>
            </div>
            <div class=${css.txReturnField}>
            <div class=${css.txReturnTitle} title="Transaction's address">Tx address: </div>
            <div class=${css.txReturnValue}>${shortenHexData(transaction.hash)}</div>
            </div>
          </div>
          <div class=${css.txReturnRight}>
            <div class=${css.txReturnField}>
              <div class=${css.txReturnTitle}>Signed by: </div>
              <div class=${css.txReturnValue}>${shortenHexData(transaction.from)}</div>
            </div>
            <div class=${css.txReturnField}>
              <div class=${css.txReturnTitle}>Gas price: </div>
              <div class=${css.txReturnValue}>${parseInt(transaction.gasPrice._hex) || free}</div>
            </div>
          </div>
        </div>`
      } else {
        txReturn.innerHTML = `<div class=${css.txReturnBody}>You need to deploy the contract first. Only after that you can call the functions and interact with the deployed contract.</div>`
        setTimeout(()=>{txReturn.parentNode.removeChild(txReturn)}, 4000)
      }
      element.appendChild(txReturn)
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
      var txReturn = document.querySelector("[class^='txReturn']")
      // TOGGLE triggered by toggleAll
      if (fun != null) {
        fn = fun.children[0]
        toggleContainer = e.children[1]
        var fnInputs = fn.children[1]
        // Makes sure all functions are opened or closed before toggleAll executes
        if (constructorIcon.className.includes('plus') && fnInputs.className === css.ulVisible.toString()) {
          fnInputs.classList.remove(css.ulVisible)
          fnInputs.classList.add(css.ulHidden)
          if (txReturn) txReturn.parentNode.removeChild(txReturn)
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
      if (params.className === css.ulVisible.toString()) {
        params.classList.remove(css.ulVisible)
        params.classList.add(css.ulHidden)
        if (txReturn) txReturn.parentNode.removeChild(txReturn)
        fn.style.border = 'none'
        fn.style.marginBottom = 0
      } else {
        params.classList.remove(css.ulHidden)
        params.classList.add(css.ulVisible)
        fn.style.border = `3px dashed ${colors.darkSmoke}`
        fn.style.marginBottom = '2em'
      }
    }

// Create and deploy contract using WEB3
    async function deployContract() {
      let abi = solcMetadata.output.abi
      let bytecode = '608060405234801561001057600080fd5b50610d16806100206000396000f3fe608060405260043610610072576000357c010000000000000000000000000000000000000000000000000000000090048063093e71571461007757806319994442146100a057806374adad1d146100c9578063daea85c51461010a578063e01212c014610133578063fb1a002a1461015c575b600080fd5b34801561008357600080fd5b5061009e6004803603610099919081019061097f565b610187565b005b3480156100ac57600080fd5b506100c760048036036100c291908101906108ef565b61033c565b005b3480156100d557600080fd5b506100f060048036036100eb91908101906108ef565b61033f565b604051610101959493929190610b47565b60405180910390f35b34801561011657600080fd5b50610131600480360361012c91908101906108ef565b6104c5565b005b34801561013f57600080fd5b5061015a60048036036101559190810190610918565b6104c8565b005b34801561016857600080fd5b506101716104cd565b60405161017e9190610b25565b60405180910390f35b60a0604051908101604052808481526020018381526020018281526020016040805190810160405280600981526020017f7375626d6974746564000000000000000000000000000000000000000000000081525081526020013373ffffffffffffffffffffffffffffffffffffffff16815250600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000155602082015181600101556040820151816002019080519060200190610269929190610786565b506060820151816003019080519060200190610286929190610786565b5060808201518160040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555090505060003390806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b50565b6001602052806000526040600020600091509050806000015490806001015490806002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103f75780601f106103cc576101008083540402835291602001916103f7565b820191906000526020600020905b8154815290600101906020018083116103da57829003601f168201915b505050505090806003018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104955780601f1061046a57610100808354040283529160200191610495565b820191906000526020600020905b81548152906001019060200180831161047857829003601f168201915b5050505050908060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905085565b50565b505050565b60608060008054905060405190808252806020026020018201604052801561050f57816020015b6104fc610806565b8152602001906001900390816104f45790505b50905060008090505b60008054905081101561077e5760016000808381548110151561053757fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060a060405190810160405290816000820154815260200160018201548152602001600282018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106555780601f1061062a57610100808354040283529160200191610655565b820191906000526020600020905b81548152906001019060200180831161063857829003601f168201915b50505050508152602001600382018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106f75780601f106106cc576101008083540402835291602001916106f7565b820191906000526020600020905b8154815290600101906020018083116106da57829003601f168201915b505050505081526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681525050828281518110151561076457fe5b906020019060200201819052508080600101915050610518565b508091505090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106107c757805160ff19168380011785556107f5565b828001600101855582156107f5579182015b828111156107f45782518255916020019190600101906107d9565b5b509050610802919061084c565b5090565b60a06040519081016040528060008152602001600081526020016060815260200160608152602001600073ffffffffffffffffffffffffffffffffffffffff1681525090565b61086e91905b8082111561086a576000816000905550600101610852565b5090565b90565b600061087d8235610c6d565b905092915050565b600082601f830112151561089857600080fd5b81356108ab6108a682610bd5565b610ba8565b915080825260208301602083018583830111156108c757600080fd5b6108d2838284610c89565b50505092915050565b60006108e78235610c7f565b905092915050565b60006020828403121561090157600080fd5b600061090f84828501610871565b91505092915050565b60008060006060848603121561092d57600080fd5b600061093b868287016108db565b935050602084013567ffffffffffffffff81111561095857600080fd5b61096486828701610885565b925050604061097586828701610871565b9150509250925092565b60008060006060848603121561099457600080fd5b60006109a2868287016108db565b93505060206109b3868287016108db565b925050604084013567ffffffffffffffff8111156109d057600080fd5b6109dc86828701610885565b9150509250925092565b6109ef81610c31565b82525050565b6000610a0082610c0e565b80845260208401935083602082028501610a1985610c01565b60005b84811015610a52578383038852610a34838351610a99565b9250610a3f82610c24565b9150602088019750600181019050610a1c565b508196508694505050505092915050565b6000610a6e82610c19565b808452610a82816020860160208601610c98565b610a8b81610ccb565b602085010191505092915050565b600060a083016000830151610ab16000860182610b16565b506020830151610ac46020860182610b16565b5060408301518482036040860152610adc8282610a63565b91505060608301518482036060860152610af68282610a63565b9150506080830151610b0b60808601826109e6565b508091505092915050565b610b1f81610c63565b82525050565b60006020820190508181036000830152610b3f81846109f5565b905092915050565b600060a082019050610b5c6000830188610b16565b610b696020830187610b16565b8181036040830152610b7b8186610a63565b90508181036060830152610b8f8185610a63565b9050610b9e60808301846109e6565b9695505050505050565b6000604051905081810181811067ffffffffffffffff82111715610bcb57600080fd5b8060405250919050565b600067ffffffffffffffff821115610bec57600080fd5b601f19601f8301169050602081019050919050565b6000602082019050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b6000610c3c82610c43565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000610c7882610c43565b9050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015610cb6578082015181840152602081019050610c9b565b83811115610cc5576000848401525b50505050565b6000601f19601f830116905091905056fea265627a7a723058204747206ad99bddbdedcf31c4746d1bf4c8314bfb73df10ca69b7d8e608dc00526c6578706572696d656e74616cf50037'
      provider =  await getProvider()
      let signer = await provider.getSigner()
      let element = document.querySelector("[class^='constructorFn']")
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
      ctor.innerHTML = `
        <div class=${css.deployStats}>
          <div class=${css.statsEl}>
            <div class=${css.statsElTitle}>Deployed:</div>
            <div class=${css.statsElValue}>${date}</div>
          </div>
          <div class=${css.statsEl} title="${contract.deployTransaction.hash}"}>
            <div class=${css.statsElTitle}>Contract address:</div>
            <div class=${css.statsElValue}>${shortenHexData(contract.deployTransaction.hash)}</div>
          </div>
          <div class=${css.statsEl} title="${contract.deployTransaction.from}">
            <div class=${css.statsElTitle}>Signed by:</div>
            <div class=${css.statsElValue}>${shortenHexData(contract.deployTransaction.from)}</div>
          </div>
          <div class=${css.statsEl}>
            <div class=${css.statsElTitle}>Gas price:</div>
            <div class=${css.statsElValue}>${contract.deployTransaction.gasPrice.toString()}</div>
          </div>
        </div>
      `
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
