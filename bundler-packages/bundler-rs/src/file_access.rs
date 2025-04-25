use napi::bindgen_prelude::*;
use std::fs;
use std::path::Path;

/// File access wrapper for file system operations
/// This is a simplified implementation that just uses the Rust standard library
/// For the real implementation, it would use JavaScript callbacks
pub struct FileAccess {
    /// Base directory for operations
    base_dir: String,
}

impl FileAccess {
    /// Create a new FileAccess instance with a base directory
    pub fn new(base_dir: &str) -> Result<Self> {
        Ok(Self {
            base_dir: base_dir.to_string(),
        })
    }
    
    /// Resolve a path relative to the base directory
    fn resolve_path(&self, path: &str) -> String {
        if Path::new(path).is_absolute() {
            path.to_string()
        } else {
            format!("{}/{}", self.base_dir, path)
        }
    }
    
    /// Read a file asynchronously using tokio
    pub async fn read_file(&self, path: &str) -> Result<String> {
        let full_path = self.resolve_path(path);
        
        let result = tokio::task::spawn_blocking(move || {
            fs::read_to_string(&full_path).map_err(|e| {
                Error::new(
                    Status::GenericFailure,
                    format!("Failed to read file {}: {}", full_path, e),
                )
            })
        })
        .await
        .map_err(|e| {
            Error::new(
                Status::GenericFailure,
                format!("Task error: {}", e),
            )
        })?;
        
        result
    }
    
    /// Check if a file exists asynchronously
    pub async fn exists(&self, path: &str) -> Result<bool> {
        let full_path = self.resolve_path(path);
        
        let result = tokio::task::spawn_blocking(move || {
            Ok(Path::new(&full_path).exists())
        })
        .await
        .map_err(|e| {
            Error::new(
                Status::GenericFailure,
                format!("Task error: {}", e),
            )
        })?;
        
        result
    }
    
    /// Write a file asynchronously
    pub async fn write_file(&self, path: &str, content: &str) -> Result<()> {
        let full_path = self.resolve_path(path);
        let content = content.to_string();
        
        let result = tokio::task::spawn_blocking(move || {
            // Create parent directory if it doesn't exist
            if let Some(parent) = Path::new(&full_path).parent() {
                fs::create_dir_all(parent).map_err(|e| {
                    Error::new(
                        Status::GenericFailure,
                        format!("Failed to create directory {}: {}", parent.display(), e),
                    )
                })?;
            }
            
            fs::write(&full_path, content).map_err(|e| {
                Error::new(
                    Status::GenericFailure,
                    format!("Failed to write file {}: {}", full_path, e),
                )
            })
        })
        .await
        .map_err(|e| {
            Error::new(
                Status::GenericFailure,
                format!("Task error: {}", e),
            )
        })?;
        
        result
    }
}

// Make sure FileAccess can be sent across threads
unsafe impl Send for FileAccess {}
unsafe impl Sync for FileAccess {}