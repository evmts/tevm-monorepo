use std::path::PathBuf;

use crate::resolve_imports::ResolveImportsError;
use crate::state::State;
use crate::{resolve_imports, Config, ModuleInfo};
use tokio::fs;
use tokio::sync::OwnedSemaphorePermit;

/// Read a module (or use provided code), resolve its imports, insert into `ctx.graph`,
/// and return the list of child imports.
pub async fn process_module(
    path: PathBuf,
    code_opt: Option<String>,
    cfg: &Config,
    state: State,
    _permit: OwnedSemaphorePermit,
) -> Result<String, Vec<ResolveImportsError>> {
    let id = path.to_string_lossy().to_string();
    let mut seen = state.seen.lock().await;
    if !seen.insert(id.clone()) {
        return Ok(id);
    };
    drop(seen);
    let code = if let Some(c) = code_opt {
        c
    } else {
        fs::read_to_string(&path).await.unwrap()
    };

    state.graph.lock().await.insert(
        path.to_string_lossy().into_owned(),
        ModuleInfo {
            imported_ids: resolve_imports(&path, &code, cfg)?,
            code,
        },
    );
    Ok(id)
}
