const std = @import("std");
const packages = @import("build/packages.zig");
const executables = @import("build/executables.zig");
const tests = @import("build/tests.zig");
const benchmarks = @import("build/benchmarks.zig");

pub fn build(b: *std.Build) void {
    // Standard build options
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});
    const wasm_target = b.resolveTargetQuery(.{
        .cpu_arch = .wasm32,
        .os_tag = .freestanding,
    });

    // Get dependencies
    const httpz_dep = b.dependency("httpz", .{
        .target = target,
        .optimize = optimize,
    });

    const zabi_dep = b.dependency("zabi", .{
        .target = target,
        .optimize = optimize,
    });

    const zbench_dep = b.dependency("zbench", .{
        .target = target,
        .optimize = optimize,
    });

    // Create packages
    const all_packages = packages.createPackages(b, target, optimize, zabi_dep) catch |err| {
        std.debug.print("Failed to create packages: {}\n", .{err});
        return;
    };

    // Create zigevm module
    const zigevm_mod = packages.createZigevmModule(b, target, optimize, all_packages);

    // Create library
    _ = executables.createLibrary(b, zigevm_mod, zabi_dep);

    // Create main executable
    const exe = executables.createMainExecutable(b, target, optimize, zigevm_mod, zabi_dep);

    // Create server executable
    const server_exe = executables.createServerExecutable(b, target, optimize, httpz_dep, zigevm_mod);

    // Add run steps
    executables.addRunSteps(b, exe, server_exe);

    // Create WASM module
    executables.createWasmModule(b, wasm_target, all_packages);

    // Add Rust integration
    const rust_build = @import("src/Compilers/rust_build.zig");
    const rust_step = rust_build.addRustIntegration(b, target, optimize) catch |err| {
        std.debug.print("Failed to add Rust integration: {}\n", .{err});
        return;
    };

    // Create benchmarks
    benchmarks.createBenchmarks(b, target, all_packages, zbench_dep, zabi_dep, rust_step);

    // Create tests
    const exe_mod = exe.root_module;
    _ = tests.createTests(b, target, optimize, all_packages, zigevm_mod, exe_mod, httpz_dep, zabi_dep, rust_step);
}
