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
    const webui = b.dependency("webui", .{
        .target = target,
        .optimize = optimize,
        .dynamic = false,
        .@"enable-tls" = false,
        .verbose = .err,
    });
    const ui_exe = b.addExecutable(.{
        .name = "ui",
        .root_source_file = b.path("src/ui/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    ui_exe.linkLibrary(webui.artifact("webui"));
    // First create individual modules for each component
    const address_mod = b.createModule(.{
        .root_source_file = b.path("src/address/address.zig"),
        .target = target,
        .optimize = optimize,
    });
    address_mod.stack_check = false;
    address_mod.single_threaded = true;

    const abi_mod = b.createModule(.{
        .root_source_file = b.path("src/abi/abi.zig"),
        .target = target,
        .optimize = optimize,
    });
    abi_mod.stack_check = false;
    abi_mod.single_threaded = true;

    const utils_mod = b.createModule(.{
        .root_source_file = b.path("src/utils/utils.zig"),
        .target = target,
        .optimize = optimize,
    });
    utils_mod.stack_check = false;
    utils_mod.single_threaded = true;

    const trie_mod = b.createModule(.{
        .root_source_file = b.path("src/trie/module.zig"),
        .target = target,
        .optimize = optimize,
    });
    trie_mod.stack_check = false;
    trie_mod.single_threaded = true;

    const block_mod = b.createModule(.{
        .root_source_file = b.path("src/block/block.zig"),
        .target = target,
        .optimize = optimize,
    });
    block_mod.stack_check = false;
    block_mod.single_threaded = true;

    // Add imports to the block_mod
    block_mod.addImport("Address", address_mod);

    const bytecode_mod = b.createModule(.{
        .root_source_file = b.path("src/bytecode/bytecode.zig"),
        .target = target,
        .optimize = optimize,
    });
    bytecode_mod.stack_check = false;
    bytecode_mod.single_threaded = true;

    const compiler_mod = b.createModule(.{
        .root_source_file = b.path("src/compilers/compiler.zig"),
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
        .root_source_file = b.path("src/compilers/compiler_wasm.zig"),
        .target = wasm_target,
        .optimize = .ReleaseSmall,
    });
    compiler_wasm_mod.stack_check = false;
    compiler_wasm_mod.single_threaded = true;

    const rlp_mod = b.createModule(.{
        .root_source_file = b.path("src/rlp/rlp.zig"),
        .target = target,
        .optimize = optimize,
    });
    rlp_mod.stack_check = false;
    rlp_mod.single_threaded = true;

    // Add imports to the rlp_mod
    rlp_mod.addImport("utils", utils_mod);

    // Add imports to the address_mod
    address_mod.addImport("Rlp", rlp_mod);

    // Add imports to the trie_mod
    trie_mod.addImport("Rlp", rlp_mod);
    trie_mod.addImport("utils", utils_mod);

    const token_mod = b.createModule(.{
        .root_source_file = b.path("src/token/token.zig"),
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
    evm_mod.addImport("Rlp", rlp_mod);

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
    target_architecture_mod.addImport("utils", utils_mod);

    // Create the native executable module
    const exe_mod = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    exe_mod.stack_check = false;
    exe_mod.single_threaded = true;

    // Create WASM module with minimal WASM-specific source
    const wasm_mod = b.createModule(.{
        .root_source_file = b.path("src/root_wasm_minimal.zig"),
        .target = wasm_target,
        .optimize = .ReleaseSmall,
    });
    wasm_mod.stack_check = false;
    wasm_mod.single_threaded = true;

    // Don't add dependencies for minimal WASM build
    // We'll add them back once we fix the platform-specific issues

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
        .root_source_file = b.path("src/server/main.zig"),
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
    b.installArtifact(ui_exe);

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

    // Define a run ui step
    const run_ui_cmd = b.addRunArtifact(ui_exe);
    run_ui_cmd.step.dependOn(b.getInstallStep());

    // Pass arguments to the applications
    if (b.args) |args| {
        run_server_cmd.addArgs(args);
        run_ui_cmd.addArgs(args);
    }

    // Define run server step
    const run_server_step = b.step("run-server", "Run the JSON-RPC server");
    run_server_step.dependOn(&run_server_cmd.step);

    // Define run ui step
    const run_ui_step = b.step("ui", "Run the ui");
    run_ui_step.dependOn(&run_ui_cmd.step);

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
    lib_unit_tests.root_module.addImport("utils", utils_mod);

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
    evm_test.root_module.addImport("utils", utils_mod);

    const run_evm_test = b.addRunArtifact(evm_test);

    // Add a separate step for testing the EVM
    const evm_test_step = b.step("test-evm", "Run EVM tests");
    evm_test_step.dependOn(&run_evm_test.step);

    // Add a test for server.zig
    const server_test = b.addTest(.{
        .name = "server-test",
        .root_source_file = b.path("src/server/server.zig"),
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
        .root_source_file = b.path("src/rlp/rlp_test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to rlp_test
    rlp_specific_test.root_module.addImport("Rlp", rlp_mod);
    rlp_specific_test.root_module.addImport("utils", utils_mod);

    const run_rlp_test = b.addRunArtifact(rlp_specific_test);

    // Add a separate step for testing RLP
    const rlp_test_step = b.step("test-rlp", "Run RLP tests");
    rlp_test_step.dependOn(&run_rlp_test.step);

    // Add a test for abi_test.zig
    const abi_specific_test = b.addTest(.{
        .name = "abi-test",
        .root_source_file = b.path("src/abi/abi_test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to abi_test
    abi_specific_test.root_module.addImport("Abi", abi_mod);
    abi_specific_test.root_module.addImport("utils", utils_mod);

    const run_abi_test = b.addRunArtifact(abi_specific_test);

    // Add a separate step for testing ABI
    const abi_test_step = b.step("test-abi", "Run ABI tests");
    abi_test_step.dependOn(&run_abi_test.step);

    // Add a test for Compiler tests
    const compiler_test = b.addTest(.{
        .name = "compiler-test",
        .root_source_file = b.path("src/compilers/compiler.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to compiler_test
    compiler_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    compiler_test.root_module.addIncludePath(b.path("include"));

    const run_compiler_test = b.addRunArtifact(compiler_test);

    // Add a separate step for testing Compiler
    const compiler_test_step = b.step("test-compiler", "Run Compiler tests");
    compiler_test_step.dependOn(&run_compiler_test.step);

    // Add a test for Trie tests
    const trie_test = b.addTest(.{
        .name = "trie-test",
        .root_source_file = b.path("src/trie/main_test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add dependencies to trie_test
    trie_test.root_module.addImport("Rlp", rlp_mod);
    trie_test.root_module.addImport("utils", utils_mod);
    trie_test.root_module.addImport("Trie", trie_mod);

    const run_trie_test = b.addRunArtifact(trie_test);

    // Add a separate step for testing Trie
    const trie_test_step = b.step("test-trie", "Run Trie tests");
    trie_test_step.dependOn(&run_trie_test.step);

    const interpreter_test = b.addTest(.{
<<<<<<< HEAD
        .name = "interpreter-test",
        .root_source_file = b.path("src/evm/jump_table.zig"),
=======
        .name = "jump-table-test",
        .root_source_file = b.path("test/evm/jump_table_test.zig"),
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    interpreter_test.root_module.stack_check = false;

    // Add module imports to interpreter test
    interpreter_test.root_module.addImport("Address", address_mod);
    interpreter_test.root_module.addImport("Block", block_mod);
    interpreter_test.root_module.addImport("Rlp", rlp_mod);
    interpreter_test.root_module.addImport("evm", evm_mod);
    interpreter_test.root_module.addImport("utils", utils_mod);

    // Add module imports to interpreter test
    interpreter_test.root_module.addImport("Address", address_mod);
    interpreter_test.root_module.addImport("Block", block_mod);
    interpreter_test.root_module.addImport("Rlp", rlp_mod);

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




    // Add Memory limit tests
    const memory_limit_test = b.addTest(.{
        .name = "memory-limit-test",
        .root_source_file = b.path("test/evm/memory_limit_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    memory_limit_test.root_module.addImport("evm", evm_mod);

    const run_memory_limit_test = b.addRunArtifact(memory_limit_test);

    const memory_limit_test_step = b.step("test-memory-limit", "Run Memory limit tests");
    memory_limit_test_step.dependOn(&run_memory_limit_test.step);

    // Add Stack tests
    const stack_test = b.addTest(.{
        .name = "stack-test",
        .root_source_file = b.path("test/evm/stack_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    stack_test.root_module.addImport("evm", evm_mod);

    const run_stack_test = b.addRunArtifact(stack_test);

    const stack_test_step = b.step("test-stack", "Run Stack tests");
    stack_test_step.dependOn(&run_stack_test.step);

<<<<<<< HEAD
    // Add Stack batched operations tests
    const stack_batched_test = b.addTest(.{
        .name = "stack-batched-test",
        .root_source_file = b.path("test/evm/stack_batched_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    stack_batched_test.root_module.addImport("evm", evm_mod);

    const run_stack_batched_test = b.addRunArtifact(stack_batched_test);

    const stack_batched_test_step = b.step("test-stack-batched", "Run Stack batched operations tests");
    stack_batched_test_step.dependOn(&run_stack_batched_test.step);
=======
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    // Add Stack validation tests
    const stack_validation_test = b.addTest(.{
        .name = "stack-validation-test",
        .root_source_file = b.path("test/evm/stack_validation_test.zig"),
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    stack_validation_test.root_module.stack_check = false;
    stack_validation_test.root_module.addImport("evm", evm_mod);

    const run_stack_validation_test = b.addRunArtifact(stack_validation_test);

    const stack_validation_test_step = b.step("test-stack-validation", "Run Stack validation tests");
    stack_validation_test_step.dependOn(&run_stack_validation_test.step);

    // Add Opcodes tests
    const opcodes_test = b.addTest(.{
        .name = "opcodes-test",
        .root_source_file = b.path("test/evm/opcodes/opcodes_test.zig"),
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    opcodes_test.root_module.stack_check = false;

    // Add module imports to opcodes test
    opcodes_test.root_module.addImport("Address", address_mod);
    opcodes_test.root_module.addImport("Block", block_mod);
    opcodes_test.root_module.addImport("evm", evm_mod);
<<<<<<< HEAD
    opcodes_test.root_module.addImport("Utils", utils_mod);
=======
    opcodes_test.root_module.addImport("utils", utils_mod);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    const run_opcodes_test = b.addRunArtifact(opcodes_test);

    // Add a separate step for testing Opcodes
    const opcodes_test_step = b.step("test-opcodes", "Run Opcodes tests");
    opcodes_test_step.dependOn(&run_opcodes_test.step);

    // Create test_helpers module
    const test_helpers_mod = b.addModule("test_helpers", .{
        .root_source_file = b.path("test/evm/opcodes/test_helpers.zig"),
        .target = target,
        .optimize = optimize,
    });
    test_helpers_mod.stack_check = false;
    test_helpers_mod.single_threaded = true;
    test_helpers_mod.addImport("Address", address_mod);
    test_helpers_mod.addImport("evm", evm_mod);

    // Add VM opcode tests
    const vm_opcode_test = b.addTest(.{
        .name = "vm-opcode-test",
        .root_source_file = b.path("test/evm/vm_opcode_test.zig"),
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    vm_opcode_test.root_module.stack_check = false;

    // Add module imports to VM opcode test
    vm_opcode_test.root_module.addImport("Address", address_mod);
    vm_opcode_test.root_module.addImport("evm", evm_mod);

    const run_vm_opcode_test = b.addRunArtifact(vm_opcode_test);

    // Add a separate step for testing VM opcodes
    const vm_opcode_test_step = b.step("test-vm-opcodes", "Run VM opcode tests");
    vm_opcode_test_step.dependOn(&run_vm_opcode_test.step);

    // Add Integration tests
    const integration_test = b.addTest(.{
        .name = "integration-test",
        .root_source_file = b.path("test/evm/integration/package.zig"),
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    integration_test.root_module.stack_check = false;

    // Add module imports to integration test
    integration_test.root_module.addImport("Address", address_mod);
    integration_test.root_module.addImport("Block", block_mod);
    integration_test.root_module.addImport("evm", evm_mod);
<<<<<<< HEAD
    integration_test.root_module.addImport("Utils", utils_mod);
=======
    integration_test.root_module.addImport("utils", utils_mod);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    integration_test.root_module.addImport("test_helpers", test_helpers_mod);

    const run_integration_test = b.addRunArtifact(integration_test);

    // Add a separate step for testing Integration
    const integration_test_step = b.step("test-integration", "Run Integration tests");
    integration_test_step.dependOn(&run_integration_test.step);

    // Add Gas Accounting tests
    const gas_test = b.addTest(.{
        .name = "gas-test",
        .root_source_file = b.path("test/evm/gas/gas_accounting_test.zig"),
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    gas_test.root_module.stack_check = false;

    // Add module imports to gas test
    gas_test.root_module.addImport("Address", address_mod);
    gas_test.root_module.addImport("Block", block_mod);
    gas_test.root_module.addImport("evm", evm_mod);
<<<<<<< HEAD
    gas_test.root_module.addImport("Utils", utils_mod);
=======
    gas_test.root_module.addImport("utils", utils_mod);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    gas_test.root_module.addImport("test_helpers", test_helpers_mod);

    const run_gas_test = b.addRunArtifact(gas_test);

    // Add a separate step for testing Gas Accounting
    const gas_test_step = b.step("test-gas", "Run Gas Accounting tests");
    gas_test_step.dependOn(&run_gas_test.step);

    // Add Static Call Protection tests
    const static_protection_test = b.addTest(.{
        .name = "static-protection-test",
        .root_source_file = b.path("test/evm/static_call_protection_test.zig"),
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    static_protection_test.root_module.stack_check = false;

    // Add module imports to static protection test
    static_protection_test.root_module.addImport("Address", address_mod);
    static_protection_test.root_module.addImport("Block", block_mod);
    static_protection_test.root_module.addImport("evm", evm_mod);
<<<<<<< HEAD
    static_protection_test.root_module.addImport("Utils", utils_mod);
=======
    static_protection_test.root_module.addImport("utils", utils_mod);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    const run_static_protection_test = b.addRunArtifact(static_protection_test);

    // Add a separate step for testing Static Call Protection
    const static_protection_test_step = b.step("test-static-protection", "Run Static Call Protection tests");
    static_protection_test_step.dependOn(&run_static_protection_test.step);

<<<<<<< HEAD
=======
    // Add BLAKE2F precompile tests
    const blake2f_test = b.addTest(.{
        .name = "blake2f-test",
        .root_source_file = b.path("test/evm/precompiles/blake2f_test.zig"),
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    blake2f_test.root_module.stack_check = false;

    // Add module imports to BLAKE2F test
    blake2f_test.root_module.addImport("Address", address_mod);
    blake2f_test.root_module.addImport("Block", block_mod);
    blake2f_test.root_module.addImport("evm", evm_mod);
    blake2f_test.root_module.addImport("utils", utils_mod);

    const run_blake2f_test = b.addRunArtifact(blake2f_test);

    // Add a separate step for testing BLAKE2F
    const blake2f_test_step = b.step("test-blake2f", "Run BLAKE2F precompile tests");
    blake2f_test_step.dependOn(&run_blake2f_test.step);

>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
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

    // Add zBench dependency
    const zbench_dep = b.dependency("zbench", .{
        .target = target,
        .optimize = .ReleaseFast,
    });

    // Add EVM Memory benchmark
    const evm_memory_benchmark = b.addExecutable(.{
        .name = "evm-memory-benchmark",
        .root_source_file = b.path("bench/evm/memory_bench.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    evm_memory_benchmark.root_module.addImport("zbench", zbench_dep.module("zbench"));
    evm_memory_benchmark.root_module.addImport("evm", evm_mod);

    const run_evm_memory_benchmark = b.addRunArtifact(evm_memory_benchmark);

    const evm_memory_benchmark_step = b.step("bench-evm-memory", "Run EVM Memory benchmarks");
    evm_memory_benchmark_step.dependOn(&run_evm_memory_benchmark.step);

    // Add combined benchmark step
    const all_benchmark_step = b.step("bench", "Run all benchmarks");
    all_benchmark_step.dependOn(&run_memory_benchmark.step);
    all_benchmark_step.dependOn(&run_evm_memory_benchmark.step);
    all_benchmark_step.dependOn(&run_evm_memory_benchmark.step);

    // Add Rust Foundry wrapper integration
    const rust_build = @import("src/compilers/rust_build.zig");
    const rust_step = rust_build.add_rust_integration(b, target, optimize) catch |err| {
        std.debug.print("Failed to add Rust integration: {}\n", .{err});
        return;
    };

    // Make the compiler test depend on the Rust build
    compiler_test.step.dependOn(rust_step);

    // Link the Rust library to the compiler test
    compiler_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    compiler_test.linkLibC(); // Explicitly link LibC

    // Link system libraries required by Rust static lib on different OS
    if (target.result.os.tag == .linux) {
        compiler_test.linkSystemLibrary("unwind");
        compiler_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        compiler_test.linkFramework("CoreFoundation");
        compiler_test.linkFramework("Security");
        // Consider adding SystemConfiguration if rust_build.zig links it for its own tests
        // compiler_test.linkFramework("SystemConfiguration");
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
<<<<<<< HEAD
    test_step.dependOn(&run_memory_stress_test.step);
    test_step.dependOn(&run_memory_comparison_test.step);
    test_step.dependOn(&run_memory_limit_test.step);
    test_step.dependOn(&run_stack_test.step);
    test_step.dependOn(&run_stack_batched_test.step);
=======
    test_step.dependOn(&run_stack_test.step);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    test_step.dependOn(&run_stack_validation_test.step);
    test_step.dependOn(&run_opcodes_test.step);
    test_step.dependOn(&run_vm_opcode_test.step);
    test_step.dependOn(&run_integration_test.step);
    test_step.dependOn(&run_gas_test.step);
    test_step.dependOn(&run_static_protection_test.step);
<<<<<<< HEAD
=======
    test_step.dependOn(&run_blake2f_test.step);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    // Define a single test step that runs all tests
    const test_all_step = b.step("test-all", "Run all unit tests");
    test_all_step.dependOn(test_step);

    const zabi_module = b.dependency("zabi", .{}).module("zabi");
    exe.root_module.addImport("zabi", zabi_module);
    lib.root_module.addImport("zabi", zabi_module);

    // UI Build Integration
    const ui_build = UiBuildStep.create(b);

    // Create assets generation step
    const gen_assets = GenerateAssetsStep.create(b, "src/ui/dist");
    gen_assets.step.dependOn(&ui_build.step); // Assets generation depends on UI being built

    // Add the generated assets file to your UI module
    const ui_assets_mod = b.createModule(.{
        .root_source_file = b.path("src/ui/assets.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Update your ui_exe to include the assets
    ui_exe.root_module.addImport("assets", ui_assets_mod);

    // Make the UI executable depend on assets being generated
    ui_exe.step.dependOn(&gen_assets.step);

    // Update the run UI step to depend on the build
    run_ui_cmd.step.dependOn(&gen_assets.step);

    // Define build-only ui step
    const build_ui_step = b.step("build-ui", "Build the UI without running");
    build_ui_step.dependOn(&ui_exe.step);
    build_ui_step.dependOn(&gen_assets.step);
    build_ui_step.dependOn(b.getInstallStep());

    // Documentation generation step for EVM module only
    const docs_step = b.step("docs", "Generate EVM documentation");

    const evm_docs = b.addTest(.{
        .name = "evm-docs",
        .root_module = evm_mod,
    });

    // Install the generated docs
    const install_evm_docs = b.addInstallDirectory(.{
        .source_dir = evm_docs.getEmittedDocs(),
        .install_dir = .prefix,
        .install_subdir = "docs/evm",
    });

    docs_step.dependOn(&install_evm_docs.step);
}

// Custom build step for building the SolidJS UI
const UiBuildStep = struct {
    step: std.Build.Step,
    builder: *std.Build,

    pub fn create(builder: *std.Build) *UiBuildStep {
        const self = builder.allocator.create(UiBuildStep) catch unreachable;
        self.* = .{
            .step = std.Build.Step.init(.{
                .id = .custom,
                .name = "ui-build",
                .owner = builder,
                .makeFn = make,
            }),
            .builder = builder,
        };
        return self;
    }

    fn make(step: *std.Build.Step, options: std.Build.Step.MakeOptions) !void {
        _ = options;
        const self: *UiBuildStep = @fieldParentPtr("step", step);

        // Check if pnpm is available
        _ = self.builder.findProgram(&.{"pnpm"}, &.{}) catch {
            std.log.err("pnpm not found in PATH", .{});
            return error.PnpmNotFound;
        };

        // Check that UI directory exists
        var ui_dir = try std.fs.cwd().openDir("src/ui", .{});
        defer ui_dir.close();

        // Run pnpm install
        const install_result = try std.process.Child.run(.{
            .allocator = self.builder.allocator,
            .argv = &.{ "pnpm", "install" },
            .cwd = "src/ui",
        });
        defer self.builder.allocator.free(install_result.stdout);
        defer self.builder.allocator.free(install_result.stderr);

        if (install_result.term.Exited != 0) {
            std.log.err("pnpm install failed: {s}", .{install_result.stderr});
            return error.PnpmInstallFailed;
        }

        // Run pnpm build
        const build_result = try std.process.Child.run(.{
            .allocator = self.builder.allocator,
            .argv = &.{ "pnpm", "run", "build" },
            .cwd = "src/ui",
        });
        defer self.builder.allocator.free(build_result.stdout);
        defer self.builder.allocator.free(build_result.stderr);

        if (build_result.term.Exited != 0) {
            std.log.err("pnpm build failed: {s}", .{build_result.stderr});
            return error.PnpmBuildFailed;
        }

        std.log.info("UI build completed successfully", .{});
    }
};

// Generate a Zig file with embedded assets
const GenerateAssetsStep = struct {
    step: std.Build.Step,
    builder: *std.Build,
    ui_dist_path: []const u8,

    pub fn create(builder: *std.Build, ui_dist_path: []const u8) *GenerateAssetsStep {
        const self = builder.allocator.create(GenerateAssetsStep) catch unreachable;
        self.* = .{
            .step = std.Build.Step.init(.{
                .id = .custom,
                .name = "generate-assets",
                .owner = builder,
                .makeFn = make,
            }),
            .builder = builder,
            .ui_dist_path = ui_dist_path,
        };
        return self;
    }

    fn make(step: *std.Build.Step, options: std.Build.Step.MakeOptions) !void {
        _ = options;
        const self: *GenerateAssetsStep = @fieldParentPtr("step", step);

        var assets_content = std.ArrayList(u8).init(self.builder.allocator);
        defer assets_content.deinit();

        const writer = assets_content.writer();

        // Write the header
        try writer.writeAll(
            \\// This file is auto-generated. Do not edit manually.
            \\const std = @import("std");
            \\
            \\const Self = @This();
            \\
            \\path: []const u8,
            \\content: []const u8,
            \\mime_type: []const u8,
            \\response: [:0]const u8,
            \\
            \\pub fn init(
            \\    comptime path: []const u8,
            \\    comptime content: []const u8,
            \\    comptime mime_type: []const u8,
            \\) Self {
            \\    var buf: [20]u8 = undefined;
            \\    const n = std.fmt.bufPrint(&buf, "{d}", .{content.len}) catch unreachable;
            \\    const content_length = buf[0..n.len];
            \\    const response = "HTTP/1.1 200 OK\n" ++
            \\        "Content-Type: " ++ mime_type ++ "\n" ++
            \\        "Content-Length: " ++ content_length ++ "\n" ++
            \\        "\n" ++
            \\        content;
            \\    return Self{
            \\        .path = path,
            \\        .content = content,
            \\        .mime_type = mime_type,
            \\        .response = response,
            \\    };
            \\}
            \\
            \\pub const not_found_asset = Self.init(
            \\    "/notfound.html",
            \\    "<div>Page not found</div>",
            \\    "text/html",
            \\);
            \\
            \\pub const assets = [_]Self{
            \\
        );

        // Check if dist directory exists
        var dir = std.fs.cwd().openDir(self.ui_dist_path, .{ .iterate = true }) catch {
            std.log.info("UI dist directory not found at {s}, creating empty assets file", .{self.ui_dist_path});
            try writer.writeAll(
                \\    not_found_asset,
                \\};
                \\
                \\pub fn get_asset(filename: []const u8) ?Self {
                \\    for (assets) |asset| {
                \\        if (std.mem.eql(u8, asset.path, filename)) {
                \\            return asset;
                \\        }
                \\    }
                \\    return null;
                \\}
                \\
            );

            // Write empty assets file
            const assets_file = try std.fs.cwd().createFile("src/ui/assets.zig", .{});
            defer assets_file.close();
            try assets_file.writeAll(assets_content.items);
            return;
        };
        defer dir.close();

        var walker = try dir.walk(self.builder.allocator);
        defer walker.deinit();

        while (try walker.next()) |entry| {
            if (entry.kind != .file) continue;

            const mime_type = getMimeType(entry.path);
            // Create path relative to src/ui/assets.zig
            const embed_path = try std.fmt.allocPrint(self.builder.allocator, "dist/{s}", .{entry.path});
            defer self.builder.allocator.free(embed_path);

            try writer.print(
                \\    Self.init(
                \\        "/{s}",
                \\        @embedFile("{s}"),
                \\        "{s}",
                \\    ),
                \\
            , .{ entry.path, embed_path, mime_type });
        }

        try writer.writeAll(
            \\    not_found_asset,
            \\};
            \\
            \\pub fn get_asset(filename: []const u8) ?Self {
            \\    for (assets) |asset| {
            \\        if (std.mem.eql(u8, asset.path, filename)) {
            \\            return asset;
            \\        }
            \\    }
            \\    return null;
            \\}
            \\
        );

        // Write the file
        const assets_file = try std.fs.cwd().createFile("src/ui/assets.zig", .{});
        defer assets_file.close();
        try assets_file.writeAll(assets_content.items);
    }

    fn getMimeType(path: []const u8) []const u8 {
        if (std.mem.endsWith(u8, path, ".html")) return "text/html";
        if (std.mem.endsWith(u8, path, ".js")) return "application/javascript";
        if (std.mem.endsWith(u8, path, ".css")) return "text/css";
        if (std.mem.endsWith(u8, path, ".json")) return "application/json";
        if (std.mem.endsWith(u8, path, ".png")) return "image/png";
        if (std.mem.endsWith(u8, path, ".jpg") or std.mem.endsWith(u8, path, ".jpeg")) return "image/jpeg";
        if (std.mem.endsWith(u8, path, ".svg")) return "image/svg+xml";
        if (std.mem.endsWith(u8, path, ".woff2")) return "font/woff2";
        if (std.mem.endsWith(u8, path, ".woff")) return "font/woff";
        return "application/octet-stream";
    }
};
