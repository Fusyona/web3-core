// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

uint8 constant SIGN_COUNT = 3;

contract Multisig {

    address[] public signers;
    mapping(bytes32 functionSelector => address[SIGN_COUNT] signers) signatures;

    event CallSigned(address signer, bytes32 callHash);
    event CallExecuted(bytes32 paramsHash, bytes result);
    event CallExecuted(bytes32 paramsHash);

    error InvalidSigner(address signer);
    error InvalidCall(bytes data);
    error MultisigRequired();
    error AlreadySignedCall(address signer, bytes32 callHash);
    
    modifier useMultisig(bytes memory funcData) {
        bytes32 callHash = keccak256(funcData);

        if (_isOnCallStack(callHash, msg.sender)) revert AlreadySignedCall(msg.sender, callHash);

        uint8 signatureCount = _getSignatureCount(callHash);

        if (signatureCount + 1 < SIGN_COUNT) {
            signatures[callHash][signatureCount] = msg.sender;
            emit CallSigned(msg.sender, callHash);
        } else {
            _cleanSignatures(callHash);
            _;
            emit CallExecuted(callHash);
        }
    }

    modifier onlySigner() {
        if (!_isSigner(msg.sender)) revert InvalidSigner(msg.sender);
        _;
    }

    modifier onlyMultisig() {
        if (msg.sender != address(this)) revert MultisigRequired();    
        _;
    }
    
    constructor(address[] memory _signers) {
        signers = _signers;
    }

    function signCall(bytes calldata funcData) public onlySigner {
        bytes32 callHash = keccak256(funcData);
        if (_isOnCallStack(callHash, msg.sender)) revert AlreadySignedCall(msg.sender, callHash);
        
        uint8 signatureCount = _getSignatureCount(callHash);

        if (signatureCount + 1 < SIGN_COUNT) {
            signatures[callHash][signatureCount] = msg.sender;
            emit CallSigned(msg.sender, callHash);
        } else {
            _cleanSignatures(callHash);
            bytes memory result = Address.functionCall(address(this), funcData);
            emit CallExecuted(callHash, result);
        }
    }

    function _isOnCallStack(bytes32 callHash, address signer) internal view returns (bool) {
        address[SIGN_COUNT] memory callSigners = signatures[callHash];

        for (uint8 i; i < callSigners.length; ++i) {
            if (callSigners[i] == signer) return true;
        }

        return false;
    }

    function _isSigner(address signer) internal view returns (bool) {
        uint256 signersLength = signers.length;
        for (uint256 i; i < signersLength; ++i) {
            if (signers[i] == signer) return true; 
        }

        return false;
    }

    function _getSignatureCount(bytes32 callHash) internal view returns (uint8 count) {
        address[SIGN_COUNT] memory callSigners = signatures[callHash];

        for (uint8 i; i < SIGN_COUNT; ++i) {
            if (callSigners[i] != address(0)) ++count;
        }
    }

    function _cleanSignatures(bytes32 callHash) internal {
        for (uint8 i; i < SIGN_COUNT; ++i) {
            delete signatures[callHash][i];
        }
    }

}
