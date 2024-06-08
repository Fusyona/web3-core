import {
    Contract
} from "ethers";

import {
    Address,
    AddressOrAddressable,
    SupportedProvider
} from "../../types";
import BaseWrapper from "../base-wrapper";
import { ERC721 } from "../../../typechain-types";
import { abi as ERC721ABI } from "../../../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json"

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
