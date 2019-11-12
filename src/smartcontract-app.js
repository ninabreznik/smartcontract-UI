const bel = require("bel")
const csjs = require("csjs-inject")
const ethers = require('ethers')
const glossary = require('glossary')
const loadingAnimation = require('loadingAnimation')
const makeDeployReceipt = require('makeDeployReceipt')
const getArgs = require('getArgs')
const makeReturn = require('makeReturn')
const shortenHexData = require('shortenHexData')
const inputAddress = require("input-address")
const inputArray = require("input-array")
const inputInteger = require("input-integer")
const inputBoolean = require("input-boolean")
const inputString = require("input-string")
const inputByte = require("input-byte")
const inputPayable = require("input-payable")
const copy = require('copy-text-to-clipboard')

const colors = require('theme')
//const theme = require('theme')
//const setTheme = require('setTheme')
//setTheme(theme())

// Styling variables

var css
var fonts = [ "https://use.fontawesome.com/releases/v5.8.2/css/all.css",
  'https://fonts.googleapis.com/css?family=Overpass+Mono']
var fontAwesome = bel`<link href=${fonts[0]} rel='stylesheet' type='text/css'>`
var overpassMono = bel`<link href=${fonts[1]} rel='stylesheet' type='text/css'>`
document.head.appendChild(fontAwesome)
document.head.appendChild(overpassMono)

/******************************************************************************
  ETHERS
******************************************************************************/

window.ethers = ethers //@TODO remove after crosslink
var provider
var contract

