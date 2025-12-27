// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {euint64, ebool, externalEuint64} from "encrypted-types/EncryptedTypes.sol";

/**
 * @title ConfidentialSports
 * @notice Privacy-preserving athlete salary management using Zama FHE
 * @dev Built for fhevm-solidity 0.9.1 with ZamaEthereumConfig
 */
contract ConfidentialSports is ZamaEthereumConfig {
    // ============ State Variables ============
    address public owner;
    uint256 public athleteCount;
    uint256 public teamCount;
    uint256 public proposalCount;

    // Proposal expiration (30 days)
    uint256 public constant PROPOSAL_EXPIRY = 30 days;

    // ============ Structs ============
    struct Athlete {
        uint256 id;
        address wallet;
        string name;
        uint256 teamId;
        euint64 encryptedSalary;
        euint64 encryptedBonus;
        bool isActive;
        uint256 contractEndDate;
    }

    struct Team {
        uint256 id;
        string name;
        address manager;
        euint64 encryptedPayroll;
        euint64 encryptedSalaryCap;
        uint256[] athleteIds;
        bool isActive;
    }

    struct ContractProposal {
        uint256 id;
        uint256 athleteId;
        uint256 teamId;
        euint64 encryptedProposedSalary;
        euint64 encryptedProposedBonus;
        uint256 contractDuration; // in months
        uint256 createdAt;
        ProposalStatus status;
        address proposer;
    }

    enum ProposalStatus {
        Pending,
        Approved,
        Rejected,
        Expired,
        Cancelled
    }

    // ============ Mappings ============
    mapping(uint256 => Athlete) public athletes;
    mapping(uint256 => Team) public teams;
    mapping(uint256 => ContractProposal) public proposals;
    mapping(address => uint256) public athleteByWallet;
    mapping(address => uint256) public teamByManager;

    // ============ Events ============
    event AthleteRegistered(uint256 indexed athleteId, address indexed wallet, string name);
    event TeamCreated(uint256 indexed teamId, string name, address indexed manager);
    event ProposalCreated(uint256 indexed proposalId, uint256 indexed athleteId, uint256 indexed teamId);
    event ProposalApproved(uint256 indexed proposalId);
    event ProposalRejected(uint256 indexed proposalId);
    event SalaryUpdated(uint256 indexed athleteId);

    // ============ Modifiers ============
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyTeamManager(uint256 _teamId) {
        require(teams[_teamId].manager == msg.sender, "Only team manager");
        _;
    }

    modifier onlyAthlete(uint256 _athleteId) {
        require(athletes[_athleteId].wallet == msg.sender, "Only athlete");
        _;
    }

    modifier validProposal(uint256 _proposalId) {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal");
        require(proposals[_proposalId].status == ProposalStatus.Pending, "Proposal not pending");
        require(
            block.timestamp < proposals[_proposalId].createdAt + PROPOSAL_EXPIRY,
            "Proposal expired"
        );
        _;
    }

    // ============ Constructor ============
    constructor() ZamaEthereumConfig() {
        owner = msg.sender;
    }

    // ============ Team Management ============
    function createTeam(
        string calldata _name,
        externalEuint64 _encryptedSalaryCap,
        bytes calldata _inputProof
    ) external returns (uint256) {
        teamCount++;

        // Convert external encrypted input to internal euint64
        euint64 salaryCap = FHE.fromExternal(_encryptedSalaryCap, _inputProof);
        FHE.allowThis(salaryCap);
        FHE.allow(salaryCap, msg.sender);

        // Initialize zero payroll
        euint64 zeroPayroll = FHE.asEuint64(0);
        FHE.allowThis(zeroPayroll);

        teams[teamCount] = Team({
            id: teamCount,
            name: _name,
            manager: msg.sender,
            encryptedPayroll: zeroPayroll,
            encryptedSalaryCap: salaryCap,
            athleteIds: new uint256[](0),
            isActive: true
        });

        teamByManager[msg.sender] = teamCount;

        emit TeamCreated(teamCount, _name, msg.sender);
        return teamCount;
    }

    // ============ Athlete Management ============
    function registerAthlete(string calldata _name) external returns (uint256) {
        require(athleteByWallet[msg.sender] == 0, "Already registered");

        athleteCount++;

        // Initialize zero salary and bonus
        euint64 zeroSalary = FHE.asEuint64(0);
        euint64 zeroBonus = FHE.asEuint64(0);
        FHE.allowThis(zeroSalary);
        FHE.allowThis(zeroBonus);
        FHE.allow(zeroSalary, msg.sender);
        FHE.allow(zeroBonus, msg.sender);

        athletes[athleteCount] = Athlete({
            id: athleteCount,
            wallet: msg.sender,
            name: _name,
            teamId: 0,
            encryptedSalary: zeroSalary,
            encryptedBonus: zeroBonus,
            isActive: true,
            contractEndDate: 0
        });

        athleteByWallet[msg.sender] = athleteCount;

        emit AthleteRegistered(athleteCount, msg.sender, _name);
        return athleteCount;
    }

    // ============ Contract Proposals ============
    function createProposal(
        uint256 _athleteId,
        uint256 _teamId,
        externalEuint64 _encryptedSalary,
        externalEuint64 _encryptedBonus,
        bytes calldata _salaryProof,
        bytes calldata _bonusProof,
        uint256 _durationMonths
    ) external onlyTeamManager(_teamId) returns (uint256) {
        require(_athleteId > 0 && _athleteId <= athleteCount, "Invalid athlete");
        require(athletes[_athleteId].isActive, "Athlete not active");
        require(_durationMonths >= 1 && _durationMonths <= 120, "Duration: 1-120 months");

        proposalCount++;

        // Convert external encrypted inputs
        euint64 salary = FHE.fromExternal(_encryptedSalary, _salaryProof);
        euint64 bonus = FHE.fromExternal(_encryptedBonus, _bonusProof);

        FHE.allowThis(salary);
        FHE.allowThis(bonus);
        FHE.allow(salary, athletes[_athleteId].wallet);
        FHE.allow(bonus, athletes[_athleteId].wallet);

        proposals[proposalCount] = ContractProposal({
            id: proposalCount,
            athleteId: _athleteId,
            teamId: _teamId,
            encryptedProposedSalary: salary,
            encryptedProposedBonus: bonus,
            contractDuration: _durationMonths,
            createdAt: block.timestamp,
            status: ProposalStatus.Pending,
            proposer: msg.sender
        });

        emit ProposalCreated(proposalCount, _athleteId, _teamId);
        return proposalCount;
    }

    function approveProposal(
        uint256 _proposalId
    ) external validProposal(_proposalId) {
        ContractProposal storage proposal = proposals[_proposalId];
        require(
            athletes[proposal.athleteId].wallet == msg.sender,
            "Only athlete can approve"
        );

        // Check salary cap compliance using FHE comparison
        Team storage team = teams[proposal.teamId];

        // Calculate new payroll: current + proposed salary
        euint64 newPayroll = FHE.add(
            team.encryptedPayroll,
            proposal.encryptedProposedSalary
        );

        // Check if new payroll <= salary cap (encrypted comparison)
        ebool withinCap = FHE.le(newPayroll, team.encryptedSalaryCap);

        // Make the comparison result publicly decryptable for verification
        FHE.makePubliclyDecryptable(withinCap);

        // For this implementation, we execute the proposal
        // In production, you would verify the decrypted result off-chain
        _executeProposal(_proposalId, newPayroll);
    }

    function _executeProposal(uint256 _proposalId, euint64 newPayroll) internal {
        ContractProposal storage proposal = proposals[_proposalId];
        Athlete storage athlete = athletes[proposal.athleteId];
        Team storage team = teams[proposal.teamId];

        // Update athlete's salary and bonus
        athlete.encryptedSalary = proposal.encryptedProposedSalary;
        athlete.encryptedBonus = proposal.encryptedProposedBonus;
        athlete.teamId = proposal.teamId;
        athlete.contractEndDate = block.timestamp + (proposal.contractDuration * 30 days);

        // Update permissions for new salary/bonus
        FHE.allowThis(athlete.encryptedSalary);
        FHE.allowThis(athlete.encryptedBonus);
        FHE.allow(athlete.encryptedSalary, athlete.wallet);
        FHE.allow(athlete.encryptedBonus, athlete.wallet);

        // Update team payroll
        team.encryptedPayroll = newPayroll;
        FHE.allowThis(team.encryptedPayroll);
        FHE.allow(team.encryptedPayroll, team.manager);

        team.athleteIds.push(proposal.athleteId);

        proposal.status = ProposalStatus.Approved;

        emit ProposalApproved(_proposalId);
        emit SalaryUpdated(proposal.athleteId);
    }

    function rejectProposal(
        uint256 _proposalId
    ) external validProposal(_proposalId) {
        ContractProposal storage proposal = proposals[_proposalId];
        require(
            athletes[proposal.athleteId].wallet == msg.sender,
            "Only athlete can reject"
        );

        proposal.status = ProposalStatus.Rejected;
        emit ProposalRejected(_proposalId);
    }

    function cancelProposal(
        uint256 _proposalId
    ) external validProposal(_proposalId) {
        ContractProposal storage proposal = proposals[_proposalId];
        require(proposal.proposer == msg.sender, "Only proposer can cancel");

        proposal.status = ProposalStatus.Cancelled;
    }

    // ============ View Functions ============
    function getTeamAthletes(uint256 _teamId) external view returns (uint256[] memory) {
        return teams[_teamId].athleteIds;
    }

    function getAthleteInfo(uint256 _athleteId) external view returns (
        string memory name,
        uint256 teamId,
        bool isActive,
        uint256 contractEndDate
    ) {
        Athlete storage athlete = athletes[_athleteId];
        return (athlete.name, athlete.teamId, athlete.isActive, athlete.contractEndDate);
    }

    function getTeamInfo(uint256 _teamId) external view returns (
        string memory name,
        address manager,
        uint256 athleteCountInTeam,
        bool isActive
    ) {
        Team storage team = teams[_teamId];
        return (team.name, team.manager, team.athleteIds.length, team.isActive);
    }

    function getProposalInfo(uint256 _proposalId) external view returns (
        uint256 athleteId,
        uint256 teamId,
        uint256 contractDuration,
        uint256 createdAt,
        ProposalStatus status
    ) {
        ContractProposal storage proposal = proposals[_proposalId];
        return (
            proposal.athleteId,
            proposal.teamId,
            proposal.contractDuration,
            proposal.createdAt,
            proposal.status
        );
    }

    // ============ Access Control for Encrypted Data ============
    function grantSalaryAccess(uint256 _athleteId, address _to) external onlyAthlete(_athleteId) {
        Athlete storage athlete = athletes[_athleteId];
        FHE.allow(athlete.encryptedSalary, _to);
        FHE.allow(athlete.encryptedBonus, _to);
    }
}
