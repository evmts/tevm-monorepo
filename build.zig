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
    
    // Add include path to the compiler module itself so C imports work
    compiler_mod.addIncludePath(b.path("include"));

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
        .name = "jump-table-test",
        .root_source_file = b.path("test/evm/jump_table_test.zig"),
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
    opcodes_test.root_module.addImport("utils", utils_mod);

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
    integration_test.root_module.addImport("utils", utils_mod);
    integration_test.root_module.addImport("test_helpers", test_helpers_mod);

    const run_integration_test = b.addRunArtifact(integration_test);

    // Add a separate step for testing Integration
    const integration_test_step = b.step("test-integration", "Run Integration tests");
    integration_test_step.dependOn(&run_integration_test.step);

    // Add debug CREATE test
    const debug_test = b.addExecutable(.{
        .name = "debug-test",
        .root_source_file = b.path("debug_create_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    debug_test.root_module.addImport("evm", evm_mod);
    debug_test.root_module.addImport("Address", address_mod);
    debug_test.root_module.stack_check = false;
    debug_test.root_module.single_threaded = true;

    const run_debug_test = b.addRunArtifact(debug_test);
    const debug_test_step = b.step("test-debug", "Run debug CREATE test");
    debug_test_step.dependOn(&run_debug_test.step);

    // Add simple debug CREATE test
    const debug_simple_test = b.addExecutable(.{
        .name = "debug-simple-test",
        .root_source_file = b.path("debug_create_simple.zig"),
        .target = target,
        .optimize = optimize,
    });
    debug_simple_test.root_module.addImport("evm", evm_mod);
    debug_simple_test.root_module.addImport("Address", address_mod);
    debug_simple_test.root_module.stack_check = false;
    debug_simple_test.root_module.single_threaded = true;

    const run_debug_simple_test = b.addRunArtifact(debug_simple_test);
    const debug_simple_test_step = b.step("test-debug-simple", "Run simple debug CREATE test");
    debug_simple_test_step.dependOn(&run_debug_simple_test.step);

    // Add TenThousandHashes debug test
    const debug_tenhashes_test = b.addExecutable(.{
        .name = "debug-tenhashes-test",
        .root_source_file = b.path("debug_tenthousandhashes_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    debug_tenhashes_test.root_module.addImport("evm", evm_mod);
    debug_tenhashes_test.root_module.addImport("Address", address_mod);
    debug_tenhashes_test.root_module.stack_check = false;
    debug_tenhashes_test.root_module.single_threaded = true;

    const run_debug_tenhashes_test = b.addRunArtifact(debug_tenhashes_test);
    const debug_tenhashes_test_step = b.step("test-debug-tenhashes", "Run TenThousandHashes debug CREATE test");
    debug_tenhashes_test_step.dependOn(&run_debug_tenhashes_test.step);

    // Add bytecode analysis tool
    const debug_bytecode_analysis = b.addExecutable(.{
        .name = "debug-bytecode-analysis",
        .root_source_file = b.path("debug_bytecode_analysis.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_debug_bytecode_analysis = b.addRunArtifact(debug_bytecode_analysis);
    const debug_bytecode_analysis_step = b.step("analyze-bytecode", "Analyze TenThousandHashes bytecode structure");
    debug_bytecode_analysis_step.dependOn(&run_debug_bytecode_analysis.step);

    // Add stack bug test
    const test_stack_bug = b.addExecutable(.{
        .name = "test-stack-bug",
        .root_source_file = b.path("test_stack_bug.zig"),
        .target = target,
        .optimize = optimize,
    });
    test_stack_bug.root_module.addImport("evm", evm_mod);
    test_stack_bug.root_module.addImport("Address", address_mod);
    test_stack_bug.root_module.stack_check = false;
    test_stack_bug.root_module.single_threaded = true;

    const run_test_stack_bug = b.addRunArtifact(test_stack_bug);
    const test_stack_bug_step = b.step("test-stack-bug", "Test the corrected constructor");
    test_stack_bug_step.dependOn(&run_test_stack_bug.step);

    // Add RETURN opcode debug test
    const debug_return_opcode = b.addExecutable(.{
        .name = "debug-return-opcode",
        .root_source_file = b.path("debug_return_opcode.zig"),
        .target = target,
        .optimize = optimize,
    });
    debug_return_opcode.root_module.addImport("evm", evm_mod);
    debug_return_opcode.root_module.addImport("Address", address_mod);
    debug_return_opcode.root_module.stack_check = false;
    debug_return_opcode.root_module.single_threaded = true;

    const run_debug_return_opcode = b.addRunArtifact(debug_return_opcode);
    const debug_return_opcode_step = b.step("test-return-opcode", "Test RETURN opcode implementation");
    debug_return_opcode_step.dependOn(&run_debug_return_opcode.step);

    // Add simple CREATE debug executable with logging
    const debug_create_simple_with_logging = b.addExecutable(.{
        .name = "debug-create-simple-with-logging",
        .root_source_file = b.path("debug_create_simple_with_logging.zig"),
        .target = target,
        .optimize = optimize,
    });
    debug_create_simple_with_logging.root_module.addImport("evm", evm_mod);
    debug_create_simple_with_logging.root_module.addImport("Address", address_mod);
    debug_create_simple_with_logging.root_module.stack_check = false;
    debug_create_simple_with_logging.root_module.single_threaded = true;

    const run_debug_create_simple_with_logging = b.addRunArtifact(debug_create_simple_with_logging);
    const debug_create_simple_with_logging_step = b.step("debug-create-simple-logging", "Debug simple CREATE with logging");
    debug_create_simple_with_logging_step.dependOn(&run_debug_create_simple_with_logging.step);

    // Add TenThousandHashes CREATE debug executable
    const debug_tenhashes_detailed = b.addExecutable(.{
        .name = "debug-tenhashes-detailed",
        .root_source_file = b.path("debug_tenhashes_detailed.zig"),
        .target = target,
        .optimize = optimize,
    });
    debug_tenhashes_detailed.root_module.addImport("evm", evm_mod);
    debug_tenhashes_detailed.root_module.addImport("Address", address_mod);
    debug_tenhashes_detailed.root_module.stack_check = false;
    debug_tenhashes_detailed.root_module.single_threaded = true;

    const run_debug_tenhashes_detailed = b.addRunArtifact(debug_tenhashes_detailed);
    const debug_tenhashes_detailed_step = b.step("debug-tenhashes-detailed", "Debug TenThousandHashes CREATE with detailed logging");
    debug_tenhashes_detailed_step.dependOn(&run_debug_tenhashes_detailed.step);

    // Add function selector debug tool
    const debug_function_selector = b.addExecutable(.{
        .name = "debug-function-selector",
        .root_source_file = b.path("debug_function_selector.zig"),
        .target = target,
        .optimize = optimize,
    });
    debug_function_selector.root_module.addImport("evm", evm_mod);
    debug_function_selector.root_module.addImport("Address", address_mod);
    debug_function_selector.root_module.addImport("Compiler", compiler_mod);
    debug_function_selector.root_module.stack_check = false;
    debug_function_selector.root_module.single_threaded = true;

    const run_debug_function_selector = b.addRunArtifact(debug_function_selector);
    const debug_function_selector_step = b.step("debug-function-selector", "Debug function selector calculation");
    debug_function_selector_step.dependOn(&run_debug_function_selector.step);

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
    gas_test.root_module.addImport("utils", utils_mod);
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
    static_protection_test.root_module.addImport("utils", utils_mod);

    const run_static_protection_test = b.addRunArtifact(static_protection_test);

    // Add a separate step for testing Static Call Protection
    const static_protection_test_step = b.step("test-static-protection", "Run Static Call Protection tests");
    static_protection_test_step.dependOn(&run_static_protection_test.step);

    // Add CREATE Contract tests
    const create_contract_test = b.addTest(.{
        .name = "create-contract-test",
        .root_source_file = b.path("test/evm/create_contract_test.zig"),
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    create_contract_test.root_module.stack_check = false;

    // Add module imports to create contract test
    create_contract_test.root_module.addImport("Address", address_mod);
    create_contract_test.root_module.addImport("Block", block_mod);
    create_contract_test.root_module.addImport("evm", evm_mod);
    create_contract_test.root_module.addImport("utils", utils_mod);

    const run_create_contract_test = b.addRunArtifact(create_contract_test);

    // Add a separate step for testing CREATE contracts
    const create_contract_test_step = b.step("test-create-contract", "Run CREATE contract tests");
    create_contract_test_step.dependOn(&run_create_contract_test.step);

    // Add Precompile tests
    const precompile_test = b.addTest(.{
        .name = "precompile-test",
        .root_source_file = b.path("test/evm/precompiles/sha256_test.zig"),
        .target = target,
        .optimize = optimize,
    });

    precompile_test.root_module.stack_check = false;

    // Add module imports to precompile test
    precompile_test.root_module.addImport("Address", address_mod);
    precompile_test.root_module.addImport("Block", block_mod);
    precompile_test.root_module.addImport("evm", evm_mod);
    precompile_test.root_module.addImport("utils", utils_mod);

    const run_precompile_test = b.addRunArtifact(precompile_test);

    // Add a separate step for testing Precompiles
    const precompile_test_step = b.step("test-precompiles", "Run Precompile tests");
    precompile_test_step.dependOn(&run_precompile_test.step);

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


    // Add combined benchmark step (EVM contract benchmark will be added later)
    const all_benchmark_step = b.step("bench", "Run all benchmarks");
    all_benchmark_step.dependOn(&run_memory_benchmark.step);
    all_benchmark_step.dependOn(&run_evm_memory_benchmark.step);

    // Add Tevm runner for evm-bench integration
    const tevm_runner = b.addExecutable(.{
        .name = "tevm-runner",
        .root_source_file = b.path("bench/evm/runners/tevm/runner.zig"),
        .target = target,
        .optimize = .ReleaseFast, // Use ReleaseFast for benchmarks
    });

    // Add all module imports to tevm_runner
    tevm_runner.root_module.addImport("Address", address_mod);
    tevm_runner.root_module.addImport("Abi", abi_mod);
    tevm_runner.root_module.addImport("Block", block_mod);
    tevm_runner.root_module.addImport("Bytecode", bytecode_mod);
    tevm_runner.root_module.addImport("Compiler", compiler_mod);
    tevm_runner.root_module.addImport("evm", evm_mod);
    tevm_runner.root_module.addImport("Rlp", rlp_mod);
    tevm_runner.root_module.addImport("Token", token_mod);
    tevm_runner.root_module.addImport("Trie", trie_mod);
    tevm_runner.root_module.addImport("utils", utils_mod);

    // Install the tevm-runner executable
    b.installArtifact(tevm_runner);

    // Add build step for tevm-runner
    const build_tevm_runner_step = b.step("tevm-runner", "Build the Tevm evm-bench runner");
    build_tevm_runner_step.dependOn(&tevm_runner.step);
    build_tevm_runner_step.dependOn(b.getInstallStep());

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

    // Add Compiler Integration tests (after rust dependencies are set up)
    const compiler_integration_test = b.addTest(.{
        .name = "compiler-integration-test",
        .root_source_file = b.path("test/evm/compiler_integration_test.zig"),
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    compiler_integration_test.root_module.stack_check = false;

    // Add module imports to compiler integration test
    compiler_integration_test.root_module.addImport("evm", target_architecture_mod);
    compiler_integration_test.root_module.addImport("Compiler", compiler_mod);
    compiler_integration_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    compiler_integration_test.root_module.addIncludePath(b.path("include"));

    // Add Rust dependencies to compiler integration test (same as compiler test)
    compiler_integration_test.step.dependOn(rust_step);
    compiler_integration_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    compiler_integration_test.linkLibC();
    
    // Link system libraries for compiler integration test
    if (target.result.os.tag == .linux) {
        compiler_integration_test.linkSystemLibrary("unwind");
        compiler_integration_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        compiler_integration_test.linkFramework("CoreFoundation");
        compiler_integration_test.linkFramework("Security");
    }

    const run_compiler_integration_test = b.addRunArtifact(compiler_integration_test);

    // Add a separate step for testing Compiler Integration
    const compiler_integration_test_step = b.step("test-compiler-integration", "Run Compiler Integration tests");
    compiler_integration_test_step.dependOn(&run_compiler_integration_test.step);

    // Add Real Contract Execution tests (for debugging actual contract execution)
    const real_contract_execution_test = b.addTest(.{
        .name = "real-contract-execution-test",
        .root_source_file = b.path("test/evm/real_contract_execution_test.zig"),
        .target = target,
        .optimize = optimize,
        .single_threaded = true,
    });
    real_contract_execution_test.root_module.stack_check = false;

    // Add module imports to real contract execution test
    real_contract_execution_test.root_module.addImport("evm", target_architecture_mod);
    real_contract_execution_test.root_module.addImport("Compiler", compiler_mod);
    real_contract_execution_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    real_contract_execution_test.root_module.addIncludePath(b.path("include"));

    // Add Rust dependencies to real contract execution test
    real_contract_execution_test.step.dependOn(rust_step);
    real_contract_execution_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    real_contract_execution_test.linkLibC();
    
    // Link system libraries for real contract execution test
    if (target.result.os.tag == .linux) {
        real_contract_execution_test.linkSystemLibrary("unwind");
        real_contract_execution_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        real_contract_execution_test.linkFramework("CoreFoundation");
        real_contract_execution_test.linkFramework("Security");
    }

    const run_real_contract_execution_test = b.addRunArtifact(real_contract_execution_test);

    // Add a separate step for testing Real Contract Execution
    const real_contract_execution_test_step = b.step("test-real-contract-execution", "Run Real Contract Execution tests");
    real_contract_execution_test_step.dependOn(&run_real_contract_execution_test.step);

    // Add Simple Contract Execution test
    const simple_contract_execution_test = b.addTest(.{
        .name = "simple-contract-execution-test",
        .root_source_file = b.path("test/evm/simple_contract_execution_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    simple_contract_execution_test.root_module.addImport("evm", target_architecture_mod);
    simple_contract_execution_test.root_module.addImport("Compiler", compiler_mod);
    simple_contract_execution_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    simple_contract_execution_test.root_module.addIncludePath(b.path("include"));
    simple_contract_execution_test.step.dependOn(rust_step);
    simple_contract_execution_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    simple_contract_execution_test.linkLibC();
    if (target.result.os.tag == .linux) {
        simple_contract_execution_test.linkSystemLibrary("unwind");
        simple_contract_execution_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        simple_contract_execution_test.linkFramework("CoreFoundation");
        simple_contract_execution_test.linkFramework("Security");
    }
    const run_simple_contract_execution_test = b.addRunArtifact(simple_contract_execution_test);
    const simple_contract_execution_test_step = b.step("test-simple-contract-execution", "Run Simple Contract Execution tests");
    simple_contract_execution_test_step.dependOn(&run_simple_contract_execution_test.step);
    
    // Add Compiler Bytecode Issue test
    const compiler_bytecode_issue_test = b.addTest(.{
        .name = "compiler-bytecode-issue-test",
        .root_source_file = b.path("test/evm/compiler_bytecode_issue_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    compiler_bytecode_issue_test.root_module.addImport("evm", target_architecture_mod);
    compiler_bytecode_issue_test.root_module.addImport("Compiler", compiler_mod);
    compiler_bytecode_issue_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    compiler_bytecode_issue_test.root_module.addIncludePath(b.path("include"));
    compiler_bytecode_issue_test.step.dependOn(rust_step);
    compiler_bytecode_issue_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    compiler_bytecode_issue_test.linkLibC();
    if (target.result.os.tag == .linux) {
        compiler_bytecode_issue_test.linkSystemLibrary("unwind");
        compiler_bytecode_issue_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        compiler_bytecode_issue_test.linkFramework("CoreFoundation");
        compiler_bytecode_issue_test.linkFramework("Security");
    }
    const run_compiler_bytecode_issue_test = b.addRunArtifact(compiler_bytecode_issue_test);
    const compiler_bytecode_issue_test_step = b.step("test-compiler-bytecode-issue", "Run Compiler Bytecode Issue tests");
    compiler_bytecode_issue_test_step.dependOn(&run_compiler_bytecode_issue_test.step);
    
    // Add Compiler Hex Decode test (simpler test without EVM dependencies)
    const compiler_hex_decode_test = b.addTest(.{
        .name = "compiler-hex-decode-test",
        .root_source_file = b.path("test/evm/compiler_hex_decode_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    compiler_hex_decode_test.root_module.addImport("Compiler", compiler_mod);
    compiler_hex_decode_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    compiler_hex_decode_test.root_module.addIncludePath(b.path("include"));
    compiler_hex_decode_test.step.dependOn(rust_step);
    compiler_hex_decode_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    compiler_hex_decode_test.linkLibC();
    if (target.result.os.tag == .linux) {
        compiler_hex_decode_test.linkSystemLibrary("unwind");
        compiler_hex_decode_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        compiler_hex_decode_test.linkFramework("CoreFoundation");
        compiler_hex_decode_test.linkFramework("Security");
    }
    const run_compiler_hex_decode_test = b.addRunArtifact(compiler_hex_decode_test);
    const compiler_hex_decode_test_step = b.step("test-compiler-hex-decode", "Run Compiler Hex Decode tests");
    compiler_hex_decode_test_step.dependOn(&run_compiler_hex_decode_test.step);
    
    // Add Function Selector Debug test
    const function_selector_debug_test = b.addTest(.{
        .name = "function-selector-debug-test",
        .root_source_file = b.path("test/evm/function_selector_debug_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    function_selector_debug_test.root_module.addImport("Compiler", compiler_mod);
    function_selector_debug_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    function_selector_debug_test.root_module.addIncludePath(b.path("include"));
    function_selector_debug_test.step.dependOn(rust_step);
    function_selector_debug_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    function_selector_debug_test.linkLibC();
    if (target.result.os.tag == .linux) {
        function_selector_debug_test.linkSystemLibrary("unwind");
        function_selector_debug_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        function_selector_debug_test.linkFramework("CoreFoundation");
        function_selector_debug_test.linkFramework("Security");
    }
    const run_function_selector_debug_test = b.addRunArtifact(function_selector_debug_test);
    const function_selector_debug_test_step = b.step("test-function-selector-debug", "Run Function Selector Debug tests");
    function_selector_debug_test_step.dependOn(&run_function_selector_debug_test.step);
    
    // Add Contract Deployment test
    const contract_deployment_test = b.addTest(.{
        .name = "contract-deployment-test",
        .root_source_file = b.path("test/evm/contract_deployment_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    contract_deployment_test.root_module.addImport("evm", target_architecture_mod);
    contract_deployment_test.root_module.addImport("Compiler", compiler_mod);
    contract_deployment_test.root_module.addImport("Address", address_mod);
    contract_deployment_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    contract_deployment_test.root_module.addIncludePath(b.path("include"));
    contract_deployment_test.step.dependOn(rust_step);
    contract_deployment_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    contract_deployment_test.linkLibC();
    if (target.result.os.tag == .linux) {
        contract_deployment_test.linkSystemLibrary("unwind");
        contract_deployment_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        contract_deployment_test.linkFramework("CoreFoundation");
        contract_deployment_test.linkFramework("Security");
    }
    const run_contract_deployment_test = b.addRunArtifact(contract_deployment_test);
    const contract_deployment_test_step = b.step("test-contract-deployment", "Run Contract Deployment tests");
    contract_deployment_test_step.dependOn(&run_contract_deployment_test.step);
    
    // Add Contract Call Setup test
    const contract_call_setup_test = b.addTest(.{
        .name = "contract-call-setup-test",
        .root_source_file = b.path("test/evm/contract_call_setup_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    contract_call_setup_test.root_module.addImport("evm", target_architecture_mod);
    contract_call_setup_test.root_module.addImport("Compiler", compiler_mod);
    contract_call_setup_test.root_module.addImport("Address", address_mod);
    contract_call_setup_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    contract_call_setup_test.root_module.addIncludePath(b.path("include"));
    contract_call_setup_test.step.dependOn(rust_step);
    contract_call_setup_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    contract_call_setup_test.linkLibC();
    if (target.result.os.tag == .linux) {
        contract_call_setup_test.linkSystemLibrary("unwind");
        contract_call_setup_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        contract_call_setup_test.linkFramework("CoreFoundation");
        contract_call_setup_test.linkFramework("Security");
    }
    const run_contract_call_setup_test = b.addRunArtifact(contract_call_setup_test);
    const contract_call_setup_test_step = b.step("test-contract-call-setup", "Run Contract Call Setup tests");
    contract_call_setup_test_step.dependOn(&run_contract_call_setup_test.step);
    
    // Add TenThousandHashes Specific test
    const tenhashes_specific_test = b.addTest(.{
        .name = "tenhashes-specific-test",
        .root_source_file = b.path("test/evm/tenhashes_specific_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    tenhashes_specific_test.root_module.addImport("evm", target_architecture_mod);
    tenhashes_specific_test.root_module.addImport("Compiler", compiler_mod);
    tenhashes_specific_test.root_module.addImport("Address", address_mod);
    tenhashes_specific_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    tenhashes_specific_test.root_module.addIncludePath(b.path("include"));
    tenhashes_specific_test.step.dependOn(rust_step);
    tenhashes_specific_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    tenhashes_specific_test.linkLibC();
    if (target.result.os.tag == .linux) {
        tenhashes_specific_test.linkSystemLibrary("unwind");
        tenhashes_specific_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        tenhashes_specific_test.linkFramework("CoreFoundation");
        tenhashes_specific_test.linkFramework("Security");
    }
    const run_tenhashes_specific_test = b.addRunArtifact(tenhashes_specific_test);
    const tenhashes_specific_test_step = b.step("test-tenhashes-specific", "Run TenThousandHashes Specific tests");
    tenhashes_specific_test_step.dependOn(&run_tenhashes_specific_test.step);
    
    // Add Simple Compilation test (minimal dependencies)
    const simple_compilation_test = b.addTest(.{
        .name = "simple-compilation-test",
        .root_source_file = b.path("test/evm/simple_compilation_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    simple_compilation_test.root_module.addImport("Compiler", compiler_mod);
    simple_compilation_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    simple_compilation_test.root_module.addIncludePath(b.path("include"));
    simple_compilation_test.step.dependOn(rust_step);
    simple_compilation_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    simple_compilation_test.linkLibC();
    if (target.result.os.tag == .linux) {
        simple_compilation_test.linkSystemLibrary("unwind");
        simple_compilation_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        simple_compilation_test.linkFramework("CoreFoundation");
        simple_compilation_test.linkFramework("Security");
    }
    const run_simple_compilation_test = b.addRunArtifact(simple_compilation_test);
    const simple_compilation_test_step = b.step("test-simple-compilation", "Run Simple Compilation tests");
    simple_compilation_test_step.dependOn(&run_simple_compilation_test.step);
    
    // Add Minimal Execution test (no external dependencies)
    const minimal_execution_test = b.addTest(.{
        .name = "minimal-execution-test",
        .root_source_file = b.path("test/evm/minimal_execution_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    const run_minimal_execution_test = b.addRunArtifact(minimal_execution_test);
    const minimal_execution_test_step = b.step("test-minimal-execution", "Run Minimal Execution tests");
    minimal_execution_test_step.dependOn(&run_minimal_execution_test.step);
    
    // Add Contract Initialization test
    const contract_initialization_test = b.addTest(.{
        .name = "contract-initialization-test",
        .root_source_file = b.path("test/evm/contract_initialization_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    contract_initialization_test.root_module.addImport("evm", target_architecture_mod);
    contract_initialization_test.root_module.addImport("Compiler", compiler_mod);
    contract_initialization_test.root_module.addImport("Address", address_mod);
    contract_initialization_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    contract_initialization_test.root_module.addIncludePath(b.path("include"));
    contract_initialization_test.step.dependOn(rust_step);
    contract_initialization_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    contract_initialization_test.linkLibC();
    if (target.result.os.tag == .linux) {
        contract_initialization_test.linkSystemLibrary("unwind");
        contract_initialization_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        contract_initialization_test.linkFramework("CoreFoundation");
        contract_initialization_test.linkFramework("Security");
    }
    const run_contract_initialization_test = b.addRunArtifact(contract_initialization_test);
    const contract_initialization_test_step = b.step("test-contract-initialization", "Run Contract Initialization tests");
    contract_initialization_test_step.dependOn(&run_contract_initialization_test.step);
    
    // Add Gas Execution Pattern test (no external dependencies)
    const gas_execution_pattern_test = b.addTest(.{
        .name = "gas-execution-pattern-test",
        .root_source_file = b.path("test/evm/gas_execution_pattern_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    const run_gas_execution_pattern_test = b.addRunArtifact(gas_execution_pattern_test);
    const gas_execution_pattern_test_step = b.step("test-gas-execution-pattern", "Run Gas Execution Pattern tests");
    gas_execution_pattern_test_step.dependOn(&run_gas_execution_pattern_test.step);
    
    // Add Invalid Execution Point test
    const invalid_execution_point_test = b.addTest(.{
        .name = "invalid-execution-point-test",
        .root_source_file = b.path("test/evm/invalid_execution_point_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    invalid_execution_point_test.root_module.addImport("Compiler", compiler_mod);
    invalid_execution_point_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    invalid_execution_point_test.root_module.addIncludePath(b.path("include"));
    invalid_execution_point_test.step.dependOn(rust_step);
    invalid_execution_point_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    invalid_execution_point_test.linkLibC();
    if (target.result.os.tag == .linux) {
        invalid_execution_point_test.linkSystemLibrary("unwind");
        invalid_execution_point_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        invalid_execution_point_test.linkFramework("CoreFoundation");
        invalid_execution_point_test.linkFramework("Security");
    }
    const run_invalid_execution_point_test = b.addRunArtifact(invalid_execution_point_test);
    const invalid_execution_point_test_step = b.step("test-invalid-execution-point", "Run Invalid Execution Point tests");
    invalid_execution_point_test_step.dependOn(&run_invalid_execution_point_test.step);
    
    // Add Dispatch Failure Reproduction test
    const dispatch_failure_test = b.addTest(.{
        .name = "dispatch-failure-reproduction-test",
        .root_source_file = b.path("test/evm/dispatch_failure_reproduction_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    dispatch_failure_test.root_module.addImport("Compiler", compiler_mod);
    dispatch_failure_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    dispatch_failure_test.root_module.addIncludePath(b.path("include"));
    dispatch_failure_test.step.dependOn(rust_step);
    dispatch_failure_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    dispatch_failure_test.linkLibC();
    if (target.result.os.tag == .linux) {
        dispatch_failure_test.linkSystemLibrary("unwind");
        dispatch_failure_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        dispatch_failure_test.linkFramework("CoreFoundation");
        dispatch_failure_test.linkFramework("Security");
    }
    const run_dispatch_failure_test = b.addRunArtifact(dispatch_failure_test);
    const dispatch_failure_test_step = b.step("test-dispatch-failure", "Run Dispatch Failure Reproduction tests");
    dispatch_failure_test_step.dependOn(&run_dispatch_failure_test.step);
    
    // Add Jump Dispatch Failure test (simple, no dependencies)
    const jump_dispatch_failure_test = b.addTest(.{
        .name = "jump-dispatch-failure-test",
        .root_source_file = b.path("test/evm/jump_dispatch_failure_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    const run_jump_dispatch_failure_test = b.addRunArtifact(jump_dispatch_failure_test);
    const jump_dispatch_failure_test_step = b.step("test-jump-dispatch-failure", "Run Jump Dispatch Failure tests");
    jump_dispatch_failure_test_step.dependOn(&run_jump_dispatch_failure_test.step);
    
    // Add LT Opcode Stack Underflow test (TDD approach)
    const lt_stack_underflow_test = b.addTest(.{
        .name = "lt-opcode-stack-underflow-test",
        .root_source_file = b.path("test/evm/lt_opcode_stack_underflow_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    const run_lt_stack_underflow_test = b.addRunArtifact(lt_stack_underflow_test);
    const lt_stack_underflow_test_step = b.step("test-lt-stack-underflow", "Run LT Opcode Stack Underflow TDD tests");
    lt_stack_underflow_test_step.dependOn(&run_lt_stack_underflow_test.step);
    
    // Add LT Opcode Bug test (actual implementation test)
    const lt_opcode_bug_test = b.addTest(.{
        .name = "lt-opcode-bug-test",
        .root_source_file = b.path("test/evm/lt_opcode_bug_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    lt_opcode_bug_test.root_module.addImport("evm", evm_mod);
    const run_lt_opcode_bug_test = b.addRunArtifact(lt_opcode_bug_test);
    const lt_opcode_bug_test_step = b.step("test-lt-opcode-bug", "Run LT Opcode Bug TDD tests");
    lt_opcode_bug_test_step.dependOn(&run_lt_opcode_bug_test.step);
    
    // Add simple LT opcode test (documentation only)
    const lt_opcode_simple_test = b.addTest(.{
        .name = "lt-opcode-simple-test",
        .root_source_file = b.path("test/evm/lt_opcode_simple_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    const run_lt_opcode_simple_test = b.addRunArtifact(lt_opcode_simple_test);
    const lt_opcode_simple_test_step = b.step("test-lt-opcode-simple", "Run simple LT Opcode documentation test");
    lt_opcode_simple_test_step.dependOn(&run_lt_opcode_simple_test.step);
    
    // Add MSTORE debug test
    const mstore_debug_test = b.addTest(.{
        .name = "mstore-debug-test",
        .root_source_file = b.path("debug_mstore_params.zig"),
        .target = target,
        .optimize = optimize,
    });
    mstore_debug_test.root_module.addImport("Address", address_mod);
    mstore_debug_test.root_module.addImport("Block", block_mod);
    mstore_debug_test.root_module.addImport("evm", evm_mod);
    mstore_debug_test.root_module.addImport("utils", utils_mod);
    mstore_debug_test.root_module.addImport("test_helpers", test_helpers_mod);
    const run_mstore_debug_test = b.addRunArtifact(mstore_debug_test);
    const mstore_debug_test_step = b.step("test-mstore-debug", "Debug MSTORE parameter order");
    mstore_debug_test_step.dependOn(&run_mstore_debug_test.step);

    // Add EVM Contract benchmark (after rust_step is defined)
    const evm_contract_benchmark = b.addExecutable(.{
        .name = "evm-contract-benchmark",
        .root_source_file = b.path("bench/evm.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    evm_contract_benchmark.root_module.addImport("zbench", zbench_dep.module("zbench"));
    evm_contract_benchmark.root_module.addImport("evm", target_architecture_mod);
    evm_contract_benchmark.root_module.addImport("Address", address_mod);
    evm_contract_benchmark.root_module.addImport("Compiler", compiler_mod);
    evm_contract_benchmark.root_module.addImport("zabi", zabi_dep.module("zabi"));
    evm_contract_benchmark.root_module.addIncludePath(b.path("include"));
    
    // Add Rust dependencies to EVM contract benchmark (same as compiler test)
    evm_contract_benchmark.step.dependOn(rust_step);
    evm_contract_benchmark.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    evm_contract_benchmark.linkLibC();
    
    // Link system libraries for EVM contract benchmark
    if (target.result.os.tag == .linux) {
        evm_contract_benchmark.linkSystemLibrary("unwind");
        evm_contract_benchmark.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        evm_contract_benchmark.linkFramework("CoreFoundation");
        evm_contract_benchmark.linkFramework("Security");
    }

    const run_evm_contract_benchmark = b.addRunArtifact(evm_contract_benchmark);

    const evm_contract_benchmark_step = b.step("bench-evm-contracts", "Run EVM Contract benchmarks");
    evm_contract_benchmark_step.dependOn(&run_evm_contract_benchmark.step);
    
    // Add EVM contract benchmark to the combined benchmark step
    all_benchmark_step.dependOn(&run_evm_contract_benchmark.step);

    // Add EVM Opcode benchmark
    const evm_opcode_benchmark = b.addExecutable(.{
        .name = "evm-opcode-benchmark",
        .root_source_file = b.path("bench/opcode_bench.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    evm_opcode_benchmark.root_module.addImport("zbench", zbench_dep.module("zbench"));
    evm_opcode_benchmark.root_module.addImport("evm", target_architecture_mod);
    evm_opcode_benchmark.root_module.addImport("Address", address_mod);

    const run_evm_opcode_benchmark = b.addRunArtifact(evm_opcode_benchmark);

    const evm_opcode_benchmark_step = b.step("bench-evm-opcodes", "Run EVM Opcode benchmarks");
    evm_opcode_benchmark_step.dependOn(&run_evm_opcode_benchmark.step);
    
    // Add EVM opcode benchmark to the combined benchmark step
    all_benchmark_step.dependOn(&run_evm_opcode_benchmark.step);

    // Add Simple Math benchmark
    const simple_math_benchmark = b.addExecutable(.{
        .name = "simple-math-benchmark",
        .root_source_file = b.path("bench/simple_math_bench.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    simple_math_benchmark.root_module.addImport("zbench", zbench_dep.module("zbench"));

    const run_simple_math_benchmark = b.addRunArtifact(simple_math_benchmark);

    const simple_math_benchmark_step = b.step("bench-simple-math", "Run Simple Math benchmarks");
    simple_math_benchmark_step.dependOn(&run_simple_math_benchmark.step);
    
    // Add simple math benchmark to the combined benchmark step
    all_benchmark_step.dependOn(&run_simple_math_benchmark.step);

    // Add Stack benchmark
    const stack_benchmark = b.addExecutable(.{
        .name = "stack-benchmark",
        .root_source_file = b.path("bench/stack_bench.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    stack_benchmark.root_module.addImport("zbench", zbench_dep.module("zbench"));
    stack_benchmark.root_module.addImport("evm", target_architecture_mod);

    const run_stack_benchmark = b.addRunArtifact(stack_benchmark);

    const stack_benchmark_step = b.step("bench-stack", "Run Stack benchmarks");
    stack_benchmark_step.dependOn(&run_stack_benchmark.step);
    
    // Add stack benchmark to the combined benchmark step
    all_benchmark_step.dependOn(&run_stack_benchmark.step);

    // Add Simple Stack benchmark
    const simple_stack_benchmark = b.addExecutable(.{
        .name = "simple-stack-benchmark",
        .root_source_file = b.path("bench/simple_stack_bench.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    simple_stack_benchmark.root_module.addImport("zbench", zbench_dep.module("zbench"));

    const run_simple_stack_benchmark = b.addRunArtifact(simple_stack_benchmark);

    const simple_stack_benchmark_step = b.step("bench-simple-stack", "Run Simple Stack benchmarks");
    simple_stack_benchmark_step.dependOn(&run_simple_stack_benchmark.step);
    
    // Add simple stack benchmark to the combined benchmark step
    all_benchmark_step.dependOn(&run_simple_stack_benchmark.step);

    // Add Gas Accounting benchmark
    const gas_benchmark = b.addExecutable(.{
        .name = "gas-benchmark",
        .root_source_file = b.path("bench/gas_bench.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    gas_benchmark.root_module.addImport("zbench", zbench_dep.module("zbench"));

    const run_gas_benchmark = b.addRunArtifact(gas_benchmark);

    const gas_benchmark_step = b.step("bench-gas", "Run Gas Accounting benchmarks");
    gas_benchmark_step.dependOn(&run_gas_benchmark.step);
    
    // Add gas benchmark to the combined benchmark step
    all_benchmark_step.dependOn(&run_gas_benchmark.step);

    // Add Jump Table benchmark
    const jumptable_benchmark = b.addExecutable(.{
        .name = "jumptable-benchmark",
        .root_source_file = b.path("bench/jumptable_bench.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    jumptable_benchmark.root_module.addImport("zbench", zbench_dep.module("zbench"));

    const run_jumptable_benchmark = b.addRunArtifact(jumptable_benchmark);

    const jumptable_benchmark_step = b.step("bench-jumptable", "Run Jump Table benchmarks");
    jumptable_benchmark_step.dependOn(&run_jumptable_benchmark.step);
    
    // Add jumptable benchmark to the combined benchmark step
    all_benchmark_step.dependOn(&run_jumptable_benchmark.step);

    // Add Precompile benchmark
    const precompile_benchmark = b.addExecutable(.{
        .name = "precompile-benchmark",
        .root_source_file = b.path("bench/precompile_bench.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    precompile_benchmark.root_module.addImport("zbench", zbench_dep.module("zbench"));

    const run_precompile_benchmark = b.addRunArtifact(precompile_benchmark);

    const precompile_benchmark_step = b.step("bench-precompiles", "Run Precompile benchmarks");
    precompile_benchmark_step.dependOn(&run_precompile_benchmark.step);
    
    // Add precompile benchmark to the combined benchmark step
    all_benchmark_step.dependOn(&run_precompile_benchmark.step);

    // Add Call Operations benchmark
    const call_ops_benchmark = b.addExecutable(.{
        .name = "call-ops-benchmark",
        .root_source_file = b.path("bench/call_ops_bench.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    call_ops_benchmark.root_module.addImport("zbench", zbench_dep.module("zbench"));

    const run_call_ops_benchmark = b.addRunArtifact(call_ops_benchmark);

    const call_ops_benchmark_step = b.step("bench-call-ops", "Run Call Operations benchmarks");
    call_ops_benchmark_step.dependOn(&run_call_ops_benchmark.step);
    
    // Add call ops benchmark to the combined benchmark step
    all_benchmark_step.dependOn(&run_call_ops_benchmark.step);
    
    // Add Gas Debugging tool
    const debug_gas_tool = b.addExecutable(.{
        .name = "debug-gas-issue",
        .root_source_file = b.path("debug_gas_issue.zig"),
        .target = target,
        .optimize = optimize,
    });
    debug_gas_tool.root_module.addImport("evm", target_architecture_mod);
    debug_gas_tool.root_module.addImport("Address", address_mod);
    debug_gas_tool.root_module.addImport("Compiler", compiler_mod);
    debug_gas_tool.root_module.addImport("zabi", zabi_dep.module("zabi"));
    debug_gas_tool.root_module.addIncludePath(b.path("include"));
    debug_gas_tool.step.dependOn(rust_step);
    debug_gas_tool.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    debug_gas_tool.linkLibC();
    if (target.result.os.tag == .linux) {
        debug_gas_tool.linkSystemLibrary("unwind");
        debug_gas_tool.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        debug_gas_tool.linkFramework("CoreFoundation");
        debug_gas_tool.linkFramework("Security");
    }
    const run_debug_gas_tool = b.addRunArtifact(debug_gas_tool);
    const debug_gas_tool_step = b.step("debug-gas", "Debug EVM gas accounting issues");
    debug_gas_tool_step.dependOn(&run_debug_gas_tool.step);
    
    // Add Bytecode Analysis tool
    const debug_bytecode_detailed = b.addExecutable(.{
        .name = "debug-bytecode-detailed",
        .root_source_file = b.path("debug_bytecode_detailed.zig"),
        .target = target,
        .optimize = optimize,
    });
    debug_bytecode_detailed.root_module.addImport("evm", target_architecture_mod);
    debug_bytecode_detailed.root_module.addImport("Address", address_mod);
    debug_bytecode_detailed.root_module.addImport("Compiler", compiler_mod);
    debug_bytecode_detailed.root_module.addImport("zabi", zabi_dep.module("zabi"));
    debug_bytecode_detailed.root_module.addIncludePath(b.path("include"));
    debug_bytecode_detailed.step.dependOn(rust_step);
    debug_bytecode_detailed.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    debug_bytecode_detailed.linkLibC();
    if (target.result.os.tag == .linux) {
        debug_bytecode_detailed.linkSystemLibrary("unwind");
        debug_bytecode_detailed.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        debug_bytecode_detailed.linkFramework("CoreFoundation");
        debug_bytecode_detailed.linkFramework("Security");
    }
    const run_debug_bytecode_detailed = b.addRunArtifact(debug_bytecode_detailed);
    const debug_bytecode_detailed_step = b.step("debug-bytecode-detailed", "Analyze EVM bytecode in detail");
    debug_bytecode_detailed_step.dependOn(&run_debug_bytecode_detailed.step);

    // Add Contract Execution Debug test
    const contract_execution_debug_test = b.addTest(.{
        .name = "contract-execution-debug-test",
        .root_source_file = b.path("test/evm/contract_execution_debug_test.zig"),
        .target = target,
        .optimize = optimize,
    });
    contract_execution_debug_test.root_module.addImport("evm", target_architecture_mod);
    contract_execution_debug_test.root_module.addImport("Compiler", compiler_mod);
    contract_execution_debug_test.root_module.addImport("Address", address_mod);
    contract_execution_debug_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    contract_execution_debug_test.root_module.addIncludePath(b.path("include"));
    contract_execution_debug_test.step.dependOn(rust_step);
    contract_execution_debug_test.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    contract_execution_debug_test.linkLibC();
    if (target.result.os.tag == .linux) {
        contract_execution_debug_test.linkSystemLibrary("unwind");
        contract_execution_debug_test.linkSystemLibrary("gcc_s");
    } else if (target.result.os.tag == .macos) {
        contract_execution_debug_test.linkFramework("CoreFoundation");
        contract_execution_debug_test.linkFramework("Security");
    }
    const run_contract_execution_debug_test = b.addRunArtifact(contract_execution_debug_test);
    const contract_execution_debug_test_step = b.step("test-contract-execution-debug", "Run Contract Execution Debug tests");
    contract_execution_debug_test_step.dependOn(&run_contract_execution_debug_test.step);

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
    test_step.dependOn(&run_stack_test.step);
    test_step.dependOn(&run_stack_validation_test.step);
    test_step.dependOn(&run_opcodes_test.step);
    test_step.dependOn(&run_vm_opcode_test.step);
    test_step.dependOn(&run_integration_test.step);
    test_step.dependOn(&run_gas_test.step);
    test_step.dependOn(&run_static_protection_test.step);
    test_step.dependOn(&run_create_contract_test.step);
    test_step.dependOn(&run_compiler_bytecode_issue_test.step);
    test_step.dependOn(&run_precompile_test.step);

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
