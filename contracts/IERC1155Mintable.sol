// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

abstract contract IERC1155Mintable is IERC1155 {
    function mint(address account, uint256 id, uint256 amount, bytes memory data) virtual public;
}
