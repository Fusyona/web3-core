import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "hardhat-inspect";
import "@nomiclabs/hardhat-solhint"


const config: HardhatUserConfig = {
    solidity: "0.8.25",
    namedAccounts: {
        deployer: {
            default: "0x16c7C5849A6769d58F9df6A26960F3293EF379e0",
            localhost: 0,
            hardhat: 0,
        }
    }
};

export default config;
