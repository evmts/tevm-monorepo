use std::io;
use thiserror::Error;

/// Errors that can occur when using the solc compiler
#[derive(Error, Debug)]
pub enum SolcError {
    /// Error during solc compilation
    #[error("Compilation error: {0}")]
    CompilationError(String),
    
    /// Error with input/output serialization
    #[error("Serialization error: {0}")]
    SerializationError(String),
    
    /// Error with temporary file handling
    #[error("Temporary file error: {0}")]
    TempFileError(#[from] io::Error),
    
    /// Unknown error
    #[error("Unknown error: {0}")]
    Unknown(String),
}