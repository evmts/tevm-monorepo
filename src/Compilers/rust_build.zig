const std = @import("std");

pub fn addRustIntegration(b: *std.Build, target: std.Build.ResolvedTarget, optimize: std.builtin.OptimizeMode) !void {
    // Define the Cargo build command
    const cargo_build = b.addSystemCommand(&.{
        "cargo",
        "build",
        "--manifest-path=src/Compilers/Cargo.toml",
        "--target-dir=zig-out/rust",
        if (optimize == .Debug) "--profile=dev" else "--profile=release",
    });

    // Add a message to show build progress
    std.debug.print("Building Rust Foundry wrapper...\n", .{});

    // Get the path to the static library that will be generated
    const profile_dir = if (optimize == .Debug) "debug" else "release";
    const lib_path = b.fmt("zig-out/rust/{s}/libfoundry_wrapper.a", .{profile_dir});

    // Add the library to artifacts that need it
    // Create a module for the Compiler
    const compiler_mod = b.createModule(.{
        .root_source_file = b.path("src/Compilers/compiler.zig"),
        .target = target,
        .optimize = optimize,
    });

    const artifacts = [_]*std.Build.Step.Compile{
        b.addExecutable(.{
            .name = "foundry-test",
            .root_source_file = b.path("src/Solidity/SnailTracer.zig"),
            .target = target,
            .optimize = optimize,
        }),
    };
    
    // Add the compiler module to the executable
    artifacts[0].root_module.addImport("Compiler", compiler_mod);

    for (artifacts) |artifact| {
        // Make the artifact depend on the Rust build
        artifact.step.dependOn(&cargo_build.step);
        
        // Add the static library to link - using the proper LazyPath construction
        artifact.addObjectFile(.{ .cwd_relative = lib_path });
        
        // Add the include directory for the generated header
        artifact.addIncludePath(.{ .cwd_relative = "include" });

        // Link required system libraries
        if (target.result.os.tag == .macos) {
            artifact.linkSystemLibrary("c++");
            artifact.linkFramework("Security");
            artifact.linkFramework("CoreFoundation");
        } else if (target.result.os.tag == .linux) {
            artifact.linkSystemLibrary("c++");
            artifact.linkSystemLibrary("ssl");
            artifact.linkSystemLibrary("crypto");
        } else if (target.result.os.tag == .windows) {
            artifact.linkSystemLibrary("c++");
            artifact.linkSystemLibrary("ws2_32");
            artifact.linkSystemLibrary("userenv");
            artifact.linkSystemLibrary("bcrypt");
        }
    }

    // Install the foundry-test executable
    b.installArtifact(artifacts[0]);

    // Create a custom step to run cargo build directly
    const build_rust_step = b.step("build-rust", "Build the Rust Foundry wrapper library");
    build_rust_step.dependOn(&cargo_build.step);

    // Add tests that require the Rust library
    const foundry_test = b.addTest(.{
        .name = "foundry-test",
        .root_source_file = b.path("src/Compilers/compiler.zig"),
        .target = target,
        .optimize = optimize,
    });

    foundry_test.step.dependOn(&cargo_build.step);
    foundry_test.addObjectFile(.{ .cwd_relative = lib_path });
    foundry_test.addIncludePath(.{ .cwd_relative = "src/Compilers" });

    // Link required system libraries for tests
    if (target.result.os.tag == .macos) {
        foundry_test.linkSystemLibrary("c++");
        foundry_test.linkFramework("Security");
        foundry_test.linkFramework("CoreFoundation");
    } else if (target.result.os.tag == .linux) {
        foundry_test.linkSystemLibrary("c++");
        foundry_test.linkSystemLibrary("ssl");
        foundry_test.linkSystemLibrary("crypto");
    } else if (target.result.os.tag == .windows) {
        foundry_test.linkSystemLibrary("c++");
        foundry_test.linkSystemLibrary("ws2_32");
        foundry_test.linkSystemLibrary("userenv");
        foundry_test.linkSystemLibrary("bcrypt");
    }

    const run_foundry_test = b.addRunArtifact(foundry_test);

    // Add a separate step for testing Foundry integration
    const foundry_test_step = b.step("test-foundry", "Run Foundry integration tests");
    foundry_test_step.dependOn(&run_foundry_test.step);
    
    // Add a run step for the SnailTracer example
    const run_snailtracer = b.addRunArtifact(artifacts[0]);
    const run_snailtracer_step = b.step("run-snailtracer", "Run the SnailTracer example");
    run_snailtracer_step.dependOn(&run_snailtracer.step);
}