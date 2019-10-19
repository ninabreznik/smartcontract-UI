module.exports = `
pragma solidity >=0.4.0 <0.7.0;
contract Coin {
  address public minter;
  mapping (address => uint) public balances;
  constructor() public { minter = msg.sender; }
  event Sent(address from, address to, uint amount);
  // Sends an amount of existing coins
  // from any caller to an address
  function send (address receiver, uint amount) public {
    balances[msg.sender] -= amount;
    // short for: balances[msg.sender] = balances[msg.sender] - amount;
    balances[receiver] += amount;
    // short for: balances[receiver] = balances[receiver] + amount;
    emit Sent(msg.sender, receiver, amount);
    // arguments (from, to, amount) to track transactions
  }
  // Sends an amount of newly created coins to an address
  // Can only be called by the contract creator
  function mint (address receiver, uint amount) public {
    balances[receiver] += amount;
    // short for: balances[receiver] = balances[receiver] + amount;
  }
}
`
