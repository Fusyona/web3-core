import { ethers } from 'ethers';
import { Address, SupportedProvider } from '../../../types';
import {getProvider, toHexString, DEFAULT_BLOCK_STEP} from './utils'
import ERC20NoWallet from "../ERC20NoWallet";


const getTokenEvents = async (
    tokenAddress: string, 
    eventName: string, 
    chainId: number,
    offset: string, 
    blocks = DEFAULT_BLOCK_STEP, 
    provider?: SupportedProvider
) => {
    if (!provider) {
        provider = getProvider(chainId);
    }

    const erc20 = new ERC20NoWallet(tokenAddress, Number(chainId), provider);
    
    const event = erc20.contractCall.getEvent(eventName as any)
    const events = await erc20.contractCall.queryFilter(event, toHexString(offset), blocks)

    return events
}

export default getTokenEvents
