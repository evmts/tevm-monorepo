extern crate napi_derive;
use foundry_compilers::{
    artifacts::{Contract, Source},
    project::ProjectCompiler,
    Project,
};
use napi_derive::napi;
use num_cpus;
use once_cell::sync::Lazy;
use std::path::PathBuf;
use tevm_resolutions_rs::{module_factory, Config};
use tevm_runtime_rs::{generate_runtime, ContractPackage, ModuleType};
use tevm_solc_rs::SolcOutput;

pub static TOKIO: Lazy<tokio::runtime::Runtime> = Lazy::new(|| {
    tokio::runtime::Builder::new_multi_thread()
        .worker_threads(num_cpus::get())
        .max_blocking_threads(1024)
        .enable_all()
        .build()
        .unwrap()
});

#[napi(object)]
pub struct ModuleInfo {
    pub code: String,
    pub imported_ids: Vec<String>,
}

#[napi(constructor)]
pub struct Bundler {
    pub solc_version: String,
}

#[napi]
impl Bundler {
    async fn compile(
        &self,
        module_path: String,
        libs: Option<Vec<String>>,
        remappings: Option<Vec<(String, String)>>,
    ) -> Vec<(String, Contract)> {
        let path = PathBuf::from(module_path);
        let raw_code = std::fs::read_to_string(&path).unwrap();
        let project = Project::builder().build(Default::default()).unwrap();
        let compiler = ProjectCompiler::with_sources(
            &project,
            module_factory(path.clone(), &raw_code, Config::from((libs, remappings)))
                .await
                .unwrap()
                .into_iter()
                .map(|(name, module)| (PathBuf::from(name), Source::new(module.code)))
                .collect(),
        )
        .unwrap();

        let compiler_output = compiler.compile().unwrap().into_output();
        if !compiler_output.errors.is_empty() {
            panic!("Todo")
        }
        compiler_output
            .contracts
            .into_contracts_with_files()
            .filter(|(file, _, _)| *file == path)
            .map(|(_, name, contract)| (name, contract))
            .collect()
    }

    #[napi(writable = false)]
    pub async fn resolve(
        &self,
        module_path: String,
        base_dir: String,
        module_type: ModuleType,
        libs: Option<Vec<String>>,
        remappings: Option<Vec<(String, String)>>,
    ) -> String {
        let solc_output = self.compile(module_path, libs, remappings).await;
        generate_runtime(solc_output, module_type, ContractPackage::TevmContract)
    }
}
