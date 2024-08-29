import { ContractTransactionResponse, TransactionResponse, ethers } from "ethers";
import { SupportedNetworkName } from "./types";
import { NetworkConfigs } from "./config";
import assert from "assert";

export async function waitAndReturn<T extends TransactionResponse | ContractTransactionResponse>(
    transactionPromise: Promise<T>,
    confirmations: number | undefined = undefined,
) {
    const transaction = await transactionPromise;
    await transaction.wait(confirmations);
    return transaction;
}

export function getProviderFromNetwork(network: SupportedNetworkName) {
    return new ethers.JsonRpcProvider(getNetworkUrl(network));
}

function getNetworkUrl(network: SupportedNetworkName): string {
    const url = networkConfigs.network(network).url;
    assert(url, `No URL for network: ${network}`);
    return url;
}

export const networkConfigs = new NetworkConfigs("remote");

export function getNetworkNameFromChainId(chainId: number): SupportedNetworkName | "hardhat" {
    for (const network in networkConfigs.networks()) {
        const supportedNetwork = network as SupportedNetworkName;
        if (networkConfigs.network(supportedNetwork).chainId === chainId) {
            return supportedNetwork;
        }
    }
    if (chainId === HARDHAT_CHAIN_ID) return "hardhat";

    throw new Error(`No network found for chain ID: ${chainId}`);
}

export const HARDHAT_CHAIN_ID = 31337;
