import {expect} from "chai"
import {ethers, network} from "hardhat"
import { Interface, Addressable } from "ethers"
import {abi as mockTokenABI} from "../artifacts/contracts/mocks/ERC20Mock.sol/ERC20Mock.json"
import {ExternalMulticall, ERC20} from "../typechain-types"
import {CallQuery, ExternalMulticallWrapper} from "../lib/multicall"
import { ERC20Wrapper } from "../lib/token-wrapper"
import { Contract, BrowserProvider, JsonRpcProvider } from "ethers"

describe("ExternalMulticall contract", function () {
    let multicallContract: ExternalMulticall
    let mockTokenAContract, mockTokenBContract: ERC20
    let multicallWrapper: ExternalMulticallWrapper

    beforeEach(async () => {
        const signers = await ethers.getSigners()
        multicallContract = await ethers.deployContract("ExternalMulticall", []);
        mockTokenAContract = await ethers.deployContract("ERC20Mock", [signers[0], 10000, "TokenA", "TKA"]);
        mockTokenBContract = await ethers.deployContract("ERC20Mock", [signers[0], 10000, "TokenB", "TKB"])
        // const provider = new ethers.providers.JsonRpcProvider()

        const provider = new BrowserProvider(network.provider)

        multicallWrapper = new ExternalMulticallWrapper(
            multicallContract, 
            provider, 
            new ERC20Wrapper(mockTokenAContract.target, provider), 
            new ERC20Wrapper(mockTokenBContract.target, provider)
        )
    });

    it("should transfer twice after approve", async function() {
        const signers = await ethers.getSigners()
        const deployer = signers[0]

        expect(await mockTokenAContract.connect(deployer).approve(await multicallWrapper.getAddress(), 1000))
        .to.not.be.reverted
        expect(await mockTokenBContract.connect(deployer).approve(await multicallWrapper.getAddress(), 1000))
        .to.not.be.reverted

        await multicallWrapper.withSigner(deployer).batchTransfer(deployer.address, '100', '100')

        expect(await mockTokenAContract.balanceOf(mockTokenAContract.target))
        .to.be.equal('100')
        expect(await mockTokenBContract.balanceOf(mockTokenBContract.target))
        .to.be.equal('100')
    })
})