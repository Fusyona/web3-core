pragma solidity ^8.0.26;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/interfaces/IERC1363Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract ERC1363Store is AccessControl, IERC1363Receiver {
    struct ShopItem {
        uint256 price;
    }

    public address collectionAddress;
    public address tokenAddress;
    public bytes32 MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    
    public mapping (uint256 => ShopItem) public shopItems;

    constructor(address _collectionAddress, address _tokenAddress) {
        collectionAddress = _collectionAddress;
        tokenAddress = _tokenAddress;
        _setOwner(msg.sender);
        _grantRole(MODERATOR_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    external function updateShopItem(uint256 id, ShopItem memory shopItem) onlyRole(MODERATOR_ROLE) {
        shopItems[id] = shopItem;
    }

    function onTransferReceived(
        address operator,
        address from,
        uint256 amount,
        bytes calldata data
    ) external override returns (bytes4) {
        return IERC1363Receiver.onTransferReceived.selector;
    }
}