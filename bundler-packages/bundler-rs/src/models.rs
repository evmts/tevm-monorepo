use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;

/// Error type for bundling operations
#[derive(Debug)]
pub struct BundleError {
    /// Error message
    pub message: String,
    
    /// Path to the file that caused the error (if applicable)
    pub path: Option<PathBuf>,
}

impl std::fmt::Display for BundleError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match &self.path {
            Some(path) => write!(f, "{} (in {})", self.message, path.display()),
            None => write!(f, "{}", self.message),
        }
    }
}

impl std::error::Error for BundleError {}

/// Result type for bundling operations
#[derive(Debug, Serialize, Deserialize)]
pub struct BundleResult {
    /// Generated code (JavaScript/TypeScript)
    pub code: String,
    
    /// Optional source map
    pub source_map: Option<String>,
    
    /// Map of module paths to their content
    pub modules: HashMap<String, String>,
    
    /// Solidity compiler input
    #[serde(skip_serializing_if = "Option::is_none")]
    pub solc_input: Option<serde_json::Value>,
    
    /// Solidity compiler output
    #[serde(skip_serializing_if = "Option::is_none")]
    pub solc_output: Option<serde_json::Value>,
    
    /// Abstract Syntax Trees (if requested)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub asts: Option<HashMap<String, serde_json::Value>>,
}

/// Result of compilation operation
#[derive(Debug, Serialize, Deserialize)]
pub struct CompileResult {
    /// Module information
    pub modules: HashMap<String, ModuleInfo>,
    
    /// Solidity compiler input
    pub solc_input: serde_json::Value,
    
    /// Solidity compiler output
    pub solc_output: serde_json::Value,
    
    /// Contract artifacts
    pub artifacts: HashMap<String, ContractArtifact>,
    
    /// Abstract Syntax Trees (if requested)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub asts: Option<HashMap<String, serde_json::Value>>,
}

/// Information about a processed module
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModuleInfo {
    /// Module identifier (typically its path)
    pub id: String,
    
    /// Processed code (may include modifications)
    pub code: String,
    
    /// Original raw code
    pub raw_code: String,
    
    /// Identifiers of imported modules
    pub imported_modules: Vec<String>,
}

/// Artifacts for a compiled contract
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContractArtifact {
    /// Contract ABI (Application Binary Interface)
    pub abi: serde_json::Value,
    
    /// Contract bytecode (for deployment)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bytecode: Option<String>,
    
    /// Deployed bytecode (after constructor runs)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub deployed_bytecode: Option<String>,
    
    /// User documentation
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_doc: Option<serde_json::Value>,
    
    /// Developer documentation
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dev_doc: Option<serde_json::Value>,
}