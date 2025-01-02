import { Address } from "../types" ;
import TransactionSponsor from "./transaction-sponsor";

export default class TransactionSponsorExternal extends TransactionSponsor {

    constructor(
        fundingAmount: bigint,
        confirmations: number | undefined = undefined
    ) {
        super(fundingAmount, confirmations);
    }

    async fund(user: Address) {
        /* todo */
    }

}
