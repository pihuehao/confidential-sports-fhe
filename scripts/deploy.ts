import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("Deploying ConfidentialSports to Sepolia (Zama FHE)...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("ERROR: No ETH balance. Get Sepolia ETH from faucet.");
    process.exit(1);
  }

  // Deploy the contract
  console.log("Deploying contract...");
  const ConfidentialSports = await ethers.getContractFactory("ConfidentialSports");
  const contract = await ConfidentialSports.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("\n========================================");
  console.log("ConfidentialSports deployed to:", contractAddress);
  console.log("========================================\n");
  console.log("Next steps:");
  console.log("1. Update CONTRACT_ADDRESS in src/config.ts");
  console.log("2. Push to GitHub");
  console.log("3. Vercel will auto-redeploy");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
