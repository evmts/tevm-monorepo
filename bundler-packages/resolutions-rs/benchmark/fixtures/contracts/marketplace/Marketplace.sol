// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../interfaces/IERC20.sol";
import "../../interfaces/IERC721.sol";
import "../../lib/security/AccessControl.sol";
import "../../lib/math/SafeMath.sol";
import "../token/ERC20Token.sol";
import "../token/ERC721Token.sol";

/**
 * @title NFT Marketplace
 * @dev A simple marketplace for buying and selling NFTs with ERC20 tokens
 */
contract Marketplace is AccessControl {
    using SafeMath for uint256;

    // Events
    event ItemListed(uint256 indexed itemId, address indexed seller, uint256 price);
    event ItemSold(uint256 indexed itemId, address indexed seller, address indexed buyer, uint256 price);
    event ItemCanceled(uint256 indexed itemId, address indexed seller);
    event FeesUpdated(uint256 newFeePercentage);

    // Structs
    struct ListedItem {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }

    // State variables
    IERC721 public nftContract;
    IERC20 public paymentToken;
    uint256 public feePercentage = 250; // 2.5% (using basis points: 100% = 10000)
    address public feeCollector;
    
    // Counter for item IDs
    uint256 private _itemIds;
    
    // Mapping from item ID to item details
    mapping(uint256 => ListedItem) public listedItems;

    bytes32 public constant FEE_MANAGER_ROLE = keccak256("FEE_MANAGER_ROLE");

    /**
     * @dev Constructor sets the NFT contract, payment token and fee collector
     */
    constructor(
        address _nftContract,
        address _paymentToken,
        address _feeCollector
    ) {
        require(_nftContract != address(0), "Marketplace: NFT contract cannot be zero address");
        require(_paymentToken != address(0), "Marketplace: Payment token cannot be zero address");
        require(_feeCollector != address(0), "Marketplace: Fee collector cannot be zero address");
        
        nftContract = IERC721(_nftContract);
        paymentToken = IERC20(_paymentToken);
        feeCollector = _feeCollector;
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(FEE_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Lists an NFT for sale
     */
    function listItem(uint256 tokenId, uint256 price) external returns (uint256) {
        require(price > 0, "Marketplace: Price must be greater than zero");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Marketplace: Only the owner can list the NFT");
        require(nftContract.getApproved(tokenId) == address(this) || 
                nftContract.isApprovedForAll(msg.sender, address(this)), 
                "Marketplace: Contract not approved to transfer NFT");
        
        _itemIds = _itemIds.add(1);
        uint256 itemId = _itemIds;
        
        listedItems[itemId] = ListedItem({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true
        });
        
        emit ItemListed(itemId, msg.sender, price);
        return itemId;
    }

    /**
     * @dev Allows a user to buy a listed NFT
     */
    function buyItem(uint256 itemId) external {
        ListedItem storage item = listedItems[itemId];
        require(item.isActive, "Marketplace: Item is not active");
        require(msg.sender != item.seller, "Marketplace: Seller cannot buy their own item");
        
        // Calculate fees
        uint256 feeAmount = item.price.mul(feePercentage).div(10000);
        uint256 sellerAmount = item.price.sub(feeAmount);
        
        // Update item status
        item.isActive = false;
        
        // Process payment
        require(paymentToken.transferFrom(msg.sender, feeCollector, feeAmount), 
                "Marketplace: Fee transfer failed");
        require(paymentToken.transferFrom(msg.sender, item.seller, sellerAmount), 
                "Marketplace: Payment transfer failed");
        
        // Transfer NFT
        nftContract.transferFrom(item.seller, msg.sender, item.tokenId);
        
        emit ItemSold(itemId, item.seller, msg.sender, item.price);
    }

    /**
     * @dev Allows the seller to cancel a listing
     */
    function cancelListing(uint256 itemId) external {
        ListedItem storage item = listedItems[itemId];
        require(item.isActive, "Marketplace: Item is not active");
        require(msg.sender == item.seller, "Marketplace: Only seller can cancel listing");
        
        item.isActive = false;
        
        emit ItemCanceled(itemId, msg.sender);
    }

    /**
     * @dev Updates the fee percentage (only callable by fee manager)
     */
    function updateFeePercentage(uint256 _feePercentage) external {
        require(hasRole(FEE_MANAGER_ROLE, msg.sender), "Marketplace: Must have fee manager role");
        require(_feePercentage <= 1000, "Marketplace: Fee cannot exceed 10%");
        
        feePercentage = _feePercentage;
        
        emit FeesUpdated(_feePercentage);
    }

    /**
     * @dev Updates the fee collector address (only callable by admin)
     */
    function updateFeeCollector(address _feeCollector) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Marketplace: Must have admin role");
        require(_feeCollector != address(0), "Marketplace: Fee collector cannot be zero address");
        
        feeCollector = _feeCollector;
    }
    
    /**
     * @dev Returns all active listings
     */
    function getActiveListings() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 1; i <= _itemIds; i++) {
            if (listedItems[i].isActive) {
                activeCount++;
            }
        }
        
        // Create result array
        uint256[] memory result = new uint256[](activeCount);
        uint256 index = 0;
        
        // Fill result array
        for (uint256 i = 1; i <= _itemIds; i++) {
            if (listedItems[i].isActive) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }
}