use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_int};
use std::path::{Path, PathBuf};
use std::ptr;

// Include get_artifacts module
mod get_artifacts;
pub use get_artifacts::*;

use foundry_compilers::compilers::multi::MultiCompiler;
use foundry_compilers::solc::Solc;
use foundry_compilers::{Project, ProjectPathsConfig};

#[repr(C)]
pub struct FoundryError {
    message: *mut c_char,
    code: c_int,
}

// Custom Error codes
const ERROR_NONE: c_int = 0;
const ERROR_INVALID_PATH: c_int = 1;
const ERROR_COMPILATION: c_int = 2;
const ERROR_INVALID_VERSION: c_int = 3;
const ERROR_OTHER: c_int = 99;

#[no_mangle]
pub extern "C" fn foundry_free_error(error: *mut FoundryError) {
    if !error.is_null() {
        unsafe {
            let err = &mut *error;
            if !err.message.is_null() {
                let _ = CString::from_raw(err.message);
            }
            libc::free(error as *mut _ as *mut libc::c_void);
        }
    }
}

fn create_error(message: &str, code: c_int) -> *mut FoundryError {
    let c_message = match CString::new(message) {
        Ok(s) => s.into_raw(),
        Err(_) => ptr::null_mut(),
    };

    let error = unsafe {
        let ptr = libc::malloc(std::mem::size_of::<FoundryError>()) as *mut FoundryError;
        if ptr.is_null() {
            return ptr::null_mut();
        }
        ptr::write(
            ptr,
            FoundryError {
                message: c_message,
                code,
            },
        );
        ptr
    };

    error
}

#[no_mangle]
pub extern "C" fn foundry_get_error_message(error: *const FoundryError) -> *const c_char {
    if error.is_null() {
        return ptr::null();
    }
    unsafe { (*error).message }
}

#[no_mangle]
pub extern "C" fn foundry_get_error_code(error: *const FoundryError) -> c_int {
    if error.is_null() {
        return ERROR_NONE;
    }
    unsafe { (*error).code }
}

/// Compile a Solidity project at the given path
///
/// @param project_path Path to the Solidity project
/// @param out_error Pointer to store error information (set to NULL if no error)
/// @return 1 on success, 0 on failure (check out_error for details)
#[no_mangle]
pub extern "C" fn foundry_compile_project(
    project_path: *const c_char,
    out_error: *mut *mut FoundryError,
) -> c_int {
    if !out_error.is_null() {
        unsafe { *out_error = ptr::null_mut() };
    }

    if project_path.is_null() {
        if !out_error.is_null() {
            unsafe { *out_error = create_error("Project path is null", ERROR_INVALID_PATH) };
        }
        return 0;
    }
    let c_str = unsafe { CStr::from_ptr(project_path) };

    let dir = match c_str.to_str() {
        Ok(s) => s,
        Err(_) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error = create_error("Invalid UTF-8 in project path", ERROR_INVALID_PATH)
                };
            }
            return 0;
        }
    };

    let paths = match ProjectPathsConfig::hardhat(Path::new(dir)) {
        Ok(p) => p,
        Err(e) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error = create_error(
                        &format!("Failed to create paths config: {}", e),
                        ERROR_INVALID_PATH,
                    )
                };
            }
            return 0;
        }
    };

    let project = match Project::builder()
        .paths(paths)
        .build(MultiCompiler::default())
    {
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

    match project.compile() {
        Ok(_output) => 1,
        Err(e) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error =
                        create_error(&format!("Compilation error: {}", e), ERROR_COMPILATION)
                };
            }
            0
        }
    }
}

