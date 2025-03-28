import { deployments, ethers, getNamedAccounts } from "hardhat";
import { ERC1363Store, MockERC1155Mintable, MockERC20Payable } from "../typechain-types";
import { BytesLike, parseEther, Signer } from "ethers";
import { expect } from "chai";

describe("ERC1363Store", function () {
    let store: ERC1363Store
    let token: MockERC20Payable
    let collection: MockERC1155Mintable

    let owner: string
    let deployer: Signer
    let userA: Signer

    beforeEach(async () => {
        await deployments.fixture();

        store = (await ethers.getContract("ERC1363Store")) as unknown as ERC1363Store;
        token = (await ethers.getContract("MockERC20Payable")) as unknown as MockERC20Payable;
        collection = (await ethers.getContract("MockERC1155Mintable")) as unknown as MockERC1155Mintable;
        const { owner: owner_, deployer: deployer_ } = await getNamedAccounts();
        const _deployer = await ethers.getSigner(deployer_);
        const signers = (await ethers.getSigners())
        owner = owner_;
        deployer = _deployer
        userA = signers[4]
    });

    it("should deploy successfully with tokenAddress", async function () {
        expect(await store.tokenAddress()).to.equal(await token.getAddress());
    })
    it("should deploy successfully with collectionAddress", async function () {
        expect(await store.collectionAddress()).to.equal(await collection.getAddress());
    })

    describe("ShopItem", async () => {
        beforeEach(async () => {
            await store.connect(deployer).grantRole(ethers.keccak256(ethers.toUtf8Bytes("MODERATOR_ROLE")), await deployer.getAddress())
        })

        it("should allow MODERATOR to update a ShopItem", async () => {
            await expect(store.connect(deployer).updateShopItem(1, {price: parseEther("1")})).to.not.be.reverted
        })

        it("should emit ShopItemUpdated after updating a ShopItem", async () => {
            await expect(store.connect(deployer).updateShopItem(1, {price: parseEther("1")})).to.emit(store, "ShopItemUpdated")
        })

        it("should not allow user without role to update ShopItem", async () => {
            await expect(store.connect(userA).updateShopItem(1, {price: parseEther("1")})).to.be.reverted
        })
    })

    describe ("Item Purchase", async () => {
        function encodePurchaseData(id: BigInt, amount: BigInt, receiver: string): BytesLike {
            const coder = ethers.AbiCoder.defaultAbiCoder()
            return coder.encode(["uint256", "uint256", "address"], [id, amount, receiver])
        }

        beforeEach(async () => {
            // Create sample tokens 
            await collection.connect(deployer).createNft(1n, 5n)
            
            await store.connect(deployer).grantRole(ethers.keccak256(ethers.toUtf8Bytes("MODERATOR_ROLE")), await deployer.getAddress())
            await store.connect(deployer).updateShopItem(1, {price: parseEther("1")})
        })

        it("should not revert while minting a collection token", async () => {
            const storeAddress = await store.getAddress()
            const userAAddress = await userA.getAddress()
            await expect(
                token.connect(userA)["transferAndCall(address,uint256,bytes)"](
                    storeAddress, parseEther("1"), encodePurchaseData(1n, 1n, userAAddress)
                )
            ).to.not.be.reverted
        })

        it("should emit ItemSold event while user buys an item", async () => {
            const storeAddress = await store.getAddress()
            const userAAddress = await userA.getAddress()
            await expect(
                token.connect(userA)["transferAndCall(address,uint256,bytes)"](
                    storeAddress, parseEther("1"), encodePurchaseData(1n, 1n, userAAddress)
                )
            ).to.emit(
                store,
                "ItemSold"
            )
        })

        it("should allow user to buy a collection item if price is equal to requested item price", async () => {
            const storeAddress = await store.getAddress()
            const userAAddress = await userA.getAddress()
            await token.connect(userA)["transferAndCall(address,uint256,bytes)"](
                storeAddress, 
                parseEther("1"), 
                encodePurchaseData(1n, 1n, userAAddress)
            )
            expect(await collection.balanceOf(userAAddress, 1n)).to.be.equal(1)
        })

        it("should allow user to buy multiple items if the amount is valid", async () => {
            const storeAddress = await store.getAddress()
            const userAAddress = await userA.getAddress()
            await token.connect(userA)["transferAndCall(address,uint256,bytes)"](
                storeAddress, 
                parseEther("3"), 
                encodePurchaseData(1n, 3n, userAAddress)
            )
            expect(await collection.balanceOf(userAAddress, 1n)).to.be.equal(3)
        })

        it("should not allow user to buy items if the amount is not valid", async () => {
            const storeAddress = await store.getAddress()
            const userAAddress = await userA.getAddress()
            await expect(token.connect(userA)["transferAndCall(address,uint256,bytes)"](
                storeAddress, 
                parseEther("0.5"), 
                encodePurchaseData(1n, 1n, userAAddress)
            )).to.be.reverted
        })

        it("should allow user to buy items if the amount is greater than the price", async () => {
            const storeAddress = await store.getAddress()
            const userAAddress = await userA.getAddress()
            await token.connect(userA)["transferAndCall(address,uint256,bytes)"](
                storeAddress, 
                parseEther("2"), 
                encodePurchaseData(1n, 1n, userAAddress)
            )
            expect(await collection.balanceOf(userAAddress, 1n)).to.be.equal(1)
        })
    })
})