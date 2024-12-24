import ERC20NoWallet from "./ERC20NoWallet";
import { Address, SupportedProvider } from "../../types";
import { ContractRunner } from "ethers";

export default class ERC20 extends ERC20NoWallet {
    constructor(address: Address, chainId: number, runner?: ContractRunner) {
        super(address, chainId, runner);
    }


    static async fromAddressAndProvider(address: Address, provider: SupportedProvider) {
        const { chainId } = await provider.getNetwork();
        const runner = await provider.getSigner()
        return new ERC20(address, Number(chainId), runner);
    }

    async approve(spender: Address, amount: bigint) {
        return this.connectSignerAndTransact(c => c.approve(spender, amount))
    }

    async transfer(to: Address, amount: bigint) {
        return this.connectSignerAndTransact(c => c.transfer(to, amount))
    }

    async transferFrom(from: Address, to: Address, amount: bigint) {
        return this.connectSignerAndTransact(c => c.transferFrom(from, to, amount))
    }
}