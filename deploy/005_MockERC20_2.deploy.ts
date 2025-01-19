import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import contractNames from "../data/contractNames.json";
const name = contractNames.MockERC20 + "_2";

const func: DeployFunction = async function (env: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = env;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const addresses = (await ethers.getSigners()).map((s) => s.address);

    await deploy(name, {
        contract: contractNames.MockERC20,
        from: deployer,
        log: true,
        args: [addresses],
    });
};

export default func;
func.tags = [name];
