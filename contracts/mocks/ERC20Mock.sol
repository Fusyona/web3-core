// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MockTokenA is ERC20 {
    constructor() ERC20("TokenA", "TKA") {}
}

contract MockTokenB is ERC20 {
    constructor() ERC20("TokenB", "TKB") {}
}