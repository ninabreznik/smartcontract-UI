module.exports = `
pragma solidity >=0.4.0 <0.7.0;

contract SimpleStorage {

    uint8 storedData;

    function set(uint8 x) public {
        storedData = x;
    }

    function get() public view returns (uint8) {
        return storedData;
    }

}`
