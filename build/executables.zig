const std = @import("std");
const packages = @import("packages.zig");

pub fn createLibrary(
    b: *std.Build,
    zigevm_mod: *std.Build.Module,
    zabi_dep: *std.Build.Dependency,
) *std.Build.Step.Compile {
    const lib = b.addStaticLibrary(.{
        .name = "zigevm",
        .root_module = zigevm_mod,
    });
    lib.root_module.addImport("zabi", zabi_dep.module("zabi"));
    b.installArtifact(lib);
    return lib;
}

pub fn createMainExecutable(
    b: *std.Build,
    target: std.Build.ResolvedTarget,
    optimize: std.builtin.OptimizeMode,
    zigevm_mod: *std.Build.Module,
    zabi_dep: *std.Build.Dependency,
) *std.Build.Step.Compile {
    const exe_mod = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    exe_mod.addImport("zigevm", zigevm_mod);

    const exe = b.addExecutable(.{
        .name = "zigevm",
        .root_module = exe_mod,
    });
    exe.root_module.addImport("zabi", zabi_dep.module("zabi"));
    b.installArtifact(exe);
    
    return exe;
}

pub fn createServerExecutable(
    b: *std.Build,
    target: std.Build.ResolvedTarget,
    optimize: std.builtin.OptimizeMode,
    httpz_dep: *std.Build.Dependency,
    zigevm_mod: *std.Build.Module,
) *std.Build.Step.Compile {
    const server_exe = b.addExecutable(.{
        .name = "zigevm-server",
        .root_source_file = b.path("src/Server/main.zig"),
        .target = target,
        .optimize = optimize,
    });
    server_exe.root_module.addImport("httpz", httpz_dep.module("httpz"));
    server_exe.root_module.addImport("zigevm", zigevm_mod);
    b.installArtifact(server_exe);
    
    return server_exe;
}

pub fn createWasmModule(
    b: *std.Build,
    wasm_target: std.Build.ResolvedTarget,
    all_packages: std.StringHashMap(*std.Build.Module),
) void {
    const wasm_mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = wasm_target,
        .optimize = .ReleaseSmall,
    });

    // Add package imports to wasm module
    for (packages.allPackages) |info| {
        wasm_mod.addImport(info.name, all_packages.get(info.name).?);
    }

    // Create the WebAssembly artifact
    const wasm = b.addExecutable(.{
        .name = "zigevm",
        .root_module = wasm_mod,
    });
    wasm.rdynamic = true;
    wasm.entry = .disabled;
    b.installArtifact(wasm);

    // Define the WASM output path
    const wasm_output_path = "dist/zigevm.wasm";
    const install_wasm = b.addInstallFile(wasm.getEmittedBin(), wasm_output_path);

    // Build WASM step
    const build_wasm_step = b.step("wasm", "Build the WebAssembly artifact");
    build_wasm_step.dependOn(&install_wasm.step);
}

pub fn addRunSteps(
    b: *std.Build,
    exe: *std.Build.Step.Compile,
    server_exe: *std.Build.Step.Compile,
) void {
    // Create run step for the main executable
    const run_cmd = b.addRunArtifact(exe);
    run_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }
    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    // Define run server step
    const run_server_cmd = b.addRunArtifact(server_exe);
    run_server_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_server_cmd.addArgs(args);
    }
    const run_server_step = b.step("run-server", "Run the JSON-RPC server");
    run_server_step.dependOn(&run_server_cmd.step);
}