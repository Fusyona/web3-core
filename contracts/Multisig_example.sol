// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.24;

import "../Multisig.sol";

contract MSExample is Multisig {
    constructor(address[] memory signers) Multisig(signers) {}

    function helloWorld() public view requireMultisig returns (string memory) {
        return "Hello World";
    }
}