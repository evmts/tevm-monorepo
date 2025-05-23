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

    // Define package modules for each major component
    const evm_pkg = b.createModule(.{
        .root_source_file = b.path("src/Evm/package.zig"),
        .target = target,
        .optimize = optimize,
    });

    const utils_pkg = b.createModule(.{
        .root_source_file = b.path("src/Utils/package.zig"),
        .target = target,
        .optimize = optimize,
    });

    const address_pkg = b.createModule(.{
        .root_source_file = b.path("src/Address/package.zig"),
        .target = target,
        .optimize = optimize,
    });

    const block_pkg = b.createModule(.{
        .root_source_file = b.path("src/Block/package.zig"),
        .target = target,
        .optimize = optimize,
    });

    const bytecode_pkg = b.createModule(.{
        .root_source_file = b.path("src/Bytecode/package.zig"),
        .target = target,
        .optimize = optimize,
    });


    const rlp_pkg = b.createModule(.{
        .root_source_file = b.path("src/Rlp/package.zig"),
        .target = target,
        .optimize = optimize,
    });

    const compiler_mod = b.createModule(.{
        .root_source_file = b.path("src/Compilers/compiler.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add zabi dependency to compiler module
    const zabi_dep = b.dependency("zabi", .{
        .target = target,
        .optimize = optimize,
    });
    compiler_mod.addImport("zabi", zabi_dep.module("zabi"));
    
    // Add include path for the C headers
    compiler_mod.addIncludePath(b.path("include"));

    const token_pkg = b.createModule(.{
        .root_source_file = b.path("src/Token/package.zig"),
        .target = target,
        .optimize = optimize,
    });

    const trie_pkg = b.createModule(.{
        .root_source_file = b.path("src/Trie/package.zig"),
        .target = target,
        .optimize = optimize,
    });

    const state_manager_pkg = b.createModule(.{
        .root_source_file = b.path("src/StateManager/package.zig"),
        .target = target,
        .optimize = optimize,
    });

    const test_pkg = b.createModule(.{
        .root_source_file = b.path("src/Test/test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add imports between packages
    evm_pkg.addImport("utils", utils_pkg);
    evm_pkg.addImport("address", address_pkg);
    evm_pkg.addImport("block", block_pkg);
    evm_pkg.addImport("bytecode", bytecode_pkg);
    evm_pkg.addImport("compiler", compiler_mod);
    evm_pkg.addImport("rlp", rlp_pkg);
    evm_pkg.addImport("token", token_pkg);
    evm_pkg.addImport("trie", trie_pkg);
    evm_pkg.addImport("state_manager", state_manager_pkg);
    evm_pkg.addImport("test_utils", test_pkg);

    state_manager_pkg.addImport("evm", evm_pkg);
    state_manager_pkg.addImport("utils", utils_pkg);
    state_manager_pkg.addImport("address", address_pkg);

    address_pkg.addImport("utils", utils_pkg);

    block_pkg.addImport("utils", utils_pkg);
    block_pkg.addImport("rlp", rlp_pkg);

    bytecode_pkg.addImport("utils", utils_pkg);

    trie_pkg.addImport("utils", utils_pkg);
    trie_pkg.addImport("rlp", rlp_pkg);

    test_pkg.addImport("evm", evm_pkg);
    test_pkg.addImport("utils", utils_pkg);
    test_pkg.addImport("address", address_pkg);

    // Create the zigevm module - our core EVM implementation
    const zigevm_mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add package imports to zigevm module
    zigevm_mod.addImport("evm", evm_pkg);
    zigevm_mod.addImport("utils", utils_pkg);
    zigevm_mod.addImport("address", address_pkg);
    zigevm_mod.addImport("block", block_pkg);
    zigevm_mod.addImport("bytecode", bytecode_pkg);
    zigevm_mod.addImport("compiler", compiler_mod);
    zigevm_mod.addImport("rlp", rlp_pkg);
    zigevm_mod.addImport("token", token_pkg);
    zigevm_mod.addImport("trie", trie_pkg);
    zigevm_mod.addImport("state_manager", state_manager_pkg);
    zigevm_mod.addImport("test_utils", test_pkg);

    // Create the native executable module
    const exe_mod = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Create WASM module with the same source but different target
    const wasm_mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = wasm_target,
        .optimize = .ReleaseSmall,
    });

    // Add package imports to wasm module
    wasm_mod.addImport("evm", evm_pkg);
    wasm_mod.addImport("utils", utils_pkg);
    wasm_mod.addImport("address", address_pkg);
    wasm_mod.addImport("block", block_pkg);
    wasm_mod.addImport("bytecode", bytecode_pkg);
    wasm_mod.addImport("compiler", compiler_mod);
    wasm_mod.addImport("rlp", rlp_pkg);
    wasm_mod.addImport("token", token_pkg);
    wasm_mod.addImport("trie", trie_pkg);
    wasm_mod.addImport("state_manager", state_manager_pkg);
    wasm_mod.addImport("test_utils", test_pkg);

    // Modules can depend on one another using the `std.Build.Module.addImport` function.
    exe_mod.addImport("zigevm", zigevm_mod);

    // Create the ZigEVM static library artifact
    const lib = b.addLibrary(.{
        .linkage = .static,
        .name = "zigevm",
        .root_module = zigevm_mod,
    });

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
    server_exe.root_module.addImport("zigevm", zigevm_mod);

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
    
    // Get zbench dependency
    const zbench_dep = b.dependency("zbench", .{
        .target = target,
        .optimize = optimize,
    });

    // Add benchmark executables
    const snailtracer_bench = b.addExecutable(.{
        .name = "snailtracer-bench",
        .root_source_file = b.path("src/Evm/benchmarks/snailtracer.zig"),
        .target = target,
        .optimize = .ReleaseFast, // Use ReleaseFast for benchmarks
    });
    
    // Add package imports to benchmark
    snailtracer_bench.root_module.addImport("evm", evm_pkg);
    snailtracer_bench.root_module.addImport("utils", utils_pkg);
    snailtracer_bench.root_module.addImport("address", address_pkg);
    snailtracer_bench.root_module.addImport("state_manager", state_manager_pkg);
    snailtracer_bench.root_module.addImport("zbench", zbench_dep.module("zbench"));
    
    b.installArtifact(snailtracer_bench);
    
    const run_snailtracer_bench = b.addRunArtifact(snailtracer_bench);
    const snailtracer_bench_step = b.step("bench-snailtracer", "Run SnailTracer benchmark");
    snailtracer_bench_step.dependOn(&run_snailtracer_bench.step);
    
    const benchmark_suite = b.addExecutable(.{
        .name = "benchmark-suite",
        .root_source_file = b.path("src/Evm/benchmarks/benchmark_suite.zig"),
        .target = target,
        .optimize = .ReleaseFast, // Use ReleaseFast for benchmarks
    });
    
    // Add package imports to benchmark suite
    benchmark_suite.root_module.addImport("evm", evm_pkg);
    benchmark_suite.root_module.addImport("utils", utils_pkg);
    benchmark_suite.root_module.addImport("address", address_pkg);
    benchmark_suite.root_module.addImport("state_manager", state_manager_pkg);
    benchmark_suite.root_module.addImport("compiler", compiler_mod);
    benchmark_suite.root_module.addImport("zabi", zabi_dep.module("zabi"));
    benchmark_suite.root_module.addImport("zbench", zbench_dep.module("zbench"));
    
    // Link the Rust static library
    benchmark_suite.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    benchmark_suite.linkLibC();
    
    // Link required system libraries for macOS
    if (target.result.os.tag == .macos) {
        benchmark_suite.linkFramework("Security");
        benchmark_suite.linkFramework("SystemConfiguration");
        benchmark_suite.linkFramework("CoreFoundation");
    }
    
    b.installArtifact(benchmark_suite);
    
    const run_benchmark_suite = b.addRunArtifact(benchmark_suite);
    const benchmark_suite_step = b.step("bench", "Run EVM benchmark suite");
    benchmark_suite_step.dependOn(&run_benchmark_suite.step);

    // Creates a step for unit testing.
    const lib_unit_tests = b.addTest(.{
        .root_module = zigevm_mod,
    });

    // Add all modules to standalone tests
    lib_unit_tests.root_module.addImport("Address", address_pkg);
    lib_unit_tests.root_module.addImport("Block", block_pkg);
    lib_unit_tests.root_module.addImport("Bytecode", bytecode_pkg);
    lib_unit_tests.root_module.addImport("Compiler", compiler_mod);
    lib_unit_tests.root_module.addImport("Evm", evm_pkg);
    lib_unit_tests.root_module.addImport("Rlp", rlp_pkg);
    lib_unit_tests.root_module.addImport("Token", token_pkg);
    lib_unit_tests.root_module.addImport("Trie", trie_pkg);
    lib_unit_tests.root_module.addImport("Utils", utils_pkg);

    // Additional standalone test specifically for Frame.test.zig
    const frame_test = b.addTest(.{
        .name = "frame-test",
        .root_source_file = b.path("src/Evm/Frame.test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add package imports to frame_test
    frame_test.root_module.addImport("evm", evm_pkg);
    frame_test.root_module.addImport("utils", utils_pkg);
    frame_test.root_module.addImport("address", address_pkg);
    frame_test.root_module.addImport("block", block_pkg);
    frame_test.root_module.addImport("bytecode", bytecode_pkg);
    frame_test.root_module.addImport("compiler", compiler_mod);
    frame_test.root_module.addImport("rlp", rlp_pkg);
    frame_test.root_module.addImport("token", token_pkg);
    frame_test.root_module.addImport("trie", trie_pkg);
    frame_test.root_module.addImport("state_manager", state_manager_pkg);
    frame_test.root_module.addImport("test_utils", test_pkg);

    const run_frame_test = b.addRunArtifact(frame_test);

    // Add a separate step for testing just the frame
    const frame_test_step = b.step("test-frame", "Run EVM frame tests");
    frame_test_step.dependOn(&run_frame_test.step);

    // Add a test for evm.zig
    const evm_test = b.addTest(.{
        .name = "evm-test",
        .root_source_file = b.path("src/Evm/evm.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add package imports to evm_test
    evm_test.root_module.addImport("evm", evm_pkg);
    evm_test.root_module.addImport("utils", utils_pkg);
    evm_test.root_module.addImport("address", address_pkg);
    evm_test.root_module.addImport("block", block_pkg);
    evm_test.root_module.addImport("bytecode", bytecode_pkg);
    evm_test.root_module.addImport("compiler", compiler_mod);
    evm_test.root_module.addImport("rlp", rlp_pkg);
    evm_test.root_module.addImport("token", token_pkg);
    evm_test.root_module.addImport("trie", trie_pkg);
    evm_test.root_module.addImport("state_manager", state_manager_pkg);
    evm_test.root_module.addImport("test_utils", test_pkg);

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
    server_test.root_module.addImport("zigevm", zigevm_mod);

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

    // Add package imports to rlp_test
    rlp_specific_test.root_module.addImport("rlp", rlp_pkg);
    rlp_specific_test.root_module.addImport("utils", utils_pkg);

    const run_rlp_test = b.addRunArtifact(rlp_specific_test);

    // Add a separate step for testing RLP
    const rlp_test_step = b.step("test-rlp", "Run RLP tests");
    rlp_test_step.dependOn(&run_rlp_test.step);

    // Add a test for Compiler tests
    const compiler_test = b.addTest(.{
        .name = "compiler-test",
        .root_source_file = b.path("src/Compilers/compiler.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add package imports to compiler_test
    compiler_test.root_module.addImport("compiler", compiler_mod);
    compiler_test.root_module.addImport("utils", utils_pkg);

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

    // Add package imports to trie_test
    trie_test.root_module.addImport("trie", trie_pkg);
    trie_test.root_module.addImport("utils", utils_pkg);
    trie_test.root_module.addImport("rlp", rlp_pkg);

    const run_trie_test = b.addRunArtifact(trie_test);

    // Add a separate step for testing Trie
    const trie_test_step = b.step("test-trie", "Run Trie tests");
    trie_test_step.dependOn(&run_trie_test.step);

    const interpreter_test = b.addTest(.{
        .name = "interpreter-test",
        .root_source_file = b.path("src/Evm/jumpTable/JumpTable.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add package imports to interpreter_test
    interpreter_test.root_module.addImport("evm", evm_pkg);
    interpreter_test.root_module.addImport("utils", utils_pkg);

    const run_interpreter_test = b.addRunArtifact(interpreter_test);

    // Add a separate step for testing Interpreter
    const interpreter_test_step = b.step("test-interpreter", "Run Interpreter tests");
    interpreter_test_step.dependOn(&run_interpreter_test.step);

    // Add interpreter.zig tests
    const interpreter_impl_test = b.addTest(.{
        .name = "interpreter-impl-test",
        .root_source_file = b.path("src/Evm/interpreter_test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add package imports to interpreter_impl_test
    interpreter_impl_test.root_module.addImport("evm", evm_pkg);
    interpreter_impl_test.root_module.addImport("utils", utils_pkg);
    interpreter_impl_test.root_module.addImport("address", address_pkg);

    const run_interpreter_impl_test = b.addRunArtifact(interpreter_impl_test);

    // Add a separate step for testing Interpreter implementation
    const interpreter_impl_test_step = b.step("test-interpreter-impl", "Run Interpreter implementation tests");
    interpreter_impl_test_step.dependOn(&run_interpreter_impl_test.step);

    // Add Rust Foundry wrapper integration
    const rust_build = @import("src/Compilers/rust_build.zig");
    const rust_step = rust_build.addRustIntegration(b, target, optimize) catch |err| {
        std.debug.print("Failed to add Rust integration: {}\n", .{err});
        return;
    };

    // Make the compiler test depend on the Rust build
    compiler_test.step.dependOn(rust_step);
    
    // Make the benchmark suite depend on the Rust build
    benchmark_suite.step.dependOn(rust_step);

    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);

    const exe_unit_tests = b.addTest(.{
        .root_module = exe_mod,
    });

    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);

    // Add a test for Contract.test.zig
    const contract_test = b.addTest(.{
        .name = "contract-test",
        .root_source_file = b.path("src/Evm/Contract.test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add package imports to contract_test
    contract_test.root_module.addImport("evm", evm_pkg);
    contract_test.root_module.addImport("utils", utils_pkg);

    const run_contract_test = b.addRunArtifact(contract_test);

    // Add a separate step for testing Contract
    const contract_test_step = b.step("test-contract", "Run Contract tests");
    contract_test_step.dependOn(&run_contract_test.step);

    // Add a test for EvmLogger.test.zig
    const evm_logger_test = b.addTest(.{
        .name = "evm-logger-test",
        .root_source_file = b.path("src/Evm/EvmLogger.test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add package imports to evm_logger_test
    evm_logger_test.root_module.addImport("evm", evm_pkg);
    evm_logger_test.root_module.addImport("utils", utils_pkg);

    const run_evm_logger_test = b.addRunArtifact(evm_logger_test);

    // Add a separate step for testing EvmLogger
    const evm_logger_test_step = b.step("test-evm-logger", "Run EvmLogger tests");
    evm_logger_test_step.dependOn(&run_evm_logger_test.step);

    // Define test step for all tests
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
    test_step.dependOn(&run_exe_unit_tests.step);
    test_step.dependOn(&run_evm_test.step);
    test_step.dependOn(&run_server_test.step);
    test_step.dependOn(&run_rlp_test.step);
    test_step.dependOn(&run_compiler_test.step);
    test_step.dependOn(&run_trie_test.step);
    test_step.dependOn(&run_interpreter_test.step);
    test_step.dependOn(&run_contract_test.step);
    test_step.dependOn(&run_evm_logger_test.step);

    // Create a standalone test that doesn't rely on module imports
    const environment_test = b.addTest(.{
        .name = "environment-test",
        .root_source_file = b.path("src/Evm/tests/environment_test3.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add package imports to environment_test
    environment_test.root_module.addImport("evm", evm_pkg);
    environment_test.root_module.addImport("utils", utils_pkg);

    const run_environment_test = b.addRunArtifact(environment_test);

    // Add a separate step for testing environment opcodes
    const environment_test_step = b.step("test-environment", "Run environment opcode tests");
    environment_test_step.dependOn(&run_environment_test.step);

    // Add environment test to all tests
    test_step.dependOn(&run_environment_test.step);

    // Define a single test step that runs all tests
    const test_all_step = b.step("test-all", "Run all unit tests");
    test_all_step.dependOn(test_step);

    const zabi_module = b.dependency("zabi", .{}).module("zabi");
    exe.root_module.addImport("zabi", zabi_module);
    lib.root_module.addImport("zabi", zabi_module);
}
