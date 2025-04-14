use std::path::PathBuf;

pub struct ModuleInfo {
    /// the code after transformed to correctly resolve remappings and node_module imports
    pub code: String,
    /// the module ids statically imported by this module
    pub imported_ids: Vec<PathBuf>,
}

pub struct ResolvedImport {
    pub original: String,
    pub absolute: String,
    pub updated: String,
}
