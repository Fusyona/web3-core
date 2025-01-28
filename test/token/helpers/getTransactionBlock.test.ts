import { parseEther, Signer } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import getTransactionBlock from "../../../lib/tokens/erc20/helpers/getTransactionBlock";

describe("getTransactionBlock", async function () {
    const value = parseEther("1")
    let alice: Signer
    let bob: Signer

    before(async function () {
        [alice,bob] = await ethers.getSigners()
    })

    it("should return transaction block", async function () {
        const tx = await alice.sendTransaction({to: await bob.getAddress(), value })
        const block = await ethers.provider.getBlockNumber()

        const txBlock = await getTransactionBlock(tx.hash, 31337, ethers.provider as any)
        expect(txBlock).to.be.equal(block)
    })

    it("should return transaction block from another block", async function () {
        const tx = await alice.sendTransaction({to: await bob.getAddress(), value })
        const block = await ethers.provider.getBlockNumber()

        for (let i = 0; i < 5; i++) {
            await bob.sendTransaction({to: await alice.getAddress(), value })
            ethers.provider.send("evm_mine", [])
        }

        const txBlock = await getTransactionBlock(tx.hash, 31337, ethers.provider as any)
        expect(txBlock).to.be.equal(block)
    })
})
