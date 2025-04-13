// Export modules
mod models;
mod resolve_import_path;
mod resolve_imports;
mod module_factory;

// Re-export only the public functions
pub use resolve_imports::resolve_imports;
pub use module_factory::module_factory;

// Re-export external crates needed by the public API
extern crate napi_derive;

// Import dependencies required by the re-exported functions
use regex::Regex;
use std::collections::HashMap;
use std::path::PathBuf;