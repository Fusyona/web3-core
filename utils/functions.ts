import hre from "hardhat"
import { Contract } from "ethers"

export async function deployContract<T>(contractName: string) : Promise<T> {
    await hre.deployments.fixture(contractName)
    const contract = await getContract(contractName)
    return contract as unknown as T
}

export async function getContract(contract: string) : Promise<Contract> {
    const deployment = await hre.deployments.get(contract)
    return hre.ethers.getContractAt(deployment.abi, deployment.address)
}

export async function getContractAt(contract: string, address: string) : Promise<Contract> {
    const deployment = await hre.deployments.get(contract)
    return hre.ethers.getContractAt(deployment.abi, address)
}
