// Import the napi macros
#[macro_use]
extern crate napi_derive;

// Import modules
mod models;
mod resolve_import_path;
mod resolve_imports;
mod module_factory;

// Import dependencies required for the functions
use std::collections::HashMap;
use std::path::PathBuf;

// Define the napi functions
#[napi]
pub fn module_factory_js(
    absolute_path: String,
    raw_code: String,
    remappings: HashMap<String, String>,
    libs: Vec<String>
) -> HashMap<String, models::ModuleInfo> {
    // Convert String to &str for remappings
    let remappings_refs: HashMap<&str, &str> = remappings
        .iter()
        .map(|(k, v)| (k.as_str(), v.as_str()))
        .collect();

    // Convert Vec<String> to Vec<&str> for libs
    let libs_refs: Vec<&str> = libs.iter().map(|s| s.as_str()).collect();

    // Call the internal module_factory function
    module_factory::module_factory(
        &absolute_path,
        &raw_code,
        remappings_refs,
        libs_refs
    )
}

#[napi]
pub fn resolve_imports_js(
    absolute_path: String,
    code: String,
    remappings: HashMap<String, String>,
    libs: Vec<String>
) -> Vec<PathBuf> {
    // Convert String to &str for remappings
    let remappings_refs: HashMap<&str, &str> = remappings
        .iter()
        .map(|(k, v)| (k.as_str(), v.as_str()))
        .collect();

    // Convert Vec<String> to Vec<&str> for libs
    let libs_refs: Vec<&str> = libs.iter().map(|s| s.as_str()).collect();

    // Call the internal resolve_imports function
    resolve_imports::resolve_imports(
        &absolute_path,
        &code,
        &remappings_refs,
        &libs_refs
    )
}