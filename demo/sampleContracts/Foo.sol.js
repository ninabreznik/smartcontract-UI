module.exports = `
pragma solidity >=0.5.0 <0.7.0;
contract TestPayable {
    function Test() public payable returns (uint) {
        return 1;
    }
}
`
