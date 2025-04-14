use node_resolve::{resolve_from, ResolutionError};
use std::collections::HashMap;
use std::iter::once;
use std::path::PathBuf;

pub fn resolve_import_path(
    absolute_path: &str,
    import_path: &str,
    remappings: &HashMap<String, String>,
    libs: &[String],
) -> Result<PathBuf, Vec<ResolutionError>> {
    for (val, key) in remappings {
        if import_path.starts_with(key) {
            return resolve_import_path(
                absolute_path,
                &import_path.replace(key, val),
                &HashMap::new(),
                libs,
            );
        }
    }
    let mut errors: Vec<ResolutionError> = vec![];
    for lib in once(absolute_path).chain(libs.iter().map(String::as_str)) {
        match resolve_from(import_path, PathBuf::from(lib)) {
            Ok(result) => return Ok(result),
            Err(err) => errors.push(err),
        }
    }
    return Err(errors);
}
