use cbindgen;
use std::env;
use std::path::PathBuf;

fn main() {
    let crate_dir = env::var("CARGO_MANIFEST_DIR").unwrap();

    // Tell cargo to rerun this build script if the wrapper or cbindgen config changes
    println!("cargo:rerun-if-changed=src/lib.rs");
    println!("cargo:rerun-if-changed=cbindgen.toml");

    // Generate the C bindings
    let config = cbindgen::Config::from_file("cbindgen.toml").unwrap();
    let output_file = PathBuf::from(&crate_dir).join("foundry_wrapper.h");

    cbindgen::Builder::new()
        .with_crate(crate_dir)
        .with_config(config)
        .generate()
        .expect("Unable to generate bindings")
        .write_to_file(output_file);
}