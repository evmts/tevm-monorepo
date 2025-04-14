use node_resolve::{resolve_from, ResolutionError};
use std::collections::HashMap;
use std::iter::once;
use std::path::{Path, PathBuf};

pub fn resolve_import_path(
    absolute_path: &str,
    import_path: &str,
    remappings: &HashMap<String, String>,
    libs: &[String],
) -> Result<PathBuf, Vec<ResolutionError>> {
    let dirpath = match Path::new(absolute_path).parent() {
        Some(dirpath) => dirpath,
        None => panic!("expected dirpath"),
    };
    for (val, key) in remappings {
        if import_path.starts_with(key) {
            return Ok(dirpath.join(import_path.replace(key, val)));
        }
    }
    if import_path.starts_with('.') {
        return Ok(dirpath.join(import_path));
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
