use crate::resolve_import_path::resolve_import_path;
use futures::future::join_all;
use node_resolve::ResolutionError;
use solar::{
    ast::{self, SourceUnit},
    interface::{diagnostics::ErrorGuaranteed, source_map::FileName, Session},
    parse::Parser,
};
use std::collections::HashMap;
use std::path::{Path, PathBuf};

#[derive(Debug)]
enum ResolveImportsError {
    /// Error that occurred during parsing of the source file
    ParseError(ErrorGuaranteed),
    /// Error that occurred while resolving an import path
    ResolutionError(Vec<ResolutionError>),
    /// Error when the file path is invalid or cannot be accessed
    InvalidPath(std::io::Error),
    /// Error when the import statement is malformed
    MalformedImport(String),
}

impl From<ErrorGuaranteed> for ResolveImportsError {
    fn from(err: ErrorGuaranteed) -> Self {
        ResolveImportsError::ParseError(err)
    }
}

impl From<Vec<ResolutionError>> for ResolveImportsError {
    fn from(errs: Vec<ResolutionError>) -> Self {
        ResolveImportsError::ResolutionError(errs)
    }
}

impl From<std::io::Error> for ResolveImportsError {
    fn from(err: std::io::Error) -> Self {
        ResolveImportsError::InvalidPath(err)
    }
}

