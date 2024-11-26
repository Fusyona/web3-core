import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer, BrowserProvider, parseEther, formatEther } from "ethers";
import { deployContract } from "../../utils/functions";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import * as typechain from "../../typechain-types";
import ERC20  from "../../lib/tokens/erc20/ERC20";
import contractNames from "../../data/contractNames.json";

describe("ERC20 token wrapper", function () {
    let token: typechain.MockERC20;
    let owner: Signer;
    let alice: Signer;
    let bob: Signer;

  async function deployTokenFixture() {
    const signers = await ethers.getSigners();

    token = await deployContract<typechain.MockERC20>(contractNames.MockERC20)

    owner = signers[0]
    alice = signers[1]
    bob = signers[2]
  }

  describe("read only functions", function () {
    let wrapper: ERC20
    let tokenOwnerBalance: bigint

    beforeEach(async function () {
        await loadFixture(deployTokenFixture);
        wrapper = await ERC20.fromAddressAndProvider(
            await token.getAddress(), 
            ethers.provider as any
        )
        tokenOwnerBalance = await token.balanceOf(await owner.getAddress())
    })

    it("should return the owner balance", async function () {      
      const ownerBalance = await wrapper.contractCall.balanceOf(await owner.getAddress());
      expect(ownerBalance).to.equal(tokenOwnerBalance);
    });
  });

  describe("transfer functions", function () {
    let wrapper: ERC20

    beforeEach(async function () {
        await loadFixture(deployTokenFixture);
        wrapper = await ERC20.fromAddressAndProvider(
            await token.getAddress(), 
            ethers.provider as any
        )
    })

    it("should transfer tokens between accounts using withRunner", async function () {
        const preBalance = await wrapper.contractCall.balanceOf(await owner.getAddress())
        const amount = parseEther("10")

        await wrapper.withSigner(await alice.getAddress()).transfer(await owner.getAddress(), amount)
        await wrapper.withSigner(await bob.getAddress()).transfer(await owner.getAddress(), amount)

        const postBalance = await wrapper.contractCall.balanceOf(await owner.getAddress())

        expect(postBalance).to.equal(preBalance+amount*2n);
    });

    it("should approve andtransfer from another account", async function () {      
      const initialOwnerBalance = await wrapper.contractCall.balanceOf(await owner.getAddress());
      const amount = parseEther("10")

      await wrapper.withSigner(await owner.getAddress()).approve(await alice.getAddress(), amount)
      await wrapper.withSigner(await alice.getAddress()).transferFrom(await owner.getAddress(), await bob.getAddress(), amount)

      const postBalance = await wrapper.contractCall.balanceOf(await owner.getAddress())

      expect(postBalance).to.equal(initialOwnerBalance-amount)
    });
  });
});
