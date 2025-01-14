import {expect} from "chai"
import {ethers, deployments, getUnnamedAccounts, getNamedAccounts} from "hardhat"
import {abi as mockTokenABI} from "../artifacts/contracts/mocks/MockERC20.sol/MockERC20.json"
import {Interface} from "ethers"
import {ERC20} from "../typechain-types"
import { ExternalMulticall } from "../typechain-types/contracts/Multicall.sol/ExternalMulticall"

type CallQuery = {
    target: string,
    data: string
}

describe("Multicall", function() {
    const setup = deployments.createFixture(async () => {
        await deployments.fixture("ExternalMulticall")
        await deployments.fixture("MockTokenA")
        await deployments.fixture("MockTokenB")

        const multicallContract = await ethers.getContract<ExternalMulticall>("ExternalMulticall")
        const mockTokenAContract = await ethers.getContract<ERC20>("MockTokenA")
        const mockTokenBContract = await ethers.getContract<ERC20>("MockTokenB")

        const mockAbiInterface = new Interface(mockTokenABI)

        return {
            multicallContract,
            mockTokenAContract,
            mockTokenBContract,
            mockAbiInterface
        }
    })
    
    describe("Tx batch", async function() {
        it("Should transfer twice after approve", async function() {
            const {multicallContract, mockTokenAContract, mockAbiInterface} = await setup()
            const {deployerAddress} = await getNamedAccounts()
            const accounts = await getUnnamedAccounts()
            const deployer = await ethers.getSigner(deployerAddress)

            const transferSignature = "transferFrom(adress,address,uint256)"
            const callQueries: CallQuery[] = [
                {
                    target: await mockTokenAContract.getAddress(),
                    data: mockAbiInterface.encodeFunctionData(transferSignature, [deployer, accounts[1], 100])
                },
                {   
                    target: await mockTokenAContract.getAddress(),
                    data: mockAbiInterface.encodeFunctionData(transferSignature, [deployer, accounts[1], 200])
                }
            ]

            expect(await mockTokenAContract.connect(deployer).approve(multicallContract, 1000))
            .to.not.be.reverted

            expect(await multicallContract.connect(deployer).multicall(callQueries))
            .to.not.be.reverted

            await expect(mockTokenAContract.balanceOf(accounts[1]))
            .to.be.equal(300)

        })
    })
})