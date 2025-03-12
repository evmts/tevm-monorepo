// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import "./ShouldNotBeImported.sol";
import "./ImportedContract.sol";

contract ContractWithCommentedImports {
    ImportedContract private importedContract;
    
    constructor() {
        importedContract = new ImportedContract();
    }
    
    function getImportedMessage() public view returns (string memory) {
        return importedContract.getMessage();
    }
    
    /* This is a multi-line comment
       import "./AlsoShouldNotBeImported.sol";
       This should be ignored
    */
    
    function getMessage() public pure returns (string memory) {
        // Here's another commented import:
        // import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
        return "Hello from main contract";
    }
}