const std = @import("std");
const packages = @import("packages.zig");

pub const TestInfo = struct {
    name: []const u8,
    root: []const u8,
    step_name: []const u8,
    needs_rust: bool = false,
    link_c: bool = false,
};

pub const allTests = [_]TestInfo{
    .{ .name = "frame-test", .root = "src/Evm/Frame.test.zig", .step_name = "test-frame" },
    .{ .name = "evm-test", .root = "src/Evm/evm.zig", .step_name = "test-evm" },
    .{ .name = "server-test", .root = "src/Server/server.zig", .step_name = "test-server" },
    .{ .name = "rlp-test", .root = "src/Rlp/rlp_test.zig", .step_name = "test-rlp" },
    .{ .name = "compiler-test", .root = "src/Compilers/compiler.zig", .step_name = "test-compiler", .needs_rust = true, .link_c = true },
    .{ .name = "trie-test", .root = "src/Trie/main_test.zig", .step_name = "test-trie" },
    .{ .name = "interpreter-test", .root = "src/Evm/jumpTable/JumpTable.zig", .step_name = "test-interpreter" },
    .{ .name = "interpreter-impl-test", .root = "src/Evm/interpreter_test.zig", .step_name = "test-interpreter-impl" },
    .{ .name = "contract-test", .root = "src/Evm/Contract.test.zig", .step_name = "test-contract" },
    .{ .name = "evm-logger-test", .root = "src/Evm/EvmLogger.test.zig", .step_name = "test-evm-logger" },
    .{ .name = "environment-test", .root = "src/Evm/tests/environment_test3.zig", .step_name = "test-environment" },
};

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

    // Add individual tests
    for (allTests) |tinfo| {
        const test_exe = b.addTest(.{
            .name = tinfo.name,
            .root_source_file = b.path(tinfo.root),
            .target = target,
            .optimize = optimize,
        });

        // Add all package imports
        for (packages.allPackages) |info| {
            test_exe.root_module.addImport(info.name, all_packages.get(info.name).?);
        }
        
        // Special imports for specific tests
        if (std.mem.eql(u8, tinfo.name, "server-test")) {
            test_exe.root_module.addImport("httpz", httpz_dep.module("httpz"));
            test_exe.root_module.addImport("zigevm", zigevm_mod);
        }
        
        if (std.mem.eql(u8, tinfo.name, "compiler-test")) {
            const compiler_mod = all_packages.get("compiler").?;
            test_exe.root_module.addImport("Compiler", compiler_mod);
            test_exe.root_module.addImport("zabi", zabi_dep.module("zabi"));
            test_exe.root_module.addIncludePath(b.path("src/Compilers"));
        }

        // Handle Rust dependencies
        if (tinfo.needs_rust) {
            test_exe.step.dependOn(rust_step);
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

    // Define a single test step that runs all tests
    const test_all_step = b.step("test-all", "Run all unit tests");
    test_all_step.dependOn(test_step);

    return test_step;
}