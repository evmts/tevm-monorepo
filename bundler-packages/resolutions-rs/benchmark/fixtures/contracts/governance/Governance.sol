// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../interfaces/IERC20.sol";
import "../../lib/math/SafeMath.sol";
import "../../lib/security/AccessControl.sol";
import "../../lib/utils/StringUtils.sol";
import "../token/ERC20Token.sol";
import "../marketplace/Marketplace.sol";

/**
 * @title Governance
 * @dev A governance contract for the marketplace platform
 */
contract Governance is AccessControl {
    using SafeMath for uint256;
    using StringUtils for string;

    // Events
    event ProposalCreated(uint256 indexed proposalId, address proposer, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 votes);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay);
    event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod);
    event ThresholdSet(uint256 oldThreshold, uint256 newThreshold);

    // Proposal struct
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
        bool canceled;
        uint256 forVotes;
        uint256 againstVotes;
        mapping(address => Receipt) receipts;
        bytes[] actions;
        address[] targets;
        uint256[] values;
    }

    // Vote receipt struct
    struct Receipt {
        bool hasVoted;
        bool support;
        uint256 votes;
    }

    // State variables
    IERC20 public governanceToken;
    Marketplace public marketplace;
    
    // Proposal tracking
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    // Governance settings
    uint256 public votingDelay = 1; // blocks before voting starts
    uint256 public votingPeriod = 40320; // blocks for voting (~ 1 week at 15s blocks)
    uint256 public threshold = 1000e18; // 1000 tokens required to submit a proposal

    bytes32 public constant GOVERNANCE_ADMIN_ROLE = keccak256("GOVERNANCE_ADMIN_ROLE");

    /**
     * @dev Constructor sets the governance token and marketplace
     */
    constructor(address _governanceToken, address _marketplace) {
        require(_governanceToken != address(0), "Governance: Token cannot be zero address");
        require(_marketplace != address(0), "Governance: Marketplace cannot be zero address");
        
        governanceToken = IERC20(_governanceToken);
        marketplace = Marketplace(_marketplace);
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GOVERNANCE_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Creates a new proposal
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        require(
            governanceToken.balanceOf(msg.sender) >= threshold,
            "Governance: Proposer votes below threshold"
        );
        require(targets.length > 0, "Governance: Must provide actions");
        require(targets.length == values.length, "Governance: Invalid proposal length");
        require(targets.length == calldatas.length, "Governance: Invalid proposal length");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.description = description;
        newProposal.startBlock = block.number.add(votingDelay);
        newProposal.endBlock = block.number.add(votingDelay).add(votingPeriod);
        
        for (uint256 i = 0; i < targets.length; i++) {
            newProposal.actions.push(calldatas[i]);
            newProposal.targets.push(targets[i]);
            newProposal.values.push(values[i]);
        }
        
        emit ProposalCreated(proposalId, msg.sender, description);
        return proposalId;
    }

    /**
     * @dev Cast a vote on a proposal
     */
    function castVote(uint256 proposalId, bool support) public {
        require(state(proposalId) == ProposalState.Active, "Governance: Voting is closed");
        
        Proposal storage proposal = proposals[proposalId];
        Receipt storage receipt = proposal.receipts[msg.sender];
        
        require(!receipt.hasVoted, "Governance: Already voted");
        
        uint256 votes = governanceToken.balanceOf(msg.sender);
        
        if (support) {
            proposal.forVotes = proposal.forVotes.add(votes);
        } else {
            proposal.againstVotes = proposal.againstVotes.add(votes);
        }
        
        receipt.hasVoted = true;
        receipt.support = support;
        receipt.votes = votes;
        
        emit VoteCast(proposalId, msg.sender, support, votes);
    }

    /**
     * @dev Execute a successful proposal
     */
    function execute(uint256 proposalId) public {
        require(state(proposalId) == ProposalState.Succeeded, "Governance: Proposal not successful");
        
        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;
        
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            (bool success, ) = proposal.targets[i].call{value: proposal.values[i]}(proposal.actions[i]);
            require(success, "Governance: Transaction execution reverted");
        }
        
        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev Cancel a proposal
     */
    function cancel(uint256 proposalId) public {
        require(state(proposalId) != ProposalState.Executed, "Governance: Cannot cancel executed proposal");
        
        Proposal storage proposal = proposals[proposalId];
        
        require(
            msg.sender == proposal.proposer || 
            hasRole(GOVERNANCE_ADMIN_ROLE, msg.sender),
            "Governance: Only proposer or admin can cancel"
        );
        
        proposal.canceled = true;
        
        emit ProposalCanceled(proposalId);
    }

    /**
     * @dev Get the proposal state
     */
    function state(uint256 proposalId) public view returns (ProposalState) {
        require(proposalId <= proposalCount && proposalId > 0, "Governance: Invalid proposal id");
        
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.canceled) {
            return ProposalState.Canceled;
        } else if (proposal.executed) {
            return ProposalState.Executed;
        } else if (block.number <= proposal.startBlock) {
            return ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        } else if (proposal.forVotes > proposal.againstVotes) {
            return ProposalState.Succeeded;
        } else {
            return ProposalState.Defeated;
        }
    }

    /**
     * @dev Update the voting delay (only admin)
     */
    function setVotingDelay(uint256 newVotingDelay) public {
        require(hasRole(GOVERNANCE_ADMIN_ROLE, msg.sender), "Governance: Only admin");
        require(newVotingDelay <= 40320, "Governance: Voting delay too high");
        
        uint256 oldVotingDelay = votingDelay;
        votingDelay = newVotingDelay;
        
        emit VotingDelaySet(oldVotingDelay, newVotingDelay);
    }

    /**
     * @dev Update the voting period (only admin)
     */
    function setVotingPeriod(uint256 newVotingPeriod) public {
        require(hasRole(GOVERNANCE_ADMIN_ROLE, msg.sender), "Governance: Only admin");
        require(newVotingPeriod >= 5760 && newVotingPeriod <= 80640, "Governance: Invalid voting period");
        
        uint256 oldVotingPeriod = votingPeriod;
        votingPeriod = newVotingPeriod;
        
        emit VotingPeriodSet(oldVotingPeriod, newVotingPeriod);
    }

    /**
     * @dev Update the proposal threshold (only admin)
     */
    function setProposalThreshold(uint256 newThreshold) public {
        require(hasRole(GOVERNANCE_ADMIN_ROLE, msg.sender), "Governance: Only admin");
        
        uint256 oldThreshold = threshold;
        threshold = newThreshold;
        
        emit ThresholdSet(oldThreshold, newThreshold);
    }

    /**
     * @dev Get proposal details
     */
    function getProposalDetails(uint256 proposalId) 
        public view 
        returns (
            address proposer,
            string memory description,
            uint256 startBlock,
            uint256 endBlock,
            bool executed,
            bool canceled,
            uint256 forVotes,
            uint256 againstVotes,
            ProposalState currentState
        ) 
    {
        require(proposalId <= proposalCount && proposalId > 0, "Governance: Invalid proposal id");
        
        Proposal storage proposal = proposals[proposalId];
        
        return (
            proposal.proposer,
            proposal.description,
            proposal.startBlock,
            proposal.endBlock,
            proposal.executed,
            proposal.canceled,
            proposal.forVotes,
            proposal.againstVotes,
            state(proposalId)
        );
    }

    // Proposal states
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Executed
    }
}