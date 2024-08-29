import { Signer, Contract, AddressLike, Addressable, ContractTransactionResponse } from "ethers";
import { Address, SupportedProvider } from "./types";
import assert from "assert";

export default abstract class BaseWrapper implements Addressable {
    protected contract!: Contract;
    protected signer: Signer | undefined;
    protected confirmations: number | undefined;

    constructor(contract: Contract, confirmations: number = 1) {
        this.setContract(contract);
        this.confirmations = confirmations;
    }

    setContract(contract: Contract) {
        this.contract = contract;
    }

    protected async requireConnectedAddress() {
        const connectedSigner = await this.requireSigner();
        return connectedSigner.getAddress();
    }

    protected requireSigner() {
        const supportedProvider = this.requireSupportedProvider();
        return supportedProvider.getSigner();
    }

    protected requireSupportedProvider() {
        return this.requireProvider() as SupportedProvider;
    }

    protected requireProvider() {
        const provider = this.contract.runner?.provider;
        assert(provider, "Provider is not available");

        return provider;
    }

    withContract(contract: Contract) {
        this.setContract(contract);
        return this;
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
        await transaction.wait(this.confirmations);
        return transaction;
    }
}
