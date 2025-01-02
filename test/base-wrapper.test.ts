import BaseWrapper from "../lib/base-wrapper";
import contractNames from "../data/contractNames.json";
import { ethers } from "hardhat";
import { CooldownOwnableExample } from "../typechain-types";
import { Signer } from "ethers";
import { expect } from "chai";

class TestBaseWrapper extends BaseWrapper<CooldownOwnableExample> {
    constructor(contract: CooldownOwnableExample) {
        super(contract);
    }

    requireConnectedAddressPublic() {
        return this.requireConnectedAddress();
    }
}

describe("BaseWrapper", function () {
    let owner: Signer;
    let user: Signer;
    const COOLDOWN_TIME = 1e10;
    let wrapper: TestBaseWrapper;

    before(async () => {
        [owner, user] = await ethers.getSigners();
    });

    beforeEach(async () => {
        const contract = (await ethers.deployContract(contractNames.CooldownOwnableExample, [
            COOLDOWN_TIME,
            await owner.getAddress(),
        ])) as unknown as CooldownOwnableExample;
        wrapper = new TestBaseWrapper(contract);
    });

    describe("requireConnectedAddress", async function () {
        it("should return the owner by default", async function () {
            expect(await wrapper.requireConnectedAddressPublic()).to.equal(await owner.getAddress());
        });

        it("should return the user if set by withSigner()", async () => {
            expect(await wrapper.withSigner(await user.getAddress()).requireConnectedAddressPublic()).to.equal(
                await user.getAddress(),
            );
        });
    });
});
