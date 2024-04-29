//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19 ;
pragma abicoder v2 ;


import "./ERC721MintSchemeCounter.sol" ;


abstract contract ERC721MintSchemeCounterCaped is ERC721MintSchemeCounter {
    
    error CapExceeded() ;

    uint256 cap ;

    function _checkTokenId(uint256 tokenId) internal virtual override {
        if (tokenId > cap ) revert CapExceeded() ;
    }

}
