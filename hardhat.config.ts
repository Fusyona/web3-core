import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-inspect";
import "hardhat-neovim";
import { NetworkConfigs } from "./lib/config";

const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const ANOTHER_PRIVATE_KEY = vars.get("ANOTHER_PRIVATE_KEY");
const networks = new NetworkConfigs([PRIVATE_KEY, ANOTHER_PRIVATE_KEY]);

const config: HardhatUserConfig = {
    solidity: "0.8.25",
    namedAccounts: {
        deployer: {
            default: "0x16c7C5849A6769d58F9df6A26960F3293EF379e0",
            localhost: 0,
            hardhat: 0,
        },
    },
    networks: {
        sei: networks.network("sei"),

        sepolia: networks.network("sepolia"),
        bscTestnet: networks.network("bscTestnet"),
        seiTestnet: networks.network("seiTestnet"),
        seiDevnet: networks.network("seiDevnet"),
        baseSepolia: networks.network("baseSepolia"),
    },
    gasReporter: {
        enabled: false,
    },
};

export default config;
