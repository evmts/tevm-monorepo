// Type definitions for solc input/output
// Based on the Solidity documentation at https://docs.soliditylang.org/en/v0.8.20/using-the-compiler.html

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub type HexString = String;

// Language options for solc
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "PascalCase")]
pub enum SolcLanguage {
    Solidity,
    Yul,
    SolidityAST,
}

// Definition for a source file
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcInputSource {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub keccak256: Option<HexString>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub urls: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,
}

// Map of file names to source content
pub type SolcInputSources = HashMap<String, SolcInputSource>;

// Remapping format
pub type SolcRemapping = Vec<String>;

// Yul optimizer settings
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcYulDetails {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stack_allocation: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub optimizer_steps: Option<String>,
}

// Optimizer details configuration
#[derive(Debug, Default, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcOptimizerDetails {
    pub peephole: Option<bool>,
    pub inliner: Option<bool>,
    pub jumpdest_remover: Option<bool>,
    pub order_literals: Option<bool>,
    pub deduplicate: Option<bool>,
    pub cse: Option<bool>,
    pub constant_optimizer: Option<bool>,
    pub yul: Option<bool>,
    pub yul_details: Option<SolcYulDetails>,
}

// Optimizer configuration
#[derive(Debug, Default, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcOptimizer {
    pub enabled: Option<bool>,
    pub runs: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<SolcOptimizerDetails>,
}

// Output selection for compiler
pub type SolcOutputSelection = HashMap<String, HashMap<String, Vec<String>>>;

// Model checker contracts configuration
pub type SolcModelCheckerContracts = HashMap<String, Vec<String>>;

// Model checker configuration
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcModelChecker {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub contracts: Option<SolcModelCheckerContracts>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub div_mod_no_slacks: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub engine: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ext_calls: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invariants: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub show_proved: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub show_unproved: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub show_unsupported: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub solvers: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub targets: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timeout: Option<u32>,
}

// Debug settings configuration
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcDebugSettings {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub revert_strings: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub debug_info: Option<Vec<String>>,
}

// Metadata settings configuration
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcMetadataSettings {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub append_cbor: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub use_literal_content: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bytecode_hash: Option<String>,
}

// Compiler settings configuration
#[derive(Debug, Default, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcSettings {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop_after: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub remappings: Option<SolcRemapping>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub optimizer: Option<SolcOptimizer>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub evm_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub via_ir: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub debug: Option<SolcDebugSettings>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<SolcMetadataSettings>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub libraries: Option<HashMap<String, HashMap<String, String>>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub output_selection: Option<SolcOutputSelection>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model_checker: Option<SolcModelChecker>,
}

// Main input description for solc compiler
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcInputDescription {
    pub language: SolcLanguage,
    pub sources: SolcInputSources,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub settings: Option<SolcSettings>,
}

// Error entry in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcErrorEntry {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_location: Option<SolcSourceLocation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub secondary_source_locations: Option<Vec<SolcSecondarySourceLocation>>,
    #[serde(rename = "type")]
    pub error_type: String,
    pub component: String,
    pub severity: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error_code: Option<String>,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub formatted_message: Option<String>,
}

// Source location in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcSourceLocation {
    pub file: String,
    pub start: u32,
    pub end: u32,
}

// Secondary source location in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcSecondarySourceLocation {
    pub file: String,
    pub start: u32,
    pub end: u32,
    pub message: String,
}

// Source entry in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcSourceEntry {
    pub id: u32,
    pub ast: serde_json::Value,
}

// Contract output in solc result
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcContractOutput {
    pub abi: serde_json::Value,
    pub metadata: String,
    pub userdoc: serde_json::Value,
    pub devdoc: serde_json::Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ir: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub storage_layout: Option<SolcStorageLayout>,
    pub evm: SolcEVMOutput,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ewasm: Option<SolcEwasmOutput>,
}

// Storage layout in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcStorageLayout {
    pub storage: Vec<SolcStorageLayoutItem>,
    pub types: HashMap<String, serde_json::Value>,
}

// Storage layout item in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcStorageLayoutItem {
    pub ast_id: u32,
    pub contract: String,
    pub label: String,
    pub offset: u32,
    pub slot: String,
    #[serde(rename = "type")]
    pub type_name: String,
}

// EVM output in solc result
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcEVMOutput {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub assembly: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub legacy_assembly: Option<serde_json::Value>,
    pub bytecode: SolcBytecodeOutput,
    pub deployed_bytecode: SolcDeployedBytecodeOutput,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub method_identifiers: Option<HashMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gas_estimates: Option<SolcGasEstimates>,
}

// Bytecode output in solc result
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcBytecodeOutput {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub function_debug_data: Option<HashMap<String, SolcFunctionDebugData>>,
    pub object: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub opcodes: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_map: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub generated_sources: Option<Vec<SolcGeneratedSource>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub link_references: Option<HashMap<String, HashMap<String, Vec<SolcLinkReference>>>>,
}

// Deployed bytecode output in solc result
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcDeployedBytecodeOutput {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub function_debug_data: Option<HashMap<String, SolcFunctionDebugData>>,
    pub object: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub opcodes: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_map: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub generated_sources: Option<Vec<SolcGeneratedSource>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub link_references: Option<HashMap<String, HashMap<String, Vec<SolcLinkReference>>>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub immutable_references: Option<HashMap<String, Vec<SolcImmutableReference>>>,
}

