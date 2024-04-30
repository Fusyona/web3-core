// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

type CallQuery {
    address target;
    bytes data;
}

abstract contract MulticallProxy {
    function multicall(CallQuery[] calldata calls) external virtual returns (bytes[] memory results) {
        bytes memory context = msg.sender == _msgSender()
            ? new bytes(0)
            : msg.data[msg.data.length - _contextSuffixLenght():];

            results = new bytes[](data.length);
            for (uint256 i; i < data.length; ++i) {
                results[i] = Address.functionDelegateCall(calls[i].target, bytes.concat(data[i], context));
            }

            return results;
    }
}