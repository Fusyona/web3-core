import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
    const {deploy} = hre.deployments
    const {deployer} = await hre.getNamedAccounts()

    await deploy("ERC20", {
        from: deployer,
        args: ["TokenA", "TKA"]
    })
}

export default func
func.tags = ["MockTokenA"]