import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deploy} = hre.deployments
    const {deployer} = await hre.getNamedAccounts()
    
    const signCount = 4
    const accounts = await hre.getUnnamedAccounts()
    const signers: string[] = []

    for (let i = 0; i < 2*signCount; i++) {
        signers.push(accounts[i])
    }

    await deploy("MSExample", {
        from: deployer, 
        args: [
            signers,
            signCount
        ]
    })
}

export default func
func.tags = ["MSExample"]