// Link reference in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcLinkReference {
    pub start: u32,
    pub length: u32,
}

// Immutable reference in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcImmutableReference {
    pub start: u32,
    pub length: u32,
}

// Function debug data in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcFunctionDebugData {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entry_point: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameter_slots: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub return_slots: Option<u32>,
}

// Generated source in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcGeneratedSource {
    pub ast: serde_json::Value,
    pub contents: String,
    pub id: u32,
    pub language: String,
    pub name: String,
}

// Gas estimates in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcGasEstimates {
    pub creation: SolcGasEstimatesCreation,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub external: Option<HashMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub internal: Option<HashMap<String, String>>,
}

// Gas estimates creation data in solc output
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcGasEstimatesCreation {
    pub code_deposit_cost: String,
    pub execution_cost: String,
    pub total_cost: String,
}

// Ewasm output in solc result
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcEwasmOutput {
    pub wast: String,
    pub wasm: String,
}

// Complete output from solc
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SolcOutput {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub errors: Option<Vec<SolcErrorEntry>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sources: Option<HashMap<String, SolcSourceEntry>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub contracts: Option<HashMap<String, HashMap<String, SolcContractOutput>>>,
}

// Solidity version identifiers
pub type SolcVersions = String;

// Map of version identifiers to release filenames
pub type Releases = HashMap<String, String>;

// Generate the releases map
lazy_static::lazy_static! {
    pub static ref RELEASES: Releases = {
        let mut releases = HashMap::new();
        releases.insert("0.8.29".to_string(), "v0.8.29+commit.ab55807c.js".to_string());
        releases.insert("0.8.28".to_string(), "v0.8.28+commit.c33e5a8c.js".to_string());
        releases.insert("0.8.27".to_string(), "v0.8.27+commit.4a35a09.js".to_string());
        releases.insert("0.8.26".to_string(), "v0.8.26+commit.8a97fa7a.js".to_string());
        releases.insert("0.8.25".to_string(), "v0.8.25+commit.b61c2a91.js".to_string());
        releases.insert("0.8.24".to_string(), "v0.8.24+commit.e11b9ed9.js".to_string());
        releases.insert("0.8.23".to_string(), "v0.8.23+commit.f704f362".to_string());
        releases.insert("0.8.22".to_string(), "v0.8.22+commit.4fc1097e".to_string());
        releases.insert("0.8.21".to_string(), "v0.8.21+commit.d9974bed".to_string());
        releases.insert("0.8.20".to_string(), "v0.8.20+commit.a1b79de6".to_string());
        releases.insert("0.8.19".to_string(), "v0.8.19+commit.7dd6d404".to_string());
        releases.insert("0.8.18".to_string(), "v0.8.18+commit.87f61d96".to_string());
        releases.insert("0.8.17".to_string(), "v0.8.17+commit.8df45f5f".to_string());
        releases.insert("0.8.16".to_string(), "v0.8.16+commit.07a7930e".to_string());
        releases.insert("0.8.15".to_string(), "v0.8.15+commit.e14f2714".to_string());
        releases.insert("0.8.14".to_string(), "v0.8.14+commit.80d49f37".to_string());
        releases.insert("0.8.13".to_string(), "v0.8.13+commit.abaa5c0e".to_string());
        releases.insert("0.8.12".to_string(), "v0.8.12+commit.f00d7308".to_string());
        releases.insert("0.8.11".to_string(), "v0.8.11+commit.d7f03943".to_string());
        releases.insert("0.8.10".to_string(), "v0.8.10+commit.fc410830".to_string());
        releases.insert("0.8.9".to_string(), "v0.8.9+commit.e5eed63a".to_string());
        releases.insert("0.8.8".to_string(), "v0.8.8+commit.dddeac2f".to_string());
        releases.insert("0.8.7".to_string(), "v0.8.7+commit.e28d00a7".to_string());
        releases.insert("0.8.6".to_string(), "v0.8.6+commit.11564f7e".to_string());
        releases.insert("0.8.5".to_string(), "v0.8.5+commit.a4f2e591".to_string());
        releases.insert("0.8.4".to_string(), "v0.8.4+commit.c7e474f2".to_string());
        releases.insert("0.8.3".to_string(), "v0.8.3+commit.8d00100c".to_string());
        releases.insert("0.8.2".to_string(), "v0.8.2+commit.661d1103".to_string());
        releases.insert("0.8.1".to_string(), "v0.8.1+commit.df193b15".to_string());
        releases.insert("0.8.0".to_string(), "v0.8.0+commit.c7dfd78e".to_string());
        releases.insert("0.7.6".to_string(), "v0.7.6+commit.7338295f".to_string());
        releases.insert("0.7.5".to_string(), "v0.7.5+commit.eb77ed08".to_string());
        releases.insert("0.7.4".to_string(), "v0.7.4+commit.3f05b770".to_string());
        releases.insert("0.7.3".to_string(), "v0.7.3+commit.9bfce1f6".to_string());
        releases.insert("0.7.2".to_string(), "v0.7.2+commit.51b20bc0".to_string());
        releases.insert("0.7.1".to_string(), "v0.7.1+commit.f4a555be".to_string());
        releases.insert("0.7.0".to_string(), "v0.7.0+commit.9e61f92b".to_string());
        releases.insert("0.6.12".to_string(), "v0.6.12+commit.27d51765".to_string());
        // Add more versions as needed
        releases
    };
}