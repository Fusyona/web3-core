//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19 ;
pragma abicoder v2 ;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol" ;

abstract contract ERC721MintScheme is ERC721 {

    function _mintTo(address receiver) internal virtual {
        uint256 tokenId = _getNextTokenId() ;
        _checkTokenId(tokenId);
        _safeMint(receiver, tokenId) ;
    }

    function _getNextTokenId() internal virtual returns(uint256 tokenId) ;

    function _checkTokenId(uint256 tokenId) internal virtual {}

}
