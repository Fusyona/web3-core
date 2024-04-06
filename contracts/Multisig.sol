// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

contract Multisig {
    uint8 constant SIGN_COUNT = 3;

    address[] public signers;
    mapping(bytes32 functionSelector => address[SIGN_COUNT] signers) signatures;

    error InvalidSigner(address signer);
    error InvalidCall(bytes data);
    error MultisigRequired();
    error AlreadySignedCall(address signer, bytes32 call);

    event CallSigned(address signer, bytes32 call);
    event CallExecuted(bytes32 paramsHash, bytes result);
    event CallExecuted(bytes32 paramsHash);
    
    constructor(address[] memory _signers) {
        signers = _signers;
    }

    modifier useMultisig(bytes memory funcData) {
        bytes32 data = keccak256(funcData);

        if (_isOnCallStack(data, msg.sender)) revert AlreadySignedCall(msg.sender, data);

        uint8 signatureCount = _getSignatureCount(data);

        if (signatureCount + 1 >= SIGN_COUNT) {
            for (uint8 i; i < SIGN_COUNT; ++i) {
                delete signatures[data][i];
            }

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

    modifier requireMultisig() {
        if (msg.sender != address(this)) revert MultisigRequired();    
        _;
    }

    function _isOnCallStack(bytes32 data, address signer) internal view returns (bool) {
        address[SIGN_COUNT] memory callSigners = signatures[data];

        for (uint8 i; i < callSigners.length; ++i) {
            if (callSigners[i] == signer) return true;
        }

        return false;
    }

    function _isSigner(address addr) internal view returns (bool) {
        for (uint i; i < signers.length; ++i) {
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

    function signCall(bytes calldata funcData) public onlySigner {
        bytes32 data = keccak256(funcData);

        if (_isOnCallStack(data, msg.sender)) revert AlreadySignedCall(msg.sender, data);

        emit CallSigned(msg.sender, data);
        
        uint8 signatureCount = _getSignatureCount(data);

        if (signatureCount + 1 >= SIGN_COUNT) {
            // (bool success, bytes memory result) = address(this).call(funcData);
            bytes memory result = Address.functionCall(address(this), funcData);

            emit CallExecuted(data, result);

            for (uint8 i; i < SIGN_COUNT; ++i) {
                delete signatures[data][i];
            }
        } else {
            signatures[data][signatureCount] = msg.sender;
        }
    }
}
