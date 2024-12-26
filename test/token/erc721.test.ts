import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer, BrowserProvider, parseEther, formatEther } from "ethers";
import { deployContract } from "../../utils/functions";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import * as typechain from "../../typechain-types";
import ERC721  from "../../lib/tokens/erc721/ERC721";
import contractNames from "../../data/contractNames.json";

describe("ERC20 token wrapper", function () {
    let token: typechain.MockERC721;
    let owner: Signer;
    let alice: Signer;
    let bob: Signer;

  async function deployTokenFixture() {
    const signers = await ethers.getSigners();

    token = await deployContract<typechain.MockERC721>(contractNames.MockERC721)

    owner = signers[0]
    alice = signers[1]
    bob = signers[2]
  }

  describe("read only functions", function () {
    let wrapper: ERC721

    beforeEach(async function () {
        await loadFixture(deployTokenFixture);
        wrapper = await ERC721.fromAddressAndProvider(
            await token.getAddress(), 
            ethers.provider as any
        )
    })

    it("should return the ownerOf tokenId 1", async function () {      
        const ownerOfOne = await wrapper.contractCall.ownerOf(1n)
      expect(ownerOfOne).to.equal(await owner.getAddress());
    });
  });

  describe("transfer functions", function () {
    let wrapper: ERC721

    beforeEach(async function () {
        await loadFixture(deployTokenFixture);
        wrapper = await ERC721.fromAddressAndProvider(
            await token.getAddress(), 
            ethers.provider as any
        )
    })

    it("should transfer tokenId 1 to alice", async function () {
        await wrapper.withSigner(await owner.getAddress()).transferFrom(await owner.getAddress(), await alice.getAddress(), 1n)

        const ownerOfOne = await wrapper.contractCall.ownerOf(1n)

        expect(ownerOfOne).to.equal(await alice.getAddress());
    });

    it("should approve and bob transfer from owner to alice the tokenId 1", async function () { 
      await wrapper.withSigner(await owner.getAddress()).approve(await bob.getAddress(), 1n)

      await wrapper.withSigner(await bob.getAddress()).transferFrom(await owner.getAddress(), await alice.getAddress(), 1n)

      const ownerOfOne = await wrapper.contractCall.ownerOf(1n)

        expect(ownerOfOne).to.equal(await alice.getAddress());
    });
  });
});
