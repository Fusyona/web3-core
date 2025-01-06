import { ZeroAddress } from "ethers"
import { Address, SupportedProvider } from "../../../types";
import ERC20NoWallet from "../ERC20NoWallet";

const DEFAULT_BLOCK_STEP = 10000;

export type TokenHolder = {
    address: Address;
    balance: bigint;
}

export type TokenHoldersResponse = {
    holders: TokenHolder[];
    nextOffset: number;
}

export const getTokenHolders = async (tokenAddress: Address, provider: SupportedProvider, offset: string, blocks = DEFAULT_BLOCK_STEP) => {    
    const {chainId} = await provider.getNetwork();
    const erc20 = new ERC20NoWallet(tokenAddress, Number(chainId), provider);

    const filter = erc20.contractCall.filters.Transfer();
    const events = await erc20.contractCall.queryFilter(filter, offset, blocks);

    const holdersMap: Record<Address, bigint> = {}
    const holders: TokenHolder[] = []

    events.forEach(event => {
        if (event.args.from !== ZeroAddress) {
            holdersMap[event.args.from] = (holdersMap[event.args.from] || 0n) - event.args.value;
        }

        if (event.args.to !== ZeroAddress) {
            holdersMap[event.args.to] = (holdersMap[event.args.to] || 0n) + event.args.value;
        }
    });

    Object.keys(holdersMap).forEach(address => {
        holders.push({
            address,
            balance: holdersMap[address]
        })
    });

    const lastBlock = await provider.getBlockNumber();
    const nextOffset = Number(offset) + blocks <= lastBlock ? Number(offset) + blocks + 1 : lastBlock;
    
    return {holders, nextOffset};
}

export default getTokenHolders;
