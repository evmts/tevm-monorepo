use crate::artifacts::{extract_artifacts, extract_asts, generate_source_map};
use crate::cache::Cache;
use crate::config::{BundlerConfig, ContractPackage, ModuleType, RuntimeOptions, SolcOptions};
use crate::models::{BundleError, BundleResult, CompileResult, ModuleInfo};

use hex::encode;
use serde_json;
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

// Use correct imports for Rust modules
use tevm_resolutions_rs::module_factory;
use tevm_runtime_rs::generate_runtime;
use tevm_solc_rs::{
    solc_compile, Solc, SolcInputDescription, SolcInputSource, SolcOptimizer, SolcSettings,
};

/// Main bundler struct that coordinates the bundling process
pub struct Bundler {
    /// Configuration for the bundler
    config: BundlerConfig,

    /// Cache for compilation results
    cache: Option<Cache>,

    /// Solidity compiler instance
    solc: Solc,
}

impl Bundler {
    /// Create a new bundler instance
    pub async fn new(config: BundlerConfig) -> Result<Self, BundleError> {
        // Initialize solc compiler
        let solc_path = config
            .solc_path
            .clone()
            .unwrap_or_else(|| PathBuf::from("solc"));
        let solc_version = config
            .solc_version
            .clone()
            .unwrap_or_else(|| "0.8.20".to_string());

        let solc = Solc::new(solc_path, solc_version.to_string());

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

        self.resolve_module(file_path, base_dir, solc_options, runtime_options)
            .await
    }

    /// Hash solc options for cache lookups
    fn hash_solc_options(&self, solc_options: &SolcOptions) -> String {
        let json = serde_json::to_string(solc_options).unwrap_or_default();
        let mut hasher = Sha256::new();
        hasher.update(json.as_bytes());
        let hash = hasher.finalize();
        encode(hash)
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
        let code = fs::read_to_string(&full_path).map_err(|e| BundleError {
            message: format!("Failed to read file: {}", e),
            path: Some(full_path.clone()),
        })?;

        // Use resolutions module_factory to resolve imports
        let remappings: Vec<(String, String)> = self.config.remappings.clone();
        let libs: Vec<String> = self.config.libs.clone();
        let config = tevm_resolutions_rs::Config::from((Some(libs), Some(remappings)));

        let module_map = module_factory::module_factory(
            PathBuf::from(&full_path),
            &code,
            config,
        )
        .await
        .map_err(|e| BundleError {
            message: format!("Failed to resolve imports: {}", e),
            path: Some(full_path),
        })?;

        // Create solc input from module map
        let mut solc_sources = HashMap::new();
        let mut solc_input = SolcInputDescription {
            language: tevm_solc_rs::SolcLanguage::Solidity,
            sources: solc_sources.clone(),
            settings: None,
        };

        for (path, module_info) in &module_map {
            solc_sources.insert(
                path.to_string_lossy().to_string(),
                SolcInputSource {
                    content: Some(module_info.code.clone()),
                    keccak256: None,
                    urls: None,
                },
            );
        }

        solc_input.sources = solc_sources;

        // Configure solc settings
        let mut output_selection = HashMap::new();
        let mut output_components = Vec::new();

        // Always include ABI
        output_components.push("abi".to_string());

        if solc_options.include_bytecode {
            output_components.push("bytecode".to_string());
            output_components.push("deployedBytecode".to_string());
        }

        if solc_options.include_user_docs {
            output_components.push("userdoc".to_string());
        }

        if solc_options.include_dev_docs {
            output_components.push("devdoc".to_string());
        }

        // Add * => * => output_components to output_selection
        let mut contracts_map = HashMap::new();
        contracts_map.insert("*".to_string(), output_components);
        output_selection.insert("*".to_string(), contracts_map);

        // Add AST if requested
        if solc_options.include_ast {
            let mut ast_map = HashMap::new();
            let ast_components = vec!["ast".to_string()];
            ast_map.insert("".to_string(), ast_components);
            output_selection.insert("*".to_string(), ast_map);
        }

        // Configure optimizer
        let optimizer = SolcOptimizer {
            enabled: Some(solc_options.optimize),
            runs: solc_options.optimizer_runs.unwrap_or(200),
            details: None,
        };

        // Create solc settings
        let settings = SolcSettings {
            optimizer: Some(optimizer),
            output_selection: Some(output_selection),
            remappings: Some(
                self.config
                    .remappings
                    .iter()
                    .map(|(from, to)| format!("{}={}", from, to))
                    .collect(),
            ),
            evm_version: solc_options.evm_version.clone(),
            ..Default::default()
        };

        solc_input.settings = Some(settings);

        // Compile with solc
        let solc_output = solc_compile(&self.solc, &solc_input).map_err(|e| BundleError {
            message: format!("Compilation failed: {}", e),
            path: None,
        })?;

        // Convert module map to ModuleInfo
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

        // Extract artifacts
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
            solc_input: serde_json::to_value(&solc_input).unwrap_or_default(),
            solc_output: serde_json::to_value(&solc_output).unwrap_or_default(),
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
        let module_type = match runtime_options.module_type {
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
                .get_bundle(file_path, module_type, &solc_options_hash)
                .await
            {
                return Ok(result);
            }
        }

        // Compile artifacts first
        let compile_result = self
            .compile_artifacts(file_path, base_dir, solc_options.clone())
            .await?;

        // Use runtime-rs core API to generate code
        let use_scoped_package = match runtime_options.contract_package {
            ContractPackage::TevmContract => false,
            ContractPackage::TevmContractScoped => true,
        };

        let solc_output_json =
            serde_json::to_string(&compile_result.solc_output).map_err(|e| BundleError {
                message: format!("Failed to serialize solc output: {}", e),
                path: None,
            })?;
        
        // Parse the SolcOutput from JSON
        let solc_output: tevm_solc_rs::SolcOutput = serde_json::from_str(&solc_output_json)
            .map_err(|e| BundleError {
                message: format!("Failed to parse solc output: {}", e),
                path: None,
            })?;

        // Generate code using direct Rust API
        let code = generate_runtime(
            &solc_output,
            runtime_options.module_type,
            if use_scoped_package {
                tevm_runtime_rs::ContractPackage::TevmContractScoped
            } else {
                tevm_runtime_rs::ContractPackage::TevmContract
            },
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
                .set_bundle(file_path, module_type, &solc_options_hash, result.clone())
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