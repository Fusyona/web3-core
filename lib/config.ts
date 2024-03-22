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
        this.rpcUrl = networkData.rpcUrl ;
        this.chainId = networkData.chainId ;
        this.explorerUrl = networkData.explorerUrl! ;
        this.accounts = accounts ;
    }

    withAccounts(accounts: HttpNetworkAccountsUserConfig) {
        this.accounts = accounts ;
        return this ;
    }

    withApiKey(apiKeyName?: string) {
        this.setApiKey(apiKeyName) ;
        return this ;
    }

    setApiKey() {
        if ( !this.rpcUrlNeedsApiKey() ) {
            return
        }

        const apiKey = vars.get(this.rpcUrlApiKeyName) ;
        this.rpcUrl = this.rpcUrl.replace(
            this.rpcUrlApiKeyPattern,
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

    private rpcUrlNeedsApiKey() : boolean {
        return this.rpcUrlApiKeyMatches !== null
    }

    get rpcUrlApiKeyName() : string {
        return this.rpcUrlApiKeyMatches?.[1]!
    }

    get rpcUrlApiKeyPattern() : string {
        return this.rpcUrlApiKeyMatches?.[0]!
    }

    get rpcUrlApiKeyMatches() : RegExpMatchArray | null {
        return this.rpcUrl.match(/\{(.+)\}/)
    }

}

export default class NetworkConfigs {

    // @TODO assign type
    public networks: any = {} ;

    constructor(accounts: string[]) {
        Object.entries(networks).map( ([name, data]) => {
            const networkConfig = new NetworkConfig(name, data, accounts) ;
            this.networks[name] = networkConfig.withApiKey() ;
        })
    }

}
