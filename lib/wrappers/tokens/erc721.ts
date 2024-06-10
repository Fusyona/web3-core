import {
    Contract
} from "ethers";

import {
    Address,
    AddressOrAddressable,
    SupportedProvider
} from "../../types";
import BaseWrapper from "../../base-wrapper";
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

    async transferFrom(from: Address, to: Address, tokenId: string) {
        return this.waitAndReturn(
            this.call.transferFrom(from, to, tokenId)
        )
    }

    async approve(to: Address, tokenId: string) {
        return this.waitAndReturn(
            this.call.approve(to, tokenId)
        )
    }

    async setApprovalForAll(operator: Address, approved: boolean) {
        return this.waitAndReturn(
            this.call.setApprovalForAll(operator, approved)
        )
    }

    get call() {
        return this.contract as unknown as ERC721
    }
}
