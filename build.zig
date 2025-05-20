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

    // Create a single zigevm module - our core EVM implementation
    const zigevm_mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

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

    // Creates a step for unit testing.
    const lib_unit_tests = b.addTest(.{
        .root_module = zigevm_mod,
    });

    // Additional standalone test specifically for Frame.test.zig
    const frame_test = b.addTest(.{
        .name = "frame-test",
        .root_source_file = b.path("src/Evm/Frame.test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add zigevm module to frame_test
    frame_test.root_module.addImport("zigevm", zigevm_mod);

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

    // Add zigevm module to evm_test
    evm_test.root_module.addImport("zigevm", zigevm_mod);

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

    // Add zigevm module to rlp_test
    rlp_specific_test.root_module.addImport("zigevm", zigevm_mod);

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

    // Add zigevm module to abi_test
    abi_specific_test.root_module.addImport("zigevm", zigevm_mod);

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

    // Add zigevm module to compiler_test
    compiler_test.root_module.addImport("zigevm", zigevm_mod);

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

    // Add zigevm module to trie_test
    trie_test.root_module.addImport("zigevm", zigevm_mod);

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
    
    // Add zigevm module to contract_test
    contract_test.root_module.addImport("zigevm", zigevm_mod);

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
    
    // Add zigevm module to evm_logger_test
    evm_logger_test.root_module.addImport("zigevm", zigevm_mod);

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
        
        // Add zigevm module to opcode test
        opcode_test.root_module.addImport("zigevm", zigevm_mod);
        
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
    
    // Add zigevm module to precompile_test
    precompile_test.root_module.addImport("zigevm", zigevm_mod);

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
    
    // Add zigevm module to precompiled_test
    precompiled_test.root_module.addImport("zigevm", zigevm_mod);

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
    
    // Add zigevm module to evm_test_helpers_test
    evm_test_helpers_test.root_module.addImport("zigevm", zigevm_mod);

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
        
        // Add zigevm module to EIP test
        eip_test.root_module.addImport("zigevm", zigevm_mod);
        
        const run_eip_test = b.addRunArtifact(eip_test);
        eip_test_step.dependOn(&run_eip_test.step);
    }

    // Add a test for test_withdrawal.zig
    const withdrawal_test = b.addTest(.{
        .name = "withdrawal-test",
        .root_source_file = b.path("src/Evm/test_withdrawal.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add zigevm module to withdrawal_test
    withdrawal_test.root_module.addImport("zigevm", zigevm_mod);
    
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
    
    // Add zigevm module to signature_test
    signature_test.root_module.addImport("zigevm", zigevm_mod);

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
    
    // Add zigevm module to test_module_test
    test_module_test.root_module.addImport("zigevm", zigevm_mod);

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
    
    // Add zigevm module to token_specific_test
    token_specific_test.root_module.addImport("zigevm", zigevm_mod);

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
    
    // Add zigevm module to known_roots_test
    known_roots_test.root_module.addImport("zigevm", zigevm_mod);

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
    
    // Add zigevm module to trie_specific_test
    trie_specific_test.root_module.addImport("zigevm", zigevm_mod);

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
    
    // Add zigevm module to utils_test
    utils_test.root_module.addImport("zigevm", zigevm_mod);

    const run_utils_test = b.addRunArtifact(utils_test);
    
    // Add a separate step for testing Utils
    const utils_test_step = b.step("test-utils", "Run Utils tests");
    utils_test_step.dependOn(&run_utils_test.step);
    
    // Add a test for WithdrawalProcessor.test.zig
    // We no longer need a separate test_mod since all tests use the unified zigevm_mod
    
    // Create a standalone test for WithdrawalProcessor that uses direct file imports
    const withdrawal_processor_test = b.addTest(.{
        .name = "withdrawal-processor-test",
        .root_source_file = b.path("src/Evm/WithdrawalProcessor.test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add zigevm module to withdrawal_processor_test
    withdrawal_processor_test.root_module.addImport("zigevm", zigevm_mod);

    const run_withdrawal_processor_test = b.addRunArtifact(withdrawal_processor_test);
    
    // Add a separate step for testing WithdrawalProcessor
    const withdrawal_processor_test_step = b.step("test-withdrawal-processor", "Run WithdrawalProcessor tests");
    withdrawal_processor_test_step.dependOn(&run_withdrawal_processor_test.step);
    
    // Create a standalone test for Withdrawal.test.zig
    const withdrawal_specific_test = b.addTest(.{
        .name = "withdrawal-specific-test",
        .root_source_file = b.path("src/Evm/Withdrawal.test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add zigevm module to withdrawal_specific_test
    withdrawal_specific_test.root_module.addImport("zigevm", zigevm_mod);

    const run_withdrawal_specific_test = b.addRunArtifact(withdrawal_specific_test);
    
    // Add a separate step for testing Withdrawal
    const withdrawal_specific_test_step = b.step("test-withdrawal-specific", "Run Withdrawal specific tests");
    withdrawal_specific_test_step.dependOn(&run_withdrawal_specific_test.step);

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
    test_step.dependOn(&run_withdrawal_specific_test.step);

    // Create a standalone test that doesn't rely on module imports
    const environment_test = b.addTest(.{
        .name = "environment-test",
        .root_source_file = b.path("src/Evm/tests/environment_test3.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_environment_test = b.addRunArtifact(environment_test);

    // Add a separate step for testing environment opcodes
    const environment_test_step = b.step("test-environment", "Run environment opcode tests");
    environment_test_step.dependOn(&run_environment_test.step);

    // Add environment test to all tests
    test_step.dependOn(&run_environment_test.step);

    // Define a single test step that runs all tests
    const test_all_step = b.step("test-all", "Run all unit tests");
    test_all_step.dependOn(test_step);
}
