import { BrowserProvider, JsonRpcProvider, Addressable, ContractTransaction, BaseContract } from "ethers";

import networks from "./networks";

export type Address = string;
export type AddressOrAddressable = Address | Addressable;

export type SupportedProvider = BrowserProvider | JsonRpcProvider;

export type SupportedNetworkName = keyof typeof networks;

export interface NetworkConfigData {
    rpcUrl: string;
    chainId: number;
    explorerUrl?: string;
}

export type NonTransactionFunctions<T> = Pick<
    T,
    {
        [K in keyof T]: Exclude<T[K], (...args: any[]) => Promise<ContractTransaction>> extends never ? never : K;
    }[keyof T]
>;
