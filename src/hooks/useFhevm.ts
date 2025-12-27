import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

// Demo mode - simulates FHE encryption for demonstration
// In production, this would use actual fhevmjs

export function useFhevm() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const { isConnected } = useAccount();

  // Initialize - try real FHE first, fall back to demo mode
  useEffect(() => {
    if (!isConnected) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      setIsLoading(true);
      try {
        // Try to dynamically import fhevmjs
        const fhevm = await import('fhevmjs').catch(() => null);

        if (fhevm && fhevm.initFhevm) {
          await fhevm.initFhevm();
          setIsInitialized(true);
          setIsDemoMode(false);
        } else {
          // Fall back to demo mode
          console.log('FHE not available, using demo mode');
          setIsDemoMode(true);
          setIsInitialized(true);
        }
      } catch (err: any) {
        console.log('FHE init failed, using demo mode:', err.message);
        setIsDemoMode(true);
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure wallet is connected
    const timer = setTimeout(init, 500);
    return () => clearTimeout(timer);
  }, [isConnected]);

  // Encrypt a number - demo mode returns simulated encrypted data
  const encryptNumber = useCallback(async (value: number | bigint, contractAddress: string) => {
    if (isDemoMode) {
      // Demo mode: create a deterministic "encrypted" representation
      const valueStr = value.toString();
      const hash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(valueStr + contractAddress)
      );
      const hashArray = Array.from(new Uint8Array(hash));
      const handle = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Create a mock proof
      const proof = '0x' + hashArray.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');

      return {
        handle: handle as `0x${string}`,
        proof: proof as `0x${string}`,
        isDemoMode: true,
      };
    }

    // Real FHE encryption would go here
    throw new Error('Real FHE not implemented');
  }, [isDemoMode]);

  return {
    isInitialized,
    isLoading,
    error,
    isDemoMode,
    encryptNumber,
  };
}

export default useFhevm;
