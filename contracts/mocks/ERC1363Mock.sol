// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import "@openzeppelin/contracts/interfaces/IERC1363.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./ERC20Mock.sol";

contract ERC1363Mock is ERC20Mock, IERC1363 {
    constructor(
        address to,
        uint256 amount,
        string memory name,
        string memory symbol
    ) ERC20Mock(to, amount, name, symbol) {}

    function transferAndCall(address to, uint256 amount) external returns (bool) {
        return true;
    }

    function transferAndCall(address to, uint256 amount, bytes memory data) external returns (bool) {
        return true;
    }

    function transferFromAndCall(address from, address to, uint256 amount) external returns (bool) {
        return true;
    }

    function transferFromAndCall(address from, address to, uint256 amount, bytes memory data) external returns (bool) {
        return true;
    }

    function approveAndCall(address spender, uint256 amount) external returns (bool) {
        return true;
    }

    function approveAndCall(address spender, uint256 amount, bytes memory data) external returns (bool) {
        approve(spender, amount);
        Address.functionCall(spender, data);
        
        return true;
    }

    function supportsInterface(bytes4 interfaceId) external view override returns (bool) {
        return interfaceId == type(IERC1363).interfaceId;
    }
}
