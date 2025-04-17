use tevm_solc_rs::{create_solc, SolcInputDescription, SolcLanguage, SolcInputSource, SolcSettings, SolcOptimizer};
use std::collections::HashMap;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a solc compiler instance
    let solc = create_solc("0.8.20").await?;
    println!("Using solc version: {}", solc.version);
    
    // Create a simple contract
    let contract = r#"
        pragma solidity ^0.8.20;
        
        contract SimpleStorage {
            uint256 private storedData;
            
            function set(uint256 x) public {
                storedData = x;
            }
            
            function get() public view returns (uint256) {
                return storedData;
            }
        }
    "#;
    
    // Prepare input sources
    let mut sources = HashMap::new();
    sources.insert(
        "SimpleStorage.sol".to_string(),
        SolcInputSource {
            keccak256: None,
            urls: None,
            content: Some(contract.to_string()),
        },
    );
    
    // Define optimizer settings
    let optimizer = SolcOptimizer {
        enabled: Some(true),
        runs: 200,
        details: None,
    };
    
    // Create compiler settings
    let settings = SolcSettings {
        optimizer: Some(optimizer),
        ..Default::default()
    };
    
    // Create the input description
    let input = SolcInputDescription {
        language: SolcLanguage::Solidity,
        sources,
        settings: Some(settings),
    };
    
    // Compile the contract
    let output = solc.compile(&input)?;
    
    // Check for errors
    if let Some(errors) = &output.errors {
        for error in errors {
            println!("Error: {} - {}", error.severity, error.message);
        }
    }
    
    // Print results
    if let Some(contracts) = &output.contracts {
        if let Some(file_contracts) = contracts.get("SimpleStorage.sol") {
            if let Some(contract) = file_contracts.get("SimpleStorage") {
                println!("Contract ABI: {}", serde_json::to_string_pretty(&contract.abi)?);
                println!("Bytecode: {}", &contract.evm.bytecode.object[..64]); // Print first 64 chars of bytecode
            }
        }
    }
    
    Ok(())
}