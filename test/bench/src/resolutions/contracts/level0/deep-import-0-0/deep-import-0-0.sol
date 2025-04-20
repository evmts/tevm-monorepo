// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./deep-import-0-0-0/deep-import-0-0-0.sol";
import "./deep-import-0-0-1/deep-import-0-0-1.sol";

/**
 * @title deep-import-0-0
 * @dev A substantial contract for benchmarking import resolution
 * @author TEVM Benchmark Generator
 * @notice This contract is generated for benchmarking import resolution
 */
contract DeepImport00 {
    // ============ Events ============
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokenMinted(address indexed to, uint256 tokenId, string tokenURI);
    event TokenBurned(address indexed from, uint256 tokenId);
    event MarketplaceListing(uint256 indexed tokenId, address indexed seller, uint256 price);
    event MarketplaceSale(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    
    // ============ Storage ============
    uint256 private constant MAX_UINT256 = type(uint256).max;
    bytes32 private constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant PERMIT_TYPEHASH = keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _tokenCount;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bool) private _tokenExists;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(uint256 => MarketItem) private _marketItems;
    mapping(address => uint256) private _nonces;
    
    struct MarketItem {
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        bool sold;
    }
    
    address private _owner;
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    bool private _paused;
    uint256 private _tokenIdCounter;
    uint256 private _listingFee;
    
    // ============ Modifiers ============
    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }
    
    modifier tokenExists(uint256 tokenId) {
        require(_tokenExists[tokenId], "Token: token does not exist");
        _;
    }
    
    // ============ Constructor ============
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = 18;
        _owner = msg.sender;
        _listingFee = 0.025 ether;
        
        // Generate some random initial state
        _totalSupply = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, address(this)))) % 1000000 * 10**18;
        _balances[msg.sender] = _totalSupply;
        
        emit Transfer(address(0), msg.sender, _totalSupply);
    }
    
    // ============ Public Functions ============
    function name() public view returns (string memory) {
        return _name;
    }
    
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) public whenNotPaused returns (bool) {
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }
    
    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public whenNotPaused returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
    
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, _allowances[owner][spender] + addedValue);
        return true;
    }
    
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = _allowances[owner][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }
        return true;
    }
    
    // NFT-related functions
    function mintToken(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit TokenMinted(to, newTokenId, tokenURI);
        
        return newTokenId;
    }
    
    function burnToken(uint256 tokenId) public tokenExists(tokenId) {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: caller is not owner nor approved");
        address owner = _owners[tokenId];
        
        // Clear approvals
        _approve(address(0), tokenId);
        
        _tokenCount[owner]--;
        delete _owners[tokenId];
        delete _tokenURIs[tokenId];
        _tokenExists[tokenId] = false;
        
        emit TokenBurned(owner, tokenId);
        emit Transfer(owner, address(0), tokenId);
    }
    
    function ownerOf(uint256 tokenId) public view tokenExists(tokenId) returns (address) {
        return _owners[tokenId];
    }
    
    function tokenURI(uint256 tokenId) public view tokenExists(tokenId) returns (string memory) {
        return _tokenURIs[tokenId];
    }
    
    function approve(address to, uint256 tokenId) public {
        address owner = _owners[tokenId];
        require(to != owner, "ERC721: approval to current owner");
        require(msg.sender == owner || _operatorApprovals[owner][msg.sender], 
                "ERC721: approve caller is not owner nor approved for all");
                
        _approve(to, tokenId);
    }
    
    function getApproved(uint256 tokenId) public view tokenExists(tokenId) returns (address) {
        return _tokenApprovals[tokenId];
    }
    
    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender, "ERC721: approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
    }
    
    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }
    
    function transferToken(address from, address to, uint256 tokenId) public tokenExists(tokenId) {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        
        // Clear approvals from the previous owner
        _approve(address(0), tokenId);
        
        _tokenCount[from]--;
        _tokenCount[to]++;
        _owners[tokenId] = to;
        
        emit Transfer(from, to, tokenId);
    }
    
    // Marketplace functions
    function createMarketItem(uint256 tokenId, uint256 price) public payable tokenExists(tokenId) {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == _listingFee, "Fee must equal listing fee");
        require(_owners[tokenId] == msg.sender, "Only owner can create market item");
        
        _marketItems[tokenId] = MarketItem(
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
        
        // Transfer token to contract
        transferToken(msg.sender, address(this), tokenId);
        
        emit MarketplaceListing(tokenId, msg.sender, price);
    }
    
    function createMarketSale(uint256 tokenId) public payable tokenExists(tokenId) {
        uint256 price = _marketItems[tokenId].price;
        address seller = _marketItems[tokenId].seller;
        
        require(msg.value == price, "Please submit the asking price");
        require(!_marketItems[tokenId].sold, "Item already sold");
        
        // Mark as sold
        _marketItems[tokenId].owner = msg.sender;
        _marketItems[tokenId].sold = true;
        
        // Transfer ownership
        transferToken(address(this), msg.sender, tokenId);
        
        // Transfer value to seller
        payable(seller).transfer(msg.value);
        
        emit MarketplaceSale(tokenId, seller, msg.sender, price);
    }
    
    // EIP-2612 permit function
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual {
        require(block.timestamp <= deadline, "ERC20Permit: expired deadline");
        
        bytes32 structHash = keccak256(
            abi.encode(PERMIT_TYPEHASH, owner, spender, value, _nonces[owner]++, deadline)
        );
        
        bytes32 domainSeparator = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                keccak256(bytes(_name)),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
        
        bytes32 hash = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        
        address signer = ecrecover(hash, v, r, s);
        require(signer != address(0) && signer == owner, "ERC20Permit: invalid signature");
        
        _approve(owner, spender, value);
    }
    
    // ============ Owner Functions ============
    function pause() public onlyOwner {
        _paused = true;
    }
    
    function unpause() public onlyOwner {
        _paused = false;
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "ERC20: mint to the zero address");
        
        _totalSupply += amount;
        _balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function burn(uint256 amount) public {
        address account = msg.sender;
        require(account != address(0), "ERC20: burn from the zero address");
        
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;
        
        emit Transfer(account, address(0), amount);
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        address oldOwner = _owner;
        _owner = newOwner;
    }
    
    function setListingFee(uint256 fee) public onlyOwner {
        _listingFee = fee;
    }
    
    function getListingFee() public view returns (uint256) {
        return _listingFee;
    }
    
    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    // ============ Internal Functions ============
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;
        
        emit Transfer(from, to, amount);
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function _approve(address to, uint256 tokenId) internal {
        _tokenApprovals[tokenId] = to;
        emit Approval(_owners[tokenId], to, tokenId);
    }
    
    function _spendAllowance(address owner, address spender, uint256 amount) internal {
        uint256 currentAllowance = _allowances[owner][spender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }
    
    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_tokenExists[tokenId], "ERC721: token already minted");
        
        _tokenCount[to]++;
        _owners[tokenId] = to;
        _tokenExists[tokenId] = true;
        
        emit Transfer(address(0), to, tokenId);
    }
    
    function _setTokenURI(uint256 tokenId, string memory tokenURI_) internal tokenExists(tokenId) {
        _tokenURIs[tokenId] = tokenURI_;
    }
    
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        require(_tokenExists[tokenId], "ERC721: operator query for nonexistent token");
        address owner = _owners[tokenId];
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
    
    // Some complex computation to simulate real contract code
    function complexComputation(uint256 a, uint256 b) public pure returns (uint256) {
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        
        uint256 result = 0;
        for (uint256 i = 0; i < 10; i++) {
            result += c / (i + 1);
        }
        
        bytes32 hash = keccak256(abi.encodePacked(a, b, result));
        result ^= uint256(hash);
        
        return result;
    }
    
    function multiStepCalculation(uint256 input) public pure returns (uint256) {
        uint256 result = input;
        
        // Step 1: Square the input
        result = result * result;
        
        // Step 2: Add the original input
        result += input;
        
        // Step 3: Divide by 2 if even, multiply by 3 and add 1 if odd
        if (result % 2 == 0) {
            result = result / 2;
        } else {
            result = result * 3 + 1;
        }
        
        // Step 4: Calculate a hash and incorporate it
        bytes32 hash = keccak256(abi.encodePacked(result));
        result ^= uint256(hash) % 1000;
        
        // Step 5: Apply some boundary conditions
        if (result < 100) {
            result += 100;
        } else if (result > 10000) {
            result = result % 10000;
        }
        
        return result;
    }
}