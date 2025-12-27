import { useState, useEffect, useCallback } from 'react';
import { initFhevm, createInstance, FhevmInstance } from 'fhevmjs';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

const ZAMA_NETWORK = {
  chainId: 11155111, // Sepolia
  gatewayUrl: 'https://gateway.sepolia.zama.ai',
  aclAddress: '0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D',
  kmsAddress: '0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A',
};

export function useFhevm() {
  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Initialize FHEVM
  const initialize = useCallback(async () => {
    if (!isConnected || !address || !publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      // Initialize the FHEVM library
      await initFhevm();

      // Create instance for this user
      const fhevmInstance = await createInstance({
        chainId: ZAMA_NETWORK.chainId,
        publicKey: await getPublicKey(publicClient),
      });

      setInstance(fhevmInstance);
      setIsInitialized(true);
    } catch (err: any) {
      console.error('FHEVM init error:', err);
      setError(err.message || 'Failed to initialize FHEVM');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, publicClient]);

  useEffect(() => {
    if (isConnected && !isInitialized && !isLoading) {
      initialize();
    }
  }, [isConnected, isInitialized, isLoading, initialize]);

  // Encrypt a number
  const encryptNumber = useCallback(async (value: number | bigint, contractAddress: string) => {
    if (!instance || !address) {
      throw new Error('FHEVM not initialized');
    }

    const input = instance.createEncryptedInput(contractAddress, address);
    input.add64(BigInt(value));
    const encrypted = input.encrypt();

    return {
      handle: encrypted.handles[0],
      proof: encrypted.inputProof,
    };
  }, [instance, address]);

  // Request decryption (for viewing your own encrypted data)
  const requestDecrypt = useCallback(async (handle: string, contractAddress: string) => {
    if (!instance || !walletClient || !address) {
      throw new Error('FHEVM not initialized');
    }

    // Generate token for reencryption
    const { publicKey, signature } = await instance.generatePublicKey({
      verifyingContract: contractAddress,
    });

    // This would be used to request reencryption from the contract
    return { publicKey, signature };
  }, [instance, walletClient, address]);

  return {
    instance,
    isInitialized,
    isLoading,
    error,
    encryptNumber,
    requestDecrypt,
    initialize,
  };
}

// Helper to get public key from chain
async function getPublicKey(publicClient: any): Promise<string> {
  try {
    // In production, this would fetch from the KMS contract
    // For now, return a placeholder that will be replaced
    return '0x' + '00'.repeat(32);
  } catch {
    return '0x' + '00'.repeat(32);
  }
}

export default useFhevm;
