#[macro_use]
extern crate napi_derive;

pub mod models;
pub mod module_factory;
pub mod resolve_import_path;
pub mod resolve_imports;

// Re-export the main functions and types for easier access
pub use module_factory::module_factory;
pub use models::{ModuleInfo, ResolvedImport};
pub use resolve_import_path::resolve_import_path;
pub use resolve_imports::resolve_imports;

use napi::bindgen_prelude::*;
use std::collections::HashMap;

// FFI wrapper function for module_factory that works with JS strings and objects
#[napi]
pub fn module_factory_ffi(
    absolute_path: String,
    raw_code: String,
    remappings: HashMap<String, String>,
    libs: Vec<String>,
) -> Result<HashMap<String, Object>> {
    // Call the actual implementation
    let result = module_factory(&absolute_path, &raw_code, &remappings, &libs);
    
    match result {
        Ok(module_map) => {
            // Convert ModuleInfo to a format that can be serialized to JS
            let mut result_map = HashMap::new();
            
            for (path, module_info) in module_map {
                let mut obj = Object::new(&mut napi::Env::try_current()?)?;
                
                // Add code to the object
                obj.set("code", module_info.code)?;
                
                // Convert PathBuf to String and add to object
                let imported_ids: Vec<String> = module_info.imported_ids
                    .into_iter()
                    .map(|path| path.to_string_lossy().to_string())
                    .collect();
                obj.set("imported_ids", imported_ids)?;
                
                // Add path to the object
                obj.set("path", path.clone())?;
                
                // Add to result map
                result_map.insert(path, obj);
            }
            
            Ok(result_map)
        },
        Err(errors) => {
            // Convert errors to a JS Error
            let error_messages: Vec<String> = errors
                .into_iter()
                .map(|e| format!("{:?}", e))
                .collect();
                
            Err(Error::new(
                Status::GenericFailure,
                format!("Module factory errors: {:?}", error_messages),
            ))
        }
    }
}

// FFI wrapper for resolve_imports to work with JS strings and objects
#[napi]
pub fn resolve_imports_ffi(
    absolute_path: String,
    raw_code: String,
    remappings: HashMap<String, String>,
    libs: Vec<String>,
) -> Result<Vec<String>> {
    // Call the actual implementation
    let result = resolve_imports(&absolute_path, &raw_code, &remappings, &libs);
    
    match result {
        Ok(imported_paths) => {
            // Convert PathBuf to String
            let imports: Vec<String> = imported_paths
                .into_iter()
                .map(|path| path.to_string_lossy().to_string())
                .collect();
                
            Ok(imports)
        },
        Err(errors) => {
            // Convert errors to a JS Error
            let error_messages: Vec<String> = errors
                .into_iter()
                .map(|e| format!("{:?}", e))
                .collect();
                
            Err(Error::new(
                Status::GenericFailure,
                format!("Import resolution errors: {:?}", error_messages),
            ))
        }
    }
}

// FFI wrapper for resolve_import_path
#[napi]
pub fn resolve_import_path_ffi(
    import_path: String,
    parent_dir: String,
    remappings: HashMap<String, String>,
    libs: Vec<String>,
) -> Result<String> {
    // Call the actual implementation
    let result = resolve_import_path(&import_path, &parent_dir, &remappings, &libs);
    
    match result {
        Ok(path) => {
            // Convert PathBuf to String
            let path_str = path.to_string_lossy().to_string();
            Ok(path_str)
        },
        Err(e) => {
            // Convert error to a JS Error
            Err(Error::new(
                Status::GenericFailure,
                format!("Import path resolution error: {:?}", e),
            ))
        }
    }
}