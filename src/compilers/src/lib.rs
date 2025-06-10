use foundry_compilers::{
    artifacts::{output_selection::OutputSelection, remappings::Remapping, EvmVersion, Optimizer, Settings, Severity, Source, Sources},
    compilers::{multi::MultiCompiler, solc::Solc},
    ConfigurableArtifacts, ProjectBuilder, ProjectPathsConfig,
};
use libc::c_char;
use serde_json;
use std::{
    ffi::{CStr, CString},
    path::Path,
    ptr,
};

/// Error codes for C interop
#[repr(C)]
pub enum FoundryErrorCode {
    Success = 0,
    SyntaxError = 1,
    VersionError = 2,
    ImportError = 3,
    IoError = 4,
    CompilationError = 5,
    InvalidInput = 6,
    Unknown = 99,
}

/// Error structure for C interop
#[repr(C)]
pub struct FoundryError {
    pub message: *mut c_char,
    pub code: i32,
}

impl FoundryError {
    fn new(code: FoundryErrorCode, message: String) -> *mut Self {
        let error = Box::new(FoundryError {
            message: CString::new(message).unwrap().into_raw(),
            code: code as i32,
        });
        Box::into_raw(error)
    }
}

/// Compiler settings for C interop
#[repr(C)]
pub struct CompilerSettings {
    pub optimizer_enabled: bool,
    pub optimizer_runs: u32,
    pub evm_version: *const c_char,       // "paris", "shanghai", etc.
    pub remappings: *const *const c_char, // NULL-terminated array
    pub cache_enabled: bool,
    pub cache_path: *const c_char, // Can be NULL
    pub output_abi: bool,
    pub output_bytecode: bool,
    pub output_deployed_bytecode: bool,
    pub output_ast: bool,
}

impl Default for CompilerSettings {
    fn default() -> Self {
        CompilerSettings {
            optimizer_enabled: true,
            optimizer_runs: 200,
            evm_version: ptr::null(),
            remappings: ptr::null(),
            cache_enabled: true,
            cache_path: ptr::null(),
            output_abi: true,
            output_bytecode: true,
            output_deployed_bytecode: true,
            output_ast: false,
        }
    }
}

/// Compiled contract data
#[repr(C)]
pub struct CompiledContract {
    pub name: *mut c_char,
    pub abi: *mut c_char,               // JSON string
    pub bytecode: *mut c_char,           // Hex string
    pub deployed_bytecode: *mut c_char, // Hex string
}

/// Compilation result
#[repr(C)]
pub struct CompilationResult {
    pub contracts: *mut CompiledContract,
    pub contracts_count: usize,
    pub errors: *mut CompilerError,
    pub errors_count: usize,
    pub warnings: *mut CompilerError,
    pub warnings_count: usize,
}

/// Compiler error/warning
#[repr(C)]
pub struct CompilerError {
    pub message: *mut c_char,
    pub severity: i32,
    pub error_code: u64,
    pub source_location: *mut c_char, // Can be NULL
}

/// Free a FoundryError
#[no_mangle]
pub unsafe extern "C" fn foundry_free_error(error: *mut FoundryError) {
    if !error.is_null() {
        let error = Box::from_raw(error);
        if !error.message.is_null() {
            let _ = CString::from_raw(error.message);
        }
    }
}

/// Get error message
#[no_mangle]
pub unsafe extern "C" fn foundry_get_error_message(error: *const FoundryError) -> *const c_char {
    if error.is_null() {
        return ptr::null();
    }
    (*error).message
}

/// Get error code
#[no_mangle]
pub unsafe extern "C" fn foundry_get_error_code(error: *const FoundryError) -> i32 {
    if error.is_null() {
        return -1;
    }
    (*error).code
}

/// Compile a single Solidity file
#[no_mangle]
pub unsafe extern "C" fn foundry_compile_file(
    file_path: *const c_char,
    settings: *const CompilerSettings,
    out_result: *mut *mut CompilationResult,
    out_error: *mut *mut FoundryError,
) -> i32 {
    // Initialize outputs
    *out_error = ptr::null_mut();
    *out_result = ptr::null_mut();

    // Validate inputs
    if file_path.is_null() || settings.is_null() {
        *out_error = FoundryError::new(
            FoundryErrorCode::InvalidInput,
            "Invalid input parameters".to_string(),
        );
        return 0;
    }

    // Convert C string to Rust string
    let file_path_str = match CStr::from_ptr(file_path).to_str() {
        Ok(s) => s,
        Err(_) => {
            *out_error = FoundryError::new(
                FoundryErrorCode::InvalidInput,
                "Invalid file path encoding".to_string(),
            );
            return 0;
        }
    };

    // Build project configuration
    let result = build_and_compile_file(file_path_str, &*settings);

    match result {
        Ok(compilation_result) => {
            *out_result = Box::into_raw(Box::new(compilation_result));
            1
        }
        Err(err) => {
            *out_error = err;
            0
        }
    }
}

