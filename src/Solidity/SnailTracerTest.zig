const std = @import("std");
const SnailTracer = @import("SnailTracer.zig");
const Compiler = @import("Compiler");

pub fn main() !void {
    // Create an allocator
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    defer _ = gpa.deinit();
    
    std.debug.print("Running SnailTracer executable...\n", .{});
    
    // Initialize the SnailTracer compiler
    var compiler = SnailTracer.SnailTracerCompiler.init(allocator, "0.8.17");
    defer compiler.deinit();
    
    // Get the contract path
    const contract_path = try compiler.getContractPath();
    defer allocator.free(contract_path);
    
    std.debug.print("Contract path: {s}\n", .{contract_path});
    
    // Simulate compiler installation
    try compiler.installCompiler();
    
    // Try to get the artifacts (simulated)
    const artifact = try compiler.compile();
    defer artifact.deinit(allocator);
    
    // Print information about the artifact
    std.debug.print("Contract name: {s}\n", .{artifact.name});
    std.debug.print("ABI length: {d}\n", .{artifact.abi.len});
    std.debug.print("Bytecode length: {d}\n", .{artifact.bytecode.len});
    
    std.debug.print("Successfully simulated SnailTracer contract compilation\n", .{});
}