const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // Tests are now integrated into the main opcode files
    const opcode_files = [_][]const u8{
        "bitwise.zig",
        "blob.zig",
        "block.zig",
        "calls.zig",
        "comparison.zig",
        "controlflow.zig",
        "crypto.zig",
        "environment.zig",
        "log.zig",
        "math.zig",
        "math2.zig",
        "memory.zig",
        "storage.zig",
        "transient.zig",
    };

    // Create test executables for each opcode file
    for (opcode_files) |opcode_file| {
        const base_name = std.mem.sliceTo(opcode_file, '.');
        const test_name = b.fmt("{s}-test", .{base_name});
        
        const test_exe = b.addTest(.{
            .name = test_name,
            .root_source_file = b.path(opcode_file),
            .target = target,
            .optimize = optimize,
        });
        
        // Add include paths for imports
        test_exe.addIncludePath(.{ .path = "../.." });
        
        // Create a runnable step for the test
        const run_test_cmd = b.addRunArtifact(test_exe);
        
        // Add the test to the "test" step
        const test_step = b.step(b.fmt("test-{s}", .{base_name}), 
                                b.fmt("Run {s} tests", .{base_name}));
        test_step.dependOn(&run_test_cmd.step);
        
        // Add this test to the main "test" step as well
        const run_tests = b.step("test", "Run all opcode tests");
        run_tests.dependOn(&run_test_cmd.step);
    }
    
    // Test for expanded test files that still exist
    const expanded_test_files = [_][]const u8{
        "calls_expanded_test.zig",
        "mcopy_expanded_test.zig",
        "transient_expanded_test.zig",
        "opcodes_expanded_test.zig",
        "opcodes_expanded_simplified_test.zig",
    };
    
    for (expanded_test_files) |test_file| {
        const base_name = std.mem.sliceTo(test_file, '.');
        const test_name = b.fmt("{s}", .{base_name});
        
        const test_exe = b.addTest(.{
            .name = test_name,
            .root_source_file = b.path(test_file),
            .target = target,
            .optimize = optimize,
        });
        
        // Add include paths for imports
        test_exe.addIncludePath(.{ .path = "../.." });
        
        // Create a runnable step for the test
        const run_test_cmd = b.addRunArtifact(test_exe);
        
        // Add the test to its own step
        const test_step = b.step(b.fmt("test-{s}", .{base_name}), 
                                b.fmt("Run {s}", .{base_name}));
        test_step.dependOn(&run_test_cmd.step);
    }
    
    // Special handling for remaining standalone test files
    const standalone_tests = [_]struct {
        name: []const u8,
        file: []const u8,
    }{
        .{ .name = "eip1153", .file = "eip1153.test.zig" },
        .{ .name = "eip4844", .file = "eip4844.test.zig" },
        .{ .name = "fixed-controlflow", .file = "fixed_controlflow.test.zig" },
        .{ .name = "package", .file = "package_test.zig" },
        .{ .name = "fixed-package", .file = "fixed_package_test.zig" },
    };
    
    for (standalone_tests) |test_info| {
        const test_exe = b.addTest(.{
            .name = b.fmt("{s}-test", .{test_info.name}),
            .root_source_file = b.path(test_info.file),
            .target = target,
            .optimize = optimize,
        });
        
        // Add include paths for imports
        test_exe.addIncludePath(.{ .path = "../.." });
        
        // Create a runnable step for the test
        const run_test_cmd = b.addRunArtifact(test_exe);
        
        // Add the test to its own step
        const test_step = b.step(b.fmt("test-{s}", .{test_info.name}), 
                                b.fmt("Run {s} tests", .{test_info.name}));
        test_step.dependOn(&run_test_cmd.step);
    }
}