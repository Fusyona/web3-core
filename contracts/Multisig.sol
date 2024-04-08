// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

uint8 constant SIGN_COUNT = 3;

contract Multisig {

    address[] public signers;
    mapping(bytes32 functionSelector => address[SIGN_COUNT] signers) signatures;

    event CallSigned(address signer, bytes32 call);
    event CallExecuted(bytes32 paramsHash, bytes result);
    event CallExecuted(bytes32 paramsHash);

    error InvalidSigner(address signer);
    error InvalidCall(bytes data);
    error MultisigRequired();
    error AlreadySignedCall(address signer, bytes32 call);
    
    modifier useMultisig(bytes memory funcData) {
        bytes32 data = keccak256(funcData);

        if (_isOnCallStack(data, msg.sender)) revert AlreadySignedCall(msg.sender, data);

        uint8 signatureCount = _getSignatureCount(data);

        if (signatureCount + 1 >= SIGN_COUNT) {
            _cleanSignatures(data);
            _;
            emit CallExecuted(data);
        } else {
            signatures[data][signatureCount] = msg.sender;

            emit CallSigned(msg.sender, data);
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
        bytes32 data = keccak256(funcData);

        if (_isOnCallStack(data, msg.sender)) revert AlreadySignedCall(msg.sender, data);

        emit CallSigned(msg.sender, data);
        
        uint8 signatureCount = _getSignatureCount(data);

        if (signatureCount + 1 >= SIGN_COUNT) {
            _cleanSignatures(data);
            bytes memory result = Address.functionCall(address(this), funcData);
            emit CallExecuted(data, result);
        } else {
            signatures[data][signatureCount] = msg.sender;
        }
    }

    function _isOnCallStack(bytes32 data, address signer) internal view returns (bool) {
        address[SIGN_COUNT] memory callSigners = signatures[data];

        for (uint8 i; i < callSigners.length; ++i) {
            if (callSigners[i] == signer) return true;
        }

        return false;
    }

    function _isSigner(address addr) internal view returns (bool) {
        uint256 signersLength = signers.length;
        for (uint256 i; i < signersLength; ++i) {
            if (signers[i] == addr) return true; 
        }

        return false;
    }

    function _getSignatureCount(bytes32 data) internal view returns (uint8 count) {
        address[SIGN_COUNT] memory callSigners = signatures[data];

        for (uint8 i; i < SIGN_COUNT; ++i) {
            if (callSigners[i] != address(0)) ++count;
        }
    }

    function _cleanSignatures(bytes32 data) internal {
        for (uint8 i; i < SIGN_COUNT; ++i) {
            delete signatures[data][i];
        }
    }

}
