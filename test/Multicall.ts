import {expect} from "chai"
import {ethers} from "hardhat"
import { Interface, Addressable } from "ethers"
import {abi as mockTokenABI} from "../artifacts/contracts/mocks/ERC20Mock.sol/ERC20Mock.json"
import {ExternalMulticall, ERC20Mock} from "../typechain-types"

type CallQuery = {
    target: string | Addressable,
    data: string
}

describe("ExternalMulticall contract", function () {
    let multicallContract: ExternalMulticall
    let mockTokenAContract: ERC20Mock
    // let mockTokenBContract: ERC20

    const abi = ["function transferFrom(address,address,uint256)"]
    const mockAbiInterface = new Interface(abi)

    beforeEach(async () => {
        const signers = await ethers.getSigners()
        multicallContract = await ethers.deployContract("ExternalMulticall", []);
        mockTokenAContract = await ethers.deployContract("ERC20Mock", [signers[0], 10000, "TokenA", "TKA"]);
        // mockTokenBContract = await ethers.deployContract("ExternalMulticall", []);        
    });

    it("should transfer twice after approve", async function() {
        const signers = await ethers.getSigners()
        const deployer = signers[0]

        const transferSignature = "transferFrom(address,address,uint256)"
            const callQueries: CallQuery[] = [
                {
                    target: mockTokenAContract.target, 
                    data: mockAbiInterface.encodeFunctionData(transferSignature, [deployer.address, signers[1].address, 100])
                },
                {   
                    target: mockTokenAContract.target, 
                    data: mockAbiInterface.encodeFunctionData(transferSignature, [deployer.address, signers[1].address, 200])
                }
            ]

            expect(await mockTokenAContract.connect(deployer).approve(multicallContract.target, 1000))
            .to.not.be.reverted

            expect(await multicallContract.connect(deployer).multicall(callQueries))
            .to.not.be.reverted

            expect(await mockTokenAContract.balanceOf(signers[1]))
            .to.be.equal(300)
    })
})