async function getProvider() {
  if (window.web3 && window.web3.currentProvider) {
    try {
      // Acccounts now exposed
      provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
      // Request account access if needed
      await ethereum.enable();
    } catch (error) {
      console.log(error)
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
    window.abi = solcMetadata.output.abi //@TODO remove after crosslink
    window.bytecode = solcMetadata.bytecode //@TODO remove after crosslink
    function getConstructorName() {
      var file = Object.keys(solcMetadata.settings.compilationTarget)[0]
      return solcMetadata.settings.compilationTarget[file]
    }

    function getConstructorInput() {
      var payable = false
      var inputs = solcMetadata.output.abi.map(fn => {
        if (fn.type === "constructor") {
          if (fn.stateMutability === 'payable') payable = true
          return treeForm(fn.inputs)
        }
      })
      if (payable === true) inputs.unshift(inputPayable('payable'))
      return inputs
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

    function sort (functions) {
      return functions.filter(x => x.type === 'function').sort((a, b) => {
        var d=type2num(a) - type2num(b)
        if (d==0) {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
        }
        return d
      })
    }

    function type2num ({ stateMutability: sm }) {
      if (sm === 'view') return 1
      if (sm === 'nonpayable') return 2
      if (sm === 'pure') return 3
      if (sm === 'payable') return 4
      if (sm === undefined) return 5
    }

    var sorted = sort(metadata.functions)

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
      function cb (msg, el, value) {
        var oldOutput = el.parentNode.querySelector("[class^='output']")
        var output = oldOutput ? oldOutput : output = bel`<div class=${css.output}></div>`
        output.innerHTML = ""
        output.innerHTML = msg ? `<a class=${css.valError} title="${msg}"><i class="fa fa-exclamation"></i></a>` : `<a class=${css.valSuccess} title="The value is valid."><i class="fa fa-check"></i></a>`
        el.parentNode.appendChild(output)
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
        if (type.search(/\bbyte/) != -1) field = inputByte({ theme, type, cb })
        if (type.search(/\bstring/) != -1) field = inputString({ theme, type, cb })
        if (type.search(/\bfixed/) != -1) field = inputInteger({ theme, type, cb })
        if (type.search(/\bbool/) != -1) field = inputBoolean({ theme, type, cb })
        if (type.search(/\baddress/) != -1) field = inputAddress({ theme, type, cb })
      }
      return field
    }

    function functions (fn) {
      var label = fn.stateMutability
      var fnName = bel`<a title="${glossary(label)}" class=${css.fnName}><div class=${css.name}>${fn.name}</div></a>`
      var title = bel`<div class=${css.title} onclick=${e=>toggle(e, null, null)}>${fnName}</div>`
      var send = bel`<div class=${css.send} onclick=${e => sendTx(fn.name, label, e)}><i class="${css.icon} fa fa-arrow-circle-right"></i></div>`
      var functionClass = css[label]
      var el = bel`
      <div class=${css.fnContainer}>
        <div class="${functionClass} ${css.function}">
          ${title}
          <ul class=${css.visible}>
            ${fn.inputs}
            ${send}
          </ul>
        </div>
      </div>`
      if (label === 'payable')  send.parentNode.prepend(inputPayable(label))
      return el
    }

    async function sendTx (fnName, label, e) {
      var loader = bel`<div class=${css.txReturnItem}>Awaiting network confirmation ${loadingAnimation(colors)}</div>`
      var container = e.target.parentNode.parentNode.parentNode.parentNode
      var txReturn = container.querySelector("[class^='txReturn']") || bel`<div class=${css.txReturn}></div>`
      if (contract) {  // if deployed
        container.appendChild(txReturn)
        txReturn.appendChild(loader)
        let signer = await provider.getSigner()
        var allArgs = getArgs(container, 'inputContainer')
        var args = allArgs.args
        const contractType = contract.interface.functions[fnName].type
        let opts = {
          contract,
          solcMetadata,
          provider,
          fnName
        }
        if (contractType === 'transaction') {
          const callableTx = await makeContractCallable (contract, fnName, provider, args, allArgs)
          opts.tx = callableTx
          opts.typeTransaction = true
          try {
            let contractAsCurrentSigner = contract.connect(signer)
            if (allArgs.overrides) { await contractAsCurrentSigner.functions[fnName](...args, allArgs.overrides) }
            else { await contractAsCurrentSigner.functions[fnName](...args) }
          } catch (e) { txReturn.children.length > 1 ? txReturn.removeChild(loader) : container.removeChild(txReturn) }
        } else {
          opts.typeTransaction = false
          try {
            let contractAsCurrentSigner = contract.connect(signer)
            if (allArgs.overrides) { opts.tx = await contractAsCurrentSigner.functions[fnName](...args, allArgs.overrides) }
            else { opts.tx = await contractAsCurrentSigner.functions[fnName](...args) }
          } catch (e) { txReturn.children.length > 1 ? txReturn.removeChild(loader) : container.removeChild(txReturn) }
        }
        loader.replaceWith(await makeReturn(opts))
      } else {
        let deploy = document.querySelector("[class^='deploy']")
        deploy.classList.add(css.bounce)
        setTimeout(()=>deploy.classList.remove(css.bounce), 3500)
      }
    }

    async function executeTx (contract, fnName, provider, args, allArgs, opts) {
      try {
        let contractAsCurrentSigner = contract.connect(signer)
        var tx
        if (allArgs.overrides) { tx = await contractAsCurrentSigner.functions[fnName](...args, allArgs.overrides) }
        else { tx = await contractAsCurrentSigner.functions[fnName](...args) }
        loader.replaceWith(await makeReturn(opts))
      } catch (e) { txReturn.children.length > 1 ? txReturn.removeChild(loader) : container.removeChild(txReturn) }
    }

    async function makeContractCallable (contract, fnName, provider, args, allArgs) {
      const fn = contract.interface.functions[fnName]
      if (fn.outputs.length > 0) {
        const signature = fn.signature
        const address = contract.address
        const type = fn.outputs[0].type
        let contractCallable = new ethers.Contract(address, [
          `function ${signature} constant returns(${type})`
        ], provider)
        let signer = await provider.getSigner()
        const callableAsCurrentSigner = await contractCallable.connect(signer)
        try {
          const callableFn =callableAsCurrentSigner.functions[fnName]
          return await callableFn(...args)
        } catch (e) { console.log(e) }
      } else return []
    }


    function toggleAll (e) {
      var fnContainer = e.currentTarget.parentElement.parentElement.children[2]
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
      // TOGGLE input fields in a function
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
        fn.style.border = `2px dashed ${colors.darkSmoke}`
        fn.style.marginBottom = '2em'
      }
    }

// Create and deploy contract using WEB3
    async function deployContract() {
      let abi = solcMetadata.output.abi
      let bytecode = opts.metadata.bytecode
      provider =  await getProvider()
      let signer = await provider.getSigner()
      var el = document.querySelector("[class^='ctor']")
      let factory = await new ethers.ContractFactory(abi, bytecode, signer)
      el.replaceWith(bel`<div class=${css.deploying}>Publishing to Ethereum network ${loadingAnimation(colors)}</div>`)
      try {
        var allArgs = getArgs(el, 'inputContainer')
        let args = allArgs.args
        var instance
        if (allArgs.overrides) { instance = await factory.deploy(...args, allArgs.overrides) }
        else { instance = await factory.deploy(...args) }
        // instance = await factory.deploy(...args)
        contract = instance
        let deployed = await contract.deployed()
        topContainer.innerHTML = ''
        topContainer.appendChild(makeDeployReceipt(provider, contract, false))
        activateSendTx(contract)
      } catch (e) {
        let loader = document.querySelector("[class^='deploying']")
        loader.replaceWith(ctor)
      }
    }

    function activateConnect (e) {
      if (active != e.target) {
        setToActive(e.target)
        topContainer.removeChild(ctor)
        topContainer.appendChild(connectContainer)
      }
    }

    function activatePublish (e) {
      if (active != e.target) {
        setToActive(e.target)
        topContainer.removeChild(connectContainer)
        topContainer.appendChild(ctor)
      }
    }

    async function connectToContract () {
      let abi = solcMetadata.output.abi
      let bytecode = opts.metadata.bytecode
      provider =  await getProvider()
      let signer = await provider.getSigner()
      var el = document.querySelector("[class^='connectContainer']")
      var allArgs = getArgs(el, 'inputContainer')
      const address = allArgs.args[0]
      el.replaceWith(bel`<div class=${css.connecting}>
        Connecting to the contract ${address}
        ${loadingAnimation(colors)}</div>`)
      try {
        contract = new ethers.Contract(address, abi, provider)
        var code = await provider.getCode(address)
        if (!code || code === '0x') {
          let loader = document.querySelector("[class^='connecting']")
          loader.replaceWith(connectContainer)
          console.log('Not a valid contract address')
        } else {
          topContainer.innerHTML = ''
          topContainer.appendChild(makeDeployReceipt(provider, contract, true))
          activateSendTx(contract)
        }
      } catch (e) {
        let loader = document.querySelector("[class^='connecting']")
        loader.replaceWith(connectContainer)
        console.log(e)
      }
    }

    function setToActive (e) {
      e.classList.add(css.activetab)
      active.classList.remove(css.activetab)
      active = e
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

    var topContainer = bel`<div class=${css.topContainer}></div>`
    var ctor = bel`<div class="${css.ctor}">
      ${metadata.constructorInput}
      <div class=${css.deploy} onclick=${()=>deployContract()}
        title="Publish the contract first (this executes the Constructor function). After that you will be able to start sending/receiving data using the contract functions below.">
        <div class=${css.deployTitle}>Publish</div>
        <i class="${css.icon} fa fa-arrow-circle-right"></i>
      </div>
    </div>`
    const connectContainer = bel`<div class="${css.connectContainer}">
      ${generateInputContainer({name: 'contract_address', type:'address'})}
      <div class=${css.connect} onclick=${()=>connectToContract()}
        title="Enter address of the deployed contract you want to connect with. Select the correct network and click Connect. After that you will be able to interact with the chosen contract.">
        <div class=${css.connectTitle}>Connect</div>
        <i class="${css.icon} fa fa-arrow-circle-right"></i>
      </div>
    </div>`
    var active, tabs = bel`<div class=${css.tabsContainer}>
      ${active = bel`<div class="${css.tab} ${css.activetab}"
      onclick=${e=>activatePublish(e)}>Publish</div>`}
      <div class="${css.tab}"
      onclick=${e=>activateConnect(e)}>Connect</div>
    </div>`
    topContainer.appendChild(tabs)
    topContainer.appendChild(ctor)

    return bel`
    <div class=${css.preview}>
      <div class=${css.constructorFn}>
        <div class=${css.contractName} onclick=${e=>toggleAll(e)} title="Expand to see the details">
          ${metadata.constructorName}
          <span class=${css.icon}><i class="fa fa-minus-circle" title="Expand to see the details"></i></span>
        </div>
      </div>
      ${topContainer}
      <div class=${css.functions}>${sorted.map(fn => { return functions(fn)})}</div>
    </div>`
  }
}

/******************************************************************************
  CSS
******************************************************************************/

css = csjs`
  @media only screen and (max-width: 3000px) {
    .preview {
      padding: 1% 2%;
      min-width: 350px;
      min-height: 100vh;
      font-family: 'Overpass Mono', sans-serif;
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
      position: relative;
      border: 2px dashed ${colors.darkSmoke};
      border-top: none;
      min-width: 230px;
      top: -41px;
      left: 20px;
      min-height: 80px;
      width: 546px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .deploying, .connecting {
      font-size: 0.9rem;
      margin-left: 3%;
    }
    .txReturnItem {
      position: relative;
      font-size: 0.7rem;
      display: flex;
      color: ${colors.whiteSmoke};
      border: 1px solid ${colors.darkSmoke};
      width: 87%;
      margin: 3%;
      padding: 3%;
      justify-content: space-between;
      flex-direction: column;
    }
    .contractName {
      cursor: pointer;
      font-size: 2rem;
      font-weight: bold;
      color: ${colors.whiteSmoke};
      margin: 10px 0 20px 10px;
      display: flex;
      align-items: end;
    }
    .contractName:hover {
      ${hover()}
    }
    .fnName {
      font-size: 1em;
      display: flex;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .faIcon {
      position: absolute;
      top: -16px;
      left: 0;
    }
    .name {
      font-size: 0.9em;
    }
    .stateMutability {
      margin-left: 5px;
      color: ${colors.whiteSmoke};
      border-radius: 20px;
      border: 1px solid;
      padding: 1px;
      font-size: 0.9rem;
      width: 65px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .constructorFn {
      padding-top: 18px;
      width: 600px;
    }
    .functions {
      font-size: 1.3rem;
      width: 570px;
    }
    .title {
      font-size: 1.3rem;
      display: flex;
      align-items: baseline;
      position: absolute;
      top: -13px;
      left: 20px;
      background-color: ${colors.dark};
    }
    .title:hover {
      ${hover()}
    }
    .deployTitle, .connectTitle {
      font-size: 1.3rem;
      background-color: ${colors.dark};
      padding: 0 5px 0 0;
      font-weight: 800;
    }
    .deploy, .connect {
      color: ${colors.whiteSmoke};
      display: flex;
      align-items: center;
      bottom: -15px;
      right: -12px;
      font-size: 1.8rem;
      position: absolute;
      background-color: ${colors.dark};
      cursor: pointer;
    }
    .deploy:hover, .connect:hover {
      ${hover()}
    }
    .send {
      display: flex;
      align-items: baseline;
      bottom: -16px;
      right: 13px;
      font-size: 2rem;
      position: absolute;
      background-color: ${colors.dark};
      color: ${colors.darkSmoke};
      padding-right: 5px;
    }
    .send:hover {
      ${hover()}
    }
    .bounce {
      animation: bounceRight 2s infinite;
    }
    @-webkit-keyframes bounceRight {
    0% {-webkit-transform: translateX(0);
      transform: translateX(0);}
    20% {-webkit-transform: translateX(0);
      transform: translateX(0);}
    40% {-webkit-transform: translateX(-30px);
      transform: translateX(-30px);}
    50% {-webkit-transform: translateX(0);
      transform: translateX(0);}
    60% {-webkit-transform: translateX(-15px);
      transform: translateX(-15px);}
    80% {-webkit-transform: translateX(0);
      transform: translateX(0);}
    100% {-webkit-transform: translateX(0);
      transform: translateX(0);}
    }
    @-moz-keyframes bounceRight {
      0% {transform: translateX(0);}
      20% {transform: translateX(0);}
      40% {transform: translateX(-30px);}
      50% {transform: translateX(0);}
      60% {transform: translateX(-15px);}
      80% {transform: translateX(0);}
      100% {transform: translateX(0);}
    }
    @keyframes bounceRight {
      0% {-ms-transform: translateX(0);
        transform: translateX(0);}
      20% {-ms-transform: translateX(0);
        transform: translateX(0);}
      40% {-ms-transform: translateX(-30px);
        transform: translateX(-30px);}
      50% {-ms-transform: translateX(0);
        transform: translateX(0);}
      60% {-ms-transform: translateX(-15px);
        transform: translateX(-15px);}
      80% {-ms-transform: translateX(0);
        transform: translateX(0);}
      100% {-ms-transform: translateX(0);
        transform: translateX(0);}
    }
    .fnContainer {
      position: relative;
    }
    .function {
      display: flex;
      flex-direction: column;
      position: relative;
      margin-left: 20px;
      margin-bottom: 10%;
      border: 2px dashed ${colors.darkSmoke};
    }
    .topContainer {
      display: flex;
      flex-direction: column;
      position: relative;
      border: 2px dashed ${colors.darkSmoke};
      padding: 2em 1em 3em 0em;
      width: 540px;
      margin: 3em 0 5em 20px;
      font-size: 0.75em;
    }
    .tabsContainer {
      display: flex;
      position: absolute;
      top: -30px;
      left: -1px;
      width: 33%;
    }
    .tab {
      border: 2px dashed ${colors.darkSmoke};
      color: ${colors.slateGrey};
      border-bottom: none;
      box-sizing: border-box;
      padding: 3% 13%;
      height: 29px;
      width: 100%;
      margin-right: 5px;
      font-size: 0.8rem;
    }
    .tab:hover {
      ${hover()}
    }
    .activetab {
      font-weight: bold;
      color: ${colors.whiteSmoke};
    }
    .ctor {}
    .connectContainer {}
    .signature {}
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
      color: ${colors.orange};
    }
    .icon {
      margin-left: 5px;
      font-size: 0.9em;
    }
    .output {
      font-size: 0.7rem;
      display: flex;
      align-self: center;
      position: absolute;
      right: -17px;
    }
    .valError {
      color: ${colors.violetRed};
      display: flex;
      align-self: center;
    }
    .valSuccess {
      color: ${colors.aquaMarine};
      display: flex;
      align-self: center;
    }
    .inputContainer {
      font-family: 'Overpass Mono', sans-serif;
      margin: 15px 0 15px 0;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: ${colors.whiteSmoke};
    }
    .inputParam {
      color: ${colors.slateGrey};
      display: flex;
      justify-content: center;
      font-size: 0.9rem;
      display: flex;
      min-width: 200px;
    }
    .inputFields {
    }
    .inputType {
    }
    .inputField {
      ${inputStyle()}
      position: relative;
      font-size: 0.9rem;
      color: ${colors.whiteSmoke};
      border-color: ${colors.slateGrey};
      border-radius: 0.2em;
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
      font-size: 0.9rem;
      color: ${colors.whiteSmoke};
      background-color: ${colors.darkSmoke};
      border-radius: 0.2em;
      display: flex;
      text-align: center;
      width: 60%;
    }
    .integerValue::placeholder {
      color: ${colors.whiteSmoke};
      text-align: center;
      opacity: 0.5;
    }
    .integerSlider {
      width: 40%;
      border: 1px solid ${colors.slateGrey};
      background: ${colors.darkSmoke};
      -webkit-appearance: none;
      height: 1px;
    }
    .integerSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      border: 1px solid ${colors.slateGrey};
      border-radius: 0.2em;
      height: 22px;
      width: 10px;
      background: ${colors.darkSmoke};
      cursor: pointer;
    }
    .integerField {
      position: relative;
      display: flex;
      width: 300px;
      align-items: center;
    }
    .booleanField {
      position: relative;
      display: flex;
      width: 300px;
      align-items: baseline;
      font-size: 0.9rem;
    }
    .stringField {
      position: relative;
      display: flex;
      width: 300px;
      justify-content: center;
    }
    .byteField {
      position: relative;
      display: flex;
      width: 300px;
      justify-content: center;
    }
    .addressField {
      position: relative;
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
      width: 50%;
      text-align: center;
      cursor: pointer;
    }
    .true {
      ${inputStyle()}
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
    border: 1px solid ${colors.slateGrey};
    background-color: ${colors.darkSmoke};
    color: ${colors.slateGrey};
    padding: 5px;
  `
}

function hover () {
  return `
    cursor: pointer;
    opacity: 0.6;
  `
}
