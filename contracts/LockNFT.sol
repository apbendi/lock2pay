pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract LockNFT is ERC721Full {

  address public owner;
  address public minter;

  constructor() public ERC721Full("LockNFT", "LOCK") {
    owner = msg.sender;
  }

  function setMinter(address _minter) public onlyOwner {
    minter = _minter;
  }

  function mint(address receiver) public onlyMinter {
    _mint(receiver, totalSupply());
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "NOT_OWNER");
    _;
  }

  modifier onlyMinter() {
    require(msg.sender == minter, "NOT_MINTER");
    _;
  }
}
