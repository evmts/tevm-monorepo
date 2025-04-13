use std::collections::HashMap;
use std::path::{Path, PathBuf};

pub fn resolve_import_path(
    absolute_path: &str,
    import_path: &str,
    remappings: &HashMap<&str, &str>,
    libs: &Vec<&str>,
) -> PathBuf {
    let dirpath = match Path::new(absolute_path).parent() {
        Some(dirpath) => dirpath,
        None => panic!("expected dirpath"),
    };
    for (val, key) in remappings {
        if import_path.starts_with(key) {
            return dirpath.join(import_path.replace(key, val));
        }
    }
    if import_path.starts_with('.') {
        return dirpath.join(import_path);
    }
    panic!("TODO implement node resolution: return node_resolve(import_path, {basedir: absolutePath, paths: libs})");
}