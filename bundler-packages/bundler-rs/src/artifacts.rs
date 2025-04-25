use crate::models::{BundleError, CompileResult, ModuleInfo, ContractArtifact};
use std::collections::HashMap;
use serde_json::{Value, json};
use tevm_solc_rs::SolcOutput;

/// Process a compilation result to extract artifacts
pub async fn extract_artifacts(
    solc_output: &SolcOutput,
) -> Result<HashMap<String, ContractArtifact>, BundleError> {
    let mut artifacts = HashMap::new();
    
    if let Some(contracts) = &solc_output.contracts {
        for (file_name, file_contracts) in contracts {
            for (contract_name, contract_data) in file_contracts {
                let full_name = format!("{}:{}", file_name, contract_name);
                
                // Extract ABI
                let abi = contract_data.abi.clone().unwrap_or_else(|| json!([]));
                
                // Extract bytecode
                let bytecode = contract_data.evm
                    .as_ref()
                    .and_then(|evm| evm.bytecode.as_ref())
                    .and_then(|bytecode| bytecode.object.as_ref())
                    .map(|object| object.clone());
                
                // Extract deployed bytecode
                let deployed_bytecode = contract_data.evm
                    .as_ref()
                    .and_then(|evm| evm.deployed_bytecode.as_ref())
                    .and_then(|bytecode| bytecode.object.as_ref())
                    .map(|object| object.clone());
                
                // Extract user documentation
                let user_doc = contract_data.userdoc.clone();
                
                // Extract developer documentation
                let dev_doc = contract_data.devdoc.clone();
                
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
    
    // Gather source locations from the solc output
    if let Some(solc_output_value) = compile_result.solc_output.as_object() {
        if let Some(contracts_value) = solc_output_value.get("contracts").and_then(Value::as_object) {
            let mut source_maps = HashMap::new();
            
            for (file_name, file_contracts) in contracts_value {
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
    }
    
    Ok(source_map)
}

/// Extract ASTs from a compilation result
pub async fn extract_asts(
    solc_output: &SolcOutput,
) -> Result<HashMap<String, Value>, BundleError> {
    let mut asts = HashMap::new();
    
    if let Some(sources) = &solc_output.sources {
        for (file_name, source_data) in sources {
            if let Some(ast) = &source_data.ast {
                asts.insert(file_name.clone(), serde_json::to_value(ast).unwrap_or(json!({})));
            }
        }
    }
    
    Ok(asts)
}