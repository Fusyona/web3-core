// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/interfaces/IERC1363.sol";
import "@openzeppelin/contracts/interfaces/IERC1363Receiver.sol";

contract MockERC20Payable is ERC20, ERC20Burnable, IERC1363 {
    error ERC1363EOAReceiver(address);
    error ERC1363InvalidReceiver(address);

    constructor(
        address[] memory beneficiaries
    ) ERC20("Payable Token", "PTKN") {
        for (uint i = 0; i < beneficiaries.length; i++) {
            _mint(beneficiaries[i], 100_000_000_000 * 10 ** decimals());
        }
    }

    function transferAndCall(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        require(transfer(to, amount), "ERC1363: transfer failed");
        _checkOnTransferReceived(msg.sender, to, amount, "");
        return true;
    }

    function transferAndCall(
        address to,
        uint256 amount,
        bytes memory data
    ) public virtual override returns (bool) {
        require(transfer(to, amount), "ERC1363: transfer failed");
        _checkOnTransferReceived(msg.sender, to, amount, data);
        return true;
    }

    function transferFromAndCall(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        require(
            transferFrom(from, to, amount),
            "ERC1363: transferFrom failed"
        );
        return true;
    }

    function transferFromAndCall(
        address from,
        address to,
        uint256 amount,
        bytes memory data
    ) public virtual override returns (bool) {
        require(
            transferFrom(from, to, amount),
            "ERC1363: transferFrom failed"
        );
        return true;
    }

    function approveAndCall(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        require(approve(spender, amount), "ERC1363: approve failed");
        return true;
    }

    function approveAndCall(
        address spender,
        uint256 amount,
        bytes memory data
    ) public virtual override returns (bool) {
        require(approve(spender, amount), "ERC1363: approve failed");
        return true;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IERC1363).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    function _checkOnTransferReceived(address from, address to, uint256 value, bytes memory data) private {
        if (to.code.length == 0) {
            revert ERC1363EOAReceiver(to);
        }

        try IERC1363Receiver(to).onTransferReceived(_msgSender(), from, value, data) returns (bytes4 retval) {
            if (retval != IERC1363Receiver.onTransferReceived.selector) {
                revert ERC1363InvalidReceiver(to);
            }
        } catch (bytes memory reason) {
            if (reason.length == 0) {
                revert ERC1363InvalidReceiver(to);
            } else {
                assembly {
                    revert(add(32, reason), mload(reason))
                }
            }
        }
    }
}