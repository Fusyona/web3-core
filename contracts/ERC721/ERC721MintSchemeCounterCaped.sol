//SPDX-License-Identifier: MIT
pragma solidity ^0.8.25 ;
pragma abicoder v2 ;


import "./ERC721MintSchemeCounter.sol" ;


abstract contract ERC721MintSchemeCounterCaped is ERC721MintSchemeCounter {
    
    error CapExceeded() ;

    uint256 internal _cap ;

    constructor(uint256 cap_) {
        _cap = cap_ ;
    }

    function _preMintHook(uint256 tokenId) internal virtual override {
        if (tokenId >= _cap ) revert CapExceeded() ;
    }

}
