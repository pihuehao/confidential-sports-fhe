# Confidential Sports Contract

Privacy-preserving athlete salary management using **Zama Fully Homomorphic Encryption (FHE)**.

## Tech Stack

| Component | Version |
|-----------|---------|
| fhevm-solidity | **0.9.1** |
| relayer-sdk | **0.3.0-8** |
| Solidity | 0.8.24 |
| Hardhat | 2.25.0 |
| React | 18.3.1 |
| wagmi | 2.15.6 |

## Network Configuration

This project is configured for **Zama Ethereum Devnet** (NOT Sepolia):

```
Chain ID: 8009
RPC URL: https://devnet.zama.ai
Gateway: https://gateway.devnet.zama.ai
```

## Features

- **Encrypted Salaries**: All salary data stored as `euint64` - never visible on-chain
- **Salary Cap Compliance**: FHE comparisons verify caps without revealing amounts
- **Gateway Callbacks**: Async decryption for authorized operations only
- **Role-Based Access**: Owner, Team Manager, Athlete permissions
- **Timeout Protection**: 1-hour decryption timeout, 30-day proposal expiry

## Project Structure

```
├── contracts/
│   └── ConfidentialSports.sol    # Main FHE contract
├── scripts/
│   └── deploy.ts                 # Deployment script
├── src/
│   ├── components/               # React components
│   ├── config.ts                 # Zama network config
│   └── App.tsx                   # Main app
├── hardhat.config.ts             # Hardhat with ZamaEthereumConfig
└── package.json                  # Dependencies
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your private key
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Deploy to Zama Devnet

```bash
npm run deploy:sepolia
```

### 5. Run Frontend

```bash
npm run dev
```

## Smart Contract Overview

### Core Functions

| Function | Description |
|----------|-------------|
| `createTeam(name, encryptedSalaryCap)` | Create team with encrypted cap |
| `registerAthlete(name)` | Register as athlete |
| `createProposal(athleteId, teamId, salary, bonus, duration)` | Submit encrypted proposal |
| `approveProposal(proposalId)` | Athlete approves (triggers Gateway) |
| `rejectProposal(proposalId)` | Athlete rejects |

### FHE Types Used

- `euint64`: Encrypted salaries, bonuses, payroll totals
- `ebool`: Encrypted comparison results
- `einput`: Encrypted user input with proof

### Gateway Callback Flow

```
1. Athlete calls approveProposal()
2. Contract calculates: newPayroll = currentPayroll + proposedSalary
3. Contract checks: withinCap = (newPayroll <= salaryCap)
4. Gateway.requestDecryption(withinCap)
5. Gateway decrypts and calls salaryCapCallback()
6. Contract approves/rejects based on boolean result
```

## Security Features

- Salary values never decrypted publicly
- Only boolean cap compliance is revealed
- ACL controls who can access encrypted data
- Emergency timeout handlers for stuck requests

## Development

### Run Tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

## License

MIT

---

Built for the Zama FHE Developer Program 2025
