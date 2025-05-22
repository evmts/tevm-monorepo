const std = @import("std");
const RustBuild = @import("src/Compilers/rust_build.zig");

pub fn build(b: *std.Build) void {
    // Standard target options allows the person running `zig build` to choose
    // what target to build for. Here we do not override the defaults, which
    // means any target is allowed, and the default is native. Other options
    // for restricting supported target set are available.
    const target = b.standardTargetOptions(.{});

    // Standard optimization options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall. Here we do not
    // set a preferred release mode, allowing the user to decide how to optimize.
    const optimize = b.standardOptimizeOption(.{});

    // Creates a step for building a static library
    const lib = b.addStaticLibrary(.{
        .name = "tevm",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    // This declares intent for the library to be installed into the standard
    // location when the user invokes the "install" step (the default step when
    // running `zig build`).
    b.installArtifact(lib);

    // ===== Types =====
    // Include the U256 module
    const u256_mod = b.createModule(.{
        .root_source_file = b.path("src/Types/U256.ts"),
    });

    // ===== Rust integration =====
    // Add a module for the Rust compilers integration
    const compilers_mod = b.createModule(.{
        .root_source_file = b.path("src/Compilers/compiler.zig"),
    });

    // Add Compilers as a dependency to the main library
    lib.root_module.addImport("Compilers", compilers_mod);

    // Build the Rust code for Compilers
    RustBuild.addRustIntegration(b, target, optimize) catch |err| {
        std.debug.print("Failed to add Rust integration: {}\n", .{err});
    };

    // ===== Tests =====
    const lib_unit_tests = b.addTest(.{
        .name = "lib-test",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);

    const exe_unit_tests = b.addTest(.{
        .name = "exe-test",
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);

    const u256_test = b.addTest(.{
        .name = "u256-test",
        .root_source_file = b.path("src/Types/U256.spec.ts"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to u256_test
    u256_test.root_module.addImport("U256", u256_mod);

    const run_u256_test = b.addRunArtifact(u256_test);

    // Add a separate step for testing U256
    const u256_test_step = b.step("test-u256", "Run U256 tests");
    u256_test_step.dependOn(&run_u256_test.step);

    // Add test for Trie
    const trie_test = b.addTest(.{
        .name = "trie-test",
        .root_source_file = b.path("src/Trie/trie_test.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_trie_test = b.addRunArtifact(trie_test);

    // Add a separate step for testing Trie
    const trie_test_step = b.step("test-trie", "Run Trie tests");
    trie_test_step.dependOn(&run_trie_test.step);

    // Add test for Rlp
    const rlp_test = b.addTest(.{
        .name = "rlp-test",
        .root_source_file = b.path("src/Rlp/rlp_test.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_rlp_test = b.addRunArtifact(rlp_test);

    // Add a separate step for testing Rlp
    const rlp_test_step = b.step("test-rlp", "Run Rlp tests");
    rlp_test_step.dependOn(&run_rlp_test.step);

    // Add test for Compiler
    const compiler_test = b.addTest(.{
        .name = "compiler-test",
        .root_source_file = b.path("src/Compilers/compiler.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_compiler_test = b.addRunArtifact(compiler_test);

    // Add a separate step for testing Compiler
    const compiler_test_step = b.step("test-compiler", "Run Compiler tests");
    compiler_test_step.dependOn(&run_compiler_test.step);

    // Add test for Interpreter
    const interpreter_test = b.addTest(.{
        .name = "interpreter-test",
        .root_source_file = b.path("src/Evm/interpreter.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_interpreter_test = b.addRunArtifact(interpreter_test);

    // Add a separate step for testing Interpreter
    const interpreter_test_step = b.step("test-interpreter", "Run Interpreter tests");
    interpreter_test_step.dependOn(&run_interpreter_test.step);

    // Add a test for SnailTracer
    const snailtracer_test = b.addTest(.{
        .name = "snailtracer-test",
        .root_source_file = b.path("src/Solidity/SnailTracer.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to snailtracer_test
    snailtracer_test.root_module.addImport("Compiler", compilers_mod);

    const run_snailtracer_test = b.addRunArtifact(snailtracer_test);

    // Add a separate step for testing SnailTracer
    const snailtracer_test_step = b.step("test-snailtracer", "Run SnailTracer Solidity compiler integration tests");
    snailtracer_test_step.dependOn(&run_snailtracer_test.step);

    // Add a step that runs all unit tests
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
    test_step.dependOn(&run_exe_unit_tests.step);
    test_step.dependOn(&run_u256_test.step);
    test_step.dependOn(&run_rlp_test.step);
    test_step.dependOn(&run_compiler_test.step);
    test_step.dependOn(&run_trie_test.step);
    test_step.dependOn(&run_interpreter_test.step);
    test_step.dependOn(&run_snailtracer_test.step);

    // Define a single test step that runs all tests
    _ = b.step("test-all", "Run all unit tests");
}