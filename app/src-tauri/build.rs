use std::{env, fs::copy, path::Path, process::Command};

fn main() {
    connect_zig();
    tauri_build::build()
}

fn connect_zig() {
    let target = env::var("TARGET").expect("Target not set");
    let manifest_env = env::var("CARGO_MANIFEST_DIR").expect("Manifest is not set");
    let cargo_path = Path::new(&manifest_env);
    let repo_root_path = cargo_path.parent().unwrap().parent().unwrap();
    let zig_out_path = repo_root_path.join("zig-out/lib");
    let out_dir_env = env::var("OUT_DIR").expect("OUT_DIR not set");
    let zig_build_status = Command::new("zig")
        .args(&["build", "-Doptimize=ReleaseSafe"])
        .current_dir(repo_root_path)
        .status()
        .expect("Failed to run zig compiler");
    assert!(zig_build_status.success(), "Zig compilation failed");

    let lib_name = if target.contains("windows") {
        "zigevm.lib"
    } else {
        "libzigevm.a"
    };
    let link_name = if lib_name.starts_with("lib") {
        &lib_name[3..lib_name.len() - 2]
    } else {
        &lib_name[..lib_name.len() - 4]
    };

    let lib_path = zig_out_path.join(lib_name);
    copy(&lib_path, format!("{}/{}", out_dir_env, lib_name)).expect("Failed to move binary");

    println!("cargo:rustc-link-search={}", out_dir_env);
    println!("cargo:rustc-link-lib=static={}", link_name);

    println!(
        "cargo:rerun-if-changed={}",
        repo_root_path.join("src").display()
    );
    println!(
        "cargo:rerun-if-changed={}",
        repo_root_path.join("build.zig").display()
    );
}
