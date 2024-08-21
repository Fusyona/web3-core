import { expect } from "chai"
import { ethers } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { Signer } from "ethers"
import {ExternalMulticall, ERC20} from "../typechain-types"
import { ExternalMulticallWrapper} from "../lib/multicall"
import { ERC20Wrapper } from "../lib/token-wrapper"

describe("ExternalMulticall contract", function () {
    let multicallContract: ExternalMulticall
    let mockTokenAContract: ERC20 ;
    let mockTokenBContract: ERC20 ;
    let multicallWrapper: ExternalMulticallWrapper
    let deployer: Signer ;
    
    async function deployFixture() {
        [deployer] = await ethers.getSigners()
        multicallContract = await ethers.deployContract("ExternalMulticall", []);
        mockTokenAContract = await ethers.deployContract("ERC20Mock", [deployer, 10000, "TokenA", "TKA"]);
        mockTokenBContract = await ethers.deployContract("ERC20Mock", [deployer, 10000, "TokenB", "TKB"])

        multicallWrapper = new ExternalMulticallWrapper(
            multicallContract, 
            ethers.provider, 
            new ERC20Wrapper(mockTokenAContract.target, ethers.provider), 
            new ERC20Wrapper(mockTokenBContract.target, ethers.provider)
        )
    }

    beforeEach(async () => {
        await loadFixture(deployFixture)
    });

    it("should transfer twice after approve", async function() {
        expect(await mockTokenAContract.connect(deployer).approve(await multicallWrapper.getAddress(), 1000))
        .to.not.be.reverted
        expect(await mockTokenBContract.connect(deployer).approve(await multicallWrapper.getAddress(), 1000))
        .to.not.be.reverted

        await multicallWrapper.withSigner(deployer).batchTransfer(await deployer.getAddress(), '100', '100')

        expect(await mockTokenAContract.balanceOf(mockTokenAContract.target))
        .to.be.equal('100')
        expect(await mockTokenBContract.balanceOf(mockTokenBContract.target))
        .to.be.equal('100')
    })
})
