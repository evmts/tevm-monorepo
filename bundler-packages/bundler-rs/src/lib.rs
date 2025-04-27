extern crate napi_derive;
use foundry_compilers::{
    compilers::multi::MultiCompilerError, project::ProjectCompiler, solc::Source,
    AggregatedCompilerOutput, Project, Sources,
};
use napi_derive::napi;
use num_cpus;
use once_cell::sync::Lazy;
use std::path::PathBuf;
use tevm_resolutions_rs::{module_factory, Config};
use tevm_runtime_rs::{generate_runtime, ContractPackage, ModuleType};

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
        base_dir: String,
        libs: Option<Vec<String>>,
        remappings: Option<Vec<(String, String)>>,
    ) -> AggregatedCompilerOutput<MultiCompilerError> {
        let path = PathBuf::from(module_path);
        let raw_code = std::fs::read_to_string(&path).unwrap();
        let sources = Sources::from(
            module_factory(path, &raw_code, Config::from((libs, remappings)))
                .await
                .unwrap()
                .into_iter()
                .map(|(name, module)| (PathBuf::from(name), Source::new(module.code)))
                .collect(),
        );
        let project = Project::builder().build(Default::default()).unwrap();
        let compiler = ProjectCompiler::with_sources(&project, sources).unwrap();

        compiler.compile().unwrap().into_output()
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
        let solc_output = self.compile(module_path, base_dir, libs, remappings).await;
        generate_runtime(solc_output, module_type, ContractPackage::TevmContract)
    }
}
