const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const test_memory = b.addTest(.{
        .root_source_file = b.path("memory.test.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add include paths for imports
    test_memory.addIncludePath(b.path("../.."));

    const run_tests = b.step("test", "Run the tests");
    run_tests.dependOn(&test_memory.step);
}