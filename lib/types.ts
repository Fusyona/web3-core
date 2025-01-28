import { BrowserProvider, JsonRpcProvider, Addressable, ContractTransaction } from "ethers";
import networks from "./networks";

export const NATIVE_COIN = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
export type Address = string;
export type AddressOrAddressable = Address | Addressable;

export type SupportedProvider = BrowserProvider | JsonRpcProvider;
export type SupportedNetworkName = keyof typeof networks;

export type SupportedChainId = (typeof networks)[keyof typeof networks]["chainId"];

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

export namespace errors {
    export const NoSigner = new Error("no signer connected");
    export const NoProvider = new Error("no provider connected");
}
