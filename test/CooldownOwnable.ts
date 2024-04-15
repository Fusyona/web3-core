import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers" ;
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { CooldownOwnableExample } from "../typechain-types" ;
import contractNames from "../data/contractNames.json" ;
import { CooldownOwnableExample as errors } from "../data/errors.json" ;

describe("CooldownOwnable contract", function () {

    const COOLDOWN_TIME = 1e10 ;

    let owner : Signer ;
    let user : Signer ;
    let testContract: CooldownOwnableExample ;

    before(async () => {
        [owner, user] = await ethers.getSigners() ;
    })

    beforeEach(async () => {
        testContract = await ethers.deployContract(
            contractNames.CooldownOwnableExample,
            [ COOLDOWN_TIME, await owner.getAddress() ]
        ) ;
    });

    it("fails when user try to set cooldown time", async function () {
        await expect(testContract.connect(user).setCooldownTime(COOLDOWN_TIME))
            .to.be.revertedWithCustomError(testContract, errors.OwnableUnauthorizedAccount)
    });

    it("allow owner to set cooldown time", async function () {
        await testContract.connect(owner).setCooldownTime(2 * COOLDOWN_TIME) ;
        await testContract.connect(user).helloWorld() ;

        expect(await testContract.cooldownOf( await user.getAddress() ))
            .to.be.revertedWithCustomError(testContract, errors.InsufficientCooldown)
    });

    it("updates cooldown correctly", async function () {
        const TIMESTAMP =  await time.latest() ;
        await testContract.connect(user).helloWorld();
        expect(await testContract.cooldownOf( await user.getAddress()) )
            .to.equal(TIMESTAMP + 1) // we add +1 because we cound the block generated when calling hello world
    });

})
