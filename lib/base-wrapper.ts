import { Signer, Contract, AddressLike, Addressable, ContractTransactionResponse } from "ethers";

import { Address } from "./types";

export default abstract class BaseWrapper implements Addressable {
    protected contract!: Contract;
    protected signer: Signer | undefined;
    protected confirmations: number | undefined;

    constructor(contract: Contract, confirmations: number = 1) {
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