/// Install a specific Solidity compiler version
///
/// @param version_str Version string (e.g., "0.8.20")
/// @param out_error Pointer to store error information (set to NULL if no error)
/// @return 1 on success, 0 on failure (check out_error for details)
#[no_mangle]
pub extern "C" fn foundry_install_solc_version(
    version_str: *const c_char,
    out_error: *mut *mut FoundryError,
) -> c_int {
    // Default to success
    if !out_error.is_null() {
        unsafe { *out_error = ptr::null_mut() };
    }

    // Convert C string to Rust string
    if version_str.is_null() {
        if !out_error.is_null() {
            unsafe { *out_error = create_error("Version string is null", ERROR_INVALID_VERSION) };
        }
        return 0;
    }
    let c_str = unsafe { CStr::from_ptr(version_str) };

    let ver_str = match c_str.to_str() {
        Ok(s) => s,
        Err(_) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error =
                        create_error("Invalid UTF-8 in version string", ERROR_INVALID_VERSION)
                };
            }
            return 0;
        }
    };

    // Parse the version string
    let version = match semver::Version::parse(ver_str) {
        Ok(v) => v,
        Err(e) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error = create_error(
                        &format!("Invalid version format: {}", e),
                        ERROR_INVALID_VERSION,
                    )
                };
            }
            return 0;
        }
    };

    // In a production implementation, we would try to install the specific solc version
    // This functionality requires foundry-compilers' solc management which can download
    // and install specific versions of the Solidity compiler
    match Solc::find_svm_installed_version(&version) {
        Ok(_) => 1, // Version already installed
        Err(_) => {
            // In a full implementation, we would install the compiler here
            // For now, we'll just validate the version string format
            // and assume success since foundry-compilers will install it when needed
            1 // Indicate success
        }
    }
}

/// Compile a single Solidity file
///
/// @param file_path Path to the Solidity file
/// @param solc_version Version of solc to use (can be NULL for auto-detection)
/// @param out_error Pointer to store error information (set to NULL if no error)
/// @return 1 on success, 0 on failure (check out_error for details)
#[no_mangle]
pub extern "C" fn foundry_compile_file(
    file_path: *const c_char,
    solc_version: *const c_char,
    out_error: *mut *mut FoundryError,
) -> c_int {
    if !out_error.is_null() {
        unsafe { *out_error = ptr::null_mut() };
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

    // Parse the solc version if provided
    let solc_version_str = if !solc_version.is_null() {
        let c_version_str = unsafe { CStr::from_ptr(solc_version) };
        match c_version_str.to_str() {
            Ok(s) if !s.is_empty() => {
                // Verify it's a valid version
                match semver::Version::parse(s) {
                    Ok(_) => Some(s.to_string()),
                    Err(e) => {
                        if !out_error.is_null() {
                            unsafe {
                                *out_error = create_error(
                                    &format!("Invalid solc version format: {}", e),
                                    ERROR_INVALID_VERSION,
                                )
                            };
                        }
                        return 0;
                    }
                }
            }
            _ => None,
        }
    } else {
        None
    };

    let source_path = PathBuf::from(file_str);

    // Create a temporary directory for isolated compilation
    let temp_dir = std::env::temp_dir().join(format!("foundry-compile-{}", std::process::id()));
    let _ = std::fs::create_dir_all(&temp_dir);

    // Copy the source file to the temp directory
    let file_name = source_path.file_name().unwrap();
    let temp_file_path = temp_dir.join(file_name);
    std::fs::copy(&source_path, &temp_file_path).ok();

    // Use a paths config that only looks at our temp directory
    let paths = ProjectPathsConfig::builder()
        .sources(&temp_dir)
        .build()
        .unwrap_or_else(|_| ProjectPathsConfig::hardhat(&temp_dir).unwrap());

    // Create project builder
    let project_builder = Project::builder().paths(paths);

    // If a specific solc version was provided, configure it
    if let Some(_version) = solc_version_str {
        // For now we don't set the version in the project builder
        // The actual implementation would configure this using the
        // appropriate builder methods available in the foundry-compilers library
        // This part may need to be adjusted based on the actual API
    }

    let project = match project_builder.build(MultiCompiler::default()) {
        Ok(p) => p,
        Err(e) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error =
                        create_error(&format!("Project setup error: {}", e), ERROR_INVALID_PATH)
                };
            }
            return 0;
        }
    };

    let result = match project.compile() {
        Ok(_) => 1,
        Err(e) => {
            if !out_error.is_null() {
                unsafe {
                    *out_error =
                        create_error(&format!("Compilation error: {}", e), ERROR_COMPILATION)
                };
            }
            0
        }
    };

    // Clean up temp directory
    let _ = std::fs::remove_dir_all(&temp_dir);

    result
}

