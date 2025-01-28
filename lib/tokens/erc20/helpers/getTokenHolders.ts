import { ZeroAddress } from "ethers"
import { Address, SupportedProvider } from "../../../types";
import { getProvider, DEFAULT_BLOCK_STEP } from "./utils";
import getTokenEvents from "./getTokenEvents";
import { TypedContractEvent, TypedEventLog } from "../../../../typechain-types/common";
import { TransferEvent } from "../../../../typechain-types/contracts/ERC721/ERC721MintScheme";



export type TokenHolder = {
    address: Address;
    balance: bigint;
}

export type TokenHoldersResponse = {
    holders: TokenHolder[];
    nextOffset: number;
}

const getTokenHolders = async (
    tokenAddress: Address, 
    chainId: number, 
    offset: string, 
    blocks = DEFAULT_BLOCK_STEP, 
    provider?: SupportedProvider
) => {   
    if (!provider) {
        provider = getProvider(chainId);
    }
    const events: TypedEventLog<
        TypedContractEvent<
            TransferEvent.InputTuple, 
            TransferEvent.OutputTuple
        >
    >[] = await getTokenEvents(tokenAddress, "Transfer", chainId, offset, blocks, provider)

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
