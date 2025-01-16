import { SupportedProvider } from "../../../types";
import networks from "../../../networks";
import { JsonRpcProvider } from "ethers";

export function getProvider(chainId: number): SupportedProvider {
    const network = Object.values(networks).find(network => network.chainId === chainId);
    if (!network) {
        throw new Error(`Network with chainId ${chainId} not found`);
    }
    return new JsonRpcProvider(network.rpcUrl);
}

export function toHexString(value: string): string {
    const v = parseInt(value)
    return "0x" + v.toString(16)
}