import { Contract, Interface, parseEther } from "ethers";
import BaseWrapper from "./base-wrapper";
import { AddressOrAddressable, SupportedProvider } from "./types";
import { ERC20Wrapper } from "./token-wrapper";
import { abi as IERC20Abi } from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";
import { abi as multicallAbi } from "../artifacts/contracts/Multicall.sol/ExternalMulticall.json"
import { abi as IERC165Abi } from "../artifacts/@openzeppelin/contracts/utils/introspection/IERC165.sol/IERC165.json";
import { abi as IERC1363Abi } from "../artifacts/@openzeppelin/interfaces/IERC1363.sol/IERC1363.json";

export type CallQuery = {
    target: string,
    data: string
}

interface IPayable {
    ensureApproveAndCall(address: string, amount: string, encoder: DataEncoder): Promise<void>
}

type DataEncoder = {
    abi: Interface,
    signature: string,
    args: any[]
}

class PayableTokenWrapper extends ERC20Wrapper implements IPayable {
    constructor(
        address: string, 
        provider: SupportedProvider
    ) {
        super(
            address,
            provider
        )
    }

    async ensureApproveAndCall(spender: string, amount: string, encoder: DataEncoder): Promise<void> {
        // Hardcoded IERC1363 interface Id, since there is no way to generate it offchain without complex code
        // Calculate the hash of the xor operation to everty iface method is pretty complex and since this value 
        // is deterministic, this can be hardcoded unless the standard interface code changes, which probably not
        const ifaceId = "0xb0202a11"

        if (await this.contract.allowance(spender, this.signer!) < parseEther(amount)) {
            const contract = new Contract(this.contract.target, IERC165Abi, this.provider)

            // Contract implements IERC1363 interface 
            if (await contract.implementsInterface(ifaceId)) {
                const data = encoder.abi.encodeFunctionData(encoder.signature, encoder.args)
                await this.withContract(
                    new Contract(this.contract.target, IERC1363Abi, this.provider)
                ).contract.approveAndCall(spender, amount, data)
            } else {
                await this.approve(spender, amount)
            }
        }
    }
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

    //TODO: fix argument types str vs bigint

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

        await this.withSigner(
            await this.provider.getSigner()
        ).contract.multicall(txs)
        return true
    }
}