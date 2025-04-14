use crate::models::ModuleInfo;
use crate::resolve_imports::resolve_imports;
use node_resolve::ResolutionError;
use std::collections::HashMap;
use std::fs::read_to_string;

#[derive(Debug)]
pub enum ModuleResolutionError {
    Resolution(ResolutionError),
    CannotReadFile(std::io::Error),
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
    let mut unprocessed_module = vec![UnprocessedModule {
        absolute_path: absolute_path.to_string(),
        raw_code: raw_code.to_string(),
    }];
    let mut module_map: HashMap<String, ModuleInfo> = HashMap::new();
    let mut errors: Vec<ModuleResolutionError> = vec![];

    while let Some(next_module) = unprocessed_module.pop() {
        if module_map.contains_key(&next_module.absolute_path) {
            continue;
        }

        match resolve_imports(
            &next_module.absolute_path,
            &next_module.raw_code,
            remappings,
            libs,
        ) {
            Ok(imported_paths) => {
                for imported_path in &imported_paths {
                    match read_to_string(&imported_path) {
                        Ok(code) => {
                            let absolute_path: String = imported_path
                                .to_str()
                                .expect("Tevm only supports utf8 files")
                                .to_owned();
                            unprocessed_module.push(UnprocessedModule {
                                raw_code: code,
                                absolute_path,
                            });
                        }
                        Err(err) => errors.push(err.into()),
                    }
                }
                module_map.insert(
                    next_module.absolute_path.to_string(),
                    ModuleInfo {
                        code: next_module.raw_code.to_string(),
                        imported_ids: imported_paths,
                    },
                );
            }
            Err(errs) => {
                module_map.insert(
                    next_module.absolute_path.to_string(),
                    ModuleInfo {
                        code: next_module.raw_code.to_string(),
                        imported_ids: vec![],
                    },
                );
                errors.append(&mut errs.into_iter().map(Into::into).collect());
            }
        }
    }

    if !errors.is_empty() {
        return Err(errors);
    }
    Ok(module_map)
}
