import { Wallet } from "ethers";
import { Address, SupportedProvider } from "../types" ;
import { waitAndReturn } from "../util";
import TransactionSponsor from "./transaction-sponsor";

export default class TransactionSponsorWallet extends TransactionSponsor {

    private funder: Wallet;

    constructor(
        provider: SupportedProvider,
        funderPrivateKey: Address,
        fundingAmount: bigint,
        confirmations: number | undefined = undefined
    ) {
        super(fundingAmount, confirmations);
        this.funder = new Wallet(funderPrivateKey, provider);
    }

    withFunder(newFunder: Wallet) {
        this.setFunder(newFunder) ;
        return this ;
    }

    setFunder(newFunder: Wallet) {
        this.funder = newFunder ;
    }

    async fund(user: Address) {
        await this.sendValue(user) ;
    }

    async sendValue(user: Address) {
        if (! this.funder.provider === undefined ) return ;
        const currentBalance = await this.funder.provider!.getBalance(user);
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
