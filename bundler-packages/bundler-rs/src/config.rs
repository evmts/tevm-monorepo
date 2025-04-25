/// Configuration for the bundler
pub struct Config {
    /// List of modules to treat as external (won't be bundled)
    pub external_modules: Vec<String>,
    /// Additional directories to check when resolving modules
    pub resolve_dirs: Vec<String>,
    /// Whether to generate source maps
    pub source_map: bool,
    /// Whether to minify the output
    pub minify: bool,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            external_modules: Vec::new(),
            resolve_dirs: Vec::new(),
            source_map: false,
            minify: false,
        }
    }
}

impl From<(Option<Vec<String>>, Option<Vec<String>>, Option<bool>, Option<bool>)> for Config {
    fn from(
        (external_modules, resolve_dirs, source_map, minify): (
            Option<Vec<String>>,
            Option<Vec<String>>,
            Option<bool>,
            Option<bool>,
        ),
    ) -> Self {
        Self {
            external_modules: external_modules.unwrap_or_default(),
            resolve_dirs: resolve_dirs.unwrap_or_default(),
            source_map: source_map.unwrap_or(false),
            minify: minify.unwrap_or(false),
        }
    }
}