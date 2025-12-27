import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

// Zama Ethereum Devnet Configuration (NOT Sepolia!)
const ZamaEthereumConfig = {
  chainId: 8009,
  urls: {
    rpc: "https://devnet.zama.ai",
    gateway: "https://gateway.devnet.zama.ai",
    kmsVerifier: "https://kms-verifier.devnet.zama.ai",
    aclAddress: "0x339EcE85B9E11a3A3AA557582784a15d7F82AAf2",
    tfheExecutorAddress: "0x687408ab54661ba0b4aef3a44156c616c6955e07",
    kmsVerifierAddress: "0x208De73316E44722e16f6dDFF40881A3e4F86104",
    gatewayAddress: "0x33347831500F1e73f0ccCBb95c9f86B94d7b1123",
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
    zama: {
      url: ZamaEthereumConfig.urls.rpc,
      chainId: ZamaEthereumConfig.chainId,
      accounts: [PRIVATE_KEY],
    },
    // Legacy sepolia kept for reference but use 'zama' network
    sepolia: {
      url: ZamaEthereumConfig.urls.rpc,
      chainId: ZamaEthereumConfig.chainId,
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

// Export Zama config for use in scripts
export { ZamaEthereumConfig };
