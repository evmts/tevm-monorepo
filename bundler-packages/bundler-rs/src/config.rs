use std::path::PathBuf;

/// Main configuration for the bundler
pub struct BundlerConfig {
    /// Solidity import remappings (from -> to pairs)
    pub remappings: Vec<(String, String)>,
    
    /// Additional library lookup paths
    pub libs: Vec<String>,
    
    /// Path to solc binary (if not specified, will use embedded solc)
    pub solc_path: Option<PathBuf>,
    
    /// Solidity compiler version to use
    pub solc_version: Option<String>,
    
    /// Directory for caching compiled artifacts
    pub cache_dir: Option<PathBuf>,
    
    /// Whether to use caching
    pub use_cache: bool,
    
    /// Enable debug logging
    pub debug: bool,
    
    /// Contract package name for imports in generated code
    /// '@tevm/contract' or 'tevm/contract'
    pub contract_package: String,
}

impl Default for BundlerConfig {
    fn default() -> Self {
        Self {
            remappings: Vec::new(),
            libs: Vec::new(),
            solc_path: None,
            solc_version: None,
            cache_dir: None,
            use_cache: true,
            debug: false,
            contract_package: "@tevm/contract".to_string(),
        }
    }
}

/// Solidity compiler options
pub struct SolcOptions {
    /// Enable optimization
    pub optimize: bool,
    
    /// Number of optimization runs
    pub optimizer_runs: Option<u32>,
    
    /// EVM version to target
    pub evm_version: Option<String>,
    
    /// Include AST in output
    pub include_ast: bool,
    
    /// Include bytecode in output
    pub include_bytecode: bool,
    
    /// Include source map in output
    pub include_source_map: bool,
    
    /// Include user documentation
    pub include_user_docs: bool,
    
    /// Include developer documentation
    pub include_dev_docs: bool,
}

impl Default for SolcOptions {
    fn default() -> Self {
        Self {
            optimize: true,
            optimizer_runs: Some(200),
            evm_version: None,
            include_ast: false,
            include_bytecode: true,
            include_source_map: false,
            include_user_docs: true,
            include_dev_docs: false,
        }
    }
}

/// Options for code generation
pub struct RuntimeOptions {
    /// Output module type
    pub module_type: ModuleType,
    
    /// Contract package import style
    pub contract_package: ContractPackage,
}

impl Default for RuntimeOptions {
    fn default() -> Self {
        Self {
            module_type: ModuleType::Ts,
            contract_package: ContractPackage::TevmContract,
        }
    }
}

/// Output module type
pub enum ModuleType {
    /// TypeScript (.ts)
    Ts,
    /// CommonJS (.cjs)
    Cjs,
    /// ES Modules (.mjs)
    Mjs,
    /// TypeScript Declaration (.d.ts)
    Dts,
}

impl From<&str> for ModuleType {
    fn from(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "ts" => ModuleType::Ts,
            "cjs" => ModuleType::Cjs,
            "mjs" => ModuleType::Mjs,
            "dts" => ModuleType::Dts,
            _ => ModuleType::Ts,
        }
    }
}

/// Contract package import style
pub enum ContractPackage {
    /// Import from '@tevm/contract'
    TevmContract,
    
    /// Import from 'tevm/contract'
    TevmContractScoped,
}

impl From<&str> for ContractPackage {
    fn from(s: &str) -> Self {
        match s {
            "tevm/contract" => ContractPackage::TevmContractScoped,
            _ => ContractPackage::TevmContract,
        }
    }
}