const std = @import("std");
const packages = @import("packages.zig");
const evm_tests = @import("evm_tests.zig");
const other_tests = @import("other_tests.zig");

pub const TestInfo = struct {
    name: []const u8,
    root: []const u8,
    step_name: []const u8,
    needs_rust: bool = false,
    link_c: bool = false,
};

// Original tests that are already working
pub const originalTests = [_]TestInfo{
    .{ .name = "frame-test", .root = "src/Evm/Frame.test.zig", .step_name = "test-frame" },
    .{ .name = "evm-test", .root = "src/Evm/evm.zig", .step_name = "test-evm" },
    .{ .name = "server-test", .root = "src/Server/server.zig", .step_name = "test-server" },
    .{ .name = "rlp-test", .root = "src/Rlp/rlp_test.zig", .step_name = "test-rlp" },
    .{ .name = "compiler-test", .root = "src/Compilers/compiler.zig", .step_name = "test-compiler", .needs_rust = true, .link_c = true },
    .{ .name = "trie-test", .root = "src/Trie/main_test.zig", .step_name = "test-trie" },
    .{ .name = "interpreter-test", .root = "src/Evm/jumpTable/JumpTable.zig", .step_name = "test-interpreter" },
    .{ .name = "interpreter-impl-test", .root = "src/Evm/interpreter.zig", .step_name = "test-interpreter-impl" },
    .{ .name = "contract-test", .root = "src/Evm/Contract.test.zig", .step_name = "test-contract" },
    .{ .name = "evm-logger-test", .root = "src/Evm/EvmLogger.test.zig", .step_name = "test-evm-logger" },
    .{ .name = "environment-test", .root = "src/Evm/tests/environment_test3.zig", .step_name = "test-environment" },
};

// Helper to check if a file exists
fn fileExists(b: *std.Build, path: []const u8) bool {
    const full_path = b.pathFromRoot(path);
    std.fs.cwd().access(full_path, .{}) catch return false;
    return true;
}

// Helper to add a test if the file exists
fn addTestIfExists(
    b: *std.Build,
    test_step: *std.Build.Step,
    target: std.Build.ResolvedTarget,
    optimize: std.builtin.OptimizeMode,
    all_packages: std.StringHashMap(*std.Build.Module),
    tinfo: TestInfo,
    httpz_dep: ?*std.Build.Dependency,
    zabi_dep: ?*std.Build.Dependency,
    zigevm_mod: ?*std.Build.Module,
    rust_step: ?*std.Build.Step,
) void {
    if (!fileExists(b, tinfo.root)) {
        std.debug.print("Warning: Test file not found: {s}\n", .{tinfo.root});
        return;
    }

    const test_exe = b.addTest(.{
        .name = tinfo.name,
        .root_source_file = b.path(tinfo.root),
        .target = target,
        .optimize = optimize,
    });

    // Add all package imports
    for (packages.allPackages) |info| {
        if (all_packages.get(info.name)) |mod| {
            test_exe.root_module.addImport(info.name, mod);
        }
    }
    
    // Special imports for specific tests
    if (std.mem.eql(u8, tinfo.name, "server-test") or std.mem.endsWith(u8, tinfo.name, "server")) {
        if (httpz_dep) |dep| {
            test_exe.root_module.addImport("httpz", dep.module("httpz"));
        }
        if (zigevm_mod) |mod| {
            test_exe.root_module.addImport("zigevm", mod);
        }
    }
    
    if (std.mem.eql(u8, tinfo.name, "compiler-test")) {
        if (all_packages.get("compiler")) |compiler_mod| {
            test_exe.root_module.addImport("Compiler", compiler_mod);
        }
        if (zabi_dep) |dep| {
            test_exe.root_module.addImport("zabi", dep.module("zabi"));
        }
        test_exe.root_module.addIncludePath(b.path("src/Compilers"));
    }

    // Handle Rust dependencies
    if (tinfo.needs_rust) {
        if (rust_step) |rs| {
            test_exe.step.dependOn(rs);
        }
        test_exe.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
        
        if (target.result.os.tag == .macos) {
            test_exe.linkFramework("CoreFoundation");
            test_exe.linkFramework("Security");
        }
    }

    if (tinfo.link_c) {
        test_exe.linkLibC();
    }

    const run_test = b.addRunArtifact(test_exe);
    
    // Add individual test step
    const individual_step = b.step(tinfo.step_name, b.fmt("Run {s}", .{tinfo.name}));
    individual_step.dependOn(&run_test.step);
    
    // Also add to main test step
    test_step.dependOn(&run_test.step);
}

