import { SupportedProvider } from "../../../types";
import { getProvider } from "./utils";

async function getTransactionBlock(hash: string, chainId: number, provider?: SupportedProvider): Promise<number> {
    if (!provider) {
        provider = getProvider(chainId);
    }
    const tx = await provider.getTransaction(hash)
    
    return tx?.blockNumber ?? 0
}

export default getTransactionBlock