use crate::models::ModuleInfo;
use crate::module_resolution_error::ModuleResolutionError;
use crate::read_file::read_file;
use crate::resolve_imports::resolve_imports;
use futures::{stream::FuturesUnordered, StreamExt};
use std::collections::{HashMap, HashSet};
use std::sync::{Arc, Mutex};

/// Processes a single module and its imports concurrently
///
/// # Arguments
/// * `absolute_path` - The absolute path of the module to process
/// * `raw_code` - The source code of the module
/// * `remappings` - Map of import path prefixes to replacement values
/// * `libs` - Additional library paths to search for imports
/// * `seen` - Shared set of already processed module paths
/// * `module_map` - Shared map of processed modules
/// * `errors` - Shared collection of errors
///
/// # Returns
/// * `Vec<(String, String)>` - New modules to process (path, code)
pub async fn process_module(
    absolute_path: String,
    raw_code: String,
    remappings: HashMap<String, String>,
    libs: Vec<String>,
    seen: Arc<Mutex<HashSet<String>>>,
    module_map: Arc<Mutex<HashMap<String, ModuleInfo>>>,
    errors: Arc<Mutex<Vec<ModuleResolutionError>>>,
) -> Vec<(String, String)> {
    let result = resolve_imports(&absolute_path, &raw_code, &remappings, &libs).await;

    match result {
        Ok(imported_paths) => {
            // Store this module in the module map
            {
                let mut map = module_map.lock().unwrap();
                map.insert(
                    absolute_path.clone(),
                    ModuleInfo {
                        code: raw_code.clone(),
                        imported_ids: imported_paths.clone(),
                    },
                );
            }

            // Read all imported files concurrently
            let mut read_futures = FuturesUnordered::new();
            let seen_guard = seen.lock().unwrap();

            for path in &imported_paths {
                let path_str = path
                    .to_str()
                    .expect("Tevm only supports utf8 files")
                    .to_owned();
                if !seen_guard.contains(&path_str) {
                    read_futures.push(read_file(path.clone()));
                }
            }

            // Release the lock before awaiting
            drop(seen_guard);

            let mut new_modules = Vec::new();

            // Collect results from reading all files
            while let Some(result) = read_futures.next().await {
                match result {
                    Ok((path, code)) => {
                        new_modules.push((path, code));
                    }
                    Err(err) => {
                        let mut errors_guard = errors.lock().unwrap();
                        errors_guard.push(ModuleResolutionError::CannotReadFile(err));
                    }
                }
            }

            new_modules
        }
        Err(errs) => {
            // Store module with empty imports
            {
                let mut map = module_map.lock().unwrap();
                map.insert(
                    absolute_path.clone(),
                    ModuleInfo {
                        code: raw_code.clone(),
                        imported_ids: vec![],
                    },
                );
            }

            // Add errors
            {
                let mut errors_guard = errors.lock().unwrap();
                let module_errors: Vec<ModuleResolutionError> = errs
                    .into_iter()
                    .map(|e| ModuleResolutionError::from(e))
                    .collect();
                errors_guard.extend(module_errors);
            }

            Vec::new()
        }
    }
}
