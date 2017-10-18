pragma solidity ^0.4.17;

contract Scream {

  event __Shout(string message);
  event __ShoutFrom(string owner, string message);

  address public owner;
  uint public creationTime;
  uint public fee;
  uint public idfee;
  mapping (address => uint) public balances;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier costs(uint _amount) {
    if ((msg.sender != owner) || (balances[msg.sender] < _amount))
      require (msg.value >= _amount);
    _;
  }

  modifier onlyAfter(uint _time) {
    require(now >= _time);
    _;
  }

  function Scream() public {
    owner = msg.sender;
    creationTime = now;
    fee = 0.3 finney;   // this is about 10 USD cents
    idfee = 0.3 finney; // another 10 cents to identify yourself...
  }

  function shout(string message) payable costs(fee) public {
    __Shout(message);
  }

  function shout(string _owner, string message) payable costs(fee+idfee) public {
    __ShoutFrom(_owner, message);
  }

  function emptyBalance() onlyOwner() public {
    msg.sender.transfer(this.balance);
  }

  function changeOwner(address _newOwner) onlyOwner() onlyAfter(creationTime + 6 weeks) public {
    owner = _newOwner;
  }

  function changeFee(uint newFee) onlyOwner() public {
    fee = newFee;
  }

  function changeIDfee(uint newIDFee) onlyOwner() public {
    idfee = newIDFee;
  }

}
