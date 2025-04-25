use std::collections::HashMap;
use std::path::PathBuf;

#[derive(Debug)]
pub struct BundleError {
    pub message: String,
    pub path: Option<PathBuf>,
}

impl std::fmt::Display for BundleError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match &self.path {
            Some(path) => write!(f, "{} (in {})", self.message, path.display()),
            None => write!(f, "{}", self.message),
        }
    }
}

impl std::error::Error for BundleError {}

pub struct BundleOptions {
    pub entry_point: PathBuf,
    pub external_modules: Vec<String>,
    pub resolve_dirs: Vec<String>,
    pub source_map: bool,
    pub minify: bool,
}

pub struct BundleResult {
    pub code: String,
    pub source_map: Option<String>,
    pub modules: HashMap<String, String>,
}