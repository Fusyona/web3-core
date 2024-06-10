import {
    Contract
} from "ethers";

import {
    Address,
    AddressOrAddressable,
    SupportedProvider
} from "../../types";
import BaseWrapper from "../../base-wrapper";
import { ERC20 } from "../../../typechain-types";
import { abi as ERC20ABI } from "../../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"

export class ERC20Wrapper extends BaseWrapper {
    constructor(
        address: AddressOrAddressable, 
        provider: SupportedProvider
    ) {
        const contract = new Contract(address, ERC20ABI, provider)
        super(contract, provider)
    }

    async transfer(to: Address, value: string) {
        return this.waitAndReturn(
            this.call.transfer(to, value)
        )
    }

    async approve(spender: Address, value: string) {
        return this.waitAndReturn(
            this.call.approve(spender, value)
        )
    }

    async transferFrom(from: Address, to: Address, value: string) {
        return this.waitAndReturn(
            this.call.transferFrom(from, to, value)
        )
    }   

    get call() {
        return this.contract as unknown as ERC20
    }
}