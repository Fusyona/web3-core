import { BrowserProvider, JsonRpcProvider, Addressable } from "ethers";

export type Address = string ;
export type AddressOrAddressable = Address | Addressable ;

export type SupportedProvider = BrowserProvider | JsonRpcProvider
