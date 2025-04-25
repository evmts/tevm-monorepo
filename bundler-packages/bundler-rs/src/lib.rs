extern crate napi_derive;

pub mod config;
pub mod models;
pub mod bundle;
pub mod artifacts;
pub mod cache;
pub mod file_access;
pub mod bundler;

pub use config::{BundlerConfig, SolcOptions, RuntimeOptions, ModuleType, ContractPackage};
pub use models::{BundleError, BundleResult, CompileResult, ModuleInfo, ContractArtifact};
pub use bundle::bundle_code;
pub use bundler::Bundler;

use napi::{Error, Result, Status};
use napi_derive::napi;
use num_cpus;
use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;

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
    pub remappings: Option<Vec<(String, String)>>,
    pub libs: Option<Vec<String>>,
    pub solc_path: Option<String>,
    pub solc_version: Option<String>,
    pub cache_dir: Option<String>,
    pub use_cache: Option<bool>,
    pub debug: Option<bool>,
    pub contract_package: Option<String>,
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

// Bundler factory function
#[napi]
pub async fn create_bundler(
    config: JsBundlerConfig,
    file_access_object: JsFileAccessObject,
) -> Result<JsBundler> {
    let bundler_config = BundlerConfig {
        remappings: config.remappings.unwrap_or_default(),
        libs: config.libs.unwrap_or_default(),
        solc_path: config.solc_path.map(PathBuf::from),
        solc_version: config.solc_version,
        cache_dir: config.cache_dir.map(PathBuf::from),
        use_cache: config.use_cache.unwrap_or(true),
        debug: config.debug.unwrap_or(false),
        contract_package: config.contract_package.unwrap_or_else(|| "@tevm/contract".to_string()),
    };

    // Create file access adapter
    let file_access = file_access::FileAccess::new(file_access_object)?;

    // Create bundler
    let bundler = bundler::Bundler::new(bundler_config, file_access).await?;

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
    // TypeScript module resolution
    #[napi]
    pub async fn resolve_ts_module(
        &self,
        file_path: String,
        base_dir: String,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<JsBundleResult> {
        let options = convert_solc_options(solc_options);
        
        let result = self.inner.resolve_ts_module(&file_path, &base_dir, options)
            .await
            .map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
            
        Ok(convert_to_js_result(result, &file_path))
    }
    
    // CommonJS module resolution
    #[napi]
    pub async fn resolve_cjs_module(
        &self,
        file_path: String,
        base_dir: String,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<JsBundleResult> {
        let options = convert_solc_options(solc_options);
        
        let result = self.inner.resolve_cjs_module(&file_path, &base_dir, options)
            .await
            .map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
            
        Ok(convert_to_js_result(result, &file_path))
    }
    
    // ES module resolution
    #[napi]
    pub async fn resolve_esm_module(
        &self,
        file_path: String,
        base_dir: String,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<JsBundleResult> {
        let options = convert_solc_options(solc_options);
        
        let result = self.inner.resolve_esm_module(&file_path, &base_dir, options)
            .await
            .map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
            
        Ok(convert_to_js_result(result, &file_path))
    }
    
    // TypeScript declaration file resolution
    #[napi]
    pub async fn resolve_dts(
        &self,
        file_path: String,
        base_dir: String,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<JsBundleResult> {
        let options = convert_solc_options(solc_options);
        
        let result = self.inner.resolve_dts(&file_path, &base_dir, options)
            .await
            .map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
            
        Ok(convert_to_js_result(result, &file_path))
    }
    
    // Artifact compilation
    #[napi]
    pub async fn compile_artifacts(
        &self,
        file_path: String,
        base_dir: String,
        solc_options: Option<JsSolcOptions>,
    ) -> Result<String> {
        let options = convert_solc_options(solc_options);
        
        let result = self.inner.compile_artifacts(&file_path, &base_dir, options)
            .await
            .map_err(|e| Error::new(Status::GenericFailure, e.to_string()))?;
            
        // Convert result to JSON string
        let json = serde_json::to_string(&result)
            .map_err(|e| Error::new(Status::GenericFailure, format!("Failed to serialize result: {}", e)))?;
            
        Ok(json)
    }
}

// Direct async implementation for bundling code
#[napi]
pub async fn bundle_code_js(
    entry_point: String,
    options: Option<JsBundlerConfig>,
    solc_options: Option<JsSolcOptions>,
) -> Result<JsBundleResult> {
    let js_file_access = JsFileAccessObject {
        read_file: napi::JsFunction::new(|| {}).unwrap(),
        write_file: napi::JsFunction::new(|| {}).unwrap(),
        exists: napi::JsFunction::new(|| {}).unwrap(),
    };
    
    let bundler = create_bundler(
        options.unwrap_or_else(|| JsBundlerConfig {
            remappings: None,
            libs: None,
            solc_path: None,
            solc_version: None,
            cache_dir: None,
            use_cache: None,
            debug: None,
            contract_package: None,
        }),
        js_file_access,
    ).await?;
    
    bundler.resolve_ts_module(entry_point, ".".to_string(), solc_options).await
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
    JsBundleResult {
        code: result.code,
        source_map: result.source_map,
        modules: result.modules,
        solc_input: serde_json::to_string(&result.solc_input).unwrap_or_default(),
        solc_output: serde_json::to_string(&result.solc_output).unwrap_or_default(),
        entry_point: entry_point.to_string(),
    }
}