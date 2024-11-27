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

    constructor(public contract: T, private confirmations: number = 1) {}

    get runner() {
        return this.contract.runner
    }

    async requireConnectedAddress() {
        const connectedSigner = this.requireSigner()
        return connectedSigner.getAddress()
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

    withAddress(address: Address) {
        this.contract = this.contract.attach(address) as T
        return this
    }

    withRunner(runner: ContractRunner) {
        this.contract = this.contract.connect(runner) as T
        return this
    }

    getAddress(): Promise<Address> {
        return this.contract.getAddress()
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
        this.requireSigner() ;
        return this.confirm(callback(this.contract)) ;
    }

}
