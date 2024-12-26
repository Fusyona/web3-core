import NoWalletWrapper from "../../no-wallet-wrapper";
import * as typechain from "../../../typechain-types";
import { Address, NonTransactionFunctions } from "../../types";
import { ContractRunner } from "ethers";
import abi from "../../../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";

type ERC20ReadonlyFunctions = NonTransactionFunctions<typechain.IERC20>;

export default class ERC20NoWallet extends NoWalletWrapper<typechain.IERC20> {
    constructor(address: Address, chainId: number, runner?: ContractRunner) {
        super(chainId, address, abi.abi, runner);
    }

    get contractCall() {
        return this.contract as ERC20ReadonlyFunctions;
    }
}