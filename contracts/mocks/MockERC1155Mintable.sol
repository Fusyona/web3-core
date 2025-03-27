//SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../IERC1155Mintable.sol";

contract MockERC1155Mintable is ERC1155, AccessControl, IERC1155Mintable {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    
    struct Nft {
        uint256 cap;
        uint256 totalMinted;
    }

    mapping(uint256 id => Nft) public nfts;

    event NftCreated(uint256 indexed id, uint256 cap);

    error NftAlreadyExists();
    error NftDoesNotExist();
    error CapExceeded();

    constructor(string memory uri) ERC1155(uri) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createNft(uint256 id, uint256 cap) public onlyRole(CREATOR_ROLE) {
        if (nfts[id].cap != 0) revert NftAlreadyExists();
        
        nfts[id] = Nft(cap, 0);
        emit NftCreated(id, cap);
    }

    /**
     * @param account Address that will receive the tokens
     * @param id NFT ID
     * @param amount Number of NFTs to be minted
     * @param data Additional NFT data
     */
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override onlyRole(MINTER_ROLE) {
        Nft memory nftData = nfts[id];
        
        if (nftData.cap == 0) revert NftDoesNotExist();
        if (nftData.totalMinted + amount > nftData.cap) revert CapExceeded();
        
        nfts[id].totalMinted += amount;
        _mint(account, id, amount, data);
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC1155, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
