// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.8.0;

contract Multisig {
    uint8 constant SIGN_COUNT = 3;

    address[] public signers;

    mapping(bytes32 => address[SIGN_COUNT]) callSignatures;

    function _isOnCallStack(bytes32 data, address signer) internal view returns (bool) {
        address[SIGN_COUNT] memory callSigners = callSignatures[data];

        for (uint8 i = 0; i < callSigners.length; i++) {
            if (callSigners[i] == signer) return true;
        }

        return false;
    }

    function _isSigner(address addr) internal view returns (bool) {
        for (uint i = 0; i < signers.length; i++) {
            if (signers[i] == addr) return true; 
        }

        return false;
    }

    function _getSignatureCount(bytes32 data) internal view returns (uint8 count) {
        address[SIGN_COUNT] memory callSigners = callSignatures[data];

        for (uint8 i = 0; i < SIGN_COUNT; i++) {
            if (callSigners[i] != address(0)) count++;
        }
    }

    function signCall(bytes32 data) public onlySigner {
        require(!_isOnCallStack(data, msg.sender), "sign for call already sent");

        emit CallSigned(msg.sender, data);
        
        uint8 signatureCount = _getSignatureCount(data);

        if (signatureCount + 1 >= SIGN_COUNT) {
            // TODO: Implement function call
            emit CallExecuted(data);

            for (uint8 i = 0; i < SIGN_COUNT; i++) {
                callSignatures[data][i] = address(0);
            }
        } else {
            callSignatures[data][signatureCount - 1] = msg.sender;
        }
    } 

    modifier onlySigner() {
        require(_isSigner(msg.sender), "sender is not a signer");
        _;
    }

    modifier requireMultisig() {
        // TODO: Implement restriction for direct call        
        _;
    }

    event CallSigned(address signer, bytes32 call);
    event CallExecuted(bytes32 call);
}