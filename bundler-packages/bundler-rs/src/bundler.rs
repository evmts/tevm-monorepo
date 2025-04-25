use crate::artifacts::{extract_artifacts, extract_asts, generate_source_map};
use crate::cache::Cache;
use crate::config::{BundlerConfig, ContractPackage, ModuleType, RuntimeOptions, SolcOptions};
use crate::models::{BundleError, BundleResult, CompileResult, ModuleInfo};

use hex::encode;
use serde_json::{self, Value, json};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::fs;

// Mock implementation for tevm_resolutions_rs until it's properly available
mod tevm_resolutions_rs {
    use std::collections::HashMap;
    use std::path::{Path, PathBuf};
    use std::fs;
    
    // Configuration for module resolution
    pub struct Config {
        pub lib_paths: Option<Vec<String>>,
        pub remappings: Option<Vec<(String, String)>>,
        pub allow_missing: Option<bool>,
    }
    
    // Module information
    pub struct ModuleInfo {
        pub path: PathBuf,
        pub code: String,
        pub imported_ids: Vec<PathBuf>,
    }
    
    // Module factory for resolving imports
    pub mod module_factory {
        use super::*;
        
        /// Resolves imports for a Solidity file
        pub async fn module_factory(
            path: PathBuf,
            content: &str,
            config: Config,
        ) -> Result<HashMap<PathBuf, super::ModuleInfo>, String> {
            let mut modules = HashMap::new();
            
            // Add the main module
            modules.insert(path.clone(), super::ModuleInfo {
                path: path.clone(),
                code: content.to_string(),
                imported_ids: Vec::new(),  // No imports for now (simplified)
            });
            
            // Read the content to find imports
            for line in content.lines() {
                if line.trim().starts_with("import ") || line.trim().starts_with("import\"") {
                    // Simple import detection
                    let mut import_path = PathBuf::new();
                    
                    // Extract path from quotes
                    if let Some(start) = line.find('"') {
                        if let Some(end) = line[start+1..].find('"') {
                            let imported = &line[start+1..start+1+end];
                            
                            // Try to resolve through remappings
                            let mut resolved_path = None;
                            
                            if let Some(remappings) = &config.remappings {
                                for (from, to) in remappings {
                                    if imported.starts_with(from) {
                                        let resolved = imported.replace(from, to);
                                        import_path = PathBuf::from(&resolved);
                                        resolved_path = Some(import_path.clone());
                                        break;
                                    }
                                }
                            }
                            
                            // If no remapping, try relative
                            if resolved_path.is_none() {
                                let parent = path.parent().unwrap_or(Path::new(""));
                                import_path = parent.join(imported);
                            }
                            
                            // Check if file exists
                            if import_path.exists() {
                                // Read content
                                if let Ok(import_content) = fs::read_to_string(&import_path) {
                                    // Add imported module and record the dependency
                                    let module = super::ModuleInfo {
                                        path: import_path.clone(),
                                        code: import_content,
                                        imported_ids: Vec::new(),  // No nested imports for now
                                    };
                                    
                                    // Update the main module's imports
                                    if let Some(main_module) = modules.get_mut(&path) {
                                        main_module.imported_ids.push(import_path.clone());
                                    }
                                    
                                    modules.insert(import_path, module);
                                }
                            } else if config.allow_missing.unwrap_or(false) {
                                // Skip if allow_missing is true
                            } else {
                                return Err(format!("Import not found: {}", imported));
                            }
                        }
                    }
                }
            }
            
            Ok(modules)
        }
    }
}

// Mock implementation for tevm_runtime_rs
pub mod tevm_runtime_rs {
    use serde_json::Value;
    
    // Module types
    #[derive(Debug, Clone, Copy)]
    pub enum ModuleType {
        Ts,
        Cjs,
        Mjs,
        Dts,
    }
    
    // Contract package types
    #[derive(Debug, Clone, Copy)]
    pub enum ContractPackage {
        TevmContract,
        TevmContractScoped,
    }
    
