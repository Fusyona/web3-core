import { Provider } from "ethers";
import { Address } from "../types" ;

export default abstract class TransactionSponsor {

    public fundingAmount : bigint ;
    public confirmations : number | undefined  ;

    constructor(
        fundingAmount: bigint,
        confirmations: number | undefined = undefined
    ) {
        this.fundingAmount = fundingAmount ;
        this.confirmations = confirmations ;
    }

    withFundingAmount(fundingAmount: bigint) {
        this.setFundingAmount(fundingAmount) ;
        return this ;
    }

    setFundingAmount(fundingAmount: bigint) {
        this.fundingAmount = fundingAmount ;
    }

    async ensureBalanceToDo<T>(
        caller: Address,
        provider: Provider,
        callback: () => Promise<T>,
    ) {
        if (await this.needsFunding(caller, provider)) {
            await this.fund(caller);
        }
        return callback();
    }

    async needsFunding(user: Address, provider: Provider) {
        const userBalance = await provider.getBalance(user);
        const threshold = this.fundingAmount /  BigInt(10) ;
        return userBalance < threshold ;
    }

    abstract fund(user: Address) : Promise<void> ;
}
