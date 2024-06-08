import {
    Contract
} from "ethers";

import {
    Address,
    AddressOrAddressable,
    SupportedProvider
} from "../../types";
import BaseWrapper from "../base-wrapper";
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

    async totalSupply(): Promise<bigint> {
        return this.call.totalSupply()
    }

    async balanceOf(account: Address): Promise<bigint> {
        return this.call.balanceOf(account)
    }

    async transfer(to: Address, value: bigint) {
        return this.call.transfer(to, value)
    }

    async allowance(owner: Address, spender: Address): Promise<bigint> {
        return this.call.allowance(owner, spender)
    }

    async approve(spender: Address, value: string) {
        return this.call.approve(spender, value)
    }

    async transferFrom(from: Address, to: Address, value: string) {
        return this.call.transferFrom(from, to, value)
    }   

    async name(): Promise<string> {
        return this.call.name()
    }

    async symbol(): Promise<string> {
        return this.call.symbol()
    }

    async decimals(): Promise<bigint> {
        return this.call.decimals()
    }

    get call() {
        return this.contract as unknown as ERC20
    }
}