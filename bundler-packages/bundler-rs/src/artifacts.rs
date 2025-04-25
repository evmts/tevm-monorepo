use crate::models::{BundleError, CompileResult, ContractArtifact};
use std::collections::HashMap;
use serde_json::{Value, json};

/// Process a compilation result to extract artifacts 
/// This uses a Value-based approach since we're working with serialized data
pub async fn extract_artifacts(
    solc_output: &Value,
) -> Result<HashMap<String, ContractArtifact>, BundleError> {
    let mut artifacts = HashMap::new();
    
    // Get the contracts object from the solc output
    let contracts = match solc_output.get("contracts") {
        Some(contracts) => contracts.as_object(),
        None => None,
    };
    
    if let Some(contracts) = contracts {
        for (file_name, file_contracts) in contracts {
            if let Some(file_contracts_obj) = file_contracts.as_object() {
                for (contract_name, contract_data) in file_contracts_obj {
                    let full_name = format!("{}:{}", file_name, contract_name);
                    
                    // Extract ABI with default to empty array
                    let abi = match contract_data.get("abi") {
                        Some(abi) => abi.clone(),
                        None => json!([]),
                    };
                    
                    // Extract bytecode
                    let bytecode = contract_data
                        .get("evm")
                        .and_then(|evm| evm.get("bytecode"))
                        .and_then(|bytecode| bytecode.get("object"))
                        .and_then(|obj| obj.as_str())
                        .map(|s| s.to_string());
                    
                    // Extract deployed bytecode
                    let deployed_bytecode = contract_data
                        .get("evm")
                        .and_then(|evm| evm.get("deployedBytecode"))
                        .and_then(|bytecode| bytecode.get("object"))
                        .and_then(|obj| obj.as_str())
                        .map(|s| s.to_string());
                    
                    // Extract user documentation
                    let user_doc = contract_data
                        .get("userdoc")
                        .cloned();
                    
                    // Extract developer documentation
                    let dev_doc = contract_data
                        .get("devdoc")
                        .cloned();
                    
                    // Create contract artifact
                    let artifact = ContractArtifact {
                        abi,
                        bytecode,
                        deployed_bytecode,
                        user_doc,
                        dev_doc,
                    };
                    
                    artifacts.insert(full_name, artifact);
                }
            }
        }
    }
    
    Ok(artifacts)
}

/// Generate a source map from compiled artifacts
pub async fn generate_source_map(
    compile_result: &CompileResult,
) -> Result<String, BundleError> {
    let mut source_map = String::new();
    
    // Add basic header
    source_map.push_str("// Source mapping information\n");
    source_map.push_str("// Format: { \"file:contract\": { \"method\": [<start>, <length>, <line>] } }\n");
    
    // Safely get the solc output as an object
    let solc_output = compile_result.solc_output.as_object()
        .ok_or_else(|| BundleError {
            message: "Invalid solc output format".to_string(),
            path: None,
        })?;
    
    // Get the contracts object
    let contracts_value = solc_output.get("contracts")
        .and_then(Value::as_object);
    
    if let Some(contracts) = contracts_value {
        let mut source_maps = HashMap::new();
        
        for (file_name, file_contracts) in contracts {
            if let Some(file_contracts_obj) = file_contracts.as_object() {
                for (contract_name, contract_data) in file_contracts_obj {
                    let full_name = format!("{}:{}", file_name, contract_name);
                    
                    // Check for source mappings in the evm section
                    if let Some(evm) = contract_data.get("evm").and_then(Value::as_object) {
                        if let Some(bytecode) = evm.get("bytecode").and_then(Value::as_object) {
                            if let Some(source_mapping) = bytecode.get("sourceMap").and_then(Value::as_str) {
                                // Here we'd parse the sourceMap string which is a complex task
                                // For now, we'll just store the raw mapping string
                                source_maps.insert(format!("{}:bytecode", full_name), source_mapping.to_string());
                            }
                        }
                        
                        if let Some(deployed_bytecode) = evm.get("deployedBytecode").and_then(Value::as_object) {
                            if let Some(source_mapping) = deployed_bytecode.get("sourceMap").and_then(Value::as_str) {
                                source_maps.insert(format!("{}:deployedBytecode", full_name), source_mapping.to_string());
                            }
                        }
                    }
                }
            }
        }
        
        // Convert the maps to JSON
        if let Ok(source_maps_json) = serde_json::to_string_pretty(&source_maps) {
            source_map.push_str(&source_maps_json);
        }
    }
    
    Ok(source_map)
}

/// Extract ASTs from a compilation result
pub async fn extract_asts(
    solc_output: &Value,
) -> Result<HashMap<String, Value>, BundleError> {
    let mut asts = HashMap::new();
    
    // Get the sources object from the solc output
    let sources = match solc_output.get("sources") {
        Some(sources) => sources.as_object(),
        None => None,
    };
    
    if let Some(sources) = sources {
        for (file_name, source_data) in sources {
            if let Some(ast) = source_data.get("ast") {
                asts.insert(file_name.clone(), ast.clone());
            }
        }
    }
    
    Ok(asts)
}