import { Signer, AddressLike, Addressable, ContractTransactionResponse, BaseContract } from "ethers";
import { Address, SupportedProvider } from "./types";
import assert from "assert";

export default abstract class BaseWrapper<T extends BaseContract> implements Addressable {
    protected signer: Signer | undefined;

    constructor(
        private contract: T,
        private confirmations: number = 1,
    ) {}

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

    withContract(contract: T) {
        this.contract = contract;
        return this;
    }

    // https://github.com/OpenZeppelin/openzeppelin-upgrades/blob/2ef7aa554c3b31821a79a99131751fb07b5b0298/packages/plugin-hardhat/src/utils/ethers.ts#L6-L8
    withSigner(signer: Signer) {
        this.contract = this.contract.connect(signer) as T;
        this.signer = signer;
        return this;
    }

    getAddress(): Promise<Address> {
        return this.contract.getAddress();
    }

    get address(): AddressLike {
        return this.contract.target;
    }

    protected async waitAndReturn(transactionPromise: Promise<ContractTransactionResponse>) {
        const transaction = await transactionPromise;
        await transaction.wait(this.confirmations);
        return transaction;
    }

    protected async connectSignerAndTransact(
        transactCallback: (connectedContract: T) => Promise<ContractTransactionResponse>,
    ) {
        const connectedSigner = await this.requireSigner();
        const connectedContract = this.contract.connect(connectedSigner) as T;
        return this.waitAndReturn(transactCallback(connectedContract));
    }
}
