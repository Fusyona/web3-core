import {expect} from "chai"
import {ethers, network } from "hardhat"
import { BrowserProvider, Interface } from "ethers"
import {PayableTokenWrapper, DataEncoder} from "../lib/token-wrapper"
import {ERC1363Mock, ERC20} from "../typechain-types"
import {abi as IERC20Abi} from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json"

describe("Payable Token wrapper", function() {
    let payableWrapper: PayableTokenWrapper
    let payableContract: ERC1363Mock

    beforeEach(async function(){
        const signers = await ethers.getSigners()
        payableContract = await ethers.deployContract("ERC1363Mock", [signers[0], 10000, "PayableToken", "PTK"])

        const provider = new BrowserProvider(network.provider)
        payableWrapper = new PayableTokenWrapper(
            payableContract.target,
            provider
        )
    })

    it("should ensureApproveAndCall", async function() {
        const signers = await ethers.getSigners()
        const deployer = signers[0]

        const encoder: DataEncoder = {
            abi: new Interface(IERC20Abi),
            signature: "transferFrom(address,address,uint256)",
            args: [await deployer.getAddress(), await signers[1].getAddress(), 100]
        }

        payableWrapper.withSigner(deployer).ensureApproveAndCall(payableContract.target.toString(), "1000", encoder, () => {})

        expect(await payableContract.balanceOf(deployer))
            .to.be.equal(9900)

        expect(await payableContract.balanceOf(signers[1]))
            .to.be.equal(100)
    })
})
