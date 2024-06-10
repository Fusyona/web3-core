import {ethers} from "hardhat"
import { expect } from "chai"
import { ERC721Wrapper } from "../../lib/wrappers/tokens/erc721"
import { ERC721Mock } from "../../typechain-types"

describe("ERC721 Wrapper", async () => {
    let tokenContract: ERC721Mock
    let tokenWrapper: ERC721Wrapper

    beforeEach(async () => {
        const [deployer] = await ethers.getSigners()

        tokenContract = await ethers.deployContract("ERC721Mock", [deployer, "Mock", "MKT"])
        tokenWrapper = new ERC721Wrapper(
            tokenContract.target,
            ethers.provider
        )
    })

    it("should show token symbol", async () => {
        expect(await tokenWrapper.call.symbol())
            .to.be.equal("MKT")
    })
    it("should show token name", async () => {
        expect(await tokenWrapper.call.name())
            .to.be.equal("Mock")
    })
    it("Should show tokenUri", async () => {
        expect(await tokenWrapper.call.tokenURI('1'))
            .to.be.equal("")
    })
    it("should transferFrom", async () => {
        const [deployer, target] = await ethers.getSigners()

        expect(await tokenWrapper.withSigner(deployer).transferFrom(await deployer.getAddress(), await target.getAddress(), "1"))
            .to.changeTokenBalance(tokenContract, [deployer, target], [-1, 1])
    })
    it("should approve and transferFrom", async () => {
        const [deployer, target, spender] = await ethers.getSigners()

        await tokenWrapper.withSigner(deployer).approve(await spender.getAddress(), "1")

        expect(await tokenWrapper.withSigner(spender).transferFrom(await deployer.getAddress(), await target.getAddress(), "1"))
            .to.changeTokenBalance(tokenContract, [deployer, target], [-1, 1])        
    })
    it("should setApprovalForAll and transferFrom", async () => {
        const [deployer, target, spender] = await ethers.getSigners()

        await tokenWrapper.withSigner(target).setApprovalForAll(await spender.getAddress(), true)

        expect(await tokenWrapper.withSigner(spender).transferFrom(await target.getAddress(), await deployer.getAddress(), "1"))
            .to.changeTokenBalance(tokenContract, [target, deployer], [-1, 1])
    })
})