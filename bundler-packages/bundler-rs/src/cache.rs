use crate::models::{BundleResult, CompileResult};
use crate::file_access::FileAccess;
use dashmap::DashMap;
use std::path::{Path, PathBuf};
use std::sync::Arc;

/// Cache for bundling and compilation results
pub struct Cache {
    /// In-memory cache for fast access
    memory_cache: DashMap<String, Arc<CacheEntry>>,
    
    /// File system cache directory
    cache_dir: Option<PathBuf>,
    
    /// File access for persisting cache
    file_access: Arc<FileAccess>,
    
    /// Root directory for relative paths
    root_dir: PathBuf,
    
    /// Whether caching is enabled
    enabled: bool,
}

/// Cache entry can be either a bundle result or a compile result
enum CacheEntry {
    Bundle(BundleResult),
    Compile(CompileResult),
}

impl Cache {
    /// Create a new cache
    pub fn new(
        cache_dir: Option<PathBuf>,
        file_access: Arc<FileAccess>,
        root_dir: PathBuf,
        enabled: bool,
    ) -> Self {
        Self {
            memory_cache: DashMap::new(),
            cache_dir,
            file_access,
            root_dir,
            enabled,
        }
    }
    
    /// Generate a cache key for a bundle operation
    fn bundle_key(&self, file_path: &str, module_type: &str, solc_options_hash: &str) -> String {
        format!("bundle:{}:{}:{}", file_path, module_type, solc_options_hash)
    }
    
    /// Generate a cache key for a compile operation
    fn compile_key(&self, file_path: &str, solc_options_hash: &str) -> String {
        format!("compile:{}:{}", file_path, solc_options_hash)
    }
    
    /// Get a bundle result from cache
    pub async fn get_bundle(
        &self,
        file_path: &str,
        module_type: &str,
        solc_options_hash: &str,
    ) -> Option<BundleResult> {
        if !self.enabled {
            return None;
        }
        
        let key = self.bundle_key(file_path, module_type, solc_options_hash);
        
        // Check memory cache first
        if let Some(entry) = self.memory_cache.get(&key) {
            if let CacheEntry::Bundle(ref result) = **entry {
                return Some(result.clone());
            }
        }
        
        // Check file cache if memory cache misses
        if let Some(ref cache_dir) = self.cache_dir {
            let cache_path = cache_dir.join(format!("{}.json", key.replace(":", "_")));
            
            if let Ok(true) = self.file_access.exists(&cache_path).await {
                if let Ok(content) = self.file_access.read_file(&cache_path).await {
                    if let Ok(result) = serde_json::from_str::<BundleResult>(&content) {
                        // Update memory cache
                        self.memory_cache.insert(key, Arc::new(CacheEntry::Bundle(result.clone())));
                        return Some(result);
                    }
                }
            }
        }
        
        None
    }
    
    /// Store a bundle result in cache
    pub async fn set_bundle(
        &self,
        file_path: &str,
        module_type: &str,
        solc_options_hash: &str,
        result: BundleResult,
    ) {
        if !self.enabled {
            return;
        }
        
        let key = self.bundle_key(file_path, module_type, solc_options_hash);
        
        // Update memory cache
        self.memory_cache.insert(key.clone(), Arc::new(CacheEntry::Bundle(result.clone())));
        
        // Update file cache
        if let Some(ref cache_dir) = self.cache_dir {
            let cache_path = cache_dir.join(format!("{}.json", key.replace(":", "_")));
            
            if let Ok(content) = serde_json::to_string(&result) {
                let _ = self.file_access.write_file(&cache_path, &content).await;
            }
        }
    }
    
    /// Get a compile result from cache
    pub async fn get_compile(
        &self,
        file_path: &str,
        solc_options_hash: &str,
    ) -> Option<CompileResult> {
        if !self.enabled {
            return None;
        }
        
        let key = self.compile_key(file_path, solc_options_hash);
        
        // Check memory cache first
        if let Some(entry) = self.memory_cache.get(&key) {
            if let CacheEntry::Compile(ref result) = **entry {
                return Some(result.clone());
            }
        }
        
        // Check file cache if memory cache misses
        if let Some(ref cache_dir) = self.cache_dir {
            let cache_path = cache_dir.join(format!("{}.json", key.replace(":", "_")));
            
            if let Ok(true) = self.file_access.exists(&cache_path).await {
                if let Ok(content) = self.file_access.read_file(&cache_path).await {
                    if let Ok(result) = serde_json::from_str::<CompileResult>(&content) {
                        // Update memory cache
                        self.memory_cache.insert(key, Arc::new(CacheEntry::Compile(result.clone())));
                        return Some(result);
                    }
                }
            }
        }
        
        None
    }
    
    /// Store a compile result in cache
    pub async fn set_compile(
        &self,
        file_path: &str,
        solc_options_hash: &str,
        result: CompileResult,
    ) {
        if !self.enabled {
            return;
        }
        
        let key = self.compile_key(file_path, solc_options_hash);
        
        // Update memory cache
        self.memory_cache.insert(key.clone(), Arc::new(CacheEntry::Compile(result.clone())));
        
        // Update file cache
        if let Some(ref cache_dir) = self.cache_dir {
            let cache_path = cache_dir.join(format!("{}.json", key.replace(":", "_")));
            
            if let Ok(content) = serde_json::to_string(&result) {
                let _ = self.file_access.write_file(&cache_path, &content).await;
            }
        }
    }
}