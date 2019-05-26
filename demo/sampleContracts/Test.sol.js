module.exports = `
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract myTest {

  bool public b;

  int8 public i8;
  int public I;

  uint8 public ui8;
  uint16 public ui16;
  uint public ui;
  uint32 public ui32;

  int256 i256;
  bytes16[3] seeds;
  uint j;
  struct Contractor {
    string name;
    string email;
    int id;
    bool active;
  }

  mapping(address => Contractor) contractors;
  address[] contractor_addresses;

  function returnBool (bool _b) public returns (bool b_) {
    b = _b;
    return b_;
  }

  function returnInt8 (int8 _i8) public returns (int8 i8_) {
    i8 = _i8;
    return i8_;
  }

  function returnInt256 (int256 _i256) public returns (int256 i256_) {
    i256 = _i256;
    return i256_;
  }

  function returnUint (uint _j) public returns (uint j_) {
    j = _j;
    return j_;
  }

  function activateContractor (address contractor_address, int _id, string memory _email) public {
    Contractor storage contractor = contractors[contractor_address];
    contractor.name = 'myname';
    contractor.email = _email;
    contractor.active = true;
    contractor.id = _id;
    contractor_addresses.push(contractor_address);
  }

  function getAllContractors () public returns (Contractor[] memory) {
    uint len = contractor_addresses.length;
  	Contractor[] memory result = new Contractor[](len);
    for (uint i = 0; i < len; i++) {
      result[i] = contractors[contractor_addresses[i]];
    }
    return result;
  }

}`
