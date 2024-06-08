//SPDX-License-Identifier: MIT
pragma solidity ^0.8.25 ;
pragma abicoder v2 ;

import { ERC721MintScheme } from "./ERC721MintScheme.sol" ;

abstract contract ERC721MintSchemeCounter is ERC721MintScheme {

    uint256 internal _tokenIdCounter ;

    function _getNextTokenId() internal virtual override returns(uint256 tokenId) {
        tokenId = _tokenIdCounter ;
        ++_tokenIdCounter ;
    }

}
