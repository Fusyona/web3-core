import { BrowserProvider, JsonRpcProvider, Addressable, ContractTransaction } from "ethers";

export type Address = string ;
export type AddressOrAddressable = Address | Addressable ;

export type SupportedProvider = BrowserProvider | JsonRpcProvider

export interface NetworkConfigData {
    rpcUrl: string,
    chainId: number,
    explorerUrl?: string
}

export type NonTransactionFunctions<T> = Pick<
    T,
    {
        [K in keyof T]: Exclude<
            T[K],
            (...args: any[]) => Promise<ContractTransaction>
        > extends never
            ? never
            : K;
    }[keyof T]
>;
