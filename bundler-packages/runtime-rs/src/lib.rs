use alloy_primitives::Bytes;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use strum::EnumString;
use strum_macros::Display;
use tevm_solc_rs::SolcOutput;

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

    #[allow(dead_code)]
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
    // This would need proper implementation to format the ABI
    // For demonstration, we'll just convert the ABI items to strings
    match abi.as_array() {
        Some(items) => items.iter().map(|item| item.to_string()).collect(),
        None => vec![],
    }
}

/// Generates runtime code for Tevm contracts
pub fn generate_runtime(
    solc_output: &SolcOutput,
    module_type: ModuleType,
    contract_package: ContractPackage,
) -> String {
    let package = contract_package.to_string();

    // Prepare contract data from solc output
    let mut contracts = HashMap::new();
    if let Some(contract_files) = &solc_output.contracts {
        for (_file, file_contracts) in contract_files {
            for (name, contract) in file_contracts {
                // Convert SolcContractOutput to TevmContract
                let tevm_contract = TevmContract {
                    bytecode: if !contract.evm.bytecode.object.is_empty() {
                        Some(
                            format!("0x{}", contract.evm.bytecode.object)
                                .parse()
                                .unwrap_or_default(),
                        )
                    } else {
                        None
                    },
                    deployed_bytecode: if !contract.evm.deployed_bytecode.object.is_empty() {
                        Some(
                            format!("0x{}", contract.evm.deployed_bytecode.object)
                                .parse()
                                .unwrap_or_default(),
                        )
                    } else {
                        None
                    },
                    name: name.clone(),
                    human_readable_abi: format_abi(&contract.abi),
                };
                contracts.insert(name.clone(), tevm_contract);
            }
        }
    }

    // If we have no contracts, return early
    if contracts.is_empty() {
        return "// No contracts found in the solc output".to_string();
    }

    // Create a JSON string version of all contracts
    let contracts_json = serde_json::to_string_pretty(&contracts).unwrap_or_default();

    // Generate code based on module type
    match module_type {
        ModuleType::Cjs => {
            let mut output = format!("const {{ createContract }} = require('{}');\n\n", package);

            for (name, contract) in &contracts {
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

            for (name, contract) in &contracts {
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

            for (name, contract) in &contracts {
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

            for (name, _) in &contracts {
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

