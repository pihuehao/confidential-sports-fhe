import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ConfidentialSports to Zama Ethereum Devnet...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  const ConfidentialSports = await ethers.getContractFactory("ConfidentialSports");
  const contract = await ConfidentialSports.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("ConfidentialSports deployed to:", contractAddress);
  console.log("\nDeployment successful!");
  console.log("\nNext steps:");
  console.log("1. Update src/config.ts with the contract address");
  console.log("2. Run: npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
