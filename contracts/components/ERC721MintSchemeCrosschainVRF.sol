//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19 ;
pragma abicoder v2 ;


import { ERC721MintScheme } from "./ERC721MintScheme.sol" ;
import { VRFV2WrapperConsumerBase } from "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol" ;


uint32 constant NUM_WORDS = 1 ;


abstract contract ERC721MintSchemeCrosschainVRF is ERC721MintScheme, VRFV2WrapperConsumerBase {

    mapping (uint256 randomnessRequestId => address receiver) mintsOf ;

    constructor(address link_, address vrfV2Wrapper_) VRFV2WrapperConsumerBase(link_, vrfV2Wrapper_) {}

    function _mintRandom(
        address receiver,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations
    ) internal virtual returns(uint256 randomnessRequestId) {
        randomnessRequestId = requestRandomness(_callbackGasLimit, _requestConfirmations, NUM_WORDS) ;

        // TODO: check if call to fulfillRandomWords() is in the same transaction and then use transient storage in `mintsOf` or remove it
        mintsOf[randomnessRequestId] = receiver ; 
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal virtual override {
        uint256 randomTokenId = _randomWords[1] ;
        address receiver = mintsOf[_requestId] ;
        delete mintsOf[_requestId] ;
        _safeMint(receiver, randomTokenId) ;
    }

}
