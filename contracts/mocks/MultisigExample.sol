// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import "../Multisig.sol";

interface IMSExample {
    function sumTwoNumbers(uint256 x, uint256 y) external returns (uint256 result);
    function modifierHelloWorld() external returns (string memory result);
}

contract MSExample is Multisig {
    constructor(address[] memory signers, uint256 signCount) Multisig(signers, signCount) {}

    function modifierHelloWorld() 
        external 
        onlySigner
        onlyMultisig(abi.encodeCall(IMSExample.modifierHelloWorld, ())) 
        returns (string memory result) 
    {
        result = "Hello World";
    }

    function sumTwoNumbers(uint256 x, uint256 y) 
        external
        onlySigner
        onlyMultisig(abi.encodeCall(IMSExample.sumTwoNumbers, (x, y)))
        returns (uint256 result) 
    {
        result = x + y;   
    }
}
