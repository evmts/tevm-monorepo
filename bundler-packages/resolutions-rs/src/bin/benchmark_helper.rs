use _tevm_bundler_packages_rs::{module_factory, models::ModuleInfo};
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string_pretty};
use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::prelude::*;

/// Input parameters for the module factory
#[derive(Deserialize)]
struct BenchmarkInput {
    absolute_path: String,
    raw_code: String,
    remappings: HashMap<String, String>,
    libs: Vec<String>,
}

/// Output format matching JavaScript implementation for benchmarking
#[derive(Serialize)]
struct ModuleOutput {
    code: String,
    path: String,
}

/// Complete output for benchmark comparison
#[derive(Serialize)]
struct BenchmarkOutput {
    #[serde(flatten)]
    modules: HashMap<String, ModuleOutput>,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Get command line arguments
    let args: Vec<String> = env::args().collect();
    
    if args.len() != 3 {
        eprintln!("Usage: {} <input_json_file> <output_json_file>", args[0]);
        std::process::exit(1);
    }
    
    let input_file = &args[1];
    let output_file = &args[2];
    
    println!("Reading input file: {}", input_file);
    
    // Read the input JSON file
    let mut file = match File::open(input_file) {
        Ok(f) => f,
        Err(e) => {
            eprintln!("Failed to open input file: {}", e);
            std::process::exit(1);
        }
    };
    
    let mut contents = String::new();
    if let Err(e) = file.read_to_string(&mut contents) {
        eprintln!("Failed to read input file: {}", e);
        std::process::exit(1);
    }
    
    println!("Parsing input JSON...");
    
    // Parse the input JSON
    let input: BenchmarkInput = match from_str(&contents) {
        Ok(i) => i,
        Err(e) => {
            eprintln!("Failed to parse input JSON: {}", e);
            std::process::exit(1);
        }
    };
    
    println!("Processing file: {}", input.absolute_path);
    println!("Code length: {} bytes", input.raw_code.len());
    println!("Remappings count: {}", input.remappings.len());
    println!("Libs count: {}", input.libs.len());
    
    // Print information about the input data
    for (key, value) in &input.remappings {
        println!("Remapping '{}' -> '{}'", key, value);
    }
    
    for lib in &input.libs {
        println!("Library path: '{}'", lib);
    }
    
    // Call the module_factory function
    let result = module_factory(
        &input.absolute_path,
        &input.raw_code,
        &input.remappings,
        &input.libs,
    );
    
    // Convert the result to a format that matches the JavaScript implementation
    let output = match result {
        Ok(module_map) => {
            println!("Module factory succeeded with {} modules", module_map.len());
            convert_to_output(module_map)
        },
        Err(e) => {
            eprintln!("Module factory failed: {:?}", e);
            // On error, return just the main module with error indication
            let mut output_map = HashMap::new();
            output_map.insert(
                input.absolute_path.clone(),
                ModuleOutput {
                    code: format!("/* Error: {:?} */\n{}", e, input.raw_code),
                    path: input.absolute_path,
                },
            );
            BenchmarkOutput { modules: output_map }
        }
    };
    
    println!("Writing output to: {}", output_file);
    
    // Write the output to a JSON file
    let output_json = match to_string_pretty(&output) {
        Ok(json) => json,
        Err(e) => {
            eprintln!("Failed to serialize output to JSON: {}", e);
            std::process::exit(1);
        }
    };
    
    let mut output_file = match File::create(output_file) {
        Ok(f) => f,
        Err(e) => {
            eprintln!("Failed to create output file: {}", e);
            std::process::exit(1);
        }
    };
    
    if let Err(e) = output_file.write_all(output_json.as_bytes()) {
        eprintln!("Failed to write output file: {}", e);
        std::process::exit(1);
    }
    
    println!("Success!");
    Ok(())
}

fn convert_to_output(module_map: HashMap<String, ModuleInfo>) -> BenchmarkOutput {
    // Convert to format matching JavaScript implementation
    let modules = module_map
        .into_iter()
        .map(|(path, module)| {
            (
                path.clone(),
                ModuleOutput {
                    code: module.code,
                    path,
                },
            )
        })
        .collect();
    
    BenchmarkOutput { modules }
}