// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ERC20 = await hre.ethers.getContractFactory("Token");
  const erc20 = await ERC20.deploy('token1','TK1');
  const erc202 = await ERC20.deploy('token2','TK2');
  const Swapper = await hre.ethers.getContractFactory("Swapper");
  const swapper = await Swapper.deploy(erc20.address,erc202.address);

  await erc20.deployed();
  console.log("Token1 deployed to:", erc20.address);
  await erc202.deployed();
  console.log("Token2 deployed to:", erc202.address);
  await swapper.deployed();
  console.log("Swapper deployed to:", swapper.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