    /// Generate JavaScript/TypeScript code from solc output
    pub fn generate_runtime(
        solc_output: &Value,
        module_type: ModuleType,
        contract_package: ContractPackage,
    ) -> String {
        // Extract contract data from solc output
        if let Some(contracts) = solc_output.get("contracts").and_then(|c| c.as_object()) {
            let mut code = String::new();
            
            // Add module header based on type
            match module_type {
                ModuleType::Ts => {
                    code.push_str("// TypeScript module\n");
                    let package_import = match contract_package {
                        ContractPackage::TevmContract => "@tevm/contract",
                        ContractPackage::TevmContractScoped => "tevm/contract",
                    };
                    code.push_str(&format!("import {{ Contract }} from '{}';\n\n", package_import));
                },
                ModuleType::Cjs => {
                    code.push_str("// CommonJS module\n");
                    let package_import = match contract_package {
                        ContractPackage::TevmContract => "@tevm/contract",
                        ContractPackage::TevmContractScoped => "tevm/contract",
                    };
                    code.push_str(&format!("const {{ Contract }} = require('{}');\n\n", package_import));
                },
                ModuleType::Mjs => {
                    code.push_str("// ES module\n");
                    let package_import = match contract_package {
                        ContractPackage::TevmContract => "@tevm/contract",
                        ContractPackage::TevmContractScoped => "tevm/contract",
                    };
                    code.push_str(&format!("import {{ Contract }} from '{}';\n\n", package_import));
                },
                ModuleType::Dts => {
                    code.push_str("// TypeScript declaration file\n");
                    let package_import = match contract_package {
                        ContractPackage::TevmContract => "@tevm/contract",
                        ContractPackage::TevmContractScoped => "tevm/contract",
                    };
                    code.push_str(&format!("import {{ Contract }} from '{}';\n\n", package_import));
                },
            }
            
            // Generate exports for each contract
            for (_file_path, file_contracts) in contracts {
                if let Some(file_contracts_obj) = file_contracts.as_object() {
                    for (contract_name, contract_data) in file_contracts_obj {
                        // Get contract ABI
                        let abi = match contract_data.get("abi") {
                            Some(abi) => serde_json::to_string(abi).unwrap_or_else(|_| "[]".to_string()),
                            None => "[]".to_string(),
                        };
                        
                        // Get bytecode
                        let bytecode = contract_data
                            .get("evm")
                            .and_then(|evm| evm.get("bytecode"))
                            .and_then(|bytecode| bytecode.get("object"))
                            .and_then(|obj| obj.as_str())
                            .unwrap_or("");
                        
                        // Generate contract export
                        match module_type {
                            ModuleType::Ts | ModuleType::Mjs => {
                                code.push_str(&format!("export const {} = new Contract({}, '{}');\n", 
                                    contract_name, abi, bytecode));
                            },
                            ModuleType::Cjs => {
                                code.push_str(&format!("exports.{} = new Contract({}, '{}');\n", 
                                    contract_name, abi, bytecode));
                            },
                            ModuleType::Dts => {
                                code.push_str(&format!("export declare const {}: Contract;\n", 
                                    contract_name));
                            },
                        }
                    }
                }
            }
            
            return code;
        }
        
        // Fallback for empty output
        return "// No contracts found".to_string();
    }
}

/// Main bundler struct that coordinates the bundling process
pub struct Bundler {
    /// Configuration for the bundler
    config: BundlerConfig,

    /// Cache for compilation results
    cache: Option<Cache>,

    /// Solidity compiler instance
    solc: Value,  // Using Value as a placeholder since we don't have the actual type
}

impl Bundler {
    /// Create a new bundler instance
    pub async fn new(config: BundlerConfig) -> Result<Self, BundleError> {
        // Initialize solc compiler (using a mock for now)
        let solc_path = config
            .solc_path
            .clone()
            .unwrap_or_else(|| PathBuf::from("solc"));
        let solc_version = config
            .solc_version
            .clone()
            .unwrap_or_else(|| "0.8.20".to_string());

        // Create a mock solc instance
        let solc = json!({
            "path": solc_path,
            "version": solc_version
        });

        // Initialize cache if enabled
        let cache = if config.use_cache {
            let root_dir =
                PathBuf::from(std::env::current_dir().unwrap_or_else(|_| PathBuf::from(".")));

            Some(Cache::new(config.cache_dir.clone(), root_dir, true))
        } else {
            None
        };

        Ok(Self {
            config,
            cache,
            solc,
        })
    }

    /// Add Clone implementation for Bundler
    pub fn clone(&self) -> Self {
        Self {
            config: self.config.clone(),
            cache: self.cache.clone(),
            solc: self.solc.clone(),
        }
    }

