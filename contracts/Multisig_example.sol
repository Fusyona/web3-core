// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import "./Multisig.sol";

contract MSExample is Multisig {
    constructor(address[] memory signers) Multisig(signers) {}

    function helloWorld() public view onlyMultisig returns (string memory) {
        return "Hello World";
    }

    function _modifierHelloWorldAdapter() internal pure returns (bytes memory) {
        return abi.encodeWithSignature("modifierHelloWorld()");
    }

    function modifierHelloWorld() public onlySigner useMultisig(_modifierHelloWorldAdapter()) returns (string memory result) {
        result = "Hello World";
    }
}
