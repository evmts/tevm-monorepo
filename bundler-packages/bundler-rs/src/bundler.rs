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

// Import proper packages for Rust implementation
use tevm_resolutions_rs::{self, Config as ResolutionsConfig, module_factory};
use tevm_runtime_rs::{self, ModuleType as RuntimeModuleType, ContractPackage as RuntimeContractPackage};
use tevm_solc_rs::{self, SolcOutput, SolcInputDescription, models::{SolcLanguage, SolcInputSource, SolcSettings, SolcOptimizer, SolcOutputSelection}};

// Import foundry-compilers for solc version management
use foundry_compilers::{Solc, artifacts::output::CompilerOutput};
use semver::Version;

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
    /// Note: This method is currently not used but kept for future needs
    #[allow(dead_code)]
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

        // Prepare remappings for resolution
        let remappings = self.config.remappings.clone();
        
        // Create the configuration for module resolution using real ResolutionsConfig
        let config = ResolutionsConfig::from((
            // Optional library paths
            None as Option<Vec<String>>, 
            // Remappings
            Some(remappings.clone()),
        ));

        // Use the real module_factory from tevm_resolutions_rs
        let module_map = match module_factory::module_factory(
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

        // Create solc input description using proper types from tevm_solc_rs
        let mut sources = HashMap::new();
        for (path, module_info) in &module_map {
            sources.insert(
                path.to_string_lossy().to_string(),
                SolcInputSource {
                    content: module_info.code.clone(),
                },
            );
        }

        // Configure solc settings
        let mut output_selection = HashMap::new();
        let mut contract_outputs = Vec::new();
        
        // Always include ABI
        contract_outputs.push("abi".to_string());

        if solc_options.include_bytecode {
            contract_outputs.push("bytecode".to_string());
            contract_outputs.push("deployedBytecode".to_string());
        }

        if solc_options.include_user_docs {
            contract_outputs.push("userdoc".to_string());
        }

        if solc_options.include_dev_docs {
            contract_outputs.push("devdoc".to_string());
        }

        // Add outputs for contracts
        let mut contract_map = HashMap::new();
        contract_map.insert("*".to_string(), contract_outputs);
        output_selection.insert("*".to_string(), contract_map);

        // Create remapping strings
        let remappings_strings: Vec<String> = self.config.remappings.iter()
            .map(|(from, to)| format!("{}={}", from, to))
            .collect();

        // Create solc input with proper types from tevm_solc_rs
        let solc_input = SolcInputDescription {
            language: SolcLanguage::Solidity,
            sources,
            settings: SolcSettings {
                optimizer: SolcOptimizer {
                    enabled: solc_options.optimize,
                    runs: solc_options.optimizer_runs.unwrap_or(200),
                },
                output_selection,
                remappings: remappings_strings,
                evm_version: solc_options.evm_version.clone(),
            },
        };

        // Get solc compiler using foundry-compilers
        let solc = if let Some(path) = &self.config.solc_path {
            // Use user-provided solc path if specified
            Solc::new(path.clone())
        } else {
            // Use the solc version from config or default to 0.8.20
            let version_str = self.config.solc_version.clone().unwrap_or_else(|| "0.8.20".to_string());
            
            // Parse version string
            let version = match Version::parse(&version_str) {
                Ok(v) => v,
                Err(e) => {
                    return Err(BundleError {
                        message: format!("Invalid solc version format '{}': {}", version_str, e),
                        path: Some(full_path.clone()),
                    });
                }
            };
            
            // Find or install the solc version
            match Solc::find_or_install(&version) {
                Ok(solc) => solc,
                Err(e) => {
                    return Err(BundleError {
                        message: format!("Failed to find or install solc {}: {}", version, e),
                        path: Some(full_path.clone()),
                    });
                }
            }
        };

        // Convert our solc input to foundry-compilers format
        // This is a simplified conversion - a full implementation would need more mapping
        let input_json = serde_json::to_value(solc_input.clone())
            .map_err(|e| BundleError {
                message: format!("Failed to convert solc input to JSON: {}", e),
                path: Some(full_path.clone()),
            })?;
            
        // Use foundry-compilers to compile
        let compiler_output: CompilerOutput = match solc.compile_exact(&input_json) {
            Ok(output) => output,
            Err(e) => {
                return Err(BundleError {
                    message: format!("Compilation failed: {}", e),
                    path: Some(full_path.clone()),
                });
            }
        };
        
        // Convert the foundry-compilers output to our expected format
        let solc_output: Value = serde_json::to_value(compiler_output)
            .map_err(|e| BundleError {
                message: format!("Failed to convert compiler output: {}", e),
                path: Some(full_path.clone()),
            })?;

        // Convert module map to ModuleInfo for the result
        let modules: HashMap<String, ModuleInfo> = module_map
            .into_iter()
            .map(|(path, module_info)| {
                (
                    path.to_string_lossy().to_string(),
                    ModuleInfo {
                        id: path.to_string_lossy().to_string(),
                        code: module_info.code.clone(),
                        raw_code: module_info.code,
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

        // Convert the solc_input to Value for storage
        let solc_input_value = serde_json::to_value(solc_input)
            .map_err(|e| BundleError {
                message: format!("Failed to convert solc input to JSON: {}", e),
                path: Some(full_path),
            })?;

        // Create compile result
        let result = CompileResult {
            modules,
            solc_input: solc_input_value,
            solc_output,
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
            ModuleType::Ts => RuntimeModuleType::Ts,
            ModuleType::Cjs => RuntimeModuleType::Cjs,
            ModuleType::Mjs => RuntimeModuleType::Mjs,
            ModuleType::Dts => RuntimeModuleType::Dts,
        };

        // Convert contract package to runtime-rs format
        let runtime_contract_package = match runtime_options.contract_package {
            ContractPackage::TevmContract => RuntimeContractPackage::TevmContract,
            ContractPackage::TevmContractScoped => RuntimeContractPackage::TevmContractScoped,
        };

        // Parse the solc output back to SolcOutput for runtime-rs
        let solc_output_json: SolcOutput = serde_json::from_value(compile_result.solc_output.clone())
            .map_err(|e| BundleError {
                message: format!("Failed to parse solc output for runtime generation: {}", e),
                path: Some(PathBuf::from(file_path)),
            })?;

        // Generate code using the real runtime-rs generator
        let code = tevm_runtime_rs::generate_runtime(
            &solc_output_json,
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