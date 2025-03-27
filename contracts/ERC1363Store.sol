// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/interfaces/IERC1363Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IERC1155Mintable.sol";

contract ERC1363Store is AccessControl, IERC1363Receiver {
    struct ShopItem {
        uint256 price;
    }

    address public collectionAddress;
    address public tokenAddress;
    bytes32 public MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    
    mapping (uint256 id => ShopItem) public shopItems;

    event ShopItemUpdated(uint256 id, ShopItem shopItem);
    event ItemSold(uint256 id, uint256 amount, address receiver);

    error InsufficientFunds();
    error InvalidTokenTransfer();
    error InvalidDataParams();

    constructor(address _collectionAddress, address _tokenAddress) {
        collectionAddress = _collectionAddress;
        tokenAddress = _tokenAddress;
        _grantRole(MODERATOR_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /* @dev Update the data of an item in the store, currently only price is relevant */
    function updateShopItem(uint256 id, ShopItem memory shopItem) onlyRole(MODERATOR_ROLE) external {
        shopItems[id] = shopItem;
        emit ShopItemUpdated(id, shopItem);
    }

    /* @dev Implement the {IERC1363Receiver.onTransferReceived} function to buy items from the store on hook calls */
    function onTransferReceived(
        address operator,
        address from,
        uint256 amount,
        bytes calldata data
    ) external override returns (bytes4) {
        require(_msgSender() == tokenAddress, InvalidTokenTransfer());

        (uint256 id, uint256 itemAmount, address receiver) = abi.decode(data, (uint256, uint256, address));
        require(id > 0 && itemAmount > 0 && receiver != address(0), InvalidDataParams());

        ShopItem memory shopItem = shopItems[id];
        uint256 totalCost = shopItem.price * itemAmount;
        require(totalCost <= amount, InsufficientFunds());

        IERC1155Mintable(collectionAddress).mint(receiver, id, itemAmount, "");
        emit ItemSold(id, itemAmount, receiver);
        return IERC1363Receiver.onTransferReceived.selector;
    }
}
