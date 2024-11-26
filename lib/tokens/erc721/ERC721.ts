import ERC721NoWallet from "./ERC721NoWallet";
import { Address, SupportedProvider } from "../../types";
import { ContractRunner } from "ethers";

export default class ERC721 extends ERC721NoWallet {
    constructor(address: Address, chainId: number, runner?: ContractRunner) {
        super(address, chainId, runner);
    }


    static async fromAddressAndProvider(address: Address, provider: SupportedProvider) {
        const { chainId } = await provider.getNetwork();
        const runner = await provider.getSigner()
        return new ERC721(address, Number(chainId), runner);
    }

    async approve(spender: Address, tokenId: bigint) {
        return this.connectSignerAndTransact(c => c.approve(spender, tokenId))
    }

    async setApprovalForAll(operator: Address, approved: boolean) {
        return this.connectSignerAndTransact(c => c.setApprovalForAll(operator, approved))
    }

    async transferFrom(from: Address, to: Address, tokenId: bigint) {
        return this.connectSignerAndTransact(c => c.transferFrom(from, to, tokenId))
    }
}