// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract ERC20Mock is ERC20 {
    constructor(address to, uint256 amount, string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(to, amount);
    }
}