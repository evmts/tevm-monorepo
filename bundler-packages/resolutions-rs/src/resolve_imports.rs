use regex::Regex;
use std::collections::HashMap;
use std::path::PathBuf;

use crate::resolve_import_path::resolve_import_path;

pub fn resolve_imports(
    absolute_path: &str,
    code: &str,
    remappings: &HashMap<&str, &str>,
    libs: &Vec<&str>,
) -> Vec<PathBuf> {
    let import_regex = Regex::new(r#"^\s?import\s+[^'"]*['"](.*)['"]\s*"#).unwrap();

    let mut all_imports = vec![];

    for caps in import_regex.captures_iter(&code) {
        if let Some(import_path) = caps.get(0) {
            all_imports.push(resolve_import_path(
                absolute_path,
                import_path.as_str(),
                &remappings,
                &libs,
            ))
        };
    }

    all_imports
}