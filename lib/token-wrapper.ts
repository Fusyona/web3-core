import {
    Transaction, 
    TransactionResponse,
    Contract,
    Interface,
    parseEther
} from "ethers";

import {
    Address,
    AddressOrAddressable,
    SupportedProvider
} from "./types";
import BaseWrapper from "./base-wrapper";
import {abi as IERC20Abi} from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json"
import {abi as IERC20MetadataAbi} from "../artifacts/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol/IERC20Metadata.json"
import { abi as IERC165Abi } from "../artifacts/@openzeppelin/contracts/utils/introspection/IERC165.sol/IERC165.json";
import { abi as IERC1363Abi } from "../artifacts/@openzeppelin/contracts/interfaces/IERC1363.sol/IERC1363.json";

interface IPayable {
    ensureApproveAndCall(address: string, amount: string, encoder: DataEncoder, callback: CallableFunction): Promise<void>
}

export type DataEncoder = {
    abi: Interface,
    signature: string,
    args: any[]
}

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
        return this.contract.transfer(to, value);
    }

    async allowance(owner: Address, spender: Address): Promise<bigint> {
        return this.contract.allowance(owner, spender)
    }

    async approve(spender: Address, value: string): Promise<TransactionResponse> {
        return this.contract.approve(spender, value);
    }

    async transferFrom(from: Address, to: Address, value: string): Promise<TransactionResponse> {
        return this.contract.transferFrom(from, to, value);
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

export class PayableTokenWrapper extends ERC20Wrapper implements IPayable {
    constructor(
        address: AddressOrAddressable, 
        provider: SupportedProvider
    ) {
        super(
            address,
            provider
        )
    }

    async approveAndCall(spender: string, amount: string, data: string) {
        return this.withContract(
            new Contract(this.contract.target, IERC1363Abi, this.signer)
        ).contract["approveAndCall(address,uint256,bytes)"](spender, amount, data)
    }

    async ensureApproveAndCall(spender: string, amount: string, encoder: DataEncoder, callback: CallableFunction): Promise<void> {
        // Hardcoded IERC1363 interface Id, since there is no way to generate it offchain without complex code
        // Calculate the hash of the xor operation to everty iface method is pretty complex and since this value 
        // is deterministic, this can be hardcoded unless the standard interface code changes, which probably not
        const ifaceId = "0xb0202a11"

        if (await this.contract.allowance(spender, this.signer!) < parseEther(amount)) {
            const contract = new Contract(this.contract.target, IERC165Abi, this.provider)

            // Contract implements IERC1363 interface 
            if (await contract.supportsInterface(ifaceId)) {
                const data = encoder.abi.encodeFunctionData(encoder.signature, encoder.args)

                await this.approveAndCall(spender, amount, data)

                this.setContract(new Contract(this.contract.target, IERC20Abi, this.signer))
            } else {
                await this.approve(spender, amount)
                await callback()
            }
        } else {
            await callback()
        }
    }
}
