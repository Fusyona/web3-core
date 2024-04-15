// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import "../Cooldown.sol";

contract CooldownExample is Cooldown {

    constructor(uint256 cooldownTime) Cooldown(cooldownTime) {}

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
