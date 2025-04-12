use regex::Regex;
use std::{collections::HashMap, io};

// #[macro_use]
extern crate napi_derive;

// #[napi]

struct UnprocessedModule<'a> {
    absolute_path: &'a str,
    raw_code: &'a str,
}

struct ModuleInfo {
    /// the id of the module, for convenience
    id: String,
    /// the source code of the module, `None` if external or not yet available
    raw_code: Option<String>,
    /// the code after transformed to correctly resolve remappings and node_module imports
    code: String,
    /// the module ids statically imported by this module
    imported_ids: Vec<String>,
}

type ModuleMap = HashMap<String, ModuleInfo>;

struct ResolvedImport {
    original: String,
    absolute: String,
    updated: String,
}

pub fn resolve_imports(
    absolutePath: &str,
    code: &str,
    remappings: HashMap<&str, &str>,
    libs: Vec<&str>,
) -> Result<Vec<ResolvedImport>, io::Error> {
    let import_regex = Regex::new(r#"^\s?import\s+[^'"]*['"](.*)['"]\s*"#).unwrap();

    for caps in import_regex.captures_iter(&code) {}

    Err(io::Error::new(io::ErrorKind::Other, "placeholder"))
}
pub fn module_factory(
    absolute_path: &str,
    raw_code: &str,
    remappings: HashMap<&str, &str>,
    libs: Vec<&str>,
) -> ModuleMap {
    let mut unprocessed_module = vec![UnprocessedModule {
        absolute_path,
        raw_code,
    }];
    let mut module_map = HashMap::new();

    while let Some(next_module) = unprocessed_module.pop() {
        if module_map.contains_key(next_module.absolute_path) {
            continue;
        }
    }

    module_map
}
