use std::path::PathBuf;

pub struct UnprocessedModule<'a> {
    pub absolute_path: &'a str,
    pub raw_code: &'a str,
}

pub struct ModuleInfo<'a> {
    /// the id of the module, for convenience
    pub id: &'a String,
    /// the source code of the module, `None` if external or not yet available
    pub raw_code: &'a Option<String>,
    /// the code after transformed to correctly resolve remappings and node_module imports
    pub code: &'a String,
    /// the module ids statically imported by this module
    pub imported_ids: &'a Vec<PathBuf>,
}

pub struct ResolvedImport {
    pub original: String,
    pub absolute: String,
    pub updated: String,
}