use napi::{CallContext, Error, JsFunction, JsString, Result, Status};
use std::path::Path;
use std::sync::Arc;

/// FileAccess provides an abstraction over file system operations
/// This allows us to support both Node.js and browser environments
pub struct FileAccess {
    read_file: Arc<JsFunction>,
    write_file: Arc<JsFunction>,
    exists: Arc<JsFunction>,
}

impl FileAccess {
    /// Create a new FileAccess with the given JavaScript functions
    pub fn new(js_fao: crate::JsFileAccessObject) -> Result<Self> {
        Ok(Self {
            read_file: Arc::new(js_fao.read_file),
            write_file: Arc::new(js_fao.write_file),
            exists: Arc::new(js_fao.exists),
        })
    }

    /// Read a file asynchronously
    pub async fn read_file<P: AsRef<Path>>(&self, path: P) -> Result<String> {
        let path_str = path.as_ref().to_string_lossy().to_string();
        
        // Call the JavaScript readFile function
        let mut ctx = CallContext::new_with_function(self.read_file.as_ref().clone());
        let js_path = ctx.env.create_string(&path_str)?;
        let result = self.read_file.call(ctx.env.undefined(), &[js_path])?;
        
        // Transform result to string
        let js_string = ctx.env.coerce_to_string(result)?;
        Ok(js_string.into_utf8()?.as_str()?.to_string())
    }

    /// Write a file asynchronously
    pub async fn write_file<P: AsRef<Path>>(&self, path: P, content: &str) -> Result<()> {
        let path_str = path.as_ref().to_string_lossy().to_string();
        
        // Call the JavaScript writeFile function
        let mut ctx = CallContext::new_with_function(self.write_file.as_ref().clone());
        let js_path = ctx.env.create_string(&path_str)?;
        let js_content = ctx.env.create_string(content)?;
        
        self.write_file.call(ctx.env.undefined(), &[js_path, js_content])?;
        
        Ok(())
    }

    /// Check if a file exists asynchronously
    pub async fn exists<P: AsRef<Path>>(&self, path: P) -> Result<bool> {
        let path_str = path.as_ref().to_string_lossy().to_string();
        
        // Call the JavaScript exists function
        let mut ctx = CallContext::new_with_function(self.exists.as_ref().clone());
        let js_path = ctx.env.create_string(&path_str)?;
        let result = self.exists.call(ctx.env.undefined(), &[js_path])?;
        
        // Transform result to boolean
        ctx.env.coerce_to_bool(result).map(|js_bool| js_bool.get_value())
    }
}