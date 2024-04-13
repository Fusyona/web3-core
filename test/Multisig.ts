import { expect } from "chai";
import {ethers} from "hardhat";
import { abi as MSExampleAbi } from "../artifacts/contracts/Multisig_example.sol/MSExample.json" ;
import { MSExample } from "../typechain-types" ;

describe("Multisig", function () {
    let multisigExample: MSExample;

    const signerCount = 4;
    const abiInterface = new ethers.Interface(MSExampleAbi);

    let signers : any ;
    let signerAddresses: string[] = [] ;

    before(async () => {
        signers = await ethers.getSigners()
        for (let i = 0; i < signerCount; i++) {
            signerAddresses.push(signers[i].address);
        }
    })

    beforeEach(async () => {
        multisigExample = await ethers.deployContract("MSExample", [signerAddresses, signerCount]) as MSExample;
    });

    describe("Deploy", function () {
        it("Should return the correct signers array", async function () {
            for (let i = 0; i < signerCount; i++)
                expect(await multisigExample.signers(i)).to
                    .equal(signers[i].address);
        });
    })

    describe("Function sign", function () {
        it("Should not sign twice", async function() {
            const functionData = abiInterface.encodeFunctionData("helloWorld", []);

            expect(await multisigExample.connect(signers[0]).signCall(functionData))
                .to.not.be.reverted;
            await expect(multisigExample.connect(signers[0]).signCall(functionData))
                .to.be.revertedWithCustomError(
                    multisigExample, 
                    "AlreadySignedCall"
                );
        })
        it("Should revert invalid signer", async function() {
            const functionData = abiInterface.encodeFunctionData("helloWorld", []);

            await expect(multisigExample.connect(signers[signerCount]).signCall(functionData))
                .to.be.revertedWithCustomError(
                    multisigExample, 
                    "InvalidSigner"
                );
        })
        it("Should emit CallExecuted event", async function() {
            const functionData = abiInterface.encodeFunctionData("helloWorld", []);

            for (let i = 0; i < signerCount - 1; i++) {
                expect(await multisigExample.connect(signers[i]).signCall(functionData))
                .to.not.be.reverted;
            }
            // Need to return the function value
            expect(await multisigExample.connect(signers[signerCount - 1]).signCall(functionData))
            .to.emit(
                multisigExample,
                "CallExecuted(bytes32,bytes)"
            );
        })
        it("Should revert direct call", async function() {

            await expect(multisigExample.connect(signers[0]).helloWorld())
                .to.be.revertedWithCustomError(
                    multisigExample, 
                    'MultisigRequired'
                );
        })
    });

    describe("Modifier sign", function() {
        it("Should not sign twice", async function() {
            const signers = await ethers.getSigners();

            expect(await multisigExample.connect(signers[0]).modifierHelloWorld())
                .to.not.be.reverted;
            await expect(multisigExample.connect(signers[0]).modifierHelloWorld())
                .to.be.revertedWithCustomError(
                    multisigExample, 
                    "AlreadySignedCall"
                );
        })
        it("Should revert invalid signer", async function() {
            const signers = await ethers.getSigners();

            await expect(multisigExample.connect(signers[signerCount]).modifierHelloWorld())
                .to.be.revertedWithCustomError(
                    multisigExample, 
                    "InvalidSigner"
                );
        })
        it("Should emit CallExecuted event", async function() {
            const signers = await ethers.getSigners();

            for (let i = 0; i < signerCount - 1; i++) {
                expect(await multisigExample.connect(signers[i]).modifierHelloWorld())
                .to.not.be.reverted;
            }
            // Need to return the function value
            expect(await multisigExample.connect(signers[signerCount - 1]).modifierHelloWorld())
            .to.emit(
                multisigExample,
                "CallExecuted(bytes32)"
            );
        })
    })
});
