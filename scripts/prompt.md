<prompt>
    We want to use wasm but we are having a hard time figuring out what language feature or standard library method or mistake we made is causing our build to not build. Do you see the issue?
<context>
        <error>
➜  wasm-interface git:(wasm-interface) ✗ zig build
Building Rust Foundry wrapper...
Looking for cbindgen...
cbindgen command configured
warning: profiles for the non root package will be ignored, specify profiles at the workspace root:
package:   /Users/williamcory/tevm/main/g/wasm-interface/src/Compilers/Cargo.toml
workspace: /Users/williamcory/tevm/main/g/wasm-interface/Cargo.toml
    Finished `release` profile [optimized] target(s) in 0.15s
install
└─ install zigevm
   └─ zig build-exe zigevm ReleaseSmall wasm32-freestanding 3 errors
/opt/homebrew/Cellar/zig/0.14.0_2/lib/zig/std/Thread.zig:558:9: error: Unsupported operating system freestanding
        @compileError("Unsupported operating system " ++ @tagName(native_os));
        ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/opt/homebrew/Cellar/zig/0.14.0_2/lib/zig/std/posix.zig:110:33: error: struct 'posix.system__struct_14149' has no member named 'STDERR_FILENO'
pub const STDERR_FILENO = system.STDERR_FILENO;
                          ~~~~~~^~~~~~~~~~~~~~
/opt/homebrew/Cellar/zig/0.14.0_2/lib/zig/std/posix.zig:49:13: note: struct declared here
    else => struct {
            ^~~~~~
/opt/homebrew/Cellar/zig/0.14.0_2/lib/zig/std/posix.zig:1262:26: error: struct 'posix.system__struct_14149' has no member named 'write'
        const rc = system.write(fd, bytes.ptr, @min(bytes.len, max_count));
                   ~~~~~~^~~~~~
/opt/homebrew/Cellar/zig/0.14.0_2/lib/zig/std/posix.zig:49:13: note: struct declared here
    else => struct {
            ^~~~~~
error: the following command failed with 3 compilation errors:
/opt/homebrew/Cellar/zig/0.14.0_2/bin/zig build-exe -fno-entry -fsingle-threaded -fno-stack-check -OReleaseSmall -target wasm32-freestanding -mcpu baseline --dep evm --dep Address -Mroot=/Users/williamcory/tevm/main/g/wasm-interface/src/root_wasm.zig -fsingle-threaded -fno-stack-check -ODebug --dep Address --dep Block --dep Rlp -Mevm=/Users/williamcory/tevm/main/g/wasm-interface/src/evm/evm.zig -fsingle-threaded -fno-stack-check -ODebug --dep Rlp -MAddress=/Users/williamcory/tevm/main/g/wasm-interface/src/Address/address.zig -fsingle-threaded -fno-stack-check -ODebug --dep Address -MBlock=/Users/williamcory/tevm/main/g/wasm-interface/src/Block/block.zig -fsingle-threaded -fno-stack-check -ODebug --dep Utils -MRlp=/Users/williamcory/tevm/main/g/wasm-interface/src/Rlp/rlp.zig -fsingle-threaded -fno-stack-check -ODebug -MUtils=/Users/williamcory/tevm/main/g/wasm-interface/src/Utils/utils.zig --cache-dir /Users/williamcory/tevm/main/g/wasm-interface/.zig-cache --global-cache-dir /Users/williamcory/.cache/zig --name zigevm -rdynamic --zig-lib-dir /opt/homebrew/Cellar/zig/0.14.0_2/lib/zig/ --listen=-
info: UI build completed successfully
Build Summary: 22/25 steps succeeded; 1 failed
install transitive failure
└─ install zigevm transitive failure
   └─ zig build-exe zigevm ReleaseSmall wasm32-freestanding 3 errors
error: the following build command failed with exit code 1:
/Users/williamcory/tevm/main/g/wasm-interface/.zig-cache/o/217d616fe739b0fd6878574aaf06d306/build /opt/homebrew/Cellar/zig/0.14.0_2/bin/zig /opt/homebrew/Cellar/zig/0.14.0_2/lib/zig /Users/williamcory/tevm/main/g/wasm-interface /Users/williamcory/tevm/main/g/wasm-interface/.zig-cache /Users/williamcory/.cache/zig --seed 0x4dd827a8 -Zba68b4cecb44212b
</error>
<code language="zig" description="build.zig">
const std = @import("std");

// Although this function looks imperative, note that its job is to
// declaratively construct a build graph that will be executed by an external
// runner.
pub fn build(b: \*std.Build) void {
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

    // Add imports to the address_mod
    address_mod.addImport("Rlp", rlp_mod);

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
    target_architecture_mod.addImport("Utils", utils_mod);

    // Create the native executable module
    const exe_mod = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    exe_mod.stack_check = false;
    exe_mod.single_threaded = true;

    // Create WASM module using the full EVM implementation
    const wasm_mod = b.createModule(.{
        .root_source_file = b.path("src/root_wasm.zig"),
        .target = wasm_target,
        .optimize = .ReleaseSmall,
    });
    wasm_mod.stack_check = false;
    wasm_mod.single_threaded = true;

    // Add EVM dependencies now that threading issues are resolved
    wasm_mod.addImport("evm", evm_mod);
    wasm_mod.addImport("Address", address_mod);

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
    compiler_test.root_module.addImport("zabi", zabi_dep.module("zabi"));
    compiler_test.root_module.addIncludePath(b.path("include"));

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
    interpreter_test.root_module.addImport("Utils", utils_mod);

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
    opcodes_test.root_module.addImport("Utils", utils_mod);

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
    integration_test.root_module.addImport("Utils", utils_mod);
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
    gas_test.root_module.addImport("Utils", utils_mod);
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
    static_protection_test.root_module.addImport("Utils", utils_mod);

    const run_static_protection_test = b.addRunArtifact(static_protection_test);

    // Add a separate step for testing Static Call Protection
    const static_protection_test_step = b.step("test-static-protection", "Run Static Call Protection tests");
    static_protection_test_step.dependOn(&run_static_protection_test.step);

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
    const rust_build = @import("src/Compilers/rust_build.zig");
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
    test_step.dependOn(&run_stack_test.step);
    test_step.dependOn(&run_stack_validation_test.step);
    test_step.dependOn(&run_opcodes_test.step);
    test_step.dependOn(&run_vm_opcode_test.step);
    test_step.dependOn(&run_integration_test.step);
    test_step.dependOn(&run_gas_test.step);
    test_step.dependOn(&run_static_protection_test.step);

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
builder: \*std.Build,

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
builder: \*std.Build,
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
</code>
<code language="zig" description="our source code">

```zig [src/evm/run_result.zig]
const ExecutionError = @import("execution/execution_error.zig");

/// Result of an EVM execution run.
///
/// RunResult encapsulates the outcome of executing EVM bytecode, including
/// success/failure status, gas consumption, and any output data. This is
/// the primary return type for VM execution functions.
///
/// ## Design Rationale
/// The result combines multiple pieces of information needed after execution:
/// - Status indicates how execution ended (success, revert, error)
/// - Gas tracking for accounting and refunds
/// - Output data for return values or revert messages
/// - Optional error details for debugging
///
/// ## Status Types
/// - Success: Execution completed normally
/// - Revert: Explicit revert (REVERT opcode or require failure)
/// - Invalid: Invalid operation (bad opcode, stack error, etc.)
/// - OutOfGas: Execution ran out of gas
///
/// ## Usage
/// `zig
/// const result = vm.run(bytecode, gas_limit);
/// switch (result.status) {
///     .Success => {
///         // Process output data
///         const return_data = result.output orelse &[_]u8{};
///     },
///     .Revert => {
///         // Handle revert with reason
///         const revert_reason = result.output orelse &[_]u8{};
///     },
///     .Invalid => {
///         // Handle error
///         std.log.err("Execution failed: {?}", .{result.err});
///     },
///     .OutOfGas => {
///         // Handle out of gas
///     },
/// }
/// `
pub const RunResult = @This();

/// Execution completion status.
///
/// Indicates how the execution ended. This maps to EVM execution outcomes:
/// - Success: Normal completion (STOP, RETURN, or end of code)
/// - Revert: Explicit revert (REVERT opcode)
/// - Invalid: Execution error (invalid opcode, stack error, etc.)
/// - OutOfGas: Gas exhausted during execution
pub const Status = enum {
/// Execution completed successfully
Success,
/// Execution was explicitly reverted
Revert,
/// Execution failed due to invalid operation
Invalid,
/// Execution ran out of gas
OutOfGas,
};
status: Status,

/// Optional execution error details.
///
/// Present when status is Invalid, providing specific error information
/// for debugging and error reporting.
err: ?ExecutionError.Error,

/// Remaining gas after execution.
///
/// For successful execution, this is refunded to the caller.
/// For failed execution, this may be zero or partially consumed.
gas_left: u64,

/// Total gas consumed during execution.
///
/// Calculated as: initial_gas - gas_left
/// Used for:
/// - Transaction receipts
/// - Gas accounting
/// - Performance monitoring
gas_used: u64,

/// Output data from execution.
///
/// Contents depend on execution status:
/// - Success: Return data from RETURN opcode
/// - Revert: Revert reason from REVERT opcode
/// - Invalid/OutOfGas: Usually null
///
/// Note: Empty output is different from null output.
/// Empty means explicit empty return, null means no return.
output: ?[]const u8,

pub fn init(
initial_gas: u64,
gas_left: u64,
status: Status,
err: ?ExecutionError.Error,
output: ?[]const u8,
) RunResult {
return RunResult{
.status = status,
.err = err,
.gas_left = gas_left,
.gas_used = initial_gas - gas_left,
.output = output,
};
}

```

````zig [src/evm/create_result.zig]
const Address = @import("Address");

/// Result structure for contract creation operations in the EVM.
///
/// This structure encapsulates the outcome of deploying a new smart contract
/// through CREATE or CREATE2 opcodes. It provides all necessary information
/// about the deployment result, including the new contract's address and any
/// revert data if the deployment failed.
///
/// ## Contract Creation Flow
/// 1. Execute initcode (constructor bytecode)
/// 2. Initcode returns runtime bytecode
/// 3. Runtime bytecode is stored at computed address
/// 4. This result structure is returned
///
/// ## Address Computation
/// - **CREATE**: address = keccak256(rlp([sender, nonce]))[12:]
/// - **CREATE2**: address = keccak256(0xff ++ sender ++ salt ++ keccak256(initcode))[12:]
///
/// ## Success Conditions
/// A creation succeeds when:
/// - Initcode executes without reverting
/// - Sufficient gas remains for code storage
/// - Returned bytecode size ≤ 24,576 bytes (EIP-170)
/// - No address collision occurs
///
/// ## Failure Modes
/// - Initcode reverts (REVERT opcode or error)
/// - Out of gas during execution
/// - Returned bytecode exceeds size limit
/// - Address collision (extremely rare)
/// - Stack depth exceeded
///
/// ## Example Usage
/// ```zig
/// const result = try vm.create_contract(value, initcode, gas, salt);
/// if (result.success) {
///     // Contract deployed at result.address
///     log.info("Deployed to: {}", .{result.address});
/// } else {
///     // Deployment failed, check output for revert reason
///     if (result.output) |revert_data| {
///         log.err("Deployment failed: {}", .{revert_data});
///     }
/// }
/// defer if (result.output) |output| allocator.free(output);
/// ```
pub const CreateResult = @This();

/// Indicates whether the contract creation succeeded.
///
/// - `true`: Contract successfully deployed and code stored on-chain
/// - `false`: Creation failed due to revert, gas, or other errors
///
/// ## State Changes
/// - Success: All state changes are committed, contract exists at address
/// - Failure: All state changes are reverted, no contract is deployed
success: bool,

/// The address where the contract was (or would have been) deployed.
///
/// This address is computed deterministically before execution begins:
/// - For CREATE: Based on sender address and nonce
/// - For CREATE2: Based on sender, salt, and initcode hash
///
/// ## Important Notes
/// - Address is computed even if creation fails
/// - Can be used to predict addresses before deployment
/// - Useful for counterfactual instantiation patterns
///
/// ## Address Collision
/// If this address already contains a contract, creation fails.
/// The probability of collision is negligible (2^-160).
address: Address.Address,

/// Amount of gas remaining after the creation attempt.
///
/// ## Gas Accounting
/// - Deducted: Initcode execution + code storage (200 per byte)
/// - Refunded: Unused gas returns to caller
/// - Minimum: 32,000 gas for CREATE/CREATE2 base cost
///
/// ## Usage Patterns
/// - Success: Add back to calling context's available gas
/// - Failure with revert: Some gas may remain (unlike out-of-gas)
/// - Failure out-of-gas: Will be 0 or very low
gas_left: u64,

/// Optional data returned by the contract creation.
///
/// ## Success Case
/// - Contains the runtime bytecode to be stored on-chain
/// - Size must be ≤ 24,576 bytes (MAX_CODE_SIZE)
/// - Empty output creates a contract with no code
///
/// ## Failure Case
/// - Contains revert reason if REVERT was used
/// - `null` for out-of-gas or invalid operations
/// - Useful for debugging deployment failures
///
/// ## Memory Management
/// The output buffer is allocated by the VM and ownership transfers
/// to the caller, who must free it when no longer needed.
///
/// ## Examples
/// ```zig
/// // Success: output contains runtime bytecode
/// if (result.success and result.output) |bytecode| {
///     assert(bytecode.len <= MAX_CODE_SIZE);
/// }
///
/// // Failure: output may contain revert message
/// if (!result.success and result.output) |reason| {
///     // Decode revert reason (often ABI-encoded string)
/// }
/// ```
output: ?[]const u8,

pub fn initFailure(gas_left: u64, output: ?[]const u8) CreateResult {
    return CreateResult{
        .success = false,
        .address = Address.zero(),
        .gas_left = gas_left,
        .output = output,
    };
}
````

```zig [src/evm/jump_table/operation_config.zig]
const std = @import("std");
const execution = @import("../execution/package.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const Stack = @import("../stack/stack.zig");
const operation_module = @import("../opcodes/operation.zig");
const Operation = operation_module.Operation;
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;

/// Specification for an EVM operation.
/// This data structure allows us to define all operations in a single place
/// and generate the Operation structs at compile time.
pub const OpSpec = struct {
    /// Operation name (e.g., "ADD", "MUL")
    name: []const u8,
    /// Opcode byte value (0x00-0xFF)
    opcode: u8,
    /// Execution function
    execute: operation_module.ExecutionFunc,
    /// Base gas cost
    gas: u64,
    /// Minimum stack items required
    min_stack: u32,
    /// Maximum stack size allowed (usually Stack.CAPACITY or Stack.CAPACITY - 1)
    max_stack: u32,
    /// Optional: for hardfork variants, specify which variant this is
    variant: ?Hardfork = null,
};

/// Complete specification of all EVM operations.
/// This replaces the scattered Operation definitions across multiple files.
/// Operations are ordered by opcode for clarity and maintainability.
pub const ALL_OPERATIONS = [_]OpSpec{
    // 0x00s: Stop and Arithmetic Operations
    .{ .name = "STOP", .opcode = 0x00, .execute = execution.control.op_stop, .gas = 0, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "ADD", .opcode = 0x01, .execute = execution.arithmetic.op_add, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MUL", .opcode = 0x02, .execute = execution.arithmetic.op_mul, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SUB", .opcode = 0x03, .execute = execution.arithmetic.op_sub, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "DIV", .opcode = 0x04, .execute = execution.arithmetic.op_div, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SDIV", .opcode = 0x05, .execute = execution.arithmetic.op_sdiv, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MOD", .opcode = 0x06, .execute = execution.arithmetic.op_mod, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SMOD", .opcode = 0x07, .execute = execution.arithmetic.op_smod, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "ADDMOD", .opcode = 0x08, .execute = execution.arithmetic.op_addmod, .gas = gas_constants.GasMidStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "MULMOD", .opcode = 0x09, .execute = execution.arithmetic.op_mulmod, .gas = gas_constants.GasMidStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "EXP", .opcode = 0x0a, .execute = execution.arithmetic.op_exp, .gas = 10, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SIGNEXTEND", .opcode = 0x0b, .execute = execution.arithmetic.op_signextend, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },

    // 0x10s: Comparison & Bitwise Logic Operations
    .{ .name = "LT", .opcode = 0x10, .execute = execution.comparison.op_lt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "GT", .opcode = 0x11, .execute = execution.comparison.op_gt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SLT", .opcode = 0x12, .execute = execution.comparison.op_slt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SGT", .opcode = 0x13, .execute = execution.comparison.op_sgt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "EQ", .opcode = 0x14, .execute = execution.comparison.op_eq, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "ISZERO", .opcode = 0x15, .execute = execution.comparison.op_iszero, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "AND", .opcode = 0x16, .execute = execution.bitwise.op_and, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "OR", .opcode = 0x17, .execute = execution.bitwise.op_or, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "XOR", .opcode = 0x18, .execute = execution.bitwise.op_xor, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "NOT", .opcode = 0x19, .execute = execution.bitwise.op_not, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "BYTE", .opcode = 0x1a, .execute = execution.bitwise.op_byte, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SHL", .opcode = 0x1b, .execute = execution.bitwise.op_shl, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = .CONSTANTINOPLE },
    .{ .name = "SHR", .opcode = 0x1c, .execute = execution.bitwise.op_shr, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = .CONSTANTINOPLE },
    .{ .name = "SAR", .opcode = 0x1d, .execute = execution.bitwise.op_sar, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = .CONSTANTINOPLE },

    // 0x20s: Crypto
    .{ .name = "SHA3", .opcode = 0x20, .execute = execution.crypto.op_sha3, .gas = gas_constants.Keccak256Gas, .min_stack = 2, .max_stack = Stack.CAPACITY },

    // 0x30s: Environmental Information
    .{ .name = "ADDRESS", .opcode = 0x30, .execute = execution.environment.op_address, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "BALANCE_FRONTIER", .opcode = 0x31, .execute = execution.environment.op_balance, .gas = 20, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .FRONTIER },
    .{ .name = "BALANCE_TANGERINE", .opcode = 0x31, .execute = execution.environment.op_balance, .gas = 400, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .TANGERINE_WHISTLE },
    .{ .name = "BALANCE_ISTANBUL", .opcode = 0x31, .execute = execution.environment.op_balance, .gas = 700, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .ISTANBUL },
    .{ .name = "BALANCE_BERLIN", .opcode = 0x31, .execute = execution.environment.op_balance, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .BERLIN },
    .{ .name = "ORIGIN", .opcode = 0x32, .execute = execution.environment.op_origin, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLER", .opcode = 0x33, .execute = execution.environment.op_caller, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLVALUE", .opcode = 0x34, .execute = execution.environment.op_callvalue, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLDATALOAD", .opcode = 0x35, .execute = execution.environment.op_calldataload, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "CALLDATASIZE", .opcode = 0x36, .execute = execution.environment.op_calldatasize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLDATACOPY", .opcode = 0x37, .execute = execution.memory.op_calldatacopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "CODESIZE", .opcode = 0x38, .execute = execution.environment.op_codesize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CODECOPY", .opcode = 0x39, .execute = execution.environment.op_codecopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "GASPRICE", .opcode = 0x3a, .execute = execution.environment.op_gasprice, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "EXTCODESIZE_FRONTIER", .opcode = 0x3b, .execute = execution.environment.op_extcodesize, .gas = 20, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .FRONTIER },
    .{ .name = "EXTCODESIZE_TANGERINE", .opcode = 0x3b, .execute = execution.environment.op_extcodesize, .gas = 700, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .TANGERINE_WHISTLE },
    .{ .name = "EXTCODESIZE_ISTANBUL", .opcode = 0x3b, .execute = execution.environment.op_extcodesize, .gas = 700, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .ISTANBUL },
    .{ .name = "EXTCODESIZE", .opcode = 0x3b, .execute = execution.environment.op_extcodesize, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .BERLIN },
    .{ .name = "EXTCODECOPY_FRONTIER", .opcode = 0x3c, .execute = execution.environment.op_extcodecopy, .gas = 20, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = .FRONTIER },
    .{ .name = "EXTCODECOPY_TANGERINE", .opcode = 0x3c, .execute = execution.environment.op_extcodecopy, .gas = 700, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = .TANGERINE_WHISTLE },
    .{ .name = "EXTCODECOPY_ISTANBUL", .opcode = 0x3c, .execute = execution.environment.op_extcodecopy, .gas = 700, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = .ISTANBUL },
    .{ .name = "EXTCODECOPY", .opcode = 0x3c, .execute = execution.environment.op_extcodecopy, .gas = 0, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = .BERLIN },
    .{ .name = "RETURNDATASIZE", .opcode = 0x3d, .execute = execution.memory.op_returndatasize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .BYZANTIUM },
    .{ .name = "RETURNDATACOPY", .opcode = 0x3e, .execute = execution.memory.op_returndatacopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY, .variant = .BYZANTIUM },
    .{ .name = "EXTCODEHASH", .opcode = 0x3f, .execute = execution.environment.op_extcodehash, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .CONSTANTINOPLE },

    // 0x40s: Block Information
    .{ .name = "BLOCKHASH", .opcode = 0x40, .execute = execution.block.op_blockhash, .gas = 20, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "COINBASE", .opcode = 0x41, .execute = execution.block.op_coinbase, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "TIMESTAMP", .opcode = 0x42, .execute = execution.block.op_timestamp, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "NUMBER", .opcode = 0x43, .execute = execution.block.op_number, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "DIFFICULTY", .opcode = 0x44, .execute = execution.block.op_difficulty, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "GASLIMIT", .opcode = 0x45, .execute = execution.block.op_gaslimit, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CHAINID", .opcode = 0x46, .execute = execution.environment.op_chainid, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .ISTANBUL },
    .{ .name = "SELFBALANCE", .opcode = 0x47, .execute = execution.environment.op_selfbalance, .gas = gas_constants.GasFastStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .ISTANBUL },
    .{ .name = "BASEFEE", .opcode = 0x48, .execute = execution.block.op_basefee, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .LONDON },
    .{ .name = "BLOBHASH", .opcode = 0x49, .execute = execution.block.op_blobhash, .gas = gas_constants.BlobHashGas, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .CANCUN },
    .{ .name = "BLOBBASEFEE", .opcode = 0x4a, .execute = execution.block.op_blobbasefee, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .CANCUN },

    // 0x50s: Stack, Memory, Storage and Flow Operations
    .{ .name = "POP", .opcode = 0x50, .execute = execution.stack.op_pop, .gas = gas_constants.GasQuickStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "MLOAD", .opcode = 0x51, .execute = execution.memory.op_mload, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "MSTORE", .opcode = 0x52, .execute = execution.memory.op_mstore, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MSTORE8", .opcode = 0x53, .execute = execution.memory.op_mstore8, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SLOAD_FRONTIER", .opcode = 0x54, .execute = execution.storage.op_sload, .gas = 50, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .FRONTIER },
    .{ .name = "SLOAD_TANGERINE", .opcode = 0x54, .execute = execution.storage.op_sload, .gas = 200, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .TANGERINE_WHISTLE },
    .{ .name = "SLOAD_ISTANBUL", .opcode = 0x54, .execute = execution.storage.op_sload, .gas = 800, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .ISTANBUL },
    .{ .name = "SLOAD", .opcode = 0x54, .execute = execution.storage.op_sload, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .BERLIN },
    .{ .name = "SSTORE", .opcode = 0x55, .execute = execution.storage.op_sstore, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "JUMP", .opcode = 0x56, .execute = execution.control.op_jump, .gas = gas_constants.GasMidStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "JUMPI", .opcode = 0x57, .execute = execution.control.op_jumpi, .gas = gas_constants.GasSlowStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "PC", .opcode = 0x58, .execute = execution.control.op_pc, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "MSIZE", .opcode = 0x59, .execute = execution.memory.op_msize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "GAS", .opcode = 0x5a, .execute = execution.system.gas_op, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "JUMPDEST", .opcode = 0x5b, .execute = execution.control.op_jumpdest, .gas = gas_constants.JumpdestGas, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "TLOAD", .opcode = 0x5c, .execute = execution.storage.op_tload, .gas = gas_constants.WarmStorageReadCost, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .CANCUN },
    .{ .name = "TSTORE", .opcode = 0x5d, .execute = execution.storage.op_tstore, .gas = gas_constants.WarmStorageReadCost, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = .CANCUN },
    .{ .name = "MCOPY", .opcode = 0x5e, .execute = execution.memory.op_mcopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY, .variant = .CANCUN },
    .{ .name = "PUSH0", .opcode = 0x5f, .execute = execution.stack.op_push0, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .SHANGHAI },

    // 0x60s & 0x70s: Push operations (generated dynamically in jump table)
    // 0x80s: Duplication operations (generated dynamically in jump table)
    // 0x90s: Exchange operations (generated dynamically in jump table)
    // 0xa0s: Logging operations (generated dynamically in jump table)

    // 0xf0s: System operations
    .{ .name = "CREATE", .opcode = 0xf0, .execute = execution.system.op_create, .gas = gas_constants.CreateGas, .min_stack = 3, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALL_FRONTIER", .opcode = 0xf1, .execute = execution.system.op_call, .gas = 40, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = .FRONTIER },
    .{ .name = "CALL", .opcode = 0xf1, .execute = execution.system.op_call, .gas = 700, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = .TANGERINE_WHISTLE },
    .{ .name = "CALLCODE_FRONTIER", .opcode = 0xf2, .execute = execution.system.op_callcode, .gas = 40, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = .FRONTIER },
    .{ .name = "CALLCODE", .opcode = 0xf2, .execute = execution.system.op_callcode, .gas = 700, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = .TANGERINE_WHISTLE },
    .{ .name = "RETURN", .opcode = 0xf3, .execute = execution.control.op_return, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "DELEGATECALL", .opcode = 0xf4, .execute = execution.system.op_delegatecall, .gas = 40, .min_stack = 6, .max_stack = Stack.CAPACITY - 1, .variant = .HOMESTEAD },
    .{ .name = "DELEGATECALL_TANGERINE", .opcode = 0xf4, .execute = execution.system.op_delegatecall, .gas = 700, .min_stack = 6, .max_stack = Stack.CAPACITY - 1, .variant = .TANGERINE_WHISTLE },
    .{ .name = "CREATE2", .opcode = 0xf5, .execute = execution.system.op_create2, .gas = gas_constants.CreateGas, .min_stack = 4, .max_stack = Stack.CAPACITY - 1, .variant = .CONSTANTINOPLE },
    .{ .name = "STATICCALL", .opcode = 0xfa, .execute = execution.system.op_staticcall, .gas = 700, .min_stack = 6, .max_stack = Stack.CAPACITY - 1, .variant = .BYZANTIUM },
    .{ .name = "REVERT", .opcode = 0xfd, .execute = execution.control.op_revert, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = .BYZANTIUM },
    .{ .name = "INVALID", .opcode = 0xfe, .execute = execution.control.op_invalid, .gas = 0, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "SELFDESTRUCT_FRONTIER", .opcode = 0xff, .execute = execution.control.op_selfdestruct, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .FRONTIER },
    .{ .name = "SELFDESTRUCT", .opcode = 0xff, .execute = execution.control.op_selfdestruct, .gas = 5000, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .TANGERINE_WHISTLE },
};

/// Generate an Operation struct from an OpSpec.
pub fn generate_operation(spec: OpSpec) Operation {
    return Operation{
        .execute = spec.execute,
        .constant_gas = spec.gas,
        .min_stack = spec.min_stack,
        .max_stack = spec.max_stack,
    };
}
```

````zig [src/evm/jump_table/jump_table.zig]
const std = @import("std");
const Opcode = @import("../opcodes/opcode.zig");
const operation_module = @import("../opcodes/operation.zig");
const Operation = operation_module.Operation;
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;
const ExecutionError = @import("../execution/execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Memory = @import("../memory.zig");
const Frame = @import("../frame.zig");
const Contract = @import("../contract/contract.zig");
const Address = @import("Address");
const Log = @import("../log.zig");

const execution = @import("../execution/package.zig");
const stack_ops = execution.stack;
const log = execution.log;
const operation_config = @import("operation_config.zig");

/// EVM jump table for efficient opcode dispatch.
///
/// The jump table is a critical performance optimization that maps opcodes
/// to their execution handlers. Instead of using a switch statement with
/// 256 cases, the jump table provides O(1) dispatch by indexing directly
/// into an array of function pointers.
///
/// ## Design Rationale
/// - Array indexing is faster than switch statement branching
/// - Cache-line alignment improves memory access patterns
/// - Hardfork-specific tables allow for efficient versioning
/// - Null entries default to UNDEFINED operation
///
/// ## Hardfork Evolution
/// The jump table evolves with each hardfork:
/// - New opcodes are added (e.g., PUSH0 in Shanghai)
/// - Gas costs change (e.g., SLOAD in Berlin)
/// - Opcodes are removed or modified
///
/// ## Performance Considerations
/// - 64-byte cache line alignment reduces cache misses
/// - Direct indexing eliminates branch prediction overhead
/// - Operation structs are immutable for thread safety
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// const opcode = bytecode[pc];
/// const operation = table.get_operation(opcode);
/// const result = try table.execute(pc, interpreter, state, opcode);
/// ```
pub const JumpTable = @This();

/// CPU cache line size for optimal memory alignment.
/// Most modern x86/ARM processors use 64-byte cache lines.
const CACHE_LINE_SIZE = 64;

/// Array of operation handlers indexed by opcode value.
/// Aligned to cache line boundaries for optimal performance.
/// Null entries are treated as undefined opcodes.
table: [256]?*const Operation align(CACHE_LINE_SIZE),

/// CANCUN jump table, pre-generated at compile time.
/// This is the latest hardfork configuration.
pub const CANCUN = init_from_hardfork(.CANCUN);

/// Default jump table for the latest hardfork.
/// References CANCUN to avoid generating the same table twice.
/// This is what gets used when no jump table is specified.
pub const DEFAULT = CANCUN;

/// Create an empty jump table with all entries set to null.
///
/// This creates a blank jump table that must be populated with
/// operations before use. Typically, you'll want to use
/// init_from_hardfork() instead to get a pre-configured table.
///
/// @return An empty jump table
pub fn init() JumpTable {
    return JumpTable{
        .table = [_]?*const Operation{null} ** 256,
    };
}

/// Get the operation handler for a given opcode.
///
/// Returns the operation associated with the opcode, or the NULL
/// operation if the opcode is undefined in this jump table.
///
/// @param self The jump table
/// @param opcode The opcode byte value (0x00-0xFF)
/// @return Operation handler (never null)
///
/// Example:
/// ```zig
/// const op = table.get_operation(0x01); // Get ADD operation
/// ```
pub fn get_operation(self: *const JumpTable, opcode: u8) *const Operation {
    return self.table[opcode] orelse &operation_module.NULL_OPERATION;
}

/// Execute an opcode using the jump table.
///
/// This is the main dispatch function that:
/// 1. Looks up the operation for the opcode
/// 2. Validates stack requirements
/// 3. Consumes gas
/// 4. Executes the operation
///
/// @param self The jump table
/// @param pc Current program counter
/// @param interpreter VM interpreter context
/// @param state Execution state (cast to Frame internally)
/// @param opcode The opcode to execute
/// @return Execution result with gas consumed
/// @throws InvalidOpcode if opcode is undefined
/// @throws StackUnderflow/Overflow if validation fails
/// @throws OutOfGas if insufficient gas
///
/// Example:
/// ```zig
/// const result = try table.execute(pc, &interpreter, &state, bytecode[pc]);
/// ```
pub fn execute(self: *const JumpTable, pc: usize, interpreter: *operation_module.Interpreter, state: *operation_module.State, opcode: u8) ExecutionError.Error!operation_module.ExecutionResult {
    const operation = self.get_operation(opcode);

    // Cast state to Frame to access gas_remaining and stack
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    Log.debug("JumpTable.execute: Executing opcode 0x{x:0>2} at pc={}, gas={}, stack_size={}", .{ opcode, pc, frame.gas_remaining, frame.stack.size });

    // Handle undefined opcodes (cold path)
    if (operation.undefined) {
        @branchHint(.cold);
        Log.debug("JumpTable.execute: Invalid opcode 0x{x:0>2}", .{opcode});
        frame.gas_remaining = 0;
        return ExecutionError.Error.InvalidOpcode;
    }

    const stack_validation = @import("../stack/stack_validation.zig");
    try stack_validation.validate_stack_requirements(&frame.stack, operation);

    // Gas consumption (likely path)
    if (operation.constant_gas > 0) {
        @branchHint(.likely);
        Log.debug("JumpTable.execute: Consuming {} gas for opcode 0x{x:0>2}", .{ operation.constant_gas, opcode });
        try frame.consume_gas(operation.constant_gas);
    }

    const res = try operation.execute(pc, interpreter, state);
    Log.debug("JumpTable.execute: Opcode 0x{x:0>2} completed, gas_remaining={}", .{ opcode, frame.gas_remaining });
    return res;
}

/// Validate and fix the jump table.
///
/// Ensures all entries are valid:
/// - Null entries are replaced with UNDEFINED operation
/// - Operations with memory_size must have dynamic_gas
/// - Invalid operations are logged and replaced
///
/// This should be called after manually constructing a jump table
/// to ensure it's safe for execution.
///
/// @param self The jump table to validate
pub fn validate(self: *JumpTable) void {
    for (0..256) |i| {
        // Handle null entries (less common)
        if (self.table[i] == null) {
            @branchHint(.cold);
            self.table[i] = &operation_module.NULL_OPERATION;
            continue;
        }

        // Check for invalid operation configuration (error path)
        const operation = self.table[i].?;
        if (operation.memory_size != null and operation.dynamic_gas == null) {
            @branchHint(.cold);
            // Log error instead of panicking
            std.debug.print("Warning: Operation 0x{x} has memory size but no dynamic gas calculation\n", .{i});
            // Set to NULL to prevent issues
            self.table[i] = &operation_module.NULL_OPERATION;
        }
    }
}

pub fn copy(self: *const JumpTable, allocator: std.mem.Allocator) !JumpTable {
    _ = allocator;
    return JumpTable{
        .table = self.table,
    };
}


/// Create a jump table configured for a specific hardfork.
///
/// This is the primary way to create a jump table. It starts with
/// the Frontier base configuration and applies all changes up to
/// the specified hardfork.
///
/// @param hardfork The target hardfork configuration
/// @return A fully configured jump table
///
/// Hardfork progression:
/// - FRONTIER: Base EVM opcodes
/// - HOMESTEAD: DELEGATECALL
/// - TANGERINE_WHISTLE: Gas repricing (EIP-150)
/// - BYZANTIUM: REVERT, RETURNDATASIZE, STATICCALL
/// - CONSTANTINOPLE: CREATE2, SHL/SHR/SAR, EXTCODEHASH
/// - ISTANBUL: CHAINID, SELFBALANCE, more gas changes
/// - BERLIN: Access lists, cold/warm storage
/// - LONDON: BASEFEE
/// - SHANGHAI: PUSH0
/// - CANCUN: BLOBHASH, MCOPY, transient storage
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// // Table includes all opcodes through Cancun
/// ```
pub fn init_from_hardfork(hardfork: Hardfork) JumpTable {
    @setEvalBranchQuota(10000);
    var jt = JumpTable.init();
    // With ALL_OPERATIONS sorted by hardfork, we can iterate once.
    // Each opcode will be set to the latest active version for the target hardfork.
    inline for (operation_config.ALL_OPERATIONS) |spec| {
        const op_hardfork = spec.variant orelse Hardfork.FRONTIER;
        // Most operations are included in hardforks (likely path)
        if (@intFromEnum(op_hardfork) <= @intFromEnum(hardfork)) {
            const op = struct {
                pub const operation = operation_config.generate_operation(spec);
            };
            jt.table[spec.opcode] = &op.operation;
        }
    }
    // 0x60s & 0x70s: Push operations
    inline for (0..32) |i| {
        const n = i + 1;
        jt.table[0x60 + i] = &Operation{
            .execute = stack_ops.make_push(n),
            .constant_gas = execution.gas_constants.GasFastestStep,
            .min_stack = 0,
            .max_stack = Stack.CAPACITY - 1,
        };
    }
    // 0x80s: Duplication Operations
    inline for (1..17) |n| {
        jt.table[0x80 + n - 1] = &Operation{
            .execute = stack_ops.make_dup(n),
            .constant_gas = execution.gas_constants.GasFastestStep,
            .min_stack = @intCast(n),
            .max_stack = Stack.CAPACITY - 1,
        };
    }
    // 0x90s: Exchange Operations
    inline for (1..17) |n| {
        jt.table[0x90 + n - 1] = &Operation{
            .execute = stack_ops.make_swap(n),
            .constant_gas = execution.gas_constants.GasFastestStep,
            .min_stack = @intCast(n + 1),
            .max_stack = Stack.CAPACITY,
        };
    }
    // 0xa0s: Logging Operations
    inline for (0..5) |n| {
        jt.table[0xa0 + n] = &Operation{
            .execute = log.make_log(n),
            .constant_gas = execution.gas_constants.LogGas + execution.gas_constants.LogTopicGas * n,
            .min_stack = @intCast(n + 2),
            .max_stack = Stack.CAPACITY,
        };
    }
    jt.validate();
    return jt;
}
````

```zig [src/evm/contract/bitvec.zig]
const std = @import("std");
const constants = @import("../constants/constants.zig");

/// BitVec is a bit vector implementation used for tracking JUMPDEST positions in bytecode
const BitVec = @This();

/// Bit array stored in u64 chunks
bits: []u64,
/// Total length in bits
size: usize,
/// Whether this bitvec owns its memory (and should free it)
owned: bool,

/// Error types for BitVec operations
pub const BitVecError = error{
    /// Position is out of bounds for the bit vector
    PositionOutOfBounds,
};

/// Error type for BitVec initialization
pub const BitVecInitError = std.mem.Allocator.Error;

/// Error type for code bitmap creation
pub const CodeBitmapError = BitVecInitError;

/// Create a new BitVec with the given size
pub fn init(allocator: std.mem.Allocator, size: usize) BitVecInitError!BitVec {
    const u64_size = (size + 63) / 64; // Round up to nearest u64
    const bits = try allocator.alloc(u64, u64_size);
    @memset(bits, 0); // Initialize all bits to 0
    return BitVec{
        .bits = bits,
        .size = size,
        .owned = true,
    };
}

/// Create a BitVec from existing memory (not owned)
pub fn from_memory(bits: []u64, size: usize) BitVec {
    return BitVec{
        .bits = bits,
        .size = size,
        .owned = false,
    };
}

/// Free allocated memory if owned
pub fn deinit(self: *BitVec, allocator: std.mem.Allocator) void {
    if (self.owned) {
        allocator.free(self.bits);
        self.bits = &.{};
        self.size = 0;
    }
}

/// Set a bit at the given position
pub fn set(self: *BitVec, pos: usize) BitVecError!void {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] |= bit;
}

/// Set a bit at the given position without bounds checking
pub fn set_unchecked(self: *BitVec, pos: usize) void {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] |= bit;
}

/// Clear a bit at the given position
pub fn clear(self: *BitVec, pos: usize) BitVecError!void {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] &= ~bit;
}

/// Clear a bit at the given position without bounds checking
pub fn clear_unchecked(self: *BitVec, pos: usize) void {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] &= ~bit;
}

/// Check if a bit is set at the given position
pub fn is_set(self: *const BitVec, pos: usize) BitVecError!bool {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    return (self.bits[idx] & bit) != 0;
}

/// Check if a bit is set at the given position without bounds checking
pub fn is_set_unchecked(self: *const BitVec, pos: usize) bool {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    return (self.bits[idx] & bit) != 0;
}

/// Check if the position represents a valid code segment
pub fn code_segment(self: *const BitVec, pos: usize) BitVecError!bool {
    return self.is_set(pos);
}

/// Check if the position represents a valid code segment without bounds checking
pub fn code_segment_unchecked(self: *const BitVec, pos: usize) bool {
    return self.is_set_unchecked(pos);
}

/// Analyze bytecode to identify valid JUMPDEST locations and code segments
pub fn code_bitmap(allocator: std.mem.Allocator, code: []const u8) CodeBitmapError!BitVec {
    var bitmap = try BitVec.init(allocator, code.len);
    errdefer bitmap.deinit(allocator);

    // Mark all positions as valid code initially
    for (0..code.len) |i| {
        bitmap.set_unchecked(i);
    }

    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];

        // If the opcode is a PUSH, skip the pushed bytes
        if (constants.is_push(op)) {
            const push_bytes = constants.get_push_size(op); // Get number of bytes to push

            // Mark pushed bytes as data (not code)
            var j: usize = 1;
            while (j <= push_bytes and i + j < code.len) : (j += 1) {
                bitmap.clear_unchecked(i + j);
            }

            // Skip the pushed bytes
            if (i + push_bytes + 1 < code.len) {
                i += push_bytes + 1;
            } else {
                i = code.len;
            }
        } else {
            i += 1;
        }
    }

    return bitmap;
}

```

````zig [src/evm/contract/eip_7702_bytecode.zig]
const Address = @import("Address");

/// Magic bytes that identify EIP-7702 delegated code
///
/// EIP-7702 introduces a new transaction type that allows EOAs (Externally Owned Accounts)
/// to temporarily delegate their code execution to a contract address. This is marked
/// by prepending the contract address with these magic bytes: 0xE7 0x02
pub const EIP7702_MAGIC_BYTES = [2]u8{ 0xE7, 0x02 };

/// EIP-7702 bytecode representation for delegated EOA code
///
/// This struct represents the bytecode format introduced by EIP-7702, which allows
/// EOAs to delegate their code execution to a contract address. The bytecode format
/// consists of the magic bytes (0xE7, 0x02) followed by a 20-byte address.
///
/// ## EIP-7702 Overview
///
/// EIP-7702 enables EOAs to temporarily act like smart contracts by delegating
/// their code execution to an existing contract. This is useful for:
/// - Account abstraction without deploying new contracts
/// - Batched transactions from EOAs
/// - Sponsored transactions
/// - Enhanced wallet functionality
///
/// ## Bytecode Format
///
/// The delegated bytecode format is exactly 22 bytes:
/// - Bytes 0-1: Magic bytes (0xE7, 0x02)
/// - Bytes 2-21: Contract address to delegate to
///
/// When the EVM encounters this bytecode format, it executes the code at the
/// specified contract address in the context of the EOA.
const Eip7702Bytecode = @This();

/// The contract address that this EOA delegates execution to
address: Address.Address,

/// Creates a new EIP-7702 bytecode representation
///
/// ## Parameters
/// - `address`: The contract address to delegate execution to
///
/// ## Returns
/// A new EIP7702Bytecode instance
///
/// ## Example
/// ```zig
/// const delegate_address = Address.from_hex("0x742d35Cc6634C0532925a3b844Bc9e7595f62d3c");
/// const bytecode = EIP7702Bytecode.new(delegate_address);
/// ```
pub fn new(address: Address.Address) Eip7702Bytecode {
    return .{ .address = address };
}

/// Creates an EIP-7702 bytecode representation from raw bytes
///
/// Parses the bytecode format to extract the delegation address.
/// This function expects the input to include the magic bytes.
///
/// ## Parameters
/// - `bytes`: Raw bytecode bytes, should be at least 22 bytes (2 magic + 20 address)
///
/// ## Returns
/// A new EIP7702Bytecode instance
///
/// ## Errors
/// Currently this function doesn't validate the magic bytes or length,
/// but may return malformed results if the input is invalid.
///
/// ## Example
/// ```zig
/// const raw_bytecode = &[_]u8{0xE7, 0x02} ++ address_bytes;
/// const bytecode = try EIP7702Bytecode.new_raw(raw_bytecode);
/// ```
pub fn new_raw(bytes: []const u8) !Eip7702Bytecode {
    var address: Address.Address = undefined;
    if (bytes.len > 20) {
        @memcpy(&address, bytes[2..22]);
    }
    return Eip7702Bytecode.new(address);
}

/// Returns the raw bytecode representation
///
/// **NOTE**: This function is currently incomplete and returns an empty slice.
/// It should return the full 22-byte bytecode including magic bytes and address.
///
/// ## Parameters
/// - `self`: The EIP7702Bytecode instance
///
/// ## Returns
/// The raw bytecode bytes (currently returns empty slice - TODO: implement properly)
///
/// ## TODO
/// This function should be implemented to return:
/// - Bytes 0-1: EIP7702_MAGIC_BYTES
/// - Bytes 2-21: The delegation address
pub fn raw(self: *const Eip7702Bytecode) []const u8 {
    _ = self;
    return &[_]u8{};
}
````

````zig [src/evm/contract/storage_pool.zig]
const std = @import("std");

/// Object pool for EVM storage-related hash maps to reduce allocation pressure.
///
/// The StoragePool manages reusable hash maps for storage slot tracking and access
/// patterns, significantly reducing allocation/deallocation overhead during EVM
/// execution. This is particularly important for contracts that make heavy use
/// of storage operations.
///
/// ## Design Rationale
/// EVM execution frequently creates and destroys hash maps for:
/// - Tracking which storage slots have been accessed (warm/cold for EIP-2929)
/// - Storing original storage values for gas refund calculations
///
/// Rather than allocating new maps for each contract call, this pool maintains
/// a cache of cleared maps ready for reuse.
///
/// ## Usage Pattern
/// ```zig
/// var pool = StoragePool.init(allocator);
/// defer pool.deinit();
///
/// // Borrow a map
/// const map = try pool.borrow_storage_map();
/// defer pool.return_storage_map(map);
///
/// // Use the map for storage operations
/// try map.put(slot, value);
/// ```
///
/// ## Thread Safety
/// This pool is NOT thread-safe. Each thread should maintain its own pool
/// or use external synchronization.
const StoragePool = @This();

/// Pool of reusable access tracking maps (slot -> accessed flag)
access_maps: std.ArrayList(*std.AutoHashMap(u256, bool)),
/// Pool of reusable storage value maps (slot -> value)
storage_maps: std.ArrayList(*std.AutoHashMap(u256, u256)),
/// Allocator used for creating new maps when pool is empty
allocator: std.mem.Allocator,

/// Initialize a new storage pool.
///
/// @param allocator The allocator to use for creating new maps
/// @return A new StoragePool instance
///
/// Example:
/// ```zig
/// var pool = StoragePool.init(allocator);
/// defer pool.deinit();
/// ```
pub fn init(allocator: std.mem.Allocator) StoragePool {
    return .{
        .access_maps = std.ArrayList(*std.AutoHashMap(u256, bool)).init(allocator),
        .storage_maps = std.ArrayList(*std.AutoHashMap(u256, u256)).init(allocator),
        .allocator = allocator,
    };
}

/// Clean up the storage pool and all contained maps.
///
/// This function destroys all pooled maps and frees their memory.
/// After calling deinit, the pool should not be used.
///
/// Note: Any maps currently borrowed from the pool will become invalid
/// after deinit. Ensure all borrowed maps are returned before calling this.
pub fn deinit(self: *StoragePool) void {
    // Clean up any remaining maps
    for (self.access_maps.items) |map| {
        map.deinit();
        self.allocator.destroy(map);
    }
    for (self.storage_maps.items) |map| {
        map.deinit();
        self.allocator.destroy(map);
    }
    self.access_maps.deinit();
    self.storage_maps.deinit();
}

/// Error type for access map borrowing operations
pub const BorrowAccessMapError = error{
    /// Allocator failed to allocate memory for a new map
    OutOfAllocatorMemory,
};

/// Borrow an access tracking map from the pool.
///
/// Access maps track which storage slots have been accessed during execution,
/// used for EIP-2929 warm/cold access gas pricing.
///
/// If the pool has available maps, one is returned immediately.
/// Otherwise, a new map is allocated.
///
/// @return A cleared hash map ready for use
/// @throws OutOfAllocatorMemory if allocation fails
///
/// Example:
/// ```zig
/// const access_map = try pool.borrow_access_map();
/// defer pool.return_access_map(access_map);
///
/// // Track storage slot access
/// try access_map.put(slot, true);
/// const was_accessed = access_map.get(slot) orelse false;
/// ```
pub fn borrow_access_map(self: *StoragePool) BorrowAccessMapError!*std.AutoHashMap(u256, bool) {
    if (self.access_maps.items.len > 0) return self.access_maps.pop() orelse unreachable;
    const map = self.allocator.create(std.AutoHashMap(u256, bool)) catch {
        return BorrowAccessMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, bool).init(self.allocator);
    return map;
}

/// Return an access map to the pool for reuse.
///
/// The map is cleared but its capacity is retained to avoid
/// reallocation on next use. If the pool fails to store the
/// returned map (due to memory pressure), it is silently discarded.
///
/// @param map The map to return to the pool
///
/// Note: The map should not be used after returning it to the pool.
pub fn return_access_map(self: *StoragePool, map: *std.AutoHashMap(u256, bool)) void {
    map.clearRetainingCapacity();
    self.access_maps.append(map) catch {};
}

/// Error type for storage map borrowing operations
pub const BorrowStorageMapError = error{
    /// Allocator failed to allocate memory for a new map
    OutOfAllocatorMemory,
};

/// Borrow a storage value map from the pool.
///
/// Storage maps store slot values, typically used for tracking original
/// values to calculate gas refunds or implement storage rollback.
///
/// If the pool has available maps, one is returned immediately.
/// Otherwise, a new map is allocated.
///
/// @return A cleared hash map ready for use
/// @throws OutOfAllocatorMemory if allocation fails
///
/// Example:
/// ```zig
/// const storage_map = try pool.borrow_storage_map();
/// defer pool.return_storage_map(storage_map);
///
/// // Store original value before modification
/// try storage_map.put(slot, original_value);
/// ```
pub fn borrow_storage_map(self: *StoragePool) BorrowStorageMapError!*std.AutoHashMap(u256, u256) {
    if (self.storage_maps.pop()) |map| {
        return map;
    }
    const map = self.allocator.create(std.AutoHashMap(u256, u256)) catch {
        return BorrowStorageMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, u256).init(self.allocator);
    return map;
}

/// Return a storage map to the pool for reuse.
///
/// The map is cleared but its capacity is retained to avoid
/// reallocation on next use. If the pool fails to store the
/// returned map (due to memory pressure), it is silently discarded.
///
/// @param map The map to return to the pool
///
/// Note: The map should not be used after returning it to the pool.
pub fn return_storage_map(self: *StoragePool, map: *std.AutoHashMap(u256, u256)) void {
    map.clearRetainingCapacity();
    self.storage_maps.append(map) catch {};
}
````

````zig [src/evm/contract/contract.zig]
//! Production-quality Contract module for EVM execution context.
//!
//! This module provides the core abstraction for contract execution in the EVM,
//! managing bytecode, gas accounting, storage access tracking, and JUMPDEST validation.
//! It incorporates performance optimizations from modern EVM implementations including
//! evmone, revm, and go-ethereum.
//!
//! ## Architecture
//! The Contract structure represents a single execution frame in the EVM call stack.
//! Each contract call (CALL, DELEGATECALL, STATICCALL, CREATE) creates a new Contract
//! instance that tracks its own gas, storage access, and execution state.
//!
//! ## Performance Characteristics
//! - **JUMPDEST validation**: O(log n) using binary search on pre-sorted positions
//! - **Storage access**: O(1) with warm/cold tracking for EIP-2929
//! - **Code analysis**: Cached globally with thread-safe access
//! - **Memory management**: Zero-allocation paths for common operations
//! - **Storage pooling**: Reuses hash maps to reduce allocation pressure
//!
//! ## Key Features
//! 1. **Code Analysis Caching**: Bytecode is analyzed once and cached globally
//! 2. **EIP-2929 Support**: Tracks warm/cold storage slots for gas calculation
//! 3. **Static Call Protection**: Prevents state modifications in read-only contexts
//! 4. **Gas Refund Tracking**: Manages gas refunds with EIP-3529 limits
//! 5. **Deployment Support**: Handles both CREATE and CREATE2 deployment flows
//!
//! ## Thread Safety
//! The global analysis cache uses mutex protection when multi-threaded,
//! automatically degrading to no-op mutexes in single-threaded builds.
//!
//! ## Memory Management
//! Contracts can optionally use a StoragePool to reuse hash maps across
//! multiple contract executions, significantly reducing allocation overhead
//! in high-throughput scenarios.
//!
//! ## Reference Implementations
//! - go-ethereum: https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go
//! - revm: https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/contract.rs
//! - evmone: https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp
const std = @import("std");
const constants = @import("../constants/constants.zig");
const bitvec = @import("bitvec.zig");
const Address = @import("Address");
const ExecutionError = @import("../execution/execution_error.zig");
const CodeAnalysis = @import("code_analysis.zig");
const StoragePool = @import("storage_pool.zig");
const Log = @import("../log.zig");
const wasm_stubs = @import("../wasm_stubs.zig");

/// Maximum gas refund allowed (EIP-3529)
const MAX_REFUND_QUOTIENT = 5;

/// Error types for Contract operations
pub const ContractError = std.mem.Allocator.Error || StorageOperationError;
pub const StorageOperationError = error{
    OutOfAllocatorMemory,
    InvalidStorageOperation,
};
pub const CodeAnalysisError = std.mem.Allocator.Error;

/// Global analysis cache (simplified version)
var analysis_cache: ?std.AutoHashMap([32]u8, *CodeAnalysis) = null;
// Use WASM-compatible mutex type
var cache_mutex: wasm_stubs.Mutex = .{};

/// Contract represents the execution context for a single call frame in the EVM.
///
/// Each contract execution (whether from external transaction, internal call,
/// or contract creation) operates within its own Contract instance. This design
/// enables proper isolation, gas accounting, and state management across the
/// call stack.
const Contract = @This();

// ============================================================================
// Identity and Context Fields
// ============================================================================

/// The address where this contract's code is deployed.
///
/// - For regular calls: The callee's address
/// - For DELEGATECALL: The current contract's address (code from elsewhere)
/// - For CREATE/CREATE2: Initially zero, set after address calculation
address: Address.Address,

/// The address that initiated this contract execution.
///
/// - For external transactions: The EOA that signed the transaction
/// - For internal calls: The contract that executed CALL/DELEGATECALL/etc
/// - For CREATE/CREATE2: The creating contract's address
///
/// Note: This is msg.sender in Solidity, not tx.origin
caller: Address.Address,

/// The amount of Wei sent with this contract call.
///
/// - Regular calls: Can be any amount (if not static)
/// - DELEGATECALL: Always 0 (uses parent's value)
/// - STATICCALL: Always 0 (no value transfer allowed)
/// - CREATE/CREATE2: Initial balance for new contract
value: u256,

// ============================================================================
// Code and Analysis Fields
// ============================================================================

/// The bytecode being executed in this context.
///
/// - Regular calls: The deployed contract's runtime bytecode
/// - CALLCODE/DELEGATECALL: The external contract's code
/// - CREATE/CREATE2: The initialization bytecode (constructor)
///
/// This slice is a view into existing memory, not owned by Contract.
code: []const u8,

/// Keccak256 hash of the contract bytecode.
///
/// Used for:
/// - Code analysis caching (avoids re-analyzing same bytecode)
/// - EXTCODEHASH opcode implementation
/// - CREATE2 address calculation
///
/// For deployments, this is set to zero as there's no deployed code yet.
code_hash: [32]u8,

/// Cached length of the bytecode for performance.
///
/// Storing this separately avoids repeated slice.len calls in hot paths
/// like bounds checking for PC and CODECOPY operations.
code_size: u64,

/// Optional reference to pre-computed code analysis.
///
/// Contains:
/// - JUMPDEST positions for O(log n) validation
/// - Code vs data segments (bitvector)
/// - Static analysis results (has CREATE, has SELFDESTRUCT, etc)
///
/// This is lazily computed on first jump and cached globally.
analysis: ?*const CodeAnalysis,

// ============================================================================
// Gas Tracking Fields
// ============================================================================

/// Remaining gas available for execution.
///
/// Decremented by each operation according to its gas cost.
/// If this reaches 0, execution halts with out-of-gas error.
///
/// Gas forwarding rules:
/// - CALL: Limited by 63/64 rule (EIP-150)
/// - DELEGATECALL/STATICCALL: Same rules as CALL
/// - CREATE/CREATE2: All remaining gas minus stipend
gas: u64,

/// Accumulated gas refund from storage operations.
///
/// Tracks gas to be refunded at transaction end from:
/// - SSTORE: Clearing storage slots
/// - SELFDESTRUCT: Contract destruction (pre-London)
///
/// Limited to gas_used / 5 by EIP-3529 (London hardfork).
gas_refund: u64,

// ============================================================================
// Input/Output Fields
// ============================================================================

/// Input data passed to this contract execution.
///
/// - External transactions: Transaction data field
/// - CALL/STATICCALL: Data passed in call
/// - DELEGATECALL: Data passed (preserves msg.data)
/// - CREATE/CREATE2: Constructor arguments
///
/// Accessed via CALLDATALOAD, CALLDATASIZE, CALLDATACOPY opcodes.
input: []const u8,

// ============================================================================
// Execution Flags
// ============================================================================

/// Indicates this is a contract deployment (CREATE/CREATE2).
///
/// When true:
/// - Executing initialization code (constructor)
/// - No deployed code exists at the address yet
/// - Result will be stored as contract code if successful
is_deployment: bool,

/// Indicates this is a system-level call.
///
/// System calls bypass certain checks and gas costs.
/// Used for precompiles and protocol-level operations.
is_system_call: bool,

/// Indicates read-only execution context (STATICCALL).
///
/// When true, these operations will fail:
/// - SSTORE (storage modification)
/// - LOG0-LOG4 (event emission)
/// - CREATE/CREATE2 (contract creation)
/// - SELFDESTRUCT (contract destruction)
/// - CALL with value transfer
is_static: bool,

// ============================================================================
// Storage Access Tracking (EIP-2929)
// ============================================================================

/// Tracks which storage slots have been accessed (warm vs cold).
///
/// EIP-2929 charges different gas costs:
/// - Cold access (first time): 2100 gas
/// - Warm access (subsequent): 100 gas
///
/// Key: storage slot, Value: true (accessed)
/// Can be borrowed from StoragePool for efficiency.
storage_access: ?*std.AutoHashMap(u256, bool),

/// Tracks original storage values for gas refund calculations.
///
/// Used by SSTORE to determine gas costs and refunds based on:
/// - Original value (at transaction start)
/// - Current value (in storage)
/// - New value (being set)
///
/// Key: storage slot, Value: original value
original_storage: ?*std.AutoHashMap(u256, u256),

/// Whether this contract address was cold at call start.
///
/// Used for EIP-2929 gas calculations:
/// - Cold contract: Additional 2600 gas for first access
/// - Warm contract: No additional cost
///
/// Contracts become warm after first access in a transaction.
is_cold: bool,

// ============================================================================
// Optimization Fields
// ============================================================================

/// Quick flag indicating if bytecode contains any JUMPDEST opcodes.
///
/// Enables fast-path optimization:
/// - If false, all jumps fail immediately (no valid destinations)
/// - If true, full JUMPDEST analysis is needed
///
/// Set during initialization by scanning bytecode.
has_jumpdests: bool,

/// Flag indicating empty bytecode.
///
/// Empty contracts (no code) are common in Ethereum:
/// - EOAs (externally owned accounts)
/// - Destroyed contracts
/// - Contracts that failed deployment
///
/// Enables fast-path for calls to codeless addresses.
is_empty: bool,

/// Creates a new Contract for executing existing deployed code.
///
/// This is the standard constructor for CALL, CALLCODE, DELEGATECALL,
/// and STATICCALL operations. The contract code must already exist
/// at the specified address.
///
/// ## Parameters
/// - `caller`: The address initiating this call (msg.sender)
/// - `addr`: The address where the code is deployed
/// - `value`: Wei being transferred (0 for DELEGATECALL/STATICCALL)
/// - `gas`: Gas allocated for this execution
/// - `code`: The contract bytecode to execute
/// - `code_hash`: Keccak256 hash of the bytecode
/// - `input`: Call data (function selector + arguments)
/// - `is_static`: Whether this is a read-only context
///
/// ## Example
/// ```zig
/// const contract = Contract.init(
///     caller_address,
///     contract_address,
///     value,
///     gas_limit,
///     bytecode,
///     bytecode_hash,
///     calldata,
///     false, // not static
/// );
/// ```
pub fn init(
    caller: Address.Address,
    addr: Address.Address,
    value: u256,
    gas: u64,
    code: []const u8,
    code_hash: [32]u8,
    input: []const u8,
    is_static: bool,
) Contract {
    return Contract{
        .address = addr,
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = code,
        .code_hash = code_hash,
        .code_size = code.len,
        .input = input,
        .is_static = is_static,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = true,
        .gas_refund = 0,
        .is_deployment = false,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(code),
        .is_empty = code.len == 0,
    };
}

/// Creates a new Contract for deploying new bytecode.
///
/// Used for CREATE and CREATE2 operations. The contract address
/// is initially zero and will be set by the VM after computing
/// the deployment address.
///
/// ## Parameters
/// - `caller`: The creating contract's address
/// - `value`: Initial balance for the new contract
/// - `gas`: Gas allocated for deployment
/// - `code`: Initialization bytecode (constructor)
/// - `salt`: Optional salt for CREATE2 (null for CREATE)
///
/// ## Address Calculation
/// - CREATE: address = keccak256(rlp([sender, nonce]))[12:]
/// - CREATE2: address = keccak256(0xff ++ sender ++ salt ++ keccak256(code))[12:]
///
/// ## Deployment Flow
/// 1. Execute initialization code
/// 2. Code returns runtime bytecode
/// 3. VM stores runtime bytecode at computed address
/// 4. Contract becomes callable at that address
///
/// ## Example
/// ```zig
/// // CREATE
/// const contract = Contract.init_deployment(
///     deployer_address,
///     initial_balance,
///     gas_limit,
///     init_bytecode,
///     null, // no salt for CREATE
/// );
/// ```
pub fn init_deployment(
    caller: Address.Address,
    value: u256,
    gas: u64,
    code: []const u8,
    salt: ?[32]u8,
) Contract {
    const contract = Contract{
        .address = Address.zero(),
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = code,
        .code_hash = [_]u8{0} ** 32, // Deployment doesn't have code hash. This could be kekkac256(0) instead of 0
        .code_size = code.len,
        .input = &[_]u8{},
        .is_static = false,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = false, // Deployment is always warm
        .gas_refund = 0,
        .is_deployment = true,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(code),
        .is_empty = code.len == 0,
    };

    if (salt == null) return contract;
    // Salt is used for CREATE2 address calculation
    // The actual address calculation happens in the VM's create2_contract method

    return contract;
}

/// Performs a quick scan to check if bytecode contains any JUMPDEST opcodes.
///
/// This is a fast O(n) scan used during contract initialization to set
/// the `has_jumpdests` flag. If no JUMPDESTs exist, we can skip all
/// jump validation as any JUMP/JUMPI will fail.
///
/// ## Note
/// This doesn't account for JUMPDEST bytes inside PUSH data.
/// Full analysis is deferred until actually needed (lazy evaluation).
///
/// ## Returns
/// - `true`: At least one 0x5B byte found
/// - `false`: No JUMPDEST opcodes present
fn contains_jumpdest(code: []const u8) bool {
    for (code) |op| {
        if (op == constants.JUMPDEST) return true;
    }
    return false;
}

/// Validates if a jump destination is valid within the contract bytecode.
///
/// A valid jump destination must:
/// 1. Be within code bounds (< code_size)
/// 2. Point to a JUMPDEST opcode (0x5B)
/// 3. Not be inside PUSH data (validated by code analysis)
///
/// ## Parameters
/// - `allocator`: Allocator for lazy code analysis
/// - `dest`: Target program counter from JUMP/JUMPI
///
/// ## Returns
/// - `true`: Valid JUMPDEST at the target position
/// - `false`: Invalid destination (out of bounds, not JUMPDEST, or in data)
///
/// ## Performance
/// - Fast path: Empty code or no JUMPDESTs (immediate false)
/// - Analyzed code: O(log n) binary search
/// - First jump: O(n) analysis then O(log n) search
///
/// ## Example
/// ```zig
/// if (!contract.valid_jumpdest(allocator, jump_target)) {
///     return ExecutionError.InvalidJump;
/// }
/// ```
pub fn valid_jumpdest(self: *Contract, allocator: std.mem.Allocator, dest: u256) bool {
    // Fast path: empty code or out of bounds
    if (self.is_empty or dest >= self.code_size) return false;

    // Fast path: no JUMPDESTs in code
    if (!self.has_jumpdests) return false;
    const pos: u32 = @intCast(@min(dest, std.math.maxInt(u32)));

    // Ensure analysis is performed
    self.ensure_analysis(allocator);

    // Binary search in sorted JUMPDEST positions
    if (self.analysis) |analysis| {
        if (analysis.jumpdest_positions.len > 0) {
            const Context = struct { target: u32 };
            const found = std.sort.binarySearch(
                u32,
                analysis.jumpdest_positions,
                Context{ .target = pos },
                struct {
                    fn compare(ctx: Context, item: u32) std.math.Order {
                        return std.math.order(ctx.target, item);
                    }
                }.compare,
            );
            return found != null;
        }
    }
    // Fallback: check if position is code and contains JUMPDEST opcode
    if (self.is_code(pos) and pos < self.code_size) {
        return self.code[@intCast(pos)] == constants.JUMPDEST;
    }
    return false;
}

/// Ensure code analysis is performed
fn ensure_analysis(self: *Contract, allocator: std.mem.Allocator) void {
    if (self.analysis == null and !self.is_empty) {
        self.analysis = analyze_code(allocator, self.code, self.code_hash) catch |err| {
            // Log analysis failure for debugging - but continue execution
            Log.debug("Contract.ensure_analysis: analyze_code failed: {any}", .{err});
            return;
        };
    }
}

/// Check if position is code (not data)
pub fn is_code(self: *const Contract, pos: u64) bool {
    if (self.analysis) |analysis| {
        // We know pos is within bounds if analysis exists, so use unchecked version
        return analysis.code_segments.is_set_unchecked(@intCast(pos));
    }
    return true;
}

/// Attempts to consume gas from the contract's available gas.
///
/// This is the primary gas accounting method, called before every
/// operation to ensure sufficient gas remains. The inline directive
/// ensures this hot-path function has minimal overhead.
///
/// ## Parameters
/// - `amount`: Gas units to consume
///
/// ## Returns
/// - `true`: Gas successfully deducted
/// - `false`: Insufficient gas (triggers out-of-gas error)
///
/// ## Usage
/// ```zig
/// if (!contract.use_gas(operation_cost)) {
///     return ExecutionError.OutOfGas;
/// }
/// ```
///
/// ## Note
/// This method is marked inline for performance as it's called
/// millions of times during contract execution.
pub fn use_gas(self: *Contract, amount: u64) bool {
    if (self.gas < amount) return false;
    self.gas -= amount;
    return true;
}

/// Use gas without checking (when known safe)
pub fn use_gas_unchecked(self: *Contract, amount: u64) void {
    self.gas -= amount;
}

/// Refund gas to contract
pub fn refund_gas(self: *Contract, amount: u64) void {
    self.gas += amount;
}

/// Add to gas refund counter with clamping
pub fn add_gas_refund(self: *Contract, amount: u64) void {
    const max_refund = self.gas / MAX_REFUND_QUOTIENT;
    self.gas_refund = @min(self.gas_refund + amount, max_refund);
}

/// Subtract from gas refund counter with clamping
pub fn sub_gas_refund(self: *Contract, amount: u64) void {
    self.gas_refund = if (self.gas_refund > amount) self.gas_refund - amount else 0;
}

pub const MarkStorageSlotWarmError = error{
    OutOfAllocatorMemory,
};

/// Mark storage slot as warm with pool support
pub fn mark_storage_slot_warm(self: *Contract, allocator: std.mem.Allocator, slot: u256, pool: ?*StoragePool) MarkStorageSlotWarmError!bool {
    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = p.borrow_access_map() catch |err| switch (err) {
                StoragePool.BorrowAccessMapError.OutOfAllocatorMemory => {
                    Log.debug("Contract.mark_storage_slot_warm: failed to borrow access map: {any}", .{err});
                    return MarkStorageSlotWarmError.OutOfAllocatorMemory;
                },
            };
        } else {
            self.storage_access = allocator.create(std.AutoHashMap(u256, bool)) catch |err| {
                Log.debug("Contract.mark_storage_slot_warm: allocation failed: {any}", .{err});
                return MarkStorageSlotWarmError.OutOfAllocatorMemory;
            };
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(allocator);
        }
    }

    const map = self.storage_access.?;
    const was_cold = !map.contains(slot);
    if (was_cold) {
        map.put(slot, true) catch |err| {
            Log.debug("Contract.mark_storage_slot_warm: map.put failed: {any}", .{err});
            return MarkStorageSlotWarmError.OutOfAllocatorMemory;
        };
    }
    return was_cold;
}

/// Check if storage slot is cold
pub fn is_storage_slot_cold(self: *const Contract, slot: u256) bool {
    if (self.storage_access) |map| {
        return !map.contains(slot);
    }
    return true;
}

/// Batch mark storage slots as warm
pub fn mark_storage_slots_warm(self: *Contract, allocator: std.mem.Allocator, slots: []const u256, pool: ?*StoragePool) ContractError!void {
    if (slots.len == 0) return;

    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = p.borrow_access_map() catch |err| {
                Log.debug("Failed to borrow access map from pool: {any}", .{err});
                return switch (err) {
                    StoragePool.BorrowAccessMapError.OutOfAllocatorMemory => StorageOperationError.OutOfAllocatorMemory,
                };
            };
        } else {
            self.storage_access = allocator.create(std.AutoHashMap(u256, bool)) catch |err| {
                Log.debug("Failed to create storage access map: {any}", .{err});
                return switch (err) {
                    std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
                };
            };
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(allocator);
        }
    }

    const map = self.storage_access.?;
    map.ensureTotalCapacity(@as(u32, @intCast(map.count() + slots.len))) catch |err| {
        Log.debug("Failed to ensure capacity for {d} storage slots: {any}", .{ slots.len, err });
        return switch (err) {
            std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
        };
    };

    for (slots) |slot| {
        map.putAssumeCapacity(slot, true);
    }
}

/// Store original storage value
pub fn set_original_storage_value(self: *Contract, allocator: std.mem.Allocator, slot: u256, value: u256, pool: ?*StoragePool) ContractError!void {
    if (self.original_storage == null) {
        if (pool) |p| {
            self.original_storage = p.borrow_storage_map() catch |err| {
                Log.debug("Failed to borrow storage map from pool: {any}", .{err});
                return switch (err) {
                    StoragePool.BorrowStorageMapError.OutOfAllocatorMemory => StorageOperationError.OutOfAllocatorMemory,
                };
            };
        } else {
            self.original_storage = allocator.create(std.AutoHashMap(u256, u256)) catch |err| {
                Log.debug("Failed to create original storage map: {any}", .{err});
                return switch (err) {
                    std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
                };
            };
            self.original_storage.?.* = std.AutoHashMap(u256, u256).init(allocator);
        }
    }

    self.original_storage.?.put(slot, value) catch |err| {
        Log.debug("Failed to store original storage value for slot {d}: {any}", .{ slot, err });
        return switch (err) {
            std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
        };
    };
}

/// Get original storage value
pub fn get_original_storage_value(self: *const Contract, slot: u256) ?u256 {
    if (self.original_storage) |map| {
        return map.get(slot);
    }
    return null;
}

/// Get opcode at position (inline for performance)
pub fn get_op(self: *const Contract, n: u64) u8 {
    return if (n < self.code_size) self.code[@intCast(n)] else constants.STOP;
}

/// Get opcode at position without bounds check
pub fn get_op_unchecked(self: *const Contract, n: u64) u8 {
    return self.code[n];
}

/// Set call code (for CALLCODE/DELEGATECALL)
pub fn set_call_code(self: *Contract, hash: [32]u8, code: []const u8) void {
    self.code = code;
    self.code_hash = hash;
    self.code_size = code.len;
    self.has_jumpdests = contains_jumpdest(code);
    self.is_empty = code.len == 0;
    self.analysis = null;
}

/// Clean up contract resources
pub fn deinit(self: *Contract, allocator: std.mem.Allocator, pool: ?*StoragePool) void {
    if (pool) |p| {
        if (self.storage_access) |map| {
            p.return_access_map(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            p.return_storage_map(map);
            self.original_storage = null;
        }
    } else {
        if (self.storage_access) |map| {
            map.deinit();
            allocator.destroy(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            map.deinit();
            allocator.destroy(map);
            self.original_storage = null;
        }
    }
    // Analysis is typically cached globally, so don't free
}

/// Analyzes bytecode and caches the results globally for reuse.
///
/// This function performs comprehensive static analysis on EVM bytecode:
/// 1. Identifies code vs data segments (for JUMPDEST validation)
/// 2. Extracts and sorts all JUMPDEST positions
/// 3. Detects special opcodes (CREATE, SELFDESTRUCT, dynamic jumps)
/// 4. Caches results by code hash for reuse
///
/// ## Parameters
/// - `allocator`: Memory allocator for analysis structures
/// - `code`: The bytecode to analyze
/// - `code_hash`: Hash for cache lookup/storage
///
/// ## Returns
/// Pointer to CodeAnalysis (cached or newly created)
///
/// ## Performance
/// - First analysis: O(n) where n is code length
/// - Subsequent calls: O(1) cache lookup
/// - Thread-safe with mutex protection
///
/// ## Caching Strategy
/// Analysis results are cached globally by code hash. This is highly
/// effective as the same contract code is often executed many times
/// across different addresses (e.g., proxy patterns, token contracts).
///
/// ## Example
/// ```zig
/// const analysis = try Contract.analyze_code(
///     allocator,
///     bytecode,
///     bytecode_hash,
/// );
/// // Analysis is now cached for future use
/// ```
pub fn analyze_code(allocator: std.mem.Allocator, code: []const u8, code_hash: [32]u8) CodeAnalysisError!*const CodeAnalysis {
    cache_mutex.lock();
    defer cache_mutex.unlock();

    if (analysis_cache == null) {
        analysis_cache = std.AutoHashMap([32]u8, *CodeAnalysis).init(allocator);
    }

    if (analysis_cache.?.get(code_hash)) |cached| {
        return cached;
    }

    const analysis = allocator.create(CodeAnalysis) catch |err| {
        Log.debug("Failed to allocate CodeAnalysis: {any}", .{err});
        return err;
    };

    analysis.code_segments = try bitvec.code_bitmap(allocator, code);

    var jumpdests = std.ArrayList(u32).init(allocator);
    defer jumpdests.deinit();

    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];

        if (op == constants.JUMPDEST and analysis.code_segments.is_set_unchecked(i)) {
            jumpdests.append(@as(u32, @intCast(i))) catch |err| {
                Log.debug("Failed to append jumpdest position {d}: {any}", .{ i, err });
                return err;
            };
        }

        if (constants.is_push(op)) {
            const push_size = constants.get_push_size(op);
            i += push_size + 1;
        } else {
            i += 1;
        }
    }

    // Sort for binary search
    std.mem.sort(u32, jumpdests.items, {}, comptime std.sort.asc(u32));
    analysis.jumpdest_positions = jumpdests.toOwnedSlice() catch |err| {
        Log.debug("Failed to convert jumpdests to owned slice: {any}", .{err});
        return err;
    };

    analysis.max_stack_depth = 0;
    analysis.block_gas_costs = null;
    analysis.has_dynamic_jumps = contains_op(code, &[_]u8{ constants.JUMP, constants.JUMPI });
    analysis.has_static_jumps = false;
    analysis.has_selfdestruct = contains_op(code, &[_]u8{constants.SELFDESTRUCT});
    analysis.has_create = contains_op(code, &[_]u8{ constants.CREATE, constants.CREATE2 });

    analysis_cache.?.put(code_hash, analysis) catch |err| {
        Log.debug("Failed to cache code analysis: {any}", .{err});
        // Continue without caching - return the analysis anyway
    };

    return analysis;
}

/// Check if code contains any of the given opcodes
pub fn contains_op(code: []const u8, opcodes: []const u8) bool {
    for (code) |op| {
        for (opcodes) |target| {
            if (op == target) return true;
        }
    }
    return false;
}

/// Clear the global analysis cache
pub fn clear_analysis_cache(allocator: std.mem.Allocator) void {
    cache_mutex.lock();
    defer cache_mutex.unlock();

    if (analysis_cache) |*cache| {
        var iter = cache.iterator();
        while (iter.next()) |entry| {
            entry.value_ptr.*.deinit(allocator);
            allocator.destroy(entry.value_ptr.*);
        }
        cache.deinit();
        analysis_cache = null;
    }
}

/// Analyze jump destinations - public wrapper for ensure_analysis
pub fn analyze_jumpdests(self: *Contract, allocator: std.mem.Allocator) void {
    self.ensure_analysis(allocator);
}

/// Create a contract to execute bytecode at a specific address
/// This is useful for testing or executing code that should be treated as if it's deployed at an address
/// The caller must separately call vm.state.set_code(address, bytecode) to deploy the code
pub fn init_at_address(
    caller: Address.Address,
    address: Address.Address,
    value: u256,
    gas: u64,
    bytecode: []const u8,
    input: []const u8,
    is_static: bool,
) Contract {
    // Calculate code hash for the bytecode
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    return Contract{
        .address = address,
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = bytecode,
        .code_hash = code_hash,
        .code_size = bytecode.len,
        .input = input,
        .is_static = is_static,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = true,
        .gas_refund = 0,
        .is_deployment = false,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(bytecode),
        .is_empty = bytecode.len == 0,
    };
}
````

````zig [src/evm/contract/code_analysis.zig]
const std = @import("std");
const bitvec = @import("bitvec.zig");

/// Advanced code analysis for EVM bytecode optimization.
///
/// This structure holds pre-computed analysis results for a contract's bytecode,
/// enabling efficient execution by pre-identifying jump destinations, code segments,
/// and other properties that would otherwise need to be computed at runtime.
///
/// The analysis is performed once when a contract is first loaded and cached for
/// subsequent executions, significantly improving performance for frequently-used
/// contracts.
///
/// ## Fields
/// - `code_segments`: Bit vector marking which bytes are executable code vs data
/// - `jumpdest_positions`: Sorted array of valid JUMPDEST positions for O(log n) validation
/// - `block_gas_costs`: Optional pre-computed gas costs for basic blocks
/// - `max_stack_depth`: Maximum stack depth required by the contract
/// - `has_dynamic_jumps`: Whether the code contains JUMP/JUMPI with dynamic targets
/// - `has_static_jumps`: Whether the code contains JUMP/JUMPI with static targets
/// - `has_selfdestruct`: Whether the code contains SELFDESTRUCT opcode
/// - `has_create`: Whether the code contains CREATE/CREATE2 opcodes
///
/// ## Performance
/// - Jump destination validation: O(log n) using binary search
/// - Code segment checking: O(1) using bit vector
/// - Enables dead code elimination and other optimizations
///
/// ## Memory Management
/// The analysis owns its allocated memory and must be properly cleaned up
/// using the `deinit` method to prevent memory leaks.
const CodeAnalysis = @This();

/// Bit vector marking which bytes in the bytecode are executable code vs data.
///
/// Each bit corresponds to a byte in the contract bytecode:
/// - 1 = executable code byte
/// - 0 = data byte (e.g., PUSH arguments)
///
/// This is critical for JUMPDEST validation since jump destinations
/// must point to actual code, not data bytes within PUSH instructions.
code_segments: bitvec,

/// Sorted array of all valid JUMPDEST positions in the bytecode.
///
/// Pre-sorted to enable O(log n) binary search validation of jump targets.
/// Only positions marked as code (not data) and containing the JUMPDEST
/// opcode (0x5B) are included.
jumpdest_positions: []const u32,

/// Optional pre-computed gas costs for each basic block.
///
/// When present, enables advanced gas optimization by pre-calculating
/// the gas cost of straight-line code sequences between jumps.
/// This is an optional optimization that may not be computed for all contracts.
block_gas_costs: ?[]const u32,

/// Maximum stack depth required by any execution path in the contract.
///
/// Pre-computed through static analysis to enable early detection of
/// stack overflow conditions. A value of 0 indicates the depth wasn't analyzed.
max_stack_depth: u16,

/// Indicates whether the contract contains JUMP/JUMPI opcodes with dynamic targets.
///
/// Dynamic jumps (where the target is computed at runtime) prevent certain
/// optimizations and require full jump destination validation at runtime.
has_dynamic_jumps: bool,

/// Indicates whether the contract contains JUMP/JUMPI opcodes with static targets.
///
/// Static jumps (where the target is a constant) can be pre-validated
/// and optimized during analysis.
has_static_jumps: bool,

/// Indicates whether the contract contains the SELFDESTRUCT opcode (0xFF).
///
/// Contracts with SELFDESTRUCT require special handling for state management
/// and cannot be marked as "pure" or side-effect free.
has_selfdestruct: bool,

/// Indicates whether the contract contains CREATE or CREATE2 opcodes.
///
/// Contracts that can deploy other contracts require additional
/// gas reservation and state management considerations.
has_create: bool,

/// Releases all memory allocated by this code analysis.
///
/// This method must be called when the analysis is no longer needed to prevent
/// memory leaks. It safely handles all owned resources including:
/// - The code segments bit vector
/// - The jumpdest positions array
/// - The optional block gas costs array
///
/// ## Parameters
/// - `self`: The analysis instance to clean up
/// - `allocator`: The same allocator used to create the analysis resources
///
/// ## Safety
/// After calling deinit, the analysis instance should not be used again.
/// All pointers to analysis data become invalid.
///
/// ## Example
/// ```zig
/// var analysis = try analyzeCode(allocator, bytecode);
/// defer analysis.deinit(allocator);
/// ```
pub fn deinit(self: *CodeAnalysis, allocator: std.mem.Allocator) void {
    self.code_segments.deinit(allocator);
    if (self.jumpdest_positions.len > 0) {
        allocator.free(self.jumpdest_positions);
    }
    if (self.block_gas_costs) |costs| {
        allocator.free(costs);
    }
}
````

````zig [src/evm/memory_size.zig]
/// Memory access requirements for EVM operations.
///
/// MemorySize encapsulates the memory region that an operation needs to access,
/// defined by an offset and size. This is used for:
/// - Calculating memory expansion costs
/// - Validating memory bounds
/// - Pre-allocating memory before operations
///
/// ## Memory Expansion
/// The EVM charges gas for memory expansion in 32-byte words. When an operation
/// accesses memory beyond the current size, the memory must expand to accommodate
/// it, incurring additional gas costs.
///
/// ## Gas Calculation
/// Memory expansion cost is quadratic:
/// - memory_cost = (memory_size_word ** 2) / 512 + (3 * memory_size_word)
/// - memory_size_word = (offset + size + 31) / 32
///
/// ## Zero-Size Edge Case
/// Operations with size=0 don't access memory and don't trigger expansion,
/// regardless of the offset value. This is important for operations like
/// RETURNDATACOPY with zero length.
///
/// Example:
/// ```zig
/// // MLOAD at offset 0x100 needs 32 bytes
/// const mem_size = MemorySize{ .offset = 0x100, .size = 32 };
///
/// // Calculate required memory size
/// const required = mem_size.offset + mem_size.size; // 0x120
/// ```
const MemorySize = @This();

/// Starting offset in memory where the operation begins.
/// This is typically popped from the stack.
offset: u64,

/// Number of bytes the operation needs to access.
/// A size of 0 means no memory access (and no expansion).
size: u64,
````

````zig [src/evm/wasm_stubs.zig]
// Comprehensive WASM compatibility stubs and utilities
const std = @import("std");
const builtin = @import("builtin");

// Thread stub for single-threaded WASM
pub const DummyMutex = struct {
    pub fn lock(self: *@This()) void { _ = self; }
    pub fn unlock(self: *@This()) void { _ = self; }
};

// Always use DummyMutex for maximum WASM compatibility
pub const Mutex = DummyMutex;

// Logging stub for WASM - completely no-op to avoid any I/O
pub fn log(
    comptime level: std.log.Level,
    comptime scope: @TypeOf(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    _ = level;
    _ = scope;
    _ = format;
    _ = args;
    // No-op in WASM
}

// Panic stub for WASM
pub fn panic(msg: []const u8, error_return_trace: ?*std.builtin.StackTrace, ret_addr: ?usize) noreturn {
    _ = msg;
    _ = error_return_trace;
    _ = ret_addr;
    unreachable;
}

// Check if we're building for WASM/freestanding
pub const is_wasm_target = builtin.target.cpu.arch == .wasm32 or
                          builtin.target.cpu.arch == .wasm64 or
                          builtin.target.os.tag == .freestanding;```
```zig [src/evm/precompiles/precompile_addresses.zig]
const Address = @import("Address").Address;

/// Precompile addresses as defined by the Ethereum specification
/// These addresses are reserved for built-in precompiled contracts

/// ECRECOVER precompile - signature recovery
pub const ECRECOVER_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01 };

/// SHA256 precompile - SHA-256 hash function
pub const SHA256_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };

/// RIPEMD160 precompile - RIPEMD-160 hash function
pub const RIPEMD160_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x03 };

/// IDENTITY precompile - returns input data unchanged
pub const IDENTITY_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x04 };

/// MODEXP precompile - modular exponentiation
pub const MODEXP_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x05 };

/// ECADD precompile - elliptic curve addition on alt_bn128
pub const ECADD_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x06 };

/// ECMUL precompile - elliptic curve scalar multiplication on alt_bn128
pub const ECMUL_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x07 };

/// ECPAIRING precompile - elliptic curve pairing check on alt_bn128
pub const ECPAIRING_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x08 };

/// BLAKE2F precompile - BLAKE2b F compression function
pub const BLAKE2F_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x09 };

/// POINT_EVALUATION precompile - KZG point evaluation (EIP-4844)
pub const POINT_EVALUATION_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x0A };

/// Checks if the given address is a precompile address
/// @param address The address to check
/// @return true if the address is a known precompile, false otherwise
pub fn is_precompile(address: Address) bool {
    // Check if the first 19 bytes are zero
    for (address[0..19]) |byte| {
        if (byte != 0) {
            @branchHint(.cold);
            return false;
        }
    }

    // Check if the last byte is in the precompile range (1-10)
    const last_byte = address[19];
    return last_byte >= 1 and last_byte <= 10;
}

/// Gets the precompile ID from an address
/// @param address The precompile address
/// @return The precompile ID (1-10) or 0 if not a precompile
pub fn get_precompile_id(address: Address) u8 {
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return 0;
    }
    return address[19];
}```
```zig [src/evm/precompiles/precompiles.zig]
const std = @import("std");
const Address = @import("Address").Address;
const addresses = @import("precompile_addresses.zig");
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const identity = @import("identity.zig");
const ChainRules = @import("../hardforks/chain_rules.zig");

/// Main precompile dispatcher module
///
/// This module provides the main interface for precompile execution. It handles:
/// - Address-based precompile detection and routing
/// - Hardfork-based availability checks
/// - Unified execution interface for all precompiles
/// - Error handling and result management
///
/// The dispatcher is designed to be easily extensible for future precompiles.
/// Adding a new precompile requires:
/// 1. Adding the address constant to precompile_addresses.zig
/// 2. Implementing the precompile logic in its own module
/// 3. Adding the dispatch case to execute_precompile()
/// 4. Adding availability check to is_available()

/// Checks if the given address is a precompile address
///
/// This function determines whether a given address corresponds to a known precompile.
/// It serves as the entry point for precompile detection during contract calls.
///
/// @param address The address to check
/// @return true if the address is a known precompile, false otherwise
pub fn is_precompile(address: Address) bool {
    return addresses.is_precompile(address);
}

/// Checks if a precompile is available in the given chain rules
///
/// Different precompiles were introduced in different hardforks. This function
/// ensures that precompiles are only available when they should be according
/// to the Ethereum specification.
///
/// @param address The precompile address to check
/// @param chain_rules The current chain rules configuration
/// @return true if the precompile is available with these chain rules
pub fn is_available(address: Address, chain_rules: ChainRules) bool {
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return false;
    }

    const precompile_id = addresses.get_precompile_id(address);

    return switch (precompile_id) {
        1, 2, 3, 4 => true, // ECRECOVER, SHA256, RIPEMD160, IDENTITY available from Frontier
        5 => chain_rules.IsByzantium, // MODEXP from Byzantium
        6, 7, 8 => chain_rules.IsByzantium, // ECADD, ECMUL, ECPAIRING from Byzantium
        9 => chain_rules.IsIstanbul, // BLAKE2F from Istanbul
        10 => chain_rules.IsCancun, // POINT_EVALUATION from Cancun
        else => false,
    };
}

/// Executes a precompile with the given parameters
///
/// This is the main execution function that routes precompile calls to their
/// specific implementations. It handles:
/// - Precompile address validation
/// - Hardfork availability checks
/// - Routing to specific precompile implementations
/// - Consistent error handling
///
/// @param address The precompile address being called
/// @param input Input data for the precompile
/// @param output Output buffer to write results (must be large enough)
/// @param gas_limit Maximum gas available for execution
/// @param chain_rules Current chain rules for availability checking
/// @return PrecompileOutput containing success/failure and gas usage
pub fn execute_precompile(
    address: Address,
    input: []const u8,
    output: []u8,
    gas_limit: u64,
    chain_rules: ChainRules
) PrecompileOutput {
    // Check if this is a valid precompile address
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }

    // Check if this precompile is available with the current chain rules
    if (!is_available(address, chain_rules)) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }

    const precompile_id = addresses.get_precompile_id(address);

    // Route to specific precompile implementation
    return switch (precompile_id) {
        4 => {
            @branchHint(.likely);
            return identity.execute(input, output, gas_limit);
        }, // IDENTITY

        // Placeholder implementations for future precompiles
        1 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // ECRECOVER - TODO
        2 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // SHA256 - TODO
        3 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // RIPEMD160 - TODO
        5 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // MODEXP - TODO
        6 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // ECADD - TODO
        7 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // ECMUL - TODO
        8 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // ECPAIRING - TODO
        9 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // BLAKE2F - TODO
        10 => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        }, // POINT_EVALUATION - TODO

        else => {
            @branchHint(.cold);
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        },
    };
}

/// Estimates the gas cost for a precompile call
///
/// This function calculates the gas cost for a precompile call without actually
/// executing it. Useful for gas estimation and transaction validation.
///
/// @param address The precompile address
/// @param input_size Size of the input data
/// @param chain_rules Current chain rules
/// @return Estimated gas cost or error if not available
pub fn estimate_gas(address: Address, input_size: usize, chain_rules: ChainRules) !u64 {
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return error.InvalidPrecompile;
    }

    if (!is_available(address, chain_rules)) {
        @branchHint(.cold);
        return error.PrecompileNotAvailable;
    }

    const precompile_id = addresses.get_precompile_id(address);

    return switch (precompile_id) {
        4 => identity.calculate_gas_checked(input_size), // IDENTITY

        // Placeholder gas calculations for future precompiles
        1 => error.NotImplemented, // ECRECOVER - TODO
        2 => error.NotImplemented, // SHA256 - TODO
        3 => error.NotImplemented, // RIPEMD160 - TODO
        5 => error.NotImplemented, // MODEXP - TODO
        6 => error.NotImplemented, // ECADD - TODO
        7 => error.NotImplemented, // ECMUL - TODO
        8 => error.NotImplemented, // ECPAIRING - TODO
        9 => error.NotImplemented, // BLAKE2F - TODO
        10 => error.NotImplemented, // POINT_EVALUATION - TODO

        else => error.InvalidPrecompile,
    };
}

/// Gets the expected output size for a precompile call
///
/// Some precompiles have fixed output sizes, while others depend on the input.
/// This function provides a way to determine the required output buffer size.
///
/// @param address The precompile address
/// @param input_size Size of the input data
/// @param chain_rules Current chain rules
/// @return Expected output size or error if not available
pub fn get_output_size(address: Address, input_size: usize, chain_rules: ChainRules) !usize {
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return error.InvalidPrecompile;
    }

    if (!is_available(address, chain_rules)) {
        @branchHint(.cold);
        return error.PrecompileNotAvailable;
    }

    const precompile_id = addresses.get_precompile_id(address);

    return switch (precompile_id) {
        4 => identity.get_output_size(input_size), // IDENTITY

        // Placeholder output sizes for future precompiles
        1 => 32, // ECRECOVER - fixed 32 bytes (address)
        2 => 32, // SHA256 - fixed 32 bytes (hash)
        3 => 32, // RIPEMD160 - fixed 32 bytes (hash, padded)
        5 => error.NotImplemented, // MODEXP - variable size, TODO
        6 => 64, // ECADD - fixed 64 bytes (point)
        7 => 64, // ECMUL - fixed 64 bytes (point)
        8 => 32, // ECPAIRING - fixed 32 bytes (boolean result)
        9 => 64, // BLAKE2F - fixed 64 bytes (state)
        10 => 64, // POINT_EVALUATION - fixed 64 bytes (proof result)

        else => error.InvalidPrecompile,
    };
}

/// Validates that a precompile call would succeed
///
/// This function performs all validation checks without executing the precompile.
/// Useful for transaction validation and gas estimation.
///
/// @param address The precompile address
/// @param input_size Size of the input data
/// @param gas_limit Available gas limit
/// @param chain_rules Current chain rules
/// @return true if the call would succeed
pub fn validate_call(address: Address, input_size: usize, gas_limit: u64, chain_rules: ChainRules) bool {
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return false;
    }
    if (!is_available(address, chain_rules)) {
        @branchHint(.cold);
        return false;
    }

    const gas_cost = estimate_gas(address, input_size, chain_rules) catch {
        @branchHint(.cold);
        return false;
    };
    return gas_cost <= gas_limit;
}```
```zig [src/evm/precompiles/precompile_result.zig]
const std = @import("std");

/// PrecompileError represents error conditions that can occur during precompile execution
///
/// Precompiles have different error conditions from regular EVM execution:
/// - OutOfGas: Gas limit exceeded during execution
/// - InvalidInput: Input data is malformed or invalid for the precompile
/// - ExecutionFailed: The precompile operation itself failed
pub const PrecompileError = error{
    /// Insufficient gas provided to complete the precompile operation
    /// This occurs when the calculated gas cost exceeds the provided gas limit
    OutOfGas,

    /// Input data is invalid for the specific precompile
    /// Each precompile has its own input validation requirements
    InvalidInput,

    /// The precompile operation failed during execution
    /// This covers cryptographic failures, computation errors, etc.
    ExecutionFailed,

    /// Memory allocation failed during precompile execution
    /// Not a normal precompile error - indicates system resource exhaustion
    OutOfMemory,
};

/// PrecompileResult represents the successful result of a precompile execution
///
/// Contains the gas consumed and the output data produced by the precompile.
/// Output data is owned by the caller and must be managed appropriately.
pub const PrecompileResult = struct {
    /// Amount of gas consumed by the precompile execution
    gas_used: u64,

    /// Length of the output data produced
    /// The actual output data is written to the provided output buffer
    output_size: usize,
};

/// PrecompileOutput represents the complete result of precompile execution
///
/// This is a union type that represents either success or failure of precompile execution.
/// Success contains gas usage and output size, while failure contains the specific error.
pub const PrecompileOutput = union(enum) {
    /// Successful execution with gas usage and output
    success: PrecompileResult,

    /// Failed execution with specific error
    failure: PrecompileError,

    /// Creates a successful result
    /// @param gas_used The amount of gas consumed
    /// @param output_size The size of the output data
    /// @return A successful PrecompileOutput
    pub fn success_result(gas_used: u64, output_size: usize) PrecompileOutput {
        return PrecompileOutput{
            .success = PrecompileResult{
                .gas_used = gas_used,
                .output_size = output_size
            }
        };
    }

    /// Creates a failure result
    /// @param err The error that occurred
    /// @return A failed PrecompileOutput
    pub fn failure_result(err: PrecompileError) PrecompileOutput {
        return PrecompileOutput{ .failure = err };
    }

    /// Checks if the result represents success
    /// @return true if successful, false if failed
    pub fn is_success(self: PrecompileOutput) bool {
        return switch (self) {
            .success => true,
            .failure => false,
        };
    }

    /// Checks if the result represents failure
    /// @return true if failed, false if successful
    pub fn is_failure(self: PrecompileOutput) bool {
        return !self.is_success();
    }

    /// Gets the gas used from a successful result
    /// @return The gas used, or 0 if the result is a failure
    pub fn get_gas_used(self: PrecompileOutput) u64 {
        return switch (self) {
            .success => |result| {
                @branchHint(.likely);
                return result.gas_used;
            },
            .failure => {
                @branchHint(.cold);
                return 0;
            },
        };
    }

    /// Gets the output size from a successful result
    /// @return The output size, or 0 if the result is a failure
    pub fn get_output_size(self: PrecompileOutput) usize {
        return switch (self) {
            .success => |result| {
                @branchHint(.likely);
                return result.output_size;
            },
            .failure => {
                @branchHint(.cold);
                return 0;
            },
        };
    }

    /// Gets the error from a failed result
    /// @return The error, or null if the result is successful
    pub fn get_error(self: PrecompileOutput) ?PrecompileError {
        return switch (self) {
            .success => {
                @branchHint(.likely);
                return null;
            },
            .failure => |err| {
                @branchHint(.cold);
                return err;
            },
        };
    }
};

/// Get a human-readable description for a precompile error
///
/// Provides detailed descriptions of what each error means and when it occurs.
/// Useful for debugging, logging, and error reporting.
///
/// @param err The precompile error to describe
/// @return A string slice containing a human-readable description of the error
pub fn get_error_description(err: PrecompileError) []const u8 {
    return switch (err) {
        PrecompileError.OutOfGas => "Precompile execution ran out of gas",
        PrecompileError.InvalidInput => "Invalid input data for precompile",
        PrecompileError.ExecutionFailed => "Precompile execution failed",
        PrecompileError.OutOfMemory => "Out of memory during precompile execution",
    };
}```
```zig [src/evm/precompiles/precompile_gas.zig]
const std = @import("std");

/// Gas calculation utilities for precompiles
///
/// This module provides common gas calculation patterns used by precompiles.
/// Many precompiles use linear gas costs (base + per_word * word_count) or other
/// standard patterns defined here.

/// Calculates linear gas cost: base_cost + per_word_cost * ceil(input_size / 32)
///
/// This is the most common gas calculation pattern for precompiles. The cost consists
/// of a base cost plus a per-word cost for each 32-byte word of input data.
/// Partial words are rounded up to full words.
///
/// @param input_size Size of the input data in bytes
/// @param base_cost Base gas cost regardless of input size
/// @param per_word_cost Gas cost per 32-byte word of input
/// @return Total gas cost for the operation
pub fn calculate_linear_cost(input_size: usize, base_cost: u64, per_word_cost: u64) u64 {
    const word_count = (input_size + 31) / 32;
    return base_cost + per_word_cost * @as(u64, @intCast(word_count));
}

/// Calculates linear gas cost with checked arithmetic to prevent overflow
///
/// Same as calculate_linear_cost but returns an error if the calculation would overflow.
/// This is important for very large input sizes that could cause integer overflow.
///
/// @param input_size Size of the input data in bytes
/// @param base_cost Base gas cost regardless of input size
/// @param per_word_cost Gas cost per 32-byte word of input
/// @return Total gas cost or error if overflow occurs
pub fn calculate_linear_cost_checked(input_size: usize, base_cost: u64, per_word_cost: u64) !u64 {
    const word_count = (input_size + 31) / 32;
    const word_count_u64 = std.math.cast(u64, word_count) orelse {
        @branchHint(.cold);
        return error.Overflow;
    };

    const word_cost = std.math.mul(u64, per_word_cost, word_count_u64) catch {
        @branchHint(.cold);
        return error.Overflow;
    };
    const total_cost = std.math.add(u64, base_cost, word_cost) catch {
        @branchHint(.cold);
        return error.Overflow;
    };

    return total_cost;
}

/// Validates that the gas limit is sufficient for the calculated cost
///
/// This is a convenience function that combines gas calculation with validation.
/// It calculates the required gas and checks if the provided limit is sufficient.
///
/// @param input_size Size of the input data in bytes
/// @param base_cost Base gas cost regardless of input size
/// @param per_word_cost Gas cost per 32-byte word of input
/// @param gas_limit Maximum gas available for the operation
/// @return The calculated gas cost if within limit, error otherwise
pub fn validate_gas_limit(input_size: usize, base_cost: u64, per_word_cost: u64, gas_limit: u64) !u64 {
    const gas_cost = try calculate_linear_cost_checked(input_size, base_cost, per_word_cost);

    if (gas_cost > gas_limit) {
        @branchHint(.cold);
        return error.OutOfGas;
    }

    return gas_cost;
}

/// Calculates the number of 32-byte words for a given byte size
///
/// This is a utility function for converting byte sizes to word counts.
/// Used when precompiles need to know the exact word count for other calculations.
///
/// @param byte_size Size in bytes
/// @return Number of 32-byte words (rounded up)
pub fn bytes_to_words(byte_size: usize) usize {
    return (byte_size + 31) / 32;
}

/// Calculates gas cost for dynamic-length operations
///
/// Some precompiles have more complex gas calculations that depend on the
/// content of the input data, not just its size. This provides a framework
/// for such calculations.
///
/// @param input_data The input data to analyze
/// @param base_cost Base gas cost
/// @param calculate_dynamic_cost Function to calculate additional cost based on input
/// @return Total gas cost
pub fn calculate_dynamic_cost(
    input_data: []const u8,
    base_cost: u64,
    calculate_dynamic_cost_fn: fn([]const u8) u64
) u64 {
    const dynamic_cost = calculate_dynamic_cost_fn(input_data);
    return base_cost + dynamic_cost;
}```
```zig [src/evm/precompiles/identity.zig]
const std = @import("std");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const gas_utils = @import("precompile_gas.zig");

/// IDENTITY precompile implementation (address 0x04)
///
/// The IDENTITY precompile is the simplest of all precompiles. It returns the input
/// data unchanged (identity function). Despite its simplicity, it serves important
/// purposes:
///
/// 1. **Data copying**: Efficiently copy data between different memory contexts
/// 2. **Gas measurement**: Provides predictable gas costs for data operations
/// 3. **Testing**: Simple precompile for testing the precompile infrastructure
/// 4. **Specification compliance**: Required by Ethereum specification
///
/// ## Gas Cost
///
/// The gas cost follows the standard linear formula:
/// - Base cost: 15 gas
/// - Per-word cost: 3 gas per 32-byte word (rounded up)
/// - Total: 15 + 3 * ceil(input_size / 32)
///
/// ## Examples
///
/// ```zig
/// // Empty input: 15 gas, empty output
/// const result1 = execute(&[_]u8{}, &output, 100);
///
/// // 32 bytes input: 15 + 3 = 18 gas, same output as input
/// const result2 = execute(&[_]u8{1, 2, 3, ...}, &output, 100);
///
/// // 33 bytes input: 15 + 3*2 = 21 gas (2 words), same output as input
/// const result3 = execute(&[_]u8{1, 2, 3, ..., 33}, &output, 100);
/// ```

/// Gas constants for IDENTITY precompile
/// These values are defined in the Ethereum specification and must match exactly
pub const IDENTITY_BASE_COST: u64 = 15;
pub const IDENTITY_WORD_COST: u64 = 3;

/// Calculates the gas cost for IDENTITY precompile execution
///
/// Uses the standard linear gas calculation: base + word_cost * word_count
/// Where word_count = ceil(input_size / 32)
///
/// @param input_size Size of the input data in bytes
/// @return Gas cost for processing the given input size
pub fn calculate_gas(input_size: usize) u64 {
    return gas_utils.calculate_linear_cost(input_size, IDENTITY_BASE_COST, IDENTITY_WORD_COST);
}

/// Calculates the gas cost with overflow protection
///
/// Same as calculate_gas but returns an error if the calculation would overflow.
/// Important for very large input sizes in adversarial scenarios.
///
/// @param input_size Size of the input data in bytes
/// @return Gas cost or error if calculation overflows
pub fn calculate_gas_checked(input_size: usize) !u64 {
    return gas_utils.calculate_linear_cost_checked(input_size, IDENTITY_BASE_COST, IDENTITY_WORD_COST);
}

/// Executes the IDENTITY precompile
///
/// This is the main entry point for IDENTITY precompile execution. It performs
/// the following steps:
///
/// 1. Calculate the required gas cost
/// 2. Validate that the gas limit is sufficient
/// 3. Copy input data to output buffer
/// 4. Return success result with gas used and output size
///
/// The function assumes that the output buffer is large enough to hold the input data.
/// This is the caller's responsibility to ensure.
///
/// @param input Input data to be copied (identity operation)
/// @param output Output buffer to write the result (must be >= input.len)
/// @param gas_limit Maximum gas available for this operation
/// @return PrecompileOutput containing success/failure and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileOutput {
    // Calculate gas cost for this input size
    const gas_cost = calculate_gas_checked(input.len) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    };

    // Check if we have enough gas
    if (gas_cost > gas_limit) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }

    // Validate output buffer size
    if (output.len < input.len) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }

    // Identity operation: copy input to output
    // This is the core functionality - simply copy the input unchanged
    if (input.len > 0) {
        @branchHint(.likely);
        @memcpy(output[0..input.len], input);
    }

    return PrecompileOutput.success_result(gas_cost, input.len);
}

/// Validates the gas requirement without executing
///
/// This function can be used to check if a call would succeed without actually
/// performing the operation. Useful for gas estimation and validation.
///
/// @param input_size Size of the input data
/// @param gas_limit Available gas limit
/// @return true if the operation would succeed, false if out of gas
pub fn validate_gas_requirement(input_size: usize, gas_limit: u64) bool {
    const gas_cost = calculate_gas_checked(input_size) catch {
        @branchHint(.cold);
        return false;
    };
    return gas_cost <= gas_limit;
}

/// Gets the expected output size for given input
///
/// For IDENTITY, the output size is always equal to the input size.
/// This function is provided for consistency with other precompiles.
///
/// @param input_size Size of the input data
/// @return Expected output size (same as input for IDENTITY)
pub fn get_output_size(input_size: usize) usize {
    return input_size;
}```
```zig [src/evm/constants/memory_limits.zig]
const std = @import("std");

/// EVM Memory Limit Constants
///
/// The EVM doesn't have a hard memory limit in the specification, but practical
/// limits exist due to gas costs. Memory expansion has quadratic gas costs that
/// make extremely large allocations prohibitively expensive.
///
/// Most production EVMs implement practical memory limits to prevent DoS attacks
/// and ensure predictable resource usage.

/// Maximum memory size in bytes (32 MB)
/// This is a reasonable limit that matches many production EVM implementations.
/// At 32 MB, the gas cost would be approximately:
/// - Words: 1,048,576 (32 MB / 32 bytes)
/// - Linear cost: 3 * 1,048,576 = 3,145,728 gas
/// - Quadratic cost: (1,048,576^2) / 512 = 2,147,483,648 gas
/// - Total: ~2.15 billion gas (far exceeding any reasonable block gas limit)
pub const MAX_MEMORY_SIZE: u64 = 32 * 1024 * 1024; // 32 MB

/// Alternative reasonable limits used by other implementations:
/// - 16 MB: More conservative limit
pub const CONSERVATIVE_MEMORY_LIMIT: u64 = 16 * 1024 * 1024;

/// - 64 MB: More permissive limit
pub const PERMISSIVE_MEMORY_LIMIT: u64 = 64 * 1024 * 1024;

/// Calculate the gas cost for a given memory size
pub fn calculate_memory_gas_cost(size_bytes: u64) u64 {
    const words = (size_bytes + 31) / 32;
    const linear_cost = 3 * words;
    const quadratic_cost = (words * words) / 512;
    return linear_cost + quadratic_cost;
}

/// Check if a memory size would exceed reasonable gas limits
pub fn is_memory_size_reasonable(size_bytes: u64, available_gas: u64) bool {
    const gas_cost = calculate_memory_gas_cost(size_bytes);
    return gas_cost <= available_gas;
}

test "memory gas costs" {
    const testing = std.testing;

    // Test small allocations
    try testing.expectEqual(@as(u64, 3), calculate_memory_gas_cost(32)); // 1 word
    try testing.expectEqual(@as(u64, 6), calculate_memory_gas_cost(64)); // 2 words

    // Test 1 KB
    const kb_cost = calculate_memory_gas_cost(1024);
    try testing.expect(kb_cost > 96); // Should be more than linear cost alone

    // Test 1 MB - should be very expensive
    const mb_cost = calculate_memory_gas_cost(1024 * 1024);
    try testing.expect(mb_cost > 1_000_000); // Over 1 million gas

    // Test 32 MB - should be prohibitively expensive
    const limit_cost = calculate_memory_gas_cost(MAX_MEMORY_SIZE);
    try testing.expect(limit_cost > 2_000_000_000); // Over 2 billion gas
}

test "reasonable memory sizes" {
    const testing = std.testing;

    // With 10 million gas (reasonable for a transaction)
    const available_gas: u64 = 10_000_000;

    // Small sizes should be reasonable
    try testing.expect(is_memory_size_reasonable(1024, available_gas)); // 1 KB
    try testing.expect(is_memory_size_reasonable(10 * 1024, available_gas)); // 10 KB

    // Large sizes should not be reasonable
    try testing.expect(!is_memory_size_reasonable(10 * 1024 * 1024, available_gas)); // 10 MB
    try testing.expect(!is_memory_size_reasonable(MAX_MEMORY_SIZE, available_gas)); // 32 MB
}
````

````zig [src/evm/constants/constants.zig]
//! EVM opcode constants and bytecode analysis utilities.
//!
//! This module serves as the central definition point for all EVM opcodes
//! and provides utility functions for bytecode analysis. All opcodes are
//! defined as comptime constants for zero-cost abstraction and compile-time
//! verification.
//!
//! ## Organization
//! Opcodes are grouped by their functional categories:
//! - Arithmetic operations (0x00-0x0B)
//! - Comparison & bitwise logic (0x10-0x1D)
//! - Keccak hashing (0x20)
//! - Environmental information (0x30-0x3F)
//! - Block information (0x40-0x4A)
//! - Stack, memory, storage operations (0x50-0x5F)
//! - Push operations (0x60-0x7F)
//! - Duplication operations (0x80-0x8F)
//! - Exchange operations (0x90-0x9F)
//! - Logging operations (0xA0-0xA4)
//! - System operations (0xF0-0xFF)
//!
//! ## Usage
//! ```zig
//! const opcode = bytecode[pc];
//! if (constants.is_push(opcode)) {
//!     const push_size = constants.get_push_size(opcode);
//!     // Skip over the push data
//!     pc += 1 + push_size;
//! }
//! ```
//!
//! ## Hardfork Considerations
//! Some opcodes are only available after specific hardforks:
//! - PUSH0 (0x5F): Shanghai
//! - TLOAD/TSTORE (0x5C/0x5D): Cancun
//! - MCOPY (0x5E): Cancun
//! - BASEFEE (0x48): London
//! - CHAINID (0x46): Istanbul
//!
//! Reference: https://www.evm.codes/

// ============================================================================
// Arithmetic Operations (0x00-0x0B)
// ============================================================================

/// Halts execution of the current context.
/// Stack: [] -> []
/// Gas: 0
pub const STOP: u8 = 0x00;

/// Addition operation with modulo 2^256.
/// Stack: [a, b] -> [a + b]
/// Gas: 3
pub const ADD: u8 = 0x01;
/// Multiplication operation with modulo 2^256.
/// Stack: [a, b] -> [a * b]
/// Gas: 5
pub const MUL: u8 = 0x02;

/// Subtraction operation with modulo 2^256.
/// Stack: [a, b] -> [a - b]
/// Gas: 3
pub const SUB: u8 = 0x03;

/// Integer division operation.
/// Stack: [a, b] -> [a / b] (0 if b == 0)
/// Gas: 5
pub const DIV: u8 = 0x04;
pub const SDIV: u8 = 0x05;
pub const MOD: u8 = 0x06;
pub const SMOD: u8 = 0x07;
pub const ADDMOD: u8 = 0x08;
pub const MULMOD: u8 = 0x09;
/// Exponential operation (a ** b).
/// Stack: [a, b] -> [a ** b]
/// Gas: 10 + 50 per byte in exponent
/// Note: Gas cost increases with size of exponent
pub const EXP: u8 = 0x0A;

/// Sign extension operation.
/// Stack: [b, x] -> [y] where y is sign-extended x from (b+1)*8 bits
/// Gas: 5
pub const SIGNEXTEND: u8 = 0x0B;

// ============================================================================
// Comparison & Bitwise Logic Operations (0x10-0x1D)
// ============================================================================
pub const LT: u8 = 0x10;
pub const GT: u8 = 0x11;
pub const SLT: u8 = 0x12;
pub const SGT: u8 = 0x13;
pub const EQ: u8 = 0x14;
pub const ISZERO: u8 = 0x15;
pub const AND: u8 = 0x16;
pub const OR: u8 = 0x17;
pub const XOR: u8 = 0x18;
pub const NOT: u8 = 0x19;
pub const BYTE: u8 = 0x1A;
pub const SHL: u8 = 0x1B;
pub const SHR: u8 = 0x1C;
pub const SAR: u8 = 0x1D;

// ============================================================================
// Cryptographic Operations (0x20)
// ============================================================================

/// Computes Keccak-256 hash of memory region.
/// Stack: [offset, size] -> [hash]
/// Gas: 30 + 6 per word + memory expansion
pub const KECCAK256: u8 = 0x20;

// ============================================================================
// Environmental Information (0x30-0x3F)
// ============================================================================
pub const ADDRESS: u8 = 0x30;
pub const BALANCE: u8 = 0x31;
pub const ORIGIN: u8 = 0x32;
pub const CALLER: u8 = 0x33;
pub const CALLVALUE: u8 = 0x34;
pub const CALLDATALOAD: u8 = 0x35;
pub const CALLDATASIZE: u8 = 0x36;
pub const CALLDATACOPY: u8 = 0x37;
pub const CODESIZE: u8 = 0x38;
pub const CODECOPY: u8 = 0x39;
pub const GASPRICE: u8 = 0x3A;
pub const EXTCODESIZE: u8 = 0x3B;
pub const EXTCODECOPY: u8 = 0x3C;
pub const RETURNDATASIZE: u8 = 0x3D;
pub const RETURNDATACOPY: u8 = 0x3E;
pub const EXTCODEHASH: u8 = 0x3F;

// ============================================================================
// Block Information (0x40-0x4A)
// ============================================================================
pub const BLOCKHASH: u8 = 0x40;
pub const COINBASE: u8 = 0x41;
pub const TIMESTAMP: u8 = 0x42;
pub const NUMBER: u8 = 0x43;
pub const PREVRANDAO: u8 = 0x44;
pub const GASLIMIT: u8 = 0x45;
pub const CHAINID: u8 = 0x46;
pub const SELFBALANCE: u8 = 0x47;
pub const BASEFEE: u8 = 0x48;
pub const BLOBHASH: u8 = 0x49;
pub const BLOBBASEFEE: u8 = 0x4A;

// ============================================================================
// Stack, Memory, Storage and Flow Operations (0x50-0x5F)
// ============================================================================
pub const POP: u8 = 0x50;
pub const MLOAD: u8 = 0x51;
pub const MSTORE: u8 = 0x52;
pub const MSTORE8: u8 = 0x53;
/// Load value from storage.
/// Stack: [key] -> [value]
/// Gas: 100 (warm) or 2100 (cold) since Berlin
pub const SLOAD: u8 = 0x54;

/// Store value to storage.
/// Stack: [key, value] -> []
/// Gas: Complex - depends on current value and new value
/// Note: Most expensive operation, can cost 20000 gas
pub const SSTORE: u8 = 0x55;
pub const JUMP: u8 = 0x56;
pub const JUMPI: u8 = 0x57;
pub const PC: u8 = 0x58;
pub const MSIZE: u8 = 0x59;
pub const GAS: u8 = 0x5A;
/// Valid jump destination marker.
/// Stack: [] -> []
/// Gas: 1
/// Note: Only opcode that can be jumped to
pub const JUMPDEST: u8 = 0x5B;
pub const TLOAD: u8 = 0x5C;
pub const TSTORE: u8 = 0x5D;
pub const MCOPY: u8 = 0x5E;
/// Push zero onto the stack (Shanghai hardfork).
/// Stack: [] -> [0]
/// Gas: 2
/// Note: More efficient than PUSH1 0x00
pub const PUSH0: u8 = 0x5F;

// ============================================================================
// Push Operations (0x60-0x7F)
// ============================================================================
pub const PUSH1: u8 = 0x60;
pub const PUSH2: u8 = 0x61;
pub const PUSH3: u8 = 0x62;
pub const PUSH4: u8 = 0x63;
pub const PUSH5: u8 = 0x64;
pub const PUSH6: u8 = 0x65;
pub const PUSH7: u8 = 0x66;
pub const PUSH8: u8 = 0x67;
pub const PUSH9: u8 = 0x68;
pub const PUSH10: u8 = 0x69;
pub const PUSH11: u8 = 0x6A;
pub const PUSH12: u8 = 0x6B;
pub const PUSH13: u8 = 0x6C;
pub const PUSH14: u8 = 0x6D;
pub const PUSH15: u8 = 0x6E;
pub const PUSH16: u8 = 0x6F;
pub const PUSH17: u8 = 0x70;
pub const PUSH18: u8 = 0x71;
pub const PUSH19: u8 = 0x72;
pub const PUSH20: u8 = 0x73;
pub const PUSH21: u8 = 0x74;
pub const PUSH22: u8 = 0x75;
pub const PUSH23: u8 = 0x76;
pub const PUSH24: u8 = 0x77;
pub const PUSH25: u8 = 0x78;
pub const PUSH26: u8 = 0x79;
pub const PUSH27: u8 = 0x7A;
pub const PUSH28: u8 = 0x7B;
pub const PUSH29: u8 = 0x7C;
pub const PUSH30: u8 = 0x7D;
pub const PUSH31: u8 = 0x7E;
pub const PUSH32: u8 = 0x7F;

// ============================================================================
// Duplication Operations (0x80-0x8F)
// ============================================================================
pub const DUP1: u8 = 0x80;
pub const DUP2: u8 = 0x81;
pub const DUP3: u8 = 0x82;
pub const DUP4: u8 = 0x83;
pub const DUP5: u8 = 0x84;
pub const DUP6: u8 = 0x85;
pub const DUP7: u8 = 0x86;
pub const DUP8: u8 = 0x87;
pub const DUP9: u8 = 0x88;
pub const DUP10: u8 = 0x89;
pub const DUP11: u8 = 0x8A;
pub const DUP12: u8 = 0x8B;
pub const DUP13: u8 = 0x8C;
pub const DUP14: u8 = 0x8D;
pub const DUP15: u8 = 0x8E;
pub const DUP16: u8 = 0x8F;

// ============================================================================
// Exchange Operations (0x90-0x9F)
// ============================================================================
pub const SWAP1: u8 = 0x90;
pub const SWAP2: u8 = 0x91;
pub const SWAP3: u8 = 0x92;
pub const SWAP4: u8 = 0x93;
pub const SWAP5: u8 = 0x94;
pub const SWAP6: u8 = 0x95;
pub const SWAP7: u8 = 0x96;
pub const SWAP8: u8 = 0x97;
pub const SWAP9: u8 = 0x98;
pub const SWAP10: u8 = 0x99;
pub const SWAP11: u8 = 0x9A;
pub const SWAP12: u8 = 0x9B;
pub const SWAP13: u8 = 0x9C;
pub const SWAP14: u8 = 0x9D;
pub const SWAP15: u8 = 0x9E;
pub const SWAP16: u8 = 0x9F;

// ============================================================================
// Logging Operations (0xA0-0xA4)
// ============================================================================
pub const LOG0: u8 = 0xA0;
pub const LOG1: u8 = 0xA1;
pub const LOG2: u8 = 0xA2;
pub const LOG3: u8 = 0xA3;
pub const LOG4: u8 = 0xA4;

// ============================================================================
// System Operations (0xF0-0xFF)
// ============================================================================
pub const CREATE: u8 = 0xF0;
pub const CALL: u8 = 0xF1;
pub const CALLCODE: u8 = 0xF2;
pub const RETURN: u8 = 0xF3;
pub const DELEGATECALL: u8 = 0xF4;
pub const CREATE2: u8 = 0xF5;
pub const RETURNDATALOAD: u8 = 0xF7;
pub const EXTCALL: u8 = 0xF8;
pub const EXTDELEGATECALL: u8 = 0xF9;
pub const STATICCALL: u8 = 0xFA;
pub const EXTSTATICCALL: u8 = 0xFB;
pub const REVERT: u8 = 0xFD;
pub const INVALID: u8 = 0xFE;
/// Destroy contract and send balance to address.
/// Stack: [address] -> []
/// Gas: 5000 + dynamic costs
/// Note: Deprecated - only works in same transaction (Cancun)
pub const SELFDESTRUCT: u8 = 0xFF;

/// Checks if an opcode is a PUSH operation (PUSH1-PUSH32).
///
/// PUSH operations place N bytes of immediate data onto the stack,
/// where N is determined by the specific PUSH opcode.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` if the opcode is between PUSH1 (0x60) and PUSH32 (0x7F)
/// - `false` otherwise
///
/// ## Example
/// ```zig
/// if (is_push(opcode)) {
///     const data_size = get_push_size(opcode);
///     // Read `data_size` bytes following the opcode
/// }
/// ```
pub fn is_push(op: u8) bool {
    return op >= PUSH1 and op <= PUSH32;
}

/// Returns the number of immediate data bytes for a PUSH opcode.
///
/// PUSH1 pushes 1 byte, PUSH2 pushes 2 bytes, etc., up to PUSH32
/// which pushes 32 bytes of immediate data from the bytecode.
///
/// ## Parameters
/// - `op`: The opcode to analyze
///
/// ## Returns
/// - 1-32 for valid PUSH opcodes (PUSH1-PUSH32)
/// - 0 for non-PUSH opcodes
///
/// ## Algorithm
/// For valid PUSH opcodes: size = opcode - 0x60 + 1
///
/// ## Example
/// ```zig
/// const size = get_push_size(PUSH20); // Returns 20
/// const size2 = get_push_size(ADD);   // Returns 0
/// ```
pub fn get_push_size(op: u8) u8 {
    if (!is_push(op)) return 0;
    return op - PUSH1 + 1;
}

/// Checks if an opcode is a DUP operation (DUP1-DUP16).
///
/// DUP operations duplicate a stack item and push the copy onto the stack.
/// DUP1 duplicates the top item, DUP2 the second item, etc.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` if the opcode is between DUP1 (0x80) and DUP16 (0x8F)
/// - `false` otherwise
///
/// ## Stack Effect
/// DUPn: [... vn ... v1] -> [... vn ... v1 vn]
pub fn is_dup(op: u8) bool {
    return op >= DUP1 and op <= DUP16;
}

/// Get the stack position for a DUP opcode
/// Returns 0 for non-DUP opcodes
pub fn get_dup_position(op: u8) u8 {
    if (!is_dup(op)) return 0;
    return op - DUP1 + 1;
}

/// Check if an opcode is a SWAP operation
pub fn is_swap(op: u8) bool {
    return op >= SWAP1 and op <= SWAP16;
}

/// Get the stack position for a SWAP opcode
/// Returns 0 for non-SWAP opcodes
pub fn get_swap_position(op: u8) u8 {
    if (!is_swap(op)) return 0;
    return op - SWAP1 + 1;
}

/// Check if an opcode is a LOG operation
pub fn is_log(op: u8) bool {
    return op >= LOG0 and op <= LOG4;
}

/// Get the number of topics for a LOG opcode
/// Returns 0 for non-LOG opcodes
pub fn get_log_topic_count(op: u8) u8 {
    if (!is_log(op)) return 0;
    return op - LOG0;
}

/// Checks if an opcode terminates execution of the current context.
///
/// Terminating operations end the current execution context and cannot
/// be followed by any other operations in the execution flow.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` for STOP, RETURN, REVERT, SELFDESTRUCT, INVALID
/// - `false` otherwise
///
/// ## Terminating Opcodes
/// - STOP (0x00): Halts execution successfully
/// - RETURN (0xF3): Returns data and halts successfully
/// - REVERT (0xFD): Reverts state changes and returns data
/// - SELFDESTRUCT (0xFF): Destroys contract and sends balance
/// - INVALID (0xFE): Invalid operation, always reverts
///
/// ## Usage
/// ```zig
/// if (is_terminating(opcode)) {
///     // This is the last operation in this context
///     return;
/// }
/// ```
pub fn is_terminating(op: u8) bool {
    return op == STOP or op == RETURN or op == REVERT or op == SELFDESTRUCT or op == INVALID;
}

/// Check if an opcode is a call operation
pub fn is_call(op: u8) bool {
    return op == CALL or op == CALLCODE or op == DELEGATECALL or op == STATICCALL or
        op == EXTCALL or op == EXTDELEGATECALL or op == EXTSTATICCALL;
}

/// Check if an opcode is a create operation
pub fn is_create(op: u8) bool {
    return op == CREATE or op == CREATE2;
}

/// Checks if an opcode can modify blockchain state.
///
/// State-modifying operations are restricted in static calls and
/// require special handling for gas accounting and rollback.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` for operations that modify storage, create contracts, or emit logs
/// - `false` for read-only operations
///
/// ## State-Modifying Opcodes
/// - SSTORE: Modifies contract storage
/// - CREATE/CREATE2: Deploys new contracts
/// - SELFDESTRUCT: Destroys contract and transfers balance
/// - LOG0-LOG4: Emits events (modifies receipts)
///
/// ## Note
/// CALL can also modify state indirectly if it transfers value,
/// but this function only checks direct state modifications.
///
/// ## Static Call Protection
/// These operations will fail with an error if executed within
/// a STATICCALL context.
pub fn modifies_state(op: u8) bool {
    return op == SSTORE or op == CREATE or op == CREATE2 or op == SELFDESTRUCT or
        op == LOG0 or op == LOG1 or op == LOG2 or op == LOG3 or op == LOG4;
}

/// Check if an opcode is valid
pub fn is_valid(op: u8) bool {
    return op != INVALID;
}

// ============================================================================
// Contract Size and Gas Constants
// ============================================================================

/// Maximum allowed size for deployed contract bytecode.
///
/// ## Value
/// 24,576 bytes (24 KB)
///
/// ## Origin
/// Defined by EIP-170 (activated in Spurious Dragon hardfork)
///
/// ## Rationale
/// - Prevents excessive blockchain growth from large contracts
/// - Ensures contracts can be loaded into memory efficiently
/// - Encourages modular contract design
///
/// ## Implications
/// - Contract creation fails if initcode returns bytecode larger than this
/// - Does NOT limit initcode size (see EIP-3860 for that)
/// - Libraries and proxy patterns help work around this limit
///
/// Reference: https://eips.ethereum.org/EIPS/eip-170
pub const MAX_CODE_SIZE: u32 = 24576;

/// Gas cost per byte of deployed contract code.
///
/// ## Value
/// 200 gas per byte
///
/// ## Usage
/// Charged during contract creation (CREATE/CREATE2) based on the
/// size of the returned bytecode that will be stored on-chain.
///
/// ## Calculation
/// `deployment_gas_cost = len(returned_code) * 200`
///
/// ## Example
/// A 1000-byte contract costs an additional 200,000 gas to deploy
/// beyond the execution costs.
///
/// ## Note
/// This is separate from the initcode gas cost introduced in EIP-3860.
pub const DEPLOY_CODE_GAS_PER_BYTE: u64 = 200;
````

````zig [src/evm/constants/gas_constants.zig]
/// EVM gas cost constants for opcode execution
///
/// This module defines all gas cost constants used in EVM execution according
/// to the Ethereum Yellow Paper and various EIPs. Gas costs are critical for
/// preventing denial-of-service attacks and fairly pricing computational resources.
///
/// ## Gas Cost Categories
///
/// Operations are grouped by computational complexity:
/// - **Quick** (2 gas): Trivial operations like PC, MSIZE, GAS
/// - **Fastest** (3 gas): Simple arithmetic like ADD, SUB, NOT, LT, GT
/// - **Fast** (5 gas): More complex arithmetic like MUL, DIV, MOD
/// - **Mid** (8 gas): Advanced arithmetic like ADDMOD, MULMOD, SIGNEXTEND
/// - **Slow** (10 gas): Operations requiring more computation
/// - **Ext** (20+ gas): External operations like BALANCE, EXTCODESIZE
///
/// ## Historical Changes
///
/// Gas costs have evolved through various EIPs:
/// - EIP-150: Increased costs for IO-heavy operations
/// - EIP-2200: SSTORE net gas metering
/// - EIP-2929: Increased costs for cold storage/account access
/// - EIP-3529: Reduced refunds and cold access costs
/// - EIP-3860: Initcode metering
///
/// ## Usage
/// ```zig
/// const gas_cost = switch (opcode) {
///     0x01 => GasFastestStep, // ADD
///     0x02 => GasFastStep,    // MUL
///     0x20 => Keccak256Gas + (data_size_words * Keccak256WordGas),
///     else => 0,
/// };
/// ```

/// Gas cost for very cheap operations
/// Operations: ADDRESS, ORIGIN, CALLER, CALLVALUE, CALLDATASIZE, CODESIZE,
/// GASPRICE, RETURNDATASIZE, PC, MSIZE, GAS, CHAINID, SELFBALANCE
pub const GasQuickStep: u64 = 2;

/// Gas cost for simple arithmetic and logic operations
/// Operations: ADD, SUB, NOT, LT, GT, SLT, SGT, EQ, ISZERO, AND, OR, XOR,
/// CALLDATALOAD, MLOAD, MSTORE, MSTORE8, PUSH operations, DUP operations,
/// SWAP operations
pub const GasFastestStep: u64 = 3;

/// Gas cost for multiplication and division operations
/// Operations: MUL, DIV, SDIV, MOD, SMOD, EXP (per byte of exponent)
pub const GasFastStep: u64 = 5;

/// Gas cost for advanced arithmetic operations
/// Operations: ADDMOD, MULMOD, SIGNEXTEND, KECCAK256 (base cost)
pub const GasMidStep: u64 = 8;

/// Gas cost for operations requiring moderate computation
/// Operations: JUMPI
pub const GasSlowStep: u64 = 10;

/// Gas cost for operations that interact with other accounts/contracts
/// Operations: BALANCE, EXTCODESIZE, BLOCKHASH
pub const GasExtStep: u64 = 20;

// ============================================================================
// Hashing Operation Costs
// ============================================================================

/// Base gas cost for KECCAK256 (SHA3) operation
/// This is the fixed cost regardless of input size
pub const Keccak256Gas: u64 = 30;

/// Additional gas cost per 32-byte word for KECCAK256
/// Total cost = Keccak256Gas + (word_count * Keccak256WordGas)
pub const Keccak256WordGas: u64 = 6;

// ============================================================================
// Storage Operation Costs (EIP-2929 & EIP-2200)
// ============================================================================

/// Gas cost for SLOAD on a warm storage slot
/// After EIP-2929, warm access is significantly cheaper than cold
pub const SloadGas: u64 = 100;

/// Gas cost for first-time (cold) SLOAD access in a transaction
/// EIP-2929: Prevents underpriced state access attacks
pub const ColdSloadCost: u64 = 2100;

/// Gas cost for first-time (cold) account access in a transaction
/// EIP-2929: Applied to BALANCE, EXTCODESIZE, EXTCODECOPY, EXTCODEHASH, CALL family
pub const ColdAccountAccessCost: u64 = 2600;

/// Gas cost for warm storage read operations
/// EIP-2929: Subsequent accesses to the same slot/account in a transaction
pub const WarmStorageReadCost: u64 = 100;

/// Minimum gas that must remain for SSTORE to succeed
/// Prevents storage modifications when gas is nearly exhausted
pub const SstoreSentryGas: u64 = 2300;

/// Gas cost for SSTORE when setting a storage slot from zero to non-zero
/// This is the most expensive storage operation as it increases state size
pub const SstoreSetGas: u64 = 20000;

/// Gas cost for SSTORE when changing an existing non-zero value to another non-zero value
/// Cheaper than initial set since slot is already allocated
pub const SstoreResetGas: u64 = 5000;

/// Gas cost for SSTORE when clearing a storage slot (non-zero to zero)
/// Same cost as reset, but eligible for gas refund
pub const SstoreClearGas: u64 = 5000;

/// Gas refund for clearing storage slot to zero
/// EIP-3529: Reduced from 15000 to prevent gas refund abuse
pub const SstoreRefundGas: u64 = 4800;
// ============================================================================
// Control Flow Costs
// ============================================================================

/// Gas cost for JUMPDEST opcode
/// Minimal cost as it's just a marker for valid jump destinations
pub const JumpdestGas: u64 = 1;

// ============================================================================
// Logging Operation Costs
// ============================================================================

/// Base gas cost for LOG operations (LOG0-LOG4)
/// This is the fixed cost before considering data size and topics
pub const LogGas: u64 = 375;

/// Gas cost per byte of data in LOG operations
/// Incentivizes efficient event data usage
pub const LogDataGas: u64 = 8;

/// Gas cost per topic in LOG operations
/// Each additional topic (LOG1, LOG2, etc.) adds this cost
pub const LogTopicGas: u64 = 375;

// ============================================================================
// Contract Creation and Call Costs
// ============================================================================

/// Base gas cost for CREATE opcode
/// High cost reflects the expense of deploying new contracts
pub const CreateGas: u64 = 32000;
/// Base gas cost for CALL operations
/// This is the minimum cost before additional charges
pub const CallGas: u64 = 40;

/// Gas stipend provided to called contract when transferring value
/// Ensures called contract has minimum gas to execute basic operations
pub const CallStipend: u64 = 2300;

/// Additional gas cost when CALL transfers value (ETH)
/// Makes value transfers more expensive to prevent spam
pub const CallValueTransferGas: u64 = 9000;

/// Additional gas cost when CALL creates a new account
/// Reflects the cost of adding a new entry to the state trie
pub const CallNewAccountGas: u64 = 25000;

/// Gas refund for SELFDESTRUCT operation
/// Incentivizes cleaning up unused contracts
pub const SelfdestructRefundGas: u64 = 24000;
// ============================================================================
// Memory Expansion Costs
// ============================================================================

/// Linear coefficient for memory gas calculation
/// Part of the formula: gas = MemoryGas * words + words² / QuadCoeffDiv
pub const MemoryGas: u64 = 3;

/// Quadratic coefficient divisor for memory gas calculation
/// Makes memory expansion quadratically expensive to prevent DoS attacks
pub const QuadCoeffDiv: u64 = 512;

// ============================================================================
// Contract Deployment Costs
// ============================================================================

/// Gas cost per byte of contract deployment code
/// Applied to the bytecode being deployed via CREATE/CREATE2
pub const CreateDataGas: u64 = 200;

/// Gas cost per 32-byte word of initcode
/// EIP-3860: Prevents deploying excessively large contracts
pub const InitcodeWordGas: u64 = 2;

/// Maximum allowed initcode size in bytes
/// EIP-3860: Limit is 49152 bytes (2 * MAX_CODE_SIZE)
pub const MaxInitcodeSize: u64 = 49152;

// ============================================================================
// Transaction Costs
// ============================================================================

/// Base gas cost for a standard transaction
/// Minimum cost for any transaction regardless of data or computation
pub const TxGas: u64 = 21000;

/// Base gas cost for contract creation transaction
/// Higher than standard tx due to contract deployment overhead
pub const TxGasContractCreation: u64 = 53000;

/// Gas cost per zero byte in transaction data
/// Cheaper than non-zero bytes to incentivize data efficiency
pub const TxDataZeroGas: u64 = 4;

/// Gas cost per non-zero byte in transaction data
/// Higher cost reflects increased storage and bandwidth requirements
pub const TxDataNonZeroGas: u64 = 16;

/// Gas cost per word for copy operations
/// Applied to CODECOPY, EXTCODECOPY, RETURNDATACOPY, etc.
pub const CopyGas: u64 = 3;

/// Maximum gas refund as a fraction of gas used
/// EIP-3529: Reduced from 1/2 to 1/5 to prevent refund abuse
pub const MaxRefundQuotient: u64 = 5;

// ============================================================================
// EIP-4844: Shard Blob Transactions
// ============================================================================

/// Gas cost for BLOBHASH opcode
/// Returns the hash of a blob associated with the transaction
pub const BlobHashGas: u64 = 3;

/// Gas cost for BLOBBASEFEE opcode
/// Returns the base fee for blob gas
pub const BlobBaseFeeGas: u64 = 2;

// ============================================================================
// EIP-1153: Transient Storage
// ============================================================================

/// Gas cost for TLOAD (transient storage load)
/// Transient storage is cleared after each transaction
pub const TLoadGas: u64 = 100;

/// Gas cost for TSTORE (transient storage store)
/// Same cost as TLOAD, much cheaper than persistent storage
pub const TStoreGas: u64 = 100;

// ============================================================================
// Precompile Operation Costs
// ============================================================================

/// Base gas cost for IDENTITY precompile (address 0x04)
/// Minimum cost regardless of input size
pub const IDENTITY_BASE_COST: u64 = 15;

/// Gas cost per 32-byte word for IDENTITY precompile
/// Total cost = IDENTITY_BASE_COST + (word_count * IDENTITY_WORD_COST)
pub const IDENTITY_WORD_COST: u64 = 3;

/// Calculate memory expansion gas cost
///
/// Computes the gas cost for expanding EVM memory from current_size to new_size bytes.
/// Memory expansion follows a quadratic cost formula to prevent DoS attacks.
///
/// ## Parameters
/// - `current_size`: Current memory size in bytes
/// - `new_size`: Requested new memory size in bytes
///
/// ## Returns
/// - Gas cost for the expansion (0 if new_size <= current_size)
///
/// ## Formula
/// The total memory cost for n words is: 3n + n²/512
/// Where a word is 32 bytes.
///
/// Pre-computed memory expansion costs for common sizes.
///
/// This lookup table stores the total memory cost for sizes up to 32KB (1024 words).
/// Using a LUT converts runtime calculations to O(1) lookups for common cases.
/// The formula is: 3n + n²/512 where n is the number of 32-byte words.
pub const MEMORY_EXPANSION_LUT = blk: {
    @setEvalBranchQuota(10000);
    const max_words = 1024; // Pre-compute for up to 32KB of memory
    var costs: [max_words]u64 = undefined;

    for (0..max_words) |words| {
        costs[words] = MemoryGas * words + (words * words) / QuadCoeffDiv;
    }

    break :blk costs;
};

/// The expansion cost is: total_cost(new_size) - total_cost(current_size)
///
/// ## Examples
/// - Expanding from 0 to 32 bytes (1 word): 3 + 0 = 3 gas
/// - Expanding from 0 to 64 bytes (2 words): 6 + 0 = 6 gas
/// - Expanding from 0 to 1024 bytes (32 words): 96 + 2 = 98 gas
/// - Expanding from 1024 to 2048 bytes: 294 - 98 = 196 gas
///
/// ## Edge Cases
/// - If new_size <= current_size, no expansion needed, returns 0
/// - Sizes are rounded up to the nearest word (32 bytes)
/// - At 32MB, gas cost exceeds 2 billion, effectively preventing larger allocations
///
/// ## Performance
/// - Uses pre-computed lookup table for sizes up to 32KB (O(1) lookup)
/// - Falls back to calculation for larger sizes
pub fn memory_gas_cost(current_size: u64, new_size: u64) u64 {
    if (new_size <= current_size) return 0;

    const current_words = (current_size + 31) / 32;
    const new_words = (new_size + 31) / 32;

    // Use lookup table for common cases (up to 32KB)
    if (new_words < MEMORY_EXPANSION_LUT.len) {
        const current_cost = if (current_words < MEMORY_EXPANSION_LUT.len)
            MEMORY_EXPANSION_LUT[@as(usize, @intCast(current_words))]
        else
            MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;

        return MEMORY_EXPANSION_LUT[@as(usize, @intCast(new_words))] - current_cost;
    }

    // Fall back to calculation for larger sizes
    const current_cost = MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;
    const new_cost = MemoryGas * new_words + (new_words * new_words) / QuadCoeffDiv;
    return new_cost - current_cost;
}
````

```zig [src/evm/fee_market.zig]
const std = @import("std");
const Log = @import("log.zig");

// FeeMarket implements the EIP-1559 fee market mechanism
///
// The EIP-1559 fee market introduces a base fee per block that moves
// up or down based on how full the previous block was compared to the target.
///
// Key features:
// 1. Base fee per block that is burned (not paid to miners)
// 2. Priority fee (tip) that goes to miners
// 3. Base fee adjustment based on block fullness

/// Helper function to calculate fee delta safely avoiding overflow and division by zero
fn calculate_fee_delta(fee: u64, gas_delta: u64, gas_target: u64, denominator: u64) u64 {
    // Using u128 for intermediate calculation to avoid overflow
    const intermediate: u128 = @as(u128, fee) * @as(u128, gas_delta);
    // Avoid division by zero
    const divisor: u128 = @max(1, @as(u128, gas_target) * @as(u128, denominator));
    const result: u64 = @intCast(@min(@as(u128, std.math.maxInt(u64)), intermediate / divisor));

    // Always return at least 1 to ensure some movement
    return @max(1, result);
}
/// Minimum base fee per gas (in wei)
/// This ensures the base fee never goes to zero
pub const MIN_BASE_FEE: u64 = 7;

/// Base fee change denominator
/// The base fee can change by at most 1/BASE_FEE_CHANGE_DENOMINATOR
/// (or 12.5% with the value of 8) between blocks
pub const BASE_FEE_CHANGE_DENOMINATOR: u64 = 8;

/// Initialize base fee for the first EIP-1559 block
///
/// This is used when transitioning from a pre-EIP-1559 chain to
/// an EIP-1559 enabled chain.
///
/// Parameters:
/// - parent_gas_used: Gas used by the parent block
/// - parent_gas_limit: Gas limit of the parent block
///
/// Returns: The initial base fee (in wei)
pub fn initial_base_fee(parent_gas_used: u64, parent_gas_limit: u64) u64 {
    Log.debug("Initializing base fee for first EIP-1559 block", .{});
    Log.debug("Parent block gas used: {d}, gas limit: {d}", .{ parent_gas_used, parent_gas_limit });

    // Initial base fee formula from the EIP-1559 specification
    // If the parent block used exactly the target gas, the initial base fee is 1 gwei
    // If it used more, the initial base fee is higher
    // If it used less, the initial base fee is lower

    // Target gas usage is half the block gas limit
    const parent_gas_target = parent_gas_limit / 2;

    // Initial base fee calculation
    var base_fee: u64 = 1_000_000_000; // 1 gwei in wei

    // Adjust initial base fee based on parent block's gas usage
    if (parent_gas_used > 0) {
        const gas_used_delta = if (parent_gas_used > parent_gas_target)
            parent_gas_used - parent_gas_target
        else
            parent_gas_target - parent_gas_used;

        const base_fee_delta = calculate_fee_delta(base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        if (parent_gas_used > parent_gas_target) {
            base_fee = base_fee + base_fee_delta;
        } else if (base_fee > base_fee_delta) {
            base_fee = base_fee - base_fee_delta;
        }
    }

    // Ensure base fee is at least the minimum
    base_fee = @max(base_fee, MIN_BASE_FEE);

    Log.debug("Initial base fee calculated: {d} wei", .{base_fee});
    return base_fee;
}

/// Calculate the next block's base fee based on the current block
///
/// This implements the EIP-1559 base fee adjustment algorithm:
/// - If the block used exactly the target gas, the base fee remains the same
/// - If the block used more than the target, the base fee increases
/// - If the block used less than the target, the base fee decreases
/// - The maximum change per block is 12.5% (1/8)
///
/// Parameters:
/// - parent_base_fee: Base fee of the parent block
/// - parent_gas_used: Gas used by the parent block
/// - parent_gas_target: Target gas usage of the parent block
///
/// Returns: The next block's base fee (in wei)
pub fn next_base_fee(parent_base_fee: u64, parent_gas_used: u64, parent_gas_target: u64) u64 {
    Log.debug("Calculating next block's base fee", .{});
    Log.debug("Parent block base fee: {d} wei", .{parent_base_fee});
    Log.debug("Parent block gas used: {d}, gas target: {d}", .{ parent_gas_used, parent_gas_target });

    // If parent block is empty, keep the base fee the same
    // Skip the delta calculations and just return the parent fee directly
    if (parent_gas_used == 0) {
        Log.debug("Parent block was empty, keeping base fee the same: {d} wei", .{parent_base_fee});
        return parent_base_fee;
    }

    // Calculate base fee delta
    var new_base_fee = parent_base_fee;

    if (parent_gas_used == parent_gas_target) {
        // If parent block used exactly the target gas, keep the base fee the same
        Log.debug("Parent block used exactly the target gas, keeping base fee the same", .{});
    } else if (parent_gas_used > parent_gas_target) {
        // If parent block used more than the target gas, increase the base fee

        // Calculate gas used delta as a fraction of target
        const gas_used_delta = parent_gas_used - parent_gas_target;

        // Calculate the base fee delta (max 12.5% increase)
        const base_fee_delta = calculate_fee_delta(parent_base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        // Increase the base fee
        // The overflow check is probably unnecessary given gas limits, but it's a good safety measure
        new_base_fee = std.math.add(u64, parent_base_fee, base_fee_delta) catch parent_base_fee;

        Log.debug("Parent block used more than target gas, increasing base fee by {d} wei", .{base_fee_delta});
    } else {
        // If parent block used less than the target gas, decrease the base fee

        // Calculate gas used delta as a fraction of target
        const gas_used_delta = parent_gas_target - parent_gas_used;

        // Calculate the base fee delta (max 12.5% decrease)
        const base_fee_delta = calculate_fee_delta(parent_base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        // Decrease the base fee, but don't go below the minimum
        new_base_fee = if (parent_base_fee > base_fee_delta)
            parent_base_fee - base_fee_delta
        else
            MIN_BASE_FEE;

        Log.debug("Parent block used less than target gas, decreasing base fee by {d} wei", .{base_fee_delta});
    }

    // Ensure base fee is at least the minimum
    new_base_fee = @max(new_base_fee, MIN_BASE_FEE);

    Log.debug("Next block base fee calculated: {d} wei", .{new_base_fee});
    return new_base_fee;
}

/// Calculate the effective gas price for an EIP-1559 transaction
///
/// The effective gas price is the minimum of:
/// 1. max_fee_per_gas specified by the sender
/// 2. base_fee_per_gas + max_priority_fee_per_gas
///
/// Parameters:
/// - base_fee_per_gas: Current block's base fee
/// - max_fee_per_gas: Maximum fee the sender is willing to pay
/// - max_priority_fee_per_gas: Maximum tip the sender is willing to pay to the miner
///
/// Returns: The effective gas price, and the miner's portion of the fee
pub fn get_effective_gas_price(base_fee_per_gas: u64, max_fee_per_gas: u64, max_priority_fee_per_gas: u64) struct { effective_gas_price: u64, miner_fee: u64 } {
    Log.debug("Calculating effective gas price", .{});
    Log.debug("Base fee: {d}, max fee: {d}, max priority fee: {d}", .{ base_fee_per_gas, max_fee_per_gas, max_priority_fee_per_gas });

    // Ensure the transaction at least pays the base fee
    if (max_fee_per_gas < base_fee_per_gas) {
        std.log.warn("Transaction's max fee ({d}) is less than base fee ({d})", .{ max_fee_per_gas, base_fee_per_gas });
        // In a real implementation, this transaction would be rejected
        // For now, just return the max fee and zero miner fee
        return .{ .effective_gas_price = max_fee_per_gas, .miner_fee = 0 };
    }

    // Calculate the priority fee (tip to miner)
    // This is limited by both max_priority_fee_per_gas and the leftover after base fee
    const max_priority_fee = @min(max_priority_fee_per_gas, max_fee_per_gas - base_fee_per_gas);

    // The effective gas price is base fee plus priority fee
    const effective_gas_price = base_fee_per_gas + max_priority_fee;

    Log.debug("Effective gas price: {d} wei", .{effective_gas_price});
    Log.debug("Miner fee (priority fee): {d} wei", .{max_priority_fee});

    return .{ .effective_gas_price = effective_gas_price, .miner_fee = max_priority_fee };
}

/// Get the gas target for a block
///
/// The gas target is the desired gas usage per block, which is typically
/// half of the maximum gas limit.
///
/// Parameters:
/// - gas_limit: The block's gas limit
///
/// Returns: The gas target for the block
pub fn get_gas_target(gas_limit: u64) u64 {
    return gas_limit / 2;
}
```

````zig [src/evm/state/evm_log.zig]
const Address = @import("Address");

/// EVM event log representation
///
/// This struct represents a log entry emitted by smart contracts using the LOG0-LOG4 opcodes.
/// Logs are a crucial part of the Ethereum event system, allowing contracts to emit indexed
/// data that can be efficiently queried by external applications.
///
/// ## Overview
///
/// Event logs serve multiple purposes in the EVM:
/// - **Event Notification**: Notify external applications about state changes
/// - **Cheaper Storage**: Store data in logs instead of contract storage (much cheaper gas cost)
/// - **Historical Queries**: Enable efficient querying of past events
/// - **Debugging**: Provide insight into contract execution
///
/// ## Log Structure
///
/// Each log entry contains:
/// - **Address**: The contract that emitted the log
/// - **Topics**: Up to 4 indexed 32-byte values for efficient filtering
/// - **Data**: Arbitrary length non-indexed data
///
/// ## Topics vs Data
///
/// The distinction between topics and data is important:
/// - **Topics**: Indexed for efficient filtering, limited to 4 entries of 32 bytes each
/// - **Data**: Not indexed, can be arbitrary length, cheaper to include
///
/// ## Gas Costs
///
/// - LOG0: 375 gas base + 8 gas per byte of data
/// - LOG1-LOG4: 375 gas base + 375 gas per topic + 8 gas per byte of data
///
/// ## Example Usage
///
/// In Solidity:
/// ```solidity
/// event Transfer(address indexed from, address indexed to, uint256 value);
/// emit Transfer(msg.sender, recipient, amount);
/// ```
///
/// This would create a log with:
/// - topics[0]: keccak256("Transfer(address,address,uint256)")
/// - topics[1]: from address (indexed)
/// - topics[2]: to address (indexed)
/// - data: encoded uint256 value
const EvmLog = @This();

/// The address of the contract that emitted this log
address: Address.Address,

/// Indexed topics for efficient log filtering
///
/// - First topic (if any) is typically the event signature hash
/// - Subsequent topics are indexed event parameters
/// - Maximum of 4 topics per log (LOG0 has 0, LOG4 has 4)
topics: []const u256,

/// Non-indexed event data
///
/// Contains ABI-encoded event parameters that were not marked as indexed.
/// This data is not searchable but is cheaper to include than topics.
data: []const u8,
````

````zig [src/evm/state/storage_key.zig]
const std = @import("std");
const Address = @import("Address");

/// Composite key for EVM storage operations combining address and slot.
///
/// The StorageKey uniquely identifies a storage location within the EVM by
/// combining a contract address with a 256-bit storage slot number. This is
/// fundamental to how the EVM organizes persistent contract storage.
///
/// ## Design Rationale
/// Each smart contract has its own isolated storage space addressed by 256-bit
/// slots. To track storage across multiple contracts in a single VM instance,
/// we need a composite key that includes both the contract address and the
/// slot number.
///
/// ## Storage Model
/// In the EVM:
/// - Each contract has 2^256 storage slots
/// - Each slot can store a 256-bit value
/// - Slots are initially zero and only consume gas when first written
///
/// ## Usage
/// ```zig
/// const key = StorageKey{
///     .address = contract_address,
///     .slot = 0x0, // First storage slot
/// };
///
/// // Use in hash maps for storage tracking
/// var storage = std.AutoHashMap(StorageKey, u256).init(allocator);
/// try storage.put(key, value);
/// ```
///
/// ## Hashing Strategy
/// The key implements a generic hash function that works with any hasher
/// implementing the standard update() interface. The address is hashed first,
/// followed by the slot number in big-endian format.
const StorageKey = @This();

/// The contract address that owns this storage slot.
/// Standard 20-byte Ethereum address.
address: Address.Address,

/// The 256-bit storage slot number within the contract's storage space.
/// Slots are sparsely allocated - most remain at zero value.
slot: u256,

/// Compute a hash of this storage key for use in hash maps.
///
/// This function is designed to work with Zig's AutoHashMap and any
/// hasher that implements the standard `update([]const u8)` method.
///
/// The hash combines both the address and slot to ensure unique hashes
/// for different storage locations. The slot is converted to big-endian
/// bytes to ensure consistent hashing across different architectures.
///
/// @param self The storage key to hash
/// @param hasher Any hasher with an update() method
///
/// Example:
/// ```zig
/// var map = std.AutoHashMap(StorageKey, u256).init(allocator);
/// const key = StorageKey{ .address = addr, .slot = slot };
/// try map.put(key, value); // Uses hash() internally
/// ```
pub fn hash(self: StorageKey, hasher: anytype) void {
    // Hash the address bytes
    hasher.update(&self.address);
    // Hash the slot as bytes in big-endian format for consistency
    var slot_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &slot_bytes, self.slot, .big);
    hasher.update(&slot_bytes);
}

/// Check equality between two storage keys.
///
/// Two storage keys are equal if and only if both their address and
/// slot number match exactly. This is used by hash maps to resolve
/// collisions and find exact matches.
///
/// @param a First storage key
/// @param b Second storage key
/// @return true if both address and slot match
///
/// Example:
/// ```zig
/// const key1 = StorageKey{ .address = addr, .slot = 0 };
/// const key2 = StorageKey{ .address = addr, .slot = 0 };
/// if (!StorageKey.eql(key1, key2)) unreachable;
/// ```
pub fn eql(a: StorageKey, b: StorageKey) bool {
    // Fast path for identical keys (likely in hot loops)
    if (std.mem.eql(u8, &a.address, &b.address) and a.slot == b.slot) {
        @branchHint(.likely);
        return true;
    } else {
        @branchHint(.cold);
        return false;
    }
}
````

````zig [src/evm/state/state.zig]
//! EVM state management module - Tracks blockchain state during execution
//!
//! This module provides the state storage layer for the EVM, managing all
//! mutable blockchain state including account balances, storage, code, nonces,
//! transient storage, and event logs.
//!
//! ## State Components
//!
//! The EVM state consists of:
//! - **Account State**: Balances, nonces, and contract code
//! - **Persistent Storage**: Contract storage slots (SSTORE/SLOAD)
//! - **Transient Storage**: Temporary storage within transactions (TSTORE/TLOAD)
//! - **Event Logs**: Emitted events from LOG0-LOG4 opcodes
//!
//! ## Design Philosophy
//!
//! This implementation uses hash maps for efficient lookups and modifications.
//! All state changes are applied immediately (no journaling in this layer).
//! For transaction rollback support, this should be wrapped in a higher-level
//! state manager that implements checkpointing/journaling.
//!
//! ## Memory Management
//!
//! All state data is heap-allocated using the provided allocator. The state
//! owns all data it stores and properly cleans up in deinit().
//!
//! ## Thread Safety
//!
//! This implementation is NOT thread-safe. Concurrent access must be synchronized
//! externally.

const std = @import("std");
const Address = @import("Address");
const EvmLog = @import("evm_log.zig");
const StorageKey = @import("storage_key.zig");
const Log = @import("../log.zig");

/// EVM state container
///
/// Manages all mutable blockchain state during EVM execution.
/// This includes account data, storage, and transaction artifacts.
const EvmState = @This();

/// Memory allocator for all state allocations
allocator: std.mem.Allocator,

/// Persistent contract storage (SSTORE/SLOAD)
/// Maps (address, slot) -> value
storage: std.AutoHashMap(StorageKey, u256),

/// Account balances in wei
/// Maps address -> balance
balances: std.AutoHashMap(Address.Address, u256),

/// Contract bytecode
/// Maps address -> code bytes
/// Empty slice for EOAs (Externally Owned Accounts)
code: std.AutoHashMap(Address.Address, []const u8),

/// Account nonces (transaction counters)
/// Maps address -> nonce
/// Incremented on each transaction from the account
nonces: std.AutoHashMap(Address.Address, u64),

/// Transient storage (EIP-1153: TSTORE/TLOAD)
/// Maps (address, slot) -> value
/// Cleared after each transaction
transient_storage: std.AutoHashMap(StorageKey, u256),

/// Event logs emitted during execution
/// Ordered list of all LOG0-LOG4 events
logs: std.ArrayList(EvmLog),

/// Initialize a new EVM state instance
///
/// Creates empty state with the provided allocator. All maps and lists
/// are initialized empty.
///
/// ## Parameters
/// - `allocator`: Memory allocator for all state allocations
///
/// ## Returns
/// - Success: New initialized state instance
/// - Error: OutOfMemory if allocation fails
///
/// ## Example
/// ```zig
/// var state = try EvmState.init(allocator);
/// defer state.deinit();
/// ```
pub fn init(allocator: std.mem.Allocator) std.mem.Allocator.Error!EvmState {
    Log.debug("EvmState.init: Initializing EVM state with allocator", .{});

    var storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer storage.deinit();

    var balances = std.AutoHashMap(Address.Address, u256).init(allocator);
    errdefer balances.deinit();

    var code = std.AutoHashMap(Address.Address, []const u8).init(allocator);
    errdefer code.deinit();

    var nonces = std.AutoHashMap(Address.Address, u64).init(allocator);
    errdefer nonces.deinit();

    var transient_storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer transient_storage.deinit();

    var logs = std.ArrayList(EvmLog).init(allocator);
    errdefer logs.deinit();

    Log.debug("EvmState.init: EVM state initialization complete", .{});
    return EvmState{
        .allocator = allocator,
        .storage = storage,
        .balances = balances,
        .code = code,
        .nonces = nonces,
        .transient_storage = transient_storage,
        .logs = logs,
    };
}

/// Clean up all allocated resources
///
/// Frees all memory used by the state, including:
/// - All hash maps
/// - Log data (topics and data arrays)
/// - Any allocated slices
///
/// ## Important
/// After calling deinit(), the state instance is invalid and
/// must not be used.
pub fn deinit(self: *EvmState) void {
    Log.debug("EvmState.deinit: Cleaning up EVM state, storage_count={}, balance_count={}, code_count={}, logs_count={}", .{
        self.storage.count(), self.balances.count(), self.code.count(), self.logs.items.len
    });

    self.storage.deinit();
    self.balances.deinit();
    self.code.deinit();
    self.nonces.deinit();
    self.transient_storage.deinit();

    // Clean up logs - free allocated memory for topics and data
    for (self.logs.items) |log| {
        self.allocator.free(log.topics);
        self.allocator.free(log.data);
    }
    self.logs.deinit();

    Log.debug("EvmState.deinit: EVM state cleanup complete", .{});
}

// State access methods

/// Get a value from persistent storage
///
/// Reads a storage slot for the given address. Returns 0 for
/// uninitialized slots (EVM default).
///
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
///
/// ## Returns
/// The stored value, or 0 if not set
///
/// ## Gas Cost
/// In real EVM: 100-2100 gas depending on cold/warm access
pub fn get_storage(self: *const EvmState, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    // Hot path: most storage reads are cache hits
    if (self.storage.get(key)) |value| {
        @branchHint(.likely);
        Log.debug("EvmState.get_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
        return value;
    } else {
        @branchHint(.cold);
        // Cold path: uninitialized storage defaults to 0
        Log.debug("EvmState.get_storage: addr={x}, slot={}, value=0 (uninitialized)", .{ Address.to_u256(address), slot });
        return 0;
    }
}

/// Set a value in persistent storage
///
/// Updates a storage slot for the given address. Setting a value
/// to 0 is different from deleting it - it still consumes storage.
///
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// - `value`: Value to store
///
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
///
/// ## Gas Cost
/// In real EVM: 2900-20000 gas depending on current/new value
pub fn set_storage(self: *EvmState, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    Log.debug("EvmState.set_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    try self.storage.put(key, value);
}

/// Get account balance
///
/// Returns the balance in wei for the given address.
/// Non-existent accounts have balance 0.
///
/// ## Parameters
/// - `address`: Account address
///
/// ## Returns
/// Balance in wei (0 for non-existent accounts)
pub fn get_balance(self: *const EvmState, address: Address.Address) u256 {
    // Hot path: account exists with balance
    if (self.balances.get(address)) |balance| {
        @branchHint(.likely);
        Log.debug("EvmState.get_balance: addr={x}, balance={}", .{ Address.to_u256(address), balance });
        return balance;
    } else {
        @branchHint(.cold);
        // Cold path: new or zero-balance account
        Log.debug("EvmState.get_balance: addr={x}, balance=0 (new account)", .{ Address.to_u256(address) });
        return 0;
    }
}

/// Set account balance
///
/// Updates the balance for the given address. Setting balance
/// creates the account if it doesn't exist.
///
/// ## Parameters
/// - `address`: Account address
/// - `balance`: New balance in wei
///
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
///
/// ## Note
/// Balance can exceed total ETH supply in test scenarios
pub fn set_balance(self: *EvmState, address: Address.Address, balance: u256) std.mem.Allocator.Error!void {
    Log.debug("EvmState.set_balance: addr={x}, balance={}", .{ Address.to_u256(address), balance });
    try self.balances.put(address, balance);
}

/// Get contract code
///
/// Returns the bytecode deployed at the given address.
/// EOAs and non-existent accounts return empty slice.
///
/// ## Parameters
/// - `address`: Contract address
///
/// ## Returns
/// Contract bytecode (empty slice for EOAs)
///
/// ## Note
/// The returned slice is owned by the state - do not free
pub fn get_code(self: *const EvmState, address: Address.Address) []const u8 {
    // Hot path: contract with code
    if (self.code.get(address)) |code| {
        @branchHint(.likely);
        Log.debug("EvmState.get_code: addr={x}, code_len={}", .{ Address.to_u256(address), code.len });
        return code;
    } else {
        @branchHint(.cold);
        // Cold path: EOA or non-existent account
        Log.debug("EvmState.get_code: addr={x}, code_len=0 (EOA or non-existent)", .{ Address.to_u256(address) });
        return &[_]u8{};
    }
}

/// Set contract code
///
/// Deploys bytecode to the given address. The state takes
/// ownership of the code slice.
///
/// ## Parameters
/// - `address`: Contract address
/// - `code`: Bytecode to deploy
///
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
///
/// ## Important
/// The state does NOT copy the code - it takes ownership
/// of the provided slice
pub fn set_code(self: *EvmState, address: Address.Address, code: []const u8) std.mem.Allocator.Error!void {
    Log.debug("EvmState.set_code: addr={x}, code_len={}", .{ Address.to_u256(address), code.len });
    try self.code.put(address, code);
}

/// Get account nonce
///
/// Returns the transaction count for the given address.
/// Non-existent accounts have nonce 0.
///
/// ## Parameters
/// - `address`: Account address
///
/// ## Returns
/// Current nonce (0 for new accounts)
///
/// ## Note
/// Nonce prevents transaction replay attacks
pub fn get_nonce(self: *const EvmState, address: Address.Address) u64 {
    // Hot path: existing account with nonce
    if (self.nonces.get(address)) |nonce| {
        @branchHint(.likely);
        Log.debug("EvmState.get_nonce: addr={x}, nonce={}", .{ Address.to_u256(address), nonce });
        return nonce;
    } else {
        @branchHint(.cold);
        // Cold path: new account
        Log.debug("EvmState.get_nonce: addr={x}, nonce=0 (new account)", .{ Address.to_u256(address) });
        return 0;
    }
}

/// Set account nonce
///
/// Updates the transaction count for the given address.
///
/// ## Parameters
/// - `address`: Account address
/// - `nonce`: New nonce value
///
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
///
/// ## Warning
/// Setting nonce below current value can enable replay attacks
pub fn set_nonce(self: *EvmState, address: Address.Address, nonce: u64) std.mem.Allocator.Error!void {
    Log.debug("EvmState.set_nonce: addr={x}, nonce={}", .{ Address.to_u256(address), nonce });
    try self.nonces.put(address, nonce);
}

/// Increment account nonce
///
/// Atomically increments the nonce and returns the previous value.
/// Used when processing transactions from an account.
///
/// ## Parameters
/// - `address`: Account address
///
/// ## Returns
/// - Success: Previous nonce value (before increment)
/// - Error: OutOfMemory if map expansion fails
///
/// ## Example
/// ```zig
/// const tx_nonce = try state.increment_nonce(sender);
/// // tx_nonce is used for the transaction
/// // account nonce is now tx_nonce + 1
/// ```
pub fn increment_nonce(self: *EvmState, address: Address.Address) std.mem.Allocator.Error!u64 {
    const current_nonce = self.get_nonce(address);
    const new_nonce = current_nonce + 1;
    Log.debug("EvmState.increment_nonce: addr={x}, old_nonce={}, new_nonce={}", .{ Address.to_u256(address), current_nonce, new_nonce });
    try self.set_nonce(address, new_nonce);
    return current_nonce;
}

// Transient storage methods

/// Get a value from transient storage
///
/// Reads a transient storage slot (EIP-1153). Transient storage
/// is cleared after each transaction, making it cheaper than
/// persistent storage for temporary data.
///
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
///
/// ## Returns
/// The stored value, or 0 if not set
///
/// ## Gas Cost
/// TLOAD: 100 gas (always warm)
pub fn get_transient_storage(self: *const EvmState, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    // Hot path: transient storage hit
    if (self.transient_storage.get(key)) |value| {
        @branchHint(.likely);
        Log.debug("EvmState.get_transient_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
        return value;
    } else {
        @branchHint(.cold);
        // Cold path: uninitialized transient storage defaults to 0
        Log.debug("EvmState.get_transient_storage: addr={x}, slot={}, value=0 (uninitialized)", .{ Address.to_u256(address), slot });
        return 0;
    }
}

/// Set a value in transient storage
///
/// Updates a transient storage slot (EIP-1153). Values are
/// automatically cleared after the transaction completes.
///
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// - `value`: Value to store temporarily
///
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
///
/// ## Gas Cost
/// TSTORE: 100 gas (always warm)
///
/// ## Use Cases
/// - Reentrancy locks
/// - Temporary computation results
/// - Cross-contract communication within a transaction
pub fn set_transient_storage(self: *EvmState, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    Log.debug("EvmState.set_transient_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    try self.transient_storage.put(key, value);
}

// Log methods

/// Emit an event log
///
/// Records an event log from LOG0-LOG4 opcodes. The log is added
/// to the transaction's log list and cannot be removed.
///
/// ## Parameters
/// - `address`: Contract emitting the log
/// - `topics`: Indexed topics (0-4 entries)
/// - `data`: Non-indexed log data
///
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if allocation fails
///
/// ## Memory Management
/// This function copies both topics and data to ensure they
/// persist beyond the current execution context.
///
/// ## Example
/// ```zig
/// // Emit Transfer event
/// const topics = [_]u256{
///     0x123..., // Transfer event signature
///     from_addr, // indexed from
///     to_addr,   // indexed to
/// };
/// const data = encode_u256(amount);
/// try state.emit_log(contract_addr, &topics, data);
/// ```
pub fn emit_log(self: *EvmState, address: Address.Address, topics: []const u256, data: []const u8) std.mem.Allocator.Error!void {
    Log.debug("EvmState.emit_log: addr={x}, topics_len={}, data_len={}", .{ Address.to_u256(address), topics.len, data.len });

    // Clone the data to ensure it persists
    const data_copy = try self.allocator.alloc(u8, data.len);
    @memcpy(data_copy, data);

    // Clone the topics to ensure they persist
    const topics_copy = try self.allocator.alloc(u256, topics.len);
    @memcpy(topics_copy, topics);

    const log = EvmLog{
        .address = address,
        .topics = topics_copy,
        .data = data_copy,
    };

    try self.logs.append(log);
    Log.debug("EvmState.emit_log: Log emitted, total_logs={}", .{self.logs.items.len});
}
````

````zig [src/evm/vm.zig]
const std = @import("std");
const Contract = @import("contract/contract.zig");
const Stack = @import("stack/stack.zig");
const JumpTable = @import("jump_table/jump_table.zig");
const Frame = @import("frame.zig");
const Operation = @import("opcodes/operation.zig");
const Address = @import("Address");
const StoragePool = @import("contract/storage_pool.zig");
const AccessList = @import("access_list/access_list.zig");
const ExecutionError = @import("execution/execution_error.zig");
const rlp = @import("Rlp");
const Keccak256 = std.crypto.hash.sha3.Keccak256;
const ChainRules = @import("hardforks/chain_rules.zig");
const gas_constants = @import("constants/gas_constants.zig");
const constants = @import("constants/constants.zig");
const Log = @import("log.zig");
const EvmLog = @import("state/evm_log.zig");
const Context = @import("context.zig");
const EvmState = @import("state/state.zig");
pub const StorageKey = @import("state/storage_key.zig");
pub const CreateResult = @import("create_result.zig").CreateResult;
pub const CallResult = @import("call_result.zig").CallResult;
pub const RunResult = @import("run_result.zig").RunResult;
const Hardfork = @import("hardforks/hardfork.zig").Hardfork;
const precompiles = @import("precompiles/precompiles.zig");

/// Virtual Machine for executing Ethereum bytecode.
///
/// Manages contract execution, gas accounting, state access, and protocol enforcement
/// according to the configured hardfork rules. Supports the full EVM instruction set
/// including contract creation, calls, and state modifications.
const Vm = @This();

/// Memory allocator for VM operations
allocator: std.mem.Allocator,
/// Return data from the most recent operation
return_data: []u8 = &[_]u8{},
/// Legacy stack field (unused in current implementation)
stack: Stack = .{},
/// Opcode dispatch table for the configured hardfork
table: JumpTable,
/// Protocol rules for the current hardfork
chain_rules: ChainRules,
// TODO should be injected
/// World state including accounts, storage, and code
state: EvmState,
/// Transaction and block context
context: Context,
/// Warm/cold access tracking for EIP-2929 gas costs
access_list: AccessList,
/// Current call depth for overflow protection
depth: u16 = 0,
/// Whether the current context is read-only (STATICCALL)
read_only: bool = false,

/// Initialize VM with a jump table and corresponding chain rules.
///
/// @param allocator Memory allocator for VM operations
/// @param jump_table Optional jump table. If null, uses JumpTable.DEFAULT (latest hardfork)
/// @param chain_rules Optional chain rules. If null, uses ChainRules.DEFAULT (latest hardfork)
/// @return Initialized VM instance
/// @throws std.mem.Allocator.Error if allocation fails
///
/// Example with custom jump table and rules:
/// ```zig
/// const my_table = comptime JumpTable.init_from_hardfork(.BERLIN);
/// const my_rules = ChainRules.for_hardfork(.BERLIN);
/// var vm = try VM.init(allocator, &my_table, &my_rules);
/// ```
///
/// Example with default (latest):
/// ```zig
/// var vm = try VM.init(allocator, null, null);
/// ```
pub fn init(allocator: std.mem.Allocator, jump_table: ?*const JumpTable, chain_rules: ?*const ChainRules) !Vm {
    Log.debug("VM.init: Initializing VM with allocator", .{});

    var state = try EvmState.init(allocator);
    errdefer state.deinit();

    var access_list = AccessList.init(allocator);
    errdefer access_list.deinit();

    Log.debug("VM.init: VM initialization complete", .{});
    return Vm{
        .allocator = allocator,
        .table = (jump_table orelse &JumpTable.DEFAULT).*,
        .chain_rules = (chain_rules orelse &ChainRules.DEFAULT).*,
        .state = state,
        .context = Context.init(),
        .access_list = access_list,
    };
}

/// Initialize VM with a specific hardfork.
/// Convenience function that creates the jump table at runtime.
/// For production use, consider pre-generating the jump table at compile time.
/// @param allocator Memory allocator for VM operations
/// @param hardfork Ethereum hardfork to configure for
/// @return Initialized VM instance
/// @throws std.mem.Allocator.Error if allocation fails
pub fn init_with_hardfork(allocator: std.mem.Allocator, hardfork: Hardfork) !Vm {
    const table = JumpTable.init_from_hardfork(hardfork);
    const rules = ChainRules.for_hardfork(hardfork);
    return try init(allocator, &table, &rules);
}

/// Free all VM resources.
/// Must be called when finished with the VM to prevent memory leaks.
pub fn deinit(self: *Vm) void {
    self.state.deinit();
    self.access_list.deinit();
    Contract.clear_analysis_cache(self.allocator);
}

/// Execute contract bytecode and return the result.
///
/// This is the main execution entry point. The contract must be properly initialized
/// with bytecode, gas limit, and input data. The VM executes opcodes sequentially
/// until completion, error, or gas exhaustion.
///
/// Time complexity: O(n) where n is the number of opcodes executed.
/// Memory: May allocate for return data if contract returns output.
///
/// Example:
/// ```zig
/// var contract = Contract.init_at_address(caller, addr, 0, 100000, code, input, false);
/// defer contract.deinit(vm.allocator, null);
/// try vm.state.set_code(addr, code);
/// const result = try vm.interpret(&contract, input);
/// defer if (result.output) |output| vm.allocator.free(output);
/// ```
///
/// See also: interpret_static() for read-only execution
pub fn interpret(self: *Vm, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, false);
}

/// Execute contract bytecode in read-only mode.
/// Identical to interpret() but prevents any state modifications.
/// Used for view functions and static analysis.
pub fn interpret_static(self: *Vm, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, true);
}

/// Core bytecode execution with configurable static context.
/// Runs the main VM loop, executing opcodes sequentially while tracking
/// gas consumption and handling control flow changes.
pub fn interpret_with_context(self: *Vm, contract: *Contract, input: []const u8, is_static: bool) ExecutionError.Error!RunResult {
    @branchHint(.likely);
    Log.debug("VM.interpret_with_context: Starting execution, depth={}, gas={}, static={}", .{ self.depth, contract.gas, is_static });

    self.depth += 1;
    defer self.depth -= 1;

    const prev_read_only = self.read_only;
    defer self.read_only = prev_read_only;

    self.read_only = self.read_only or is_static;

    const initial_gas = contract.gas;
    var pc: usize = 0;
    var frame = try Frame.init(self.allocator, contract);
    defer frame.deinit();
    frame.memory.finalize_root();
    frame.is_static = self.read_only;
    frame.depth = @as(u32, @intCast(self.depth));
    frame.input = input;
    frame.gas_remaining = contract.gas;

    const interpreter_ptr = @as(*Operation.Interpreter, @ptrCast(self));
    const state_ptr = @as(*Operation.State, @ptrCast(&frame));

    while (pc < contract.code_size) {
        @branchHint(.likely);
        const opcode = contract.get_op(pc);
        frame.pc = pc;

        const result = self.table.execute(pc, interpreter_ptr, state_ptr, opcode) catch |err| {
            @branchHint(.cold);
            contract.gas = frame.gas_remaining;
            self.return_data = @constCast(frame.return_data_buffer);

            var output: ?[]const u8 = null;
            if (frame.return_data_buffer.len > 0) {
                output = self.allocator.dupe(u8, frame.return_data_buffer) catch {
                    // We are out of memory, which is a critical failure. The safest way to
                    // handle this is to treat it as an OutOfGas error, which consumes
                    // all gas and stops execution.
                    return RunResult.init(initial_gas, 0, .OutOfGas, ExecutionError.Error.OutOfMemory, null);
                };
            }

            return switch (err) {
                ExecutionError.Error.InvalidOpcode => {
                    @branchHint(.cold);
                    // INVALID opcode consumes all remaining gas
                    frame.gas_remaining = 0;
                    contract.gas = 0;
                    return RunResult.init(initial_gas, 0, .Invalid, err, output);
                },
                ExecutionError.Error.STOP => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Success, null, output);
                },
                ExecutionError.Error.REVERT => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Revert, err, output);
                },
                ExecutionError.Error.OutOfGas => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .OutOfGas, err, output);
                },
                ExecutionError.Error.InvalidJump,
                ExecutionError.Error.StackUnderflow,
                ExecutionError.Error.StackOverflow,
                ExecutionError.Error.StaticStateChange,
                ExecutionError.Error.WriteProtection,
                ExecutionError.Error.DepthLimit,
                ExecutionError.Error.MaxCodeSizeExceeded,
                ExecutionError.Error.OutOfMemory,
                => {
                    @branchHint(.cold);
                    return RunResult.init(initial_gas, frame.gas_remaining, .Invalid, err, output);
                },
                else => return err, // Unexpected error
            };
        };

        if (frame.pc != pc) {
            @branchHint(.likely);
            pc = frame.pc;
        } else {
            pc += result.bytes_consumed;
        }
    }

    contract.gas = frame.gas_remaining;
    self.return_data = @constCast(frame.return_data_buffer);

    const output: ?[]const u8 = if (frame.return_data_buffer.len > 0) try self.allocator.dupe(u8, frame.return_data_buffer) else null;

    return RunResult.init(
        initial_gas,
        frame.gas_remaining,
        .Success,
        null,
        output,
    );
}

fn create_contract_internal(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, gas: u64, new_address: Address.Address) !CreateResult {
    if (self.state.get_code(new_address).len > 0) {
        @branchHint(.unlikely);
        // Contract already exists at this address
        return CreateResult.initFailure(gas, null);
    }

    const creator_balance = self.state.get_balance(creator);
    if (creator_balance < value) {
        @branchHint(.unlikely);
        return CreateResult.initFailure(gas, null);
    }

    if (value > 0) {
        try self.state.set_balance(creator, creator_balance - value);
        try self.state.set_balance(new_address, value);
    }

    if (init_code.len == 0) {
        // No init code means empty contract
        return CreateResult{
            .success = true,
            .address = new_address,
            .gas_left = gas,
            .output = null,
        };
    }

    var hasher = Keccak256.init(.{});
    hasher.update(init_code);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    var init_contract = Contract.init(
        creator, // caller (who is creating this contract)
        new_address, // address (the new contract's address)
        value, // value being sent to this contract
        gas, // gas available for init code execution
        init_code, // the init code to execute
        code_hash, // hash of the init code
        &[_]u8{}, // no input data for init code
        false, // not static
    );
    defer init_contract.deinit(self.allocator, null);

    // Execute the init code - this should return the deployment bytecode
    const init_result = self.interpret_with_context(&init_contract, &[_]u8{}, false) catch |err| {
        if (err == ExecutionError.Error.REVERT) {
            // On revert, we should still consume gas but not all
            return CreateResult.initFailure(init_contract.gas, null);
        }

        // Most initcode failures should return 0 address and consume all gas
        return CreateResult.initFailure(0, null);
    };

    const deployment_code = init_result.output orelse &[_]u8{};

    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    if (deployment_code.len > constants.MAX_CODE_SIZE) {
        return CreateResult.initFailure(0, null);
    }

    const deploy_code_gas = @as(u64, @intCast(deployment_code.len)) * constants.DEPLOY_CODE_GAS_PER_BYTE;

    if (deploy_code_gas > init_result.gas_left) {
        return CreateResult.initFailure(0, null);
    }

    try self.state.set_code(new_address, deployment_code);

    const gas_left = init_result.gas_left - deploy_code_gas;

    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas_left,
        .output = deployment_code,
    };
}

// Contract creation with CREATE opcode
pub const CreateContractError = std.mem.Allocator.Error || Address.CalculateAddressError;

/// Create a new contract using CREATE opcode semantics.
///
/// Increments creator's nonce, calculates address via keccak256(rlp([sender, nonce])),
/// transfers value if specified, executes init code, and deploys resulting bytecode.
///
/// Parameters:
/// - creator: Account initiating contract creation
/// - value: Wei to transfer to new contract (0 for no transfer)
/// - init_code: Bytecode executed to generate contract code
/// - gas: Maximum gas for entire creation process
///
/// Returns CreateResult with success=false if:
/// - Creator balance < value (insufficient funds)
/// - Contract exists at calculated address (collision)
/// - Init code reverts or runs out of gas
/// - Deployed bytecode > 24,576 bytes (EIP-170)
/// - Insufficient gas for deployment (200 gas/byte)
///
/// Time complexity: O(init_code_length + deployed_code_length)
/// Memory: Allocates space for deployed bytecode
///
/// See also: create2_contract() for deterministic addresses
pub fn create_contract(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractError!CreateResult {
    const nonce = try self.state.increment_nonce(creator);
    const new_address = try Address.calculate_create_address(self.allocator, creator, nonce);
    return self.create_contract_internal(creator, value, init_code, gas, new_address);
}

pub const CallContractError = std.mem.Allocator.Error;

/// Execute a CALL operation to another contract or precompile.
///
/// This method handles both regular contract calls and precompile calls.
/// For precompiles, it routes to the appropriate precompile implementation.
/// For regular contracts, it currently returns failure (TODO: implement contract execution).
///
/// @param caller The address initiating the call
/// @param to The address being called (may be a precompile)
/// @param value The amount of ETH being transferred (must be 0 for static calls)
/// @param input Input data for the call
/// @param gas Gas limit available for the call
/// @param is_static Whether this is a static call (no state changes allowed)
/// @return CallResult indicating success/failure and return data
pub fn call_contract(self: *Vm, caller: Address.Address, to: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    @branchHint(.likely);

    Log.debug("VM.call_contract: Call from {any} to {any}, gas={}, static={}", .{ caller, to, gas, is_static });

    // Check if this is a precompile call
    if (precompiles.is_precompile(to)) {
        Log.debug("VM.call_contract: Detected precompile call to {any}", .{to});
        return self.execute_precompile_call(to, input, gas, is_static);
    }

    // Regular contract call - currently not implemented
    // TODO: Implement value transfer, gas calculation, recursive execution, and return data handling
    Log.debug("VM.call_contract: Regular contract call not implemented yet", .{});
    _ = value;
    return CallResult{ .success = false, .gas_left = gas, .output = null };
}

/// Execute a precompile call
///
/// This method handles the execution of precompiled contracts. It performs
/// the following steps:
/// 1. Check if the precompile is available in the current hardfork
/// 2. Validate that value transfers are zero (precompiles don't accept ETH)
/// 3. Estimate output buffer size and allocate memory
/// 4. Execute the precompile
/// 5. Handle success/failure and return appropriate CallResult
///
/// @param address The precompile address
/// @param input Input data for the precompile
/// @param gas Gas limit available for execution
/// @param is_static Whether this is a static call (doesn't affect precompiles)
/// @return CallResult with success/failure, gas usage, and output data
fn execute_precompile_call(self: *Vm, address: Address.Address, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    _ = is_static; // Precompiles are inherently stateless, so static flag doesn't matter

    Log.debug("VM.execute_precompile_call: Executing precompile at {any}, input_size={}, gas={}", .{ address, input.len, gas });

    // Get current chain rules
    const chain_rules = self.chain_rules;

    // Check if this precompile is available with current chain rules
    if (!precompiles.is_available(address, chain_rules)) {
        Log.debug("VM.execute_precompile_call: Precompile not available with current chain rules", .{});
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    }

    // Estimate required output buffer size
    const output_size = precompiles.get_output_size(address, input.len, chain_rules) catch |err| {
        Log.debug("VM.execute_precompile_call: Failed to get output size: {}", .{err});
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    };

    // Allocate output buffer
    const output_buffer = self.allocator.alloc(u8, output_size) catch |err| {
        Log.debug("VM.execute_precompile_call: Failed to allocate output buffer: {}", .{err});
        return error.OutOfMemory;
    };

    // Execute the precompile
    const result = precompiles.execute_precompile(address, input, output_buffer, gas, chain_rules);

    if (result.is_success()) {
        const gas_used = result.get_gas_used();
        const actual_output_size = result.get_output_size();

        Log.debug("VM.execute_precompile_call: Precompile succeeded, gas_used={}, output_size={}", .{ gas_used, actual_output_size });

        // Resize buffer to actual output size if needed
        if (actual_output_size < output_size) {
            const resized_output = self.allocator.realloc(output_buffer, actual_output_size) catch output_buffer;
            return CallResult{
                .success = true,
                .gas_left = gas - gas_used,
                .output = resized_output[0..actual_output_size]
            };
        }

        return CallResult{
            .success = true,
            .gas_left = gas - gas_used,
            .output = output_buffer[0..actual_output_size]
        };
    } else {
        // Free the allocated buffer on failure
        self.allocator.free(output_buffer);

        if (result.get_error()) |err| {
            Log.debug("VM.execute_precompile_call: Precompile failed with error: {any}", .{err});
        }

        return CallResult{ .success = false, .gas_left = gas, .output = null };
    }
}

pub const ConsumeGasError = ExecutionError.Error;

pub const Create2ContractError = std.mem.Allocator.Error || Address.CalculateCreate2AddressError;

/// Create a new contract using CREATE2 opcode semantics.
///
/// Calculates a deterministic address using keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:],
/// transfers value if specified, executes the initialization code, and deploys
/// the resulting bytecode. Unlike CREATE, the address is predictable before deployment.
pub fn create2_contract(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractError!CreateResult {
    // Calculate the new contract address using CREATE2 formula:
    // address = keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]
    const new_address = try Address.calculate_create2_address(self.allocator, creator, salt, init_code);
    return self.create_contract_internal(creator, value, init_code, gas, new_address);
}

pub const CallcodeContractError = std.mem.Allocator.Error;

// TODO
/// Execute a CALLCODE operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target code in current contract's context while preserving caller information.
pub fn callcode_contract(self: *Vm, current: Address.Address, code_address: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallcodeContractError!CallResult {
    _ = self;
    _ = current;
    _ = code_address;
    _ = value;
    _ = input;
    _ = gas;
    _ = is_static;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const DelegatecallContractError = std.mem.Allocator.Error;

/// Execute a DELEGATECALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target code with current caller and value context preserved.
pub fn delegatecall_contract(self: *Vm, current: Address.Address, code_address: Address.Address, input: []const u8, gas: u64, is_static: bool) DelegatecallContractError!CallResult {
    _ = self;
    _ = current;
    _ = code_address;
    _ = input;
    _ = gas;
    _ = is_static;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const StaticcallContractError = std.mem.Allocator.Error;

/// Execute a STATICCALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target contract in guaranteed read-only mode.
pub fn staticcall_contract(self: *Vm, caller: Address.Address, to: Address.Address, input: []const u8, gas: u64) StaticcallContractError!CallResult {
    _ = self;
    _ = caller;
    _ = to;
    _ = input;
    _ = gas;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const EmitLogError = std.mem.Allocator.Error;

/// Emit an event log (LOG0-LOG4 opcodes).
/// Records an event that will be included in the transaction receipt.
pub fn emit_log(self: *Vm, address: Address.Address, topics: []const u256, data: []const u8) EmitLogError!void {
    try self.state.emit_log(address, topics, data);
}

pub const InitTransactionAccessListError = AccessList.InitTransactionError;

/// Initialize the access list for a new transaction (EIP-2929).
/// Must be called at the start of each transaction to set up warm/cold access tracking.
pub fn init_transaction_access_list(self: *Vm, to: ?Address.Address) InitTransactionAccessListError!void {
    try self.access_list.init_transaction(self.context.tx_origin, self.context.block_coinbase, to);
}

pub const PreWarmAddressesError = AccessList.PreWarmAddressesError;

/// Mark addresses as warm to reduce gas costs for subsequent access.
/// Used with EIP-2930 access lists to pre-warm addresses in transactions.
/// Time complexity: O(n) where n is the number of addresses.
pub fn pre_warm_addresses(self: *Vm, addresses: []const Address.Address) PreWarmAddressesError!void {
    try self.access_list.pre_warm_addresses(addresses);
}

pub const PreWarmStorageSlotsError = AccessList.PreWarmStorageSlotsError;

/// Mark storage slots as warm to reduce gas costs for subsequent access.
/// Used with EIP-2930 access lists in transactions.
pub fn pre_warm_storage_slots(self: *Vm, address: Address.Address, slots: []const u256) PreWarmStorageSlotsError!void {
    try self.access_list.pre_warm_storage_slots(address, slots);
}

pub const GetAddressAccessCostError = AccessList.AccessAddressError;

/// Get the gas cost for accessing an address and mark it as warm.
/// Returns higher gas for first access, lower gas for subsequent access per EIP-2929.
/// Time complexity: O(1) with hash table lookup.
pub fn get_address_access_cost(self: *Vm, address: Address.Address) GetAddressAccessCostError!u64 {
    return self.access_list.access_address(address);
}

pub const GetStorageAccessCostError = AccessList.AccessStorageSlotError;

/// Get the gas cost for accessing a storage slot and mark it as warm.
/// Returns 2100 gas for cold access, 100 gas for warm access (Berlin hardfork).
pub fn get_storage_access_cost(self: *Vm, address: Address.Address, slot: u256) GetStorageAccessCostError!u64 {
    return self.access_list.access_storage_slot(address, slot);
}

pub const GetCallCostError = AccessList.GetCallCostError;

/// Get the additional gas cost for a CALL operation based on address warmth.
/// Returns extra gas required for calls to cold addresses (EIP-2929).
pub fn get_call_cost(self: *Vm, address: Address.Address) GetCallCostError!u64 {
    return self.access_list.get_call_cost(address);
}

pub const ValidateStaticContextError = error{WriteProtection};

/// Validate that state modifications are allowed in the current context.
/// Returns WriteProtection error if called within a static (read-only) context.
pub fn validate_static_context(self: *const Vm) ValidateStaticContextError!void {
    if (self.read_only) return error.WriteProtection;
}

pub const SetStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set a storage value with static context protection.
/// Used by the SSTORE opcode to prevent storage modifications in static calls.
pub fn set_storage_protected(self: *Vm, address: Address.Address, slot: u256, value: u256) SetStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_storage(address, slot, value);
}

pub const SetTransientStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set a transient storage value with static context protection.
/// Transient storage (EIP-1153) is cleared at the end of each transaction.
pub fn set_transient_storage_protected(self: *Vm, address: Address.Address, slot: u256, value: u256) SetTransientStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_transient_storage(address, slot, value);
}

pub const SetBalanceProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set an account balance with static context protection.
/// Prevents balance modifications during static calls.
pub fn set_balance_protected(self: *Vm, address: Address.Address, balance: u256) SetBalanceProtectedError!void {
    try self.validate_static_context();
    try self.state.set_balance(address, balance);
}

pub const SetCodeProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Deploy contract code with static context protection.
/// Prevents code deployment during static calls.
pub fn set_code_protected(self: *Vm, address: Address.Address, code: []const u8) SetCodeProtectedError!void {
    try self.validate_static_context();
    try self.state.set_code(address, code);
}

pub const EmitLogProtectedError = ValidateStaticContextError || EmitLogError;

/// Emit a log with static context protection.
/// Prevents log emission during static calls as logs modify the transaction state.
pub fn emit_log_protected(self: *Vm, address: Address.Address, topics: []const u256, data: []const u8) EmitLogProtectedError!void {
    try self.validate_static_context();
    try self.emit_log(address, topics, data);
}

pub const CreateContractProtectedError = ValidateStaticContextError || CreateContractError;

/// Create a contract with static context protection.
/// Prevents contract creation during static calls.
pub fn create_contract_protected(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create_contract(creator, value, init_code, gas);
}

pub const Create2ContractProtectedError = ValidateStaticContextError || Create2ContractError;

/// Create a contract with CREATE2 and static context protection.
/// Prevents contract creation during static calls.
pub fn create2_contract_protected(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create2_contract(creator, value, init_code, salt, gas);
}

pub const ValidateValueTransferError = error{WriteProtection};

/// Validate that value transfer is allowed in the current context.
/// Static calls cannot transfer value (msg.value must be 0).
pub fn validate_value_transfer(self: *const Vm, value: u256) ValidateValueTransferError!void {
    if (self.read_only and value != 0) return error.WriteProtection;
}

pub const SelfdestructProtectedError = ValidateStaticContextError;

/// Execute SELFDESTRUCT with static context protection.
/// NOT FULLY IMPLEMENTED - currently only validates static context.
/// TODO: Transfer remaining balance to beneficiary and mark contract for deletion.
pub fn selfdestruct_protected(self: *Vm, contract: Address.Address, beneficiary: Address.Address) SelfdestructProtectedError!void {
    _ = contract;
    _ = beneficiary;
    try self.validate_static_context();
}
````

````zig [src/evm/frame.zig]
const std = @import("std");
const Memory = @import("memory.zig");
const Stack = @import("stack/stack.zig");
const Contract = @import("contract/contract.zig");
const ExecutionError = @import("execution/execution_error.zig");
const Log = @import("log.zig");

/// EVM execution frame representing a single call context.
///
/// A Frame encapsulates all the state needed to execute a contract call,
/// including the stack, memory, gas tracking, and execution context.
/// Each contract call or message creates a new frame.
///
/// ## Frame Hierarchy
/// Frames form a call stack during execution:
/// - External transactions create the root frame
/// - CALL/CREATE operations create child frames
/// - Frames are limited by maximum call depth (1024)
///
/// ## Execution Model
/// The frame tracks:
/// - Computational state (stack, memory, PC)
/// - Gas consumption and limits
/// - Input/output data
/// - Static call restrictions
///
/// ## Memory Management
/// Each frame has its own memory space that:
/// - Starts empty and expands as needed
/// - Is cleared when the frame completes
/// - Charges quadratic gas for expansion
///
/// Example:
/// ```zig
/// var frame = try Frame.init(allocator, &contract);
/// defer frame.deinit();
/// frame.gas_remaining = 1000000;
/// try frame.stack.append(42);
/// ```
const Frame = @This();

/// Current opcode being executed (for debugging/tracing).
op: []const u8 = undefined,

/// Gas cost of current operation.
cost: u64 = 0,

/// Error that occurred during execution, if any.
err: ?ExecutionError.Error = null,

/// Frame's memory space for temporary data storage.
/// Grows dynamically and charges gas quadratically.
memory: Memory,

/// Operand stack for the stack machine.
/// Limited to 1024 elements per EVM rules.
stack: Stack,

/// Contract being executed in this frame.
/// Contains code, address, and contract metadata.
contract: *Contract,

/// Allocator for dynamic memory allocations.
allocator: std.mem.Allocator,

/// Flag indicating execution should halt.
/// Set by STOP, RETURN, REVERT, or errors.
stop: bool = false,

/// Remaining gas for this execution.
/// Decremented by each operation; execution fails at 0.
gas_remaining: u64 = 0,

/// Whether this is a STATICCALL context.
/// Prohibits state modifications (SSTORE, CREATE, SELFDESTRUCT).
is_static: bool = false,

/// Buffer containing return data from child calls.
/// Used by RETURNDATASIZE and RETURNDATACOPY opcodes.
return_data_buffer: []const u8 = &[_]u8{},

/// Input data for this call (calldata).
/// Accessed by CALLDATALOAD, CALLDATASIZE, CALLDATACOPY.
input: []const u8 = &[_]u8{},

/// Current call depth in the call stack.
/// Limited to 1024 to prevent stack overflow attacks.
depth: u32 = 0,

/// Output data to be returned from this frame.
/// Set by RETURN or REVERT operations.
output: []const u8 = &[_]u8{},

/// Current position in contract bytecode.
/// Incremented by opcode size, modified by JUMP/JUMPI.
pc: usize = 0,

/// Create a new execution frame with default settings.
///
/// Initializes a frame with empty stack and memory, ready for execution.
/// Gas and other parameters must be set after initialization.
///
/// @param allocator Memory allocator for dynamic allocations
/// @param contract The contract to execute
/// @return New frame instance
/// @throws OutOfMemory if memory initialization fails
///
/// Example:
/// ```zig
/// var frame = try Frame.init(allocator, &contract);
/// defer frame.deinit();
/// frame.gas_remaining = gas_limit;
/// frame.input = calldata;
/// ```
pub fn init(allocator: std.mem.Allocator, contract: *Contract) !Frame {
    return Frame{
        .allocator = allocator,
        .contract = contract,
        .memory = try Memory.init_default(allocator),
        .stack = .{},
    };
}

/// Create a frame with specific initial state.
///
/// Used for creating frames with pre-existing state, such as when
/// resuming execution or creating child frames with inherited state.
/// All parameters are optional and default to sensible values.
///
/// @param allocator Memory allocator
/// @param contract Contract to execute
/// @param op Current opcode (optional)
/// @param cost Gas cost of current op (optional)
/// @param err Existing error state (optional)
/// @param memory Pre-initialized memory (optional)
/// @param stack Pre-initialized stack (optional)
/// @param stop Halt flag (optional)
/// @param gas_remaining Available gas (optional)
/// @param is_static Static call flag (optional)
/// @param return_data_buffer Child return data (optional)
/// @param input Call data (optional)
/// @param depth Call stack depth (optional)
/// @param output Output buffer (optional)
/// @param pc Current PC (optional)
/// @return Configured frame instance
/// @throws OutOfMemory if memory initialization fails
///
/// Example:
/// ```zig
/// // Create child frame inheriting depth and static mode
/// const child_frame = try Frame.init_with_state(
///     allocator,
///     &child_contract,
///     .{ .depth = parent.depth + 1, .is_static = parent.is_static }
/// );
/// ```
pub fn init_with_state(
    allocator: std.mem.Allocator,
    contract: *Contract,
    op: ?[]const u8,
    cost: ?u64,
    err: ?ExecutionError.Error,
    memory: ?Memory,
    stack: ?Stack,
    stop: ?bool,
    gas_remaining: ?u64,
    is_static: ?bool,
    return_data_buffer: ?[]const u8,
    input: ?[]const u8,
    depth: ?u32,
    output: ?[]const u8,
    pc: ?usize,
) !Frame {
    return Frame{
        .allocator = allocator,
        .contract = contract,
        .memory = memory orelse try Memory.init_default(allocator),
        .stack = stack orelse .{},
        .op = op orelse undefined,
        .cost = cost orelse 0,
        .err = err,
        .stop = stop orelse false,
        .gas_remaining = gas_remaining orelse 0,
        .is_static = is_static orelse false,
        .return_data_buffer = return_data_buffer orelse &[_]u8{},
        .input = input orelse &[_]u8{},
        .depth = depth orelse 0,
        .output = output orelse &[_]u8{},
        .pc = pc orelse 0,
    };
}

/// Clean up frame resources.
///
/// Releases memory allocated by the frame. Must be called when
/// the frame is no longer needed to prevent memory leaks.
///
/// @param self The frame to clean up
pub fn deinit(self: *Frame) void {
    self.memory.deinit();
}

/// Error type for gas consumption operations.
pub const ConsumeGasError = error{
    /// Insufficient gas to complete operation
    OutOfGas,
};

/// Consume gas from the frame's remaining gas.
///
/// Deducts the specified amount from gas_remaining. If insufficient
/// gas is available, returns OutOfGas error and execution should halt.
///
/// @param self The frame consuming gas
/// @param amount Gas units to consume
/// @throws OutOfGas if amount > gas_remaining
///
/// Example:
/// ```zig
/// // Charge gas for operation
/// try frame.consume_gas(operation.constant_gas);
///
/// // Charge dynamic gas
/// const memory_cost = calculate_memory_gas(size);
/// try frame.consume_gas(memory_cost);
/// ```
pub fn consume_gas(self: *Frame, amount: u64) ConsumeGasError!void {
    if (amount > self.gas_remaining) {
        @branchHint(.cold);
        return ConsumeGasError.OutOfGas;
    }
    self.gas_remaining -= amount;
}
````

```zig [src/evm/execution/comparison.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");

// Helper to convert Stack errors to ExecutionError
// These are redundant and can be removed.
// The op_* functions below use unsafe stack operations,
// so these helpers are unused anyway.

pub fn op_lt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // EVM LT computes: a < b (where a was second from top, b was top)
    const result: u256 = if (a < b) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_gt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // EVM GT computes: a > b (where a was second from top, b was top)
    const result: u256 = if (a > b) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_slt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // Signed less than
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));

    const result: u256 = if (a_i256 < b_i256) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_sgt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // Signed greater than
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));

    const result: u256 = if (a_i256 > b_i256) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_eq(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a == b) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_iszero(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) {
        @branchHint(.cold);
        unreachable;
    }

    // Peek the operand unsafely
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a == 0) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
```

```zig [src/evm/execution/system.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Contract = @import("../contract/contract.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;
const gas_constants = @import("../constants/gas_constants.zig");
const AccessList = @import("../access_list/access_list.zig").AccessList;

// Import helper functions from error_mapping

// Gas opcode handler
pub fn gas_op(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try frame.stack.append(@as(u256, @intCast(frame.gas_remaining)));

    return Operation.ExecutionResult{};
}

// Helper to check if u256 fits in usize
fn check_offset_bounds(value: u256) ExecutionError.Error!void {
    if (value > std.math.maxInt(usize)) {
        @branchHint(.cold);
        return ExecutionError.Error.InvalidOffset;
    }
}

pub fn op_create(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Check if we're in a static call
    if (frame.is_static) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    const value = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    // Debug: CREATE opcode: value, offset, size

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) {
        @branchHint(.unlikely);
        return ExecutionError.Error.MaxCodeSizeExceeded;
    }

    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        try check_offset_bounds(offset);

        const offset_usize = @as(usize, @intCast(offset));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);

        // Ensure memory is available and get the slice
        _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);
        init_code = try frame.memory.get_slice(offset_usize, size_usize);
    }

    // Calculate gas for creation
    const init_code_cost = @as(u64, @intCast(init_code.len)) * gas_constants.CreateDataGas;

    // EIP-3860: Add gas cost for initcode word size (2 gas per 32-byte word) - Shanghai and later
    const initcode_word_cost = if (vm.chain_rules.IsEIP3860)
        @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.InitcodeWordGas
    else
        0;
    try frame.consume_gas(init_code_cost + initcode_word_cost);

    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);

    // Create the contract
    const result = try vm.create_contract(frame.contract.address, value, init_code, gas_for_call);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;

    if (!result.success) {
        @branchHint(.unlikely);
        try frame.stack.append(0);
        frame.return_data_buffer = result.output orelse &[_]u8{};
        return Operation.ExecutionResult{};
    }

    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try frame.stack.append(to_u256(result.address));

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    return Operation.ExecutionResult{};
}

/// CREATE2 opcode - Create contract with deterministic address
pub fn op_create2(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    const value = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    const salt = try frame.stack.pop();

    if (frame.depth >= 1024) {
        try frame.stack.append( 0);
        return Operation.ExecutionResult{};
    }

    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) {
        @branchHint(.unlikely);
        return ExecutionError.Error.MaxCodeSizeExceeded;
    }

    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        try check_offset_bounds(offset);

        const offset_usize = @as(usize, @intCast(offset));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);

        // Ensure memory is available and get the slice
        _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);
        init_code = try frame.memory.get_slice(offset_usize, size_usize);
    }

    const init_code_cost = @as(u64, @intCast(init_code.len)) * gas_constants.CreateDataGas;
    const hash_cost = @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.Keccak256WordGas;

    // EIP-3860: Add gas cost for initcode word size (2 gas per 32-byte word) - Shanghai and later
    const initcode_word_cost = if (vm.chain_rules.IsEIP3860)
        @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.InitcodeWordGas
    else
        0;
    try frame.consume_gas(init_code_cost + hash_cost + initcode_word_cost);

    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);

    // Create the contract with CREATE2
    const result = try vm.create2_contract(frame.contract.address, value, init_code, salt, gas_for_call);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;

    if (!result.success) {
        @branchHint(.unlikely);
        try frame.stack.append(0);
        frame.return_data_buffer = result.output orelse &[_]u8{};
        return Operation.ExecutionResult{};
    }

    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try frame.stack.append(to_u256(result.address));

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    return Operation.ExecutionResult{};
}

pub fn op_call(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const value = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        // Check that offset + size doesn't overflow and fits in usize
        if (args_offset > std.math.maxInt(usize) or args_size > std.math.maxInt(usize)) {
            @branchHint(.cold);
            return ExecutionError.Error.InvalidOffset;
        }
        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        // Check that offset + size doesn't overflow usize
        if (args_offset_usize > std.math.maxInt(usize) - args_size_usize) {
            @branchHint(.cold);
            return ExecutionError.Error.InvalidOffset;
        }

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        // Check that offset + size doesn't overflow and fits in usize
        if (ret_offset > std.math.maxInt(usize) or ret_size > std.math.maxInt(usize)) {
            @branchHint(.cold);
            return ExecutionError.Error.InvalidOffset;
        }
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        // Check that offset + size doesn't overflow usize
        if (ret_offset_usize > std.math.maxInt(usize) - ret_size_usize) {
            @branchHint(.cold);
            return ExecutionError.Error.InvalidOffset;
        }

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    if (frame.is_static and value != 0) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    const to_address = from_u256(to);

    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    if (value != 0) {
        gas_for_call += 2300; // Stipend
    }

    // Execute the call
    const result = try vm.call_contract(frame.contract.address, to_address, value, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_callcode(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const value = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    if (value != 0) {
        gas_for_call += 2300; // Stipend
    }

    // Execute the callcode (execute target's code with current storage context)
    // For callcode, we use the current contract's address as the execution context
    const result = try vm.callcode_contract(frame.contract.address, to_address, value, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_delegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    // Execute the delegatecall (execute target's code with current storage context and msg.sender/value)
    // For delegatecall, we preserve the current contract's context
    // Note: delegatecall doesn't transfer value, it uses the current contract's value
    const result = try vm.delegatecall_contract(frame.contract.address, to_address, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_staticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        @branchHint(.cold);
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.unlikely);
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    // Execute the static call (no value transfer, is_static = true)
    const result = try vm.call_contract(frame.contract.address, to_address, 0, args, gas_for_call, true);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        std.mem.copyForwards(u8, memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @branchHint(.unlikely);
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append(if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}
/// EXTCALL opcode (0xF8): External call with EOF validation
/// Not implemented - EOF feature
pub fn op_extcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}

/// EXTDELEGATECALL opcode (0xF9): External delegate call with EOF validation
/// Not implemented - EOF feature
pub fn op_extdelegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}

/// EXTSTATICCALL opcode (0xFB): External static call with EOF validation
/// Not implemented - EOF feature
pub fn op_extstaticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}
```

````zig [src/evm/execution/execution_result.zig]
//! ExecutionResult module - Represents the outcome of executing an EVM opcode
//!
//! This module defines the result structure returned by opcode execution functions.
//! Every opcode in the EVM returns an ExecutionResult that indicates:
//! - How many bytes of bytecode were consumed
//! - Whether execution should continue or halt (and if halting, what data to return)
//!
//! ## Design Philosophy
//!
//! The ExecutionResult struct provides a uniform interface for all opcode implementations
//! to communicate their results back to the main execution loop. This design allows for:
//! - Clean separation between opcode logic and control flow
//! - Efficient bytecode parsing without redundant position tracking
//! - Clear signaling of execution termination with associated data
//!
//! ## Usage Pattern
//!
//! ```zig
//! // In an opcode implementation
//! pub fn execute_add(vm: *VM) ExecutionResult {
//!     // Perform addition logic...
//!     return ExecutionResult{ .bytes_consumed = 1 }; // Continue execution
//! }
//!
//! pub fn execute_return(vm: *VM) ExecutionResult {
//!     const data = vm.memory.read_range(offset, size);
//!     return ExecutionResult{
//!         .bytes_consumed = 1,
//!         .output = data  // Non-empty output signals halt
//!     };
//! }
//! ```

const std = @import("std");

/// ExecutionResult holds the result of executing a single EVM opcode
///
/// This struct is returned by every opcode execution function to indicate:
/// 1. How many bytes of bytecode were consumed (opcode + immediate data)
/// 2. Whether execution should continue or halt (indicated by output)
///
/// The EVM execution loop uses this information to:
/// - Advance the program counter by `bytes_consumed`
/// - Determine whether to continue executing or return control to caller
/// - Pass return data back to the calling context when halting
const ExecutionResult = @This();

/// Number of bytes consumed by this opcode (including immediate data)
///
/// Most opcodes consume exactly 1 byte (just the opcode itself), but some
/// consume additional bytes for immediate data:
///
/// - **PUSH1-PUSH32**: Consume 1 + n bytes (opcode + n bytes of data)
/// - **All other opcodes**: Consume exactly 1 byte
///
/// The execution loop uses this value to advance the program counter (PC)
/// to the next instruction. Incorrect values here will cause the VM to
/// misinterpret subsequent bytecode.
///
/// ## Examples
/// - ADD opcode (0x01): bytes_consumed = 1
/// - PUSH1 0x42: bytes_consumed = 2 (1 for opcode, 1 for data)
/// - PUSH32 <32 bytes>: bytes_consumed = 33 (1 for opcode, 32 for data)
bytes_consumed: usize = 1,

/// Return data if the execution should halt (empty means continue)
///
/// This field serves a dual purpose:
/// 1. **Empty slice (`""`)**: Execution continues to the next instruction
/// 2. **Non-empty slice**: Execution halts and returns this data
///
/// Opcodes that halt execution include:
/// - **RETURN**: Returns specified data from memory
/// - **REVERT**: Returns revert data and reverts state changes
/// - **STOP**: Halts with empty return data (but still non-empty slice)
/// - **INVALID**: Halts with empty data and consumes all gas
/// - **SELFDESTRUCT**: Halts after scheduling account destruction
///
/// The data in this field is typically:
/// - Memory contents for RETURN/REVERT
/// - Empty (but allocated) slice for STOP/INVALID
/// - Contract creation bytecode for CREATE operations
///
/// ## Memory Management
/// The slice should reference memory owned by the VM's memory system
/// or be a compile-time constant empty slice. The execution loop does
/// not free this memory.
output: []const u8 = "",
````

```zig [src/evm/execution/arithmetic.zig]
/// Arithmetic operations for the Ethereum Virtual Machine
///
/// This module implements all arithmetic opcodes for the EVM, including basic
/// arithmetic (ADD, SUB, MUL, DIV), signed operations (SDIV, SMOD), modular
/// arithmetic (MOD, ADDMOD, MULMOD), exponentiation (EXP), and sign extension
/// (SIGNEXTEND).
///
/// ## Design Philosophy
///
/// All operations follow a consistent pattern:
/// 1. Pop operands from the stack (validated by jump table)
/// 2. Perform the arithmetic operation
/// 3. Push the result back onto the stack
///
/// ## Performance Optimizations
///
/// - **Unsafe Operations**: Stack bounds checking is done by the jump table,
///   allowing opcodes to use unsafe stack operations for maximum performance
/// - **In-Place Updates**: Results are written directly to stack slots to
///   minimize memory operations
/// - **Wrapping Arithmetic**: Uses Zig's wrapping operators (`+%`, `*%`, `-%`)
///   for correct 256-bit overflow behavior
///
/// ## EVM Arithmetic Rules
///
/// - All values are 256-bit unsigned integers (u256)
/// - Overflow wraps around (e.g., MAX_U256 + 1 = 0)
/// - Division by zero returns 0 (not an error)
/// - Modulo by zero returns 0 (not an error)
/// - Signed operations interpret u256 as two's complement i256
///
/// ## Gas Costs
///
/// - ADD, SUB, NOT: 3 gas (GasFastestStep)
/// - MUL, DIV, SDIV, MOD, SMOD: 5 gas (GasFastStep)
/// - ADDMOD, MULMOD, SIGNEXTEND: 8 gas (GasMidStep)
/// - EXP: 10 gas + 50 per byte of exponent
///
/// ## Stack Requirements
///
/// Operation    | Stack Input | Stack Output | Description
/// -------------|-------------|--------------|-------------
/// ADD          | [a, b]      | [a + b]      | Addition with overflow
/// MUL          | [a, b]      | [a * b]      | Multiplication with overflow
/// SUB          | [a, b]      | [a - b]      | Subtraction with underflow
/// DIV          | [a, b]      | [a / b]      | Division (b=0 returns 0)
/// SDIV         | [a, b]      | [a / b]      | Signed division
/// MOD          | [a, b]      | [a % b]      | Modulo (b=0 returns 0)
/// SMOD         | [a, b]      | [a % b]      | Signed modulo
/// ADDMOD       | [a, b, n]   | [(a+b)%n]    | Addition modulo n
/// MULMOD       | [a, b, n]   | [(a*b)%n]    | Multiplication modulo n
/// EXP          | [a, b]      | [a^b]        | Exponentiation
/// SIGNEXTEND   | [b, x]      | [y]          | Sign extend x from byte b
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");

/// ADD opcode (0x01) - Addition operation
///
/// Pops two values from the stack, adds them with wrapping overflow,
/// and pushes the result.
///
/// ## Stack Input
/// - `a`: First operand (second from top)
/// - `b`: Second operand (top)
///
/// ## Stack Output
/// - `a + b`: Sum with 256-bit wrapping overflow
///
/// ## Gas Cost
/// 3 gas (GasFastestStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate sum = (a + b) mod 2^256
/// 4. Push sum to stack
///
/// ## Example
/// Stack: [10, 20] => [30]
/// Stack: [MAX_U256, 1] => [0] (overflow wraps)
pub fn op_add(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const sum = a +% b;

    frame.stack.set_top_unsafe(sum);

    return Operation.ExecutionResult{};
}

/// MUL opcode (0x02) - Multiplication operation
///
/// Pops two values from the stack, multiplies them with wrapping overflow,
/// and pushes the result.
///
/// ## Stack Input
/// - `a`: First operand (second from top)
/// - `b`: Second operand (top)
///
/// ## Stack Output
/// - `a * b`: Product with 256-bit wrapping overflow
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate product = (a * b) mod 2^256
/// 4. Push product to stack
///
/// ## Example
/// Stack: [10, 20] => [200]
/// Stack: [2^128, 2^128] => [0] (overflow wraps)
pub fn op_mul(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;
    const product = a *% b;

    frame.stack.set_top_unsafe(product);

    return Operation.ExecutionResult{};
}

/// SUB opcode (0x03) - Subtraction operation
///
/// Pops two values from the stack, subtracts the top from the second,
/// with wrapping underflow, and pushes the result.
///
/// ## Stack Input
/// - `a`: Minuend (second from top)
/// - `b`: Subtrahend (top)
///
/// ## Stack Output
/// - `a - b`: Difference with 256-bit wrapping underflow
///
/// ## Gas Cost
/// 3 gas (GasFastestStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate result = (a - b) mod 2^256
/// 4. Push result to stack
///
/// ## Example
/// Stack: [30, 10] => [20]
/// Stack: [10, 20] => [2^256 - 10] (underflow wraps)
pub fn op_sub(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a -% b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// DIV opcode (0x04) - Unsigned integer division
///
/// Pops two values from the stack, divides the second by the top,
/// and pushes the integer quotient. Division by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend (second from top)
/// - `b`: Divisor (top)
///
/// ## Stack Output
/// - `a / b`: Integer quotient, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. If b = 0, result = 0 (no error)
/// 4. Else result = floor(a / b)
/// 5. Push result to stack
///
/// ## Example
/// Stack: [20, 5] => [4]
/// Stack: [7, 3] => [2] (integer division)
/// Stack: [100, 0] => [0] (division by zero)
///
/// ## Note
/// Unlike most programming languages, EVM division by zero does not
/// throw an error but returns 0. This is a deliberate design choice
/// to avoid exceptional halting conditions.
pub fn op_div(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = if (b == 0) blk: {
        @branchHint(.unlikely);
        break :blk 0;
    } else a / b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SDIV opcode (0x05) - Signed integer division
///
/// Pops two values from the stack, interprets them as signed integers,
/// divides the second by the top, and pushes the signed quotient.
/// Division by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend as signed i256 (second from top)
/// - `b`: Divisor as signed i256 (top)
///
/// ## Stack Output
/// - `a / b`: Signed integer quotient, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Interpret both as two's complement signed integers
/// 4. If b = 0, result = 0
/// 5. Else if a = -2^255 and b = -1, result = -2^255 (overflow case)
/// 6. Else result = truncated division a / b
/// 7. Push result to stack
///
/// ## Example
/// Stack: [20, 5] => [4]
/// Stack: [-20, 5] => [-4] (0xfff...fec / 5)
/// Stack: [-20, -5] => [4]
/// Stack: [MIN_I256, -1] => [MIN_I256] (overflow protection)
///
/// ## Note
/// The special case for MIN_I256 / -1 prevents integer overflow,
/// as the mathematical result (2^255) cannot be represented in i256.
pub fn op_sdiv(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (b == 0) {
        @branchHint(.unlikely);
        result = 0;
    } else {
        const a_i256 = @as(i256, @bitCast(a));
        const b_i256 = @as(i256, @bitCast(b));
        const min_i256 = @as(i256, 1) << 255;
        if (a_i256 == min_i256 and b_i256 == -1) {
            @branchHint(.unlikely);
            result = @as(u256, @bitCast(min_i256));
        } else {
            const result_i256 = @divTrunc(a_i256, b_i256);
            result = @as(u256, @bitCast(result_i256));
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// MOD opcode (0x06) - Modulo remainder operation
///
/// Pops two values from the stack, calculates the remainder of dividing
/// the second by the top, and pushes the result. Modulo by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend (second from top)
/// - `b`: Divisor (top)
///
/// ## Stack Output
/// - `a % b`: Remainder of a / b, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. If b = 0, result = 0 (no error)
/// 4. Else result = a modulo b
/// 5. Push result to stack
///
/// ## Example
/// Stack: [17, 5] => [2]
/// Stack: [100, 10] => [0]
/// Stack: [7, 0] => [0] (modulo by zero)
///
/// ## Note
/// The result is always in range [0, b-1] for b > 0.
/// Like DIV, modulo by zero returns 0 rather than throwing an error.
pub fn op_mod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = if (b == 0) blk: {
        @branchHint(.unlikely);
        break :blk 0;
    } else a % b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SMOD opcode (0x07) - Signed modulo remainder operation
///
/// Pops two values from the stack, interprets them as signed integers,
/// calculates the signed remainder, and pushes the result.
/// Modulo by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend as signed i256 (second from top)
/// - `b`: Divisor as signed i256 (top)
///
/// ## Stack Output
/// - `a % b`: Signed remainder, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Interpret both as two's complement signed integers
/// 4. If b = 0, result = 0
/// 5. Else result = signed remainder of a / b
/// 6. Push result to stack
///
/// ## Example
/// Stack: [17, 5] => [2]
/// Stack: [-17, 5] => [-2] (sign follows dividend)
/// Stack: [17, -5] => [2]
/// Stack: [-17, -5] => [-2]
///
/// ## Note
/// In signed modulo, the result has the same sign as the dividend (a).
/// This follows the Euclidean division convention where:
/// a = b * q + r, where |r| < |b| and sign(r) = sign(a)
pub fn op_smod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (b == 0) {
        @branchHint(.unlikely);
        result = 0;
    } else {
        const a_i256 = @as(i256, @bitCast(a));
        const b_i256 = @as(i256, @bitCast(b));
        const result_i256 = @rem(a_i256, b_i256);
        result = @as(u256, @bitCast(result_i256));
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// ADDMOD opcode (0x08) - Addition modulo n
///
/// Pops three values from the stack, adds the first two, then takes
/// the modulo with the third value. Handles overflow correctly by
/// computing (a + b) mod n, not ((a + b) mod 2^256) mod n.
///
/// ## Stack Input
/// - `a`: First addend (third from top)
/// - `b`: Second addend (second from top)
/// - `n`: Modulus (top)
///
/// ## Stack Output
/// - `(a + b) % n`: Sum modulo n, or 0 if n = 0
///
/// ## Gas Cost
/// 8 gas (GasMidStep)
///
/// ## Execution
/// 1. Pop n from stack (modulus)
/// 2. Pop b from stack (second addend)
/// 3. Pop a from stack (first addend)
/// 4. If n = 0, result = 0
/// 5. Else result = (a + b) mod n
/// 6. Push result to stack
///
/// ## Example
/// Stack: [10, 20, 7] => [2] ((10 + 20) % 7)
/// Stack: [MAX_U256, 5, 10] => [4] (overflow handled)
/// Stack: [50, 50, 0] => [0] (modulo by zero)
///
/// ## Note
/// This operation is atomic - the addition and modulo are
/// performed as one operation to handle cases where a + b
/// exceeds 2^256.
pub fn op_addmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) {
        @branchHint(.cold);
        unreachable;
    }

    const n = frame.stack.pop_unsafe();
    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (n == 0) {
        result = 0;
    } else {
        // The EVM ADDMOD operation computes (a + b) % n
        // Since we're working with u256, overflow wraps automatically
        // So (a +% b) gives us (a + b) mod 2^256
        // Then we just need to compute that result mod n
        const sum = a +% b; // Wrapping addition
        result = sum % n;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// MULMOD opcode (0x09) - Multiplication modulo n
///
/// Pops three values from the stack, multiplies the first two, then
/// takes the modulo with the third value. Correctly handles cases where
/// the product exceeds 2^256.
///
/// ## Stack Input
/// - `a`: First multiplicand (third from top)
/// - `b`: Second multiplicand (second from top)
/// - `n`: Modulus (top)
///
/// ## Stack Output
/// - `(a * b) % n`: Product modulo n, or 0 if n = 0
///
/// ## Gas Cost
/// 8 gas (GasMidStep)
///
/// ## Execution
/// 1. Pop n from stack (modulus)
/// 2. Pop b from stack (second multiplicand)
/// 3. Pop a from stack (first multiplicand)
/// 4. If n = 0, result = 0
/// 5. Else compute (a * b) mod n using Russian peasant algorithm
/// 6. Push result to stack
///
/// ## Algorithm
/// Uses Russian peasant multiplication with modular reduction:
/// - Reduces inputs modulo n first
/// - Builds product bit by bit, reducing modulo n at each step
/// - Avoids need for 512-bit intermediate values
///
/// ## Example
/// Stack: [10, 20, 7] => [4] ((10 * 20) % 7)
/// Stack: [2^128, 2^128, 100] => [0] (handles overflow)
/// Stack: [50, 50, 0] => [0] (modulo by zero)
///
/// ## Note
/// This operation correctly computes (a * b) mod n even when
/// a * b exceeds 2^256, unlike naive (a *% b) % n approach.
pub fn op_mulmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) {
        @branchHint(.cold);
        unreachable;
    }

    const n = frame.stack.pop_unsafe();
    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (n == 0) {
        result = 0;
    } else {
        // For MULMOD, we need to compute (a * b) % n where a * b might overflow
        // We can't just do (a *% b) % n because that would give us ((a * b) % 2^256) % n
        // which is not the same as (a * b) % n when a * b >= 2^256

        // We'll use the Russian peasant multiplication algorithm with modular reduction
        // This allows us to compute (a * b) % n without needing the full 512-bit product
        result = 0;
        var x = a % n;
        var y = b % n;

        while (y > 0) {
            // If y is odd, add x to result (mod n)
            if ((y & 1) == 1) {
                const sum = result +% x;
                result = sum % n;
            }

            x = (x +% x) % n;

            y >>= 1;
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// EXP opcode (0x0A) - Exponentiation
///
/// Pops two values from the stack and raises the second to the power
/// of the top. All operations are modulo 2^256.
///
/// ## Stack Input
/// - `a`: Base (second from top)
/// - `b`: Exponent (top)
///
/// ## Stack Output
/// - `a^b`: Result of a raised to power b, modulo 2^256
///
/// ## Gas Cost
/// - Static: 10 gas
/// - Dynamic: 50 gas per byte of exponent
/// - Total: 10 + 50 * byte_size_of_exponent
///
/// ## Execution
/// 1. Pop b from stack (exponent)
/// 2. Pop a from stack (base)
/// 3. Calculate dynamic gas cost based on exponent size
/// 4. Consume the dynamic gas
/// 5. Calculate a^b using binary exponentiation
/// 6. Push result to stack
///
/// ## Algorithm
/// Uses binary exponentiation (square-and-multiply):
/// - Processes exponent bit by bit
/// - Squares base for each bit position
/// - Multiplies result when bit is set
/// - All operations modulo 2^256
///
/// ## Example
/// Stack: [2, 10] => [1024]
/// Stack: [3, 4] => [81]
/// Stack: [10, 0] => [1] (anything^0 = 1)
/// Stack: [0, 10] => [0] (0^anything = 0, except 0^0 = 1)
///
/// ## Gas Examples
/// - 2^10: 10 + 50*1 = 60 gas (exponent fits in 1 byte)
/// - 2^256: 10 + 50*2 = 110 gas (exponent needs 2 bytes)
/// - 2^(2^255): 10 + 50*32 = 1610 gas (huge exponent)
pub fn op_exp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const exp = frame.stack.pop_unsafe();
    const base = frame.stack.peek_unsafe().*;

    var exp_copy = exp;
    var byte_size: u64 = 0;
    while (exp_copy > 0) : (exp_copy >>= 8) {
        byte_size += 1;
    }
    if (byte_size > 0) {
        @branchHint(.likely);
        const gas_cost = 50 * byte_size;
        try frame.consume_gas(gas_cost);
    }

    var result: u256 = 1;
    var b = base;
    var e = exp;

    while (e > 0) {
        if ((e & 1) == 1) {
            result *%= b;
        }
        b *%= b;
        e >>= 1;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SIGNEXTEND opcode (0x0B) - Sign extension
///
/// Extends the sign bit of a value from a given byte position to fill
/// all higher-order bits. Used to convert smaller signed integers to
/// full 256-bit representation.
///
/// ## Stack Input
/// - `b`: Byte position of sign bit (0-indexed from right)
/// - `x`: Value to sign-extend
///
/// ## Stack Output
/// - Sign-extended value
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack (byte position)
/// 2. Pop x from stack (value to extend)
/// 3. If b >= 31, return x unchanged (already full width)
/// 4. Find sign bit at position (b * 8 + 7)
/// 5. If sign bit = 1, fill higher bits with 1s
/// 6. If sign bit = 0, fill higher bits with 0s
/// 7. Push result to stack
///
/// ## Byte Position
/// - b = 0: Extend from byte 0 (bits 0-7, rightmost byte)
/// - b = 1: Extend from byte 1 (bits 8-15)
/// - b = 31: Extend from byte 31 (bits 248-255, leftmost byte)
///
/// ## Example
/// Stack: [0, 0x7F] => [0x7F] (positive sign, no change)
/// Stack: [0, 0x80] => [0xFFFF...FF80] (negative sign extended)
/// Stack: [1, 0x80FF] => [0xFFFF...80FF] (extend from byte 1)
/// Stack: [31, x] => [x] (already full width)
///
/// ## Use Cases
/// - Converting int8/int16/etc to int256
/// - Arithmetic on mixed-width signed integers
/// - Implementing higher-level language semantics
pub fn op_signextend(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const byte_num = frame.stack.pop_unsafe();
    const x = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (byte_num >= 31) {
        @branchHint(.unlikely);
        result = x;
    } else {
        const byte_index = @as(u8, @intCast(byte_num));
        const sign_bit_pos = byte_index * 8 + 7;

        const sign_bit = (x >> @intCast(sign_bit_pos)) & 1;

        const keep_bits = sign_bit_pos + 1;

        if (sign_bit == 1) {
            // First, create a mask of all 1s for the upper bits
            if (keep_bits >= 256) {
                result = x;
            } else {
                const shift_amount = @as(u9, 256) - @as(u9, keep_bits);
                const ones_mask = ~(@as(u256, 0) >> @intCast(shift_amount));
                result = x | ones_mask;
            }
        } else {
            // Sign bit is 0, extend with 0s (just mask out upper bits)
            if (keep_bits >= 256) {
                result = x;
            } else {
                const zero_mask = (@as(u256, 1) << @intCast(keep_bits)) - 1;
                result = x & zero_mask;
            }
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
```

```zig [src/evm/execution/control.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const ExecutionResult = @import("execution_result.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const AccessList = @import("../access_list/access_list.zig").AccessList;
const Address = @import("Address");
const from_u256 = Address.from_u256;

pub fn op_stop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    return ExecutionError.Error.STOP;
}

pub fn op_jump(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) {
        @branchHint(.cold);
        unreachable;
    }

    // Use unsafe pop since bounds checking is done by jump_table
    const dest = frame.stack.pop_unsafe();

    // Check if destination is a valid JUMPDEST (pass u256 directly)
    if (!frame.contract.valid_jumpdest(frame.allocator, dest)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.InvalidJump;
    }

    // After validation, convert to usize for setting pc
    if (dest > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.InvalidJump;
    }

    frame.pc = @as(usize, @intCast(dest));

    return ExecutionResult{};
}

pub fn op_jumpi(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const dest = values.b; // Second from top (was on top)
    const condition = values.a; // Third from top (was second)

    if (condition != 0) {
        @branchHint(.likely);
        // Check if destination is a valid JUMPDEST (pass u256 directly)
        if (!frame.contract.valid_jumpdest(frame.allocator, dest)) {
            @branchHint(.unlikely);
            return ExecutionError.Error.InvalidJump;
        }

        // After validation, convert to usize for setting pc
        if (dest > std.math.maxInt(usize)) {
            @branchHint(.unlikely);
            return ExecutionError.Error.InvalidJump;
        }

        frame.pc = @as(usize, @intCast(dest));
    }

    return ExecutionResult{};
}

pub fn op_pc(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) {
        @branchHint(.cold);
        unreachable;
    }

    // Use unsafe push since bounds checking is done by jump_table
    frame.stack.append_unsafe(@as(u256, @intCast(pc)));

    return ExecutionResult{};
}

pub fn op_jumpdest(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // No-op, just marks valid jump destination
    return ExecutionResult{};
}

pub fn op_return(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const size = values.b; // Second from top (was on top)
    const offset = values.a; // Third from top (was second)

    if (size == 0) {
        @branchHint(.unlikely);
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            @branchHint(.unlikely);
            return ExecutionError.Error.OutOfOffset;
        }

        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);

            _ = try frame.memory.ensure_context_capacity(end);
        }

        // Get data from memory
        const data = try frame.memory.get_slice(offset_usize, size_usize);

        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        frame.return_data_buffer = data;
    }

    return ExecutionError.Error.STOP; // RETURN ends execution normally
}

pub fn op_revert(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const size = values.b; // Second from top (was on top)
    const offset = values.a; // Third from top (was second)

    if (size == 0) {
        @branchHint(.unlikely);
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            @branchHint(.unlikely);
            return ExecutionError.Error.OutOfOffset;
        }

        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);

            _ = try frame.memory.ensure_context_capacity(end);
        }

        // Get data from memory
        const data = try frame.memory.get_slice(offset_usize, size_usize);

        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        frame.return_data_buffer = data;
    }

    return ExecutionError.Error.REVERT;
}

pub fn op_invalid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug: op_invalid entered
    // INVALID opcode consumes all remaining gas
    frame.gas_remaining = 0;
    // Debug: op_invalid returning InvalidOpcode

    return ExecutionError.Error.InvalidOpcode;
}

pub fn op_selfdestruct(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Check if we're in a static call
    if (frame.is_static) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    if (frame.stack.size < 1) {
        @branchHint(.cold);
        unreachable;
    }

    // Use unsafe pop since bounds checking is done by jump_table
    const beneficiary_u256 = frame.stack.pop_unsafe();
    const beneficiary = from_u256(beneficiary_u256);

    // EIP-2929: Check if beneficiary address is cold and consume appropriate gas
    const access_cost = vm.access_list.access_address(beneficiary) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        @branchHint(.likely);
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Schedule selfdestruct for execution at the end of the transaction
    // For now, just return STOP

    return ExecutionError.Error.STOP;
}
```

```zig [src/evm/execution/package.zig]
// Package file for execution modules
// This file serves as the entry point for importing execution modules

// Re-export all execution modules for easy access
pub const arithmetic = @import("arithmetic.zig");
pub const bitwise = @import("bitwise.zig");
pub const block = @import("block.zig");
pub const comparison = @import("comparison.zig");
pub const control = @import("control.zig");
pub const crypto = @import("crypto.zig");
pub const environment = @import("environment.zig");
pub const log = @import("log.zig");
pub const memory = @import("memory.zig");
pub const stack = @import("stack.zig");
pub const storage = @import("storage.zig");
pub const system = @import("system.zig");

// Re-export common types
pub const Operation = @import("../opcodes/operation.zig");
pub const ExecutionError = @import("execution_error.zig");
pub const Frame = @import("../frame.zig");
pub const Stack = @import("../stack/stack.zig");
pub const Memory = @import("../memory.zig");
pub const Vm = @import("../vm.zig");
pub const Contract = @import("../contract/contract.zig");
pub const gas_constants = @import("../constants/gas_constants.zig");
```

````zig [src/evm/execution/execution_error.zig]
const std = @import("std");

/// ExecutionError represents various error conditions that can occur during EVM execution
///
/// This module defines all possible error conditions that can occur during the execution
/// of EVM bytecode. These errors are used throughout the EVM implementation to signal
/// various failure conditions, from normal stops to critical errors.
///
/// ## Error Categories
///
/// The errors can be broadly categorized into:
///
/// 1. **Normal Termination**: STOP, REVERT, INVALID
/// 2. **Resource Exhaustion**: OutOfGas, StackOverflow, MemoryLimitExceeded
/// 3. **Invalid Operations**: InvalidJump, InvalidOpcode, StaticStateChange
/// 4. **Bounds Violations**: StackUnderflow, OutOfOffset, ReturnDataOutOfBounds
/// 5. **Contract Creation**: DeployCodeTooBig, MaxCodeSizeExceeded, InvalidCodeEntry
/// 6. **Call Stack**: DepthLimit
/// 7. **Memory Management**: OutOfMemory, InvalidOffset, InvalidSize, ChildContextActive
/// 8. **Future Features**: EOFNotSupported
const ExecutionError = @This();

/// Error types for EVM execution
///
/// Each error represents a specific condition that can occur during EVM execution.
/// Some errors (like STOP and REVERT) are normal termination conditions, while
/// others represent actual failure states.
pub const Error = error{
    /// Normal termination via STOP opcode (0x00)
    /// This is not an error condition - it signals successful completion
    STOP,

    /// State reversion via REVERT opcode (0xFD)
    /// Returns data and reverts all state changes in the current context
    REVERT,

    /// Execution of INVALID opcode (0xFE)
    /// Consumes all remaining gas and reverts state
    INVALID,

    /// Insufficient gas to complete operation
    /// Occurs when gas_remaining < gas_required for any operation
    OutOfGas,

    /// Attempted to pop from empty stack or insufficient stack items
    /// Stack operations require specific minimum stack sizes
    StackUnderflow,

    /// Stack size exceeded maximum of 1024 elements
    /// Pushing to a full stack causes this error
    StackOverflow,

    /// JUMP/JUMPI to invalid destination
    /// Destination must be a JUMPDEST opcode at a valid position
    InvalidJump,

    /// Attempted to execute undefined opcode
    /// Not all byte values 0x00-0xFF are defined opcodes
    InvalidOpcode,

    /// Attempted state modification in static call context
    /// SSTORE, LOG*, CREATE*, and SELFDESTRUCT are forbidden in static calls
    StaticStateChange,

    /// Memory or calldata access beyond valid bounds
    /// Usually from integer overflow in offset calculations
    OutOfOffset,

    /// Gas calculation resulted in integer overflow
    /// Can occur with extremely large memory expansions
    GasUintOverflow,

    /// Attempted write in read-only context
    /// Similar to StaticStateChange but more general
    WriteProtection,

    /// RETURNDATACOPY accessing data beyond RETURNDATASIZE
    /// Unlike other copy operations, this is a hard error
    ReturnDataOutOfBounds,

    /// Contract deployment code exceeds maximum size
    /// Deployment bytecode has its own size limits
    DeployCodeTooBig,

    /// Deployed contract code exceeds 24,576 byte limit (EIP-170)
    /// Prevents storing excessively large contracts
    MaxCodeSizeExceeded,

    /// Invalid contract initialization code
    /// Can occur with malformed constructor bytecode
    InvalidCodeEntry,

    /// Call stack depth exceeded 1024 levels
    /// Prevents infinite recursion and stack overflow attacks
    DepthLimit,

    /// Memory allocation failed (host environment issue)
    /// Not a normal EVM error - indicates system resource exhaustion
    OutOfMemory,

    /// Invalid memory offset in operation
    /// Usually from malformed offset values
    InvalidOffset,

    /// Invalid memory size in operation
    /// Usually from malformed size values
    InvalidSize,

    /// Memory expansion would exceed configured limits
    /// Prevents excessive memory usage (typically 32MB limit)
    MemoryLimitExceeded,

    /// Attempted operation while child memory context is active
    /// Memory contexts must be properly managed
    ChildContextActive,

    /// Attempted to revert/commit without active child context
    /// Memory context operations must be balanced
    NoChildContextToRevertOrCommit,

    /// EOF (EVM Object Format) features not yet implemented
    /// Placeholder for future EOF-related opcodes
    EOFNotSupported,
};

/// Get a human-readable description for an execution error
///
/// Provides detailed descriptions of what each error means and when it occurs.
/// Useful for debugging, logging, and error reporting.
///
/// ## Parameters
/// - `err`: The execution error to describe
///
/// ## Returns
/// A string slice containing a human-readable description of the error
///
/// ## Example
/// ```zig
/// const err = Error.StackOverflow;
/// const desc = get_description(err);
/// std.log.err("EVM execution failed: {s}", .{desc});
/// ```
pub fn get_description(err: Error) []const u8 {
    return switch (err) {
        Error.STOP => "Normal STOP opcode execution",
        Error.REVERT => "REVERT opcode - state reverted",
        Error.INVALID => "INVALID opcode or invalid operation",
        Error.OutOfGas => "Out of gas",
        Error.StackUnderflow => "Stack underflow",
        Error.StackOverflow => "Stack overflow (beyond 1024 elements)",
        Error.InvalidJump => "Jump to invalid destination",
        Error.InvalidOpcode => "Undefined opcode",
        Error.StaticStateChange => "State modification in static context",
        Error.OutOfOffset => "Memory access out of bounds",
        Error.GasUintOverflow => "Gas calculation overflow",
        Error.WriteProtection => "Write to protected storage",
        Error.ReturnDataOutOfBounds => "Return data access out of bounds",
        Error.DeployCodeTooBig => "Contract creation code too large",
        Error.MaxCodeSizeExceeded => "Contract code size exceeds limit",
        Error.InvalidCodeEntry => "Invalid contract entry code",
        Error.DepthLimit => "Call depth exceeds limit (1024)",
        Error.OutOfMemory => "Out of memory allocation failed",
        Error.InvalidOffset => "Invalid memory offset",
        Error.InvalidSize => "Invalid memory size",
        Error.MemoryLimitExceeded => "Memory limit exceeded",
        Error.ChildContextActive => "Child context is active",
        Error.NoChildContextToRevertOrCommit => "No child context to revert or commit",
        Error.EOFNotSupported => "EOF (EVM Object Format) opcode not supported",
    };
}
````

```zig [src/evm/execution/bitwise.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");

pub fn op_and(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a & b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_or(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a | b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_xor(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a ^ b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_not(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) {
        @branchHint(.cold);
        unreachable;
    }

    const value = frame.stack.peek_unsafe().*;

    const result = ~value;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_byte(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const i = frame.stack.pop_unsafe();
    const val = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (i >= 32) {
        @branchHint(.unlikely);
        result = 0;
    } else {
        const i_usize = @as(usize, @intCast(i));
        // Byte 0 is MSB, byte 31 is LSB
        // To get byte i, we need to shift right by (31 - i) * 8 positions
        const shift_amount = (31 - i_usize) * 8;
        result = (val >> @intCast(shift_amount)) & 0xFF;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_shl(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const shift = frame.stack.pop_unsafe();
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        @branchHint(.unlikely);
        result = 0;
    } else {
        result = value << @intCast(shift);
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_shr(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const shift = frame.stack.pop_unsafe();
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        @branchHint(.unlikely);
        result = 0;
    } else {
        result = value >> @intCast(shift);
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_sar(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    const shift = frame.stack.pop_unsafe();
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        @branchHint(.unlikely);
        const sign_bit = value >> 255;
        if (sign_bit == 1) {
            result = std.math.maxInt(u256);
        } else {
            result = 0;
        }
    } else {
        // Arithmetic shift preserving sign
        const shift_amount = @as(u8, @intCast(shift));
        const value_i256 = @as(i256, @bitCast(value));
        const result_i256 = value_i256 >> shift_amount;
        result = @as(u256, @bitCast(result_i256));
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
```

```zig [src/evm/execution/crypto.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");

pub fn op_sha3(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    // Check bounds before anything else
    if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    if (size == 0) {
        @branchHint(.unlikely);
        // Even with size 0, we need to validate the offset is reasonable
        if (offset > 0) {
            // Check if offset is beyond reasonable memory limits
            const offset_usize = @as(usize, @intCast(offset));
            const memory_limits = @import("../constants/memory_limits.zig");
            if (offset_usize > memory_limits.MAX_MEMORY_SIZE) {
                @branchHint(.unlikely);
                return ExecutionError.Error.OutOfOffset;
            }
        }
        // Hash of empty data = keccak256("")
        const empty_hash: u256 = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        try frame.stack.append(empty_hash);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));
    const size_usize = @as(usize, @intCast(size));

    // Check if offset + size would overflow
    const end = std.math.add(usize, offset_usize, size_usize) catch {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    };

    // Check if the end position exceeds reasonable memory limits
    const memory_limits = @import("../constants/memory_limits.zig");
    if (end > memory_limits.MAX_MEMORY_SIZE) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    // Dynamic gas cost for hashing
    const word_size = (size_usize + 31) / 32;
    const gas_cost = 6 * word_size;
    _ = vm;
    try frame.consume_gas(gas_cost);

    // Ensure memory is available
    _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);

    // Get data and hash
    const data = try frame.memory.get_slice(offset_usize, size_usize);

    // Calculate keccak256 hash
    var hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(data, &hash, .{});

    // Hash calculated successfully

    // Convert hash to u256 using std.mem for efficiency
    const result = std.mem.readInt(u256, &hash, .big);

    try frame.stack.append(result);

    return Operation.ExecutionResult{};
}

// Alias for backwards compatibility
pub const op_keccak256 = op_sha3;
```

```zig [src/evm/execution/environment.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;
const gas_constants = @import("../constants/gas_constants.zig");
const AccessList = @import("../access_list/access_list.zig").AccessList;

// Import helper functions from error_mapping

pub fn op_address(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push contract address as u256
    const addr = to_u256(frame.contract.address);
    try frame.stack.append(addr);

    return Operation.ExecutionResult{};
}

pub fn op_balance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get balance from VM state
    const balance = vm.state.get_balance(address);
    try frame.stack.append(balance);

    return Operation.ExecutionResult{};
}

pub fn op_origin(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push transaction origin address
    const origin = to_u256(vm.context.tx_origin);
    try frame.stack.append(origin);

    return Operation.ExecutionResult{};
}

pub fn op_caller(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push caller address
    const caller = to_u256(frame.contract.caller);
    try frame.stack.append(caller);

    return Operation.ExecutionResult{};
}

pub fn op_callvalue(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push call value
    try frame.stack.append(frame.contract.value);

    return Operation.ExecutionResult{};
}

pub fn op_gasprice(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push gas price from transaction context
    try frame.stack.append(vm.context.gas_price);

    return Operation.ExecutionResult{};
}

pub fn op_extcodesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get code size from VM state
    const code = vm.state.get_code(address);
    try frame.stack.append(@as(u256, @intCast(code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_extcodecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const mem_offset = try frame.stack.pop();
    const code_offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    if (size == 0) {
        @branchHint(.unlikely);
        return Operation.ExecutionResult{};
    }

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const address = from_u256(address_u256);
    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get external code from VM state
    const code = vm.state.get_code(address);

    // Use set_data_bounded to copy the code to memory
    // This handles partial copies and zero-padding automatically
    try frame.memory.set_data_bounded(mem_offset_usize, code, code_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_extcodehash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get code from VM state and compute hash
    const code = vm.state.get_code(address);
    if (code.len == 0) {
        @branchHint(.unlikely);
        // Empty account - return zero
        try frame.stack.append(0);
    } else {
        // Compute keccak256 hash of the code
        var hash: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(code, &hash, .{});

        // Convert hash to u256 using std.mem for efficiency
        const hash_u256 = std.mem.readInt(u256, &hash, .big);
        try frame.stack.append(hash_u256);
    }

    return Operation.ExecutionResult{};
}

pub fn op_selfbalance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get balance of current executing contract
    const self_address = frame.contract.address;
    const balance = vm.state.get_balance(self_address);
    try frame.stack.append(balance);

    return Operation.ExecutionResult{};
}

pub fn op_chainid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push chain ID from VM context
    try frame.stack.append(vm.context.chain_id);

    return Operation.ExecutionResult{};
}

pub fn op_calldatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push size of calldata - use frame.input which is set by the VM
    // The frame.input is the actual calldata for this execution context
    try frame.stack.append(@as(u256, @intCast(frame.input.len)));

    return Operation.ExecutionResult{};
}

pub fn op_codesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push size of current contract's code
    try frame.stack.append(@as(u256, @intCast(frame.contract.code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_calldataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop offset from stack
    const offset = try frame.stack.pop();

    if (offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        // Offset too large, push zero
        try frame.stack.append(0);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));
    const calldata = frame.input; // Use frame.input, not frame.contract.input

    // Load 32 bytes from calldata, padding with zeros if necessary
    var value: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        if (offset_usize + i < calldata.len) {
            @branchHint(.likely);
            value = (value << 8) | calldata[offset_usize + i];
        } else {
            value = value << 8; // Pad with zero
        }
    }

    try frame.stack.append(value);

    return Operation.ExecutionResult{};
}

pub fn op_calldatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop memory offset, data offset, and size
    const mem_offset = try frame.stack.pop();
    const data_offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    if (size == 0) {
        @branchHint(.unlikely);
        return Operation.ExecutionResult{};
    }

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation (VERYLOW * word_count)
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get calldata from frame.input
    const calldata = frame.input;

    // Use set_data_bounded to copy the calldata to memory
    // This handles partial copies and zero-padding automatically
    try frame.memory.set_data_bounded(mem_offset_usize, calldata, data_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_codecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop memory offset, code offset, and size
    const mem_offset = try frame.stack.pop();
    const code_offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    if (size == 0) {
        @branchHint(.unlikely);
        return Operation.ExecutionResult{};
    }

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get current contract code
    const code = frame.contract.code;

    // Use set_data_bounded to copy the code to memory
    // This handles partial copies and zero-padding automatically
    try frame.memory.set_data_bounded(mem_offset_usize, code, code_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}
/// RETURNDATALOAD opcode (0xF7): Loads a 32-byte word from return data
/// This is an EOF opcode that allows reading from the return data buffer
pub fn op_returndataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop offset from stack
    const offset = try frame.stack.pop();

    // Check if offset is within bounds
    if (offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const offset_usize = @as(usize, @intCast(offset));
    const return_data = frame.return_data_buffer;

    // If offset + 32 > return_data.len, this is an error (unlike CALLDATALOAD which pads with zeros)
    if (offset_usize + 32 > return_data.len) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    // Load 32 bytes from return data
    var value: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        value = (value << 8) | return_data[offset_usize + i];
    }

    try frame.stack.append(value);

    return Operation.ExecutionResult{};
}
```

```zig [src/evm/execution/log.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const Address = @import("Address");

// Compile-time verification that this file is being used
const COMPILE_TIME_LOG_VERSION = "2024_LOG_FIX_V2";

// Import Log struct from VM
const Log = Vm.Log;

// Import helper functions from error_mapping

pub fn make_log(comptime num_topics: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn log(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));
            const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

            // Debug logging removed for production

            // Check if we're in a static call
            if (frame.is_static) {
                @branchHint(.unlikely);
                return ExecutionError.Error.WriteProtection;
            }

            // REVM EXACT MATCH: Pop offset first, then len (revm: popn!([offset, len]))
            const offset = try frame.stack.pop();
            const size = try frame.stack.pop();

            // Debug logging removed for production

            // Pop N topics in order and store them in REVERSE (revm: stack.popn::<N>() returns in push order)
            var topics: [4]u256 = undefined;
            for (0..num_topics) |i| {
                topics[num_topics - 1 - i] = try frame.stack.pop();
                // Topic popped successfully
            }

            if (size == 0) {
                @branchHint(.unlikely);
                // Empty data - emit empty log
                try vm.emit_log(frame.contract.address, topics[0..num_topics], &[_]u8{});
                return Operation.ExecutionResult{};
            }

            // Process non-empty log data

            if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
                @branchHint(.unlikely);
                return ExecutionError.Error.OutOfOffset;
            }

            const offset_usize = @as(usize, @intCast(offset));
            const size_usize = @as(usize, @intCast(size));

            // Convert to usize for memory operations

            // Note: Base LOG gas (375) and topic gas (375 * N) are handled by jump table as constant_gas
            // We only need to handle dynamic costs: memory expansion and data bytes

            // 1. Calculate memory expansion gas cost
            const current_size = frame.memory.context_size();
            const new_size = offset_usize + size_usize;
            const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);

            // Memory expansion gas calculated

            try frame.consume_gas(memory_gas);

            // 2. Dynamic gas for data
            const byte_cost = gas_constants.LogDataGas * size_usize;

            // Calculate dynamic gas for data

            try frame.consume_gas(byte_cost);

            // Gas consumed successfully

            // Ensure memory is available
            _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);

            // Get log data
            const data = try frame.memory.get_slice(offset_usize, size_usize);

            // Emit log with data

            // Add log
            try vm.emit_log(frame.contract.address, topics[0..num_topics], data);

            return Operation.ExecutionResult{};
        }
    }.log;
}

// LOG operations are now generated directly in jump_table.zig using make_log()
```

```zig [src/evm/execution/memory.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Memory = @import("../memory.zig");
const gas_constants = @import("../constants/gas_constants.zig");

// Helper to check if u256 fits in usize
fn check_offset_bounds(value: u256) ExecutionError.Error!void {
    if (value > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.InvalidOffset;
    }
}

pub fn op_mload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) {
        @branchHint(.cold);
        unreachable;
    }

    // Get offset from top of stack unsafely - bounds checking is done in jump_table.zig
    const offset = frame.stack.peek_unsafe().*;

    if (offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 32;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);

    try frame.consume_gas(gas_cost);

    // Ensure memory is available - expand to word boundary to match gas calculation
    const word_aligned_size = ((offset_usize + 32 + 31) / 32) * 32;
    _ = try frame.memory.ensure_context_capacity(word_aligned_size);

    // Read 32 bytes from memory
    const value = try frame.memory.get_u256(offset_usize);

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

pub fn op_mstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // EVM Stack: [..., value, offset] where offset is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const offset = popped.b; // Second popped (was top)

    if (offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 32; // MSTORE writes 32 bytes
    const expansion_gas_cost = gas_constants.memory_gas_cost(current_size, new_size);

    try frame.consume_gas(expansion_gas_cost);

    // Ensure memory is available - expand to word boundary to match gas calculation
    const word_aligned_size = ((offset_usize + 32 + 31) / 32) * 32;
    _ = try frame.memory.ensure_context_capacity(word_aligned_size);

    // Write 32 bytes to memory (big-endian)
    var bytes: [32]u8 = undefined;
    // Convert u256 to big-endian bytes
    var temp = value;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        bytes[31 - i] = @intCast(temp & 0xFF);
        temp = temp >> 8;
    }
    try frame.memory.set_data(offset_usize, &bytes);

    return Operation.ExecutionResult{};
}

pub fn op_mstore8(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // EVM Stack: [..., value, offset] where offset is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const offset = popped.b; // Second popped (was top)

    if (offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 1;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(gas_cost);

    // Ensure memory is available - expand to word boundary to match gas calculation
    const word_aligned_size = ((new_size + 31) / 32) * 32;
    _ = try frame.memory.ensure_context_capacity(word_aligned_size);

    // Write single byte to memory
    const byte_value = @as(u8, @truncate(value));
    const bytes = [_]u8{byte_value};
    try frame.memory.set_data(offset_usize, &bytes);

    return Operation.ExecutionResult{};
}

pub fn op_msize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) {
        @branchHint(.cold);
        unreachable;
    }

    // MSIZE returns the size in bytes, but memory is always expanded in 32-byte words
    // So we need to round up to the nearest word boundary
    const size = frame.memory.context_size();
    const word_aligned_size = ((size + 31) / 32) * 32;

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(word_aligned_size)));

    return Operation.ExecutionResult{};
}

pub fn op_mcopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., dest, src, size] (top to bottom)
    const size = frame.stack.pop_unsafe();
    const src = frame.stack.pop_unsafe();
    const dest = frame.stack.pop_unsafe();

    if (size == 0) {
        @branchHint(.unlikely);
        return Operation.ExecutionResult{};
    }

    if (dest > std.math.maxInt(usize) or src > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const dest_usize = @as(usize, @intCast(dest));
    const src_usize = @as(usize, @intCast(src));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const max_addr = @max(dest_usize + size_usize, src_usize + size_usize);
    const memory_gas = gas_constants.memory_gas_cost(current_size, max_addr);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available for both source and destination
    _ = try frame.memory.ensure_context_capacity(max_addr);

    // Copy with overlap handling
    // Get memory slice and handle overlapping copy
    const mem_slice = frame.memory.slice();
    if (mem_slice.len >= max_addr) {
        @branchHint(.likely);
        // Handle overlapping memory copy correctly
        if (dest_usize > src_usize and dest_usize < src_usize + size_usize) {
            @branchHint(.unlikely);
            // Forward overlap: dest is within source range, copy backwards
            std.mem.copyBackwards(u8, mem_slice[dest_usize..dest_usize + size_usize], mem_slice[src_usize..src_usize + size_usize]);
        } else if (src_usize > dest_usize and src_usize < dest_usize + size_usize) {
            @branchHint(.unlikely);
            // Backward overlap: src is within dest range, copy forwards
            std.mem.copyForwards(u8, mem_slice[dest_usize..dest_usize + size_usize], mem_slice[src_usize..src_usize + size_usize]);
        } else {
            // No overlap, either direction is fine
            std.mem.copyForwards(u8, mem_slice[dest_usize..dest_usize + size_usize], mem_slice[src_usize..src_usize + size_usize]);
        }
    } else {
        return ExecutionError.Error.OutOfOffset;
    }

    return Operation.ExecutionResult{};
}

pub fn op_calldataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) {
        @branchHint(.cold);
        unreachable;
    }

    // Get offset from top of stack unsafely - bounds checking is done in jump_table.zig
    const offset = frame.stack.peek_unsafe().*;

    if (offset > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        // Replace top of stack with 0
        frame.stack.set_top_unsafe(0);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));

    // Read 32 bytes from calldata (pad with zeros)
    var result: u256 = 0;

    for (0..32) |i| {
        if (offset_usize + i < frame.input.len) {
            @branchHint(.likely);
            result = (result << 8) | frame.input[offset_usize + i];
        } else {
            result = result << 8;
        }
    }

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_calldatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) {
        @branchHint(.cold);
        unreachable;
    }

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.input.len)));

    return Operation.ExecutionResult{};
}

pub fn op_calldatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, data_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const data_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) {
        @branchHint(.unlikely);
        return Operation.ExecutionResult{};
    }

    if (mem_offset > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = try frame.memory.ensure_context_capacity(mem_offset_usize + size_usize);

    // Copy calldata to memory
    try frame.memory.set_data_bounded(mem_offset_usize, frame.input, data_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_codesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) {
        @branchHint(.cold);
        unreachable;
    }

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.contract.code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_codecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, code_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const code_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) {
        @branchHint(.unlikely);
        return Operation.ExecutionResult{};
    }

    if (mem_offset > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = try frame.memory.ensure_context_capacity(mem_offset_usize + size_usize);

    // Copy code to memory
    try frame.memory.set_data_bounded(mem_offset_usize, frame.contract.code, code_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_returndatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) {
        @branchHint(.cold);
        unreachable;
    }

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.return_data_buffer.len)));

    return Operation.ExecutionResult{};
}

pub fn op_returndatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, data_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const data_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) {
        @branchHint(.unlikely);
        return Operation.ExecutionResult{};
    }

    if (mem_offset > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfOffset;
    }

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Check bounds
    if (data_offset_usize + size_usize > frame.return_data_buffer.len) {
        @branchHint(.unlikely);
        return ExecutionError.Error.ReturnDataOutOfBounds;
    }

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = try frame.memory.ensure_context_capacity(mem_offset_usize + size_usize);

    // Copy return data to memory
    try frame.memory.set_data(mem_offset_usize, frame.return_data_buffer[data_offset_usize .. data_offset_usize + size_usize]);

    return Operation.ExecutionResult{};
}
```

```zig [src/evm/execution/storage.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const Address = @import("Address");
const Log = @import("../log.zig");

// EIP-3529 (London) gas costs for SSTORE
const SSTORE_SET_GAS: u64 = 20000;
const SSTORE_RESET_GAS: u64 = 2900;
const SSTORE_CLEARS_REFUND: u64 = 4800;

fn calculate_sstore_gas(current: u256, new: u256) u64 {
    if (current == new) {
        @branchHint(.likely);
        return 0;
    }
    if (current == 0) {
        @branchHint(.unlikely);
        return SSTORE_SET_GAS;
    }
    if (new == 0) {
        @branchHint(.unlikely);
        return SSTORE_RESET_GAS;
    }
    return SSTORE_RESET_GAS;
}

pub fn op_sload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.stack.size < 1) unreachable;

    const slot = frame.stack.peek_unsafe().*;

    if (vm.chain_rules.IsBerlin) {
        const is_cold = frame.contract.mark_storage_slot_warm(frame.allocator, slot, null) catch {
            return ExecutionError.Error.OutOfMemory;
        };
        const gas_cost = if (is_cold) gas_constants.ColdSloadCost else gas_constants.WarmStorageReadCost;
        try frame.consume_gas(gas_cost);
    } else {
        // Pre-Berlin: gas is handled by jump table constant_gas
        // For Istanbul, this would be 800 gas set in the jump table
    }

    const value = vm.state.get_storage(frame.contract.address, slot);

    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

/// SSTORE opcode - Store value in persistent storage
pub fn op_sstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    // EIP-1706: Disable SSTORE with gasleft lower than call stipend (2300)
    // This prevents reentrancy attacks by ensuring enough gas remains for exception handling
    if (vm.chain_rules.IsIstanbul and frame.gas_remaining <= gas_constants.SstoreSentryGas) {
        @branchHint(.unlikely);
        return ExecutionError.Error.OutOfGas;
    }

    if (frame.stack.size < 2) unreachable;

    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    const current_value = vm.state.get_storage(frame.contract.address, slot);

    const is_cold = frame.contract.mark_storage_slot_warm(frame.allocator, slot, null) catch |err| {
        Log.err("SSTORE: mark_storage_slot_warm failed: {}", .{err});
        return ExecutionError.Error.OutOfMemory;
    };

    var total_gas: u64 = 0;

    if (is_cold) {
        @branchHint(.unlikely);
        total_gas += gas_constants.ColdSloadCost;
    }

    // Add dynamic gas based on value change
    const dynamic_gas = calculate_sstore_gas(current_value, value);
    total_gas += dynamic_gas;

    // Consume all gas at once
    try frame.consume_gas(total_gas);

    try vm.state.set_storage(frame.contract.address, slot, value);

    return Operation.ExecutionResult{};
}

pub fn op_tload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Gas is already handled by jump table constant_gas = 100

    if (frame.stack.size < 1) unreachable;

    // Get slot from top of stack unsafely - bounds checking is done in jump_table.zig
    const slot = frame.stack.peek_unsafe().*;

    const value = vm.state.get_transient_storage(frame.contract.address, slot);

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

pub fn op_tstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) {
        @branchHint(.unlikely);
        return ExecutionError.Error.WriteProtection;
    }

    // Gas is already handled by jump table constant_gas = 100

    if (frame.stack.size < 2) unreachable;

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    try vm.state.set_transient_storage(frame.contract.address, slot, value);

    return Operation.ExecutionResult{};
}
```

```zig [src/evm/execution/stack.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");

pub fn op_pop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    _ = try frame.stack.pop();

    return Operation.ExecutionResult{};
}

pub fn op_push0(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try frame.stack.append(0);

    return Operation.ExecutionResult{};
}

// Generate push operations for PUSH1 through PUSH32
pub fn make_push(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn push(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            if (frame.stack.size >= Stack.CAPACITY) {
                @branchHint(.cold);
                unreachable;
            }

            var value: u256 = 0;
            const code = frame.contract.code;

            for (0..n) |i| {
                if (pc + 1 + i < code.len) {
                    @branchHint(.likely);
                    value = (value << 8) | code[pc + 1 + i];
                } else {
                    value = value << 8;
                }
            }

            frame.stack.append_unsafe(value);

            // PUSH operations consume 1 + n bytes
            // (1 for the opcode itself, n for the immediate data)
            return Operation.ExecutionResult{ .bytes_consumed = 1 + n };
        }
    }.push;
}

// PUSH operations are now generated directly in jump_table.zig using make_push()

// Generate dup operations
pub fn make_dup(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn dup(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            if (frame.stack.size < n) {
                @branchHint(.cold);
                unreachable;
            }
            if (frame.stack.size >= Stack.CAPACITY) {
                @branchHint(.cold);
                unreachable;
            }

            frame.stack.dup_unsafe(n);

            return Operation.ExecutionResult{};
        }
    }.dup;
}

// DUP operations are now generated directly in jump_table.zig using make_dup()

// Generate swap operations
pub fn make_swap(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn swap(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            if (frame.stack.size < n + 1) {
                @branchHint(.cold);
                unreachable;
            }

            frame.stack.swapUnsafe(n);

            return Operation.ExecutionResult{};
        }
    }.swap;
}

// SWAP operations are now generated directly in jump_table.zig using make_swap()
```

```zig [src/evm/execution/block.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Address = @import("Address");

pub fn op_blockhash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const block_number = try frame.stack.pop();

    const current_block = vm.context.block_number;

    if (block_number >= current_block) {
        @branchHint(.unlikely);
        try frame.stack.append(0);
    } else if (current_block > block_number + 256) {
        @branchHint(.unlikely);
        try frame.stack.append(0);
    } else if (block_number == 0) {
        @branchHint(.unlikely);
        try frame.stack.append(0);
    } else {
        // Return a pseudo-hash based on block number for testing
        // In production, this would retrieve the actual block hash from chain history
        const hash = std.hash.Wyhash.hash(0, std.mem.asBytes(&block_number));
        try frame.stack.append(hash);
    }

    return Operation.ExecutionResult{};
}

pub fn op_coinbase(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try frame.stack.append(Address.to_u256(vm.context.block_coinbase));

    return Operation.ExecutionResult{};
}

pub fn op_timestamp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try frame.stack.append(@as(u256, @intCast(vm.context.block_timestamp)));

    return Operation.ExecutionResult{};
}

pub fn op_number(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try frame.stack.append(@as(u256, @intCast(vm.context.block_number)));

    return Operation.ExecutionResult{};
}

pub fn op_difficulty(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get difficulty/prevrandao from block context
    // Post-merge this returns PREVRANDAO
    try frame.stack.append(vm.context.block_difficulty);

    return Operation.ExecutionResult{};
}

pub fn op_prevrandao(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    // Same as difficulty post-merge
    return op_difficulty(pc, interpreter, state);
}

pub fn op_gaslimit(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try frame.stack.append(@as(u256, @intCast(vm.context.block_gas_limit)));

    return Operation.ExecutionResult{};
}

pub fn op_basefee(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get base fee from block context
    // Push base fee (EIP-1559)
    try frame.stack.append(vm.context.block_base_fee);

    return Operation.ExecutionResult{};
}

pub fn op_blobhash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const index = try frame.stack.pop();

    // EIP-4844: Get blob hash at index
    if (index >= vm.context.blob_hashes.len) {
        @branchHint(.unlikely);
        try frame.stack.append(0);
    } else {
        const idx = @as(usize, @intCast(index));
        try frame.stack.append(vm.context.blob_hashes[idx]);
    }

    return Operation.ExecutionResult{};
}

pub fn op_blobbasefee(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get blob base fee from block context
    // Push blob base fee (EIP-4844)
    try frame.stack.append(vm.context.blob_base_fee);

    return Operation.ExecutionResult{};
}
```

```zig [src/evm/log.zig]
const std = @import("std");

/// Professional isomorphic logger for the EVM that works across all target architectures
/// including native platforms, WASI, and WASM environments. Uses the std_options.logFn
/// system for automatic platform adaptation.
///
/// Provides debug, error, and warning logging with EVM-specific prefixing.
/// Debug logs are optimized away in release builds for performance.

/// Debug log for development and troubleshooting
/// Optimized away in release builds for performance
pub fn debug(comptime format: []const u8, args: anytype) void {
    std.log.debug("[EVM] " ++ format, args);
}

/// Error log for critical issues that require attention
pub fn err(comptime format: []const u8, args: anytype) void {
    std.log.err("[EVM] " ++ format, args);
}

/// Warning log for non-critical issues and unexpected conditions
pub fn warn(comptime format: []const u8, args: anytype) void {
    std.log.warn("[EVM] " ++ format, args);
}

/// Info log for general information (use sparingly for performance)
pub fn info(comptime format: []const u8, args: anytype) void {
    std.log.info("[EVM] " ++ format, args);
}
```

````zig [src/evm/hardforks/chain_rules.zig]
const std = @import("std");
const Hardfork = @import("hardfork.zig").Hardfork;
const Log = @import("../log.zig");

/// Configuration for Ethereum protocol rules and EIP activations across hardforks.
///
/// This structure defines which Ethereum Improvement Proposals (EIPs) and protocol
/// rules are active during EVM execution. It serves as the central configuration
/// point for hardfork-specific behavior, enabling the EVM to correctly execute
/// transactions according to the rules of any supported Ethereum hardfork.
///
/// ## Purpose
/// The Ethereum protocol evolves through hardforks that introduce new features,
/// change gas costs, add opcodes, or modify execution semantics. This structure
/// encapsulates all these changes, allowing the EVM to maintain compatibility
/// with any point in Ethereum's history.
///
/// ## Default Configuration
/// By default, all fields are set to support the latest stable hardfork (Cancun),
/// ensuring new deployments get the most recent protocol features. Use the
/// `for_hardfork()` method to configure for specific historical hardforks.
///
/// ## Usage Pattern
/// ```zig
/// // Create rules for a specific hardfork
/// const rules = ChainRules.for_hardfork(.LONDON);
///
/// // Check if specific features are enabled
/// if (rules.IsEIP1559) {
///     // Use EIP-1559 fee market logic
/// }
/// ```
///
/// ## Hardfork Progression
/// The Ethereum mainnet hardfork progression:
/// 1. Frontier (July 2015) - Initial release
/// 2. Homestead (March 2016) - First major improvements
/// 3. DAO Fork (July 2016) - Emergency fork after DAO hack
/// 4. Tangerine Whistle (October 2016) - Gas repricing (EIP-150)
/// 5. Spurious Dragon (November 2016) - State cleaning (EIP-158)
/// 6. Byzantium (October 2017) - Major protocol upgrade
/// 7. Constantinople (February 2019) - Efficiency improvements
/// 8. Petersburg (February 2019) - Constantinople fix
/// 9. Istanbul (December 2019) - Gas cost adjustments
/// 10. Muir Glacier (January 2020) - Difficulty bomb delay
/// 11. Berlin (April 2021) - Gas improvements (EIP-2929)
/// 12. London (August 2021) - EIP-1559 fee market
/// 13. Arrow Glacier (December 2021) - Difficulty bomb delay
/// 14. Gray Glacier (June 2022) - Difficulty bomb delay
/// 15. The Merge (September 2022) - Proof of Stake transition
/// 16. Shanghai (April 2023) - Withdrawals enabled
/// 17. Cancun (March 2024) - Proto-danksharding
///
/// ## Memory Layout
/// This structure uses bool fields for efficient memory usage and fast access.
/// The compiler typically packs multiple bools together for cache efficiency.
pub const ChainRules = @This();

/// Homestead hardfork activation flag (March 2016).
///
/// ## Key Changes
/// - Fixed critical issues from Frontier release
/// - Introduced DELEGATECALL opcode (0xF4) for library pattern
/// - Changed difficulty adjustment algorithm
/// - Removed canary contracts
/// - Fixed gas cost inconsistencies
///
/// ## EVM Impact
/// - New opcode: DELEGATECALL for code reuse with caller's context
/// - Modified CREATE behavior for out-of-gas scenarios
/// - Changed gas costs for CALL operations
IsHomestead: bool = true,

/// EIP-150 "Tangerine Whistle" hardfork activation (October 2016).
///
/// ## Purpose
/// Addressed denial-of-service attack vectors by repricing operations
/// that were underpriced relative to their computational complexity.
///
/// ## Key Changes
/// - Increased gas costs for EXTCODESIZE, EXTCODECOPY, BALANCE, CALL, CALLCODE, DELEGATECALL
/// - Increased gas costs for SLOAD from 50 to 200
/// - 63/64 rule for CALL operations gas forwarding
/// - Max call depth reduced from 1024 to 1024 (stack-based)
///
/// ## Security Impact
/// Mitigated "Shanghai attacks" that exploited underpriced opcodes
/// to create transactions consuming excessive resources.
IsEIP150: bool = true,

/// EIP-158 "Spurious Dragon" hardfork activation (November 2016).
///
/// ## Purpose
/// State size reduction through removal of empty accounts,
/// complementing EIP-150's gas repricing.
///
/// ## Key Changes
/// - Empty account deletion (nonce=0, balance=0, code empty)
/// - Changed SELFDESTRUCT refund behavior
/// - Introduced EXP cost increase for large exponents
/// - Replay attack protection via chain ID
///
/// ## State Impact
/// Significantly reduced state size by removing ~20 million empty
/// accounts created by previous attacks.
IsEIP158: bool = true,

/// EIP-1559 fee market mechanism activation (London hardfork).
///
/// ## Purpose
/// Revolutionary change to Ethereum's fee mechanism introducing
/// base fee burning and priority fees (tips).
///
/// ## Key Changes
/// - Dynamic base fee adjusted per block based on utilization
/// - Base fee burned, reducing ETH supply
/// - Priority fee (tip) goes to miners/validators
/// - New transaction type (Type 2) with maxFeePerGas and maxPriorityFeePerGas
/// - BASEFEE opcode (0x48) to access current base fee
///
/// ## Economic Impact
/// - More predictable gas prices
/// - ETH becomes deflationary under high usage
/// - Better UX with fee estimation
IsEIP1559: bool = true,

/// Constantinople hardfork activation (February 2019).
///
/// ## Purpose
/// Optimization-focused upgrade adding cheaper operations and
/// preparing for future scaling solutions.
///
/// ## Key Changes
/// - New opcodes: SHL (0x1B), SHR (0x1C), SAR (0x1D) for bitwise shifting
/// - New opcode: EXTCODEHASH (0x3F) for cheaper code hash access
/// - CREATE2 (0xF5) for deterministic contract addresses
/// - Reduced gas costs for SSTORE operations (EIP-1283)
/// - Delayed difficulty bomb by 12 months
///
/// ## Developer Impact
/// - Bitwise operations enable more efficient algorithms
/// - CREATE2 enables counterfactual instantiation patterns
/// - Cheaper storage operations for certain patterns
IsConstantinople: bool = true,

/// Petersburg hardfork activation (February 2019).
///
/// ## Purpose
/// Emergency fix to Constantinople, disabling EIP-1283 due to
/// reentrancy concerns discovered before mainnet deployment.
///
/// ## Key Changes
/// - Removed EIP-1283 (SSTORE gas metering) from Constantinople
/// - Kept all other Constantinople features
/// - Essentially Constantinople minus problematic EIP
///
/// ## Historical Note
/// Constantinople was deployed on testnet but postponed on mainnet
/// when security researchers found the reentrancy issue. Petersburg
/// represents the actually deployed version.
IsPetersburg: bool = true,

/// Istanbul hardfork activation (December 2019).
///
/// ## Purpose
/// Gas cost adjustments based on real-world usage data and addition
/// of new opcodes for layer 2 support.
///
/// ## Key Changes
/// - EIP-152: Blake2b precompile for interoperability
/// - EIP-1108: Reduced alt_bn128 precompile gas costs
/// - EIP-1344: CHAINID opcode (0x46) for replay protection
/// - EIP-1884: Repricing for trie-size dependent opcodes
/// - EIP-2028: Reduced calldata gas cost (16 gas per non-zero byte)
/// - EIP-2200: Rebalanced SSTORE gas cost with stipend
///
/// ## Opcodes Added
/// - CHAINID (0x46): Returns the current chain ID
/// - SELFBALANCE (0x47): Get balance without expensive BALANCE call
///
/// ## Performance Impact
/// Significant reduction in costs for L2 solutions using calldata.
IsIstanbul: bool = true,

/// Berlin hardfork activation (April 2021).
///
/// ## Purpose
/// Major gas model reform introducing access lists and fixing
/// long-standing issues with state access pricing.
///
/// ## Key Changes
/// - EIP-2565: Reduced ModExp precompile gas cost
/// - EIP-2718: Typed transaction envelope framework
/// - EIP-2929: Gas cost increase for state access opcodes
/// - EIP-2930: Optional access lists (Type 1 transactions)
///
/// ## Access List Impact
/// - First-time SLOAD: 2100 gas (cold) vs 100 gas (warm)
/// - First-time account access: 2600 gas (cold) vs 100 gas (warm)
/// - Transactions can pre-declare accessed state for gas savings
///
/// ## Developer Considerations
/// Access lists allow contracts to optimize gas usage by pre-warming
/// storage slots and addresses they'll interact with.
IsBerlin: bool = true,

/// London hardfork activation (August 2021).
///
/// ## Purpose
/// Most significant economic change to Ethereum, introducing base fee
/// burning and dramatically improving fee predictability.
///
/// ## Key Changes
/// - EIP-1559: Fee market reform with base fee burning
/// - EIP-3198: BASEFEE opcode (0x48) to read current base fee
/// - EIP-3529: Reduction in refunds (SELFDESTRUCT, SSTORE)
/// - EIP-3541: Reject contracts starting with 0xEF byte
/// - EIP-3554: Difficulty bomb delay
///
/// ## EIP-3541 Impact
/// Reserves 0xEF prefix for future EVM Object Format (EOF),
/// preventing deployment of contracts with this prefix.
///
/// ## Economic Changes
/// - Base fee burned makes ETH potentially deflationary
/// - Gas price volatility significantly reduced
/// - Better fee estimation and user experience
IsLondon: bool = true,

/// The Merge activation (September 2022).
///
/// ## Purpose
/// Historic transition from Proof of Work to Proof of Stake,
/// reducing energy consumption by ~99.95%.
///
/// ## Key Changes
/// - EIP-3675: Consensus layer transition
/// - EIP-4399: DIFFICULTY (0x44) renamed to PREVRANDAO
/// - Removed block mining rewards
/// - Block time fixed at ~12 seconds
///
/// ## PREVRANDAO Usage
/// The DIFFICULTY opcode now returns the previous block's RANDAO
/// value, providing a source of randomness from the beacon chain.
/// Not suitable for high-security randomness needs.
///
/// ## Network Impact
/// - No more uncle blocks
/// - Predictable block times
/// - Validators replace miners
IsMerge: bool = true,

/// Shanghai hardfork activation (April 2023).
///
/// ## Purpose
/// First major upgrade post-Merge, enabling validator withdrawals
/// and introducing efficiency improvements.
///
/// ## Key Changes
/// - EIP-3651: Warm COINBASE address (reduced gas for MEV)
/// - EIP-3855: PUSH0 opcode (0x5F) for gas efficiency
/// - EIP-3860: Limit and meter initcode size
/// - EIP-4895: Beacon chain withdrawals
///
/// ## PUSH0 Impact
/// New opcode that pushes zero onto stack for 2 gas,
/// replacing common pattern of `PUSH1 0` (3 gas).
///
/// ## Withdrawal Mechanism
/// Validators can finally withdraw staked ETH, completing
/// the Proof of Stake transition.
IsShanghai: bool = true,

/// Cancun hardfork activation (March 2024).
///
/// ## Purpose
/// Major scalability upgrade introducing blob transactions for L2s
/// and transient storage for advanced contract patterns.
///
/// ## Key Changes
/// - EIP-1153: Transient storage opcodes (TLOAD 0x5C, TSTORE 0x5D)
/// - EIP-4844: Proto-danksharding with blob transactions
/// - EIP-4788: Beacon block root in EVM
/// - EIP-5656: MCOPY opcode (0x5E) for memory copying
/// - EIP-6780: SELFDESTRUCT only in same transaction
/// - EIP-7516: BLOBBASEFEE opcode (0x4A)
///
/// ## Blob Transactions
/// New transaction type carrying data blobs (4096 field elements)
/// for L2 data availability at ~10x lower cost.
///
/// ## Transient Storage
/// Storage that persists only within a transaction, enabling
/// reentrancy locks and other patterns without permanent storage.
IsCancun: bool = true,

/// Prague hardfork activation flag (future upgrade).
///
/// ## Status
/// Not yet scheduled or fully specified. Expected to include:
/// - EOF (EVM Object Format) implementation
/// - Account abstraction improvements
/// - Further gas optimizations
///
/// ## Note
/// This flag is reserved for future use and should remain
/// false until Prague specifications are finalized.
IsPrague: bool = false,

/// Verkle trees activation flag (future upgrade).
///
/// ## Purpose
/// Fundamental change to Ethereum's state storage using Verkle trees
/// instead of Merkle Patricia tries for massive witness size reduction.
///
/// ## Expected Benefits
/// - Witness sizes reduced from ~10MB to ~200KB
/// - Enables stateless clients
/// - Improved sync times and network efficiency
///
/// ## Status
/// Under active research and development. Will require extensive
/// testing before mainnet deployment.
IsVerkle: bool = false,

/// Byzantium hardfork activation (October 2017).
///
/// ## Purpose
/// Major protocol upgrade adding privacy features and improving
/// smart contract capabilities.
///
/// ## Key Changes
/// - New opcodes: REVERT (0xFD), RETURNDATASIZE (0x3D), RETURNDATACOPY (0x3E)
/// - New opcode: STATICCALL (0xFA) for read-only calls
/// - Added precompiles for zkSNARK verification (alt_bn128)
/// - Difficulty bomb delay by 18 months
/// - Block reward reduced from 5 to 3 ETH
///
/// ## REVERT Impact
/// Allows contracts to revert with data, enabling better error
/// messages while still refunding remaining gas.
///
/// ## Privacy Features
/// zkSNARK precompiles enable privacy-preserving applications
/// like private transactions and scalability solutions.
IsByzantium: bool = true,

/// EIP-2930 optional access lists activation (Berlin hardfork).
///
/// ## Purpose
/// Introduces Type 1 transactions with optional access lists,
/// allowing senders to pre-declare state they'll access.
///
/// ## Benefits
/// - Mitigates breaking changes from EIP-2929 gas increases
/// - Allows gas savings by pre-warming storage slots
/// - Provides predictable gas costs for complex interactions
///
/// ## Transaction Format
/// Type 1 transactions include an access list of:
/// - Addresses to be accessed
/// - Storage keys per address to be accessed
///
/// ## Gas Savings
/// Pre-declaring access saves ~2000 gas per address and
/// ~2000 gas per storage slot on first access.
IsEIP2930: bool = true,

/// EIP-3198 BASEFEE opcode activation (London hardfork).
///
/// ## Purpose
/// Provides smart contracts access to the current block's base fee,
/// enabling on-chain fee market awareness.
///
/// ## Opcode Details
/// - BASEFEE (0x48): Pushes current block's base fee onto stack
/// - Gas cost: 2 (same as other block context opcodes)
///
/// ## Use Cases
/// - Fee estimation within contracts
/// - Conditional execution based on network congestion
/// - MEV-aware contract patterns
/// - Gas price oracles
///
/// ## Complementary to EIP-1559
/// Essential for contracts to interact properly with the
/// new fee market mechanism.
IsEIP3198: bool = true,

/// EIP-3651 warm COINBASE activation (Shanghai hardfork).
///
/// ## Purpose
/// Pre-warms the COINBASE address (block producer) to reduce gas costs
/// for common patterns, especially in MEV transactions.
///
/// ## Gas Impact
/// - Before: First COINBASE access costs 2600 gas (cold)
/// - After: COINBASE always costs 100 gas (warm)
///
/// ## MEV Considerations
/// Critical for MEV searchers and builders who frequently
/// interact with the block producer address for payments.
///
/// ## Implementation
/// The COINBASE address is added to the warm address set
/// at the beginning of transaction execution.
IsEIP3651: bool = true,

/// EIP-3855 PUSH0 instruction activation (Shanghai hardfork).
///
/// ## Purpose
/// Introduces dedicated opcode for pushing zero onto the stack,
/// optimizing a very common pattern in smart contracts.
///
/// ## Opcode Details
/// - PUSH0 (0x5F): Pushes 0 onto the stack
/// - Gas cost: 2 (base opcode cost)
/// - Replaces: PUSH1 0x00 (costs 3 gas)
///
/// ## Benefits
/// - 33% gas reduction for pushing zero
/// - Smaller bytecode (1 byte vs 2 bytes)
/// - Cleaner assembly code
///
/// ## Usage Statistics
/// Analysis showed ~11% of all PUSH operations push zero,
/// making this a significant optimization.
IsEIP3855: bool = true,

/// EIP-3860 initcode size limit activation (Shanghai hardfork).
///
/// ## Purpose
/// Introduces explicit limits and gas metering for contract creation
/// code to prevent DoS vectors and ensure predictable costs.
///
/// ## Key Limits
/// - Maximum initcode size: 49152 bytes (2x max contract size)
/// - Gas cost: 2 gas per 32-byte word of initcode
///
/// ## Affected Operations
/// - CREATE: Limited initcode size
/// - CREATE2: Limited initcode size
/// - Contract creation transactions
///
/// ## Security Rationale
/// Previously unlimited initcode could cause nodes to consume
/// excessive resources during contract deployment verification.
IsEIP3860: bool = true,

/// EIP-4895 beacon chain withdrawals activation (Shanghai hardfork).
///
/// ## Purpose
/// Enables validators to withdraw staked ETH from the beacon chain
/// to the execution layer, completing the PoS transition.
///
/// ## Mechanism
/// - Withdrawals are processed as system-level operations
/// - Not regular transactions - no gas cost or signature
/// - Automatically credited to withdrawal addresses
/// - Up to 16 withdrawals per block
///
/// ## Validator Operations
/// - Partial withdrawals: Excess balance above 32 ETH
/// - Full withdrawals: Complete exit from validation
///
/// ## Network Impact
/// Completes the Ethereum staking lifecycle, allowing validators
/// to access their staked funds and rewards.
IsEIP4895: bool = true,

/// EIP-4844 proto-danksharding activation (Cancun hardfork).
///
/// ## Purpose
/// Introduces blob-carrying transactions for scalable data availability,
/// reducing L2 costs by ~10-100x through temporary data storage.
///
/// ## Blob Details
/// - Size: 4096 field elements (~125 KB)
/// - Max per block: 6 blobs (~750 KB)
/// - Retention: ~18 days (4096 epochs)
/// - Separate fee market with blob base fee
///
/// ## New Components
/// - Type 3 transactions with blob commitments
/// - KZG commitments for data availability proofs
/// - Blob fee market independent of execution gas
/// - BLOBHASH opcode (0x49) to access blob commitments
///
/// ## L2 Impact
/// Dramatically reduces costs for rollups by providing
/// dedicated data availability layer.
IsEIP4844: bool = true,

/// EIP-1153 transient storage activation (Cancun hardfork).
///
/// ## Purpose
/// Introduces transaction-scoped storage that automatically clears
/// after execution, enabling efficient temporary data patterns.
///
/// ## New Opcodes
/// - TLOAD (0x5C): Load from transient storage
/// - TSTORE (0x5D): Store to transient storage
/// - Gas costs: 100 for TLOAD, 100 for TSTORE
///
/// ## Key Properties
/// - Cleared after each transaction (not persisted)
/// - Reverted on transaction failure
/// - Separate namespace from persistent storage
/// - More gas efficient than SSTORE/SLOAD for temporary data
///
/// ## Use Cases
/// - Reentrancy guards without storage slots
/// - Temporary computation results
/// - Cross-contract communication within transaction
IsEIP1153: bool = true,

/// EIP-5656 MCOPY instruction activation (Cancun hardfork).
///
/// ## Purpose
/// Native memory copying instruction replacing inefficient
/// loop-based implementations in smart contracts.
///
/// ## Opcode Details
/// - MCOPY (0x5E): Copy memory regions
/// - Stack: [dest_offset, src_offset, length]
/// - Gas: 3 + 3 * ceil(length / 32) + memory expansion
///
/// ## Performance Impact
/// - ~10x faster than Solidity's loop-based copying
/// - Reduces bytecode size for memory operations
/// - Critical for data-heavy operations
///
/// ## Common Patterns
/// Optimizes array copying, string manipulation, and
/// data structure operations in smart contracts.
IsEIP5656: bool = true,

/// EIP-3541 contract code prefix restriction (London hardfork).
///
/// ## Purpose
/// Reserves the 0xEF byte prefix for future EVM Object Format (EOF),
/// preventing deployment of contracts with this prefix.
///
/// ## Restrictions
/// - New contracts cannot start with 0xEF byte
/// - Applies to CREATE, CREATE2, and deployment transactions
/// - Existing contracts with 0xEF prefix remain valid
///
/// ## EOF Preparation
/// This reservation enables future introduction of:
/// - Structured contract format with metadata
/// - Separate code and data sections
/// - Static jumps and improved analysis
/// - Versioning for EVM upgrades
///
/// ## Developer Impact
/// Extremely rare in practice as 0xEF was not a valid opcode,
/// making accidental conflicts unlikely.
IsEIP3541: bool = true,

/// Creates a ChainRules configuration for a specific Ethereum hardfork.
///
/// This factory function generates the appropriate set of protocol rules
/// for any supported hardfork, enabling the EVM to execute transactions
/// according to historical consensus rules.
///
/// ## Parameters
/// - `hardfork`: The target hardfork to configure rules for
///
/// ## Returns
/// A fully configured ChainRules instance with all flags set appropriately
/// for the specified hardfork.
///
/// ## Algorithm
/// The function starts with all features enabled (latest hardfork) and then
/// selectively disables features that weren't available at the specified
/// hardfork. This approach ensures new features are automatically included
/// in the latest configuration.
///
/// ## Example
/// ```zig
/// // Configure EVM for London hardfork rules
/// const london_rules = ChainRules.for_hardfork(.LONDON);
///
/// // Configure EVM for historical execution (e.g., replaying old blocks)
/// const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
/// ```
///
/// ## Hardfork Ordering
/// Each hardfork case disables all features introduced after it,
/// maintaining historical accuracy for transaction replay and testing.
/// Mapping of chain rule fields to the hardfork in which they were introduced.
const HardforkRule = struct {
    field_name: []const u8,
    introduced_in: Hardfork,
};

/// Comptime-generated mapping of all chain rules to their introduction hardforks.
/// This data-driven approach replaces the massive switch statement.
/// Default chain rules for the latest hardfork (CANCUN).
/// Pre-generated at compile time for zero runtime overhead.
pub const DEFAULT = for_hardfork(.DEFAULT);

const HARDFORK_RULES = [_]HardforkRule{
    .{ .field_name = "IsHomestead", .introduced_in = .HOMESTEAD },
    .{ .field_name = "IsEIP150", .introduced_in = .TANGERINE_WHISTLE },
    .{ .field_name = "IsEIP158", .introduced_in = .SPURIOUS_DRAGON },
    .{ .field_name = "IsByzantium", .introduced_in = .BYZANTIUM },
    .{ .field_name = "IsConstantinople", .introduced_in = .CONSTANTINOPLE },
    .{ .field_name = "IsPetersburg", .introduced_in = .PETERSBURG },
    .{ .field_name = "IsIstanbul", .introduced_in = .ISTANBUL },
    .{ .field_name = "IsBerlin", .introduced_in = .BERLIN },
    .{ .field_name = "IsLondon", .introduced_in = .LONDON },
    .{ .field_name = "IsMerge", .introduced_in = .MERGE },
    .{ .field_name = "IsShanghai", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsCancun", .introduced_in = .CANCUN },
    // EIPs grouped by their hardfork
    .{ .field_name = "IsEIP1559", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP2930", .introduced_in = .BERLIN },
    .{ .field_name = "IsEIP3198", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP3541", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP3651", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP3855", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP3860", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP4895", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP4844", .introduced_in = .CANCUN },
    .{ .field_name = "IsEIP1153", .introduced_in = .CANCUN },
    .{ .field_name = "IsEIP5656", .introduced_in = .CANCUN },
};

pub fn for_hardfork(hardfork: Hardfork) ChainRules {
    var rules = ChainRules{}; // All fields default to true

    // Disable features that were introduced after the target hardfork
    inline for (HARDFORK_RULES) |rule| {
        // Use branch hint for the common case (later hardforks with more features)
        if (@intFromEnum(hardfork) < @intFromEnum(rule.introduced_in)) {
            @branchHint(.cold);
            @field(rules, rule.field_name) = false;
        } else {
            @branchHint(.likely);
        }
    }

    return rules;
}
````

````zig [src/evm/hardforks/hardfork.zig]
/// Ethereum hardfork identifiers.
///
/// Hardforks represent protocol upgrades that change EVM behavior,
/// gas costs, or add new features. Each hardfork builds upon the
/// previous ones, maintaining backward compatibility while adding
/// improvements.
///
/// ## Hardfork History
/// The EVM has evolved through multiple hardforks, each addressing
/// specific issues or adding new capabilities:
/// - Early forks focused on security and gas pricing
/// - Later forks added new opcodes and features
/// - Recent forks optimize performance and add L2 support
///
/// ## Using Hardforks
/// Hardforks are primarily used to:
/// - Configure jump tables with correct opcodes
/// - Set appropriate gas costs for operations
/// - Enable/disable features based on fork rules
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// const is_berlin_plus = @intFromEnum(hardfork) >= @intFromEnum(Hardfork.BERLIN);
/// ```
pub const Hardfork = enum {
    /// Original Ethereum launch (July 2015).
    /// Base EVM with fundamental opcodes.
    FRONTIER,

    /// First planned hardfork (March 2016).
    /// Added DELEGATECALL and fixed critical issues.
    HOMESTEAD,

    /// Emergency fork for DAO hack (July 2016).
    /// No EVM changes, only state modifications.
    DAO,

    /// Gas repricing fork (October 2016).
    /// EIP-150: Increased gas costs for IO-heavy operations.
    TANGERINE_WHISTLE,

    /// State cleaning fork (November 2016).
    /// EIP-161: Removed empty accounts.
    SPURIOUS_DRAGON,

    /// Major feature fork (October 2017).
    /// Added REVERT, RETURNDATASIZE, RETURNDATACOPY, STATICCALL.
    BYZANTIUM,

    /// Efficiency improvements (February 2019).
    /// Added CREATE2, shift opcodes, EXTCODEHASH.
    CONSTANTINOPLE,

    /// Quick fix fork (February 2019).
    /// Removed EIP-1283 due to reentrancy concerns.
    PETERSBURG,

    /// Gas optimization fork (December 2019).
    /// EIP-2200: Rebalanced SSTORE costs.
    /// Added CHAINID and SELFBALANCE.
    ISTANBUL,

    /// Difficulty bomb delay (January 2020).
    /// No EVM changes.
    MUIR_GLACIER,

    /// Access list fork (April 2021).
    /// EIP-2929: Gas cost for cold/warm access.
    /// EIP-2930: Optional access lists.
    BERLIN,

    /// Fee market reform (August 2021).
    /// EIP-1559: Base fee and new transaction types.
    /// Added BASEFEE opcode.
    LONDON,

    /// Difficulty bomb delay (December 2021).
    /// No EVM changes.
    ARROW_GLACIER,

    /// Difficulty bomb delay (June 2022).
    /// No EVM changes.
    GRAY_GLACIER,

    /// Proof of Stake transition (September 2022).
    /// Replaced DIFFICULTY with PREVRANDAO.
    MERGE,

    /// Withdrawal enabling fork (April 2023).
    /// EIP-3855: PUSH0 opcode.
    SHANGHAI,

    /// Proto-danksharding fork (March 2024).
    /// EIP-4844: Blob transactions.
    /// EIP-1153: Transient storage (TLOAD/TSTORE).
    /// EIP-5656: MCOPY opcode.
    CANCUN,

    /// Default hardfork for new chains.
    /// Set to latest stable fork (currently CANCUN).
    pub const DEFAULT = Hardfork.CANCUN;
};
````

```zig [src/evm/memory.zig]
const std = @import("std");
const Log = @import("log.zig");

/// Memory implementation for EVM execution contexts.
const Memory = @This();

pub const MemoryError = error{
    OutOfMemory,
    InvalidOffset,
    InvalidSize,
    MemoryLimitExceeded,
};

/// Calculate number of 32-byte words needed for byte length (rounds up)
pub fn calculate_num_words(len: usize) usize {
    return (len + 31) / 32;
}

shared_buffer: std.ArrayList(u8),
allocator: std.mem.Allocator,
my_checkpoint: usize,
memory_limit: u64,
root_ptr: *Memory,

pub const InitialCapacity: usize = 4 * 1024;
pub const DefaultMemoryLimit: u64 = 32 * 1024 * 1024; // 32 MB

/// Initializes the root Memory context. This instance owns the shared_buffer.
/// The caller must ensure the returned Memory is stored at a stable address
/// and call finalize_root() before use.
pub fn init(
    allocator: std.mem.Allocator,
    initial_capacity: usize,
    memory_limit: u64,
) !Memory {
    Log.debug("Memory.init: Initializing memory, initial_capacity={}, memory_limit={}", .{ initial_capacity, memory_limit });
    var shared_buffer = std.ArrayList(u8).init(allocator);
    errdefer shared_buffer.deinit();
    try shared_buffer.ensureTotalCapacity(initial_capacity);

    Log.debug("Memory.init: Memory initialized successfully", .{});
    return Memory{
        .shared_buffer = shared_buffer,
        .allocator = allocator,
        .my_checkpoint = 0,
        .memory_limit = memory_limit,
        .root_ptr = undefined,
    };
}

/// Finalizes the root Memory by setting root_ptr to itself.
/// Must be called after init() and the Memory is stored at its final address.
pub fn finalize_root(self: *Memory) void {
    Log.debug("Memory.finalize_root: Finalizing root memory pointer", .{});
    self.root_ptr = self;
}

pub fn init_default(allocator: std.mem.Allocator) !Memory {
    return try init(allocator, InitialCapacity, DefaultMemoryLimit);
}

/// Deinitializes the shared_buffer. Should ONLY be called on the root Memory instance.
pub fn deinit(self: *Memory) void {
    if (self.my_checkpoint == 0 and self.root_ptr == self) {
        Log.debug("Memory.deinit: Deinitializing root memory, buffer_size={}", .{self.shared_buffer.items.len});
        self.shared_buffer.deinit();
    } else {
        Log.debug("Memory.deinit: Skipping deinit for non-root memory context, checkpoint={}", .{self.my_checkpoint});
    }
}

/// Returns the size of the memory region visible to the current context.
pub fn context_size(self: *const Memory) usize {
    const total_len = self.root_ptr.shared_buffer.items.len;
    if (total_len < self.my_checkpoint) {
        // This indicates a bug or inconsistent state
        return 0;
    }
    return total_len - self.my_checkpoint;
}

/// Ensures the current context's memory region is at least `min_context_size` bytes.
/// Returns the number of *new 32-byte words added to the shared_buffer* if it expanded.
/// This is crucial for EVM gas calculation.
pub fn ensure_context_capacity(self: *Memory, min_context_size: usize) MemoryError!u64 {
    const required_total_len = self.my_checkpoint + min_context_size;
    Log.debug("Memory.ensure_context_capacity: Ensuring capacity, min_context_size={}, required_total_len={}, memory_limit={}", .{ min_context_size, required_total_len, self.memory_limit });

    if (required_total_len > self.memory_limit) {
        Log.debug("Memory.ensure_context_capacity: Memory limit exceeded, required={}, limit={}", .{ required_total_len, self.memory_limit });
        return MemoryError.MemoryLimitExceeded;
    }

    const root = self.root_ptr;
    const old_total_buffer_len = root.shared_buffer.items.len;
    const old_total_words = calculate_num_words(old_total_buffer_len);

    if (required_total_len <= old_total_buffer_len) {
        // Buffer is already large enough
        Log.debug("Memory.ensure_context_capacity: Buffer already large enough, no expansion needed", .{});
        return 0;
    }

    // Resize the buffer
    const new_total_len = required_total_len;
    Log.debug("Memory.ensure_context_capacity: Expanding buffer from {} to {} bytes", .{ old_total_buffer_len, new_total_len });

    if (new_total_len > root.shared_buffer.capacity) {
        var new_capacity = root.shared_buffer.capacity;
        if (new_capacity == 0) new_capacity = 1; // Handle initial zero capacity
        while (new_capacity < new_total_len) {
            const doubled = @mulWithOverflow(new_capacity, 2);
            if (doubled[1] != 0) {
                // Overflow occurred
                return MemoryError.OutOfMemory;
            }
            new_capacity = doubled[0];
        }
        // Ensure new_capacity doesn't exceed memory_limit
        if (new_capacity > self.memory_limit and self.memory_limit <= std.math.maxInt(usize)) {
            new_capacity = @intCast(self.memory_limit);
        }
        if (new_total_len > new_capacity) return MemoryError.MemoryLimitExceeded;
        try root.shared_buffer.ensureTotalCapacity(new_capacity);
    }

    // Set new length and zero-initialize the newly added part
    root.shared_buffer.items.len = new_total_len;
    @memset(root.shared_buffer.items[old_total_buffer_len..new_total_len], 0);

    const new_total_words = calculate_num_words(new_total_len);
    const words_added = if (new_total_words > old_total_words) new_total_words - old_total_words else 0;
    Log.debug("Memory.ensure_context_capacity: Expansion complete, old_words={}, new_words={}, words_added={}", .{ old_total_words, new_total_words, words_added });
    return words_added;
}

/// Read 32 bytes as u256 at context-relative offset.
pub fn get_u256(self: *const Memory, relative_offset: usize) MemoryError!u256 {
    Log.debug("Memory.get_u256: Reading u256 at relative_offset={}, context_size={}", .{ relative_offset, self.context_size() });
    if (relative_offset + 32 > self.context_size()) {
        Log.debug("Memory.get_u256: Invalid offset, offset+32={} > context_size={}", .{ relative_offset + 32, self.context_size() });
        return MemoryError.InvalidOffset;
    }
    const abs_offset = self.my_checkpoint + relative_offset;
    const bytes = self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + 32];

    // Convert big-endian bytes to u256
    var value: u256 = 0;
    for (bytes) |byte| {
        value = (value << 8) | byte;
    }
    Log.debug("Memory.get_u256: Read value={} from offset={}", .{ value, relative_offset });
    return value;
}

/// Read arbitrary slice of memory at context-relative offset.
pub fn get_slice(self: *const Memory, relative_offset: usize, len: usize) MemoryError![]const u8 {
    Log.debug("Memory.get_slice: Reading slice at relative_offset={}, len={}", .{ relative_offset, len });
    if (len == 0) return &[_]u8{};
    const end = std.math.add(usize, relative_offset, len) catch {
        Log.debug("Memory.get_slice: Invalid size overflow, offset={}, len={}", .{ relative_offset, len });
        return MemoryError.InvalidSize;
    };
    if (end > self.context_size()) {
        Log.debug("Memory.get_slice: Invalid offset, end={} > context_size={}", .{ end, self.context_size() });
        return MemoryError.InvalidOffset;
    }
    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + len;
    Log.debug("Memory.get_slice: Returning slice [{}..{}]", .{ abs_offset, abs_end });
    return self.root_ptr.shared_buffer.items[abs_offset..abs_end];
}

/// Write arbitrary data at context-relative offset.
pub fn set_data(self: *Memory, relative_offset: usize, data: []const u8) MemoryError!void {
    Log.debug("Memory.set_data: Writing data at relative_offset={}, data_len={}", .{ relative_offset, data.len });
    if (data.len == 0) return;

    const end = std.math.add(usize, relative_offset, data.len) catch {
        Log.debug("Memory.set_data: Invalid size overflow, offset={}, data_len={}", .{ relative_offset, data.len });
        return MemoryError.InvalidSize;
    };
    _ = try self.ensure_context_capacity(end);

    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + data.len;
    Log.debug("Memory.set_data: Writing to buffer [{}..{}]", .{ abs_offset, abs_end });
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset..abs_end], data);
}

/// Write data with source offset and length (handles partial copies and zero-fills).
pub fn set_data_bounded(
    self: *Memory,
    relative_memory_offset: usize,
    data: []const u8,
    data_offset: usize,
    len: usize,
) MemoryError!void {
    if (len == 0) return;

    const end = std.math.add(usize, relative_memory_offset, len) catch return MemoryError.InvalidSize;
    _ = try self.ensure_context_capacity(end);

    const abs_offset = self.my_checkpoint + relative_memory_offset;
    const abs_end = abs_offset + len;

    // If source offset is beyond data bounds, fill with zeros
    if (data_offset >= data.len) {
        @memset(self.root_ptr.shared_buffer.items[abs_offset..abs_end], 0);
        return;
    }

    // Calculate how much we can actually copy
    const data_end = @min(data_offset + len, data.len);
    const copy_len = data_end - data_offset;

    // Copy available data
    if (copy_len > 0) {
        @memcpy(
            self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + copy_len],
            data[data_offset..data_end],
        );
    }

    // Zero-fill the rest
    if (copy_len < len) {
        @memset(self.root_ptr.shared_buffer.items[abs_offset + copy_len .. abs_end], 0);
    }
}

/// Get total size of memory (context size)
pub fn total_size(self: *const Memory) usize {
    return self.context_size();
}

/// Get a mutable slice to the entire memory buffer (context-relative)
pub fn slice(self: *Memory) []u8 {
    const ctx_size = self.context_size();
    const abs_start = self.my_checkpoint;
    const abs_end = abs_start + ctx_size;
    return self.root_ptr.shared_buffer.items[abs_start..abs_end];
}

/// Read a single byte at context-relative offset (for test compatibility)
pub fn get_byte(self: *const Memory, relative_offset: usize) MemoryError!u8 {
    if (relative_offset >= self.context_size()) return MemoryError.InvalidOffset;
    const abs_offset = self.my_checkpoint + relative_offset;
    return self.root_ptr.shared_buffer.items[abs_offset];
}

/// Resize the context to the specified size (for test compatibility)
pub fn resize_context(self: *Memory, new_size: usize) MemoryError!void {
    _ = try self.ensure_context_capacity(new_size);
}

/// Get the memory size (alias for context_size for test compatibility)
pub fn size(self: *const Memory) usize {
    return self.context_size();
}

/// Write u256 value at context-relative offset (for test compatibility)
pub fn set_u256(self: *Memory, relative_offset: usize, value: u256) MemoryError!void {
    Log.debug("Memory.set_u256: Writing u256 value={} at relative_offset={}", .{ value, relative_offset });
    _ = try self.ensure_context_capacity(relative_offset + 32);
    const abs_offset = self.my_checkpoint + relative_offset;

    // Convert u256 to big-endian bytes
    var bytes: [32]u8 = undefined;
    var val = value;
    var i: usize = 32;
    while (i > 0) {
        i -= 1;
        bytes[i] = @intCast(val & 0xFF);
        val >>= 8;
    }

    Log.debug("Memory.set_u256: Writing bytes to buffer at abs_offset={}", .{abs_offset});
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset..abs_offset + 32], &bytes);
}

```

````zig [src/evm/stack/stack_validation.zig]
const std = @import("std");
const Stack = @import("stack.zig");
const Operation = @import("../opcodes/operation.zig").Operation;
const ExecutionError = @import("../execution/execution_error.zig");
const Log = @import("../log.zig");

/// Stack validation utilities for EVM operations.
///
/// This module provides validation functions to ensure stack operations
/// will succeed before attempting them. This is crucial for:
/// - Preventing execution errors
/// - Enabling optimized unsafe operations after validation
/// - Maintaining EVM correctness
///
/// ## Validation Strategy
/// The EVM uses two-phase validation:
/// 1. Pre-execution validation (this module)
/// 2. Unsafe operations after validation passes
///
/// This allows opcodes to use fast unsafe operations in hot paths
/// while maintaining safety guarantees.
///
/// ## Stack Limits
/// The EVM enforces strict stack limits:
/// - Maximum depth: 1024 elements
/// - Underflow: Cannot pop from empty stack
/// - Overflow: Cannot exceed maximum depth
pub const ValidationPatterns = @import("validation_patterns.zig");

/// Validates stack requirements using Operation metadata.
///
/// Each EVM operation has min_stack and max_stack requirements:
/// - min_stack: Minimum elements needed on stack
/// - max_stack: Maximum allowed before operation (to prevent overflow)
///
/// @param stack The stack to validate
/// @param operation The operation with stack requirements
/// @throws StackUnderflow if stack has fewer than min_stack elements
/// @throws StackOverflow if stack has more than max_stack elements
///
/// Example:
/// ```zig
/// // Validate before executing an opcode
/// try validate_stack_requirements(&frame.stack, &operation);
/// // Safe to use unsafe operations now
/// operation.execute(&frame);
/// ```
pub fn validate_stack_requirements(
    stack: *const Stack,
    operation: *const Operation,
) ExecutionError.Error!void {
    const stack_size = stack.size;
    Log.debug("StackValidation.validate_stack_requirements: Validating stack, size={}, min_required={}, max_allowed={}", .{ stack_size, operation.min_stack, operation.max_stack });

    // Check minimum stack requirement
    if (stack_size < operation.min_stack) {
        @branchHint(.cold);
        Log.debug("StackValidation.validate_stack_requirements: Stack underflow, size={} < min_stack={}", .{ stack_size, operation.min_stack });
        return ExecutionError.Error.StackUnderflow;
    }

    // Check maximum stack requirement
    // max_stack represents the maximum stack size allowed BEFORE the operation
    // to ensure we don't overflow after the operation completes
    if (stack_size > operation.max_stack) {
        @branchHint(.cold);
        Log.debug("StackValidation.validate_stack_requirements: Stack overflow, size={} > max_stack={}", .{ stack_size, operation.max_stack });
        return ExecutionError.Error.StackOverflow;
    }

    Log.debug("StackValidation.validate_stack_requirements: Validation passed", .{});
}

/// Validates stack has capacity for pop/push operations.
///
/// More flexible than validate_stack_requirements, this function
/// validates arbitrary pop/push counts. Used by:
/// - Dynamic operations (e.g., LOG with variable topics)
/// - Custom validation logic
/// - Testing and debugging
///
/// @param stack The stack to validate
/// @param pop_count Number of elements to pop
/// @param push_count Number of elements to push
/// @throws StackUnderflow if stack has < pop_count elements
/// @throws StackOverflow if operation would exceed capacity
///
/// Example:
/// ```zig
/// // Validate LOG3 operation (pops 5, pushes 0)
/// try validate_stack_operation(&stack, 5, 0);
/// ```
pub fn validate_stack_operation(
    stack: *const Stack,
    pop_count: u32,
    push_count: u32,
) ExecutionError.Error!void {
    const stack_size = stack.size;
    Log.debug("StackValidation.validate_stack_operation: Validating operation, stack_size={}, pop_count={}, push_count={}", .{ stack_size, pop_count, push_count });

    // Check if we have enough items to pop
    if (stack_size < pop_count) {
        @branchHint(.cold);
        Log.debug("StackValidation.validate_stack_operation: Stack underflow, size={} < pop_count={}", .{ stack_size, pop_count });
        return ExecutionError.Error.StackUnderflow;
    }

    // Calculate stack size after operation
    const new_size = stack_size - pop_count + push_count;

    // Check if result would overflow
    if (new_size > Stack.CAPACITY) {
        @branchHint(.cold);
        Log.debug("StackValidation.validate_stack_operation: Stack overflow, new_size={} > capacity={}", .{ new_size, Stack.CAPACITY });
        return ExecutionError.Error.StackOverflow;
    }

    Log.debug("StackValidation.validate_stack_operation: Validation passed, new_size={}", .{new_size});
}

/// Calculate the maximum allowed stack size for an operation.
///
/// The max_stack value ensures that after an operation completes,
/// the stack won't exceed capacity. This is calculated as:
/// - If operation grows stack: CAPACITY - net_growth
/// - If operation shrinks/neutral: CAPACITY
///
/// @param pop_count Number of elements operation pops
/// @param push_count Number of elements operation pushes
/// @return Maximum allowed stack size before operation
///
/// Example:
/// ```zig
/// // PUSH1 operation (pop 0, push 1)
/// const max = calculate_max_stack(0, 1); // Returns 1023
/// // Stack must have <= 1023 elements before PUSH1
/// ```
pub fn calculate_max_stack(pop_count: u32, push_count: u32) u32 {
    if (push_count > pop_count) {
        @branchHint(.likely);
        const net_growth = push_count - pop_count;
        return @intCast(Stack.CAPACITY - net_growth);
    }
    // If operation reduces stack or is neutral, max is CAPACITY
    return Stack.CAPACITY;
}


// Tests
const testing = std.testing;

test "validate_stack_requirements" {
    var stack = Stack{};

    // Test underflow
    const op_needs_2 = Operation{
        .execute = undefined,
        .constant_gas = 3,
        .min_stack = 2,
        .max_stack = Stack.CAPACITY - 1,
    };

    try testing.expectError(ExecutionError.Error.StackUnderflow, validate_stack_requirements(&stack, &op_needs_2));

    // Add items and test success
    try stack.append(1);
    try stack.append(2);
    try validate_stack_requirements(&stack, &op_needs_2);

    // Test overflow
    const op_max_10 = Operation{
        .execute = undefined,
        .constant_gas = 3,
        .min_stack = 0,
        .max_stack = 10,
    };

    // Fill stack beyond max_stack
    var i: usize = 2;
    while (i < 11) : (i += 1) {
        try stack.append(@intCast(i));
    }

    try testing.expectError(ExecutionError.Error.StackOverflow, validate_stack_requirements(&stack, &op_max_10));
}

test "validate_stack_operation" {
    var stack = Stack{};

    // Test underflow
    try testing.expectError(ExecutionError.Error.StackUnderflow, validate_stack_operation(&stack, 2, 1));

    // Add items
    try stack.append(10);
    try stack.append(20);

    // Binary op should succeed
    try validate_stack_operation(&stack, 2, 1);

    // Test overflow - fill stack almost to capacity
    stack.size = Stack.CAPACITY - 1;

    // Operation that would overflow
    try testing.expectError(ExecutionError.Error.StackOverflow, validate_stack_operation(&stack, 0, 2));
}

test "calculate_max_stack" {
    // Binary operations (pop 2, push 1) - net decrease of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY), calculate_max_stack(2, 1));

    // Push operations (pop 0, push 1) - net increase of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), calculate_max_stack(0, 1));

    // DUP operations (pop 0, push 1) - net increase of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), calculate_max_stack(0, 1));

    // Operations that push more than pop
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 3), calculate_max_stack(1, 4));
}

test "ValidationPatterns" {
    var stack = Stack{};

    // Test binary op validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_binary_op(&stack));
    try stack.append(1);
    try stack.append(2);
    try ValidationPatterns.validate_binary_op(&stack);

    // Test DUP validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_dup(&stack, 3));
    try ValidationPatterns.validate_dup(&stack, 2);

    // Test SWAP validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_swap(&stack, 2));
    try ValidationPatterns.validate_swap(&stack, 1);

    // Test PUSH validation at capacity
    stack.size = Stack.CAPACITY;
    try testing.expectError(ExecutionError.Error.StackOverflow, ValidationPatterns.validate_push(&stack));
}
````

````zig [src/evm/stack/stack.zig]
const std = @import("std");
const Log = @import("../log.zig");

/// High-performance EVM stack implementation with fixed capacity.
///
/// The Stack is a core component of the EVM execution model, providing a
/// Last-In-First-Out (LIFO) data structure for 256-bit values. All EVM
/// computations operate on this stack, making its performance critical.
///
/// ## Design Rationale
/// - Fixed capacity of 1024 elements (per EVM specification)
/// - 32-byte alignment for optimal memory access on modern CPUs
/// - Unsafe variants skip bounds checking in hot paths for performance
///
/// ## Performance Optimizations
/// - Aligned memory for SIMD-friendly access patterns
/// - Unsafe variants used after jump table validation
/// - Direct memory access patterns for maximum speed
///
/// ## Safety Model
/// Operations are validated at the jump table level, allowing individual
/// opcodes to use faster unsafe operations without redundant bounds checking.
///
/// Example:
/// ```zig
/// var stack = Stack{};
/// try stack.append(100); // Safe variant (for error_mapping)
/// stack.append_unsafe(200); // Unsafe variant (for opcodes)
/// ```
pub const Stack = @This();

/// Maximum stack capacity as defined by the EVM specification.
/// This limit prevents stack-based DoS attacks.
pub const CAPACITY: usize = 1024;

/// Error types for stack operations.
/// These map directly to EVM execution errors.
pub const Error = error{
    /// Stack would exceed 1024 elements
    StackOverflow,
    /// Attempted to pop from empty stack
    StackUnderflow,
};

/// Stack storage aligned to 32-byte boundaries.
/// Alignment improves performance on modern CPUs by:
/// - Enabling SIMD operations
/// - Reducing cache line splits
/// - Improving memory prefetching
data: [CAPACITY]u256 align(32) = [_]u256{0} ** CAPACITY,

/// Current number of elements on the stack.
/// Invariant: 0 <= size <= CAPACITY
size: usize = 0,

/// Push a value onto the stack (safe version).
///
/// @param self The stack to push onto
/// @param value The 256-bit value to push
/// @throws Overflow if stack is at capacity
///
/// Example:
/// ```zig
/// try stack.append(0x1234);
/// ```
pub fn append(self: *Stack, value: u256) Error!void {
    if (self.size >= CAPACITY) {
        @branchHint(.cold);
        Log.debug("Stack.append: Stack overflow, size={}, capacity={}", .{ self.size, CAPACITY });
        return Error.StackOverflow;
    }
    Log.debug("Stack.append: Pushing value={}, new_size={}", .{ value, self.size + 1 });
    self.data[self.size] = value;
    self.size += 1;
}

/// Push a value onto the stack (unsafe version).
///
/// Caller must ensure stack has capacity. Used in hot paths
/// after validation has already been performed.
///
/// @param self The stack to push onto
/// @param value The 256-bit value to push
pub fn append_unsafe(self: *Stack, value: u256) void {
    @branchHint(.likely);
    self.data[self.size] = value;
    self.size += 1;
}

/// Pop a value from the stack (safe version).
///
/// Removes and returns the top element. Clears the popped
/// slot to prevent information leakage.
///
/// @param self The stack to pop from
/// @return The popped value
/// @throws Underflow if stack is empty
///
/// Example:
/// ```zig
/// const value = try stack.pop();
/// ```
pub fn pop(self: *Stack) Error!u256 {
    if (self.size == 0) {
        @branchHint(.cold);
        Log.debug("Stack.pop: Stack underflow, size=0", .{});
        return Error.StackUnderflow;
    }
    self.size -= 1;
    const value = self.data[self.size];
    self.data[self.size] = 0;
    Log.debug("Stack.pop: Popped value={}, new_size={}", .{ value, self.size });
    return value;
}

/// Pop a value from the stack (unsafe version).
///
/// Caller must ensure stack is not empty. Used in hot paths
/// after validation.
///
/// @param self The stack to pop from
/// @return The popped value
pub fn pop_unsafe(self: *Stack) u256 {
    @branchHint(.likely);
    self.size -= 1;
    const value = self.data[self.size];
    self.data[self.size] = 0;
    return value;
}

/// Peek at the top value without removing it (unsafe version).
///
/// Caller must ensure stack is not empty.
///
/// @param self The stack to peek at
/// @return Pointer to the top value
pub fn peek_unsafe(self: *const Stack) *const u256 {
    @branchHint(.likely);
    return &self.data[self.size - 1];
}

/// Duplicate the nth element onto the top of stack (unsafe version).
///
/// Caller must ensure preconditions are met.
///
/// @param self The stack to operate on
/// @param n Position to duplicate from (1-16)
pub fn dup_unsafe(self: *Stack, n: usize) void {
    @branchHint(.likely);
    @setRuntimeSafety(false);
    self.append_unsafe(self.data[self.size - n]);
}

/// Pop 2 values without pushing (unsafe version)
pub fn pop2_unsafe(self: *Stack) struct { a: u256, b: u256 } {
    @branchHint(.likely);
    @setRuntimeSafety(false);
    self.size -= 2;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
    };
}

/// Pop 3 values without pushing (unsafe version)
pub fn pop3_unsafe(self: *Stack) struct { a: u256, b: u256, c: u256 } {
    @branchHint(.likely);
    @setRuntimeSafety(false);
    self.size -= 3;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
        .c = self.data[self.size + 2],
    };
}

pub fn set_top_unsafe(self: *Stack, value: u256) void {
    @branchHint(.likely);
    // Assumes stack is not empty; this should be guaranteed by jump_table validation
    // for opcodes that use this pattern (e.g., after a pop and peek on a stack with >= 2 items).
    self.data[self.size - 1] = value;
}

/// CamelCase alias used by existing execution code
pub fn swapUnsafe(self: *Stack, n: usize) void {
    @branchHint(.likely);
    std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
}

/// Peek at the nth element from the top (for test compatibility)
pub fn peek_n(self: *const Stack, n: usize) Error!u256 {
    if (n >= self.size) {
        @branchHint(.cold);
        return Error.StackUnderflow;
    }
    return self.data[self.size - 1 - n];
}

/// Clear the stack (for test compatibility)
pub fn clear(self: *Stack) void {
    self.size = 0;
    // Zero out the data for security
    @memset(&self.data, 0);
}

/// Peek at the top value (for test compatibility)
pub fn peek(self: *const Stack) Error!u256 {
    if (self.size == 0) {
        @branchHint(.cold);
        return Error.StackUnderflow;
    }
    return self.data[self.size - 1];
}```
```zig [src/evm/stack/validation_patterns.zig]
const Stack = @import("stack.zig");
const ExecutionError = @import("../execution/execution_error.zig");
const Log = @import("../log.zig");

/// Common validation patterns for EVM stack operations.
///
/// This module provides optimized validation functions for frequently used
/// stack operation patterns in the EVM. These functions check stack requirements
/// before operations execute, preventing stack underflow/overflow errors.
///
/// ## Design Philosophy
/// Rather than repeating validation logic across opcodes, these functions
/// encapsulate common patterns:
/// - Binary operations: pop 2, push 1 (ADD, MUL, SUB, etc.)
/// - Ternary operations: pop 3, push 1 (ADDMOD, MULMOD, etc.)
/// - Comparison operations: pop 2, push 1 (LT, GT, EQ, etc.)
/// - Unary operations: pop 1, push 1 (NOT, ISZERO, etc.)
///
/// ## Performance
/// These validation functions are designed to be inlined by the compiler,
/// making them zero-cost abstractions over direct validation code.

/// Validates stack requirements for binary operations.
///
/// Binary operations consume two stack items and produce one result.
/// This pattern is used by arithmetic operations like ADD, MUL, SUB, DIV,
/// and bitwise operations like AND, OR, XOR.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 2 items or would overflow
///
/// Example:
/// ```zig
/// // Before ADD operation
/// try validate_binary_op(&frame.stack);
/// const b = frame.stack.pop();
/// const a = frame.stack.pop();
/// frame.stack.push(a + b);
/// ```
pub fn validate_binary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 2, 1);
}

/// Validates stack requirements for ternary operations.
///
/// Ternary operations consume three stack items and produce one result.
/// This pattern is used by operations like ADDMOD and MULMOD which
/// perform modular arithmetic.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 3 items or would overflow
///
/// Example:
/// ```zig
/// // Before ADDMOD operation: (a + b) % n
/// try validate_ternary_op(&frame.stack);
/// const n = frame.stack.pop();
/// const b = frame.stack.pop();
/// const a = frame.stack.pop();
/// frame.stack.push((a + b) % n);
/// ```
pub fn validate_ternary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 3, 1);
}

/// Validates stack requirements for comparison operations.
///
/// Comparison operations consume two stack items and produce one boolean
/// result (0 or 1). This includes LT, GT, SLT, SGT, and EQ operations.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 2 items or would overflow
///
/// Note: This is functionally identical to validate_binary_op but exists
/// as a separate function for semantic clarity and potential future
/// specialization.
pub fn validate_comparison_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 2, 1);
}

/// Validates stack requirements for unary operations.
///
/// Unary operations consume one stack item and produce one result.
/// This pattern is used by operations like NOT, ISZERO, and SIGNEXTEND.
///
/// @param stack The stack to validate
/// @return Error if stack is empty or would overflow
///
/// Example:
/// ```zig
/// // Before ISZERO operation
/// try validate_unary_op(&frame.stack);
/// const value = frame.stack.pop();
/// frame.stack.push(if (value == 0) 1 else 0);
/// ```
pub fn validate_unary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 1, 1);
}

/// Validates stack requirements for DUP operations.
///
/// DUP operations duplicate the nth stack item, pushing a copy onto the top.
/// They consume no items but add one, so the stack must have:
/// - At least n items to duplicate from
/// - Room for one more item
///
/// @param stack The stack to validate
/// @param n The position to duplicate from (1-based, DUP1 duplicates top item)
/// @return StackUnderflow if fewer than n items, StackOverflow if full
///
/// Example:
/// ```zig
/// // DUP3 operation
/// try validate_dup(&frame.stack, 3);
/// const value = frame.stack.peek(2); // 0-based indexing
/// frame.stack.push(value);
/// ```
pub fn validate_dup(stack: *const Stack, n: u32) ExecutionError.Error!void {
    Log.debug("ValidationPatterns.validate_dup: Validating DUP{}, stack_size={}", .{ n, stack.size });
    // DUP pops 0 and pushes 1
    if (stack.size < n) {
        @branchHint(.cold);
        Log.debug("ValidationPatterns.validate_dup: Stack underflow, size={} < n={}", .{ stack.size, n });
        return ExecutionError.Error.StackUnderflow;
    }
    if (stack.size >= Stack.CAPACITY) {
        @branchHint(.cold);
        Log.debug("ValidationPatterns.validate_dup: Stack overflow, size={} >= capacity={}", .{ stack.size, Stack.CAPACITY });
        return ExecutionError.Error.StackOverflow;
    }
    Log.debug("ValidationPatterns.validate_dup: Validation passed", .{});
}

/// Validates stack requirements for SWAP operations.
///
/// SWAP operations exchange the top stack item with the (n+1)th item.
/// They don't change the stack size, but require at least n+1 items.
///
/// @param stack The stack to validate
/// @param n The position to swap with (1-based, SWAP1 swaps top two items)
/// @return StackUnderflow if stack has n or fewer items
///
/// Example:
/// ```zig
/// // SWAP2 operation swaps top with 3rd item
/// try validate_swap(&frame.stack, 2);
/// frame.stack.swap(2);
/// ```
pub fn validate_swap(stack: *const Stack, n: u32) ExecutionError.Error!void {
    Log.debug("ValidationPatterns.validate_swap: Validating SWAP{}, stack_size={}", .{ n, stack.size });
    // SWAP needs at least n+1 items on stack
    if (stack.size <= n) {
        @branchHint(.cold);
        Log.debug("ValidationPatterns.validate_swap: Stack underflow, size={} <= n={}", .{ stack.size, n });
        return ExecutionError.Error.StackUnderflow;
    }
    Log.debug("ValidationPatterns.validate_swap: Validation passed", .{});
}

/// Validates stack requirements for PUSH operations.
///
/// PUSH operations add one new item to the stack. They only require
/// checking that the stack isn't already full.
///
/// @param stack The stack to validate
/// @return StackOverflow if stack is at capacity
///
/// Example:
/// ```zig
/// // PUSH1 operation
/// try validate_push(&frame.stack);
/// const value = readByte(pc + 1);
/// frame.stack.push(value);
/// ```
pub fn validate_push(stack: *const Stack) ExecutionError.Error!void {
    Log.debug("ValidationPatterns.validate_push: Validating PUSH, stack_size={}", .{stack.size});
    if (stack.size >= Stack.CAPACITY) {
        @branchHint(.cold);
        Log.debug("ValidationPatterns.validate_push: Stack overflow, size={} >= capacity={}", .{ stack.size, Stack.CAPACITY });
        return ExecutionError.Error.StackOverflow;
    }
    Log.debug("ValidationPatterns.validate_push: Validation passed", .{});
}

// Import the helper function
const validate_stack_operation = @import("stack_validation.zig").validate_stack_operation;
````

```zig [src/evm/access_list/access_list.zig]
const std = @import("std");
const Address = @import("Address");
const AccessListStorageKey = @import("access_list_storage_key.zig");
const AccessListStorageKeyContext = @import("access_list_storage_key_context.zig");

/// EIP-2929 & EIP-2930: Access list management for gas cost calculation
///
/// Tracks which addresses and storage slots have been accessed during transaction
/// execution. First access (cold) costs more gas than subsequent accesses (warm).
///
/// Gas costs:
/// - Cold address access: 2600 gas
/// - Warm address access: 100 gas
/// - Cold storage slot access: 2100 gas
/// - Warm storage slot access: 100 gas

// Error types for AccessList operations
pub const Error = std.mem.Allocator.Error;
pub const AccessAddressError = Error;
pub const AccessStorageSlotError = Error;
pub const PreWarmAddressesError = Error;
pub const PreWarmStorageSlotsError = Error;
pub const InitTransactionError = Error;
pub const GetCallCostError = Error;

pub const AccessList = @This();


// Gas costs defined by EIP-2929
pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
pub const WARM_ACCOUNT_ACCESS_COST: u64 = 100;
pub const COLD_SLOAD_COST: u64 = 2100;
pub const WARM_SLOAD_COST: u64 = 100;

// Additional costs for CALL operations
pub const COLD_CALL_EXTRA_COST: u64 = COLD_ACCOUNT_ACCESS_COST - WARM_ACCOUNT_ACCESS_COST;

allocator: std.mem.Allocator,
/// Warm addresses - addresses that have been accessed
addresses: std.AutoHashMap(Address.Address, void),
/// Warm storage slots - storage slots that have been accessed
storage_slots: std.HashMap(AccessListStorageKey, void, AccessListStorageKeyContext, 80),

pub fn init(allocator: std.mem.Allocator) AccessList {
    return .{
        .allocator = allocator,
        .addresses = std.AutoHashMap(Address.Address, void).init(allocator),
        .storage_slots = std.HashMap(AccessListStorageKey, void, AccessListStorageKeyContext, 80).init(allocator),
    };
}

pub fn deinit(self: *AccessList) void {
    self.addresses.deinit();
    self.storage_slots.deinit();
}

/// Clear all access lists for a new transaction
pub fn clear(self: *AccessList) void {
    self.addresses.clearRetainingCapacity();
    self.storage_slots.clearRetainingCapacity();
}

/// Mark an address as accessed and return the gas cost
/// Returns COLD_ACCOUNT_ACCESS_COST if first access, WARM_ACCOUNT_ACCESS_COST if already accessed
pub fn access_address(self: *AccessList, address: Address.Address) std.mem.Allocator.Error!u64 {
    const result = try self.addresses.getOrPut(address);
    if (result.found_existing) {
        @branchHint(.likely);
        return WARM_ACCOUNT_ACCESS_COST;
    }
    return COLD_ACCOUNT_ACCESS_COST;
}

/// Mark a storage slot as accessed and return the gas cost
/// Returns COLD_SLOAD_COST if first access, WARM_SLOAD_COST if already accessed
pub fn access_storage_slot(self: *AccessList, address: Address.Address, slot: u256) std.mem.Allocator.Error!u64 {
    const key = AccessListStorageKey{ .address = address, .slot = slot };
    const result = try self.storage_slots.getOrPut(key);
    if (result.found_existing) {
        @branchHint(.likely);
        return WARM_SLOAD_COST;
    }
    return COLD_SLOAD_COST;
}

/// Check if an address is warm (has been accessed)
pub fn is_address_warm(self: *const AccessList, address: Address.Address) bool {
    return self.addresses.contains(address);
}

/// Check if a storage slot is warm (has been accessed)
pub fn is_storage_slot_warm(self: *const AccessList, address: Address.Address, slot: u256) bool {
    const key = AccessListStorageKey{ .address = address, .slot = slot };
    return self.storage_slots.contains(key);
}

/// Pre-warm addresses from EIP-2930 access list
pub fn pre_warm_addresses(self: *AccessList, addresses: []const Address.Address) std.mem.Allocator.Error!void {
    for (addresses) |address| {
        try self.addresses.put(address, {});
    }
}

/// Pre-warm storage slots from EIP-2930 access list
pub fn pre_warm_storage_slots(self: *AccessList, address: Address.Address, slots: []const u256) std.mem.Allocator.Error!void {
    for (slots) |slot| {
        const key = AccessListStorageKey{ .address = address, .slot = slot };
        try self.storage_slots.put(key, {});
    }
}

/// Initialize transaction access list with pre-warmed addresses
/// According to EIP-2929, tx.origin and block.coinbase are always pre-warmed
pub fn init_transaction(self: *AccessList, tx_origin: Address.Address, coinbase: Address.Address, to: ?Address.Address) std.mem.Allocator.Error!void {
    // Clear previous transaction data
    self.clear();

    try self.addresses.put(tx_origin, {});
    try self.addresses.put(coinbase, {});

    if (to) |to_address| {
        try self.addresses.put(to_address, {});
    }
}

/// Get the extra gas cost for accessing an address (for CALL operations)
/// Returns 0 if warm, COLD_CALL_EXTRA_COST if cold
pub fn get_call_cost(self: *AccessList, address: Address.Address) std.mem.Allocator.Error!u64 {
    const result = try self.addresses.getOrPut(address);
    if (result.found_existing) {
        @branchHint(.likely);
        return 0;
    }
    return COLD_CALL_EXTRA_COST;
}

// Tests
const testing = std.testing;

test "AccessList basic operations" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();

    const test_address = [_]u8{1} ** 20;

    // First access should be cold
    const cost1 = try access_list.access_address(test_address);
    try testing.expectEqual(COLD_ACCOUNT_ACCESS_COST, cost1);

    // Second access should be warm
    const cost2 = try access_list.access_address(test_address);
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, cost2);

    // Check warmth
    try testing.expect(access_list.is_address_warm(test_address));

    const cold_address = [_]u8{2} ** 20;
    try testing.expect(!access_list.is_address_warm(cold_address));
}

test "AccessList storage slots" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();

    const test_address = [_]u8{1} ** 20;
    const slot1: u256 = 42;
    const slot2: u256 = 100;

    // First access to slot1 should be cold
    const cost1 = try access_list.access_storage_slot(test_address, slot1);
    try testing.expectEqual(COLD_SLOAD_COST, cost1);

    // Second access to slot1 should be warm
    const cost2 = try access_list.access_storage_slot(test_address, slot1);
    try testing.expectEqual(WARM_SLOAD_COST, cost2);

    // First access to slot2 should be cold
    const cost3 = try access_list.access_storage_slot(test_address, slot2);
    try testing.expectEqual(COLD_SLOAD_COST, cost3);

    // Check warmth
    try testing.expect(access_list.is_storage_slot_warm(test_address, slot1));
    try testing.expect(access_list.is_storage_slot_warm(test_address, slot2));
    try testing.expect(!access_list.is_storage_slot_warm(test_address, 999));
}

test "AccessList transaction initialization" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();

    const tx_origin = [_]u8{1} ** 20;
    const coinbase = [_]u8{2} ** 20;
    const to_address = [_]u8{3} ** 20;

    try access_list.init_transaction(tx_origin, coinbase, to_address);

    // All should be pre-warmed
    try testing.expect(access_list.is_address_warm(tx_origin));
    try testing.expect(access_list.is_address_warm(coinbase));
    try testing.expect(access_list.is_address_warm(to_address));

    // Accessing them should return warm cost
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(tx_origin));
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(coinbase));
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(to_address));
}

test "AccessList pre-warming from EIP-2930" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();

    const addresses = [_]Address.Address{
        [_]u8{1} ** 20,
        [_]u8{2} ** 20,
        [_]u8{3} ** 20,
    };

    try access_list.pre_warm_addresses(&addresses);

    // All should be warm
    for (addresses) |address| {
        try testing.expect(access_list.is_address_warm(address));
        try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(address));
    }

    // Test storage slot pre-warming
    const contract_address = [_]u8{4} ** 20;
    const slots = [_]u256{ 1, 2, 3, 100 };

    try access_list.pre_warm_storage_slots(contract_address, &slots);

    for (slots) |slot| {
        try testing.expect(access_list.is_storage_slot_warm(contract_address, slot));
        try testing.expectEqual(WARM_SLOAD_COST, try access_list.access_storage_slot(contract_address, slot));
    }
}

test "AccessList call costs" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();

    const cold_address = [_]u8{1} ** 20;
    const warm_address = [_]u8{2} ** 20;

    // Pre-warm one address
    try access_list.pre_warm_addresses(&[_]Address.Address{warm_address});

    // Cold address should have extra cost
    try testing.expectEqual(COLD_CALL_EXTRA_COST, try access_list.get_call_cost(cold_address));

    // Warm address should have no extra cost
    try testing.expectEqual(@as(u64, 0), try access_list.get_call_cost(warm_address));

    // After getting cost, cold address should now be warm
    try testing.expect(access_list.is_address_warm(cold_address));
}
```

```zig [src/evm/access_list/access_list_storage_key_context.zig]
const AccessListStorageKey = @import("access_list_storage_key.zig").AccessListStorageKey;

/// HashMap context for AccessListStorageKey
pub const AccessListStorageKeyContext = @This();

pub fn hash(ctx: AccessListStorageKeyContext, key: AccessListStorageKey) u64 {
    _ = ctx;
    return key.hash();
}

pub fn eql(ctx: AccessListStorageKeyContext, a: AccessListStorageKey, b: AccessListStorageKey) bool {
    _ = ctx;
    return a.eql(b);
}
```

```zig [src/evm/access_list/access_list_storage_key.zig]
const std = @import("std");
const Address = @import("Address");

/// Storage slot key combining address and slot for access list operations
/// This version provides direct hash output for use with HashMap
pub const AccessListStorageKey = @This();

address: Address.Address,
slot: u256,

pub fn hash(self: AccessListStorageKey) u64 {
    var hasher = std.hash.Wyhash.init(0);
    hasher.update(&self.address);
    hasher.update(std.mem.asBytes(&self.slot));
    return hasher.final();
}

pub fn eql(self: AccessListStorageKey, other: AccessListStorageKey) bool {
    return std.mem.eql(u8, &self.address, &other.address) and self.slot == other.slot;
}
```

````zig [src/evm/call_result.zig]
/// Result structure returned by contract call operations.
///
/// This structure encapsulates the outcome of executing a contract call in the EVM,
/// including standard calls (CALL), code calls (CALLCODE), delegate calls (DELEGATECALL),
/// and static calls (STATICCALL). It provides a unified interface for handling the
/// results of all inter-contract communication operations.
///
/// ## Usage
/// This structure is returned by the VM's call methods and contains all information
/// needed to determine the outcome of a call and process its results.
///
/// ## Call Types
/// - **CALL**: Standard contract call with its own storage context
/// - **CALLCODE**: Executes external code in current storage context (deprecated)
/// - **DELEGATECALL**: Executes external code with current storage and msg context
/// - **STATICCALL**: Read-only call that cannot modify state
///
/// ## Example
/// ```zig
/// const result = try vm.call_contract(caller, to, value, input, gas, is_static);
/// if (result.success) {
///     // Process successful call
///     if (result.output) |data| {
///         // Handle returned data
///     }
/// } else {
///     // Handle failed call - gas_left indicates remaining gas
/// }
/// defer if (result.output) |output| allocator.free(output);
/// ```
pub const CallResult = @This();

/// Indicates whether the call completed successfully.
///
/// - `true`: Call executed without errors and any state changes were committed
/// - `false`: Call failed due to revert, out of gas, or other errors
///
/// Note: A successful call may still have no output data if the called
/// contract intentionally returns nothing.
success: bool,

/// Amount of gas remaining after the call execution.
///
/// This value is important for gas accounting:
/// - For successful calls: Indicates unused gas to be refunded to the caller
/// - For failed calls: May be non-zero if the call reverted (vs running out of gas)
///
/// The calling context should add this back to its available gas to continue execution.
gas_left: u64,

/// Optional output data returned by the called contract.
///
/// - `null`: No data was returned (valid for both success and failure)
/// - `[]const u8`: Returned data buffer
///
/// ## Memory Management
/// The output data is allocated by the VM and ownership is transferred to the caller.
/// The caller is responsible for freeing this memory when no longer needed.
///
/// ## For Different Call Types
/// - **RETURN**: Contains the data specified in the RETURN opcode
/// - **REVERT**: Contains the revert reason/data if provided
/// - **STOP**: Will be null (no data returned)
/// - **Out of Gas/Invalid**: Will be null
output: ?[]const u8,
````

````zig [src/evm/opcodes/opcode.zig]
/// EVM opcode definitions and utilities.
///
/// This module defines all EVM opcodes as specified in the Ethereum Yellow Paper
/// and various EIPs. Each opcode is a single byte instruction that the EVM
/// interpreter executes.
///
/// ## Opcode Categories
/// - Arithmetic: ADD, MUL, SUB, DIV, MOD, EXP, etc.
/// - Comparison: LT, GT, EQ, ISZERO
/// - Bitwise: AND, OR, XOR, NOT, SHL, SHR, SAR
/// - Environmental: ADDRESS, BALANCE, CALLER, CALLVALUE
/// - Block Information: BLOCKHASH, COINBASE, TIMESTAMP, NUMBER
/// - Stack Operations: POP, PUSH1-PUSH32, DUP1-DUP16, SWAP1-SWAP16
/// - Memory Operations: MLOAD, MSTORE, MSTORE8, MSIZE
/// - Storage Operations: SLOAD, SSTORE, TLOAD, TSTORE
/// - Flow Control: JUMP, JUMPI, PC, JUMPDEST
/// - System Operations: CREATE, CALL, RETURN, REVERT, SELFDESTRUCT
/// - Logging: LOG0-LOG4
///
/// ## Opcode Encoding
/// Opcodes are encoded as single bytes (0x00-0xFF). Not all byte values
/// are assigned; unassigned values are treated as INVALID operations.
///
/// ## Hardfork Evolution
/// New opcodes are introduced through EIPs and activated at specific
/// hardforks. Examples:
/// - PUSH0 (EIP-3855): Shanghai hardfork
/// - TLOAD/TSTORE (EIP-1153): Cancun hardfork
/// - MCOPY (EIP-5656): Cancun hardfork
///
/// Example:
/// ```zig
/// const opcode = Opcode.Enum.ADD;
/// const byte_value = opcode.to_u8(); // 0x01
/// const name = opcode.get_name(); // "ADD"
/// ```
pub const MemorySize = @import("../memory_size.zig");

/// Opcode module providing EVM instruction definitions.
pub const Opcode = struct {};

/// Enumeration of all EVM opcodes with their byte values.
///
/// Each opcode is assigned a specific byte value that remains
/// constant across all EVM implementations. The enum ensures
/// type safety when working with opcodes.
pub const Enum = enum(u8) {
    /// Halts execution (0x00)
    STOP = 0x00,
    /// Addition operation: a + b (0x01)
    ADD = 0x01,
    /// Multiplication operation: a * b (0x02)
    MUL = 0x02,
    /// Subtraction operation: a - b (0x03)
    SUB = 0x03,
    /// Integer division operation: a / b (0x04)
    DIV = 0x04,
    /// Signed integer division operation (0x05)
    SDIV = 0x05,
    /// Modulo operation: a % b (0x06)
    MOD = 0x06,
    /// Signed modulo operation (0x07)
    SMOD = 0x07,
    /// Addition modulo: (a + b) % N (0x08)
    ADDMOD = 0x08,
    /// Multiplication modulo: (a * b) % N (0x09)
    MULMOD = 0x09,
    /// Exponential operation: a ** b (0x0A)
    EXP = 0x0A,
    /// Sign extend operation (0x0B)
    SIGNEXTEND = 0x0B,
    /// Less-than comparison: a < b (0x10)
    LT = 0x10,
    /// Greater-than comparison: a > b (0x11)
    GT = 0x11,
    /// Signed less-than comparison (0x12)
    SLT = 0x12,
    /// Signed greater-than comparison (0x13)
    SGT = 0x13,
    /// Equality comparison: a == b (0x14)
    EQ = 0x14,
    /// Check if value is zero (0x15)
    ISZERO = 0x15,
    /// Bitwise AND operation (0x16)
    AND = 0x16,
    /// Bitwise OR operation (0x17)
    OR = 0x17,
    /// Bitwise XOR operation (0x18)
    XOR = 0x18,
    /// Bitwise NOT operation (0x19)
    NOT = 0x19,
    /// Retrieve single byte from word (0x1A)
    BYTE = 0x1A,
    /// Logical shift left (0x1B)
    SHL = 0x1B,
    /// Logical shift right (0x1C)
    SHR = 0x1C,
    /// Arithmetic shift right (0x1D)
    SAR = 0x1D,
    /// Compute Keccak-256 hash (0x20)
    KECCAK256 = 0x20,
    /// Get address of currently executing account (0x30)
    ADDRESS = 0x30,
    /// Get balance of the given account (0x31)
    BALANCE = 0x31,
    /// Get execution origination address (0x32)
    ORIGIN = 0x32,
    /// Get caller address (0x33)
    CALLER = 0x33,
    /// Get deposited value by the caller (0x34)
    CALLVALUE = 0x34,
    /// Load input data of current call (0x35)
    CALLDATALOAD = 0x35,
    /// Get size of input data in current call (0x36)
    CALLDATASIZE = 0x36,
    /// Copy input data to memory (0x37)
    CALLDATACOPY = 0x37,
    /// Get size of code running in current environment (0x38)
    CODESIZE = 0x38,
    /// Copy code to memory (0x39)
    CODECOPY = 0x39,
    /// Get price of gas in current environment (0x3A)
    GASPRICE = 0x3A,
    EXTCODESIZE = 0x3B,
    EXTCODECOPY = 0x3C,
    RETURNDATASIZE = 0x3D,
    RETURNDATACOPY = 0x3E,
    EXTCODEHASH = 0x3F,
    BLOCKHASH = 0x40,
    COINBASE = 0x41,
    TIMESTAMP = 0x42,
    NUMBER = 0x43,
    PREVRANDAO = 0x44,
    GASLIMIT = 0x45,
    CHAINID = 0x46,
    SELFBALANCE = 0x47,
    BASEFEE = 0x48,
    BLOBHASH = 0x49,
    BLOBBASEFEE = 0x4A,
    POP = 0x50,
    MLOAD = 0x51,
    MSTORE = 0x52,
    MSTORE8 = 0x53,
    /// Load word from storage (0x54)
    SLOAD = 0x54,
    /// Store word to storage (0x55)
    SSTORE = 0x55,
    /// Unconditional jump (0x56)
    JUMP = 0x56,
    /// Conditional jump (0x57)
    JUMPI = 0x57,
    /// Get current program counter (0x58)
    PC = 0x58,
    /// Get size of active memory in bytes (0x59)
    MSIZE = 0x59,
    /// Get amount of available gas (0x5A)
    GAS = 0x5A,
    /// Mark valid jump destination (0x5B)
    JUMPDEST = 0x5B,
    /// Load word from transient storage (0x5C)
    TLOAD = 0x5C,
    /// Store word to transient storage (0x5D)
    TSTORE = 0x5D,
    /// Copy memory areas (0x5E)
    MCOPY = 0x5E,
    /// Push zero onto stack (0x5F)
    PUSH0 = 0x5F,
    PUSH1 = 0x60,
    PUSH2 = 0x61,
    PUSH3 = 0x62,
    PUSH4 = 0x63,
    PUSH5 = 0x64,
    PUSH6 = 0x65,
    PUSH7 = 0x66,
    PUSH8 = 0x67,
    PUSH9 = 0x68,
    PUSH10 = 0x69,
    PUSH11 = 0x6A,
    PUSH12 = 0x6B,
    PUSH13 = 0x6C,
    PUSH14 = 0x6D,
    PUSH15 = 0x6E,
    PUSH16 = 0x6F,
    PUSH17 = 0x70,
    PUSH18 = 0x71,
    PUSH19 = 0x72,
    PUSH20 = 0x73,
    PUSH21 = 0x74,
    PUSH22 = 0x75,
    PUSH23 = 0x76,
    PUSH24 = 0x77,
    PUSH25 = 0x78,
    PUSH26 = 0x79,
    PUSH27 = 0x7A,
    PUSH28 = 0x7B,
    PUSH29 = 0x7C,
    PUSH30 = 0x7D,
    PUSH31 = 0x7E,
    PUSH32 = 0x7F,
    DUP1 = 0x80,
    DUP2 = 0x81,
    DUP3 = 0x82,
    DUP4 = 0x83,
    DUP5 = 0x84,
    DUP6 = 0x85,
    DUP7 = 0x86,
    DUP8 = 0x87,
    DUP9 = 0x88,
    DUP10 = 0x89,
    DUP11 = 0x8A,
    DUP12 = 0x8B,
    DUP13 = 0x8C,
    DUP14 = 0x8D,
    DUP15 = 0x8E,
    DUP16 = 0x8F,
    SWAP1 = 0x90,
    SWAP2 = 0x91,
    SWAP3 = 0x92,
    SWAP4 = 0x93,
    SWAP5 = 0x94,
    SWAP6 = 0x95,
    SWAP7 = 0x96,
    SWAP8 = 0x97,
    SWAP9 = 0x98,
    SWAP10 = 0x99,
    SWAP11 = 0x9A,
    SWAP12 = 0x9B,
    SWAP13 = 0x9C,
    SWAP14 = 0x9D,
    SWAP15 = 0x9E,
    SWAP16 = 0x9F,
    LOG0 = 0xA0,
    LOG1 = 0xA1,
    LOG2 = 0xA2,
    LOG3 = 0xA3,
    LOG4 = 0xA4,
    /// Create new contract (0xF0)
    CREATE = 0xF0,
    /// Message-call into account (0xF1)
    CALL = 0xF1,
    /// Message-call with current code (0xF2)
    CALLCODE = 0xF2,
    /// Halt execution returning output data (0xF3)
    RETURN = 0xF3,
    /// Call with current sender and value (0xF4)
    DELEGATECALL = 0xF4,
    /// Create with deterministic address (0xF5)
    CREATE2 = 0xF5,
    /// Load return data (0xF7)
    RETURNDATALOAD = 0xF7,
    /// Extended call (EOF) (0xF8)
    EXTCALL = 0xF8,
    /// Extended delegate call (EOF) (0xF9)
    EXTDELEGATECALL = 0xF9,
    /// Static message-call (0xFA)
    STATICCALL = 0xFA,
    /// Extended static call (EOF) (0xFB)
    EXTSTATICCALL = 0xFB,
    /// Halt execution reverting state changes (0xFD)
    REVERT = 0xFD,
    /// Invalid instruction (0xFE)
    INVALID = 0xFE,
    /// Destroy current contract (0xFF)
    SELFDESTRUCT = 0xFF,
};

/// Convert an opcode to its byte representation.
///
/// Returns the underlying byte value of the opcode for use in
/// bytecode encoding/decoding and jump table lookups.
///
/// @param self The opcode to convert
/// @return The byte value (0x00-0xFF)
///
/// Example:
/// ```zig
/// const add_byte = Opcode.Enum.ADD.to_u8(); // Returns 0x01
/// const push1_byte = Opcode.Enum.PUSH1.to_u8(); // Returns 0x60
/// ```
pub fn to_u8(self: Enum) u8 {
    return @intFromEnum(self);
}

/// Get the human-readable name of an opcode.
///
/// Returns the mnemonic string representation of the opcode
/// as used in assembly code and debugging output.
///
/// @param self The opcode to get the name of
/// @return Static string containing the opcode mnemonic
///
/// Example:
/// ```zig
/// const name = Opcode.Enum.ADD.get_name(); // Returns "ADD"
/// std.debug.print("Executing opcode: {s}\n", .{name});
/// ```
pub fn get_name(self: Enum) []const u8 {
    // Build a lookup table at comptime
    const names = comptime blk: {
        var n: [256][]const u8 = undefined;

        // Initialize all to "UNDEFINED"
        for (&n) |*name| {
            name.* = "UNDEFINED";
        }

        // Map enum values to their names using reflection
        const enum_info = @typeInfo(Enum);
        switch (enum_info) {
            .@"enum" => |e| {
                for (e.fields) |field| {
                    const value = @field(Enum, field.name);
                    n[@intFromEnum(value)] = field.name;
                }
            },
            else => @compileError("get_name requires an enum type"),
        }

        break :blk n;
    };

    return names[@intFromEnum(self)];
}

````

````zig [src/evm/opcodes/operation.zig]
const std = @import("std");
const Opcode = @import("opcode.zig");
const ExecutionError = @import("../execution/execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Memory = @import("../memory.zig");

/// Operation metadata and execution functions for EVM opcodes.
///
/// This module defines the structure for EVM operations, including their
/// execution logic, gas costs, and stack requirements. Each opcode in the
/// EVM is associated with an Operation that controls its behavior.
///
/// ## Design Philosophy
/// Operations encapsulate all opcode-specific logic:
/// - Execution function that implements the opcode
/// - Gas calculation (both constant and dynamic)
/// - Stack validation requirements
/// - Memory expansion calculations
///
/// ## Function Types
/// The module uses function pointers for flexibility, allowing:
/// - Different implementations for different hardforks
/// - Optimized variants for specific conditions
/// - Mock implementations for testing
///
/// ## Gas Model
/// EVM gas costs consist of:
/// - Constant gas: Fixed cost for the operation
/// - Dynamic gas: Variable cost based on operation parameters
///
/// Example:
/// ```zig
/// // ADD operation
/// const add_op = Operation{
///     .execute = executeAdd,
///     .constant_gas = 3,
///     .min_stack = 2,
///     .max_stack = Stack.CAPACITY - 1,
/// };
/// ```
pub const ExecutionResult = @import("../execution/execution_result.zig");

/// Forward declaration for the interpreter context.
/// The actual interpreter implementation provides VM state and context.
pub const Interpreter = opaque {};

/// Forward declaration for execution state.
/// Contains transaction context, account state, and execution environment.
pub const State = opaque {};

/// Function signature for opcode execution.
///
/// Each opcode implements this signature to perform its operation.
/// The function has access to:
/// - Program counter for reading immediate values
/// - Interpreter for stack/memory manipulation
/// - State for account and storage access
///
/// @param pc Current program counter position
/// @param interpreter VM interpreter context
/// @param state Execution state and environment
/// @return Execution result indicating success/failure and gas consumption
pub const ExecutionFunc = *const fn (pc: usize, interpreter: *Interpreter, state: *State) ExecutionError.Error!ExecutionResult;

/// Function signature for dynamic gas calculation.
///
/// Some operations have variable gas costs based on:
/// - Current state (e.g., cold vs warm storage access)
/// - Operation parameters (e.g., memory expansion size)
/// - Network rules (e.g., EIP-2929 access lists)
///
/// @param interpreter VM interpreter context
/// @param state Execution state
/// @param stack Current stack for parameter inspection
/// @param memory Current memory for size calculations
/// @param requested_size Additional memory requested by operation
/// @return Dynamic gas cost to add to constant gas
/// @throws OutOfGas if gas calculation overflows
pub const GasFunc = *const fn (interpreter: *Interpreter, state: *State, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64;

/// Function signature for memory size calculation.
///
/// Operations that access memory need to calculate the required size
/// before execution to:
/// - Charge memory expansion gas
/// - Validate memory bounds
/// - Pre-allocate memory if needed
///
/// @param stack Stack containing operation parameters
/// @return Required memory size for the operation
pub const MemorySizeFunc = *const fn (stack: *Stack) Opcode.MemorySize;

/// EVM operation definition containing all metadata and functions.
///
/// Each entry in the jump table is an Operation that fully describes
/// how to execute an opcode, including validation, gas calculation,
/// and the actual execution logic.
pub const Operation = struct {

/// Execution function implementing the opcode logic.
/// This is called after all validations pass.
execute: ExecutionFunc,

/// Base gas cost for this operation.
/// This is the minimum gas charged regardless of parameters.
/// Defined by the Ethereum Yellow Paper and EIPs.
constant_gas: u64,

/// Optional dynamic gas calculation function.
/// Operations with variable costs (storage, memory, calls) use this
/// to calculate additional gas based on runtime parameters.
dynamic_gas: ?GasFunc = null,

/// Minimum stack items required before execution.
/// The operation will fail with StackUnderflow if the stack
/// has fewer than this many items.
min_stack: u32,

/// Maximum stack size allowed before execution.
/// Ensures the operation won't cause stack overflow.
/// Calculated as: CAPACITY - (pushes - pops)
max_stack: u32,

/// Optional memory size calculation function.
/// Operations that access memory use this to determine
/// memory expansion requirements before execution.
memory_size: ?MemorySizeFunc = null,

/// Indicates if this is an undefined/invalid opcode.
/// Undefined opcodes consume all gas and fail execution.
/// Used for opcodes not assigned in the current hardfork.
undefined: bool = false,

};

/// Singleton NULL operation for unassigned opcode slots.
///
/// This operation is used for opcodes that:
/// - Are not yet defined in the current hardfork
/// - Have been removed in the current hardfork
/// - Are reserved for future use
///
/// Executing NULL always results in InvalidOpcode error.
pub const NULL_OPERATION = Operation{
    .execute = undefined_execute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
    .undefined = true,
};

/// Execution function for undefined opcodes.
///
/// Consumes all remaining gas and returns InvalidOpcode error.
/// This ensures undefined opcodes cannot be used for computation.
fn undefined_execute(pc: usize, interpreter: *Interpreter, state: *State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.Error.InvalidOpcode;
}```
```zig [src/evm/context.zig]
const std = @import("std");
const Address = @import("Address");

/// Execution context providing transaction and block information to the EVM.
///
/// This structure encapsulates all environmental data that smart contracts
/// can access during execution. It provides the context needed for opcodes
/// like ORIGIN, TIMESTAMP, COINBASE, etc. to return appropriate values.
///
/// ## Purpose
/// The context separates environmental information from the VM's execution
/// state, enabling:
/// - Consistent environment across nested calls
/// - Easy testing with mock environments
/// - Support for historical block execution
/// - Fork simulation with custom parameters
///
/// ## Opcode Mapping
/// Context fields map directly to EVM opcodes:
/// - `tx_origin` → ORIGIN (0x32)
/// - `gas_price` → GASPRICE (0x3A)
/// - `block_number` → NUMBER (0x43)
/// - `block_timestamp` → TIMESTAMP (0x42)
/// - `block_coinbase` → COINBASE (0x41)
/// - `block_difficulty` → DIFFICULTY/PREVRANDAO (0x44)
/// - `block_gas_limit` → GASLIMIT (0x45)
/// - `chain_id` → CHAINID (0x46)
/// - `block_base_fee` → BASEFEE (0x48)
/// - `blob_hashes` → BLOBHASH (0x49)
///
/// ## Usage Example
/// ```zig
/// const context = Context.init_with_values(
///     .tx_origin = sender_address,
///     .gas_price = 20_000_000_000, // 20 gwei
///     .block_number = 15_000_000,
///     .block_timestamp = 1656633600,
///     .block_coinbase = miner_address,
///     .block_difficulty = 0, // post-merge
///     .block_gas_limit = 30_000_000,
///     .chain_id = 1, // mainnet
///     .block_base_fee = 15_000_000_000,
///     .blob_hashes = &.{},
///     .blob_base_fee = 1,
/// );
/// ```
const Context = @This();

/// The original sender address that initiated the transaction.
///
/// ## ORIGIN Opcode (0x32)
/// This value remains constant throughout all nested calls and
/// represents the externally-owned account (EOA) that signed the
/// transaction.
///
/// ## Security Warning
/// Using tx.origin for authentication is dangerous as it can be
/// exploited through phishing attacks. Always use msg.sender instead.
///
/// ## Example
/// EOA → Contract A → Contract B → Contract C
/// - tx.origin = EOA (same for all)
/// - msg.sender differs at each level
tx_origin: Address.Address = Address.zero(),
/// The gas price for the current transaction in wei.
///
/// ## GASPRICE Opcode (0x3A)
/// Returns the effective gas price that the transaction is paying:
/// - Legacy transactions: The specified gas price
/// - EIP-1559 transactions: min(maxFeePerGas, baseFee + maxPriorityFeePerGas)
///
/// ## Typical Values
/// - 1 gwei = 1,000,000,000 wei
/// - Mainnet: Usually 10-100 gwei
/// - Test networks: Often 0 or 1 gwei
gas_price: u256 = 0,
/// The current block number (height).
///
/// ## NUMBER Opcode (0x43)
/// Returns the number of the block being executed. Block numbers
/// start at 0 (genesis) and increment by 1 for each block.
///
/// ## Network Examples
/// - Mainnet genesis: 0
/// - The Merge: ~15,537,394
/// - Typical mainnet: >18,000,000
///
/// ## Use Cases
/// - Time-locked functionality
/// - Random number generation (pre-Merge)
/// - Historical reference points
block_number: u64 = 0,
/// The current block's timestamp in Unix seconds.
///
/// ## TIMESTAMP Opcode (0x42)
/// Returns seconds since Unix epoch (January 1, 1970).
/// Miners/validators can manipulate this within limits:
/// - Must be > parent timestamp
/// - Should be close to real time
///
/// ## Time Precision
/// - Pre-Merge: ~13 second blocks, loose precision
/// - Post-Merge: 12 second slots, more predictable
///
/// ## Security Note
/// Can be manipulated by miners/validators within ~15 seconds.
/// Not suitable for precise timing or as randomness source.
block_timestamp: u64 = 0,
/// The address of the block's miner/validator (beneficiary).
///
/// ## COINBASE Opcode (0x41)
/// Returns the address that receives block rewards and fees:
/// - Pre-Merge: Miner who found the block
/// - Post-Merge: Validator proposing the block
///
/// ## Special Values
/// - Zero address: Often used in tests
/// - Burn address: Some L2s burn fees
///
/// ## MEV Considerations
/// Searchers often send payments to block.coinbase for
/// transaction inclusion guarantees.
block_coinbase: Address.Address = Address.zero(),
/// Block difficulty (pre-Merge) or PREVRANDAO (post-Merge).
///
/// ## DIFFICULTY/PREVRANDAO Opcode (0x44)
/// The meaning changed at The Merge:
/// - Pre-Merge: Mining difficulty value
/// - Post-Merge: Previous block's RANDAO value
///
/// ## PREVRANDAO Usage
/// Provides weak randomness from beacon chain:
/// - NOT cryptographically secure
/// - Can be biased by validators
/// - Suitable only for non-critical randomness
///
/// ## Typical Values
/// - Pre-Merge: 10^15 to 10^16 range
/// - Post-Merge: Random 256-bit value
block_difficulty: u256 = 0,
/// Maximum gas allowed in the current block.
///
/// ## GASLIMIT Opcode (0x45)
/// Returns the total gas limit for all transactions in the block.
/// This limit is adjusted by miners/validators within protocol rules:
/// - Can change by max 1/1024 per block
/// - Target: 15M gas (100% full blocks)
/// - Max: 30M gas (200% full blocks)
///
/// ## Typical Values
/// - Mainnet: ~30,000,000
/// - Some L2s: 100,000,000+
///
/// ## EIP-1559 Impact
/// Elastic block sizes allow temporary increases to 2x target.
block_gas_limit: u64 = 0,
/// The chain identifier for replay protection.
///
/// ## CHAINID Opcode (0x46)
/// Returns the unique identifier for the current chain,
/// preventing transaction replay across different networks.
///
/// ## Common Values
/// - 1: Ethereum Mainnet
/// - 5: Goerli (deprecated)
/// - 11155111: Sepolia
/// - 137: Polygon
/// - 10: Optimism
/// - 42161: Arbitrum One
///
/// ## EIP-155
/// Introduced chain ID to prevent replay attacks where
/// signed transactions could be valid on multiple chains.
chain_id: u256 = 1,
/// The base fee per gas for the current block (EIP-1559).
///
/// ## BASEFEE Opcode (0x48)
/// Returns the minimum fee per gas that must be paid for
/// transaction inclusion. Dynamically adjusted based on
/// parent block's gas usage:
/// - Increases if blocks are >50% full
/// - Decreases if blocks are <50% full
/// - Changes by max 12.5% per block
///
/// ## Fee Calculation
/// Total fee = (base fee + priority fee) * gas used
/// Base fee is burned, priority fee goes to validator.
///
/// ## Typical Values
/// - Low congestion: 5-10 gwei
/// - Normal: 15-30 gwei
/// - High congestion: 100+ gwei
block_base_fee: u256 = 0,
/// List of blob hashes for EIP-4844 blob transactions.
///
/// ## BLOBHASH Opcode (0x49)
/// Returns the hash of a blob at the specified index.
/// Blob transactions can include up to 6 blobs, each
/// containing ~125KB of data for L2 data availability.
///
/// ## Blob Properties
/// - Size: 4096 field elements (~125KB)
/// - Hash: KZG commitment of blob data
/// - Lifetime: ~18 days on chain
/// - Cost: Separate blob fee market
///
/// ## Empty for Non-Blob Transactions
/// Regular transactions have no blob hashes.
blob_hashes: []const u256 = &[_]u256{},
/// The base fee per blob gas for the current block (EIP-4844).
///
/// ## BLOBBASEFEE Opcode (0x4A)
/// Returns the current base fee for blob gas, which uses
/// a separate fee market from regular transaction gas.
///
/// ## Blob Fee Market
/// - Independent from regular gas fees
/// - Target: 3 blobs per block
/// - Max: 6 blobs per block
/// - Adjusts similar to EIP-1559
///
/// ## Cost Calculation
/// Blob cost = blob_base_fee * blob_gas_used
/// Where blob_gas_used = num_blobs * 131,072
///
/// ## Typical Values
/// - Low usage: 1 wei
/// - High usage: Can spike significantly
blob_base_fee: u256 = 0,

/// Creates a new context with default values.
///
/// ## Default Values
/// - All addresses: Zero address (0x0000...0000)
/// - All numbers: 0
/// - Chain ID: 1 (Ethereum mainnet)
/// - Blob hashes: Empty array
///
/// ## Usage
/// ```zig
/// const context = Context.init();
/// // Suitable for basic testing, but usually you'll want
/// // to set more realistic values
/// ```
///
/// ## Warning
/// Default values may not be suitable for production use.
/// Consider using `init_with_values` for realistic contexts.
pub fn init() Context {
    return .{};
}

/// Creates a new context with specified values.
///
/// This constructor allows full control over all environmental
/// parameters, enabling accurate simulation of any blockchain state.
///
/// ## Parameters
/// - `tx_origin`: EOA that initiated the transaction
/// - `gas_price`: Effective gas price in wei
/// - `block_number`: Current block height
/// - `block_timestamp`: Unix timestamp in seconds
/// - `block_coinbase`: Block producer address
/// - `block_difficulty`: Difficulty or PREVRANDAO value
/// - `block_gas_limit`: Maximum gas for the block
/// - `chain_id`: Network identifier
/// - `block_base_fee`: EIP-1559 base fee
/// - `blob_hashes`: Array of blob hashes for EIP-4844
/// - `blob_base_fee`: Base fee for blob gas
///
/// ## Example
/// ```zig
/// const context = Context.init_with_values(
///     sender_address,           // tx_origin
///     20_000_000_000,          // gas_price: 20 gwei
///     18_500_000,              // block_number
///     1_700_000_000,           // block_timestamp
///     validator_address,        // block_coinbase
///     0,                       // block_difficulty (post-merge)
///     30_000_000,              // block_gas_limit
///     1,                       // chain_id: mainnet
///     15_000_000_000,          // block_base_fee: 15 gwei
///     &[_]u256{},              // blob_hashes: none
///     1,                       // blob_base_fee: minimum
/// );
/// ```
pub fn init_with_values(
    tx_origin: Address.Address,
    gas_price: u256,
    block_number: u64,
    block_timestamp: u64,
    block_coinbase: Address.Address,
    block_difficulty: u256,
    block_gas_limit: u64,
    chain_id: u256,
    block_base_fee: u256,
    blob_hashes: []const u256,
    blob_base_fee: u256,
) Context {
    return .{
        .tx_origin = tx_origin,
        .gas_price = gas_price,
        .block_number = block_number,
        .block_timestamp = block_timestamp,
        .block_coinbase = block_coinbase,
        .block_difficulty = block_difficulty,
        .block_gas_limit = block_gas_limit,
        .chain_id = chain_id,
        .block_base_fee = block_base_fee,
        .blob_hashes = blob_hashes,
        .blob_base_fee = blob_base_fee,
    };
}

/// Checks if the context represents Ethereum mainnet.
///
/// ## Returns
/// - `true` if chain_id == 1 (Ethereum mainnet)
/// - `false` for all other networks
///
/// ## Common Chain IDs
/// - 1: Ethereum Mainnet ✓
/// - 5: Goerli Testnet ✗
/// - 137: Polygon ✗
/// - 10: Optimism ✗
///
/// ## Usage
/// ```zig
/// if (context.is_eth_mainnet()) {
///     // Apply mainnet-specific logic
///     // e.g., different gas limits, precompiles
/// }
/// ```
///
/// ## Note
/// This is a convenience method. For checking other chains,
/// compare chain_id directly.
pub fn is_eth_mainnet(self: Context) bool {
    return self.chain_id == 1;
}
````

````zig [src/evm/evm.zig]
//! EVM (Ethereum Virtual Machine) module - Core execution engine
//!
//! This is the main entry point for the EVM implementation. It exports all
//! the components needed to execute Ethereum bytecode, manage state, and
//! handle the complete lifecycle of smart contract execution.
//!
//! ## Architecture Overview
//!
//! The EVM is structured into several key components:
//!
//! ### Core Execution
//! - **VM**: The main virtual machine that orchestrates execution
//! - **Frame**: Execution contexts for calls and creates
//! - **Stack**: 256-bit word stack (max 1024 elements)
//! - **Memory**: Byte-addressable memory (expands as needed)
//! - **Contract**: Code and storage management
//!
//! ### Opcodes
//! - **Opcode**: Enumeration of all EVM instructions
//! - **Operation**: Metadata about each opcode (gas, stack effects)
//! - **JumpTable**: Maps opcodes to their implementations
//! - **execution/**: Individual opcode implementations
//!
//! ### Error Handling
//! - **ExecutionError**: Unified error type for all execution failures
//! - Strongly typed errors for each component
//! - Error mapping utilities for consistent handling
//!
//! ### Utilities
//! - **CodeAnalysis**: Bytecode analysis and jump destination detection
//! - **Hardfork**: Fork-specific behavior configuration
//! - **gas_constants**: Gas cost calculations
//! - **chain_rules**: Chain-specific validation rules
//!
//! ## Usage Example
//!
//! ```zig
//! const evm = @import("evm");
//!
//! // Create a VM instance
//! var vm = try evm.Vm.init(allocator, config);
//! defer vm.deinit();
//!
//! // Execute bytecode
//! const result = try vm.run(bytecode, context);
//! ```
//!
//! ## Design Principles
//!
//! 1. **Correctness**: Strict adherence to Ethereum Yellow Paper
//! 2. **Performance**: Efficient execution with minimal allocations
//! 3. **Safety**: Strong typing and comprehensive error handling
//! 4. **Modularity**: Clear separation of concerns
//! 5. **Testability**: Extensive test coverage for all components

const std = @import("std");

// Import external modules
/// Address utilities for Ethereum addresses
pub const Address = @import("Address");

// Import all EVM modules

/// Bytecode analysis for jump destination detection
pub const CodeAnalysis = @import("contract/code_analysis.zig");

/// Contract code and storage management
pub const Contract = @import("contract/contract.zig");

/// Unified error types for EVM execution
pub const ExecutionError = @import("execution/execution_error.zig");

/// Execution result type
pub const ExecutionResult = @import("execution/execution_result.zig");

/// Execution frame/context management
pub const Frame = @import("frame.zig");

/// Ethereum hardfork configuration
pub const Hardfork = @import("hardforks/hardfork.zig");

/// Opcode to implementation mapping
pub const JumpTable = @import("jump_table/jump_table.zig");

/// Byte-addressable memory implementation
pub const Memory = @import("memory.zig");

/// EVM instruction enumeration
pub const Opcode = @import("opcodes/opcode.zig");

/// Opcode metadata (gas costs, stack effects)
pub const Operation = @import("opcodes/operation.zig");

/// Backwards compatibility alias for test files
pub const OperationModule = Operation;

/// 256-bit word stack implementation
pub const Stack = @import("stack/stack.zig");

/// Stack depth validation utilities
pub const stack_validation = @import("stack/stack_validation.zig");

/// Storage slot pooling for gas optimization
pub const StoragePool = @import("contract/storage_pool.zig");

/// Main virtual machine implementation
pub const Vm = @import("vm.zig");

/// EVM state management (accounts, storage, logs)
pub const EvmState = @import("state/state.zig");

/// Precompiled contracts implementation (IDENTITY, SHA256, etc.)
pub const Precompiles = @import("precompiles/precompiles.zig");

// Import execution
/// All opcode implementations (arithmetic, stack, memory, etc.)
pub const execution = @import("execution/package.zig");

// Backwards compatibility alias
pub const opcodes = execution;

// Import utility modules

/// Bit vector utilities for jump destination tracking
pub const bitvec = @import("contract/bitvec.zig");

/// Chain-specific validation rules
pub const chain_rules = @import("hardforks/chain_rules.zig");

/// EVM constants (stack size, memory limits, etc.)
pub const constants = @import("constants/constants.zig");

/// EIP-7702 EOA delegation bytecode format
pub const eip_7702_bytecode = @import("contract/eip_7702_bytecode.zig");

/// Fee market calculations (EIP-1559)
pub const fee_market = @import("fee_market.zig");

/// Gas cost constants and calculations
pub const gas_constants = @import("constants/gas_constants.zig");

/// Memory size limits and expansion rules
pub const memory_limits = @import("constants/memory_limits.zig");

// Export all error types for strongly typed error handling
///
/// These error types provide fine-grained error handling throughout
/// the EVM. Each error type corresponds to a specific failure mode,
/// allowing precise error handling and recovery strategies.

// VM error types
/// Errors from VM contract creation operations
pub const CreateContractError = Vm.CreateContractError;
pub const CallContractError = Vm.CallContractError;
pub const ConsumeGasError = Vm.ConsumeGasError;
pub const Create2ContractError = Vm.Create2ContractError;
pub const CallcodeContractError = Vm.CallcodeContractError;
pub const DelegatecallContractError = Vm.DelegatecallContractError;
pub const StaticcallContractError = Vm.StaticcallContractError;
pub const EmitLogError = Vm.EmitLogError;
pub const InitTransactionAccessListError = Vm.InitTransactionAccessListError;
pub const PreWarmAddressesError = Vm.PreWarmAddressesError;
pub const PreWarmStorageSlotsError = Vm.PreWarmStorageSlotsError;
pub const GetAddressAccessCostError = Vm.GetAddressAccessCostError;
pub const GetStorageAccessCostError = Vm.GetStorageAccessCostError;
pub const GetCallCostError = Vm.GetCallCostError;
pub const ValidateStaticContextError = Vm.ValidateStaticContextError;
pub const SetStorageProtectedError = Vm.SetStorageProtectedError;
pub const SetTransientStorageProtectedError = Vm.SetTransientStorageProtectedError;
pub const SetBalanceProtectedError = Vm.SetBalanceProtectedError;
pub const SetCodeProtectedError = Vm.SetCodeProtectedError;
pub const EmitLogProtectedError = Vm.EmitLogProtectedError;
pub const CreateContractProtectedError = Vm.CreateContractProtectedError;
pub const Create2ContractProtectedError = Vm.Create2ContractProtectedError;
pub const ValidateValueTransferError = Vm.ValidateValueTransferError;
pub const SelfdestructProtectedError = Vm.SelfdestructProtectedError;

// VM result types
/// Result of running EVM bytecode
pub const RunResult = Vm.RunResult;
/// Result of CREATE/CREATE2 operations
pub const CreateResult = Vm.CreateResult;
/// Result of CALL/DELEGATECALL/STATICCALL operations
pub const CallResult = Vm.CallResult;

// Memory error types
/// Errors from memory operations (expansion, access)
pub const MemoryError = Memory.MemoryError;

// Stack error types
/// Errors from stack operations (overflow, underflow)
pub const StackError = Stack.Error;

// Contract error types
/// General contract operation errors
pub const ContractError = Contract.ContractError;
/// Storage access errors
pub const StorageOperationError = Contract.StorageOperationError;
/// Bytecode analysis errors
pub const CodeAnalysisError = Contract.CodeAnalysisError;
/// Storage warming errors (EIP-2929)
pub const MarkStorageSlotWarmError = Contract.MarkStorageSlotWarmError;

// Access List error types (imported via import statement to avoid circular deps)
/// Access list module for EIP-2929/2930 support
const AccessListModule = @import("access_list/access_list.zig");
/// Error accessing addresses in access list
pub const AccessAddressError = AccessListModule.AccessAddressError;
/// Error accessing storage slots in access list
pub const AccessStorageSlotError = AccessListModule.AccessStorageSlotError;
/// Error pre-warming addresses
pub const PreWarmAddressesAccessListError = AccessListModule.PreWarmAddressesError;
/// Error pre-warming storage slots
pub const PreWarmStorageSlotsAccessListError = AccessListModule.PreWarmStorageSlotsError;
/// Error initializing transaction access list
pub const InitTransactionError = AccessListModule.InitTransactionError;
/// Error calculating call costs with access list
pub const GetCallCostAccessListError = AccessListModule.GetCallCostError;

// Address error types
/// Error calculating CREATE address
pub const CalculateAddressError = Address.CalculateAddressError;
/// Error calculating CREATE2 address
pub const CalculateCreate2AddressError = Address.CalculateCreate2AddressError;

// Execution error
/// Main execution error enumeration used throughout EVM
pub const ExecutionErrorEnum = ExecutionError.Error;

// Tests - run individual module tests to isolate segfault
test "VM module" {
    std.testing.refAllDecls(Vm);
}

test "Frame module" {
    std.testing.refAllDecls(Frame);
}

test "Stack module" {
    std.testing.refAllDecls(Stack);
}

test "Memory module" {
    std.testing.refAllDecls(Memory);
}

test "ExecutionError module" {
    std.testing.refAllDecls(ExecutionError);
}

test "Contract module" {
    std.testing.refAllDecls(Contract);
}

test "JumpTable module" {
    std.testing.refAllDecls(JumpTable);
}
````

        </code>

</context>
</prompt>
