use std::{
    collections::{HashMap, HashSet},
    path::PathBuf,
    sync::Arc,
};
use tokio::sync::{Mutex, Semaphore};

use crate::ModuleInfo;

/// All the shared state for module resolution.
///
/// - **mutable** state goes in `Mutex`es/`Semaphore`  
/// - **immutable** state lives behind `Arc` so clones are cheap pointers
#[derive(Clone)]
pub struct ModuleContext {
    // Mutable, shared across tasks:
    pub seen: Arc<Mutex<HashSet<String>>>, // dedupe set
    pub graph: Arc<Mutex<HashMap<String, ModuleInfo>>>, // module graph
    pub sem: Arc<Semaphore>,               // I/O concurrency limiter

    // Immutable, shared across tasks:
    pub remappings: Arc<Vec<(String, String)>>, // prefix→replacement pairs
    pub libs: Arc<Vec<PathBuf>>,                // search roots
}

impl ModuleContext {
    pub fn new(
        max_concurrent_reads: usize,
        remappings: impl IntoIterator<Item = (String, String)>,
        libs: impl IntoIterator<Item = PathBuf>,
    ) -> Self {
        ModuleContext {
            seen: Arc::new(Mutex::new(HashSet::new())),
            graph: Arc::new(Mutex::new(HashMap::new())),
            sem: Arc::new(Semaphore::new(max_concurrent_reads)),
            remappings: Arc::new(remappings.into_iter().collect()),
            libs: Arc::new(libs.into_iter().collect()),
        }
    }
}
