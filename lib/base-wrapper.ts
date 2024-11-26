import assert from "assert";
import {
    Signer,
    AddressLike,
    Addressable,
    ContractTransactionResponse,
    BaseContract,
    ContractRunner,
} from "ethers";
import {
    Address,
    SupportedProvider,
    errors
} from "./types";

export default abstract class BaseWrapper<T extends BaseContract> implements Addressable {
    protected signer: Signer | undefined;
    protected signerIndexOrAddress?: number | Address;


    constructor(public contract: T, private confirmations: number = 1) {}

    get runner() {
        return this.contract.runner
    }

    protected requireSigner(indexOrAddress?: number | Address) {
        const supportedProvider = this.requireSupportedProvider();
        return supportedProvider.getSigner(indexOrAddress);
    }

    requireSigner() {
        assert(this.hasSigner(), errors.NoSigner)
        return this.runner as Signer
    }

    hasSigner() {
        return this.runner?.sendTransaction !== undefined
    }

    requireSupportedProvider() {
        return this.requireProvider() as SupportedProvider
    }

    requireProvider() {
        assert(this.hasProvider(), errors.NoProvider)
        return this.runner?.provider
    }

    hasProvider() {
        return this.runner?.provider !== undefined
    }

    hasRunner(contract: BaseContract) {
        return contract.runner !== undefined
    }

    withContract(contract: T) {
        this.contract = contract
        return this
    }

    // https://github.com/OpenZeppelin/openzeppelin-upgrades/blob/2ef7aa554c3b31821a79a99131751fb07b5b0298/packages/plugin-hardhat/src/utils/ethers.ts#L6-L8
    withSigner(signerIndexOrAddress: number | Address) {
        this.signerIndexOrAddress = signerIndexOrAddress;
        return this;
    }

    getAddress(): Promise<Address> {
        return this.contract.getAddress()
    }

    protected async getConnectedAddress(): Promise<Address> {
        const signer = await this.requireSigner(this.signerIndexOrAddress)
        return signer.getAddress()
    }

    get address(): AddressLike {
        return this.contract.target
    }

    async confirm(response: Promise<ContractTransactionResponse>) {
        const transaction = await response 
        const receipt = await transaction.wait(this.confirmations)
        return { transaction, receipt }
    }

    /**
     * It is responsability of the consumer to ensure that `contract`
     * has a `signer` connected or otherwise use `withRunner`
     */ 
    protected async connectSignerAndTransact(
        callback: (contract: T) => Promise<ContractTransactionResponse>,
    ) {
        const connectedSigner = await this.requireSigner(this.signerIndexOrAddress);
        const connectedContract = this.contract.connect(connectedSigner) as T;
        return this.waitAndReturn(transactCallback(connectedContract));
    }

}
