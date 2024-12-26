// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {
    constructor(
        address[] memory beneficiaries
    ) ERC721("Token", "TKN") {
        for (uint i = 0; i < beneficiaries.length; i++)
            _mint(beneficiaries[i], i+1);
    }
}
