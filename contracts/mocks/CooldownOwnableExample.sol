// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import "../CooldownOwnable.sol";

contract CooldownOwnableExample is CooldownOwnable {

    constructor(uint256 cooldown, address owner) CooldownOwnable(cooldown, owner) {}

    function helloWorld() public requireCooldown returns (string memory) {
        _updateCooldown(msg.sender);
        return "Hello World";
    }

    function helloWorld2() public returns (string memory) {
        _checkCooldown(msg.sender);
        _updateCooldown(msg.sender);
        return "Hello World";
    }

}
