#![deny(clippy::all)]

pub mod models;
pub mod module_factory;
pub mod module_resolution_error;
pub mod process_module;
pub mod read_file;
pub mod resolve_import_path;
pub mod resolve_imports;

// Re-export the main functions and types for easier access
pub use models::{ModuleInfo, ResolvedImport};
pub use module_factory::module_factory;
pub use module_resolution_error::ModuleResolutionError;
pub use read_file::read_file;
pub use resolve_import_path::resolve_import_path;
pub use resolve_imports::resolve_imports;

use std::collections::HashMap;
use napi_derive::napi;
use napi::bindgen_prelude::*;

#[napi(object)]
pub struct JsResolvedImport {
  pub original: String,
  pub absolute: String,
  pub updated: String,
}

#[napi(object)]
pub struct JsModuleInfo {
  pub code: String,
  pub imported_ids: Vec<String>,
}

struct ResolveImportsTask {
  file_path: String,
  code: String,
  remappings: HashMap<String, String>,
  libs: Vec<String>,
}

#[napi]
impl Task for ResolveImportsTask {
  type Output = Vec<JsResolvedImport>;
  type JsValue = Vec<JsResolvedImport>;

  fn compute(&mut self) -> Result<Self::Output> {
    // Use tokio runtime to run the async function
    let rt = tokio::runtime::Runtime::new().unwrap();
    
    let result = rt.block_on(resolve_imports::resolve_imports(
      &self.file_path,
      &self.code,
      &self.remappings,
      &self.libs,
    ));

    match result {
      Ok(paths) => {
        let imports = paths
          .into_iter()
          .map(|path| {
            let path_str = path.to_string_lossy().to_string();
            JsResolvedImport {
              original: path_str.clone(),
              absolute: path_str.clone(),
              updated: path_str,
            }
          })
          .collect();

        Ok(imports)
      }
      Err(err) => Err(Error::new(
        Status::GenericFailure,
        format!("Failed to resolve imports: {:?}", err),
      )),
    }
  }

  fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
    Ok(output)
  }
}

struct ProcessModuleTask {
  file_path: String,
  code: String,
  remappings: HashMap<String, String>,
  libs: Vec<String>,
}

#[napi]
impl Task for ProcessModuleTask {
  type Output = JsModuleInfo;
  type JsValue = JsModuleInfo;

  fn compute(&mut self) -> Result<Self::Output> {
    // Use tokio runtime to run the async function
    let rt = tokio::runtime::Runtime::new().unwrap();
    
    let result = rt.block_on(resolve_imports::resolve_imports(
      &self.file_path,
      &self.code,
      &self.remappings,
      &self.libs,
    ));

    match result {
      Ok(paths) => {
        Ok(JsModuleInfo {
          code: self.code.clone(),
          imported_ids: paths.iter().map(|p| p.to_string_lossy().to_string()).collect(),
        })
      }
      Err(err) => Err(Error::new(
        Status::GenericFailure,
        format!("Failed to process module: {:?}", err),
      )),
    }
  }

  fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
    Ok(output)
  }
}

#[napi(object)]
pub struct JsModule {
  pub id: String,
  pub code: String,
  pub raw_code: String,
  pub imported_ids: Vec<String>,
}

struct ModuleFactoryTask {
  file_path: String,
  code: String,
  remappings: HashMap<String, String>,
  libs: Vec<String>,
}

#[napi]
impl Task for ModuleFactoryTask {
  type Output = HashMap<String, JsModule>;
  type JsValue = HashMap<String, JsModule>;

  fn compute(&mut self) -> Result<Self::Output> {
    // Use tokio runtime to run the async function
    let rt = tokio::runtime::Runtime::new().unwrap();
    
    let result = rt.block_on(module_factory::module_factory(
      &self.file_path,
      &self.code,
      &self.remappings,
      &self.libs,
    ));

    match result {
      Ok(module_map) => {
        let mut result_map = HashMap::new();
        
        for (path, module_info) in module_map {
          // Convert PathBuf values to String values
          let imported_paths: Vec<String> = module_info.imported_ids
            .iter()
            .map(|path| path.to_string_lossy().to_string())
            .collect();
          
          result_map.insert(path.clone(), JsModule {
            id: path,
            code: module_info.code.clone(),
            raw_code: module_info.code,
            imported_ids: imported_paths,
          });
        }
        
        Ok(result_map)
      }
      Err(err) => Err(Error::new(
        Status::GenericFailure,
        format!("Failed to create module factory: {:?}", err),
      )),
    }
  }

  fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
    Ok(output)
  }
}

#[napi]
pub fn resolve_imports_js(
  file_path: String,
  code: String,
  remappings: Option<HashMap<String, String>>,
  libs: Option<Vec<String>>,
) -> AsyncTask<ResolveImportsTask> {
  AsyncTask::new(ResolveImportsTask {
    file_path,
    code,
    remappings: remappings.unwrap_or_default(),
    libs: libs.unwrap_or_default(),
  })
}

#[napi]
pub fn process_module_js(
  file_path: String,
  code: String,
  remappings: Option<HashMap<String, String>>,
  libs: Option<Vec<String>>,
) -> AsyncTask<ProcessModuleTask> {
  AsyncTask::new(ProcessModuleTask {
    file_path,
    code,
    remappings: remappings.unwrap_or_default(),
    libs: libs.unwrap_or_default(),
  })
}

#[napi]
pub fn module_factory_js(
  file_path: String,
  code: String,
  remappings: Option<HashMap<String, String>>,
  libs: Option<Vec<String>>,
) -> AsyncTask<ModuleFactoryTask> {
  AsyncTask::new(ModuleFactoryTask {
    file_path,
    code,
    remappings: remappings.unwrap_or_default(),
    libs: libs.unwrap_or_default(),
  })
}