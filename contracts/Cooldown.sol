// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

abstract contract Cooldown {

    uint256 internal _cooldownTime ;
    mapping (address sender => uint256) internal _cooldowns ;

    error InsufficientCooldown() ;

    modifier requireCooldown() {
        _checkCooldown(msg.sender) ;
        _ ;
    }

    constructor(uint256 cooldownTime) {
        _cooldownTime = cooldownTime ;
    }

    function _updateCooldown(address sender) internal {
        _cooldowns[sender] = block.timestamp ;
    }

    function _checkCooldown(address sender) internal view {
        uint256 userCooldown = _cooldowns[sender] ;
        if (
            userCooldown > 0 &&
            block.timestamp - userCooldown < _cooldownTime
        ) revert InsufficientCooldown() ;
    }

}
