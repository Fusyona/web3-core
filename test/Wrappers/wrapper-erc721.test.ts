import {ethers} from "hardhat"
import { expect } from "chai"
import { ERC721Wrapper } from "../../lib/wrappers/tokens/erc721"
import { ERC721Mock } from "../../typechain-types"

describe("ERC721 Wrapper", async () => {
    let tokenContract: ERC721Mock

    beforeEach(async () => {
        const [deployer] = await ethers.getSigners()

        tokenContract = await ethers.deployContract("ERC721Mock", [deployer, "Mock", "MKT"])
    })

    it("should show token info", async () => {
        const tokenWrapper = new ERC721Wrapper(
            tokenContract.target,
            ethers.provider
        )

        expect(await tokenWrapper.symbol())
            .to.be.equal("MKT")
        expect(await tokenWrapper.name())
            .to.be.equal("Mock")
        expect(await tokenWrapper.tokenUri('1'))
            .to.be.equal("")
    })
    it("should transferFrom", async () => {
        const [deployer, target] = await ethers.getSigners()

        const tokenWrapper = new ERC721Wrapper(
            tokenContract.target, ethers.provider
        )

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("1")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("0")

        await tokenWrapper.withSigner(deployer).transferFrom(await deployer.getAddress(), await target.getAddress(), "1")

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("0")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("1")
    })
    it("should approve and approveAll and transferFrom", async () => {
        const [deployer, target, spender] = await ethers.getSigners()

        const tokenWrapper = new ERC721Wrapper(
            tokenContract.target, ethers.provider
        )

        await tokenWrapper.withSigner(deployer).approve(await spender.getAddress(), "1")

        expect(await tokenWrapper.getApproved("1"))
            .to.be.equal(await spender.getAddress())

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("1")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("0")

        await tokenWrapper.withSigner(spender).transferFrom(await deployer.getAddress(), await target.getAddress(), "1")

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("0")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("1")
        expect(await tokenWrapper.ownerOf("1"))
            .to.be.equal(await target.getAddress())

        await tokenWrapper.withSigner(target).setApprovalForAll(await spender.getAddress(), true)

        expect(await tokenWrapper.isApprovedForAll(await target.getAddress(), await spender.getAddress()))

        await tokenWrapper.withSigner(spender).transferFrom(await target.getAddress(), await deployer.getAddress(), "1")

        expect(await tokenWrapper.balanceOf(await deployer.getAddress()))
            .to.be.equal("1")
        expect(await tokenWrapper.balanceOf(await target.getAddress()))
            .to.be.equal("0")
        expect(await tokenWrapper.ownerOf("1"))
            .to.be.equal(await deployer.getAddress())
    })
})