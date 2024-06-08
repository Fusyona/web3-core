//SPDX-License-Identifier: MIT
pragma solidity ^0.8.25 ;
pragma abicoder v2 ;


import { ERC721MintSchemeCrosschain } from "./ERC721MintSchemeCrosschain.sol" ;


abstract contract ERC721MintSchemeCrosschainCaped is ERC721MintSchemeCrosschain {

    error CapExceeded() ;

    uint256 internal _cap ;

    constructor(uint256 cap_) {
        _cap = cap_ ;
    }

    function _preMintHook(uint256 /*tokenId*/) internal virtual override {
        if (_tokenIdCounter >= _cap) revert CapExceeded() ;
    }

}
