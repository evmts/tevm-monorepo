const std = @import("std");

pub const PackageInfo = struct {
    name: []const u8,
    path: []const u8,
    imports: []const []const u8,
};

pub const allPackages: []const PackageInfo = &.{
    .{ .name = "evm", .path = "src/Evm/package.zig", .imports = &.{ "utils", "address", "block", "bytecode", "compiler", "rlp", "token", "trie", "StateManager", "test_utils" } },
    .{ .name = "utils", .path = "src/Utils/package.zig", .imports = &.{} },
    .{ .name = "address", .path = "src/Address/package.zig", .imports = &.{"utils"} },
    .{ .name = "block", .path = "src/Block/package.zig", .imports = &.{ "utils", "rlp" } },
    .{ .name = "bytecode", .path = "src/Bytecode/package.zig", .imports = &.{"utils"} },
    .{ .name = "rlp", .path = "src/Rlp/package.zig", .imports = &.{} },
    .{ .name = "token", .path = "src/Token/package.zig", .imports = &.{} },
    .{ .name = "trie", .path = "src/Trie/package.zig", .imports = &.{ "utils", "rlp" } },
    .{ .name = "StateManager", .path = "src/StateManager/package.zig", .imports = &.{ "utils", "address" } },
    .{ .name = "test_utils", .path = "src/Test/test.zig", .imports = &.{ "evm", "utils", "address" } },
    .{ .name = "compiler", .path = "src/Compilers/package.zig", .imports = &.{} },
    .{ .name = "signature", .path = "src/Signature/package.zig", .imports = &.{ "utils" } },
};

pub fn createPackages(
    b: *std.Build,
    target: std.Build.ResolvedTarget,
    optimize: std.builtin.OptimizeMode,
    zabi_dep: *std.Build.Dependency,
) !std.StringHashMap(*std.Build.Module) {
    var packages = std.StringHashMap(*std.Build.Module).init(b.allocator);
    
    // Create all package modules
    for (allPackages) |info| {
        const m = b.createModule(.{
            .root_source_file = b.path(info.path),
            .target = target,
            .optimize = optimize,
        });
        try packages.put(info.name, m);
    }

    // Special handling for compiler module
    const compiler_mod = packages.get("compiler").?;
    compiler_mod.addImport("zabi", zabi_dep.module("zabi"));
    compiler_mod.addIncludePath(b.path("include"));

    // Add imports between packages
    for (allPackages) |info| {
        const m = packages.get(info.name).?;
        for (info.imports) |depName| {
            const dep = packages.get(depName).?;
            m.addImport(depName, dep);
        }
    }

    return packages;
}

pub fn createZigevmModule(
    b: *std.Build,
    target: std.Build.ResolvedTarget,
    optimize: std.builtin.OptimizeMode,
    packages: std.StringHashMap(*std.Build.Module),
) *std.Build.Module {
    const zigevm_mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add all package imports to zigevm module
    for (allPackages) |info| {
        zigevm_mod.addImport(info.name, packages.get(info.name).?);
    }

    return zigevm_mod;
}