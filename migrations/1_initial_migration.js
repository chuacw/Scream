var Migrations = artifacts.require("./Migrations.sol");
var Scream = artifacts.require("./Scream.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Scream);
};
