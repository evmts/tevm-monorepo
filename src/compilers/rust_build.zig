const std = @import("std");

pub fn add_rust_integration(b: *std.Build, target: std.Build.ResolvedTarget, optimize: std.builtin.OptimizeMode) !*std.Build.Step {
    // Build the Rust static library
    const cargo_build = b.addSystemCommand(&.{
        "cargo",
        "build",
        "--release",
        "--manifest-path",
        "src/compilers/Cargo.toml",
        "--target-dir",
        "dist/target",
    });

    // Add a message to show build progress
    std.debug.print("Building Rust Foundry wrapper...\n", .{});

    // Generate C bindings using cbindgen
    // Print debug information
    std.debug.print("Looking for cbindgen...\n", .{});
    
    // Try to use cbindgen directly from PATH first
    const cbindgen_cmd = b.addSystemCommand(&.{
        "cbindgen",
        "--config", "cbindgen.toml",
        "--crate", "foundry_wrapper",
        "--output", "../../include/foundry_wrapper.h",
    });
    
    // Set the working directory to the Rust crate
    cbindgen_cmd.setCwd(b.path("src/compilers"));
    
    // Set environment to ensure PATH is available
    // Include both Linux and macOS paths for cargo
    // cbindgen_cmd.setEnvironmentVariable("PATH", "/Users/williamcory/.cargo/bin:/root/.cargo/bin:/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin");
    
    std.debug.print("cbindgen command configured\n", .{});

    cbindgen_cmd.step.dependOn(&cargo_build.step);

    // Define the Rust library path
    const rust_lib_path = b.pathJoin(&.{ "dist", "target", "release", "libfoundry_wrapper.a" });

    // Get zabi dependency
    const zabi_dep = b.dependency("zabi", .{
        .target = target,
        .optimize = optimize,
    });
    
    // Create a module for the Compiler
    const compiler_mod = b.createModule(.{
        .root_source_file = b.path("src/compilers/compiler.zig"),
    });
    
    // Add zabi to the compiler module
    compiler_mod.addImport("zabi", zabi_dep.module("zabi"));
    
    // Add include path to the module for C imports
    compiler_mod.addIncludePath(b.path("include"));

    const artifacts = [_]*std.Build.Step.Compile{
        b.addExecutable(.{
            .name = "foundry-test",
            .root_source_file = b.path("src/solidity/snail_tracer_test.zig"),
            .target = target,
            .optimize = optimize,
        }),
    };

    // Add the compiler module to the executable
    artifacts[0].root_module.addImport("Compiler", compiler_mod);

    // Add include path for the C headers
    artifacts[0].addIncludePath(b.path("include"));

    // Link the Rust static library
    artifacts[0].addObjectFile(b.path(rust_lib_path));

    // Link required system libraries
    artifacts[0].linkLibC();
    
    // Link unwinder libraries for Rust std
    if (target.result.os.tag == .linux) {
        artifacts[0].linkSystemLibrary("unwind");
        artifacts[0].linkSystemLibrary("gcc_s");
    }
    
    if (target.result.os.tag == .macos) {
        artifacts[0].linkFramework("Security");
        artifacts[0].linkFramework("SystemConfiguration");
        artifacts[0].linkFramework("CoreFoundation");
    }

    for (artifacts) |artifact| {
        // Make the artifact depend on the Rust build
        artifact.step.dependOn(&cbindgen_cmd.step);
    }

    // Install the foundry-test executable
    b.installArtifact(artifacts[0]);

    // Create a custom step to build the Rust library
    const build_rust_step = b.step("build-rust", "Build the Rust Foundry wrapper library");
    build_rust_step.dependOn(&cbindgen_cmd.step);

    // Add tests
    const foundry_test = b.addTest(.{
        .name = "foundry-test",
        .root_source_file = b.path("src/compilers/compiler.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add zabi dependency to test
    foundry_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    
    // Link frameworks for test executable
    foundry_test.linkLibC();
    foundry_test.addObjectFile(b.path(rust_lib_path));
    foundry_test.addIncludePath(b.path("include"));
    
    // Link unwinder libraries for Rust std
    if (target.result.os.tag == .linux) {
        foundry_test.linkSystemLibrary("unwind");
        foundry_test.linkSystemLibrary("gcc_s");
    }
    
    if (target.result.os.tag == .macos) {
        foundry_test.linkFramework("Security");
        foundry_test.linkFramework("SystemConfiguration");
        foundry_test.linkFramework("CoreFoundation");
    }
    foundry_test.step.dependOn(&cbindgen_cmd.step);

    const run_foundry_test = b.addRunArtifact(foundry_test);

    // Add a separate step for testing Foundry integration
    const foundry_test_step = b.step("test-foundry", "Run Foundry integration tests");
    foundry_test_step.dependOn(&run_foundry_test.step);

    // Add a run step for the SnailTracer example
    const run_snailtracer = b.addRunArtifact(artifacts[0]);
    const run_snailtracer_step = b.step("run-snailtracer", "Run the SnailTracer example");
    run_snailtracer_step.dependOn(&run_snailtracer.step);

    // Return the cbindgen step so it can be used as a dependency
    return &cbindgen_cmd.step;
}