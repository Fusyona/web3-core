//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19 ;
pragma abicoder v2 ;


import { ERC721MintSchemeCounter } from "./ERC721MintSchemeCounter.sol" ;


abstract contract ERC721MintSchemeCrosschain is ERC721MintSchemeCounter {

    function _getNextTokenId() internal virtual override returns(uint256 tokenId) {
        tokenId = uint256(keccak256(bytes.concat(
            bytes32(super._getNextTokenId()),
            bytes32(block.prevrandao),
            bytes32(block.chainid),
            bytes32(tokensIdCounter)
        ))) ;
        ++tokensIdCounter ;
    }

}
