const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // Tests for individual opcode groups
    const test_files = [_][]const u8{
        "bitwise.test.zig",
        "blob.test.zig",
        "block.test.zig",
        "calls.test.zig",
        "comparison.test.zig",
        "controlflow.test.zig",
        "crypto.test.zig",
        "environment.test.zig",
        "log.test.zig", 
        "math.test.zig",
        "math2.test.zig",
        "memory.test.zig",
        "memory.zig.test.zig", // Additional test for memory gas calculations
        "storage.test.zig",
        "transient.test.zig",
    };

    // Create test executables for each test file
    for (test_files) |test_file| {
        const base_name = std.mem.sliceTo(test_file, '.');
        const test_name = b.fmt("{s}-test", .{base_name});
        
        const test_exe = b.addTest(.{
            .name = test_name,
            .root_source_file = .{ .path = test_file },
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
    
    // Test for the math2 submodule tests
    const test_math2 = b.addTest(.{
        .name = "math2-submodule-test",
        .root_source_file = .{ .path = "tests/math2_test.zig" },
        .target = target,
        .optimize = optimize,
    });
    
    // Add include paths for imports
    test_math2.addIncludePath(.{ .path = "../.." });
    
    // Create a runnable step for the math2 submodule test
    const run_math2_test = b.addRunArtifact(test_math2);
    
    // Add the math2 submodule test to its own step
    const test_math2_step = b.step("test-math2-submodule", "Run math2 submodule tests");
    test_math2_step.dependOn(&run_math2_test.step);
    
    // Add the math2 submodule test to the main "test" step as well
    const run_tests = b.getExistingStep("test") orelse b.step("test", "Run all tests");
    run_tests.dependOn(&run_math2_test.step);
}