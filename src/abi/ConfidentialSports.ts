export const CONTRACT_ABI = [
  // Constructor
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },

  // Events
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "athleteId", "type": "uint256" },
      { "indexed": true, "name": "wallet", "type": "address" },
      { "indexed": false, "name": "name", "type": "string" }
    ],
    "name": "AthleteRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "teamId", "type": "uint256" },
      { "indexed": false, "name": "name", "type": "string" },
      { "indexed": true, "name": "manager", "type": "address" }
    ],
    "name": "TeamCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "proposalId", "type": "uint256" },
      { "indexed": true, "name": "athleteId", "type": "uint256" },
      { "indexed": true, "name": "teamId", "type": "uint256" }
    ],
    "name": "ProposalCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "proposalId", "type": "uint256" }
    ],
    "name": "ProposalApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "proposalId", "type": "uint256" }
    ],
    "name": "ProposalRejected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "athleteId", "type": "uint256" }
    ],
    "name": "SalaryUpdated",
    "type": "event"
  },

  // Read Functions
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "athleteCount",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "teamCount",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proposalCount",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PROPOSAL_EXPIRY",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "", "type": "address" }],
    "name": "athleteByWallet",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "", "type": "address" }],
    "name": "teamByManager",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_athleteId", "type": "uint256" }],
    "name": "getAthleteInfo",
    "outputs": [
      { "name": "name", "type": "string" },
      { "name": "teamId", "type": "uint256" },
      { "name": "isActive", "type": "bool" },
      { "name": "contractEndDate", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_teamId", "type": "uint256" }],
    "name": "getTeamInfo",
    "outputs": [
      { "name": "name", "type": "string" },
      { "name": "manager", "type": "address" },
      { "name": "athleteCountInTeam", "type": "uint256" },
      { "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_teamId", "type": "uint256" }],
    "name": "getTeamAthletes",
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_proposalId", "type": "uint256" }],
    "name": "getProposalInfo",
    "outputs": [
      { "name": "athleteId", "type": "uint256" },
      { "name": "teamId", "type": "uint256" },
      { "name": "contractDuration", "type": "uint256" },
      { "name": "createdAt", "type": "uint256" },
      { "name": "status", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Write Functions
  {
    "inputs": [
      { "name": "_name", "type": "string" },
      { "name": "_encryptedSalaryCap", "type": "bytes32" },
      { "name": "_inputProof", "type": "bytes" }
    ],
    "name": "createTeam",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_name", "type": "string" }],
    "name": "registerAthlete",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "_athleteId", "type": "uint256" },
      { "name": "_teamId", "type": "uint256" },
      { "name": "_encryptedSalary", "type": "bytes32" },
      { "name": "_encryptedBonus", "type": "bytes32" },
      { "name": "_salaryProof", "type": "bytes" },
      { "name": "_bonusProof", "type": "bytes" },
      { "name": "_durationMonths", "type": "uint256" }
    ],
    "name": "createProposal",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_proposalId", "type": "uint256" }],
    "name": "approveProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_proposalId", "type": "uint256" }],
    "name": "rejectProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_proposalId", "type": "uint256" }],
    "name": "cancelProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "_athleteId", "type": "uint256" },
      { "name": "_to", "type": "address" }
    ],
    "name": "grantSalaryAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
