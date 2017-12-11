pragma solidity ^0.4.17;

contract Scream {

  event __Shout(string message);
  event __ShoutFrom(string owner, string message);
  event __ShoutTo(address indexed recipient, string message);

  address public owner;
  uint public creationTime;
  uint public fee;
  uint public idFee;
  mapping (address => uint) public balances;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  modifier costs(uint _amount) {

    if (msg.sender != owner) {
      require (balances[msg.sender] + msg.value >= _amount);
    }

    _; // do whatever that costs

    // charge user only after it's been done
    if (msg.sender != owner) {
        balances[msg.sender] += msg.value;
        balances[msg.sender] -= _amount;
    }

  }

  modifier onlyAfter(uint _time) {
    require(now >= _time);
    _;
  }

  function Scream() public {
    owner = msg.sender;
    creationTime = now;
    fee = 0.3 finney;   // this is about 10 USD cents
    idFee = 0.3 finney; // another 10 cents to identify yourself...
  }


  function shout(string message) payable costs(fee) public {
    __Shout(message);
  }

  function shout(string _owner, string message) payable costs(fee+idFee) public {
    __ShoutFrom(_owner, message);
  }

  function shout(address recipient, string message) payable costs(fee+idFee) public {
    __ShoutTo(recipient, message);
  }


  function emptyBalance() onlyOwner() public {
    msg.sender.transfer(this.balance);
  }

  function changeOwner(address newOwner) onlyOwner() onlyAfter(creationTime + 6 weeks) public {
    owner = newOwner;
  }

  function changeFee(uint newFee) onlyOwner() public {
    fee = newFee;
  }

  function changeIdFee(uint newIdFee) onlyOwner() public {
    idFee = newIdFee;
  }

  function() payable public {
    balances[msg.sender] += msg.value;
  }

}
