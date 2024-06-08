import {
    Contract
} from "ethers";

import {
    Address,
    AddressOrAddressable,
    SupportedProvider
} from "./types";
import BaseWrapper from "./wrappers/base-wrapper";
import { ERC20, ERC721 } from "../typechain-types";
import { abi as ERC20ABI } from "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"
import { abi as ERC721ABI } from "../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json"

// TODO: fill tx data
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

export class ERC721Wrapper extends BaseWrapper {
    constructor(
        address: AddressOrAddressable, 
        provider: SupportedProvider
    ) {
        const contract = new Contract(address, ERC721ABI, provider)
        super(contract, provider)
    }

    async balanceOf(owner: Address): Promise<bigint> {
        return this.call.balanceOf(owner)
    }

    async ownerOf(tokenId: number): Promise<Address> {
        return this.call.ownerOf(tokenId)
    }

    async transferFrom(from: Address, to: Address, tokenId: number) {
        return this.call.transferFrom(from, to, tokenId)
    }

    async approve(to: Address, tokenId: number) {
        return this.call.approve(to, tokenId)
    }

    async setApprovalForAll(operator: Address, approved: boolean) {
        return this.call.setApprovalForAll(operator, approved)
    }

    async getApproved(tokenId: number): Promise<Address> {
        return this.call.getApproved(tokenId)
    }

    async isApprovedForAll(owner: Address, operator: Address): Promise<boolean> {
        return this.call.isApprovedForAll(owner, operator)
    }

    get call() {
        return this.contract as unknown as ERC721
    }
}
