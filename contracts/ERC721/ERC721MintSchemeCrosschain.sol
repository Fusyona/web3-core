//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19 ;
pragma abicoder v2 ;


import { ERC721MintSchemeCounter } from "./ERC721MintSchemeCounter.sol" ;


abstract contract ERC721MintSchemeCrosschain is ERC721MintSchemeCounter {

    /**
     * @dev These isn't safe randomness, what we are looking for here is a collision
     *      resistant id even if it  could be know ahead of time
     */
    function _getNextTokenId() internal virtual override returns(uint256) {
        return uint256(keccak256(bytes.concat(
            bytes32(super._getNextTokenId()),
            bytes32(block.chainid),
            bytes32(block.timestamp),
            bytes32(block.prevrandao)
        ))) ;
    }

}
