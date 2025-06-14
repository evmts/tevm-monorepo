const std = @import("std");

pub fn add_rust_integration(
    b: *std.Build, 
    target: std.Build.ResolvedTarget, 
    optimize: std.builtin.OptimizeMode
) !*std.Build.Step {
    _ = target;
    _ = optimize;
    
    const rust_step = b.step("build-rust-precompiles", "Build Rust precompiles library");
    
    // Check if cargo is available
    const cargo_result = std.process.Child.run(.{
        .allocator = b.allocator,
        .argv = &.{ "cargo", "--version" },
    }) catch {
        std.log.warn("cargo not found, skipping Rust precompiles build", .{});
        return rust_step;
    };
    defer b.allocator.free(cargo_result.stdout);
    defer b.allocator.free(cargo_result.stderr);
    
    if (cargo_result.term.Exited != 0) {
        std.log.warn("cargo not available, skipping Rust precompiles build", .{});
        return rust_step;
    }
    
    // Create the directory if it doesn't exist
    const precompiles_dir = "src/precompiles";
    std.fs.cwd().makeDir(precompiles_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return err,
    };
    
    // Build the Rust library
    const build_cmd = b.addSystemCommand(&.{
        "cargo", "build", "--release",
    });
    build_cmd.cwd = b.path(precompiles_dir);
    
    // Generate C headers
    const generate_headers_cmd = b.addSystemCommand(&.{
        "cargo", "build", "--release",
    });
    generate_headers_cmd.cwd = b.path(precompiles_dir);
    generate_headers_cmd.step.dependOn(&build_cmd.step);
    
    // Copy the built library to a standard location (check both local and workspace target directories)
    const copy_lib_step = b.addInstallFile(
        b.path("dist/target/release/librevm_precompiles_wrapper.a"),
        "lib/librevm_precompiles_wrapper.a"
    );
    copy_lib_step.step.dependOn(&generate_headers_cmd.step);
    
    // Copy the generated header
    const copy_header_step = b.addInstallFile(
        b.path("src/precompiles/revm_precompiles_wrapper.h"),
        "include/revm_precompiles_wrapper.h"
    );
    copy_header_step.step.dependOn(&generate_headers_cmd.step);
    
    rust_step.dependOn(&copy_lib_step.step);
    rust_step.dependOn(&copy_header_step.step);
    
    return rust_step;
}

pub fn link_precompiles(compile_step: *std.Build.Step.Compile, b: *std.Build) void {
    // Add the include path for the generated header
    compile_step.addIncludePath(b.path("zig-out/include"));
    
    // Link the Rust library
    compile_step.addObjectFile(b.path("zig-out/lib/librevm_precompiles_wrapper.a"));
    
    // Link required system libraries
    compile_step.linkLibC();
    
    const target = compile_step.rootModuleTarget();
    if (target.os.tag == .linux) {
        compile_step.linkSystemLibrary("unwind");
        compile_step.linkSystemLibrary("gcc_s");
        compile_step.linkSystemLibrary("m"); // math library
    } else if (target.os.tag == .macos) {
        compile_step.linkFramework("CoreFoundation");
        compile_step.linkFramework("Security");
    } else if (target.os.tag == .windows) {
        compile_step.linkSystemLibrary("ws2_32");
        compile_step.linkSystemLibrary("advapi32");
        compile_step.linkSystemLibrary("userenv");
        compile_step.linkSystemLibrary("ntdll");
    }
}