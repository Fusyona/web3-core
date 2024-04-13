// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";


contract Multisig {
    uint256 immutable SIGN_COUNT;  
    address[] public signers;
    mapping(bytes32 functionSelector => address[] signers) signatures;

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

        uint256 signatureCount = _getSignatureCount(callHash);

        if (signatureCount + 1 < SIGN_COUNT) {
            _addCallSigner(callHash, msg.sender, signatureCount);
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
    
    constructor(address[] memory _signers, uint256 _signCount) {
        signers = _signers;
        SIGN_COUNT = _signCount;
    }

    function signCall(bytes calldata funcData) public onlySigner {
        bytes32 callHash = keccak256(funcData);
        if (_isOnCallStack(callHash, msg.sender)) revert AlreadySignedCall(msg.sender, callHash);
        
        uint256 signatureCount = _getSignatureCount(callHash);

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
        address[] storage callSigners = signatures[callHash];

        for (uint256 i; i < callSigners.length; ++i) {
            if (callSigners[i] == signer) return true;
        }

        return false;
    }

    function _isSigner(address caller) internal view returns (bool) {
        uint256 signersLength = signers.length;
        for (uint256 i; i < signersLength; ++i) {
            if (signers[i] == caller) return true; 
        }

        return false;
    }

    function _getSignatureCount(bytes32 callHash) internal view returns (uint256 count) {
        address[] storage callSigners = signatures[callHash];

        for (uint256 i; i < SIGN_COUNT; ++i) {
            if (callSigners[i] != address(0)) ++count;
        }
    }

    function _cleanSignatures(bytes32 callHash) internal {
        for (uint256 i; i < SIGN_COUNT; ++i) {
            delete signatures[callHash][i];
        }
    }

    function _addCallSigner(bytes32 callHash, address signer, uint256 signCount) internal {
        signatures[callHash][signCount] = signer;
        emit CallSigned(signer, callHash);
    }
}
