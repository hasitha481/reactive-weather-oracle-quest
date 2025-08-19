// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestDeploy {
    string public message = "Hello World";
    
    function getMessage() external view returns (string memory) {
        return message;
    }
}