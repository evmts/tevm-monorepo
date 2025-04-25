extern crate napi_derive;

pub mod config;
pub mod models;
pub mod bundle;
pub mod artifacts;
pub mod cache;
pub mod file_access;
pub mod bundler;

pub use config::{BundlerConfig, SolcOptions, RuntimeOptions, ModuleType, ContractPackage};
pub use models::{BundleError, BundleResult, CompileResult, ModuleInfo, ContractArtifact, GenResult};
pub use bundle::bundle_code;
pub use bundler::Bundler;

use napi::{Error, Result, Status};
use napi_derive::napi;
use num_cpus;
use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;
use file_access::FileAccess;

// Global tokio runtime optimized for file system operations
pub static TOKIO: Lazy<tokio::runtime::Runtime> = Lazy::new(|| {
    tokio::runtime::Builder::new_multi_thread()
        .worker_threads(num_cpus::get()) // Use all available CPU cores
        .max_blocking_threads(1024) // Lots of small fs operations
        .enable_all() // Enable all features (I/O, time, etc.)
        .build()
        .unwrap()
});

#[napi(object)]
pub struct JsBundlerConfig {
    pub remappings_from: Option<Vec<String>>,
    pub remappings_to: Option<Vec<String>>,
    pub libs: Option<Vec<String>>,
    pub solc_path: Option<String>,
    pub solc_version: Option<String>,
    pub cache_dir: Option<String>,
    pub use_cache: Option<bool>,
    pub debug: Option<bool>,
    pub contract_package: Option<String>,
}

// Helper to convert JsBundlerConfig to BundlerConfig
fn convert_js_config(config: JsBundlerConfig) -> BundlerConfig {
    // Convert separate from/to arrays to remappings tuples
    let remappings = match (config.remappings_from, config.remappings_to) {
        (Some(from_list), Some(to_list)) => {
            let mut remappings = Vec::new();
            for (i, from) in from_list.iter().enumerate() {
                if i < to_list.len() {
                    remappings.push((from.clone(), to_list[i].clone()));
                }
            }
            remappings
        },
        _ => Vec::new(),
    };
    
    BundlerConfig {
        remappings,
        libs: config.libs.unwrap_or_default(),
        solc_path: config.solc_path.map(PathBuf::from),
        solc_version: config.solc_version,
        cache_dir: config.cache_dir.map(PathBuf::from),
        use_cache: config.use_cache.unwrap_or(true),
        debug: config.debug.unwrap_or(false),
        contract_package: config.contract_package.unwrap_or_else(|| "@tevm/contract".to_string()),
    }
}

#[napi(object)]
pub struct JsSolcOptions {
    pub optimize: Option<bool>,
    pub optimizer_runs: Option<i32>,
    pub evm_version: Option<String>,
    pub include_ast: Option<bool>,
    pub include_bytecode: Option<bool>,
    pub include_source_map: Option<bool>,
    pub include_user_docs: Option<bool>,
    pub include_dev_docs: Option<bool>,
}

// Note: This JsFileAccessObject is kept for API compatibility but not used
// in the current implementation, which uses native file system operations
#[napi(object)]
pub struct JsFileAccessObject {
    pub read_file: napi::JsFunction,
    pub write_file: napi::JsFunction,
    pub exists: napi::JsFunction,
}

#[napi(object)]
pub struct JsBundleResult {
    pub code: String,
    pub source_map: Option<String>,
    pub modules: HashMap<String, String>,
    pub solc_input: String,
    pub solc_output: String,
    pub entry_point: String,
}

// Module type enum for JavaScript
#[napi]
pub enum JsModuleType {
    Ts = 0,
    Cjs = 1,
    Mjs = 2,
    Dts = 3,
}

impl From<JsModuleType> for ModuleType {
    fn from(js_type: JsModuleType) -> Self {
        match js_type {
            JsModuleType::Ts => ModuleType::Ts,
            JsModuleType::Cjs => ModuleType::Cjs,
            JsModuleType::Mjs => ModuleType::Mjs,
            JsModuleType::Dts => ModuleType::Dts,
        }
    }
}

// Bundler factory function
#[napi]
pub fn create_bundler_sync(
    config: JsBundlerConfig,
) -> Result<JsBundler> {
    // Convert config to native format
    let bundler_config = convert_js_config(config);

    // Create bundler in a blocking manner
    let bundler = TOKIO.block_on(async {
        bundler::Bundler::new(bundler_config).await
    })
    .map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
    
    Ok(JsBundler {
        inner: Arc::new(bundler),
    })
}

// Create a bundler with file access
#[napi]
pub fn create_bundler_with_file_access(
    config: JsBundlerConfig,
    base_dir: String,
) -> Result<JsBundler> {
    // Convert config to native format
    let bundler_config = convert_js_config(config);
    
    // Create file access
    let file_access = FileAccess::new(&base_dir)
        .map_err(|e| Error::new(Status::GenericFailure, format!("Failed to create file access: {}", e)))?;

    // Create bundler in a blocking manner
    let bundler = TOKIO.block_on(async {
        // Create the bundler
        let bundler = match bundler::Bundler::new(bundler_config).await {
            Ok(b) => b,
            Err(e) => return Err(Error::new(Status::GenericFailure, e.to_string())),
        };
        
        // Add file access
        let bundler_with_access = bundler.with_file_access(file_access);
        
        Ok(bundler_with_access)
    }).map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
    
    Ok(JsBundler {
        inner: Arc::new(bundler),
    })
}

