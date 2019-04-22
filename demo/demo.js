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
pragma solidity ^0.4.11;

contract CrowdFunding {
    struct Funder {
        address addr;
        uint amount;
    }

    struct Campaign {
        address beneficiary;
        uint fundingGoal;
        uint numFunders;
        uint amount;
        mapping (uint => Funder) funders;
    }

    uint numCampaigns;
    mapping (uint => Campaign) public campaigns;

    function newCampaign(address beneficiary, uint goal) public returns (uint campaignID) {
        campaignID = numCampaigns++;
        campaigns[campaignID] = Campaign(beneficiary, goal, 0, 0);
    }

    function contribute(uint campaignID) public payable {
        Campaign storage c = campaigns[campaignID];

        c.funders[c.numFunders++] = Funder({addr: msg.sender, amount: msg.value});
        c.amount += msg.value;
    }

    function checkGoalReached(uint campaignID) public returns (bool reached) {
        Campaign storage c = campaigns[campaignID];
        if (c.amount < c.fundingGoal)
            return false;
        uint amount = c.amount;
        c.amount = 0;
        c.beneficiary.transfer(amount);
        return true;
    }
}
`
