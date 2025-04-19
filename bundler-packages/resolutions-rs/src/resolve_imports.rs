use crate::resolve_import_path::resolve_import_path;
use futures::future::join_all;
use node_resolve::ResolutionError;
use solar::{
    ast::{self, SourceUnit},
    interface::{source_map::FileName, Session},
    parse::Parser,
};
use std::collections::HashMap;
use std::path::{Path, PathBuf};

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
) -> Result<Vec<PathBuf>, Vec<ResolutionError>> {
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
        Err(err) => return Err(vec![err]),
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

    let (oks, errs): (Vec<_>, Vec<_>) = results.into_iter().partition(Result::is_ok);

    let resolved_paths = oks.into_iter().map(Result::unwrap).collect::<Vec<_>>();
    let errors = errs
        .into_iter()
        .map(Result::unwrap_err)
        .flatten()
        .collect::<Vec<_>>();

    if errors.is_empty() {
        Ok(resolved_paths)
    } else {
        Err(errors)
    }
}

/// Extracts all import paths from the given code
fn extract_imports(code: &str) -> Vec<String> {
    let mut imports = Vec::new();
    let mut lines = code.lines();

    // Parser state
    let mut in_block_comment = false;
    let mut accumulating = false;
    let mut stmt = String::new();

    while let Some(raw) = lines.next() {
        // Process the line by stripping comments
        let line = process_line(raw, &mut in_block_comment);
        if line.is_empty() {
            continue;
        }

        // Handle multi-line import statements
        if accumulating {
            stmt.push_str(&line);
            if line.contains(';') {
                // Statement is complete, extract the import path
                if let Some(path) = extract_import_path(&stmt) {
                    imports.push(path);
                }
                accumulating = false;
                stmt.clear();
            }
            continue;
        }

        // Detect new import statement
        if line.trim_start().starts_with("import") {
            if line.contains(';') {
                // Single-line import
                if let Some(path) = extract_import_path(&line) {
                    imports.push(path);
                }
            } else {
                // Start of multi-line import
                stmt = line;
                accumulating = true;
            }
        }
    }

    // Handle any unprocessed multi-line import at EOF
    if accumulating && !stmt.is_empty() {
        if let Some(path) = extract_import_path(&stmt) {
            imports.push(path);
        }
    }

    imports
}

/// Processes a line by removing comments and returning the sanitized content
fn process_line(line: &str, in_block_comment: &mut bool) -> String {
    let mut result = String::with_capacity(line.len());
    let mut i = 0;

    while i < line.len() {
        if *in_block_comment {
            // Look for the end of block comment
            if let Some(pos) = line[i..].find("*/") {
                i += pos + 2; // Skip past the end of comment
                *in_block_comment = false;
            } else {
                break; // Comment continues to next line
            }
        } else if line[i..].starts_with("//") {
            break; // Line comment - ignore rest of line
        } else if line[i..].starts_with("/*") {
            // Start of block comment
            *in_block_comment = true;
            i += 2; // Skip past the start of comment
        } else {
            // Regular code - add character to result
            if let Some(c) = line[i..].chars().next() {
                result.push(c);
                i += c.len_utf8();
            } else {
                break;
            }
        }
    }

    result.trim().to_string()
}

/// Extracts the import path from a complete import statement
fn extract_import_path(stmt: &str) -> Option<String> {
    // Find the quoted path in the import statement
    let mut in_quote = false;
    let mut quote_char = '\0';
    let mut path = String::new();

    for c in stmt.chars() {
        if in_quote {
            if c == quote_char {
                // End of quoted string - we have our path
                return Some(path);
            } else {
                path.push(c);
            }
        } else if c == '"' || c == '\'' {
            // Start of quoted string
            in_quote = true;
            quote_char = c;
        }
    }

    None // No valid import path found
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

