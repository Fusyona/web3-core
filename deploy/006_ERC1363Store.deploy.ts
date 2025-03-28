import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import contractNames from "../data/contractNames.json";
const name = contractNames.ERC1363Store;

const func: DeployFunction = async function (env: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = env;
    const { deploy, execute } = deployments;
    const { deployer } = await getNamedAccounts();
    const addresses = (await ethers.getSigners()).map((s) => s.address);

    const erc20Payable = await deploy(contractNames.MockERC20Payable, {
        from: deployer,
        log: true,
        args: [addresses],
    })

    const erc1155Mintable = await deploy(contractNames.MockERC1155Mintable, {
        from: deployer,
        log: true,
        args: [""],
    })

    const erc1363store = await deploy(name, {
        contract: contractNames.ERC1363Store,
        from: deployer,
        log: true,
        args: [erc1155Mintable.address, erc20Payable.address],
    });

    await execute(contractNames.MockERC1155Mintable, 
        {from: deployer}, 
        "grantRole",
        ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE")),
        erc1363store.address,
    );

    await execute(contractNames.MockERC1155Mintable, 
        {from: deployer}, 
        "grantRole",
        ethers.keccak256(ethers.toUtf8Bytes("CREATOR_ROLE")),
        deployer,
    );
};

export default func;
func.tags = [name];
