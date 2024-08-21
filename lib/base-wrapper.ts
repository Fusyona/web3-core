import { Signer, Contract, Transaction, AddressLike, Addressable, ContractTransactionResponse } from "ethers";

import { Address, SupportedProvider } from "./types";
import { waitAndReturn } from "./util";

export default abstract class BaseWrapper implements Addressable {
    protected contract!: Contract;
    protected provider!: SupportedProvider;
    protected signer: Signer | undefined;
    protected confirmations: number | undefined;

    constructor(contract: Contract, provider: SupportedProvider, confirmations: number = 1) {
        this.setProvider(provider);
        this.setContract(contract);
        this.confirmations = confirmations;
    }

    withContract(contract: Contract) {
        this.setContract(contract);
        return this;
    }

    setContract(contract: Contract) {
        this.contract = contract;
    }

    withProvider(provider: SupportedProvider) {
        this.setProvider(provider);
        return this;
    }

    private setProvider(provider: SupportedProvider) {
        this.provider = provider;
    }

    async withSignerIndex(index: number) {
        const signer = await this.provider.getSigner(index);
        return this.withSigner(signer);
    }

    // https://github.com/OpenZeppelin/openzeppelin-upgrades/blob/2ef7aa554c3b31821a79a99131751fb07b5b0298/packages/plugin-hardhat/src/utils/ethers.ts#L6-L8
    withSigner(signer: Signer) {
        this.contract = this.contract.connect(signer) as Contract;
        this.signer = signer;
        return this;
    }

    async getAddress(): Promise<Address> {
        return await this.contract.getAddress();
    }

    get address(): AddressLike {
        return this.contract.target;
    }

    protected async waitAndReturn(transactionPromise: Promise<ContractTransactionResponse>) {
        const transaction = await transactionPromise;
        this.provider.waitForTransaction(transaction.hash as string, this.confirmations);
        return transaction;
    }
}
