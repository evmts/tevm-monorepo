use std::path::PathBuf;

use crate::context::ModuleContext;
use crate::{resolve_imports, ModuleInfo, ModuleResolutionError};
use tokio::fs;
use tokio::sync::OwnedSemaphorePermit;

/// Read a module (or use provided code), resolve its imports, insert into `ctx.graph`,
/// and return the list of child imports.
pub async fn process_module(
    path: PathBuf,
    code_opt: Option<String>,
    ctx: ModuleContext,
    _permit: OwnedSemaphorePermit,
) -> Result<Vec<PathBuf>, ModuleResolutionError> {
    let code = if let Some(c) = code_opt {
        c
    } else {
        fs::read_to_string(&path).await.unwrap()
    };

    let imports = resolve_imports(&path, &code, &ctx).unwrap();

    {
        let mut graph = ctx.graph.lock().await;
        graph.insert(
            path.to_string_lossy().into_owned(),
            ModuleInfo {
                code,
                imported_ids: imports.clone(),
            },
        );
    }

    Ok(imports)
}
