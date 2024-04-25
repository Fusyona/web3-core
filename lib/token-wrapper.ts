import {
    Transaction, 
    TransactionResponse,
    BigNumberish,
    Interface
} from "ethers";

import {
    Address
} from "./types";
import BaseWrapper from "./base-wrapper";

const erc20AbiInterfaceMethods = [
    "function totalSupply() external view returns(uint256)",
    "function balanceOf(address) external view returns(uint256)",
    "function transfer(address,uint256) external returns(bool)",
    "function allowance(address,address) external view returns (uint256)",
    "function approve(address,uint256) external returns (bool)",
    "function transferFrom(address,address,uint256) external returns (bool)",
]

const erc20MetadataAbiInterfaceMethods = [
    "function name() external view returns (string memory)",
    "function symbol() external view returns (string memory)",
    "function decimals() external view returns (uint8)",
]

const erc20AbiInterface = new Interface(erc20AbiInterfaceMethods);
const erc20MetadataAbiInterface = new Interface(erc20MetadataAbiInterfaceMethods);

// TODO: fill tx data
export class ERC20Wrapper extends BaseWrapper {
    async totalSupply(): Promise<number> {
        const tx = new Transaction();
        tx.to = await this.getAddress();
        tx.data = erc20AbiInterface.encodeFunctionData("totalSupply");

        return parseFloat(await this.provider.call(tx));
    }

    async balanceOf(account: Address): Promise<number> {
        const tx = new Transaction();
        tx.to = await this.getAddress();
        tx.data = erc20AbiInterface.encodeFunctionData("balanceOf", [account]);

        return parseFloat(await this.provider.call(tx));
    }

    async transfer(to: Address, value: BigNumberish): Promise<TransactionResponse> {
        const tx = new Transaction();
        tx.to = await this.getAddress();
        tx.data = erc20AbiInterface.encodeFunctionData("transfer", [to, value]);

        // TODO: make sure the signer is valid and defined
        return this.waitAndReturn(this.signer!.sendTransaction(tx));
    }

    async allowance(owner: Address, spender: Address): Promise<BigNumberish> {
        const tx = new Transaction();
        tx.to = await this.getAddress();
        tx.data = erc20AbiInterface.encodeFunctionData("allowance", [owner, spender]);

        return parseFloat(await this.provider.call(tx));
    }

    async approve(spender: Address, value: BigNumberish): Promise<TransactionResponse> {
        const tx = new Transaction();
        tx.to = await this.getAddress();
        tx.data = erc20AbiInterface.encodeFunctionData("approve", [spender, value]);

        return this.waitAndReturn(this.signer!.sendTransaction(tx));
    }

    async transferFrom(from: Address, to: Address, value: BigNumberish): Promise<TransactionResponse> {
        const tx = new Transaction();
        tx.to = await this.getAddress();
        tx.data = erc20AbiInterface.encodeFunctionData("transferFrom", [from, to, value]);

        return this.waitAndReturn(this.signer!.sendTransaction(tx));
    }
}

export class ERC20MetadataWrapper extends ERC20Wrapper {
    async name(): Promise<string> {
        const tx = new Transaction();
        tx.to = await this.getAddress();
        tx.data = erc20AbiInterface.encodeFunctionData("name");

        return this.provider.call(tx);
    }

    async symbol(): Promise<string> {
        const tx = new Transaction();
        tx.to = await this.getAddress();
        tx.data = erc20AbiInterface.encodeFunctionData("symbol");

        return this.provider.call(tx);
    }

    async decimals(): Promise<number> {
        const tx = new Transaction();
        tx.to = await this.getAddress();
        tx.data = erc20AbiInterface.encodeFunctionData("decimals");

        return parseInt(await this.provider.call(tx));
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
