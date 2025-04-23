extern crate napi_derive;

pub mod config;
pub mod models;
pub mod module_factory;
pub mod module_resolution_error;
pub mod process_module;
pub mod read_file;
pub mod resolve_import_path;
pub mod resolve_imports;
pub mod state;

pub use config::Config;
pub use models::{ModuleInfo, ResolvedImport};
pub use module_factory::module_factory;
pub use module_resolution_error::ModuleResolutionError;
pub use read_file::read_file;
pub use resolve_import_path::resolve_import_path;
pub use resolve_imports::resolve_imports;

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
pub struct JsResolvedImport {
    pub original: String,
    pub absolute: String,
    pub updated: String,
}

#[napi(object)]
pub struct JsModuleInfo {
    pub code: String,
    pub imported_ids: Vec<String>,
}

#[napi(object)]
pub struct JsModule {
    pub id: String,
    pub code: String,
    pub raw_code: String,
    pub imported_ids: Vec<String>,
}

// Direct async implementations for Node.js - more efficient than Task-based implementations

#[napi]
pub async fn resolve_imports_js(
    file_path: String,
    code: String,
    remappings: Option<Vec<(String, String)>>,
    libs: Option<Vec<String>>,
) -> Result<Vec<JsResolvedImport>> {
    let config = Config::from((libs, remappings));

    let paths = resolve_imports::resolve_imports(&PathBuf::from(&file_path), &code, &config)
        .map_err(|err| {
            Error::new(
                Status::GenericFailure,
                format!("Failed to resolve imports: {:?}", err),
            )
        })?;

    Ok(paths
        .into_iter()
        .map(|path| {
            let path_str = path.to_string_lossy().to_string();
            JsResolvedImport {
                original: path_str.clone(),
                absolute: path_str.clone(),
                updated: path_str,
            }
        })
        .collect())
}

#[napi]
pub async fn module_factory_js(
    file_path: String,
    code: String,
    remappings: Option<Vec<(String, String)>>,
    libs: Option<Vec<String>>,
) -> Result<HashMap<String, JsModule>> {
    let module_map = module_factory::module_factory(
        PathBuf::from(&file_path),
        &code,
        Config::from((libs, remappings)),
    )
    .await
    .map_err(|err| {
        Error::new(
            Status::GenericFailure,
            format!("Failed to create module factory: {:?}", err),
        )
    })?;

    let mut result_map = HashMap::new();

    for (path, module_info) in module_map {
        // Convert PathBuf values to String values
        let imported_paths: Vec<String> = module_info
            .imported_ids
            .iter()
            .map(|path| path.to_string_lossy().to_string())
            .collect();

        result_map.insert(
            path.clone(),
            JsModule {
                id: path,
                code: module_info.code.clone(),
                raw_code: module_info.code, // Reuse the same string instead of cloning again
                imported_ids: imported_paths,
            },
        );
    }

    Ok(result_map)
}
