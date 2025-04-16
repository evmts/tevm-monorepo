// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import multiple contracts from different sources to create a complex import graph
import "./contracts/token/ERC20Token.sol";
import "./contracts/token/ERC721Token.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IERC721.sol";
import "./lib/utils/StringUtils.sol";
import "./lib/math/SafeMath.sol";
import "./contracts/marketplace/Marketplace.sol";
import "lib/security/AccessControl.sol";
import "contracts/governance/Governance.sol";

/**
 * @title Main Contract
 * @dev Main entry point of the contract system that imports many other contracts
 */
contract Main {
    using SafeMath for uint256;
    using StringUtils for string;

    ERC20Token private _token;
    ERC721Token private _nft;
    Marketplace private _marketplace;
    Governance private _governance;
    AccessControl private _accessControl;

    address public owner;
    uint256 public totalTransactions;
    mapping(address => uint256) public userBalances;

    event MainEvent(address indexed sender, uint256 value, string message);

    constructor(
        address tokenAddress,
        address nftAddress,
        address marketplaceAddress,
        address governanceAddress
    ) {
        _token = ERC20Token(tokenAddress);
        _nft = ERC721Token(nftAddress);
        _marketplace = Marketplace(marketplaceAddress);
        _governance = Governance(governanceAddress);
        _accessControl = new AccessControl();
        
        owner = msg.sender;
        _accessControl.grantRole("ADMIN", msg.sender);
    }

    function executeMarketplaceTrade(
        address seller,
        address buyer, 
        uint256 tokenId, 
        uint256 price
    ) external {
        require(_accessControl.hasRole("TRADER", msg.sender), "Not authorized");

        // Validate the price
        require(price > 0, "Price must be greater than zero");
        
        // Check buyer balance
        require(_token.balanceOf(buyer) >= price, "Insufficient balance");
        
        // Check if seller owns the NFT
        require(_nft.ownerOf(tokenId) == seller, "Seller does not own the NFT");
        
        // Execute the trade
        _token.transferFrom(buyer, seller, price);
        _nft.transferFrom(seller, buyer, tokenId);
        
        // Update marketplace state
        _marketplace.recordTrade(seller, buyer, tokenId, price);
        
        // Update governance state
        _governance.logTransaction(seller, buyer, price);
        
        // Update local state
        totalTransactions = totalTransactions.add(1);
        userBalances[buyer] = userBalances[buyer].sub(price);
        userBalances[seller] = userBalances[seller].add(price);
        
        emit MainEvent(msg.sender, price, "Trade executed successfully");
    }

    function createAuction(
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration
    ) external {
        require(_accessControl.hasRole("AUCTIONEER", msg.sender), "Not authorized");
        require(_nft.ownerOf(tokenId) == msg.sender, "Only token owner can create auction");
        
        // Approve marketplace to transfer NFT
        _nft.approve(address(_marketplace), tokenId);
        
        // Create auction in marketplace
        _marketplace.createAuction(msg.sender, tokenId, startingPrice, duration);
        
        // Update governance
        _governance.recordAuctionCreation(msg.sender, tokenId, startingPrice);
        
        emit MainEvent(msg.sender, startingPrice, "Auction created");
    }

    function bidOnAuction(uint256 auctionId, uint256 bidAmount) external {
        require(bidAmount > 0, "Bid amount must be positive");
        require(_token.balanceOf(msg.sender) >= bidAmount, "Insufficient balance");
        
        // Place bid
        _marketplace.placeBid(auctionId, msg.sender, bidAmount);
        
        // Update governance
        _governance.recordBid(msg.sender, auctionId, bidAmount);
        
        emit MainEvent(msg.sender, bidAmount, "Bid placed");
    }

    function finalizeAuction(uint256 auctionId) external {
        // Get auction details
        (address seller, address highestBidder, uint256 highestBid, uint256 tokenId) = 
            _marketplace.getAuctionDetails(auctionId);
        
        require(msg.sender == seller || _accessControl.hasRole("ADMIN", msg.sender), "Not authorized");
        
        // Finalize auction
        _marketplace.finalizeAuction(auctionId);
        
        // Transfer funds and NFT
        _token.transferFrom(highestBidder, seller, highestBid);
        _nft.transferFrom(seller, highestBidder, tokenId);
        
        // Update governance
        _governance.recordAuctionFinalization(auctionId, highestBidder, highestBid);
        
        // Update local state
        totalTransactions = totalTransactions.add(1);
        
        emit MainEvent(msg.sender, highestBid, "Auction finalized");
    }

    function withdrawFunds(uint256 amount) external {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] = userBalances[msg.sender].sub(amount);
        _token.transfer(msg.sender, amount);
        
        emit MainEvent(msg.sender, amount, "Funds withdrawn");
    }

    function depositFunds(uint256 amount) external {
        require(_token.balanceOf(msg.sender) >= amount, "Insufficient token balance");
        
        _token.transferFrom(msg.sender, address(this), amount);
        userBalances[msg.sender] = userBalances[msg.sender].add(amount);
        
        emit MainEvent(msg.sender, amount, "Funds deposited");
    }

    function getMarketplaceStats() external view returns (
        uint256 totalAuctions,
        uint256 activeAuctions,
        uint256 completedAuctions,
        uint256 totalVolume
    ) {
        return _marketplace.getMarketplaceStats();
    }

    function getGovernanceProposalCount() external view returns (uint256) {
        return _governance.getProposalCount();
    }

    function createGovernanceProposal(string memory description, address target, bytes memory data) external {
        require(_accessControl.hasRole("GOVERNANCE_MEMBER", msg.sender), "Not authorized");
        
        _governance.createProposal(msg.sender, description, target, data);
        
        emit MainEvent(msg.sender, 0, "Governance proposal created");
    }

    function voteOnProposal(uint256 proposalId, bool support) external {
        require(_accessControl.hasRole("GOVERNANCE_MEMBER", msg.sender), "Not authorized");
        
        _governance.vote(proposalId, msg.sender, support);
        
        emit MainEvent(msg.sender, proposalId, support ? "Voted in favor" : "Voted against");
    }

    function executeProposal(uint256 proposalId) external {
        require(_accessControl.hasRole("ADMIN", msg.sender), "Not authorized");
        
        _governance.executeProposal(proposalId);
        
        emit MainEvent(msg.sender, proposalId, "Proposal executed");
    }
}