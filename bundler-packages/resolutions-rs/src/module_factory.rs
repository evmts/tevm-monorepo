use std::collections::HashMap;

use crate::models::{ModuleInfo, UnprocessedModule};
use crate::resolve_imports::resolve_imports;

pub fn module_factory(
    absolute_path: &str,
    raw_code: &str,
    remappings: HashMap<&str, &str>,
    libs: Vec<&str>,
) -> HashMap<String, ModuleInfo> {
    let mut unprocessed_module = vec![UnprocessedModule {
        absolute_path,
        raw_code,
    }];
    let mut module_map = HashMap::new();

    while let Some(next_module) = unprocessed_module.pop() {
        if module_map.contains_key(next_module.absolute_path) {
            continue;
        }

        let resolved_imports = resolve_imports(
            next_module.absolute_path,
            next_module.raw_code,
            &remappings,
            &libs,
        );

        module_map.insert(
            next_module.absolute_path,
            ModuleInfo {
                raw_code: Some(next_module.raw_code),
                id: next_module.absolute_path,
                // TODO we need to do the update pragma hack
                code: next_module.raw_code,
                imported_ids: &resolve_imports(
                    absolute_path,
                    next_module.raw_code,
                    &remappings,
                    &libs,
                ),
            },
        );
    }

    module_map
}