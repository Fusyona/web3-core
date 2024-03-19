import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Multisig", function() {
    async function deployMultisigContract() {
        const signers = await ethers.getSigners();

        let signerAddresses: string[] = [];
        // Using 3 wallets for initial test
        for (let i  = 0; i < 3; i++) {
            signerAddresses.push(await signers[i].getAddress());
        }

        const Multisig = await ethers.getContractFactory("Multisig");
        const multisig = await Multisig.deploy(signerAddresses);
        
        return { multisig, signers, signerAddresses };
    }

    describe("Deployment", function() {
        it("Should return the correct signers array", async function() {
            const { multisig, signerAddresses } = await loadFixture(deployMultisigContract);
            expect(await multisig.signers()).to.equal(signerAddresses);
        });
    })
})