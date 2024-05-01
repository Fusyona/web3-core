import { TransactionResponse } from "ethers";

export async function waitAndReturn(
    transactionPromise: Promise<TransactionResponse>,
    confirmations: number | undefined = undefined
) {
    const transaction = await transactionPromise;
    await transaction.wait(confirmations);
    return transaction;
}