/// Compile source code from memory
#[no_mangle]
pub unsafe extern "C" fn foundry_compile_source(
    source_name: *const c_char,
    source_content: *const c_char,
    settings: *const CompilerSettings,
    out_result: *mut *mut CompilationResult,
    out_error: *mut *mut FoundryError,
) -> i32 {
    // Initialize outputs
    *out_error = ptr::null_mut();
    *out_result = ptr::null_mut();

    // Validate inputs
    if source_name.is_null() || source_content.is_null() || settings.is_null() {
        *out_error = FoundryError::new(
            FoundryErrorCode::InvalidInput,
            "Invalid input parameters".to_string(),
        );
        return 0;
    }

    // Convert C strings to Rust strings
    let name = match CStr::from_ptr(source_name).to_str() {
        Ok(s) => s,
        Err(_) => {
            *out_error = FoundryError::new(
                FoundryErrorCode::InvalidInput,
                "Invalid source name encoding".to_string(),
            );
            return 0;
        }
    };

    let content = match CStr::from_ptr(source_content).to_str() {
        Ok(s) => s,
        Err(_) => {
            *out_error = FoundryError::new(
                FoundryErrorCode::InvalidInput,
                "Invalid source content encoding".to_string(),
            );
            return 0;
        }
    };

    // Build and compile
    let result = build_and_compile_source(name, content, &*settings);

    match result {
        Ok(compilation_result) => {
            *out_result = Box::into_raw(Box::new(compilation_result));
            1
        }
        Err(err) => {
            *out_error = err;
            0
        }
    }
}

/// Install a specific Solidity compiler version
#[no_mangle]
pub unsafe extern "C" fn foundry_install_solc_version(
    version_str: *const c_char,
    out_error: *mut *mut FoundryError,
) -> i32 {
    *out_error = ptr::null_mut();

    if version_str.is_null() {
        *out_error = FoundryError::new(
            FoundryErrorCode::InvalidInput,
            "Version string is null".to_string(),
        );
        return 0;
    }

    let version = match CStr::from_ptr(version_str).to_str() {
        Ok(s) => s,
        Err(_) => {
            *out_error = FoundryError::new(
                FoundryErrorCode::InvalidInput,
                "Invalid version string encoding".to_string(),
            );
            return 0;
        }
    };

    match version.parse::<semver::Version>() {
        Ok(ver) => match Solc::find_or_install(&ver) {
            Ok(_) => 1,
            Err(e) => {
                *out_error = FoundryError::new(
                    FoundryErrorCode::VersionError,
                    format!("Failed to install solc version {}: {}", version, e),
                );
                0
            }
        },
        Err(e) => {
            *out_error = FoundryError::new(
                FoundryErrorCode::VersionError,
                format!("Invalid version string '{}': {}", version, e),
            );
            0
        }
    }
}

/// Free a string allocated by Rust
#[no_mangle]
pub unsafe extern "C" fn foundry_free_string(str: *mut c_char) {
    if !str.is_null() {
        let _ = CString::from_raw(str);
    }
}

