import {ethers} from "hardhat"
import { expect } from "chai"
import { ERC20Wrapper } from "../../lib/wrappers/tokens/erc20"
import { ERC20Mock } from "../../typechain-types"

describe("ERC20 Wrapper", async () => {
    let tokenContract: ERC20Mock

    beforeEach(async () => {
        const [deployer] = await ethers.getSigners()

        tokenContract = await ethers.deployContract("ERC20Mock", [deployer, 100, "Mock", "MKT"])
    })

    it("should show token info", async () => {
        const tokenWrapper = new ERC20Wrapper(
            tokenContract.target, ethers.provider
        )

        expect(await tokenWrapper.symbol())
            .to.be.equal("MKT")
        expect(await tokenWrapper.name())
            .to.be.equal("Mock")
        expect(await tokenWrapper.decimals())
            .to.be.equal("18")
        expect(await tokenWrapper.totalSupply())
            .to.be.equal("100")
    })
    it("should transfer", async () => {
        const [deployer, target] = await ethers.getSigners()

        const tokenWrapper = new ERC20Wrapper(
            tokenContract.target, ethers.provider
        )

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("100")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("0")

        await tokenWrapper.withSigner(deployer).transfer(await target.getAddress(), "10")

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("90")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("10")
    })
    it("should approve and transferFrom", async () => {
        const [deployer, target, spender] = await ethers.getSigners()

        const tokenWrapper = new ERC20Wrapper(
            tokenContract.target, ethers.provider
        )

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("100")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("0")

        await tokenWrapper.withSigner(deployer).approve(await spender.getAddress(), "10")

        expect(await tokenWrapper.allowance(await deployer.getAddress(), await spender.getAddress()))
            .to.be.equal("10")

        await tokenWrapper.withSigner(spender).transferFrom(await deployer.getAddress(), await target.getAddress(), "10")

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("90")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("10")
    })
})
