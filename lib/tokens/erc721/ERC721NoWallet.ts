import NoWalletWrapper from "../../no-wallet-wrapper";
import * as typechain from "../../../typechain-types";
import { Address, NonTransactionFunctions } from "../../types";
import { ContractRunner } from "ethers";
import abi from "../../../artifacts/@openzeppelin/contracts/token/ERC721/IERC721.sol/IERC721.json";

type ERC721ReadonlyFunctions = NonTransactionFunctions<typechain.IERC721>;

export default class ERC721NoWallet extends NoWalletWrapper<typechain.IERC721> {
    constructor(address: Address, chainId: number, runner?: ContractRunner) {
        super(chainId, address, abi.abi, runner);
    }

    get contractCall() {
        return this.contract as ERC721ReadonlyFunctions;
    }
}