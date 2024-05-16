import {
    Transaction, 
    TransactionResponse,
    Contract,
    parseEther
} from "ethers";

import {
    Address,
    AddressOrAddressable,
    SupportedProvider
} from "./types";
import BaseWrapper from "./base-wrapper";
<<<<<<< HEAD
import {abi as IERC20Abi} from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json"
import {abi as IERC20MetadataAbi} from "../artifacts/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol/IERC20Metadata.json"
=======

import { abi as IERC20Abi } from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json"
import { abi as IERC20MetadatAbi } from "../artifacts/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol/IERC20Metadata.json"

const erc20AbiInterface = new Interface(IERC20Abi);
const erc20MetadataAbiInterface = new Interface(IERC20MetadatAbi);
>>>>>>> refs/remotes/origin/feat/multicall_proxy

// TODO: fill tx data
export class ERC20Wrapper extends BaseWrapper {
    constructor(
        address: AddressOrAddressable, 
        provider: SupportedProvider
    ) {
        super(
            address,
            IERC20Abi,
            provider
        )
    }
    async totalSupply(): Promise<string> {
        return this.contract.totalSupply()
    }

    async balanceOf(account: Address): Promise<bigint> {
        return this.contract.balanceOf(account)
    }

    async transfer(to: Address, value: string): Promise<TransactionResponse> {
        return this.withSigner(
            await this.provider.getSigner()
        ).contract.transfer(to, value);
    }

    async allowance(owner: Address, spender: Address): Promise<bigint> {
        return this.contract.allowance(owner, spender)
    }

    async approve(spender: Address, value: string): Promise<TransactionResponse> {
        return this.withSigner(
            await this.provider.getSigner()
        ).contract.approve(spender, value);
    }

    async transferFrom(from: Address, to: Address, value: string): Promise<TransactionResponse> {
        return this.withSigner(
            await this.provider.getSigner()
        ).contract.transferFrom(from, to, value);
    }
}

export class ERC20MetadataWrapper extends ERC20Wrapper {
    constructor(
        address: AddressOrAddressable, 
        provider: SupportedProvider
    ) {
        super(
            address,
            provider
        )

        this.withContract(
            new Contract(
                this.contract.target, 
                IERC20MetadataAbi, 
                provider
            )
        )
    }

    async name(): Promise<string> {
        return this.contract.name()
    }

    async symbol(): Promise<string> {
        return this.contract.symbol()
    }

    async decimals(): Promise<number> {
        return this.contract.decimals()
    }
}

export class ERC721Wrapper extends BaseWrapper {
    async balanceOf(owner: Address): Promise<number> {
        const tx = new Transaction();
        return parseInt(await this.provider.call(tx));
    }

    async ownerOf(tokenId: number): Promise<string> {
        const tx = new Transaction();
        return await this.provider.call(tx);
    }

    async safeTransferFromWithData(from: Address, to: Address, tokenId: number, data: any): Promise<TransactionResponse> {
        const tx = new Transaction();
        return this.waitAndReturn(this.signer!.sendTransaction(tx));
    }

    async safeTransferFrom(from: Address, to: Address, tokenId: number): Promise<TransactionResponse> {
        const tx = new Transaction();
        return this.waitAndReturn(this.signer!.sendTransaction(tx));
    }

    async transferFrom(from: Address, to: Address, tokenId: number): Promise<TransactionResponse> {
        const tx = new Transaction();
        return this.waitAndReturn(this.signer!.sendTransaction(tx));
    }

    async approve(to: Address, tokenId: number): Promise<TransactionResponse> {
        const tx = new Transaction();
        return this.waitAndReturn(this.signer!.sendTransaction(tx));
    }

    async setApprovalForAll(operator: Address, approved: boolean): Promise<TransactionResponse> {
        const tx = new Transaction();
        return this.waitAndReturn(this.signer!.sendTransaction(tx));
    }

    async getApproved(tokenId: number): Promise<string> {
        const tx = new Transaction();
        return this.provider!.call(tx);
    }

    async isApprovedForAll(owner: Address, operator: Address): Promise<boolean> {
        const tx = new Transaction();
        return (await this.provider!.call(tx) === "true" ? true : false);
    }
}

class ERC721MetadataWrapper extends ERC721Wrapper {
    async name(): Promise<string> {
        const tx = new Transaction();
        return this.provider!.call(tx);
    }

    async symbol(): Promise<string> {
        const tx = new Transaction();
        return this.provider!.call(tx);
    }

    async tokenURI(tokenId: number): Promise<string> {
        const tx = new Transaction();
        return this.provider!.call(tx);
    }
}

class ERC721EnumerableWrapper extends ERC721Wrapper {
    async totalSupply(): Promise<number> {
        const tx = new Transaction();
        return parseInt(await this.provider!.call(tx));
    }

    async tokenOfOwnerByIndex(owner: Address, index: number): Promise<number> {
        const tx = new Transaction();
        return parseInt(await this.provider!.call(tx));
    }

    async tokenByIndex(index: number): Promise<string> {
        const tx = new Transaction();
        return await this.provider!.call(tx);
    }
}
