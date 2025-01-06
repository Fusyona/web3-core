import { expect } from "chai";
import { ethers } from "hardhat";
import { getTokenHolders } from "../../../lib/tokens/erc20/helpers/getTokenHolders";
import * as typechain from "../../../typechain-types";
import contractNames from "../../../data/contractNames.json";
import { deployContract } from "../../../utils/functions";
import { Signer, parseEther } from "ethers";


describe("helpers/getTokenHolders", function () {
    let token: typechain.MockERC20;
    let owner: Signer;
    let alice: Signer;
    let bob: Signer;
    let signerCount: number

    beforeEach(async function () {
        await deployFixture();
        await transferTokens();
    });

    async function deployFixture() {
        const signers = await ethers.getSigners();
        signerCount = signers.length;
        token = await deployContract<typechain.MockERC20>(contractNames.MockERC20);
        owner = signers[0], 
        alice = signers[1], 
        bob = signers[2]
    }

    async function transferTokens() {
        const provider = ethers.provider;
        await provider.send("evm_mine", []);
        await token.connect(alice).transfer(bob.getAddress(), parseEther("1000"));
        await provider.send("evm_mine", []);
        await token.connect(bob).transfer(owner.getAddress(), parseEther("5000"));
        await provider.send("evm_mine", []);
        await token.connect(owner).transfer(alice.getAddress(), parseEther("3000"));
        await provider.send("evm_mine", []);
    }

    it("should return the correct holders amount", async function () {
        const { holders } = await getTokenHolders(await token.getAddress(), ethers.provider as any, "0x0");
        expect(holders.length).to.equal(signerCount);
    });

    it("should return the proper alice balance", async function () {
        const { holders } = await getTokenHolders(await token.getAddress(), ethers.provider as any, "0x0");
        const aliceAddress = await alice.getAddress();
        const aliceBalance = holders.find(holder => holder.address === aliceAddress)?.balance;
        expect(aliceBalance).to.equal(await token.balanceOf(aliceAddress));
    });

    it("should return the proper bob balance", async function () {
        const { holders } = await getTokenHolders(await token.getAddress(), ethers.provider as any, "0x0");
        const bobAddress = await bob.getAddress();
        const bobBalance = holders.find(holder => holder.address === bobAddress)?.balance;
        expect(bobBalance).to.equal(await token.balanceOf(bobAddress));
    });     

    it("should return the proper owner balance", async function () {
        const { holders } = await getTokenHolders(await token.getAddress(), ethers.provider as any, "0x0");
        const ownerAddress = await owner.getAddress();
        const ownerBalance = holders.find(holder => holder.address === ownerAddress)?.balance;
        expect(ownerBalance).to.equal(await token.balanceOf(ownerAddress));
    });

    it("should return modified balances from the sender after a transfer", async function () {
        await token.connect(owner).transfer(await bob.getAddress(), parseEther("1000"));
        const { holders } = await getTokenHolders(await token.getAddress(), ethers.provider as any, "0x0");
        const ownerAddress = await owner.getAddress();
        const ownerBalance = holders.find(holder => holder.address === ownerAddress)?.balance;
        expect(ownerBalance).to.equal(await token.balanceOf(ownerAddress));
    });

    it("should return modified balances from the receiver after a transfer", async function () {
        await token.connect(owner).transfer(await bob.getAddress(), parseEther("1000"));
        const { holders } = await getTokenHolders(await token.getAddress(), ethers.provider as any, "0x0");
        const bobAddress = await bob.getAddress();
        const bobBalance = holders.find(holder => holder.address === bobAddress)?.balance;
        expect(bobBalance).to.equal(await token.balanceOf(bobAddress));
    });
});
