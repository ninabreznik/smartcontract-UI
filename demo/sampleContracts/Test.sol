pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract myTest {

  bool b;
  int8 i8;
  int256 i256;
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
