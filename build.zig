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

    // First create individual modules for each component
    const address_mod = b.createModule(.{
        .root_source_file = b.path("src/Address/address.zig"),
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

    // Create a ZigEVM module - our core EVM implementation
    const zigevm_mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add package paths for absolute imports for all modules
    zigevm_mod.addImport("Address", address_mod);
    zigevm_mod.addImport("Abi", abi_mod);
    zigevm_mod.addImport("Block", block_mod);
    zigevm_mod.addImport("Bytecode", bytecode_mod);
    zigevm_mod.addImport("Compiler", compiler_mod);
    zigevm_mod.addImport("Evm", evm_mod);
    zigevm_mod.addImport("Rlp", rlp_mod);
    zigevm_mod.addImport("Token", token_mod);
    zigevm_mod.addImport("Utils", utils_mod);

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
        // For WASM we typically want small size
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
    wasm_mod.addImport("Utils", utils_mod);

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

    // Creates a step for unit testing.
    const lib_unit_tests = b.addTest(.{
        .root_module = zigevm_mod,
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
    lib_unit_tests.root_module.addImport("Utils", utils_mod);

    // Additional standalone test specifically for Frame_test.zig
    const frame_test = b.addTest(.{
        .name = "frame-test",
        .root_source_file = b.path("src/Evm/Frame_test.zig"),
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
    evm_test.root_module.addImport("Utils", utils_mod);
    
    const run_evm_test = b.addRunArtifact(evm_test);
    
    // Add a separate step for testing the EVM
    const evm_test_step = b.step("test-evm", "Run EVM tests");
    evm_test_step.dependOn(&run_evm_test.step);

    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);

    const exe_unit_tests = b.addTest(.{
        .root_module = exe_mod,
    });

    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);

    // Define test step
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
    test_step.dependOn(&run_exe_unit_tests.step);
}
