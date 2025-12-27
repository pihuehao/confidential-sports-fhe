import { useCallback, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESS } from '../config';
import { CONTRACT_ABI } from '../abi/ConfidentialSports';
import { useFhevm } from './useFhevm';

export function useContract() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { encryptNumber, isInitialized: fhevmReady } = useFhevm();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read contract data
  const readContract = useCallback(async (functionName: string, args: any[] = []) => {
    if (!publicClient) throw new Error('No public client');

    return await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName,
      args,
    });
  }, [publicClient]);

  // Write to contract
  const writeContract = useCallback(async (functionName: string, args: any[]) => {
    if (!walletClient || !address) throw new Error('Wallet not connected');

    setIsLoading(true);
    setError(null);

    try {
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName,
        args,
        account: address,
      });

      // Wait for transaction
      const receipt = await publicClient?.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, address, publicClient]);

  // ============ Team Functions ============

  const createTeam = useCallback(async (name: string, salaryCap: string) => {
    if (!fhevmReady) throw new Error('FHE not initialized');

    // Convert salary cap to wei and encrypt
    const salaryCapWei = parseEther(salaryCap);
    const encrypted = await encryptNumber(salaryCapWei, CONTRACT_ADDRESS);

    return writeContract('createTeam', [name, encrypted.handle, encrypted.proof]);
  }, [writeContract, encryptNumber, fhevmReady]);

  const getTeamInfo = useCallback(async (teamId: number) => {
    return readContract('getTeamInfo', [BigInt(teamId)]);
  }, [readContract]);

  const getTeamCount = useCallback(async () => {
    return readContract('teamCount', []);
  }, [readContract]);

  // ============ Athlete Functions ============

  const registerAthlete = useCallback(async (name: string) => {
    return writeContract('registerAthlete', [name]);
  }, [writeContract]);

  const getAthleteInfo = useCallback(async (athleteId: number) => {
    return readContract('getAthleteInfo', [BigInt(athleteId)]);
  }, [readContract]);

  const getAthleteByWallet = useCallback(async (walletAddress: string) => {
    return readContract('athleteByWallet', [walletAddress]);
  }, [readContract]);

  const getAthleteCount = useCallback(async () => {
    return readContract('athleteCount', []);
  }, [readContract]);

  // ============ Proposal Functions ============

  const createProposal = useCallback(async (
    athleteId: number,
    teamId: number,
    salary: string,
    bonus: string,
    durationMonths: number
  ) => {
    if (!fhevmReady) throw new Error('FHE not initialized');

    // Encrypt salary and bonus
    const salaryWei = parseEther(salary);
    const bonusWei = parseEther(bonus);

    const encryptedSalary = await encryptNumber(salaryWei, CONTRACT_ADDRESS);
    const encryptedBonus = await encryptNumber(bonusWei, CONTRACT_ADDRESS);

    return writeContract('createProposal', [
      BigInt(athleteId),
      BigInt(teamId),
      encryptedSalary.handle,
      encryptedBonus.handle,
      encryptedSalary.proof,
      encryptedBonus.proof,
      BigInt(durationMonths),
    ]);
  }, [writeContract, encryptNumber, fhevmReady]);

  const approveProposal = useCallback(async (proposalId: number) => {
    return writeContract('approveProposal', [BigInt(proposalId)]);
  }, [writeContract]);

  const rejectProposal = useCallback(async (proposalId: number) => {
    return writeContract('rejectProposal', [BigInt(proposalId)]);
  }, [writeContract]);

  const getProposalInfo = useCallback(async (proposalId: number) => {
    return readContract('getProposalInfo', [BigInt(proposalId)]);
  }, [readContract]);

  const getProposalCount = useCallback(async () => {
    return readContract('proposalCount', []);
  }, [readContract]);

  // ============ Access Control ============

  const grantSalaryAccess = useCallback(async (athleteId: number, toAddress: string) => {
    return writeContract('grantSalaryAccess', [BigInt(athleteId), toAddress]);
  }, [writeContract]);

  return {
    // State
    isLoading,
    error,
    fhevmReady,

    // Team
    createTeam,
    getTeamInfo,
    getTeamCount,

    // Athlete
    registerAthlete,
    getAthleteInfo,
    getAthleteByWallet,
    getAthleteCount,

    // Proposal
    createProposal,
    approveProposal,
    rejectProposal,
    getProposalInfo,
    getProposalCount,

    // Access
    grantSalaryAccess,
  };
}

export default useContract;
