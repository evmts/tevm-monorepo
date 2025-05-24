const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const test_step = b.step("test", "Run tests");
    
    // Build a test for the math2 module
    const math2_test = b.addTest(.{
        .root_source_file = b.path("math2.test.zig"),
        .target = target,
        .optimize = optimize,
    });
    
    // Add the src directory to the include path
    math2_test.addIncludePath(.{ .path = b.pathFromRoot("../..") });
    
    // Create a run step for the tests
    const run_math2_tests = b.addRunArtifact(math2_test);
    test_step.dependOn(&run_math2_tests.step);
}