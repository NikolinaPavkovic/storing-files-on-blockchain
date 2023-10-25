// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract File{
    // ovaj deo preuzeti od Owned.sol
    address public owner;
    //mapping(address => string[]) public files; //user koji je uploadovao file i cid fajla
    //string[] public files;
    mapping(string => string) public files; //path=>filename
    string[] public mapKeys;
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            owner == msg.sender, 
            "Only owner can call this function"
        );
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner() {
        owner = newOwner;
    }

    function saveCID(string memory cid, string memory filename) external {
        require(bytes(files[cid]).length == 0, "File with CID already exists");
        files[cid] = filename;
        mapKeys.push(cid);
    }

    function getFiles() external view returns(string[] memory, string[] memory){
        string[] memory names = new string[](mapKeys.length);

        for(uint i = 0; i < mapKeys.length; i++) {
            names[i] = files[mapKeys[i]];
        }
        
        return (mapKeys, names);
    }

    function deleteFile(string memory cid) external {
        require(bytes(files[cid]).length > 0, "File with CID does not exist");
        delete files[cid];
        for (uint i = 0; i < mapKeys.length; i++) {
            if (keccak256(abi.encodePacked(mapKeys[i])) == keccak256(abi.encodePacked(cid))) {
                if (i < mapKeys.length - 1) {
                    mapKeys[i] = mapKeys[mapKeys.length - 1];
                }
                mapKeys.pop();
                break;
            }
        }
    }
}