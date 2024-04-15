// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./Cooldown.sol" ;

abstract contract CooldownParametric is Cooldown {

    constructor(uint256 cooldownTime) Cooldown(cooldownTime) {}

    function cooldownOf(address sender) external view returns (uint256) {
        return _cooldowns[sender] ;
    }

    function _setCooldownTime(uint256 cooldownTime) internal {
        _cooldownTime = cooldownTime ; 
    }

}
