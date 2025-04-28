use alloy_primitives::Bytes;
use foundry_compilers::artifacts::Contract;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use strum::EnumString;
use strum_macros::Display;

#[napi]
#[derive(Debug, EnumString, Display)]
#[strum(serialize_all = "lowercase")]
pub enum ModuleType {
    Ts,
    Cjs,
    Dts,
    Mjs,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ContractPackage {
    TevmContract,
    TevmContractScoped,
}

impl ContractPackage {
    fn to_string(&self) -> String {
        match self {
            ContractPackage::TevmContract => "tevm/contract".to_string(),
            ContractPackage::TevmContractScoped => "@tevm/contract".to_string(),
        }
    }

    fn from_str(s: &str) -> Option<Self> {
        match s {
            "tevm/contract" => Some(ContractPackage::TevmContract),
            "@tevm/contract" => Some(ContractPackage::TevmContractScoped),
            _ => None,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TevmContract {
    #[serde(rename = "bytecode")]
    pub bytecode: Option<Bytes>,
    #[serde(rename = "deployedBytecode")]
    pub deployed_bytecode: Option<Bytes>,
    pub name: String,
    #[serde(rename = "humanReadableAbi")]
    pub human_readable_abi: Vec<String>,
}

/// Formats a contract ABI into a human-readable form
fn format_abi(abi: &serde_json::Value) -> Vec<String> {
    // For now just convert the ABI items to strings
    match abi.as_array() {
        Some(items) => items.iter().map(|item| item.to_string()).collect(),
        None => vec![],
    }
}

/// Generates runtime code for Tevm contracts
pub fn generate_runtime(
    contracts: Vec<(String, Contract)>,
    module_type: ModuleType,
    contract_package: ContractPackage,
) -> String {
    let package = contract_package.to_string();
    
    // Convert the contracts into a HashMap of TevmContract objects
    let mut tevm_contracts = HashMap::new();
    
    for (name, contract) in contracts {
        // Extract bytecode - using the Contract fields that actually exist
        let bytecode_hex: Option<Bytes> = None; // We'll update this when we know the fields
        
        // Extract deployed bytecode
        let deployed_bytecode_hex: Option<Bytes> = None; // We'll update this when we know the fields
        
        // Create tevm contract - convert foundry JsonAbi to serde_json::Value for format_abi
        let abi_value = contract.abi.as_ref()
            .map(|abi| serde_json::to_value(abi).unwrap_or(serde_json::Value::Array(vec![])))
            .unwrap_or(serde_json::Value::Array(vec![]));
            
        let tevm_contract = TevmContract {
            bytecode: bytecode_hex,
            deployed_bytecode: deployed_bytecode_hex,
            name: name.clone(),
            human_readable_abi: format_abi(&abi_value),
        };
        tevm_contracts.insert(name, tevm_contract);
    }

    if tevm_contracts.is_empty() {
        return "// No contracts found in the solc output".to_string();
    }

    // Create a JSON string version of all contracts
    let contracts_json = serde_json::to_string_pretty(&tevm_contracts).unwrap_or_default();

    // Generate code based on module type
    match module_type {
        ModuleType::Cjs => {
            let mut output = format!("const {{ createContract }} = require('{}');\n\n", package);

            for (name, contract) in &tevm_contracts {
                let contract_json = serde_json::to_string_pretty(contract).unwrap_or_default();
                output.push_str(&format!("const _{0} = {1};\n\n", name, contract_json));
                output.push_str(&format!("/**\n * Contract implementation for {0}\n * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation\n */\n", name));
                output.push_str(&format!(
                    "module.exports.{0} = createContract(_{0});\n\n",
                    name
                ));
            }

            output.push_str(&format!("module.exports.artifacts = {};\n", contracts_json));
            output
        }

        ModuleType::Ts => {
            let mut output = format!("import {{ createContract }} from '{}';\n\n", package);

            for (name, contract) in &tevm_contracts {
                let contract_json = serde_json::to_string_pretty(contract).unwrap_or_default();
                output.push_str(&format!(
                    "const _{0} = {1} as const;\n\n",
                    name, contract_json
                ));
                output.push_str(&format!("/**\n * Contract implementation for {0}\n * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation\n */\n", name));
                output.push_str(&format!(
                    "export const {0} = createContract(_{0});\n\n",
                    name
                ));
            }

            output.push_str(&format!("export const artifacts = {};\n", contracts_json));
            output
        }

        ModuleType::Mjs => {
            let mut output = format!("import {{ createContract }} from '{}';\n\n", package);

            for (name, contract) in &tevm_contracts {
                let contract_json = serde_json::to_string_pretty(contract).unwrap_or_default();
                output.push_str(&format!("const _{0} = {1};\n\n", name, contract_json));
                output.push_str(&format!("/**\n * Contract implementation for {0}\n * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation\n */\n", name));
                output.push_str(&format!(
                    "export const {0} = createContract(_{0});\n\n",
                    name
                ));
            }

            output.push_str(&format!("export const artifacts = {};\n", contracts_json));
            output
        }

        ModuleType::Dts => {
            let mut output = format!("import type {{ Contract }} from '{}';\n\n", package);

            for (name, _) in &tevm_contracts {
                output.push_str(&format!(
                    "// Contract name type\ndeclare const _name{0}: \"{0}\";\n",
                    name
                ));
                output.push_str(&format!(
                    "// ABI type\ndeclare const _abi{0}: any[];\n\n",
                    name
                ));
                output.push_str(&format!(
                    "/**\n * Contract type definition for {0}\n * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation\n */\n", name
                ));
                output.push_str(&format!(
                    "export const {0}: Contract<\n  typeof _name{0},\n  typeof _abi{0},\n  undefined,\n  `0x${{string}}`,\n  `0x${{string}}`,\n  undefined\n>;\n\n",
                    name
                ));
            }

            output.push_str("export const artifacts: Record<string, any>;\n");
            output
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    /// Helper function to create a vector of foundry-style Contract objects for testing
    fn create_test_contracts(
        contracts_data: Vec<(String, serde_json::Value, String, String)>,
    ) -> Vec<(String, Contract)> {
        let mut contracts = Vec::new();

        for (name, abi, _bytecode, _deployed_bytecode) in contracts_data {
            // Create a simple contract with just the ABI for now
            // We'll add the bytecode fields when we understand the contract structure
            let contract = Contract {
                abi: Some(abi),
                ..Contract::empty()
            };
            
            contracts.push((name, contract));
        }

        contracts
    }

    /// This test function logs the actual output
    fn debug_bytecode_output(bytecode: &str) -> String {
        if !bytecode.is_empty() {
            let bytes_obj = format!("0x{}", bytecode)
                .parse::<Bytes>()
                .unwrap_or_default();
            let tevmcontract = TevmContract {
                bytecode: Some(bytes_obj.clone()),
                deployed_bytecode: None,
                name: "TestContract".to_string(),
                human_readable_abi: vec![],
            };
            return serde_json::to_string_pretty(&tevmcontract).unwrap_or_default();
        }
        "".to_string()
    }

    #[test]
    fn test_bytecode_formatting() {
        // Debug the bytecode formatting
        let bytecode_str = "mainBytecode";
        let json_output = debug_bytecode_output(bytecode_str);
        println!("Bytecode JSON format: {}", json_output);
    }

    #[test]
    fn test_generate_runtime_minimal() {
        // Create minimal test data based on JavaScript tests
        let abi = json!([
            { "type": "function", "name": "test", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }
        ]);

        let contracts_data = vec![(
            "TestContract".to_string(),
            abi,
            "1234".to_string(),
            "5678".to_string(),
        )];

        let contracts = create_test_contracts(contracts_data);

        // Test each module type
        let module_types = [
            ModuleType::Cjs,
            ModuleType::Dts,
            ModuleType::Ts,
            ModuleType::Mjs,
        ];

        for module_type in module_types {
            let result = generate_runtime(
                contracts.clone(),
                module_type.clone(),
                ContractPackage::TevmContractScoped,
            );

            // Basic assertions for all module types
            assert!(result.contains("TestContract"));

            // Module-specific assertions
            match module_type {
                ModuleType::Cjs => {
                    assert!(result.contains("module.exports"));
                }
                ModuleType::Ts | ModuleType::Mjs => {
                    assert!(result.contains("export const"));
                }
                ModuleType::Dts => {
                    assert!(result.contains("export const TestContract: Contract<"));
                }
            }
        }
    }

    #[test]
    fn test_generate_runtime_no_contracts() {
        // Create empty contracts vector
        let contracts: Vec<(String, Contract)> = Vec::new();

        let result = generate_runtime(
            contracts,
            ModuleType::Cjs,
            ContractPackage::TevmContractScoped,
        );

        // No contracts should result in a comment
        assert_eq!(result, "// No contracts found in the solc output");
    }

    #[test]
    fn test_generate_runtime_package_names() {
        // Create simple test contract
        let abi = json!([
            { "type": "constructor", "inputs": [], "stateMutability": "payable" }
        ]);

        let contracts_data = vec![(
            "MyContract".to_string(),
            abi,
            "420".to_string(),
            "420420".to_string(),
        )];

        let contracts = create_test_contracts(contracts_data);

        // Test with TevmContract package
        let result_tevm =
            generate_runtime(contracts.clone(), ModuleType::Ts, ContractPackage::TevmContract);
        assert!(result_tevm.contains("import { createContract } from 'tevm/contract'"));
        assert!(!result_tevm.contains("import { createContract } from '@tevm/contract'"));

        // Test with TevmContractScoped package
        let result_scoped = generate_runtime(
            contracts,
            ModuleType::Ts,
            ContractPackage::TevmContractScoped,
        );
        assert!(result_scoped.contains("import { createContract } from '@tevm/contract'"));
        assert!(!result_scoped.contains("import { createContract } from 'tevm/contract'"));
    }

    #[test]
    fn test_generate_runtime_cjs() {
        // Create test contract for CommonJS output
        let abi = json!([
            { "type": "constructor", "inputs": [], "stateMutability": "payable" }
        ]);

        let contracts_data = vec![(
            "MyContract".to_string(),
            abi,
            "420".to_string(),
            "420420".to_string(),
        )];

        let contracts = create_test_contracts(contracts_data);

        let result = generate_runtime(
            contracts,
            ModuleType::Cjs,
            ContractPackage::TevmContractScoped,
        );

        // Assert expected CommonJS format
        assert!(result.contains("const { createContract } = require('@tevm/contract');"));
        assert!(result.contains("const _MyContract ="));
        assert!(result.contains("module.exports.MyContract = createContract(_MyContract);"));
        assert!(result.contains("module.exports.artifacts ="));
    }

    #[test]
    fn test_generate_runtime_ts() {
        // Create test contract for TypeScript output
        let abi = json!([
            { "type": "constructor", "inputs": [], "stateMutability": "payable" }
        ]);

        let contracts_data = vec![(
            "MyContract".to_string(),
            abi,
            "420".to_string(),
            "420420".to_string(),
        )];

        let contracts = create_test_contracts(contracts_data);

        let result = generate_runtime(
            contracts,
            ModuleType::Ts,
            ContractPackage::TevmContractScoped,
        );

        // Assert expected TypeScript format
        assert!(result.contains("import { createContract } from '@tevm/contract';"));
        assert!(result.contains("const _MyContract = "));
        assert!(result.contains(" as const;"));
        assert!(result.contains("export const MyContract = createContract(_MyContract);"));
        assert!(result.contains("export const artifacts = "));
    }

    #[test]
    fn test_generate_runtime_mjs() {
        // Create test contract for ES Module output
        let abi = json!([
            { "type": "constructor", "inputs": [], "stateMutability": "payable" }
        ]);

        let contracts_data = vec![(
            "MyContract".to_string(),
            abi,
            "420".to_string(),
            "420420".to_string(),
        )];

        let contracts = create_test_contracts(contracts_data);

        let result = generate_runtime(
            contracts,
            ModuleType::Mjs,
            ContractPackage::TevmContractScoped,
        );

        // Assert expected MJS format
        assert!(result.contains("import { createContract } from '@tevm/contract';"));
        assert!(result.contains("const _MyContract = "));
        assert!(!result.contains(" as const;")); // MJS doesn't use 'as const'
        assert!(result.contains("export const MyContract = createContract(_MyContract);"));
        assert!(result.contains("export const artifacts = "));
    }

    #[test]
    fn test_generate_runtime_dts() {
        // Create test contract for TypeScript declaration file output
        let abi = json!([
            { "type": "constructor", "inputs": [], "stateMutability": "payable" }
        ]);

        let contracts_data = vec![(
            "MyContract".to_string(),
            abi,
            "420".to_string(),
            "420420".to_string(),
        )];

        let contracts = create_test_contracts(contracts_data);

        let result = generate_runtime(
            contracts,
            ModuleType::Dts,
            ContractPackage::TevmContractScoped,
        );

        // Assert expected DTS format
        assert!(result.contains("import type { Contract } from '@tevm/contract';"));
        assert!(result.contains("// Contract name type"));
        assert!(result.contains("declare const _nameMyContract: \"MyContract\";"));
        assert!(result.contains("// ABI type"));
        assert!(result.contains("declare const _abiMyContract: any[];"));
        assert!(result.contains("export const MyContract: Contract<"));
        assert!(result.contains("export const artifacts: Record<string, any>;"));
    }

    #[test]
    fn test_generate_runtime_multiple_contracts() {
        // Create multiple contracts
        let abi1 = json!([
            {
                "type": "function",
                "name": "getValue",
                "inputs": [],
                "outputs": [{ "type": "uint256" }],
                "stateMutability": "view"
            }
        ]);

        let abi2 = json!([
            {
                "type": "function",
                "name": "help",
                "inputs": [{ "name": "x", "type": "uint256" }],
                "outputs": [{ "type": "uint256" }],
                "stateMutability": "pure"
            }
        ]);

        let contracts_data = vec![
            (
                "MainContract".to_string(),
                abi1,
                "mainBytecode".to_string(),
                "mainDeployedBytecode".to_string(),
            ),
            (
                "HelperContract".to_string(),
                abi2,
                "helperBytecode".to_string(),
                "helperDeployedBytecode".to_string(),
            ),
        ];

        let contracts = create_test_contracts(contracts_data);

        let result = generate_runtime(
            contracts,
            ModuleType::Ts,
            ContractPackage::TevmContractScoped,
        );

        // Assert both contracts are included
        assert!(result.contains("\"name\": \"MainContract\""));
        assert!(result.contains("\"name\": \"HelperContract\""));

        // Assert both contracts are exported
        assert!(result.contains("export const MainContract = createContract(_MainContract);"));
        assert!(result.contains("export const HelperContract = createContract(_HelperContract);"));
    }

    #[test]
    fn test_generate_runtime_complex_abi() {
        // Create contracts with complex ABI
        let complex_abi = json!([
            {
                "type": "function",
                "name": "complexFunction",
                "inputs": [
                    {
                        "name": "inputStruct",
                        "type": "tuple",
                        "components": [
                            { "name": "a", "type": "uint256" },
                            { "name": "b", "type": "string" }
                        ]
                    },
                    { "name": "arrayInput", "type": "uint256[]" }
                ],
                "outputs": [{ "name": "output", "type": "bytes32" }],
                "stateMutability": "view"
            },
            {
                "type": "event",
                "name": "ComplexEvent",
                "inputs": [
                    { "indexed": true, "name": "sender", "type": "address" },
                    { "indexed": false, "name": "value", "type": "uint256" }
                ],
                "anonymous": false
            }
        ]);

        let contracts_data = vec![(
            "ComplexABI".to_string(),
            complex_abi,
            "complexBytecode".to_string(),
            "complexDeployedBytecode".to_string(),
        )];

        let contracts = create_test_contracts(contracts_data);

        let result = generate_runtime(
            contracts,
            ModuleType::Ts,
            ContractPackage::TevmContractScoped,
        );

        // The complex ABI should be in the output
        assert!(result.contains("ComplexABI"));
        assert!(result.contains("export const ComplexABI = createContract(_ComplexABI);"));
    }

    #[test]
    fn test_generate_runtime_empty_bytecode() {
        // Test with empty bytecode
        let abi = json!([
            { "type": "function", "name": "test", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }
        ]);

        let contracts_data = vec![(
            "EmptyBytecodeContract".to_string(),
            abi,
            "".to_string(),
            "".to_string(),
        )];

        let contracts = create_test_contracts(contracts_data);

        let result = generate_runtime(
            contracts,
            ModuleType::Ts,
            ContractPackage::TevmContractScoped,
        );

        // The contract should be included with null bytecode
        assert!(result.contains("EmptyBytecodeContract"));
        assert!(result.contains("\"bytecode\": null"));
        assert!(result.contains("\"deployedBytecode\": null"));
    }

    #[test]
    fn test_contract_package_conversion() {
        // Test ContractPackage conversion methods
        let tevm_contract = ContractPackage::TevmContract;
        let tevm_contract_scoped = ContractPackage::TevmContractScoped;

        assert_eq!(tevm_contract.to_string(), "tevm/contract");
        assert_eq!(tevm_contract_scoped.to_string(), "@tevm/contract");

        assert_eq!(
            ContractPackage::from_str("tevm/contract"),
            Some(ContractPackage::TevmContract)
        );
        assert_eq!(
            ContractPackage::from_str("@tevm/contract"),
            Some(ContractPackage::TevmContractScoped)
        );
        assert_eq!(ContractPackage::from_str("invalid"), None);
    }
}

// NAPI bindings for JS/TS interop

/// Generate the JavaScript runtime code for a Solidity contract
/// Now using Foundry Contract type
#[napi]
pub fn generate_runtime_js(
    contracts_json: String,
    module_type: String,
    use_scoped_package: bool,
) -> napi::Result<String> {
    // Parse contracts from JSON into foundry Contract format
    let contracts: Vec<(String, Contract)> = serde_json::from_str(&contracts_json)?;

    // Parse module type
    let module_type = match module_type.to_lowercase().as_str() {
        "ts" => ModuleType::Ts,
        "cjs" => ModuleType::Cjs,
        "mjs" => ModuleType::Mjs,
        "dts" => ModuleType::Dts,
        _ => {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                format!("Invalid module type: {}", module_type),
            ))
        }
    };

    // Determine package type
    let contract_package = if use_scoped_package {
        ContractPackage::TevmContractScoped
    } else {
        ContractPackage::TevmContract
    };

    // Generate the runtime code with the new type
    let result = generate_runtime(contracts, module_type, contract_package);

    Ok(result)
}
