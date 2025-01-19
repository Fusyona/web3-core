import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

// import { isDevelopmentNetwork } from "../helper_hardhat_config";
import contractNames from "../data/contractNames.json";

const func: DeployFunction = async function (env: HardhatRuntimeEnvironment) {
    // if (isDevelopmentNetwork()) {
        const { deployments, getNamedAccounts } = env;
        const { deploy } = deployments;
        const { deployer } = await getNamedAccounts();
        const addresses = (await ethers.getSigners()).map((s) => s.address);

        await deploy(contractNames.MockERC721, {
            from: deployer,
            log: true,
            args: [addresses],
        });
    // }
};

export default func;
func.tags = [contractNames.MockERC721];