// Bundler class for JavaScript
#[napi]
pub struct JsBundler {
    inner: Arc<bundler::Bundler>,
}

#[napi]
impl JsBundler {
    // Unified file resolution method
    #[napi]
    pub fn resolve_file_sync(
        &self,
        file_path: String,
        base_dir: String,
        module_type: JsModuleType,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<JsBundleResult> {
        let options = convert_solc_options(solc_options);
        let rust_module_type = ModuleType::from(module_type);
        
        let result = TOKIO.block_on(async {
            self.inner.resolve_file(&file_path, &base_dir, rust_module_type, options).await
        })
        .map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
            
        Ok(convert_to_js_result(result, &file_path))
    }
    
    // Legacy TypeScript module resolution
    #[napi]
    pub fn resolve_ts_module_sync(
        &self,
        file_path: String,
        base_dir: String,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<JsBundleResult> {
        self.resolve_file_sync(file_path, base_dir, JsModuleType::Ts, solc_options)
    }
    
    // Legacy CommonJS module resolution
    #[napi]
    pub fn resolve_cjs_module_sync(
        &self,
        file_path: String,
        base_dir: String,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<JsBundleResult> {
        self.resolve_file_sync(file_path, base_dir, JsModuleType::Cjs, solc_options)
    }
    
    // Legacy ES module resolution
    #[napi]
    pub fn resolve_esm_module_sync(
        &self,
        file_path: String,
        base_dir: String,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<JsBundleResult> {
        self.resolve_file_sync(file_path, base_dir, JsModuleType::Mjs, solc_options)
    }
    
    // Legacy TypeScript declaration file resolution
    #[napi]
    pub fn resolve_dts_sync(
        &self,
        file_path: String,
        base_dir: String,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<JsBundleResult> {
        self.resolve_file_sync(file_path, base_dir, JsModuleType::Dts, solc_options)
    }
    
    // Artifact compilation
    #[napi]
    pub fn compile_artifacts_sync(
        &self,
        file_path: String,
        base_dir: String,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<String> {
        let options = convert_solc_options(solc_options);
        
        let result = TOKIO.block_on(async {
            self.inner.compile_artifacts(&file_path, &base_dir, options).await
        })
        .map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
            
        // Convert result to JSON string
        let json = serde_json::to_string(&result)
            .map_err(|e| Error::new(Status::GenericFailure, format!("Failed to serialize result: {}", e)))?;
            
        Ok(json)
    }
}

// Direct implementation for bundling code
#[napi]
pub fn bundle_code_js_sync(
    entry_point: String,
    module_type: JsModuleType,
    options: Option<JsBundlerConfig>,
    solc_options: Option<JsSolcOptions>,
) -> Result<JsBundleResult> {
    let bundler = create_bundler_sync(
        options.unwrap_or_else(|| JsBundlerConfig {
            remappings_from: None,
            remappings_to: None,
            libs: None,
            solc_path: None,
            solc_version: None,
            cache_dir: None,
            use_cache: None,
            debug: None,
            contract_package: None,
        }),
    )?;
    
    bundler.resolve_file_sync(entry_point, ".".to_string(), module_type, solc_options)
}

// Helper functions

fn convert_solc_options(js_options: Option<JsSolcOptions>) -> SolcOptions {
    let defaults = js_options.unwrap_or_else(|| JsSolcOptions {
        optimize: None,
        optimizer_runs: None,
        evm_version: None,
        include_ast: None,
        include_bytecode: None,
        include_source_map: None,
        include_user_docs: None,
        include_dev_docs: None,
    });
    
    SolcOptions {
        optimize: defaults.optimize.unwrap_or(true),
        optimizer_runs: defaults.optimizer_runs.map(|r| r as u32),
        evm_version: defaults.evm_version,
        include_ast: defaults.include_ast.unwrap_or(false),
        include_bytecode: defaults.include_bytecode.unwrap_or(true),
        include_source_map: defaults.include_source_map.unwrap_or(false),
        include_user_docs: defaults.include_user_docs.unwrap_or(true),
        include_dev_docs: defaults.include_dev_docs.unwrap_or(false),
    }
}

fn convert_to_js_result(result: BundleResult, entry_point: &str) -> JsBundleResult {
    // Ensure we have strings for JSON values, or empty defaults
    let solc_input_str = match &result.solc_input {
        Some(val) => serde_json::to_string(val).unwrap_or_default(),
        None => "{}".to_string(),
    };
    
    let solc_output_str = match &result.solc_output {
        Some(val) => serde_json::to_string(val).unwrap_or_default(),
        None => "{}".to_string(),
    };
    
    JsBundleResult {
        code: result.code,
        source_map: result.source_map,
        modules: result.modules,
        solc_input: solc_input_str,
        solc_output: solc_output_str,
        entry_point: entry_point.to_string(),
    }
}