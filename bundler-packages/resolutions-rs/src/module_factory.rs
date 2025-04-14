use crate::models::ModuleInfo;
use crate::resolve_imports::resolve_imports;
use futures::future::join_all;
use node_resolve::ResolutionError;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tokio::fs::read_to_string;

#[derive(Debug)]
pub enum ModuleResolutionError {
    Resolution(ResolutionError),
    CannotReadFile(std::io::Error),
    InvalidPath(String),
}

// Manual implementation of Clone for ModuleResolutionError
impl Clone for ModuleResolutionError {
    fn clone(&self) -> Self {
        match self {
            // Convert non-clonable errors to InvalidPath with descriptive messages
            ModuleResolutionError::Resolution(_) => {
                ModuleResolutionError::InvalidPath("Resolution error".to_string())
            },
            ModuleResolutionError::CannotReadFile(_) => {
                ModuleResolutionError::InvalidPath("File read error".to_string())
            },
            ModuleResolutionError::InvalidPath(msg) => {
                ModuleResolutionError::InvalidPath(msg.clone())
            },
        }
    }
}

impl From<ResolutionError> for ModuleResolutionError {
    fn from(err: ResolutionError) -> Self {
        ModuleResolutionError::Resolution(err)
    }
}

impl From<std::io::Error> for ModuleResolutionError {
    fn from(err: std::io::Error) -> Self {
        ModuleResolutionError::CannotReadFile(err)
    }
}

struct UnprocessedModule {
    pub absolute_path: String,
    pub raw_code: String,
}

pub fn module_factory(
    absolute_path: &str,
    raw_code: &str,
    remappings: &HashMap<String, String>,
    libs: &[String],
) -> Result<HashMap<String, ModuleInfo>, Vec<ModuleResolutionError>> {
    // Use tokio's runtime to run the async function and block until it completes
    tokio::runtime::Runtime::new()
        .unwrap()
        .block_on(module_factory_async(absolute_path, raw_code, remappings, libs))
}

/// Asynchronous version of module_factory that leverages Tokio for concurrent I/O
async fn module_factory_async(
    absolute_path: &str,
    raw_code: &str,
    remappings: &HashMap<String, String>,
    libs: &[String],
) -> Result<HashMap<String, ModuleInfo>, Vec<ModuleResolutionError>> {
    let initial_module = UnprocessedModule {
        absolute_path: absolute_path.to_string(),
        raw_code: raw_code.to_string(),
    };

    // Use Arc and Mutex for shared mutable state
    let module_map: Arc<Mutex<HashMap<String, ModuleInfo>>> = Arc::new(Mutex::new(HashMap::new()));
    let errors: Arc<Mutex<Vec<ModuleResolutionError>>> = Arc::new(Mutex::new(Vec::new()));
    let unprocessed_modules: Arc<Mutex<Vec<UnprocessedModule>>> = Arc::new(Mutex::new(vec![initial_module]));

    // Process modules until there are no more unprocessed modules
    'outer: while let Some(next_module) = {
        let mut modules = unprocessed_modules.lock().unwrap();
        modules.pop()
    } {
        // Skip if already processed
        if module_map.lock().unwrap().contains_key(&next_module.absolute_path) {
            continue 'outer;
        }

        // Resolve imports for the current module
        match resolve_imports(
            &next_module.absolute_path,
            &next_module.raw_code,
            remappings,
            libs,
        ) {
            Ok(imported_paths) => {
                // Process all imported paths concurrently
                let path_tasks = imported_paths.iter().map(|path| {
                    let path_clone = path.clone();
                    let unprocessed_clone = Arc::clone(&unprocessed_modules);
                    let errors_clone = Arc::clone(&errors);

                    tokio::spawn(async move {
                        match read_to_string(&path_clone).await {
                            Ok(code) => {
                                let absolute_path = match path_clone.to_str() {
                                    Some(path_str) => path_str.to_owned(),
                                    None => {
                                        errors_clone.lock().unwrap().push(
                                            ModuleResolutionError::InvalidPath(
                                                "Non-UTF8 path encountered".to_string()
                                            )
                                        );
                                        return;
                                    }
                                };

                                unprocessed_clone.lock().unwrap().push(UnprocessedModule {
                                    raw_code: code,
                                    absolute_path,
                                });
                            }
                            Err(err) => {
                                errors_clone.lock().unwrap().push(err.into());
                            }
                        }
                    })
                });

                // Wait for all file reading operations to complete
                join_all(path_tasks).await;

                // Add the processed module to the module map
                module_map.lock().unwrap().insert(
                    next_module.absolute_path.clone(),
                    ModuleInfo {
                        code: next_module.raw_code,
                        imported_ids: imported_paths,
                    },
                );
            }
            Err(errs) => {
                // Handle resolve_imports errors
                module_map.lock().unwrap().insert(
                    next_module.absolute_path,
                    ModuleInfo {
                        code: next_module.raw_code,
                        imported_ids: vec![],
                    },
                );

                errors.lock().unwrap().append(
                    &mut errs.into_iter().map(Into::into).collect()
                );
            }
        }
    }

    // Check if there were any errors
    let final_errors = {
        let errors_guard = errors.lock().unwrap();
        if errors_guard.is_empty() {
            Vec::new()
        } else {
            errors_guard.clone()
        }
    };

    if !final_errors.is_empty() {
        return Err(final_errors);
    }

    // Return the final module map
    Ok(Arc::try_unwrap(module_map)
        .expect("There should be no more references to the module map")
        .into_inner()
        .unwrap())
}
