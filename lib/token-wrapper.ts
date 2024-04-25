import { Contract } from "ethers";

import { SupportedProvider } from "./types";
import BaseWrapper from "./base-wrapper";


export class ERC20Wrapper extends BaseWrapper {
    constructor(
        contract: Contract,
        provider: SupportedProvider,
        confirmations: number = 1,
    ) {
        super(contract, provider, confirmations);
    } 
}

export class ERC721Wrapper extends BaseWrapper {
    constructor(
        contract: Contract,
        provider: SupportedProvider,
        confirmations: number = 1,
    ) {
        super(contract, provider, confirmations);
    }
}
