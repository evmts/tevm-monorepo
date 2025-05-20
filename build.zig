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
    
    const state_manager_mod = b.createModule(.{
        .root_source_file = b.path("src/StateManager/StateManager.zig"),
        .target = target,
        .optimize = optimize,
    });

    const abi_mod = b.createModule(.{
        .root_source_file = b.path("src/Abi/abi.zig"),
        .target = target,
        .optimize = optimize,
    });

    const utils_mod = b.createModule(.{
        .root_source_file = b.path("src/Utils/utils.zig"),
        .target = target,
        .optimize = optimize,
    });

    const trie_mod = b.createModule(.{
        .root_source_file = b.path("src/Trie/module.zig"),
        .target = target,
        .optimize = optimize,
    });

    const block_mod = b.createModule(.{
        .root_source_file = b.path("src/Block/block.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add imports to the block_mod
    block_mod.addImport("Address", address_mod);

    const bytecode_mod = b.createModule(.{
        .root_source_file = b.path("src/Bytecode/bytecode.zig"),
        .target = target,
        .optimize = optimize,
    });

    const compiler_mod = b.createModule(.{
        .root_source_file = b.path("src/Compiler/compiler.zig"),
        .target = target,
        .optimize = optimize,
    });

    const rlp_mod = b.createModule(.{
        .root_source_file = b.path("src/Rlp/rlp.zig"),
        .target = target,
        .optimize = optimize,
    });

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

    const evm_mod = b.createModule(.{
        .root_source_file = b.path("src/Evm/evm.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add imports to the evm_mod
    evm_mod.addImport("Address", address_mod);
    evm_mod.addImport("Block", block_mod);
    evm_mod.addImport("StateManager", state_manager_mod);

    // Create a ZigEVM module - our core EVM implementation
    const target_architecture_mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add package paths for absolute imports for all modules
    target_architecture_mod.addImport("Address", address_mod);
    target_architecture_mod.addImport("Abi", abi_mod);
    target_architecture_mod.addImport("Block", block_mod);
    target_architecture_mod.addImport("Bytecode", bytecode_mod);
    target_architecture_mod.addImport("Compiler", compiler_mod);
    target_architecture_mod.addImport("Evm", evm_mod);
    target_architecture_mod.addImport("Rlp", rlp_mod);
    target_architecture_mod.addImport("Token", token_mod);
    target_architecture_mod.addImport("Trie", trie_mod);
    target_architecture_mod.addImport("Utils", utils_mod);
    target_architecture_mod.addImport("StateManager", state_manager_mod);

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

    // Add package paths for absolute imports to WASM module
    wasm_mod.addImport("Address", address_mod);
    wasm_mod.addImport("Abi", abi_mod);
    wasm_mod.addImport("Block", block_mod);
    wasm_mod.addImport("Bytecode", bytecode_mod);
    wasm_mod.addImport("Compiler", compiler_mod);
    wasm_mod.addImport("Evm", evm_mod);
    wasm_mod.addImport("Rlp", rlp_mod);
    wasm_mod.addImport("Token", token_mod);
    wasm_mod.addImport("Trie", trie_mod);
    wasm_mod.addImport("Utils", utils_mod);
    wasm_mod.addImport("StateManager", state_manager_mod);

    // Modules can depend on one another using the `std.Build.Module.addImport` function.
    exe_mod.addImport("zigevm", target_architecture_mod);

    // Create the ZigEVM static library artifact
    const lib = b.addLibrary(.{
        .linkage = .static,
        .name = "zigevm",
        .root_module = target_architecture_mod,
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
    lib_unit_tests.root_module.addImport("Evm", evm_mod);
    lib_unit_tests.root_module.addImport("Rlp", rlp_mod);
    lib_unit_tests.root_module.addImport("Token", token_mod);
    lib_unit_tests.root_module.addImport("Trie", trie_mod);
    lib_unit_tests.root_module.addImport("Utils", utils_mod);

    // Additional standalone test specifically for Frame.test.zig
    const frame_test = b.addTest(.{
        .name = "frame-test",
        .root_source_file = b.path("src/Evm/Frame.test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add all modules to frame_test
    frame_test.root_module.addImport("Address", address_mod);
    frame_test.root_module.addImport("Abi", abi_mod);
    frame_test.root_module.addImport("Block", block_mod);
    frame_test.root_module.addImport("Bytecode", bytecode_mod);
    frame_test.root_module.addImport("Compiler", compiler_mod);
    frame_test.root_module.addImport("Evm", evm_mod);
    frame_test.root_module.addImport("Rlp", rlp_mod);
    frame_test.root_module.addImport("Token", token_mod);
    frame_test.root_module.addImport("Trie", trie_mod);
    frame_test.root_module.addImport("Utils", utils_mod);

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

    // Add all modules to evm_test
    evm_test.root_module.addImport("Address", address_mod);
    evm_test.root_module.addImport("Abi", abi_mod);
    evm_test.root_module.addImport("Block", block_mod);
    evm_test.root_module.addImport("Bytecode", bytecode_mod);
    evm_test.root_module.addImport("Compiler", compiler_mod);
    evm_test.root_module.addImport("Evm", evm_mod);
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
        .root_source_file = b.path("src/Compiler/resolutions.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to compiler_test
    compiler_test.root_module.addImport("Compiler", compiler_mod);

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
        .root_source_file = b.path("src/Evm/JumpTable.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_interpreter_test = b.addRunArtifact(interpreter_test);

    // Add a separate step for testing Interpreter
    const interpreter_test_step = b.step("test-interpreter", "Run Interpreter tests");
    interpreter_test_step.dependOn(&run_interpreter_test.step);

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
    
    // Add dependencies to contract_test
    contract_test.root_module.addImport("Address", address_mod);
    contract_test.root_module.addImport("Abi", abi_mod);
    contract_test.root_module.addImport("Block", block_mod);
    contract_test.root_module.addImport("Bytecode", bytecode_mod);
    contract_test.root_module.addImport("Compiler", compiler_mod);
    contract_test.root_module.addImport("Evm", evm_mod);
    contract_test.root_module.addImport("Rlp", rlp_mod);
    contract_test.root_module.addImport("Token", token_mod);
    contract_test.root_module.addImport("Trie", trie_mod);
    contract_test.root_module.addImport("Utils", utils_mod);

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
    
    // Add dependencies to evm_logger_test
    evm_logger_test.root_module.addImport("Address", address_mod);
    evm_logger_test.root_module.addImport("Abi", abi_mod);
    evm_logger_test.root_module.addImport("Block", block_mod);
    evm_logger_test.root_module.addImport("Bytecode", bytecode_mod);
    evm_logger_test.root_module.addImport("Compiler", compiler_mod);
    evm_logger_test.root_module.addImport("Evm", evm_mod);
    evm_logger_test.root_module.addImport("Rlp", rlp_mod);
    evm_logger_test.root_module.addImport("Token", token_mod);
    evm_logger_test.root_module.addImport("Trie", trie_mod);
    evm_logger_test.root_module.addImport("Utils", utils_mod);

    const run_evm_logger_test = b.addRunArtifact(evm_logger_test);
    
    // Add a separate step for testing EvmLogger
    const evm_logger_test_step = b.step("test-evm-logger", "Run EvmLogger tests");
    evm_logger_test_step.dependOn(&run_evm_logger_test.step);

    // Add tests for opcode files
    const opcodes_test_files = [_][]const u8{
        "src/Evm/opcodes/bitwise.test.zig",
        "src/Evm/opcodes/blob.test.zig",
        "src/Evm/opcodes/block.test.zig",
        "src/Evm/opcodes/calls.test.zig",
        "src/Evm/opcodes/comparison.test.zig",
        "src/Evm/opcodes/controlflow.test.zig",
        "src/Evm/opcodes/crypto.test.zig",
        "src/Evm/opcodes/environment.test.zig",
        "src/Evm/opcodes/log.test.zig",
        "src/Evm/opcodes/math.test.zig",
        "src/Evm/opcodes/math2.test.zig",
        "src/Evm/opcodes/memory.test.zig",
        "src/Evm/opcodes/storage.test.zig",
        "src/Evm/opcodes/transient.test.zig",
    };

    // Create a step for running all opcode tests
    const opcodes_test_step = b.step("test-opcodes", "Run all opcode tests");
    
    // Add each opcode test individually
    for (opcodes_test_files) |test_file| {
        const file_name_start = std.mem.lastIndexOf(u8, test_file, "/") orelse 0;
        const file_name = test_file[(file_name_start + 1)..];
        // Extract the base name for use as the test name
        const base_name_end = std.mem.indexOf(u8, file_name, ".test.zig") orelse file_name.len;
        const base_name = file_name[0..base_name_end];
        
        const opcode_test = b.addTest(.{
            .name = b.fmt("{s}-test", .{base_name}),
            .root_source_file = b.path(test_file),
            .target = target,
            .optimize = optimize,
        });
        
        // Add dependencies to opcode test
        opcode_test.root_module.addImport("Address", address_mod);
        opcode_test.root_module.addImport("Abi", abi_mod);
        opcode_test.root_module.addImport("Block", block_mod);
        opcode_test.root_module.addImport("Bytecode", bytecode_mod);
        opcode_test.root_module.addImport("Compiler", compiler_mod);
        opcode_test.root_module.addImport("Evm", evm_mod);
        opcode_test.root_module.addImport("Rlp", rlp_mod);
        opcode_test.root_module.addImport("Token", token_mod);
        opcode_test.root_module.addImport("Trie", trie_mod);
        opcode_test.root_module.addImport("Utils", utils_mod);
        
        const run_opcode_test = b.addRunArtifact(opcode_test);
        opcodes_test_step.dependOn(&run_opcode_test.step);
    }

    // Add a test for precompile_test.zig
    const precompile_test = b.addTest(.{
        .name = "precompile-test",
        .root_source_file = b.path("src/Evm/precompile/precompile_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add dependencies to precompile_test
    precompile_test.root_module.addImport("Address", address_mod);
    precompile_test.root_module.addImport("Abi", abi_mod);
    precompile_test.root_module.addImport("Block", block_mod);
    precompile_test.root_module.addImport("Bytecode", bytecode_mod);
    precompile_test.root_module.addImport("Compiler", compiler_mod);
    precompile_test.root_module.addImport("Evm", evm_mod);
    precompile_test.root_module.addImport("Rlp", rlp_mod);
    precompile_test.root_module.addImport("Token", token_mod);
    precompile_test.root_module.addImport("Trie", trie_mod);
    precompile_test.root_module.addImport("Utils", utils_mod);

    const run_precompile_test = b.addRunArtifact(precompile_test);
    
    // Add a separate step for testing precompiles
    const precompile_test_step = b.step("test-precompile", "Run precompile tests");
    precompile_test_step.dependOn(&run_precompile_test.step);

    // Add a test for Precompiled.test.zig
    const precompiled_test = b.addTest(.{
        .name = "precompiled-test",
        .root_source_file = b.path("src/Evm/precompiles/Precompiled.test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add dependencies to precompiled_test
    precompiled_test.root_module.addImport("Address", address_mod);
    precompiled_test.root_module.addImport("Abi", abi_mod);
    precompiled_test.root_module.addImport("Block", block_mod);
    precompiled_test.root_module.addImport("Bytecode", bytecode_mod);
    precompiled_test.root_module.addImport("Compiler", compiler_mod);
    precompiled_test.root_module.addImport("Evm", evm_mod);
    precompiled_test.root_module.addImport("Rlp", rlp_mod);
    precompiled_test.root_module.addImport("Token", token_mod);
    precompiled_test.root_module.addImport("Trie", trie_mod);
    precompiled_test.root_module.addImport("Utils", utils_mod);

    const run_precompiled_test = b.addRunArtifact(precompiled_test);
    
    // Add a separate step for testing precompiled contracts
    const precompiled_test_step = b.step("test-precompiled", "Run precompiled contract tests");
    precompiled_test_step.dependOn(&run_precompiled_test.step);

    // Add test for EvmTestHelpers.test.zig
    const evm_test_helpers_test = b.addTest(.{
        .name = "evm-test-helpers-test",
        .root_source_file = b.path("src/Evm/test/EvmTestHelpers.test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add dependencies to evm_test_helpers_test
    evm_test_helpers_test.root_module.addImport("Address", address_mod);
    evm_test_helpers_test.root_module.addImport("Abi", abi_mod);
    evm_test_helpers_test.root_module.addImport("Block", block_mod);
    evm_test_helpers_test.root_module.addImport("Bytecode", bytecode_mod);
    evm_test_helpers_test.root_module.addImport("Compiler", compiler_mod);
    evm_test_helpers_test.root_module.addImport("Evm", evm_mod);
    evm_test_helpers_test.root_module.addImport("Rlp", rlp_mod);
    evm_test_helpers_test.root_module.addImport("Token", token_mod);
    evm_test_helpers_test.root_module.addImport("Trie", trie_mod);
    evm_test_helpers_test.root_module.addImport("Utils", utils_mod);

    const run_evm_test_helpers_test = b.addRunArtifact(evm_test_helpers_test);
    
    // Add a separate step for testing EvmTestHelpers
    const evm_test_helpers_test_step = b.step("test-evm-helpers", "Run EVM test helpers tests");
    evm_test_helpers_test_step.dependOn(&run_evm_test_helpers_test.step);

    // Add tests for EIP test files
    const eip_test_files = [_][]const u8{
        "src/Evm/tests/eip2200.test.zig",
        "src/Evm/tests/eip2929.test.zig",
        "src/Evm/tests/eip3198.test.zig",
        "src/Evm/tests/eip3541.test.zig",
        "src/Evm/tests/eip3651.test.zig",
        "src/Evm/tests/eip3855.test.zig",
        "src/Evm/tests/eip5656.test.zig",
    };

    // Create a step for running all EIP tests
    const eip_test_step = b.step("test-eips", "Run all EIP tests");
    
    // Add each EIP test individually
    for (eip_test_files) |test_file| {
        const file_name_start = std.mem.lastIndexOf(u8, test_file, "/") orelse 0;
        const file_name = test_file[(file_name_start + 1)..];
        // Extract the base name for use as the test name
        const base_name_end = std.mem.indexOf(u8, file_name, ".test.zig") orelse file_name.len;
        const base_name = file_name[0..base_name_end];
        
        const eip_test = b.addTest(.{
            .name = b.fmt("{s}-test", .{base_name}),
            .root_source_file = b.path(test_file),
            .target = target,
            .optimize = optimize,
        });
        
        // Add dependencies to EIP test
        eip_test.root_module.addImport("Address", address_mod);
        eip_test.root_module.addImport("Abi", abi_mod);
        eip_test.root_module.addImport("Block", block_mod);
        eip_test.root_module.addImport("Bytecode", bytecode_mod);
        eip_test.root_module.addImport("Compiler", compiler_mod);
        eip_test.root_module.addImport("Evm", evm_mod);
        eip_test.root_module.addImport("Rlp", rlp_mod);
        eip_test.root_module.addImport("Token", token_mod);
        eip_test.root_module.addImport("Trie", trie_mod);
        eip_test.root_module.addImport("Utils", utils_mod);
        
        const run_eip_test = b.addRunArtifact(eip_test);
        eip_test_step.dependOn(&run_eip_test.step);
    }

    // Add a test for Withdrawal.test.zig
    const withdrawal_test = b.addTest(.{
        .name = "withdrawal-test",
        .root_source_file = b.path("src/Evm/Withdrawal.test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add dependencies to withdrawal_test
    withdrawal_test.root_module.addImport("Address", address_mod);
    withdrawal_test.root_module.addImport("Abi", abi_mod);
    withdrawal_test.root_module.addImport("Block", block_mod);
    withdrawal_test.root_module.addImport("Bytecode", bytecode_mod);
    withdrawal_test.root_module.addImport("Compiler", compiler_mod);
    withdrawal_test.root_module.addImport("Evm", evm_mod);
    withdrawal_test.root_module.addImport("Rlp", rlp_mod);
    withdrawal_test.root_module.addImport("Token", token_mod);
    withdrawal_test.root_module.addImport("Trie", trie_mod);
    withdrawal_test.root_module.addImport("Utils", utils_mod);
    withdrawal_test.root_module.addImport("StateManager", state_manager_mod);
    
    const run_withdrawal_test = b.addRunArtifact(withdrawal_test);
    
    // Add a separate step for testing Withdrawal
    const withdrawal_test_step = b.step("test-withdrawal", "Run Withdrawal tests");
    withdrawal_test_step.dependOn(&run_withdrawal_test.step);
    
    // Add test for Logger_test.zig
    const logger_test = b.addTest(.{
        .name = "logger-test",
        .root_source_file = b.path("src/Server/middleware/Logger_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add httpz dependency to logger test
    logger_test.root_module.addImport("httpz", httpz_dep.module("httpz"));

    const run_logger_test = b.addRunArtifact(logger_test);
    
    // Add a separate step for testing Logger middleware
    const logger_test_step = b.step("test-logger", "Run Logger middleware tests");
    logger_test_step.dependOn(&run_logger_test.step);

    // Add test for server_test.zig (if different from server.zig tests)
    const server_specific_test = b.addTest(.{
        .name = "server-specific-test",
        .root_source_file = b.path("src/Server/server_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add the httpz dependency to the server specific test
    server_specific_test.root_module.addImport("httpz", httpz_dep.module("httpz"));

    const run_server_specific_test = b.addRunArtifact(server_specific_test);
    
    // Add a separate step for testing Server specific tests
    const server_specific_test_step = b.step("test-server-specific", "Run Server specific tests");
    server_specific_test_step.dependOn(&run_server_specific_test.step);

    // Add a test for signature_test.zig
    const signature_test = b.addTest(.{
        .name = "signature-test",
        .root_source_file = b.path("src/Signature/signature_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add dependencies to signature_test
    signature_test.root_module.addImport("Utils", utils_mod);

    const run_signature_test = b.addRunArtifact(signature_test);
    
    // Add a separate step for testing Signature
    const signature_test_step = b.step("test-signature", "Run Signature tests");
    signature_test_step.dependOn(&run_signature_test.step);

    // Add a test for test.zig in Test module
    const test_module_test = b.addTest(.{
        .name = "test-module-test",
        .root_source_file = b.path("src/Test/test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add dependencies to test_module_test as needed
    test_module_test.root_module.addImport("Address", address_mod);
    test_module_test.root_module.addImport("Abi", abi_mod);
    test_module_test.root_module.addImport("Utils", utils_mod);

    const run_test_module_test = b.addRunArtifact(test_module_test);
    
    // Add a separate step for testing Test module
    const test_module_test_step = b.step("test-module", "Run Test module tests");
    test_module_test_step.dependOn(&run_test_module_test.step);

    // Add a test for token_test.zig
    const token_specific_test = b.addTest(.{
        .name = "token-test",
        .root_source_file = b.path("src/Token/token_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add dependencies to token_specific_test
    token_specific_test.root_module.addImport("Token", token_mod);
    token_specific_test.root_module.addImport("Utils", utils_mod);

    const run_token_specific_test = b.addRunArtifact(token_specific_test);
    
    // Add a separate step for testing Token specific tests
    const token_specific_test_step = b.step("test-token", "Run Token tests");
    token_specific_test_step.dependOn(&run_token_specific_test.step);

    // Add a test for known_roots_test.zig
    const known_roots_test = b.addTest(.{
        .name = "known-roots-test",
        .root_source_file = b.path("src/Trie/known_roots_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add dependencies to known_roots_test
    known_roots_test.root_module.addImport("Rlp", rlp_mod);
    known_roots_test.root_module.addImport("Utils", utils_mod);
    known_roots_test.root_module.addImport("Trie", trie_mod);

    const run_known_roots_test = b.addRunArtifact(known_roots_test);
    
    // Add a separate step for testing Known Roots
    const known_roots_test_step = b.step("test-known-roots", "Run Known Roots tests");
    known_roots_test_step.dependOn(&run_known_roots_test.step);

    // Add a test for trie_test.zig
    const trie_specific_test = b.addTest(.{
        .name = "trie-specific-test",
        .root_source_file = b.path("src/Trie/trie_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add dependencies to trie_specific_test
    trie_specific_test.root_module.addImport("Rlp", rlp_mod);
    trie_specific_test.root_module.addImport("Utils", utils_mod);
    trie_specific_test.root_module.addImport("Trie", trie_mod);

    const run_trie_specific_test = b.addRunArtifact(trie_specific_test);
    
    // Add a separate step for testing Trie specific tests
    const trie_specific_test_step = b.step("test-trie-specific", "Run Trie specific tests");
    trie_specific_test_step.dependOn(&run_trie_specific_test.step);

    // Add a test for utils_test.zig
    const utils_test = b.addTest(.{
        .name = "utils-test",
        .root_source_file = b.path("src/Utils/utils_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add dependencies to utils_test
    utils_test.root_module.addImport("Utils", utils_mod);

    const run_utils_test = b.addRunArtifact(utils_test);
    
    // Add a separate step for testing Utils
    const utils_test_step = b.step("test-utils", "Run Utils tests");
    utils_test_step.dependOn(&run_utils_test.step);
    
    // Add a test for WithdrawalProcessor.test.zig
    // Create a standalone test for WithdrawalProcessor that directly uses files without module system
    // This bypasses the module system's circular dependencies
    const withdrawal_processor_test = b.addTest(.{
        .name = "withdrawal-processor-test",
        .root_source_file = b.path("src/Test/WithdrawalProcessor.test.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_withdrawal_processor_test = b.addRunArtifact(withdrawal_processor_test);
    
    // Add a separate step for testing WithdrawalProcessor
    const withdrawal_processor_test_step = b.step("test-withdrawal-processor", "Run WithdrawalProcessor tests");
    withdrawal_processor_test_step.dependOn(&run_withdrawal_processor_test.step);

    // Define test step for all tests
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
    test_step.dependOn(&run_exe_unit_tests.step);
    test_step.dependOn(&run_frame_test.step);
    test_step.dependOn(&run_evm_test.step);
    test_step.dependOn(&run_server_test.step);
    test_step.dependOn(&run_rlp_test.step);
    test_step.dependOn(&run_abi_test.step);
    test_step.dependOn(&run_compiler_test.step);
    test_step.dependOn(&run_trie_test.step);
    test_step.dependOn(&run_interpreter_test.step);
    test_step.dependOn(&run_contract_test.step);
    test_step.dependOn(&run_evm_logger_test.step);
    test_step.dependOn(opcodes_test_step);
    test_step.dependOn(&run_precompile_test.step);
    test_step.dependOn(&run_precompiled_test.step);
    test_step.dependOn(&run_evm_test_helpers_test.step);
    test_step.dependOn(eip_test_step);
    test_step.dependOn(&run_logger_test.step);
    test_step.dependOn(&run_server_specific_test.step);
    test_step.dependOn(&run_signature_test.step);
    test_step.dependOn(&run_test_module_test.step);
    test_step.dependOn(&run_token_specific_test.step);
    test_step.dependOn(&run_known_roots_test.step);
    test_step.dependOn(&run_trie_specific_test.step);
    test_step.dependOn(&run_utils_test.step);
    test_step.dependOn(&run_withdrawal_processor_test.step);

    // Define a single test step that runs all tests
    const test_all_step = b.step("test-all", "Run all unit tests");
    test_all_step.dependOn(test_step);
}
