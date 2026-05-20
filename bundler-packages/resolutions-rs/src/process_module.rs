use std::path::PathBuf;

use regex::Regex;

use crate::resolve_imports::ResolveImportsError;
use crate::state::State;
use crate::{resolve_imports::resolve_imports_detailed, Config, ModuleInfo, ResolvedImport};
use tokio::fs;
use tokio::sync::OwnedSemaphorePermit;

fn rewrite_imports(code: &str, imports: &[ResolvedImport]) -> String {
    let mut rewritten = code.to_string();

    for import in imports {
        let escaped_original = regex::escape(&import.original);
        let patterns = [
            format!(r#"(import\s+["']){}(["'])"#, escaped_original),
            format!(r#"(import\s+[^;]*?\s+from\s+["']){}(["'])"#, escaped_original),
        ];

        for pattern in patterns {
            if let Ok(re) = Regex::new(&pattern) {
                rewritten = re
                    .replace_all(&rewritten, |caps: &regex::Captures<'_>| {
                        format!("{}{}{}", &caps[1], import.updated, &caps[2])
                    })
                    .into_owned();
            }
        }
    }

    rewritten
}

/// Read a module (or use provided code), resolve its imports, insert into `ctx.graph`,
/// and return the list of child imports.
pub async fn process_module(
    path: &PathBuf,
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
        fs::read_to_string(&path)
            .await
            .map_err(|err| vec![ResolveImportsError::ReadError {
                context_path: path.clone(),
                message: err.to_string(),
            }])?
    };

    let resolved_imports = resolve_imports_detailed(&path, &code, cfg)?;
    let imported_ids = resolved_imports
        .iter()
        .map(|import| PathBuf::from(&import.absolute))
        .collect();
    let rewritten_code = rewrite_imports(&code, &resolved_imports);

    state.graph.lock().await.insert(
        path.to_string_lossy().into_owned(),
        ModuleInfo {
            code: rewritten_code,
            raw_code: code,
            imported_ids,
        },
    );
    Ok(id)
}
