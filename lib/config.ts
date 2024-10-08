import { NetworksUserConfig, HttpNetworkUserConfig, HttpNetworkAccountsUserConfig } from "hardhat/types";
import { ChainConfig } from "@nomicfoundation/hardhat-verify/types";

import { NetworkConfigData, SupportedNetworkName } from "./types";
import networks from "./networks";
import StaticApiKeyGetter from "./api-key-getter/static-api-key-getter";

export class NetworkConfig {
    public name: string;
    public rpcUrl: string;
    public chainId: number;
    public explorerUrl: string;
    public accounts: HttpNetworkAccountsUserConfig;

    constructor(
        networkName: SupportedNetworkName,
        networkData: NetworkConfigData,
        accounts: HttpNetworkAccountsUserConfig,
    ) {
        this.name = networkName;
        this.rpcUrl = this.useRpcUrl(networkData.rpcUrl);
        this.chainId = networkData.chainId;
        this.explorerUrl = networkData.explorerUrl!;
        this.accounts = accounts;
    }

    withAccounts(accounts: HttpNetworkAccountsUserConfig) {
        this.accounts = accounts;
        return this;
    }

    useRpcUrl(rpcUrl: string) {
        if (!this.rpcUrlNeedsApiKey(rpcUrl)) return rpcUrl;

        const apiKey = StaticApiKeyGetter.get(this.rpcUrlApiKeyName(rpcUrl));
        return rpcUrl.replace(this.rpcUrlApiKeyPattern(rpcUrl), apiKey);
    }

    get config(): HttpNetworkUserConfig {
        return {
            url: this.rpcUrl,
            chainId: this.chainId,
            accounts: this.accounts,
        };
    }

    get explorerApiUrl(): string {
        return `${this.explorerUrl}/api`;
    }

    get customChain(): ChainConfig {
        return {
            network: this.name,
            chainId: this.chainId,
            urls: {
                apiURL: this.explorerApiUrl,
                browserURL: this.explorerUrl,
            },
        };
    }

    private rpcUrlNeedsApiKey(rpcUrl: string): boolean {
        return this.rpcUrlApiKeyMatches(rpcUrl) !== null;
    }

    private rpcUrlApiKeyName(rpcUrl: string): string {
        return this.rpcUrlApiKeyMatches(rpcUrl)?.[1]!; // returns `PATTERN` without the `{}`
    }

    private rpcUrlApiKeyPattern(rpcUrl: string): string {
        return this.rpcUrlApiKeyMatches(rpcUrl)?.[0]!; // returns `{PATTERN}`
    }

    private rpcUrlApiKeyMatches(rpcUrl: string): RegExpMatchArray | null {
        return rpcUrl.match(/\{(.+)\}/);
    }
}

export class NetworkConfigs {
    constructor(public accounts: HttpNetworkAccountsUserConfig) {
        this.accounts = accounts;
    }

    networks(filteredNetworks?: SupportedNetworkName[]): NetworksUserConfig {
        let networkConfigs: any = {};
        let networksToConsider: NetworkConfig[] = [];

        if (typeof filteredNetworks === "undefined") {
            networksToConsider = this.getNetworks();
        } else {
            this.getNetworks().filter((networkConfig) =>
                filteredNetworks!.includes(networkConfig.name as SupportedNetworkName),
            );
        }

        networksToConsider.map((network) => (networkConfigs[network.name] = network.config));
        return networkConfigs;
    }

    customChains(filteredNetworks?: SupportedNetworkName[]): ChainConfig[] {
        const networks = this.getNetworks();

        if (typeof filteredNetworks === undefined) {
            return networks.map((networkConfig) => networkConfig.customChain);
        }

        return networks
            .filter((networkConfig) => filteredNetworks!.includes(networkConfig.name as SupportedNetworkName))
            .map((networkConfig) => networkConfig.customChain);
    }

    network(name: SupportedNetworkName): HttpNetworkUserConfig {
        return this.networkConfig(name).config;
    }

    customChain(name: SupportedNetworkName): ChainConfig {
        return this.networkConfig(name).customChain;
    }

    networkConfig(name: SupportedNetworkName): NetworkConfig {
        const networkConfig = networks[name] as NetworkConfigData;
        return new NetworkConfig(name, networkConfig, this.accounts);
    }

    private getNetworks(): NetworkConfig[] {
        let userNetworkConfig = [];

        for (let name in networks) {
            const networkConfig = this.networkConfig(name as SupportedNetworkName);
            userNetworkConfig.push(networkConfig);
        }

        return userNetworkConfig;
    }
}
