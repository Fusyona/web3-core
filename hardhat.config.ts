import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint"
import "hardhat-deploy";
import "hardhat-contract-sizer"
import "hardhat-inspect";
import "hardhat-neovim"


const config: HardhatUserConfig = {
    solidity: "0.8.24",
    namedAccounts: {
        deployer: {
            default: "0x16c7C5849A6769d58F9df6A26960F3293EF379e0",
            localhost: 0,
            hardhat: 0,
        }
    }
};

export default config;
