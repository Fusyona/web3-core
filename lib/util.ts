import { ContractTransactionResponse, TransactionResponse } from "ethers";

export async function waitAndReturn<T extends TransactionResponse | ContractTransactionResponse>(
    transactionPromise: Promise<T>,
    confirmations: number | undefined = undefined,
) {
    const transaction = await transactionPromise;
    await transaction.wait(confirmations);
    return transaction;
}
