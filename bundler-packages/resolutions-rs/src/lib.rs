// Import the napi macros
#[macro_use]
extern crate napi_derive;

// Import modules
mod models;
mod module_factory;
mod resolve_import_path;
mod resolve_imports;

// Import dependencies required for the functions
use std::collections::HashMap;
use std::path::PathBuf;

// Define the napi functions
#[napi]
pub fn module_factory_js(
    absolute_path: String,
    raw_code: String,
    remappings: HashMap<String, String>,
    libs: Vec<String>,
) -> HashMap<String, models::ModuleInfo> {
    module_factory::module_factory(&absolute_path, &raw_code, &remappings, &libs)
}

#[napi]
pub fn resolve_imports_js(
    absolute_path: String,
    code: String,
    remappings: HashMap<String, String>,
    libs: Vec<String>,
) -> Vec<PathBuf> {
    resolve_imports::resolve_imports(&absolute_path, &code, &remappings, &libs)
}

