import { SupportedProvider } from "../../../types";
import networks from "../../../networks";
import { JsonRpcProvider, toQuantity } from "ethers";

export const DEFAULT_BLOCK_STEP = 10000;

export function getProvider(chainId: number): SupportedProvider {
    const network = Object.values(networks).find(network => network.chainId === chainId);
    if (!network) {
        throw new Error(`Network with chainId ${chainId} not found`);
    }
    return new JsonRpcProvider(network.rpcUrl);
}

export function toHexString(value: string): string {
    return toQuantity(value)
}