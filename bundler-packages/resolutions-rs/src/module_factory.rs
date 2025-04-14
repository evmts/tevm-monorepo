use std::collections::HashMap;

use node_resolve::ResolutionError;

use crate::models::ModuleInfo;
use crate::resolve_imports::resolve_imports;

struct UnprocessedModule {
    pub absolute_path: String,
    pub raw_code: String,
}

pub fn module_factory(
    absolute_path: &str,
    raw_code: &str,
    remappings: &HashMap<String, String>,
    libs: &[String],
) -> Result<HashMap<String, ModuleInfo>, Vec<ResolutionError>> {
    let mut unprocessed_module = vec![UnprocessedModule {
        absolute_path: absolute_path.to_string(),
        raw_code: raw_code.to_string(),
    }];
    let mut module_map: HashMap<String, ModuleInfo> = HashMap::new();
    let mut errors: Vec<ResolutionError> = vec![];

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
                module_map.insert(
                    next_module.absolute_path,
                    ModuleInfo {
                        code: next_module.raw_code,
                        imported_ids: imported_paths,
                    },
                );
            }
            Err(mut errs) => errors.append(&mut errs),
        }
    }

    if !errors.is_empty() {
        return Err(errors);
    }
    Ok(module_map)
}

