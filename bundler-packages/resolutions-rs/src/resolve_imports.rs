use node_resolve::ResolutionError;
use once_cell::sync::Lazy;
use regex::Regex;
use std::collections::HashMap;
use std::path::PathBuf;

use crate::resolve_import_path::resolve_import_path;

static IMPORT_REGEX: Lazy<Regex> =
    Lazy::new(|| Regex::new(r#"^\s?import\s+[^'"]*['"](.*)['"]\s*"#).unwrap());

/// Resolves module import paths found in the given code.
pub fn resolve_imports(
    absolute_path: &str,
    code: &str,
    remappings: &HashMap<String, String>,
    libs: &[String],
) -> Result<Vec<PathBuf>, Vec<ResolutionError>> {
    let mut all_imports = vec![];
    let mut errors = vec![];

    for caps in IMPORT_REGEX.captures_iter(code) {
        if let Some(import_path) = caps.get(1) {
            match resolve_import_path(absolute_path, import_path.as_str(), remappings, libs) {
                Ok(import_path) => all_imports.push(import_path),
                Err(mut res_errors) => errors.append(&mut res_errors),
            }
        } else {
            panic!("Expected a capture group to exist!")
        }
    }

    if !errors.is_empty() {
        return Err(errors);
    }
    Ok(all_imports)
}

