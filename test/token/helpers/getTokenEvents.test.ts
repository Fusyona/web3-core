import { expect } from "chai";
import { ethers } from "hardhat";
import getTokenEvents from "../../../lib/tokens/erc20/helpers/getTokenEvents";
import * as typechain from "../../../typechain-types";
import contractNames from "../../../data/contractNames.json";
import { deployContract } from "../../../utils/functions";
import { Signer, parseEther } from "ethers";


describe("helpers/getTokenEvents", function () {
    let token: typechain.MockERC20;
    let owner: Signer;
    let alice: Signer;
    let bob: Signer;
    let signerCount: number

    beforeEach(async function () {
        await deployFixture();
        // await transferTokens();
    });

    async function deployFixture() {
        const signers = await ethers.getSigners();
        signerCount = signers.length;
        token = await deployContract<typechain.MockERC20>(contractNames.MockERC20);
        owner = signers[0], 
        alice = signers[1], 
        bob = signers[2]
    }

    it("should return token Transfer events", async () => {
        await token.connect(alice).transfer(await bob.getAddress(), parseEther('1'))

        const {events} = await getTokenEvents(await token.getAddress(), 'Transfer', 31337, "0", 1000, ethers.provider as any)
        expect(events.length).to.be.greaterThan(0)
    })

    it("should return token Approval events", async () => {
        await token.connect(alice).approve(await bob.getAddress(), parseEther('1'))

        const {events} = await getTokenEvents(await token.getAddress(), 'Approval', 31337, "0", 1000, ethers.provider as any)
        expect(events.length).to.be.equal(1)
    })

    it("should return event args properly", async () => {
        const bobAddress = await bob.getAddress()
        const amount = parseEther('1')
        await token.connect(alice).transfer(bobAddress, amount)

        const {events} = await getTokenEvents(await token.getAddress(), 'Transfer', 31337, "0", 1000, ethers.provider as any)
        const lastTransfer = events[events.length - 1]
        expect(lastTransfer.args[0]).to.be.equal(await alice.getAddress())
        expect(lastTransfer.args[1]).to.be.equal(bobAddress)
        expect(lastTransfer.args[2]).to.be.equal(amount)
    })

    it("should return events from a block interval", async () => {
        await ethers.provider.send('evm_mine', [])
        const currentBlock = await ethers.provider.getBlockNumber()
        await token.connect(alice).transfer(await bob.getAddress(), parseEther('1'))
        await ethers.provider.send('evm_mine', [])

        const {events} = await getTokenEvents(await token.getAddress(), 'Transfer', 31337, currentBlock.toString(), 1, ethers.provider as any)
        expect(events.length).to.be.equal(1)
    })
})