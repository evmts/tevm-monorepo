use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_int};
use std::path::Path;
use foundry_compilers::{Project, ProjectPathsConfig, compilers::multi::MultiCompiler};
use crate::{create_error, FoundryError, ERROR_INVALID_PATH, ERROR_OTHER, ERROR_COMPILATION};

/// Get the artifacts from a compiled Solidity file
///
/// @param file_path Path to the Solidity file that was compiled
/// @param contract_name Name of the contract to get artifacts for (can be NULL for the first contract)
/// @param out_json Pointer to store the JSON artifact string (must be freed by caller)
/// @param out_error Pointer to store error information (set to NULL if no error)
/// @return 1 on success, 0 on failure (check out_error for details)
#[no_mangle]
pub extern "C" fn foundry_get_artifacts(
    file_path: *const c_char,
    contract_name: *const c_char,
    out_json: *mut *mut c_char,
    out_error: *mut *mut FoundryError,
) -> c_int {
    if !out_error.is_null() {
        unsafe { *out_error = std::ptr::null_mut() };
    }

    if file_path.is_null() {
        if !out_error.is_null() {
            unsafe { *out_error = create_error("File path is null", ERROR_INVALID_PATH) };
        }
        return 0;
    }

    let c_file_str = unsafe { CStr::from_ptr(file_path) };
    let file_str = match c_file_str.to_str() {
        Ok(s) => s,
        Err(_) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error = create_error("Invalid UTF-8 in file path", ERROR_INVALID_PATH)
                };
            }
            return 0;
        }
    };

    // Parse contract name if provided
    let target_contract = if !contract_name.is_null() {
        let c_contract_str = unsafe { CStr::from_ptr(contract_name) };
        match c_contract_str.to_str() {
            Ok(s) if !s.is_empty() => Some(s.to_string()),
            _ => None,
        }
    } else {
        None
    };

    // Get the project directory and setup paths
    let source_path = Path::new(file_str);
    
    // Create a temporary directory for isolated compilation
    let temp_dir = std::env::temp_dir().join(format!("foundry-compile-{}", std::process::id()));
    let _ = std::fs::create_dir_all(&temp_dir);
    
    // Copy the source file to the temp directory
    let file_name = source_path.file_name().unwrap();
    let temp_file_path = temp_dir.join(file_name);
    std::fs::copy(source_path, &temp_file_path).ok();
    
    // Use a paths config that only looks at our temp directory
    let paths = ProjectPathsConfig::builder()
        .sources(&temp_dir)
        .build()
        .unwrap_or_else(|_| ProjectPathsConfig::hardhat(&temp_dir).unwrap());

    // Create and compile the project
    let project = match Project::builder().paths(paths).build(MultiCompiler::default()) {
        Ok(proj) => proj,
        Err(e) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error = create_error(&format!("Project build failed: {}", e), ERROR_OTHER)
                };
            }
            return 0;
        }
    };

    let output = match project.compile() {
        Ok(output) => {
            eprintln!("DEBUG: Compilation successful");
            eprintln!("DEBUG: Has compiler errors: {}", output.has_compiler_errors());
            eprintln!("DEBUG: Has compiler warnings: {}", output.has_compiler_warnings());
            
            // Print any compilation errors
            if output.has_compiler_errors() {
                for error in output.output().errors.iter() {
                    eprintln!("DEBUG: Compilation error: {:?}", error);
                }
            }
            
            output
        },
        Err(e) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error =
                        create_error(&format!("Compilation error: {}", e), ERROR_COMPILATION)
                };
            }
            return 0;
        }
    };

    // Find the contract artifact
    let mut target_artifact = None;
    let mut found_contract_name: Option<String> = None;

    // Debug: print number of artifacts found
    eprintln!("DEBUG: Found {} artifacts", output.artifacts().count());
    
    // Iterate through all artifacts
    for (name, artifact) in output.artifacts() {
        eprintln!("DEBUG: Found contract: {}", name);
        // Check if we're looking for a specific contract
        if let Some(ref target) = target_contract {
            if name == *target {
                target_artifact = Some(artifact);
                found_contract_name = Some(name.clone());
                break;
            }
        } else {
            // Take the first contract if no specific name was requested
            target_artifact = Some(artifact);
            found_contract_name = Some(name.clone());
            break;
        }
    }

    let (artifact, contract_name_str) = match (target_artifact, found_contract_name) {
        (Some(artifact), Some(name)) => (artifact, name),
        _ => {
            if !out_error.is_null() {
                let msg = if let Some(ref target) = target_contract {
                    format!("Contract '{}' not found in {}", target, file_str)
                } else {
                    format!("No contracts found in {}", file_str)
                };
                unsafe {
                    *out_error = create_error(&msg, ERROR_OTHER);
                }
            }
            return 0;
        }
    };

    // Create JSON output
    let abi_json = match artifact.abi {
        Some(ref abi) => {
            match serde_json::to_string(abi) {
                Ok(json) => json,
                Err(e) => {
                    if !out_error.is_null() {
                        unsafe {
                            *out_error = create_error(
                                &format!("Failed to serialize ABI: {}", e),
                                ERROR_OTHER,
                            )
                        };
                    }
                    return 0;
                }
            }
        },
        None => "[]".to_string(),
    };

    let bytecode_str = match &artifact.bytecode {
        Some(bytecode) => {
            // Use debug formatting to get string representation for now
            format!("{:?}", bytecode.object)
        },
        None => "0x".to_string(),
    };

    let json_output = serde_json::json!({
        "contractName": contract_name_str,
        "abi": abi_json.parse::<serde_json::Value>().unwrap_or(serde_json::json!([])),
        "bytecode": bytecode_str
    });

    let json_str = match serde_json::to_string_pretty(&json_output) {
        Ok(s) => s,
        Err(e) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error = create_error(
                        &format!("Failed to serialize output JSON: {}", e),
                        ERROR_OTHER,
                    )
                };
            }
            return 0;
        }
    };

    // Allocate memory for the JSON string and return it
    if !out_json.is_null() {
        match CString::new(json_str) {
            Ok(s) => unsafe { *out_json = s.into_raw() },
            Err(_) => {
                if !out_error.is_null() {
                    unsafe {
                        *out_error = create_error(
                            "Failed to create JSON string",
                            ERROR_OTHER,
                        )
                    };
                }
                return 0;
            }
        }
    }

    // Clean up temp directory
    let _ = std::fs::remove_dir_all(&temp_dir);
    
    1 // Success
}

/// Free a string allocated by the Rust library
///
/// @param str The string to free
#[no_mangle]
pub extern "C" fn foundry_free_string(str: *mut c_char) {
    if !str.is_null() {
        unsafe {
            let _ = CString::from_raw(str);
        }
    }
}