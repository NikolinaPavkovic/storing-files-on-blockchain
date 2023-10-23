const FaucetContract = artifacts.require("Faucet"); // gets bytecode of smartcontract

module.exports = function(deployer) {
    deployer.deploy(FaucetContract);
}