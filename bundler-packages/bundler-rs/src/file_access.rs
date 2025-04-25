use crate::JsFileAccessObject;
use napi::bindgen_prelude::*;
use std::path::PathBuf;
use std::sync::Arc;

/// File access wrapper that uses JavaScript callbacks
pub struct FileAccess {
    js_object: Arc<JsFileAccessObject>,
    env: Env,
}

impl FileAccess {
    /// Create a new FileAccess instance from a JavaScript file access object
    pub fn new(js_object: JsFileAccessObject) -> Result<Self> {
        let env = js_object.read_file.env;
        
        Ok(Self {
            js_object: Arc::new(js_object),
            env,
        })
    }
    
    /// Read a file asynchronously
    pub async fn read_file(&self, path: &str) -> Result<String> {
        let js_path = self.env.create_string(path)?;
        let result = self.js_object.read_file.call(None, &[js_path])?;
        
        // If the result is already a string, return it
        if result.is_string() {
            let str_result: String = self.env.coerce_to_string(result)?.into_utf8()?.into_owned()?;
            return Ok(str_result);
        }
        
        // If it's a Promise, await it
        if result.is_promise() {
            let deferred = self.env.create_deferred::<String>()?;
            result.coerce_to_object()?.add_finalizer(
                deferred,
                |env, result: napi::JsUnknown, deferred| {
                    match env.coerce_to_string(result).and_then(|s| s.into_utf8()).and_then(|s| s.into_owned()) {
                        Ok(s) => deferred.resolve(|_| Ok(s)),
                        Err(e) => deferred.reject(e),
                    }
                },
            )?;
            
            return deferred.promise.await;
        }
        
        Err(Error::new(
            Status::InvalidArg,
            "read_file must return a string or Promise<string>".to_string(),
        ))
    }
    
    /// Check if a file exists asynchronously
    pub async fn exists(&self, path: &str) -> Result<bool> {
        let js_path = self.env.create_string(path)?;
        let result = self.js_object.exists.call(None, &[js_path])?;
        
        // If the result is already a boolean, return it
        if result.is_boolean() {
            let bool_result: bool = self.env.get_value_bool(result)?;
            return Ok(bool_result);
        }
        
        // If it's a Promise, await it
        if result.is_promise() {
            let deferred = self.env.create_deferred::<bool>()?;
            result.coerce_to_object()?.add_finalizer(
                deferred,
                |env, result: napi::JsUnknown, deferred| {
                    match env.get_value_bool(result) {
                        Ok(b) => deferred.resolve(|_| Ok(b)),
                        Err(e) => deferred.reject(e),
                    }
                },
            )?;
            
            return deferred.promise.await;
        }
        
        Err(Error::new(
            Status::InvalidArg,
            "exists must return a boolean or Promise<boolean>".to_string(),
        ))
    }
    
    /// Write a file asynchronously
    pub async fn write_file(&self, path: &str, content: &str) -> Result<()> {
        let js_path = self.env.create_string(path)?;
        let js_content = self.env.create_string(content)?;
        let result = self.js_object.write_file.call(None, &[js_path, js_content])?;
        
        // If the result is undefined or null, return success
        if result.is_undefined() || result.is_null() {
            return Ok(());
        }
        
        // If it's a Promise, await it
        if result.is_promise() {
            let deferred = self.env.create_deferred::<()>()?;
            result.coerce_to_object()?.add_finalizer(
                deferred,
                |_env, _result: napi::JsUnknown, deferred| {
                    deferred.resolve(|_| Ok(()))
                },
            )?;
            
            return deferred.promise.await;
        }
        
        Err(Error::new(
            Status::InvalidArg,
            "write_file must return undefined, null, or Promise<void>".to_string(),
        ))
    }
}