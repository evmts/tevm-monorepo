use std::io;
use thiserror::Error;

/// Errors that can occur when using the solc compiler
#[derive(Error, Debug)]
pub enum SolcError {
    /// Error downloading or loading the solc compiler
    #[error("Failed to download or load the solc compiler: {0}")]
    LoadError(String),
    
    /// Error during solc compilation
    #[error("Compilation error: {0}")]
    CompilationError(String),
    
    /// Error with input/output serialization
    #[error("Serialization error: {0}")]
    SerializationError(String),
    
    /// Error with temporary file handling
    #[error("Temporary file error: {0}")]
    TempFileError(#[from] io::Error),
    
    /// Error with HTTP requests for compiler downloads
    #[error("HTTP request error: {0}")]
    HttpError(#[from] reqwest::Error),
    
    /// Unsupported solc version
    #[error("Unsupported solc version: {0}")]
    UnsupportedVersion(String),
    
    /// Unknown error
    #[error("Unknown error: {0}")]
    Unknown(String),
}