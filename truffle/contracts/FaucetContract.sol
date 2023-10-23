// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    uint public numOfFunders;
    mapping(address => bool) public funders;
    mapping(uint => address) public lutFunders;

    modifier limitWithdraw(uint withdrawAmount) {
        require(withdrawAmount <= 1 ether, "Cannot withdraw more then 1 ether");
        _;
    }

    function emitLog() public override pure returns (bytes32) {
        return "Hello world";
    }

    receive() external payable {}

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function addFunds() external payable {
        address funder = msg.sender;
        if (!funders[funder]) {
            funders[funder] = true;
            lutFunders[numOfFunders++] = funder;
        }
    }

    function test1() external onlyOwner {}

    function test2() external onlyOwner {}

    function withdraw(uint withdrawAmount) external limitWithdraw(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFUnders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return lutFunders[index];
    }
}

//const instance = await Faucet.deployed()
//instance.addFunds({value: "2000000", from: accounts[0]})