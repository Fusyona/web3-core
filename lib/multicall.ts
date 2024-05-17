import { Contract, Interface, parseEther } from "ethers";
import BaseWrapper from "./base-wrapper";
import { AddressOrAddressable, SupportedProvider } from "./types";
import { ERC20Wrapper } from "./token-wrapper";
import { abi as IERC20Abi } from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";
import { abi as multicallAbi } from "../artifacts/contracts/Multicall.sol/ExternalMulticall.json"
import { ExternalMulticall } from "../typechain-types";

export type CallQuery = {
    target: string,
    data: string
}


export class ExternalMulticallWrapper extends BaseWrapper {
    private tokenA: ERC20Wrapper
    private tokenB: ERC20Wrapper

    private ERC20Iface: Interface = new Interface(IERC20Abi)

    constructor(
        address: AddressOrAddressable,
        provider: SupportedProvider,
        tokenA: ERC20Wrapper,
        tokenB: ERC20Wrapper
    ) {
        super(address, multicallAbi, provider)
        this.tokenA = tokenA
        this.tokenB = tokenB
    }

    async checkAllowance(address: string, amount: string, contract: ERC20Wrapper): Promise<boolean> {
        const allowances = await contract.allowance(address, await this.contract.getAddress())
        if (allowances < parseEther(amount)) return false

        return true
    }

    async batchTransfer(address: string, amountA: string, amountB: string): Promise<boolean> {
        const transferSignature = "transferFrom(address,address,uint256)"

        if (!(await this.checkAllowance(address, amountA, this.tokenA))) return false
        if (!(await this.checkAllowance(address, amountB, this.tokenB))) return false

        let txs = [
            {
                target: await this.tokenA.getAddress(),
                data: this.ERC20Iface.encodeFunctionData(transferSignature, [address, await this.tokenA.getAddress(), amountA])
            },
            {
                target: await this.tokenB.getAddress(),
                data: this.ERC20Iface.encodeFunctionData(transferSignature, [address, await this.tokenB.getAddress(), amountB])
            }
        ]

        await this.contract.multicall(txs)
        return true
    }
}