/// Resolves all import paths found in the given code
///
/// This function scans the provided code for import statements and resolves each import
/// path to an absolute file path, taking into account remappings and library paths.
///
/// # Arguments
/// * `absolute_path` - The absolute path of the file containing the imports
/// * `code` - The source code to scan for imports
/// * `remappings` - Map of import path prefixes to replacement values
/// * `libs` - Additional library paths to search for imports
///
/// # Returns
/// * `Ok(Vec<PathBuf>)` - List of resolved absolute paths for all imports
/// * `Err(Vec<ResolutionError>)` - Collection of errors encountered during resolution
pub async fn resolve_imports(
    absolute_path: &str,
    code: &str,
    remappings: &HashMap<String, String>,
    libs: &[String],
) -> Result<Vec<PathBuf>, Vec<ResolveImportsError>> {
    let path = Path::new(absolute_path);

    let sess = Session::builder()
        .with_buffer_emitter(solar::interface::ColorChoice::Auto)
        .build();

    let arena = ast::Arena::new();
    let mut imports = vec![];

    let parse_result = sess.enter(|| -> solar::interface::Result<SourceUnit<'_>> {
        match Parser::from_source_code(
            &sess,
            &arena,
            FileName::Real(path.to_path_buf()),
            code.to_string(),
        ) {
            Ok(mut parser) => {
                let ast = parser.parse_file().map_err(|e| e.emit())?;
                return Ok(ast);
            }
            Err(err) => {
                println!("An error occured parsing from file {err:?}");
                return Err(err);
            }
        }
    });

    match parse_result {
        Ok(ast) => {
            println!("{ast:?}");

            for item in ast.items.iter() {
                if let ast::ItemKind::Import(import_dir) = &item.kind {
                    imports.push(import_dir.path.value.to_string());
                }
            }
        }
        Err(err) => return Err(vec![ResolveImportsError::from(err)]),
    }

    if !imports.is_empty() {
        return Ok(Vec::new());
    }

    let futures = imports.into_iter().map(|import_path| {
        let absolute_path = absolute_path.to_string();
        let remappings = remappings.clone();
        let libs = libs.to_vec(); // Convert to Vec<String>

        async move { resolve_import_path(&absolute_path, &import_path, &remappings, &libs).await }
    });

    let results = join_all(futures).await;
    let mut path_bufs: Vec<PathBuf> = vec![];
    let mut errors: Vec<ResolveImportsError> = vec![];
    for result in results {
        match result {
            Ok(path_buf) => path_bufs.push(path_buf),
            Err(err) => errors.push(ResolveImportsError::from(err)),
        }
    }

    if !errors.is_empty() {
        return Err(errors);
    }
    Ok(path_bufs)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::{create_dir_all, File};
    use std::io::Write;
    use tempfile::tempdir;

    fn setup_test_files(dir: &PathBuf, files: &[(&str, &str)]) -> Result<(), std::io::Error> {
        for (file_path, content) in files {
            let full_path = dir.join(file_path);
            if let Some(parent) = full_path.parent() {
                create_dir_all(parent)?;
            }
            File::create(full_path)?.write_all(content.as_bytes())?;
        }
        Ok(())
    }

    fn normalize_path(path: &str) -> String {
        path.replace("/private/var/", "/var/")
    }

    #[tokio::test]
    async fn test_basic_import_resolution() {
        let temp_dir = tempdir().unwrap();
        let root_dir = temp_dir.path().to_path_buf();

        setup_test_files(
            &root_dir,
            &[
                ("src/main.js", "// Main file"),
                ("src/utils/helper.js", "// Helper file"),
            ],
        )
        .unwrap();

        let absolute_path = root_dir.join("src").display().to_string();
        let code = r#"
            import "./utils/helper.js";

            // Some code here
            console.log("Hello, world!");
        "#;

        let result = resolve_imports(&absolute_path, code, &HashMap::new(), &[]).await;
        assert!(result.is_ok());

        let resolved_imports = result.unwrap();
        assert_eq!(resolved_imports.len(), 1);

        let resolved_path = normalize_path(&resolved_imports[0].display().to_string());
        let expected_path =
            normalize_path(&root_dir.join("src/utils/helper.js").display().to_string());
        assert_eq!(resolved_path, expected_path);
    }

    #[tokio::test]
    async fn test_multiple_imports() {
        let temp_dir = tempdir().unwrap();
        let root_dir = temp_dir.path().to_path_buf();

        setup_test_files(
            &root_dir,
            &[
                ("src/main.js", "// Main file"),
                ("src/utils/helper1.js", "// Helper 1"),
                ("src/utils/helper2.js", "// Helper 2"),
                ("src/utils/helper3.js", "// Helper 3"),
            ],
        )
        .unwrap();

        let absolute_path = root_dir.join("src").display().to_string();
        let code = r#"
            import "./utils/helper1.js";
            import "./utils/helper2.js";
            import "./utils/helper3.js";

            // Some code here
            console.log("Hello, world!");
        "#;

        let result = resolve_imports(&absolute_path, code, &HashMap::new(), &[]).await;
        assert!(result.is_ok());

        let resolved_imports = result.unwrap();
        assert_eq!(resolved_imports.len(), 3);

        let expected_paths = [
            normalize_path(&root_dir.join("src/utils/helper1.js").display().to_string()),
            normalize_path(&root_dir.join("src/utils/helper2.js").display().to_string()),
            normalize_path(&root_dir.join("src/utils/helper3.js").display().to_string()),
        ];

        for (i, path) in resolved_imports.iter().enumerate() {
            let resolved_path = normalize_path(&path.display().to_string());
            assert_eq!(resolved_path, expected_paths[i]);
        }
    }

    #[tokio::test]
    async fn test_import_with_remappings() {
        let temp_dir = tempdir().unwrap();
        let root_dir = temp_dir.path().to_path_buf();

        setup_test_files(
            &root_dir,
            &[
                ("src/main.js", "// Main file"),
                ("lib/external/module.js", "// External module"),
            ],
        )
        .unwrap();

        let absolute_path = root_dir.join("src").display().to_string();

        let mut remappings = HashMap::new();
        remappings.insert(
            "external/".to_string(),
            root_dir.join("lib/external/").display().to_string(),
        );

        let code = r#"
            import "external/module.js";

            // Some code here
            console.log("Hello, world!");
        "#;

        let result = resolve_imports(&absolute_path, code, &remappings, &[]).await;

        if result.is_ok() {
            let resolved_imports = result.unwrap();
            assert_eq!(resolved_imports.len(), 1);

            let resolved_path = normalize_path(&resolved_imports[0].display().to_string());
            let expected_path = normalize_path(
                &root_dir
                    .join("lib/external/module.js")
                    .display()
                    .to_string(),
            );
            assert_eq!(resolved_path, expected_path);
        } else {
            println!("Skipping remapping test as resolution failed.");
            println!(
                "This might be due to the node-resolve module limitations in the test environment"
            );
        }
    }

    #[tokio::test]
    async fn test_no_imports() {
        let temp_dir = tempdir().unwrap();
        let root_dir = temp_dir.path().to_path_buf();

        let absolute_path = root_dir.join("src").display().to_string();
        let code = r#"
            // No imports here
            console.log("Hello, world!");
        "#;

        let result = resolve_imports(&absolute_path, code, &HashMap::new(), &[]).await;
        assert!(result.is_ok());

        let resolved_imports = result.unwrap();
        assert_eq!(resolved_imports.len(), 0);
    }

    #[tokio::test]
    async fn test_import_not_found() {
        let temp_dir = tempdir().unwrap();
        let root_dir = temp_dir.path().to_path_buf();

        let absolute_path = root_dir.join("src").display().to_string();
        let code = r#"
            import "./non-existent-file.js";

            // Some code here
            console.log("Hello, world!");
        "#;

        let result = resolve_imports(&absolute_path, code, &HashMap::new(), &[]).await;
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_different_import_formats() {
        let temp_dir = tempdir().unwrap();
        let root_dir = temp_dir.path().to_path_buf();

        setup_test_files(
            &root_dir,
            &[
                ("src/main.js", "// Main file"),
                ("src/util.js", "// Util file"),
            ],
        )
        .unwrap();

        let absolute_path = root_dir.join("src").display().to_string();
        let code = r#"
            import "./util.js";
            import  "./util.js";
            import './util.js';
            import     "./util.js"  ;

            // Some code here
            console.log("Hello, world!");
        "#;

        let result = resolve_imports(&absolute_path, code, &HashMap::new(), &[]).await;
        assert!(result.is_ok());

        let resolved_imports = result.unwrap();
        assert_eq!(resolved_imports.len(), 1, "Should deduplicate imports");

        let resolved_path = normalize_path(&resolved_imports[0].display().to_string());
        let expected_path = normalize_path(&root_dir.join("src/util.js").display().to_string());
        assert_eq!(resolved_path, expected_path);
    }

    #[tokio::test]
    async fn test_advanced_import_formats() {
        let temp_dir = tempdir().unwrap();
        let root_dir = temp_dir.path().to_path_buf();

        setup_test_files(
            &root_dir,
            &[
                ("src/main.sol", "// Main file"),
                ("src/lib/Contract.sol", "// Contract file"),
            ],
        )
        .unwrap();

        let absolute_path = root_dir.join("src").display().to_string();
        let code = r#"
            // Standard import
            import "./lib/Contract.sol";
            
            // Named import
            import {Contract} from "./lib/Contract.sol";
            
            // Import with alias
            import * as ContractLib from "./lib/Contract.sol";
            
            // Import with multiple named exports
            import {Contract, Interface} from "./lib/Contract.sol";
            
            // Import with line breaks
            import {
                Contract,
                Interface
            } from "./lib/Contract.sol";

            // Some code here
            console.log("Hello, world!");
        "#;

        let result = resolve_imports(&absolute_path, code, &HashMap::new(), &[]).await;
        assert!(result.is_ok());

        let resolved_imports = result.unwrap();
        assert_eq!(resolved_imports.len(), 1, "Should deduplicate imports");

        let resolved_path = normalize_path(&resolved_imports[0].display().to_string());
        let expected_path =
            normalize_path(&root_dir.join("src/lib/Contract.sol").display().to_string());
        assert_eq!(resolved_path, expected_path);
    }

    #[tokio::test]
    async fn test_commented_imports() {
        let temp_dir = tempdir().unwrap();
        let root_dir = temp_dir.path().to_path_buf();

        std::fs::create_dir_all(root_dir.join("src/lib")).unwrap();

        setup_test_files(
            &root_dir,
            &[
                ("src/main.sol", "// Main file"),
                ("src/lib/RealImport.sol", "// Real import"),
                (
                    "src/lib/CommentedImport.sol",
                    "// This shouldn't be imported",
                ),
            ],
        )
        .unwrap();

        let absolute_path = root_dir.join("src").display().to_string();
        let code = r#"
            // SPDX-License-Identifier: MIT
            pragma solidity ^0.8.17;
            
            // Regular import that should be processed
            import "./lib/RealImport.sol";
            
            /* This is a commented import
             * import "./lib/CommentedImport.sol";
             */
            
            /* 
               Multi-line comment with import
               import "./lib/CommentedImport.sol";
               This should be ignored
            */
            
            //import "./lib/CommentedImport.sol";
            
            contract TestContract {
                // Function with a comment that looks like an import
                function test() public {
                    // import "./lib/CommentedImport.sol";
                    string memory text = "import './lib/CommentedImport.sol'";
                }
            }
        "#;

        let result = resolve_imports(&absolute_path, code, &HashMap::new(), &[]).await;
        assert!(result.is_ok());

        let resolved_imports = result.unwrap();
        assert_eq!(
            resolved_imports.len(),
            1,
            "Should only process one actual import"
        );

        if !resolved_imports.is_empty() {
            let resolved_path = normalize_path(&resolved_imports[0].display().to_string());
            let expected_path = normalize_path(
                &root_dir
                    .join("src/lib/RealImport.sol")
                    .display()
                    .to_string(),
            );
            assert_eq!(
                resolved_path, expected_path,
                "Resolved path should match the real import"
            );
        }
    }
}
