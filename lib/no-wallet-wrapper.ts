import { BaseContract, ContractRunner, Interface, InterfaceAbi } from "ethers";
import { Address, SupportedNetworkName, SupportedProvider } from "./types";
import BaseWrapper from "./base-wrapper";
import { getNetworkNameFromChainId, getProviderFromNetwork } from "./util";

export default abstract class NoWalletWrapper<T extends BaseContract> extends BaseWrapper<T> {
    #network: SupportedNetworkName;

    constructor(chainId: number, address: Address, abi: Interface | InterfaceAbi, runner?: ContractRunner) {
        const network = getNetworkNameFromChainId(chainId);

        let _providerOrRunner: SupportedProvider | ContractRunner;
        if (runner) {
            _providerOrRunner = runner;
        } else {
            _providerOrRunner = getProviderFromNetwork(network);
        }
        const contract = new BaseContract(address, abi, _providerOrRunner) as T;
        super(contract);

        this.#network = network;
    }

    protected async getLatestBlock() {
        const latestBlockTag = ["taraxa", "taraxaTestnet"].includes(this.#network) ? "pending" : "latest";
        return (await this.requireProvider().getBlock(latestBlockTag))!;
    }
}
