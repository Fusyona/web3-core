import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { CooldownExample } from "../typechain-types";
import { CooldownExample as errors } from "../data/errors.json";

describe("Cooldown contract", function () {
    const COOLDOWN_TIME = 1e10;

    let owner: Signer;
    let testContract: CooldownExample;

    before(async () => {
        [owner] = await ethers.getSigners();
    });

    beforeEach(async () => {
        testContract = await ethers.deployContract("CooldownExample", [COOLDOWN_TIME]);
    });

    it("fail when executing before cooldown is meet using requireCooldown modifier", async function () {
        await testContract.helloWorld();
        await expect(testContract.helloWorld()).to.be.revertedWithCustomError(
            testContract,
            errors.InsufficientCooldown,
        );
    });

    it("fail when executing before cooldown is meet using _checkCooldown()", async function () {
        await testContract.helloWorld2();
        await expect(testContract.helloWorld2()).to.be.revertedWithCustomError(
            testContract,
            errors.InsufficientCooldown,
        );
    });

    it("allow to execute when cooldown is meet using requireCooldown modifier", async function () {
        await testContract.helloWorld();
        await time.increaseTo((await time.latest()) + COOLDOWN_TIME + 1);
        await expect(testContract.helloWorld()).not.to.be.revertedWithCustomError(
            testContract,
            errors.InsufficientCooldown,
        );
    });

    it("allow to execute when cooldown is meet using _checkCooldown()", async function () {
        await testContract.helloWorld2();
        await time.increaseTo((await time.latest()) + COOLDOWN_TIME + 1);
        await expect(testContract.helloWorld2()).not.to.be.revertedWithCustomError(
            testContract,
            errors.InsufficientCooldown,
        );
    });
});
