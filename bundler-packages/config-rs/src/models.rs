use std::path::PathBuf;

/// Represents a module with its code and imported dependencies
///
/// # Fields
/// * `code` - The code content after transforming to correctly resolve remappings and node_module imports
/// * `imported_ids` - List of absolute file paths to modules that are statically imported by this module
pub struct ModuleInfo {
    /// The code after transformed to correctly resolve remappings and node_module imports
    pub code: String,
    /// The module ids statically imported by this module
    pub imported_ids: Vec<PathBuf>,
}

/// Represents a resolved import with original and updated paths
///
/// # Fields
/// * `original` - The original import path as it appears in the source code
/// * `absolute` - The absolute file system path to the imported module
/// * `updated` - The updated import path (may be different from original if remappings were applied)
pub struct ResolvedImport {
    pub original: String,
    pub absolute: String,
    pub updated: String,
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;

    #[test]
    fn test_module_info_creation() {
        let code = "console.log('Hello, world!');".to_string();
        let imported_ids = vec![
            PathBuf::from("/path/to/module1.js"),
            PathBuf::from("/path/to/module2.js"),
        ];

        let module_info = ModuleInfo { code, imported_ids };

        assert_eq!(module_info.code, "console.log('Hello, world!');");
        assert_eq!(module_info.imported_ids.len(), 2);
        assert_eq!(
            module_info.imported_ids[0],
            Path::new("/path/to/module1.js")
        );
        assert_eq!(
            module_info.imported_ids[1],
            Path::new("/path/to/module2.js")
        );
    }

    #[test]
    fn test_resolved_import_creation() {
        let original = "./utils/helper.js".to_string();
        let absolute = "/absolute/path/to/utils/helper.js".to_string();
        let updated = "../utils/helper.js".to_string();

        let resolved_import = ResolvedImport {
            original,
            absolute,
            updated,
        };

        assert_eq!(resolved_import.original, "./utils/helper.js");
        assert_eq!(
            resolved_import.absolute,
            "/absolute/path/to/utils/helper.js"
        );
        assert_eq!(resolved_import.updated, "../utils/helper.js");
    }

    #[test]
    fn test_empty_module_info() {
        let module_info = ModuleInfo {
            code: String::new(),
            imported_ids: vec![],
        };

        assert!(module_info.code.is_empty());
        assert!(module_info.imported_ids.is_empty());
    }

    #[test]
    fn test_module_info_with_complex_paths() {
        let imported_ids = vec![
            PathBuf::from("C:\\Windows\\Path\\module.js"),
            PathBuf::from("/unix/style/path/module.js"),
            PathBuf::from("../relative/path/module.js"),
            PathBuf::from("./another/relative/path/module.js"),
        ];

        let module_info = ModuleInfo {
            code: "// Some code".to_string(),
            imported_ids: imported_ids.clone(),
        };

        assert_eq!(module_info.imported_ids.len(), 4);
        for (i, path) in imported_ids.iter().enumerate() {
            assert_eq!(module_info.imported_ids[i], *path);
        }
    }
}
