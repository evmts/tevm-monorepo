use std::path::PathBuf;

/// Represents a module with its code and imported dependencies
///
/// # Fields
/// * `code` - The code content after transforming to correctly resolve remappings and node_module imports
/// * `imported_ids` - List of absolute file paths to modules that are statically imported by this module
#[derive(Debug, Clone)]
pub struct ModuleInfo {
    /// The code after transformed to correctly resolve remappings and node_module imports
    pub code: String,
    /// The module ids statically imported by this module - using Arc to avoid cloning PathBufs
    pub imported_ids: Vec<PathBuf>,
}

/// Represents a resolved import with original and updated paths
///
/// # Fields
/// * `original` - The original import path as it appears in the source code
/// * `absolute` - The absolute file system path to the imported module
/// * `updated` - The updated import path (may be different from original if remappings were applied)
#[derive(Debug, Clone)]
pub struct ResolvedImport {
    pub original: String,
    pub absolute: String,
    pub updated: String,
}
