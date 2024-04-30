// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol" ;
import { CooldownParametric } from "./CooldownParametric.sol" ;

abstract contract CooldownOwnable is CooldownParametric, Ownable {

    constructor(uint256 cooldownTime, address owner) CooldownParametric(cooldownTime) Ownable(owner) {}

    function setCooldownTime(uint256 cooldownTime) external onlyOwner {
        _setCooldownTime(cooldownTime) ; 
    }

}
