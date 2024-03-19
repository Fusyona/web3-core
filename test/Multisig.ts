import { expect } from "chai";
import { ethers } from "hardhat";
import { Multisig } from "../typechain-types";

describe("Multisig", function () {
    let signerAddresses: string[] = [];
    let multisig: Multisig;

    beforeEach(async () => {
        const signers = await ethers.getSigners();

        // Using 3 wallets for initial test
        for (let i = 0; i < 3; i++) {
            signerAddresses.push(await signers[i].getAddress());
        }
        const Multisig = await ethers.getContractFactory("Multisig");
        multisig = (await Multisig.deploy(signerAddresses)) as Multisig;
        await multisig.deployed();
    });

    describe("Deployment", function () {
        it("Should return the correct signers array", async function () {
            for (let i = 0; i < 3; i++)
                expect(await multisig.signers(i)).to.equal(signerAddresses[i]);
        });
    });
});
