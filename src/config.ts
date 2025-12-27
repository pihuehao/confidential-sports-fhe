// Zama on Sepolia Configuration
export const ZAMA_CONFIG = {
  chainId: 11155111, // Sepolia
  chainName: "Sepolia (Zama FHE)",
  rpcUrl: "https://sepolia.gateway.tenderly.co",
  gatewayUrl: "https://gateway.sepolia.zama.ai",
  blockExplorer: "https://sepolia.etherscan.io",
  currency: {
    name: "SepoliaETH",
    symbol: "ETH",
    decimals: 18,
  },
  // Zama FHE contracts on Sepolia
  contracts: {
    acl: "0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D",
    coprocessor: "0x92C920834Ec8941d2C77D188936E1f7A6f49c127",
    kmsVerifier: "0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A",
  },
};

// Your deployed contract address - UPDATE AFTER DEPLOYMENT
// Deploy with: npm run deploy:sepolia
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Check if contract is deployed
export const IS_CONTRACT_DEPLOYED = CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

// Versions
export const FHEVM_VERSION = "0.9.1";
export const RELAYER_SDK_VERSION = "0.3.0-8";
