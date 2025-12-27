// Zama Ethereum Devnet Configuration
export const ZAMA_CONFIG = {
  chainId: 8009,
  chainName: "Zama Ethereum Devnet",
  rpcUrl: "https://devnet.zama.ai",
  gatewayUrl: "https://gateway.devnet.zama.ai",
  blockExplorer: "https://explorer.devnet.zama.ai",
  currency: {
    name: "ZAMA",
    symbol: "ZAMA",
    decimals: 18,
  },
  contracts: {
    acl: "0x339EcE85B9E11a3A3AA557582784a15d7F82AAf2",
    tfheExecutor: "0x687408ab54661ba0b4aef3a44156c616c6955e07",
    kmsVerifier: "0x208De73316E44722e16f6dDFF40881A3e4F86104",
    gateway: "0x33347831500F1e73f0ccCBb95c9f86B94d7b1123",
  },
};

// Your deployed contract address - UPDATE AFTER DEPLOYMENT
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Contract ABI will be imported from artifacts after compilation
export const FHEVM_VERSION = "0.9.1";
export const RELAYER_SDK_VERSION = "0.3.0-8";
