import { Provider, Wallet } from "ethers";
import { Address, SupportedProvider } from "../types" ;
import { waitAndReturn } from "../util";

export default class TransactionSponsor {

    private funder: Wallet;
    private fundingAmount : bigint ;
    private confirmations : number | undefined  ;

    constructor(
        funderPrivateKey: Address,
        fundingAmount: bigint,
        provider: SupportedProvider,
        confirmations: number | undefined = undefined
    ) {
        this.funder = new Wallet(funderPrivateKey, provider);
        this.fundingAmount = fundingAmount ;
        this.confirmations = confirmations ;
    }

    withFunder(newFunder: Wallet) {
        this.setFunder(newFunder) ;
        return this ;
    }

    setFunder(newFunder: Wallet) {
        this.funder = newFunder ;
    }

    async ensureBalanceToDo<T>(
        callback: () => Promise<T>,
        caller: Address,
        provider: Provider,
    ) {
        await this.fundUserIfNecessary(caller, provider);
        return callback();
    }

    private async fundUserIfNecessary(user: Address, provider: Provider) {
        const userBalance = await provider.getBalance(user);
        const threshold = this.fundingAmount /  BigInt(10) ;
        if (userBalance < threshold) {
            await this.getValueFor(user, provider);
        }
    }

    private async getValueFor(user: Address, provider: Provider) {
        const currentBalance = await provider.getBalance(user);
        const valueToSend = this.fundingAmount - currentBalance ;

        await waitAndReturn(
            this.funder.sendTransaction({
                to: user,
                value: valueToSend,
            }),
            this.confirmations
        );
    }
}

