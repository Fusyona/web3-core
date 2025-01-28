import { Contract, Provider, BaseContract } from "ethers";
import { Address, SupportedChainId } from "../types";
import { Multicall3 as deployments } from "../../data/deployments.json";
import abi from "../../data/abis/Multicall3.json";
import { Multicall3 } from "../../typechain-types";
import BaseWrapper from "../base-wrapper";

export class Multicaller extends BaseWrapper<Multicall3> {
    constructor(chainId: SupportedChainId, provider: Provider, overrideAddress?: Address) {
        const _contract = Multicaller.getContract(chainId, provider, overrideAddress);
        super(_contract);

        this.contract = _contract;
    }

    private static getContract(chainId: SupportedChainId, provider: Provider, overrideAddress?: Address): Multicall3 {
        const address = deployments[chainId.toString() as keyof typeof deployments];
        return new Contract(overrideAddress ?? address, abi, provider) as unknown as Multicall3;
    }

    static async fromProvider(provider: Provider, overrideAddress?: Address) {
        const chainIdNumber = await Multicaller.tryGetSupportedChainId(provider);
        return new Multicaller(chainIdNumber as SupportedChainId, provider, overrideAddress);
    }

    private static async tryGetSupportedChainId(provider: Provider) {
        const { chainId } = await provider.getNetwork();
        if (!(chainId.toString() in deployments))
            throw new Error(`Multicaller not supported on network with chain ID ${chainId}`);

        return Number(chainId.toString());
    }

    async multicall(...calls: Call[]) {
        const contractParam = await Multicaller.mapCallsToContractCalls(calls);
        return this.connectSignerAndTransact((c) => c.aggregate3(contractParam));
    }

    private static async mapCallsToContractCalls(calls: Call[]): Promise<Multicall3.Call3Struct[]> {
        return Promise.all(
            calls.map(async (call) => ({
                target: await call.contract.getAddress(),
                callData: call.contract.interface.encodeFunctionData(call.method, call.args),
                allowFailure: call.allowFailure ?? false,
            })),
        );
    }
}

export type Call = {
    contract: BaseContract;
    method: string;
    args: any[];
    allowFailure?: boolean;
};

export function to<T extends BaseContract, M extends keyof T & string>(
    contract: T,
    method: M,
    args: T[M] extends { populateTransaction: (...args: infer A) => Promise<any> } ? A : never,
    allowFailure?: boolean,
) {
    return {
        contract,
        method,
        args,
        allowFailure,
    } as Call;
}