/// Free compilation result
#[no_mangle]
pub unsafe extern "C" fn foundry_free_compilation_result(result: *mut CompilationResult) {
    if result.is_null() {
        return;
    }

    let result = Box::from_raw(result);

    // Free contracts
    if !result.contracts.is_null() {
        let contracts = std::slice::from_raw_parts_mut(result.contracts, result.contracts_count);
        for contract in contracts {
            foundry_free_string(contract.name);
            foundry_free_string(contract.abi);
            foundry_free_string(contract.bytecode);
            foundry_free_string(contract.deployed_bytecode);
        }
        let _ = Vec::from_raw_parts(
            result.contracts,
            result.contracts_count,
            result.contracts_count,
        );
    }

    // Free errors
    if !result.errors.is_null() {
        let errors = std::slice::from_raw_parts_mut(result.errors, result.errors_count);
        for error in errors {
            foundry_free_string(error.message);
            foundry_free_string(error.source_location);
        }
        let _ = Vec::from_raw_parts(result.errors, result.errors_count, result.errors_count);
    }

    // Free warnings
    if !result.warnings.is_null() {
        let warnings = std::slice::from_raw_parts_mut(result.warnings, result.warnings_count);
        for warning in warnings {
            foundry_free_string(warning.message);
            foundry_free_string(warning.source_location);
        }
        let _ = Vec::from_raw_parts(
            result.warnings,
            result.warnings_count,
            result.warnings_count,
        );
    }
}

/// Clear compilation cache
#[no_mangle]
pub unsafe extern "C" fn foundry_clear_cache(
    cache_path: *const c_char,
    out_error: *mut *mut FoundryError,
) -> i32 {
    *out_error = ptr::null_mut();

    let cache_path_str = if cache_path.is_null() {
        ".cache"
    } else {
        match CStr::from_ptr(cache_path).to_str() {
            Ok(s) => s,
            Err(_) => {
                *out_error = FoundryError::new(
                    FoundryErrorCode::InvalidInput,
                    "Invalid cache path encoding".to_string(),
                );
                return 0;
            }
        }
    };

    match std::fs::remove_dir_all(cache_path_str) {
        Ok(_) => 1,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => 1, // Cache didn't exist, that's fine
        Err(e) => {
            *out_error = FoundryError::new(
                FoundryErrorCode::IoError,
                format!("Failed to clear cache: {}", e),
            );
            0
        }
    }
}

// Internal helper functions

fn build_and_compile_file(
    file_path: &str,
    settings: &CompilerSettings,
) -> Result<CompilationResult, *mut FoundryError> {
    let parent = Path::new(file_path)
        .parent()
        .unwrap_or(Path::new("."));
    
    let paths = ProjectPathsConfig::dapptools(parent).map_err(|e| {
        FoundryError::new(
            FoundryErrorCode::IoError,
            format!("Failed to create project paths: {}", e),
        )
    })?;

    let mut builder = ProjectBuilder::<MultiCompiler, ConfigurableArtifacts>::default();
    builder = builder.paths(paths);
    
    // Apply settings to builder
    let mut solc_settings = Settings::default();
    apply_settings_to_solc(&mut solc_settings, settings)?;
    
    let project = builder
        .build(MultiCompiler::default())
        .map_err(|e| {
            FoundryError::new(
                FoundryErrorCode::CompilationError,
                format!("Failed to build project: {}", e),
            )
        })?;

    let output = project.compile_file(file_path).map_err(|e| {
        FoundryError::new(
            FoundryErrorCode::CompilationError,
            format!("Compilation failed: {}", e),
        )
    })?;

    process_output(output)
}

fn build_and_compile_source(
    name: &str,
    content: &str,
    settings: &CompilerSettings,
) -> Result<CompilationResult, *mut FoundryError> {

    let mut sources = Sources::new();
    sources.insert(name.into(), Source::new(content));

    let temp_dir = tempfile::tempdir().map_err(|e| {
        FoundryError::new(
            FoundryErrorCode::IoError,
            format!("Failed to create temp directory: {}", e),
        )
    })?;

    let paths = ProjectPathsConfig::dapptools(temp_dir.path()).map_err(|e| {
        FoundryError::new(
            FoundryErrorCode::IoError,
            format!("Failed to create project paths: {}", e),
        )
    })?;

    let mut builder = ProjectBuilder::<MultiCompiler, ConfigurableArtifacts>::default();
    builder = builder.paths(paths);
    
    // Apply settings to builder
    let mut solc_settings = Settings::default();
    apply_settings_to_solc(&mut solc_settings, settings)?;
    
    let project = builder
        .build(MultiCompiler::default())
        .map_err(|e| {
            FoundryError::new(
                FoundryErrorCode::CompilationError,
                format!("Failed to build project: {}", e),
            )
        })?;

    let output =
        foundry_compilers::project::ProjectCompiler::with_sources(&project, sources)
            .map_err(|e| {
                FoundryError::new(
                    FoundryErrorCode::CompilationError,
                    format!("Failed to create compiler: {}", e),
                )
            })?
            .compile()
            .map_err(|e| {
                FoundryError::new(
                    FoundryErrorCode::CompilationError,
                    format!("Compilation failed: {}", e),
                )
            })?;

    process_output(output)
}

