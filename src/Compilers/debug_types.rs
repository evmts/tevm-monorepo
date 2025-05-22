use foundry_compilers::{Project, ProjectPathsConfig, compilers::multi::MultiCompiler};
use std::path::Path;

fn main() {
    let paths = ProjectPathsConfig::hardhat(Path::new(".")).unwrap();
    let project = Project::builder().paths(paths).build(MultiCompiler::default()).unwrap();
    let output = project.compile().unwrap();
    
    for (path, contracts) in output.artifacts() {
        println!("File: {}", path.to_string());
        println!("Contracts type: {}", std::any::type_name_of_val(&contracts));
        
        // Let's see what contracts is
        for (name, artifact) in contracts {
            println!("  Contract: {}", name);
            println!("  Artifact type: {}", std::any::type_name_of_val(&artifact));
            
            if let Some(ref abi) = artifact.abi {
                println!("    ABI found with {} items", abi.len());
            }
            
            if let Some(ref bytecode) = artifact.bytecode {
                println!("    Bytecode found");
                println!("    Bytecode object type: {}", std::any::type_name_of_val(&bytecode.object));
            }
            
            break; // Just check first contract
        }
        break; // Just check first file
    }
}