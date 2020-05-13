const solcjs = require('solc-js')

const smartcontractapp = require('../')

;(async () => {
  const select = await solcjs.versions().catch(printError)
  const { releases, nightly, all } = select
  const version = getCompilerVersion(releases, sourcecode)
  const compiler = await solcjs(version).catch(printError)
  const result = await compiler(sourcecode).catch(printError)
  document.body.appendChild(smartcontractapp(result))
})()

function getCompilerVersion (releases, code) {
  var regex = /pragma solidity ([><=\^]*)(\d+\.\d+\.\d+)?\s*([><=\^]*)(\d+\.\d+\.\d+)?;/
  var [ pragma,op1, min, op2, max] = code.match(regex)
  if (pragma) {
    if (max) {
      for (var i = 0, len = releases.length; i < len; i++) {
        if (releases[i].includes(max)) return releases[i]
      }
      return releases[0]
    } else if (min) {
      for (var i = 0, len = releases.length; i < len; i++) {
        if (releases[i].includes(min)) return releases[i]
      }
      return releases[0]
    }
    return releases[0]
  } else {
    return releases[0]
  }
}

function printError (e) {
  document.body.innerHTML = `<pre style="color:red">
    ${JSON.stringify(e, null, 2)}
  </pre>`
}
const sourcecode = require('./sampleContracts/Foo.sol')