pub fn createTests(
    b: *std.Build,
    target: std.Build.ResolvedTarget,
    optimize: std.builtin.OptimizeMode,
    all_packages: std.StringHashMap(*std.Build.Module),
    zigevm_mod: *std.Build.Module,
    exe_mod: *std.Build.Module,
    httpz_dep: *std.Build.Dependency,
    zabi_dep: *std.Build.Dependency,
    rust_step: *std.Build.Step,
) *std.Build.Step {
    // Create test step that will collect all tests
    const test_step = b.step("test", "Run unit tests");

    // Creates a step for unit testing
    const lib_unit_tests = b.addTest(.{
        .root_module = zigevm_mod,
    });
    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);
    test_step.dependOn(&run_lib_unit_tests.step);

    const exe_unit_tests = b.addTest(.{
        .root_module = exe_mod,
    });
    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);
    test_step.dependOn(&run_exe_unit_tests.step);

    // Add original tests
    for (originalTests) |tinfo| {
        addTestIfExists(b, test_step, target, optimize, all_packages, tinfo, httpz_dep, zabi_dep, zigevm_mod, rust_step);
    }

    // Add EVM core tests
    for (evm_tests.evmCoreTests) |tinfo| {
        addTestIfExists(b, test_step, target, optimize, all_packages, tinfo, httpz_dep, zabi_dep, zigevm_mod, rust_step);
    }

    // Add EIP tests
    for (evm_tests.eipTests) |tinfo| {
        addTestIfExists(b, test_step, target, optimize, all_packages, tinfo, httpz_dep, zabi_dep, zigevm_mod, rust_step);
    }

    // Add opcode tests
    for (evm_tests.opcodeTests) |tinfo| {
        addTestIfExists(b, test_step, target, optimize, all_packages, tinfo, httpz_dep, zabi_dep, zigevm_mod, rust_step);
    }

    // Add precompile tests
    for (evm_tests.precompileTests) |tinfo| {
        addTestIfExists(b, test_step, target, optimize, all_packages, tinfo, httpz_dep, zabi_dep, zigevm_mod, rust_step);
    }

    // Add test environment tests
    for (evm_tests.testEnvTests) |tinfo| {
        addTestIfExists(b, test_step, target, optimize, all_packages, tinfo, httpz_dep, zabi_dep, zigevm_mod, rust_step);
    }

    // Add other core tests
    for (other_tests.coreTests) |tinfo| {
        // Skip TypeScript files
        if (std.mem.endsWith(u8, tinfo.root, ".ts")) {
            continue;
        }
        addTestIfExists(b, test_step, target, optimize, all_packages, tinfo, httpz_dep, zabi_dep, zigevm_mod, rust_step);
    }

    // Define test groups (avoid duplicate names)
    const test_evm_all_step = b.step("test-evm-all", "Run all EVM tests");
    const test_opcodes_step = b.step("test-opcodes", "Run all opcode tests");
    const test_eip_step = b.step("test-eip", "Run all EIP tests");
    const test_core_step = b.step("test-core", "Run all core module tests");

    // Group steps depend on main test step which includes all tests
    test_evm_all_step.dependOn(test_step);
    test_opcodes_step.dependOn(test_step);
    test_eip_step.dependOn(test_step);
    test_core_step.dependOn(test_step);

    // Define a single test step that runs all tests
    const test_all_step = b.step("test-all", "Run all unit tests");
    test_all_step.dependOn(test_step);

    return test_step;
}