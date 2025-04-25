extern crate napi_derive;

pub mod config;
pub mod models;
pub mod bundle;

pub use config::Config;
pub use models::{BundleOptions, BundleResult};
pub use bundle::bundle_code;

use napi::{Error, Result, Status};
use napi_derive::napi;
use num_cpus;
use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::path::PathBuf;

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
pub struct JsBundleOptions {
    pub entry_point: String,
    pub external_modules: Option<Vec<String>>,
    pub resolve_dirs: Option<Vec<String>>,
    pub source_map: Option<bool>,
    pub minify: Option<bool>,
}

#[napi(object)]
pub struct JsBundleResult {
    pub code: String,
    pub source_map: Option<String>,
    pub modules: HashMap<String, String>,
    pub entry_point: String,
}

// Direct async implementations for Node.js
#[napi]
pub async fn bundle_code_js(
    entry_point: String,
    options: Option<JsBundleOptions>,
) -> Result<JsBundleResult> {
    let config = match options {
        Some(opts) => Config {
            external_modules: opts.external_modules.unwrap_or_default(),
            resolve_dirs: opts.resolve_dirs.unwrap_or_default(),
            source_map: opts.source_map.unwrap_or(false),
            minify: opts.minify.unwrap_or(false),
        },
        None => Config::default(),
    };

    let result = bundle::bundle_code(PathBuf::from(&entry_point), &config)
        .await
        .map_err(|err| {
            Error::new(
                Status::GenericFailure,
                format!("Failed to bundle code: {:?}", err),
            )
        })?;

    Ok(JsBundleResult {
        code: result.code,
        source_map: result.source_map,
        modules: result.modules,
        entry_point,
    })
}