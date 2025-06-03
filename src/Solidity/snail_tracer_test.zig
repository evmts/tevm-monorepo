const std = @import("std");
const compiler = @import("Compiler");
const Compiler = compiler.Compiler;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    std.debug.print("Testing SnailTracer compilation...\n", .{});

    // Test settings
    const settings = compiler.CompilerSettings{
        .optimizer_enabled = true,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };

    // Compile the SnailTracer contract
    var result = try Compiler.compile_file(
        allocator,
        "src/Solidity/SnailTracer.sol",
        settings,
    );
    defer result.deinit();

    // Check for errors
    if (result.errors.len > 0) {
        std.debug.print("Compilation errors:\n", .{});
        for (result.errors) |err| {
            std.debug.print("  - {s}\n", .{err.message});
        }
        return error.CompilationFailed;
    }

    // Print warnings if any
    if (result.warnings.len > 0) {
        std.debug.print("Compilation warnings:\n", .{});
        for (result.warnings) |warning| {
            std.debug.print("  - {s}\n", .{warning.message});
        }
    }

    // Print compiled contracts
    std.debug.print("\nCompiled contracts:\n", .{});
    for (result.contracts) |contract| {
        std.debug.print("  Contract: {s}\n", .{contract.name});
        std.debug.print("    ABI length: {}\n", .{contract.abi.len});
        std.debug.print("    Bytecode length: {}\n", .{contract.bytecode.len});
        std.debug.print("    Deployed bytecode length: {}\n", .{contract.deployed_bytecode.len});
        
        // Print first few bytes of bytecode
        if (contract.bytecode.len > 10) {
            std.debug.print("    Bytecode preview: {s}...\n", .{contract.bytecode[0..10]});
        }
    }

    std.debug.print("\nSnailTracer compilation test completed successfully!\n", .{});
}