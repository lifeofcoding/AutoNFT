import { ethers } from "hardhat";

async function main() {
  const RousseauNFTs = await ethers.getContractFactory("RousseauNFTs");
  const rousseauNFTs = await RousseauNFTs.deploy();

  await rousseauNFTs.deployed();

  console.log("RousseauNTFs deployed to:", rousseauNFTs.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
