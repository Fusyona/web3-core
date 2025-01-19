import { expect } from "chai";
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from "hardhat";
import { abi as mockTokenABI } from "../artifacts/contracts/mocks/MockERC20.sol/MockERC20.json";
import { Interface, Signer } from "ethers";
import { ERC20, Multicall3 } from "../typechain-types";
import contractNames from "../data/contractNames.json";
import { Address } from "../lib/types";
import { Call, to, Multicaller } from "../lib/components/multicaller";

describe("Multicall3", function () {
    const setup = deployments.createFixture(async () => {
        await deployments.fixture([contractNames.Multicall3, contractNames.MockERC20, contractNames.MockERC20 + "_2"]);

        const multicallContract = await ethers.getContract<Multicall3>(contractNames.Multicall3);
        const mockTokenAContract = await ethers.getContract<ERC20>(contractNames.MockERC20);
        const mockTokenBContract = await ethers.getContract<ERC20>(contractNames.MockERC20 + "_2");

        const mockAbiInterface = new Interface(mockTokenABI);

        return {
            multicallContract,
            mockTokenAContract,
            mockTokenBContract,
            mockAbiInterface,
        };
    });

    let multicallContract: Multicall3;
    let mockTokenAContract: ERC20;
    let mockTokenBContract: ERC20;
    let mockAbiInterface: Interface;
    let deployerAddress: Address;
    let deployer: Signer;
    let multicaller: Multicaller;

    beforeEach(async function () {
        const fixture = await setup();
        multicallContract = fixture.multicallContract;
        mockTokenAContract = fixture.mockTokenAContract;
        mockTokenBContract = fixture.mockTokenBContract;
        mockAbiInterface = fixture.mockAbiInterface;

        const { deployer: _deployerAddress } = await getNamedAccounts();
        deployerAddress = _deployerAddress;
        deployer = await ethers.getSigner(deployerAddress);

        multicaller = await Multicaller.fromProvider(ethers.provider, await multicallContract.getAddress());
    });

    it("should transfer twice from different tokens after approve", async function () {
        await mockTokenAContract.connect(deployer).approve(multicallContract, 1000);
        await mockTokenBContract.connect(deployer).approve(multicallContract, 1000);

        const accounts = await getUnnamedAccounts();
        const calls: Call[] = [
            to(mockTokenAContract, "transferFrom", [deployerAddress, accounts[1], 100]),
            to(mockTokenBContract, "transferFrom", [deployerAddress, accounts[1], 200]),
        ];
        await expect(multicaller.withSigner(deployerAddress).multicall(calls)).to.changeTokenBalances(
            mockTokenAContract,
            [deployerAddress, accounts[1]],
            [-100, 100],
        );
        await expect(multicaller.withSigner(deployerAddress).multicall(calls)).to.changeTokenBalances(
            mockTokenBContract,
            [deployerAddress, accounts[1]],
            [-200, 200],
        );
    });

    it("should fail if one of the calls fails", async function () {
        await mockTokenAContract.connect(deployer).approve(multicallContract, 1000);

        const accounts = await getUnnamedAccounts();
        const calls: Call[] = [
            to(mockTokenAContract, "transferFrom", [deployerAddress, accounts[1], 100]),
            to(mockTokenBContract, "transferFrom", [deployerAddress, accounts[1], 200]),
        ];
        await expect(multicaller.withSigner(deployerAddress).multicall(calls)).to.be.revertedWith(
            "Multicall3: call failed",
        );
    });

    it("should not fail if one of the calls fails and that call has allowFailure set to true", async function () {
        await mockTokenAContract.connect(deployer).approve(multicallContract, 1000);

        const accounts = await getUnnamedAccounts();
        const calls: Call[] = [
            to(mockTokenAContract, "transferFrom", [deployerAddress, accounts[1], 100]),
            to(mockTokenBContract, "transferFrom", [deployerAddress, accounts[1], 200], true),
        ];
        await expect(multicaller.withSigner(deployerAddress).multicall(calls)).to.be.not.reverted;
    });

    describe("contract", () => {
        describe("aggregate3", async function () {
            it("should transfer twice from different tokens after approve", async function () {
                const accounts = await getUnnamedAccounts();

                const transferSignature = "transferFrom";
                const calls: Multicall3.Call3Struct[] = [
                    {
                        target: await mockTokenAContract.getAddress(),
                        allowFailure: false,
                        callData: mockAbiInterface.encodeFunctionData(transferSignature, [
                            deployerAddress,
                            accounts[1],
                            100,
                        ]),
                    },
                    {
                        target: await mockTokenBContract.getAddress(),
                        allowFailure: false,
                        callData: mockAbiInterface.encodeFunctionData(transferSignature, [
                            deployerAddress,
                            accounts[1],
                            200,
                        ]),
                    },
                ];
                await mockTokenAContract.connect(deployer).approve(multicallContract, 1000);
                await mockTokenBContract.connect(deployer).approve(multicallContract, 1000);

                await expect(multicallContract.connect(deployer).aggregate3(calls)).to.changeTokenBalances(
                    mockTokenAContract,
                    [deployerAddress, accounts[1]],
                    [-100, 100],
                );
                await expect(multicallContract.connect(deployer).aggregate3(calls)).to.changeTokenBalances(
                    mockTokenBContract,
                    [deployerAddress, accounts[1]],
                    [-200, 200],
                );
            });
        });
    });
});