    /// Unified method to resolve a Solidity file to any module type
    pub async fn resolve_file(
        &self,
        file_path: &str,
        base_dir: &str,
        module_type: ModuleType,
        solc_options: SolcOptions,
    ) -> Result<BundleResult, BundleError> {
        let runtime_options = RuntimeOptions {
            module_type,
            contract_package: ContractPackage::TevmContract,
        };

        self.resolve_module(file_path, base_dir, solc_options, runtime_options).await
    }

    /// Hash solc options for cache lookups
    fn hash_solc_options(&self, solc_options: &SolcOptions) -> String {
        let json = serde_json::to_string(solc_options).unwrap_or_default();
        let mut hasher = Sha256::new();
        hasher.update(json.as_bytes());
        let hash = hasher.finalize();
        encode(hash)
    }

    /// Read a file using standard filesystem APIs
    async fn read_file(&self, path: &Path) -> Result<String, BundleError> {
        let path_clone = path.to_path_buf();
        tokio::task::spawn_blocking(move || {
            fs::read_to_string(&path_clone).map_err(|e| BundleError {
                message: format!("Failed to read file: {}", e),
                path: Some(path_clone.clone()),
            })
        })
        .await
        .map_err(|e| BundleError {
            message: format!("Task error: {}", e),
            path: Some(path.to_path_buf()),
        })?
    }

    /// Check if a file exists using standard filesystem APIs
    async fn file_exists(&self, path: &Path) -> bool {
        let path_clone = path.to_path_buf();
        tokio::task::spawn_blocking(move || {
            path_clone.exists()
        })
        .await
        .unwrap_or(false)
    }

