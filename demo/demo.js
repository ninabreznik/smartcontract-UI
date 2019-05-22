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
const sourcecode = `
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract myTest {

  bool b;
  int8 i8;
  int256 i256;
  bytes16[3] seeds;
  uint j;
  struct Contractor {
    string name;
    bytes32 email;
    int id;
    bool active;
  }

  mapping(address => Contractor) contractors;
  address[] contractor_addresses;

  function returnBool (bool _b) public view returns (bool b) {
    b = _b;
    return b;
  }

  function returnInt8 (int8 _i8) public view returns (int8 i8) {
    i8 = _i8;
    return i8;
  }

  function returnInt256 (int256 _i256) public view returns (int256 i256) {
    i256 = _i256;
    return i256;
  }

  function returnUint (uint _j) public view returns (uint j) {
    j = _j;
    return j;
  }

  function activateContractor (address contractor_address, int _id, bytes32 _email) public {
    Contractor storage contractor = contractors[contractor_address];
    contractor.name = 'myname';
    contractor.email = _email;
    contractor.active = true;
    contractor.id = _id;
    contractor_addresses.push(contractor_address);
  }

  function getAllContractors () public view returns (Contractor[] memory) {
    uint len = contractor_addresses.length;
  	Contractor[] memory result = new Contractor[](len);
    for (uint i = 0; i < len; i++) {
      result[i] = contractors[contractor_addresses[i]];
    }
    return result;
  }

}

`
