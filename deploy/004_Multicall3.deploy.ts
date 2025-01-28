import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import contractNames from "../data/contractNames.json";
const name = contractNames.Multicall3;

const func: DeployFunction = async function (env: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = env;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy(name, {
        from: deployer,
        log: true,
    });
};

export default func;
func.tags = [name];
