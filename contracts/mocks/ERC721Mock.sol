// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract ERC721Mock is ERC721 {
    constructor(address to, string memory name, string memory symbol) ERC721(name, symbol) {
        _mint(to, 1);
    }
}