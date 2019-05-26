module.exports = `pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;
contract InvoiceJournal {
  struct Contractor {
    string name;
    string email;
    string pubkey;
    bool active;
    bool exists;
  }
  struct Invoice {
    address contractor;
    uint invoice_id;
    string storage_url;
    string[] encrypted_decrypt_keys; // @TODO: not in use yet :-)
  }
  address accountant;
  mapping(address => Contractor) contractors;
  mapping(address => Invoice[]) invoices;
  address[] contractor_addresses;
  function getAllInvoices () public view returns (Invoice[][] memory) {
    uint len = contractor_addresses.length;
  	Invoice[][] memory result = new Invoice[][](len);
    for (uint i = 0; i < len; i++) {
      result[i] = invoices[contractor_addresses[i]];
    }
    return result;
  }
  function getAllContractors () public view returns (Contractor[] memory) {
    uint len = contractor_addresses.length;
  	Contractor[] memory result = new Contractor[](len);
    for (uint i = 0; i < len; i++) {
      result[i] = contractors[contractor_addresses[i]];
    }
    return result;
  }
  function getYourInvoices () public view returns (Invoice[] memory) {
    return invoices[msg.sender];
  }
  function activateContractor (address contractor_address) public {
    require(accountant == msg.sender, "Only an authorized accountant can add new contractors");
    Contractor storage contractor = contractors[contractor_address];
    contractor.active = true;
    if (!contractor.exists) {
      contractor.exists = true;
      contractor_addresses.push(contractor_address);
    }
  }
  function deactivateContractor (address contractor_address) public {
    require(accountant == msg.sender, "Only an authorized accountant can remove contractors");
    Contractor storage contractor = contractors[contractor_address];
    if (!contractor.active) return;
    contractor.active = false;
  }
  function updateContractor (string memory name, string memory email, string memory pubkey) public {
    Contractor storage contractor = contractors[msg.sender];
    require(contractor.active, "Unauthorized contractors cannot set their pubkeys");
    contractor.name = name;
    contractor.email = email;
    contractor.pubkey = pubkey;
  }
  function addInvoice (uint invoice_id, string memory storage_url, string[] memory keys) public returns (Contractor memory) {
    Contractor memory contractor = contractors[msg.sender];
    require(contractor.exists, "Unknown contractors cannot submit invoices");
    require(contractor.active, "Unauthorized contractors cannot submit invoices");
    Invoice[] storage _invoices = invoices[msg.sender];
    Invoice memory new_invoice = Invoice({
      contractor: msg.sender,
      invoice_id: invoice_id,
      storage_url: storage_url,
      encrypted_decrypt_keys: keys
    });
    _invoices.push(new_invoice);
    return contractor;
  }
  constructor () public {
    accountant = msg.sender;
  }
}`
