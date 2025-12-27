import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

// Zama FHE on Sepolia Configuration
const ZamaSepoliaConfig = {
  chainId: 11155111,
  rpcUrl: "https://sepolia.gateway.tenderly.co",
  contracts: {
    acl: "0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D",
    coprocessor: "0x92C920834Ec8941d2C77D188936E1f7A6f49c127",
    kmsVerifier: "0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A",
  },
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: ZamaSepoliaConfig.rpcUrl,
      chainId: ZamaSepoliaConfig.chainId,
      accounts: [PRIVATE_KEY],
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;

export { ZamaSepoliaConfig };
