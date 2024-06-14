// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.25;

import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

contract ExternalMulticall is Context {
    struct CallQuery {
        address target;
        bytes data;
    }

    constructor() {}

    function multicall(CallQuery[] calldata calls) external virtual returns (bytes[] memory results) {
        bytes memory context = msg.sender == _msgSender()
            ? new bytes(0)
            : msg.data[msg.data.length - _contextSuffixLength():];

            results = new bytes[](calls.length);
            for (uint256 i; i < calls.length; ++i) {
                results[i] = Address.functionCall(calls[i].target, bytes.concat(calls[i].data, context));
            }

            return results;
    }
}