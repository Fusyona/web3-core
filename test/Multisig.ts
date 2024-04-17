import { expect } from "chai";
import {ethers, deployments, getUnnamedAccounts} from "hardhat";
import { abi as MSExampleAbi } from "../artifacts/contracts/Multisig_example.sol/MSExample.json" ;
import { MSExample } from "../typechain-types" ;

describe("Multisig", async function () {
    let multisigExample: MSExample;

    const signCount = 4;

    const setup = deployments.createFixture(async () => {
        await deployments.fixture("MSExample")

        const signerAddresses = await getUnnamedAccounts()
        let signers: ethers.Signer[] = []

        for (let i = 0; i < signerAddresses.length; i++) {
            signers.push(await ethers.getSigner(signerAddresses[i]))
        }
        const multisigExampleContract = await ethers.getContract<MSExample>("MSExample")

        return {
            multisigExampleContract,
            signers
        }
    })

    describe("Deploy", function () {
        it("Should return the correct signers array", async function () {
            const {signers, multisigExampleContract} = await setup()

            for (let i = 0; i < 2*signCount; i++)
                expect(await multisigExampleContract.signers(i)).to
                    .equal(signers[i].address);
        });
    })

    describe("Modifier sign", function() {
        it("Should not sign twice", async function() {
            const {signers, multisigExampleContract} = await setup();

            expect(await multisigExampleContract.connect(signers[0]).modifierHelloWorld())
                .to.not.be.reverted;
            await expect(multisigExampleContract.connect(signers[0]).modifierHelloWorld())
                .to.be.revertedWithCustomError(
                    multisigExampleContract, 
                    "AlreadySignedCall"
                );
        })
        it("Should revert invalid signer", async function() {
            const {signers, multisigExampleContract} = await setup();

            await expect(multisigExampleContract.connect(signers[2*signCount]).modifierHelloWorld())
                .to.be.revertedWithCustomError(
                    multisigExampleContract, 
                    "InvalidSigner"
                );
        })
        it("Should emit CallExecuted event", async function() {
            const {signers, multisigExampleContract} = await setup();

            for (let i = 0; i < signCount - 1; i++) {
                expect(await multisigExampleContract.connect(signers[i]).modifierHelloWorld())
                .to.not.be.reverted;
            }
            // Need to return the function value
            expect(await multisigExampleContract.connect(signers[signCount - 1]).modifierHelloWorld())
            .to.emit(
                multisigExampleContract,
                "CallExecuted(bytes32)"
            );
        })
    })
});
