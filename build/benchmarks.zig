const std = @import("std");
const packages = @import("packages.zig");

pub fn createBenchmarks(
    b: *std.Build,
    target: std.Build.ResolvedTarget,
    all_packages: std.StringHashMap(*std.Build.Module),
    zbench_dep: *std.Build.Dependency,
    zabi_dep: *std.Build.Dependency,
    rust_step: *std.Build.Step,
) void {
    // Add benchmark executables
    const snailtracer_bench = b.addExecutable(.{
        .name = "snailtracer-bench",
        .root_source_file = b.path("bench/Evm/snailtracer.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    
    // Add package imports to benchmark
    for (packages.allPackages) |info| {
        snailtracer_bench.root_module.addImport(info.name, all_packages.get(info.name).?);
    }
    snailtracer_bench.root_module.addImport("zbench", zbench_dep.module("zbench"));
    
    // Link the Rust static library
    snailtracer_bench.step.dependOn(rust_step);
    snailtracer_bench.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    snailtracer_bench.linkLibC();
    
    // Link required system libraries for macOS
    if (target.result.os.tag == .macos) {
        snailtracer_bench.linkFramework("Security");
        snailtracer_bench.linkFramework("SystemConfiguration");
        snailtracer_bench.linkFramework("CoreFoundation");
    }
    
    b.installArtifact(snailtracer_bench);
    
    const run_snailtracer_bench = b.addRunArtifact(snailtracer_bench);
    const snailtracer_bench_step = b.step("bench-snailtracer", "Run SnailTracer benchmark");
    snailtracer_bench_step.dependOn(&run_snailtracer_bench.step);

    // Add benchmark suite
    const benchmark_suite = b.addExecutable(.{
        .name = "benchmark-suite",
        .root_source_file = b.path("bench/Evm/benchmark_suite.zig"),
        .target = target,
        .optimize = .ReleaseFast,
    });
    
    // Add package imports to benchmark suite
    for (packages.allPackages) |info| {
        benchmark_suite.root_module.addImport(info.name, all_packages.get(info.name).?);
    }
    benchmark_suite.root_module.addImport("zabi", zabi_dep.module("zabi"));
    benchmark_suite.root_module.addImport("zbench", zbench_dep.module("zbench"));
    
    // Link the Rust static library
    benchmark_suite.step.dependOn(rust_step);
    benchmark_suite.addObjectFile(b.path("dist/target/release/libfoundry_wrapper.a"));
    benchmark_suite.linkLibC();
    
    // Link required system libraries for macOS
    if (target.result.os.tag == .macos) {
        benchmark_suite.linkFramework("Security");
        benchmark_suite.linkFramework("SystemConfiguration");
        benchmark_suite.linkFramework("CoreFoundation");
    }
    
    b.installArtifact(benchmark_suite);
    
    const run_benchmark_suite = b.addRunArtifact(benchmark_suite);
    const benchmark_suite_step = b.step("bench", "Run EVM benchmark suite");
    benchmark_suite_step.dependOn(&run_benchmark_suite.step);
}