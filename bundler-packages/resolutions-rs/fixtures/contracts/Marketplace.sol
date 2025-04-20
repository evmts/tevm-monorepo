// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IERC20.sol";
import "../interfaces/IERC721.sol";
import "../libraries/SafeMath.sol";
import "../libraries/Address.sol";
import "./MarketplaceStorage.sol";

contract Marketplace {
    using SafeMath for uint256;
    using Address for address;
    
    MarketplaceStorage private _storage;
    address public immutable tokenAddress;
    address public immutable nftAddress;
    
    constructor(address _tokenAddress, address _nftAddress) {
        require(_tokenAddress != address(0), "Token address cannot be zero");
        require(_nftAddress != address(0), "NFT address cannot be zero");
        tokenAddress = _tokenAddress;
        nftAddress = _nftAddress;
    }
    
    function listNFT(uint256 tokenId, uint256 price) external {
        require(IERC721(nftAddress).ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than zero");
        
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);
        
        _storage.listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });
        
        emit NFTListed(tokenId, msg.sender, price);
    }
    
    function buyNFT(uint256 tokenId) external {
        Listing memory listing = _storage.listings[tokenId];
        require(listing.active, "Listing not active");
        
        _storage.listings[tokenId].active = false;
        
        IERC20(tokenAddress).transferFrom(msg.sender, listing.seller, listing.price);
        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);
        
        emit NFTSold(tokenId, listing.seller, msg.sender, listing.price);
    }
    
    function cancelListing(uint256 tokenId) external {
        Listing memory listing = _storage.listings[tokenId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");
        
        _storage.listings[tokenId].active = false;
        
        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);
        
        emit NFTListingCancelled(tokenId, msg.sender);
    }
    
    // Events
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event NFTListingCancelled(uint256 indexed tokenId, address indexed seller);
    
    // Listing struct
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }
}