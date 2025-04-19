use node_resolve::ResolutionError;

/// Error types that can occur during module resolution
///
/// # Variants
/// * `Resolution` - Error that occurred during import path resolution
/// * `CannotReadFile` - Error that occurred when trying to read a file
#[derive(Debug)]
pub enum ModuleResolutionError {
    Resolution(ResolutionError),
    CannotReadFile(std::io::Error),
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
