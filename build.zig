const std = @import("std");

// Although this function looks imperative, note that its job is to
// declaratively construct a build graph that will be executed by an external
// runner.
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

    // Create a special target for WebAssembly compilation
    const wasm_target = b.resolveTargetQuery(.{
        .cpu_arch = .wasm32,
        .os_tag = .freestanding,
    });

    // Get httpz dependency
    const httpz_dep = b.dependency("httpz", .{
        .target = target,
        .optimize = optimize,
    });

    // First create individual modules for each component
    const address_mod = b.createModule(.{
        .root_source_file = b.path("src/Address/address.zig"),
        .target = target,
        .optimize = optimize,
    });
    address_mod.stack_check = false;
    address_mod.single_threaded = true;

    const abi_mod = b.createModule(.{
        .root_source_file = b.path("src/Abi/abi.zig"),
        .target = target,
        .optimize = optimize,
    });
    abi_mod.stack_check = false;
    abi_mod.single_threaded = true;

    const utils_mod = b.createModule(.{
        .root_source_file = b.path("src/Utils/utils.zig"),
        .target = target,
        .optimize = optimize,
    });
    utils_mod.stack_check = false;
    utils_mod.single_threaded = true;

    const trie_mod = b.createModule(.{
        .root_source_file = b.path("src/Trie/module.zig"),
        .target = target,
        .optimize = optimize,
    });
    trie_mod.stack_check = false;
    trie_mod.single_threaded = true;

    const block_mod = b.createModule(.{
        .root_source_file = b.path("src/Block/block.zig"),
        .target = target,
        .optimize = optimize,
    });
    block_mod.stack_check = false;
    block_mod.single_threaded = true;

    // Add imports to the block_mod
    block_mod.addImport("Address", address_mod);

    const bytecode_mod = b.createModule(.{
        .root_source_file = b.path("src/Bytecode/bytecode.zig"),
        .target = target,
        .optimize = optimize,
    });
    bytecode_mod.stack_check = false;
    bytecode_mod.single_threaded = true;

    const compiler_mod = b.createModule(.{
        .root_source_file = b.path("src/Compilers/compiler.zig"),
        .target = target,
        .optimize = optimize,
    });
    compiler_mod.stack_check = false;
    compiler_mod.single_threaded = true;

    const zabi_dep = b.dependency("zabi", .{
        .target = target,
        .optimize = optimize,
    });
    compiler_mod.addImport("zabi", zabi_dep.module("zabi"));

    // Create a separate compiler module for WASM without problematic dependencies
    const compiler_wasm_mod = b.createModule(.{
        .root_source_file = b.path("src/Compilers/compiler_wasm.zig"),
        .target = wasm_target,
        .optimize = .ReleaseSmall,
    });
    compiler_wasm_mod.stack_check = false;
    compiler_wasm_mod.single_threaded = true;

    const rlp_mod = b.createModule(.{
        .root_source_file = b.path("src/Rlp/rlp.zig"),
        .target = target,
        .optimize = optimize,
    });
    rlp_mod.stack_check = false;
    rlp_mod.single_threaded = true;

    // Add imports to the rlp_mod
    rlp_mod.addImport("Utils", utils_mod);

    // Add imports to the trie_mod
    trie_mod.addImport("Rlp", rlp_mod);
    trie_mod.addImport("Utils", utils_mod);

    const token_mod = b.createModule(.{
        .root_source_file = b.path("src/Token/token.zig"),
        .target = target,
        .optimize = optimize,
    });
    token_mod.stack_check = false;
    token_mod.single_threaded = true;

    const evm_mod = b.createModule(.{
        .root_source_file = b.path("src/evm/evm.zig"),
        .target = target,
        .optimize = optimize,
    });
    evm_mod.stack_check = false;
    evm_mod.single_threaded = true;

    // Add imports to the evm_mod
    evm_mod.addImport("Address", address_mod);
    evm_mod.addImport("Block", block_mod);

    // Create a ZigEVM module - our core EVM implementation
    const target_architecture_mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Disable stack checking to avoid undefined __zig_probe_stack references
    target_architecture_mod.stack_check = false;
    target_architecture_mod.single_threaded = true;

    // Add package paths for absolute imports for all modules
    target_architecture_mod.addImport("Address", address_mod);
    target_architecture_mod.addImport("Abi", abi_mod);
    target_architecture_mod.addImport("Block", block_mod);
    target_architecture_mod.addImport("Bytecode", bytecode_mod);
    target_architecture_mod.addImport("Compiler", compiler_mod);
    target_architecture_mod.addImport("evm", evm_mod);
    target_architecture_mod.addImport("Rlp", rlp_mod);
    target_architecture_mod.addImport("Token", token_mod);
    target_architecture_mod.addImport("Trie", trie_mod);
    target_architecture_mod.addImport("Utils", utils_mod);

    // Create the native executable module
    const exe_mod = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    exe_mod.stack_check = false;
    exe_mod.single_threaded = true;

    // Create WASM module with the same source but different target
    const wasm_mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = wasm_target,
        .optimize = .ReleaseSmall,
    });
    wasm_mod.stack_check = false;
    wasm_mod.single_threaded = true;

    // Add package paths for absolute imports to WASM module
    wasm_mod.addImport("Address", address_mod);
    wasm_mod.addImport("Abi", abi_mod);
    wasm_mod.addImport("Block", block_mod);
    wasm_mod.addImport("Bytecode", bytecode_mod);
    wasm_mod.addImport("Compiler", compiler_mod);
    wasm_mod.addImport("evm", evm_mod);
    wasm_mod.addImport("Rlp", rlp_mod);
    wasm_mod.addImport("Token", token_mod);
    wasm_mod.addImport("Trie", trie_mod);
    wasm_mod.addImport("Utils", utils_mod);

    // Modules can depend on one another using the `std.Build.Module.addImport` function.
    exe_mod.addImport("zigevm", target_architecture_mod);

    // Create the ZigEVM static library artifact
    const lib = b.addLibrary(.{
        .linkage = .static,
        .name = "zigevm",
        .root_module = target_architecture_mod,
    });

    // Disable stack checking to avoid undefined __zig_probe_stack references
    lib.root_module.stack_check = false;
    lib.root_module.single_threaded = true;

    // Create the CLI executable
    const exe = b.addExecutable(.{
        .name = "zigevm",
        .root_module = exe_mod,
    });

    // Create a separate executable for the server
    const server_exe = b.addExecutable(.{
        .name = "zigevm-server",
        .root_source_file = b.path("src/Server/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add httpz dependency to the server
    server_exe.root_module.addImport("httpz", httpz_dep.module("httpz"));

    // Create the WebAssembly artifact
    const wasm = b.addExecutable(.{
        .name = "zigevm",
        .root_module = wasm_mod,
    });
    wasm.rdynamic = true; // Required for exported functions
    wasm.entry = .disabled; // No entry point for library mode

    // Define the WASM output path
    const wasm_output_path = "dist/zigevm.wasm";
    const install_wasm = b.addInstallFile(wasm.getEmittedBin(), wasm_output_path);

    // Install all artifacts
    b.installArtifact(lib);
    b.installArtifact(exe);
    b.installArtifact(wasm);
    b.installArtifact(server_exe);

    // This *creates* a Run step in the build graph
    const run_cmd = b.addRunArtifact(exe);
    run_cmd.step.dependOn(b.getInstallStep());

    // Pass arguments to the application
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    // Define run step
    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    // Build WASM step
    const build_wasm_step = b.step("wasm", "Build the WebAssembly artifact");
    build_wasm_step.dependOn(&install_wasm.step);

    // Define a run server step
    const run_server_cmd = b.addRunArtifact(server_exe);
    run_server_cmd.step.dependOn(b.getInstallStep());

    // Pass arguments to the server application
    if (b.args) |args| {
        run_server_cmd.addArgs(args);
    }

    // Define run server step
    const run_server_step = b.step("run-server", "Run the JSON-RPC server");
    run_server_step.dependOn(&run_server_cmd.step);

    // Creates a step for unit testing.
    const lib_unit_tests = b.addTest(.{
        .root_module = target_architecture_mod,
    });

    // Add all modules to standalone tests
    lib_unit_tests.root_module.addImport("Address", address_mod);
    lib_unit_tests.root_module.addImport("Abi", abi_mod);
    lib_unit_tests.root_module.addImport("Block", block_mod);
    lib_unit_tests.root_module.addImport("Bytecode", bytecode_mod);
    lib_unit_tests.root_module.addImport("Compiler", compiler_mod);
    lib_unit_tests.root_module.addImport("evm", evm_mod);
    lib_unit_tests.root_module.addImport("Rlp", rlp_mod);
    lib_unit_tests.root_module.addImport("Token", token_mod);
    lib_unit_tests.root_module.addImport("Trie", trie_mod);
    lib_unit_tests.root_module.addImport("Utils", utils_mod);

    // Frame test removed - Frame_test.zig doesn't exist

    // Add a test for evm.zig
    const evm_test = b.addTest(.{
        .name = "evm-test",
        .root_source_file = b.path("src/evm/evm.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add all modules to evm_test
    evm_test.root_module.addImport("Address", address_mod);
    evm_test.root_module.addImport("Abi", abi_mod);
    evm_test.root_module.addImport("Block", block_mod);
    evm_test.root_module.addImport("Bytecode", bytecode_mod);
    evm_test.root_module.addImport("Compiler", compiler_mod);
    evm_test.root_module.addImport("evm", evm_mod);
    evm_test.root_module.addImport("Rlp", rlp_mod);
    evm_test.root_module.addImport("Token", token_mod);
    evm_test.root_module.addImport("Trie", trie_mod);
    evm_test.root_module.addImport("Utils", utils_mod);

    const run_evm_test = b.addRunArtifact(evm_test);

    // Add a separate step for testing the EVM
    const evm_test_step = b.step("test-evm", "Run EVM tests");
    evm_test_step.dependOn(&run_evm_test.step);

    // Add a test for server.zig
    const server_test = b.addTest(.{
        .name = "server-test",
        .root_source_file = b.path("src/Server/server.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add the httpz dependency to the server test
    server_test.root_module.addImport("httpz", httpz_dep.module("httpz"));

    const run_server_test = b.addRunArtifact(server_test);

    // Add a separate step for testing the server
    const server_test_step = b.step("test-server", "Run Server tests");
    server_test_step.dependOn(&run_server_test.step);

    // Add a test for rlp_test.zig
    const rlp_specific_test = b.addTest(.{
        .name = "rlp-test",
        .root_source_file = b.path("src/Rlp/rlp_test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to rlp_test
    rlp_specific_test.root_module.addImport("Rlp", rlp_mod);
    rlp_specific_test.root_module.addImport("Utils", utils_mod);

    const run_rlp_test = b.addRunArtifact(rlp_specific_test);

    // Add a separate step for testing RLP
    const rlp_test_step = b.step("test-rlp", "Run RLP tests");
    rlp_test_step.dependOn(&run_rlp_test.step);

    // Add a test for abi_test.zig
    const abi_specific_test = b.addTest(.{
        .name = "abi-test",
        .root_source_file = b.path("src/Abi/abi_test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to abi_test
    abi_specific_test.root_module.addImport("Abi", abi_mod);
    abi_specific_test.root_module.addImport("Utils", utils_mod);

    const run_abi_test = b.addRunArtifact(abi_specific_test);

    // Add a separate step for testing ABI
    const abi_test_step = b.step("test-abi", "Run ABI tests");
    abi_test_step.dependOn(&run_abi_test.step);

    // Add a test for Compiler tests
    const compiler_test = b.addTest(.{
        .name = "compiler-test",
        .root_source_file = b.path("src/Compilers/compiler.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to compiler_test
    compiler_test.root_module.addImport("Compiler", compiler_mod);
    compiler_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    compiler_test.root_module.addIncludePath(b.path("src/Compilers"));

    const run_compiler_test = b.addRunArtifact(compiler_test);

    // Add a separate step for testing Compiler
    const compiler_test_step = b.step("test-compiler", "Run Compiler tests");
    compiler_test_step.dependOn(&run_compiler_test.step);

    // Add a test for Trie tests
    const trie_test = b.addTest(.{
        .name = "trie-test",
        .root_source_file = b.path("src/Trie/main_test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to trie_test
    trie_test.root_module.addImport("Rlp", rlp_mod);
    trie_test.root_module.addImport("Utils", utils_mod);
    trie_test.root_module.addImport("Trie", trie_mod);

    const run_trie_test = b.addRunArtifact(trie_test);

    // Add a separate step for testing Trie
    const trie_test_step = b.step("test-trie", "Run Trie tests");
    trie_test_step.dependOn(&run_trie_test.step);

    const interpreter_test = b.addTest(.{
        .name = "evm-test",
        .root_source_file = b.path("src/evm/JumpTable.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_interpreter_test = b.addRunArtifact(interpreter_test);

    // Add a separate step for testing Interpreter
    const interpreter_test_step = b.step("test-interpreter", "Run Interpreter tests");
    interpreter_test_step.dependOn(&run_interpreter_test.step);

    // Add Memory tests
    const memory_test = b.addTest(.{
        .name = "memory-test",
        .root_source_file = b.path("test/evm/memory_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    memory_test.root_module.addImport("evm", evm_mod);

    const run_memory_test = b.addRunArtifact(memory_test);

    const memory_test_step = b.step("test-memory", "Run Memory tests");
    memory_test_step.dependOn(&run_memory_test.step);

    // Add Memory stress tests
    const memory_stress_test = b.addTest(.{
        .name = "memory-stress-test",
        .root_source_file = b.path("test/evm/memory_stress_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    memory_stress_test.root_module.addImport("evm", evm_mod);

    const run_memory_stress_test = b.addRunArtifact(memory_stress_test);

    const memory_stress_test_step = b.step("test-memory-stress", "Run Memory stress tests");
    memory_stress_test_step.dependOn(&run_memory_stress_test.step);

    // Add Memory comparison tests
    const memory_comparison_test = b.addTest(.{
        .name = "memory-comparison-test",
        .root_source_file = b.path("test/evm/memory_comparison_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    memory_comparison_test.root_module.addImport("evm", evm_mod);

    const run_memory_comparison_test = b.addRunArtifact(memory_comparison_test);

    const memory_comparison_test_step = b.step("test-memory-comparison", "Run Memory comparison tests");
    memory_comparison_test_step.dependOn(&run_memory_comparison_test.step);

    // Add Memory benchmark
    const memory_benchmark = b.addExecutable(.{
        .name = "memory-benchmark",
        .root_source_file = b.path("test/Bench/memory_benchmark.zig"),
        .target = target,
        .optimize = .ReleaseFast, // Use ReleaseFast for benchmarks
    });
    memory_benchmark.root_module.addImport("evm", evm_mod);

    const run_memory_benchmark = b.addRunArtifact(memory_benchmark);

    const memory_benchmark_step = b.step("bench-memory", "Run Memory benchmarks");
    memory_benchmark_step.dependOn(&run_memory_benchmark.step);

    // Add Rust Foundry wrapper integration
    const rust_build = @import("src/Compilers/rust_build.zig");
    const rust_step = rust_build.addRustIntegration(b, target, optimize) catch |err| {
        std.debug.print("Failed to add Rust integration: {}\n", .{err});
        return;
    };

    // Make the compiler test depend on the Rust build
    compiler_test.step.dependOn(rust_step);

    // Link the Rust library to the compiler test
    compiler_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    // Link macOS frameworks if on macOS
    if (target.result.os.tag == .macos) {
        compiler_test.linkFramework("CoreFoundation");
        compiler_test.linkFramework("Security");
    }

    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);

    const exe_unit_tests = b.addTest(.{
        .root_module = exe_mod,
    });

    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);

    // Define test step for all tests
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
    test_step.dependOn(&run_exe_unit_tests.step);
    test_step.dependOn(&run_evm_test.step);
    test_step.dependOn(&run_server_test.step);
    test_step.dependOn(&run_rlp_test.step);
    test_step.dependOn(&run_abi_test.step);
    test_step.dependOn(&run_compiler_test.step);
    test_step.dependOn(&run_trie_test.step);
    test_step.dependOn(&run_interpreter_test.step);
    test_step.dependOn(&run_memory_test.step);
    test_step.dependOn(&run_memory_stress_test.step);
    test_step.dependOn(&run_memory_comparison_test.step);

    // Define a single test step that runs all tests
    const test_all_step = b.step("test-all", "Run all unit tests");
    test_all_step.dependOn(test_step);

    const zabi_module = b.dependency("zabi", .{}).module("zabi");
    exe.root_module.addImport("zabi", zabi_module);
    lib.root_module.addImport("zabi", zabi_module);
}
