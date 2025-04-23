use std::{
    collections::{HashMap, HashSet},
    sync::Arc,
};
use tokio::sync::{Mutex, Semaphore};

use crate::ModuleInfo;

/// All the shared state for module resolution.
///
/// - **mutable** state goes in `Mutex`es/`Semaphore`  
/// - **immutable** state lives behind `Arc` so clones are cheap pointers
#[derive(Clone)]
pub struct State {
    pub seen: Arc<Mutex<HashSet<String>>>, // dedupe set
    pub graph: Arc<Mutex<HashMap<String, ModuleInfo>>>, // module graph
    pub sem: Arc<Semaphore>,               // I/O concurrency limiter
}

impl State {
    pub fn new(max_concurrent_reads: usize) -> Self {
        State {
            seen: Arc::new(Mutex::new(HashSet::new())),
            graph: Arc::new(Mutex::new(HashMap::new())),
            sem: Arc::new(Semaphore::new(max_concurrent_reads)),
        }
    }
}
