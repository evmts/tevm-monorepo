// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IERC721.sol";
import "../libraries/Strings.sol";
import "../libraries/Address.sol";
import "./NFTStorage.sol";

contract NFT is IERC721 {
    using Address for address;
    using Strings for uint256;
    
    NFTStorage private _storage;
    string public constant name = "Example NFT";
    string public constant symbol = "EXNFT";
    
    constructor() {
        // Initialize the contract
    }
    
    function balanceOf(address owner) external view override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _storage.balances[owner];
    }
    
    function ownerOf(uint256 tokenId) external view override returns (address) {
        address owner = _storage.owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId) external override {
        safeTransferFrom(from, to, tokenId, "");
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }
    
    function transferFrom(address from, address to, uint256 tokenId) external override {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        _transfer(from, to, tokenId);
    }
    
    function approve(address to, uint256 tokenId) external override {
        address owner = _storage.owners[tokenId];
        require(to != owner, "ERC721: approval to current owner");
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "ERC721: approve caller is not owner nor approved for all"
        );
        _approve(to, tokenId);
    }
    
    function getApproved(uint256 tokenId) external view override returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");
        return _storage.tokenApprovals[tokenId];
    }
    
    function setApprovalForAll(address operator, bool approved) external override {
        _setApprovalForAll(msg.sender, operator, approved);
    }
    
    function isApprovedForAll(address owner, address operator) public view override returns (bool) {
        return _storage.operatorApprovals[owner][operator];
    }
    
    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory _data) internal {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _storage.owners[tokenId] != address(0);
    }
    
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = _storage.owners[tokenId];
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
    
    function _transfer(address from, address to, uint256 tokenId) internal {
        require(_storage.owners[tokenId] == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");
        
        // Clear approvals
        _approve(address(0), tokenId);
        
        _storage.balances[from] -= 1;
        _storage.balances[to] += 1;
        _storage.owners[tokenId] = to;
        
        emit Transfer(from, to, tokenId);
    }
    
    function _approve(address to, uint256 tokenId) internal {
        _storage.tokenApprovals[tokenId] = to;
        emit Approval(_storage.owners[tokenId], to, tokenId);
    }
    
    function _setApprovalForAll(address owner, address operator, bool approved) internal {
        require(owner != operator, "ERC721: approve to caller");
        _storage.operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }
    
    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory _data) private returns (bool) {
        if (to.isContract()) {
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, _data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }
    
    function mint(address to, uint256 tokenId) external {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");
        
        _storage.balances[to] += 1;
        _storage.owners[tokenId] = to;
        
        emit Transfer(address(0), to, tokenId);
    }
}