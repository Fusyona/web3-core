// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.8.0;

contract Multisig {
    uint8 signCount = 3;
    address[] public signers;
    mapping(bytes32 => uint8) callSignatures;

    function _isSigner(address addr) internal view returns (bool) {
        for (uint i = 0; i < signers.length; i++) {
            if (signers[i] == addr) return true; 
        }

        return false;
    }

    function signCall(bytes32 data) public onlySigner {
        // TODO: Implement multi self signing check
        uint8 signatures = callSignatures[data] + 1;
        emit CallSigned(msg.sender, data);
        
        if (signatures >= signCount) {
            // TODO: Implement function call
            emit CallExecuted(data);
            callSignatures[data] = 0;
        } else {
            callSignatures[data] = signatures;
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