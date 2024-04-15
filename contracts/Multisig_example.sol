// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import "./Multisig.sol";

contract MSExample is Multisig {
    constructor(address[] memory signers, uint256 signCount) Multisig(signers, signCount) {}

    function modifierHelloWorld() 
        public 
        onlySigner
        useMultisig(abi.encodeWithSignature("modifierHelloWorld()")) 
        returns (string memory result) 
    {
        result = "Hello World";
    }
}