fn apply_settings_to_solc(
    solc_settings: &mut Settings,
    settings: &CompilerSettings,
) -> Result<(), *mut FoundryError> {
    // Apply optimizer settings
    solc_settings.optimizer = Optimizer {
        enabled: Some(settings.optimizer_enabled),
        runs: Some(settings.optimizer_runs as usize),
        details: None,
    };

    // Apply EVM version
    if !settings.evm_version.is_null() {
        let evm_version = unsafe {
            CStr::from_ptr(settings.evm_version)
                .to_str()
                .map_err(|_| {
                    FoundryError::new(
                        FoundryErrorCode::InvalidInput,
                        "Invalid EVM version encoding".to_string(),
                    )
                })?
        };

        if let Ok(version) = evm_version.parse::<EvmVersion>() {
            solc_settings.evm_version = Some(version);
        }
    }

    // Apply remappings
    if !settings.remappings.is_null() {
        let mut remappings = Vec::new();
        let mut i = 0;
        unsafe {
            loop {
                let remapping_ptr = *settings.remappings.add(i);
                if remapping_ptr.is_null() {
                    break;
                }
                let remapping = CStr::from_ptr(remapping_ptr).to_str().map_err(|_| {
                    FoundryError::new(
                        FoundryErrorCode::InvalidInput,
                        "Invalid remapping encoding".to_string(),
                    )
                })?;

                if let Ok(r) = remapping.parse::<Remapping>() {
                    remappings.push(r);
                }
                i += 1;
            }
        }
        solc_settings.remappings = remappings;
    }

    // Apply output selection
    let mut selections = Vec::new();
    
    if settings.output_abi {
        selections.push("abi".to_string());
    }
    if settings.output_bytecode {
        selections.push("evm.bytecode".to_string());
        selections.push("evm.bytecode.object".to_string());
    }
    if settings.output_deployed_bytecode {
        selections.push("evm.deployedBytecode".to_string());
        selections.push("evm.deployedBytecode.object".to_string());
    }
    if settings.output_ast {
        selections.push("ast".to_string());
    }
    
    if !selections.is_empty() {
        solc_settings.output_selection = OutputSelection::common_output_selection(selections);
    } else {
        solc_settings.output_selection = OutputSelection::default_output_selection();
    }

    Ok(())
}

