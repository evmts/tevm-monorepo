use crate::models::ModuleInfo;
use crate::module_resolution_error::ModuleResolutionError;
use crate::read_file::read_file;
use crate::resolve_imports::resolve_imports;
use futures::{stream::FuturesUnordered, StreamExt};
use std::collections::HashMap;
use std::sync::Arc;
use dashmap::{DashMap, DashSet};

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
    remappings: Arc<HashMap<String, String>>,
    libs: Arc<Vec<String>>,
    seen: Arc<DashSet<String>>,
    module_map: Arc<DashMap<String, ModuleInfo>>,
    errors: Arc<DashMap<usize, ModuleResolutionError>>,
) -> Vec<(String, String)> {
    let result = resolve_imports(&absolute_path, &raw_code, &remappings, &libs).await;

    match result {
        Ok(imported_paths) => {
            // Store this module in the module map - no lock needed with DashMap
            // Convert raw_code to Arc<String> to avoid cloning
            let code_arc = Arc::new(raw_code);
            
            // Convert imported_paths to Vec<Arc<PathBuf>> efficiently
            let imported_ids: Vec<Arc<std::path::PathBuf>> = imported_paths
                .iter()
                .map(|p| Arc::new(p.clone()))
                .collect();
                
            // Insert into module map
            module_map.insert(
                absolute_path.clone(),
                ModuleInfo {
                    code: code_arc,
                    imported_ids,
                },
            );

            // Read all imported files concurrently with optimized concurrency for SSDs
            const MAX_IN_FLIGHT_READS: usize = 128; // SSDs perform better with deeper queues
            let mut read_futures = FuturesUnordered::new();
            // No lock needed with DashSet
            // Process all imports in parallel but limit number added to futures
            let mut new_paths_to_read = Vec::new();
            for path in &imported_paths {
                let path_str = path
                    .to_str()
                    .expect("Tevm only supports utf8 files")
                    .to_owned();
                if !seen.contains(&path_str) {
                    // Mark the path as seen before pushing to futures
                    // This prevents the same file from being processed multiple times concurrently
                    seen.insert(path_str);
                    new_paths_to_read.push(path.clone());
                }
            }
            
            // Initialize result collection vector
            let mut new_modules = Vec::new();
            
            // After collecting all new paths, push them to the futures queue in batches
            // to maintain optimal concurrency
            for path in new_paths_to_read {
                read_futures.push(read_file(path));
                
                // If we have too many futures in flight already, process some before adding more
                if read_futures.len() >= MAX_IN_FLIGHT_READS {
                    if let Some(result) = read_futures.next().await {
                        match result {
                            Ok((path, code)) => {
                                new_modules.push((path, code));
                            }
                            Err(err) => {
                                // Use unique index for each error
                                let error_idx = errors.len();
                                errors.insert(error_idx, ModuleResolutionError::CannotReadFile(err));
                            }
                        }
                    }
                }
            }

            // Collect results from reading all files
            while let Some(result) = read_futures.next().await {
                match result {
                    Ok((path, code)) => {
                        new_modules.push((path, code));
                    }
                    Err(err) => {
                        // Use unique index for each error
                        let error_idx = errors.len();
                        errors.insert(error_idx, ModuleResolutionError::CannotReadFile(err));
                    }
                }
            }

            new_modules
        }
        Err(errs) => {
            // Store module with empty imports - no lock needed with DashMap
            // Reuse the same pattern as success case for consistency and efficiency
            let code_arc = Arc::new(raw_code);
            
            module_map.insert(
                absolute_path.clone(),
                ModuleInfo {
                    code: code_arc,
                    imported_ids: vec![],
                },
            );

            // Add errors - no lock needed with DashMap
            for (i, e) in errs.into_iter().enumerate() {
                let error_idx = errors.len() + i;
                errors.insert(error_idx, ModuleResolutionError::from(e));
            }

            Vec::new()
        }
    }
}