    /// Compile a Solidity file to artifacts
    pub async fn compile_artifacts(
        &self,
        file_path: &str,
        base_dir: &str,
        solc_options: SolcOptions,
    ) -> Result<CompileResult, BundleError> {
        // Create hash of solc options for caching
        let solc_options_hash = self.hash_solc_options(&solc_options);

        // Try to get from cache
        if let Some(ref cache) = self.cache {
            if let Some(result) = cache.get_compile(file_path, &solc_options_hash).await {
                return Ok(result);
            }
        }

        // Read the Solidity file
        let full_path = PathBuf::from(base_dir).join(file_path);
        let code = self.read_file(&full_path).await?;

        // Prepare remappings and library paths for resolution
        let remappings = self.config.remappings.clone();
        let libs = self.config.libs.clone();
        
        // Create the configuration for module resolution
        let config = tevm_resolutions_rs::Config {
            lib_paths: Some(libs),
            remappings: Some(remappings),
            allow_missing: Some(false),
        };

        // Use module factory to resolve imports
        let module_map = match tevm_resolutions_rs::module_factory::module_factory(
            full_path.clone(),
            &code,
            config,
        ).await {
            Ok(map) => map,
            Err(e) => {
                return Err(BundleError {
                    message: format!("Failed to resolve imports: {}", e),
                    path: Some(full_path),
                });
            }
        };

        // Create solc input description
        let mut sources = HashMap::new();
        for (path, module_info) in &module_map {
            sources.insert(
                path.to_string_lossy().to_string(),
                json!({
                    "content": module_info.code,
                }),
            );
        }

        // Configure solc settings
        let mut output_selection = HashMap::new();
        let mut contract_outputs = Vec::new();
        
        // Always include ABI
        contract_outputs.push("abi");

        if solc_options.include_bytecode {
            contract_outputs.push("bytecode");
            contract_outputs.push("deployedBytecode");
        }

        if solc_options.include_user_docs {
            contract_outputs.push("userdoc");
        }

        if solc_options.include_dev_docs {
            contract_outputs.push("devdoc");
        }

        // Add outputs for contracts
        let mut contract_map = HashMap::new();
        contract_map.insert("*".to_string(), contract_outputs);
        output_selection.insert("*".to_string(), contract_map);

        // Create remapping strings
        let remappings_strings: Vec<String> = self.config.remappings.iter()
            .map(|(from, to)| format!("{}={}", from, to))
            .collect();

        // Create solc input with settings
        let solc_input = json!({
            "language": "Solidity",
            "sources": sources,
            "settings": {
                "optimizer": {
                    "enabled": solc_options.optimize,
                    "runs": solc_options.optimizer_runs.unwrap_or(200)
                },
                "outputSelection": output_selection,
                "remappings": remappings_strings,
                "evmVersion": solc_options.evm_version,
            }
        });

        // Mock compilation - would use solc_compile in a real implementation
        // Here we create a simple mock output with contract definition
        let mut contracts = HashMap::new();
        let main_source_path = full_path.to_string_lossy().to_string();
        
        // Extract contract name from file path
        let file_name = full_path.file_name()
            .and_then(|f| f.to_str())
            .unwrap_or("Contract");
        
        let contract_name = if file_name.ends_with(".sol") {
            file_name[0..file_name.len()-4].to_string()
        } else {
            file_name.to_string()
        };
        
        // Create a mock contract output
        let contract_output = json!({
            "abi": [
                {
                    "type": "constructor",
                    "inputs": [],
                    "stateMutability": "nonpayable"
                },
                {
                    "type": "function",
                    "name": "value",
                    "inputs": [],
                    "outputs": [{"type": "uint256", "name": ""}],
                    "stateMutability": "view"
                },
                {
                    "type": "function",
                    "name": "setValue",
                    "inputs": [{"type": "uint256", "name": "_value"}],
                    "outputs": [],
                    "stateMutability": "nonpayable"
                }
            ],
            "evm": {
                "bytecode": {
                    "object": "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80633fa4f2451461003b578063552410771461005a575b600080fd5b610043610076565b6040516100519291906100f4565b60405180910390f35b610074600480360381019061006f91906100b8565b61007f565b005b60008054905090565b8060008190555050565b600080fd5b6000819050919050565b61009581610082565b81146100a057600080fd5b50565b6000813590506100b28161008c565b92915050565b6000602082840312156100ce576100cd61007d565b5b60006100dc848285016100a3565b91505092915050565b6100ee81610082565b82525050565b600060208201905061010960008301846100e5565b9291505056fea2646970667358221220d9ec31f6a034a2bb7578d3ad41ba391c5db2dde4a5ff8daac5cfa443c268b38064736f6c63430008170033"
                },
                "deployedBytecode": {
                    "object": "0x608060405234801561001057600080fd5b50600436106100365760003560e01c80633fa4f2451461003b578063552410771461005a575b600080fd5b610043610076565b6040516100519291906100f4565b60405180910390f35b610074600480360381019061006f91906100b8565b61007f565b005b60008054905090565b8060008190555050565b600080fd5b6000819050919050565b61009581610082565b81146100a057600080fd5b50565b6000813590506100b28161008c565b92915050565b6000602082840312156100ce576100cd61007d565b5b60006100dc848285016100a3565b91505092915050565b6100ee81610082565b82525050565b600060208201905061010960008301846100e5565b9291505056fea2646970667358221220d9ec31f6a034a2bb7578d3ad41ba391c5db2dde4a5ff8daac5cfa443c268b38064736f6c63430008170033"
                }
            },
            "metadata": "...",  // Simplified
            "userdoc": {
                "methods": {
                    "value()": "Get the current value",
                    "setValue(uint256)": "Set a new value"
                }
            },
            "devdoc": {
                "methods": {
                    "value()": "Returns the current stored value",
                    "setValue(uint256)": "Updates the stored value"
                }
            }
        });
        
        // Add the contract to the file entry
        let mut file_contracts = HashMap::new();
        file_contracts.insert(contract_name, contract_output);
        
        // Convert HashMap to serde_json::Map for Value::Object
        let file_contracts_map = serde_json::Map::from_iter(file_contracts.into_iter());
        
        // Add the file to the contracts map
        contracts.insert(main_source_path, Value::Object(file_contracts_map));
        
        // Create the complete solc output
        let solc_output = json!({
            "contracts": contracts,
            "sources": {
                // Sources info would be here
            },
            "errors": []
        });

        // Convert module map to ModuleInfo for the result
        let modules: HashMap<String, ModuleInfo> = module_map
            .into_iter()
            .map(|(path, module_info)| {
                (
                    path.to_string_lossy().to_string(),
                    ModuleInfo {
                        id: path.to_string_lossy().to_string(),
                        code: module_info.code.clone(),
                        raw_code: module_info.code.clone(),
                        imported_modules: module_info.imported_ids.iter()
                            .map(|p| p.to_string_lossy().to_string())
                            .collect(),
                    },
                )
            })
            .collect();

        // Extract artifacts from solc output
        let artifacts = extract_artifacts(&solc_output).await?;

        // Extract ASTs if requested
        let asts = if solc_options.include_ast {
            Some(extract_asts(&solc_output).await?)
        } else {
            None
        };

        // Create compile result
        let result = CompileResult {
            modules,
            solc_input: solc_input,
            solc_output: solc_output,
            artifacts,
            asts,
        };

        // Cache the result
        if let Some(ref cache) = self.cache {
            cache
                .set_compile(file_path, &solc_options_hash, result.clone())
                .await;
        }

        Ok(result)
    }

