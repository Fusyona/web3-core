import { parseEther, Signer } from "ethers";
import { ethers } from "hardhat";
import getTransactionBlock from "../../../lib/tokens/erc20/helpers/getTransactionBlock";
import { expect } from "chai";

describe("getTransactionBlock", async function () {
    let alice: Signer
    let bob: Signer

    before(async function () {
        const signers = await ethers.getSigners()

        alice = signers[0]
        bob = signers[1]
    })

    it("should return transaction block", async function () {
        const tx = await alice.sendTransaction({to: await bob.getAddress(), value: parseEther("1")})
        const block = await ethers.provider.getBlockNumber()

        const txBlock = await getTransactionBlock(tx.hash, 31337, ethers.provider as any)
        expect(txBlock).to.be.equal(block)
    })

    it("should return transaction block from another block", async function () {
        const tx = await alice.sendTransaction({to: await bob.getAddress(), value: parseEther("1")})
        const block = await ethers.provider.getBlockNumber()

        for (let i = 0; i < 5; i++) {
            await bob.sendTransaction({to: await alice.getAddress(), value: parseEther("1")})
            ethers.provider.send("evm_mine", [])
        }

        const txBlock = await getTransactionBlock(tx.hash, 31337, ethers.provider as any)
        expect(txBlock).to.be.equal(block)
    })
})