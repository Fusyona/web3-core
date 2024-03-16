// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.8.0;

contract Multisig {
    uint8 constant SIGN_COUNT = 3;

    address[] public signers;
    mapping(bytes32 => address[SIGN_COUNT]) callSignatures;

    error InvalidSigner(address signer);
    error AlreadySignedCall(address signer, bytes32 call);

    event CallSigned(address signer, bytes32 call);
    event CallExecuted(bytes32 call);
    
    constructor(address[] memory _signers) {
        signers = _signers;
    }

    modifier onlySigner() {
        if (!_isSigner(msg.sender)) revert InvalidSigner(msg.sender);
        _;
    }

    modifier requireMultisig() {
        // TODO: Implement restriction for direct call        
        _;
    }

    function _isOnCallStack(bytes32 data, address signer) internal view returns (bool) {
        address[SIGN_COUNT] memory callSigners = callSignatures[data];

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
        address[SIGN_COUNT] memory callSigners = callSignatures[data];

        for (uint8 i; i < SIGN_COUNT; ++i) {
            if (callSigners[i] != address(0)) ++count;
        }
    }

    function signCall(bytes32 data) public onlySigner {
        if (_isOnCallStack(data, msg.sender)) revert AlreadySignedCall(msg.sender, data);

        emit CallSigned(msg.sender, data);
        
        uint8 signatureCount = _getSignatureCount(data);

        if (signatureCount + 1 >= SIGN_COUNT) {
            // TODO: Implement function call
            emit CallExecuted(data);

            for (uint8 i; i < SIGN_COUNT; ++i) {
                callSignatures[data][i] = address(0);
            }
        } else {
            callSignatures[data][signatureCount - 1] = msg.sender;
        }
    }
}
