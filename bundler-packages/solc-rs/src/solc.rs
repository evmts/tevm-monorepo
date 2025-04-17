use crate::error::SolcError;
use crate::models::{SolcInputDescription, SolcOutput, RELEASES};
use once_cell::sync::Lazy;
use std::path::PathBuf;
use std::process::Command;
use std::sync::Arc;
use tempfile::TempDir;
use tokio::sync::Mutex;
use std::collections::HashMap;
use std::fs;
use std::io::Write;

// Cache for downloaded solc binaries
static SOLC_CACHE: Lazy<Mutex<HashMap<String, PathBuf>>> = Lazy::new(|| Mutex::new(HashMap::new()));
static TEMP_DIR: Lazy<TempDir> = Lazy::new(|| tempfile::TempDir::new().expect("Failed to create temp directory"));

/// The Solc compiler interface
#[derive(Debug, Clone)]
pub struct Solc {
    /// The path to the solc binary
    pub path: Arc<PathBuf>,
    /// The version of the solc compiler
    pub version: String,
}

impl Solc {
    /// Compile Solidity code
    pub fn compile(&self, input: &SolcInputDescription) -> Result<SolcOutput, SolcError> {
        solc_compile(self, input)
    }
}

/// Compile Solidity code using the provided solc compiler
pub fn solc_compile(solc: &Solc, input: &SolcInputDescription) -> Result<SolcOutput, SolcError> {
    // Serialize the input to JSON
    let input_json = serde_json::to_string(input)
        .map_err(|e| SolcError::SerializationError(e.to_string()))?;
    
    // Create a temporary file for the input
    let mut input_file = tempfile::NamedTempFile::new()
        .map_err(|e| SolcError::TempFileError(e))?;
    
    // Write the input JSON to the file
    input_file.write_all(input_json.as_bytes())
        .map_err(|e| SolcError::TempFileError(e))?;
    
    // Run the solc compiler
    let output = Command::new(&*solc.path)
        .arg("--standard-json")
        .arg(input_file.path())
        .output()
        .map_err(|e| SolcError::CompilationError(format!("Failed to execute solc: {}", e)))?;
    
    // Check if the command executed successfully
    if !output.status.success() {
        return Err(SolcError::CompilationError(
            String::from_utf8_lossy(&output.stderr).to_string()
        ));
    }
    
    // Parse the output JSON
    let output_json = String::from_utf8_lossy(&output.stdout);
    let solc_output: SolcOutput = serde_json::from_str(&output_json)
        .map_err(|e| SolcError::SerializationError(format!("Failed to parse solc output: {}", e)))?;
    
    // Check for compilation errors
    if let Some(errors) = &solc_output.errors {
        for error in errors {
            if error.severity == "error" {
                return Err(SolcError::CompilationError(error.message.clone()));
            }
        }
    }
    
    Ok(solc_output)
}

/// Create a solc compiler instance for the specified version
pub async fn create_solc(version: &str) -> Result<Solc, SolcError> {
    // Check if the version is supported
    if !RELEASES.contains_key(version) {
        return Err(SolcError::UnsupportedVersion(version.to_string()));
    }
    
    // Check if we already have this version cached
    let mut cache = SOLC_CACHE.lock().await;
    if let Some(path) = cache.get(version) {
        return Ok(Solc {
            path: Arc::new(path.clone()),
            version: version.to_string(),
        });
    }
    
    // Download the solc binary
    let solc_path = download_solc(version).await?;
    
    // Cache the solc binary path
    cache.insert(version.to_string(), solc_path.clone());
    
    Ok(Solc {
        path: Arc::new(solc_path),
        version: version.to_string(),
    })
}

/// Download the solc binary for the specified version
async fn download_solc(version: &str) -> Result<PathBuf, SolcError> {
    // Get the release filename
    let release = RELEASES.get(version)
        .ok_or_else(|| SolcError::UnsupportedVersion(version.to_string()))?;
    
    // Construct the download URL
    let url = format!("https://binaries.soliditylang.org/bin/{}", release);
    
    // Download the solc binary
    let response = reqwest::get(&url).await?;
    
    // Check if the download was successful
    if !response.status().is_success() {
        return Err(SolcError::LoadError(format!(
            "Failed to download solc version {}: HTTP status {}",
            version, response.status()
        )));
    }
    
    // Get the binary content
    let binary = response.bytes().await?;
    
    // Create a file path in the temp directory
    let file_path = TEMP_DIR.path().join(format!("solc-{}", version));
    
    // Write the binary to the file
    fs::write(&file_path, &binary)
        .map_err(|e| SolcError::TempFileError(e))?;
    
    // Make the file executable
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = fs::metadata(&file_path)
            .map_err(|e| SolcError::TempFileError(e))?
            .permissions();
        perms.set_mode(0o755);
        fs::set_permissions(&file_path, perms)
            .map_err(|e| SolcError::TempFileError(e))?;
    }
    
    Ok(file_path)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::{SolcLanguage, SolcInputSource};
    use std::collections::HashMap;
    
    #[tokio::test]
    async fn test_create_solc() {
        let solc = create_solc("0.8.20").await.unwrap();
        assert_eq!(solc.version, "0.8.20");
    }
    
    #[tokio::test]
    async fn test_unsupported_version() {
        let result = create_solc("0.0.1").await;
        assert!(result.is_err());
    }
    
    #[tokio::test]
    async fn test_solc_compile() {
        // Create a solc compiler instance
        let solc = create_solc("0.8.20").await.unwrap();
        
        // Create a simple contract
        let contract = r#"
            pragma solidity ^0.8.20;
            
            contract SimpleStorage {
                uint256 private storedData;
                
                function set(uint256 x) public {
                    storedData = x;
                }
                
                function get() public view returns (uint256) {
                    return storedData;
                }
            }
        "#;
        
        // Prepare the input
        let mut sources = HashMap::new();
        sources.insert(
            "SimpleStorage.sol".to_string(),
            SolcInputSource {
                keccak256: None,
                urls: None,
                content: Some(contract.to_string()),
            },
        );
        
        let input = SolcInputDescription {
            language: SolcLanguage::Solidity,
            sources,
            settings: None,
        };
        
        // Compile the contract
        let output = solc.compile(&input).unwrap();
        
        // Check if the compilation was successful
        assert!(output.errors.is_none() || output.errors.as_ref().unwrap().iter().all(|e| e.severity != "error"));
        
        // Check if the contract was compiled
        let contracts = output.contracts.unwrap();
        let simple_storage = contracts.get("SimpleStorage.sol").unwrap();
        assert!(simple_storage.contains_key("SimpleStorage"));
    }
}