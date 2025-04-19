// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// This is our main contract with multiple imports
import "./contracts/Token.sol";
import "./contracts/Marketplace.sol";
import "./contracts/NFT.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IERC721.sol";
import "./libraries/SafeMath.sol";
import "./libraries/Strings.sol";

contract MainContract {
    using SafeMath for uint256;
    
    Token public token;
    NFT public nft;
    Marketplace public marketplace;
    
    constructor() {
        token = new Token();
        nft = new NFT();
        marketplace = new Marketplace(address(token), address(nft));
    }
    
    function executeComplexLogic() public {
        string memory result = Strings.toString(100);
        uint256 value = SafeMath.add(50, 50);
        require(value == 100, "Math error");
        token.mint(msg.sender, value);
    }
}