import {ethers} from "hardhat"
import { expect } from "chai"
import { ERC20Wrapper } from "../../lib/wrappers/tokens/erc20"
import { ERC20Mock } from "../../typechain-types"

describe("ERC20 Wrapper", async () => {
    let tokenContract: ERC20Mock
    let tokenWrapper: ERC20Wrapper

    beforeEach(async () => {
        const [deployer] = await ethers.getSigners()

        tokenContract = await ethers.deployContract("ERC20Mock", [deployer, 100, "Mock", "MKT"])
        tokenWrapper = new ERC20Wrapper(
            tokenContract.target, 
            ethers.provider
        )
    })

    it("should show token symbol", async () => {
        expect(await tokenWrapper.symbol())
            .to.be.equal("MKT")
    })
    it("should show token name", async () => {
        expect(await tokenWrapper.name())
            .to.be.equal("Mock")
    })
    it("should show token decimals", async () => {
        expect(await tokenWrapper.decimals())
            .to.be.equal("18")
    })
    it("should show token totalSupply", async () => {
        expect(await tokenWrapper.totalSupply())
            .to.be.equal("100")
    })
    it("should transfer", async () => {
        const [deployer, target] = await ethers.getSigners()

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("100")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("0")

        expect(await tokenWrapper.withSigner(deployer).transfer(await target.getAddress(), "10"))
            .to.changeTokenBalance(tokenContract, [deployer, target], [-10, 10])
    })
    it("should approve and transferFrom", async () => {
        const [deployer, target, spender] = await ethers.getSigners()

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("100")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("0")

        await tokenWrapper.withSigner(deployer).approve(await spender.getAddress(), "10")

        expect(await tokenWrapper.allowance(await deployer.getAddress(), await spender.getAddress()))
            .to.be.equal("10")

        

        expect(await tokenWrapper.withSigner(spender).transferFrom(await deployer.getAddress(), await target.getAddress(), "10"))
            .to.changeTokenBalance(tokenContract, [deployer, target], [-10, 10])
    })
})
