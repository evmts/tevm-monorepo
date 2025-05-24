const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const memory_tests = b.addTest(.{
        .root_source_file = b.path("memory_tests.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add the module dependencies
    memory_tests.addIncludePath(b.path(".."));
    memory_tests.addIncludePath(b.path("../.."));

    const test_step = b.step("test", "Run memory tests");
    test_step.dependOn(&memory_tests.step);
}