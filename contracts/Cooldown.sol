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

    function _checkCooldown(address sender) internal {
        uint256 userCheckpoint = _cooldowns[sender] ;
        if (
            userCheckpoint > 0 &&
            block.timestamp - userCheckpoint < _cooldownTime
        ) revert InsufficientCooldown() ;
        _updateCooldown(sender) ;
    }

}
