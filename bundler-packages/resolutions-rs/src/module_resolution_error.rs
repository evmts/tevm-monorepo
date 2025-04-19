use node_resolve::ResolutionError;
use solar::interface::diagnostics::ErrorGuaranteed;

/// Error types that can occur during module resolution
///
/// # Variants
/// * `Resolution` - Error that occurred during import path resolution
/// * `CannotReadFile` - Error that occurred when trying to read a file
/// * `ParseError` - Error that occurred during parsing of the source file
/// * `MalformedImport` - Error when the import statement is malformed
#[derive(Debug)]
pub enum ModuleResolutionError {
    Resolution(ResolutionError),
    CannotReadFile(std::io::Error),
    ParseError(ErrorGuaranteed),
    MalformedImport(String),
}

impl From<ResolutionError> for ModuleResolutionError {
    fn from(err: ResolutionError) -> Self {
        ModuleResolutionError::Resolution(err)
    }
}

impl From<std::io::Error> for ModuleResolutionError {
    fn from(err: std::io::Error) -> Self {
        ModuleResolutionError::CannotReadFile(err)
    }
}

impl From<ErrorGuaranteed> for ModuleResolutionError {
    fn from(err: ErrorGuaranteed) -> Self {
        ModuleResolutionError::ParseError(err)
    }
}