    /// Resolve a Solidity file to a module
    async fn resolve_module(
        &self,
        file_path: &str,
        base_dir: &str,
        solc_options: SolcOptions,
        runtime_options: RuntimeOptions,
    ) -> Result<BundleResult, BundleError> {
        // Get the module type string for caching
        let module_type_str = match runtime_options.module_type {
            ModuleType::Ts => "ts",
            ModuleType::Cjs => "cjs",
            ModuleType::Mjs => "mjs",
            ModuleType::Dts => "dts",
        };

        // Create hash of solc options for caching
        let solc_options_hash = self.hash_solc_options(&solc_options);

        // Try to get from cache
        if let Some(ref cache) = self.cache {
            if let Some(result) = cache
                .get_bundle(file_path, module_type_str, &solc_options_hash)
                .await
            {
                return Ok(result);
            }
        }

        // Compile artifacts first
        let compile_result = self
            .compile_artifacts(file_path, base_dir, solc_options.clone())
            .await?;

        // Convert the module type to runtime-rs format
        let runtime_module_type = match runtime_options.module_type {
            ModuleType::Ts => tevm_runtime_rs::ModuleType::Ts,
            ModuleType::Cjs => tevm_runtime_rs::ModuleType::Cjs,
            ModuleType::Mjs => tevm_runtime_rs::ModuleType::Mjs,
            ModuleType::Dts => tevm_runtime_rs::ModuleType::Dts,
        };

        // Convert contract package to runtime-rs format
        let runtime_contract_package = match runtime_options.contract_package {
            ContractPackage::TevmContract => tevm_runtime_rs::ContractPackage::TevmContract,
            ContractPackage::TevmContractScoped => tevm_runtime_rs::ContractPackage::TevmContractScoped,
        };

        // Generate code using our mock runtime generator
        let code = tevm_runtime_rs::generate_runtime(
            &compile_result.solc_output,
            runtime_module_type,
            runtime_contract_package,
        );

        // Generate source map if requested
        let source_map = if solc_options.include_source_map {
            Some(generate_source_map(&compile_result).await?)
        } else {
            None
        };

        // Extract modules map (simplified form for the result)
        let modules = compile_result
            .modules
            .iter()
            .map(|(path, module)| (path.clone(), module.code.clone()))
            .collect();

        // Create the bundle result
        let result = BundleResult {
            code,
            source_map,
            modules,
            solc_input: Some(compile_result.solc_input),
            solc_output: Some(compile_result.solc_output),
            asts: compile_result.asts,
        };

        // Cache the result
        if let Some(ref cache) = self.cache {
            cache
                .set_bundle(file_path, module_type_str, &solc_options_hash, result.clone())
                .await;
        }

        Ok(result)
    }

    // Legacy methods that use the unified method internally

    /// Resolve a Solidity file to a TypeScript module
    pub async fn resolve_ts_module(
        &self,
        file_path: &str,
        base_dir: &str,
        solc_options: SolcOptions,
    ) -> Result<BundleResult, BundleError> {
        self.resolve_file(file_path, base_dir, ModuleType::Ts, solc_options)
            .await
    }

    /// Resolve a Solidity file to a CommonJS module
    pub async fn resolve_cjs_module(
        &self,
        file_path: &str,
        base_dir: &str,
        solc_options: SolcOptions,
    ) -> Result<BundleResult, BundleError> {
        self.resolve_file(file_path, base_dir, ModuleType::Cjs, solc_options)
            .await
    }

    /// Resolve a Solidity file to an ES module
    pub async fn resolve_esm_module(
        &self,
        file_path: &str,
        base_dir: &str,
        solc_options: SolcOptions,
    ) -> Result<BundleResult, BundleError> {
        self.resolve_file(file_path, base_dir, ModuleType::Mjs, solc_options)
            .await
    }

    /// Resolve a Solidity file to a TypeScript declaration file
    pub async fn resolve_dts(
        &self,
        file_path: &str,
        base_dir: &str,
        solc_options: SolcOptions,
    ) -> Result<BundleResult, BundleError> {
        self.resolve_file(file_path, base_dir, ModuleType::Dts, solc_options)
            .await
    }
}