fn process_output(
    output: foundry_compilers::ProjectCompileOutput<MultiCompiler, ConfigurableArtifacts>,
) -> Result<CompilationResult, *mut FoundryError> {
    let mut contracts = Vec::new();
    let mut errors = Vec::new();
    let mut warnings = Vec::new();

    // Process contracts
    for (artifact_id, contract) in output.clone().into_artifacts() {
        let name = format!("{}", artifact_id.name);
        
        let abi_str = contract
            .abi
            .as_ref()
            .map(|abi| serde_json::to_string(abi).unwrap_or_default())
            .unwrap_or_default();

        let bytecode_str = contract
            .bytecode
            .as_ref()
            .map(|b| match &b.object {
                foundry_compilers::artifacts::BytecodeObject::Bytecode(bytes) => {
                    format!("0x{}", hex::encode(bytes))
                }
                foundry_compilers::artifacts::BytecodeObject::Unlinked(s) => {
                    format!("0x{}", s)
                }
            })
            .unwrap_or_default();

        let deployed_bytecode_str = contract
            .deployed_bytecode
            .as_ref()
            .and_then(|b| b.bytecode.as_ref())
            .map(|b| match &b.object {
                foundry_compilers::artifacts::BytecodeObject::Bytecode(bytes) => {
                    format!("0x{}", hex::encode(bytes))
                }
                foundry_compilers::artifacts::BytecodeObject::Unlinked(s) => {
                    format!("0x{}", s)
                }
            })
            .unwrap_or_default();

        contracts.push(CompiledContract {
            name: CString::new(name).unwrap().into_raw(),
            abi: CString::new(abi_str).unwrap().into_raw(),
            bytecode: CString::new(bytecode_str).unwrap().into_raw(),
            deployed_bytecode: CString::new(deployed_bytecode_str).unwrap().into_raw(),
        });
    }

    // Process errors and warnings
    use foundry_compilers::compilers::multi::MultiCompilerError;
    
    for error in output.output().errors.iter() {
        let (message, severity, error_code, source_location) = match error {
            MultiCompilerError::Solc(solc_error) => (
                solc_error.message.clone(),
                match solc_error.severity {
                    Severity::Error => 2,
                    Severity::Warning => 1,
                    Severity::Info => 0,
                },
                solc_error.error_code.unwrap_or(0),
                solc_error.source_location.as_ref().map(|loc| {
                    format!("{}:{}:{}", loc.file, loc.start, loc.end)
                }),
            ),
            MultiCompilerError::Vyper(vyper_error) => (
                vyper_error.to_string(),
                2, // Vyper errors are always errors, not warnings
                0, // Vyper doesn't have error codes
                None, // Vyper error structure is different
            ),
        };

        let compiler_error = CompilerError {
            message: CString::new(message).unwrap().into_raw(),
            severity,
            error_code,
            source_location: source_location
                .map(|s| CString::new(s).unwrap().into_raw())
                .unwrap_or(ptr::null_mut()),
        };

        match severity {
            2 => errors.push(compiler_error),
            1 => warnings.push(compiler_error),
            _ => {}
        }
    }

    // Convert to raw pointers
    let (contracts_ptr, contracts_count) = if contracts.is_empty() {
        (ptr::null_mut(), 0)
    } else {
        let count = contracts.len();
        let mut contracts = contracts.into_boxed_slice();
        let ptr = contracts.as_mut_ptr();
        std::mem::forget(contracts);
        (ptr, count)
    };

    let (errors_ptr, errors_count) = if errors.is_empty() {
        (ptr::null_mut(), 0)
    } else {
        let count = errors.len();
        let mut errors = errors.into_boxed_slice();
        let ptr = errors.as_mut_ptr();
        std::mem::forget(errors);
        (ptr, count)
    };

    let (warnings_ptr, warnings_count) = if warnings.is_empty() {
        (ptr::null_mut(), 0)
    } else {
        let count = warnings.len();
        let mut warnings = warnings.into_boxed_slice();
        let ptr = warnings.as_mut_ptr();
        std::mem::forget(warnings);
        (ptr, count)
    };

    Ok(CompilationResult {
        contracts: contracts_ptr,
        contracts_count,
        errors: errors_ptr,
        errors_count,
        warnings: warnings_ptr,
        warnings_count,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_creation_and_cleanup() {
        unsafe {
            let error = FoundryError::new(FoundryErrorCode::SyntaxError, "Test error".to_string());

            assert_eq!(
                foundry_get_error_code(error),
                FoundryErrorCode::SyntaxError as i32
            );

            let message = CStr::from_ptr(foundry_get_error_message(error))
                .to_str()
                .unwrap();
            assert_eq!(message, "Test error");

            foundry_free_error(error);
        }
    }

    #[test]
    fn test_compile_simple_contract() {
        use std::ffi::CString;
        use std::ptr;

        unsafe {
            let source_name = CString::new("Test.sol").unwrap();
            let source_content = CString::new(
                r#"
                // SPDX-License-Identifier: MIT
                pragma solidity ^0.8.0;
                
                contract Test {
                    uint256 public value;
                    
                    function setValue(uint256 _value) public {
                        value = _value;
                    }
                }
            "#,
            )
            .unwrap();

            let settings = CompilerSettings::default();
            let mut result: *mut CompilationResult = ptr::null_mut();
            let mut error: *mut FoundryError = ptr::null_mut();

            let success = foundry_compile_source(
                source_name.as_ptr(),
                source_content.as_ptr(),
                &settings,
                &mut result,
                &mut error,
            );

            if success == 0 && !error.is_null() {
                let msg = CStr::from_ptr(foundry_get_error_message(error))
                    .to_str()
                    .unwrap();
                eprintln!("Compilation failed: {}", msg);
                foundry_free_error(error);
            }

            assert_eq!(success, 1, "Compilation should succeed");
            assert!(!result.is_null(), "Result should not be null");
            assert!(error.is_null(), "Error should be null");

            if !result.is_null() {
                let result_ref = &*result;
                assert!(result_ref.contracts_count > 0, "Should have compiled contracts");
                assert_eq!(result_ref.errors_count, 0, "Should have no errors");

                foundry_free_compilation_result(result);
            }
        }
    }
}