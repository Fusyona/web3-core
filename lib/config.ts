import { vars } from "hardhat/config"
import { HttpNetworkUserConfig, HttpNetworkAccountsUserConfig } from "hardhat/types"
import { ChainConfig } from "@nomicfoundation/hardhat-verify/types" ;

import { NetworkConfigData } from "./types"
import networks from "./networks.json" ;


class NetworkConfig {

    public name: string ;
    public rpcUrl: string ;
    public chainId: number ;
    public explorerUrl: string ;
    public accounts: HttpNetworkAccountsUserConfig ;

    constructor(networkName: string, networkData: NetworkConfigData, accounts: HttpNetworkAccountsUserConfig) {
        this.name = networkName ;
        this.rpcUrl = this.withRpcUrl(networkData.rpcUrl) ;
        this.chainId = networkData.chainId ;
        this.explorerUrl = networkData.explorerUrl! ;
        this.accounts = accounts ;
    }

    withAccounts(accounts: HttpNetworkAccountsUserConfig) {
        this.accounts = accounts ;
        return this ;
    }

    withRpcUrl(rpcUrl: string) {
        if ( !this.rpcUrlNeedsApiKey(rpcUrl) ) {
            return rpcUrl
        }

        const apiKey = vars.get(this.rpcUrlApiKeyName(rpcUrl)) ;
        return rpcUrl.replace(
            this.rpcUrlApiKeyPattern(rpcUrl),
            apiKey
        )
    }

    get config() : HttpNetworkUserConfig {
        return {
            url: this.rpcUrl,
            chainId: this.chainId,
            accounts: this.accounts,
        }
    }

    get explorerApiUrl() : string {
        return `${this.explorerUrl}/api`
    }

    get customChain() : ChainConfig {
        return {
            network: this.name,
            chainId: this.chainId,
            urls: {
                apiURL: this.explorerApiUrl,
                browserURL: this.explorerUrl,
            }
        }
    }

    private rpcUrlNeedsApiKey(rpcUrl: string) : boolean {
        return this.rpcUrlApiKeyMatches(rpcUrl) !== null
    }

    private rpcUrlApiKeyName(rpcUrl: string) : string {
        return this.rpcUrlApiKeyMatches(rpcUrl)?.[1]! // returns `PATTERN` without the `{}`
    }

    private rpcUrlApiKeyPattern(rpcUrl: string) : string {
        return this.rpcUrlApiKeyMatches(rpcUrl)?.[0]! // returns `{PATTERN}`
    }

    private rpcUrlApiKeyMatches(rpcUrl: string) : RegExpMatchArray | null {
        return rpcUrl.match(/\{(.+)\}/)
    }

}

export default class NetworkConfigs {

    // @TODO assign type
    public networks: any = {} ;

    constructor(accounts: string[]) {
        Object.entries(networks).map( ([name, data]) => {
            const networkConfig = new NetworkConfig(name, data, accounts) ;
            this.networks[name] = networkConfig ;
        })
    }

}
