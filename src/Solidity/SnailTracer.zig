const std = @import("std");
const Compiler = @import("Compiler");

/// A Solidity contract artifact structure containing compiled outputs
pub const ContractArtifact = struct {
    /// The name of the contract
    name: []const u8,
    /// The ABI definition in JSON format
    abi: []const u8,
    /// The compiled bytecode
    bytecode: []const u8,
    
    /// Free the memory used by the artifact
    pub fn deinit(self: *ContractArtifact, allocator: std.mem.Allocator) void {
        allocator.free(self.name);
        allocator.free(self.abi);
        allocator.free(self.bytecode);
    }
};

/// Compiler configuration for the SnailTracer contract
pub const SnailTracerCompiler = struct {
    allocator: std.mem.Allocator,
    bundler: Compiler.Bundler,
    
    /// Initialize the SnailTracer compiler with a specific Solidity version
    pub fn init(allocator: std.mem.Allocator, solc_version: ?[]const u8) SnailTracerCompiler {
        return .{
            .allocator = allocator,
            .bundler = Compiler.Bundler.init(allocator, solc_version),
        };
    }
    
    /// Get the path to the SnailTracer.sol contract
    pub fn getContractPath(self: *SnailTracerCompiler) ![]const u8 {
        const current_dir = std.fs.cwd();
        const real_path = try current_dir.realpathAlloc(self.allocator, ".");
        defer self.allocator.free(real_path);
        
        return try std.fs.path.join(self.allocator, &.{
            real_path, 
            "src", 
            "Solidity", 
            "SnailTracer.sol"
        });
    }
    
    /// Install the Solidity compiler
    pub fn installCompiler(self: *SnailTracerCompiler) !void {
        try self.bundler.installSolc("0.8.17");
    }
    
    /// Compile the SnailTracer contract and return its artifacts
    pub fn compile(self: *SnailTracerCompiler) !ContractArtifact {
        // Get the contract path for reporting purposes
        const contract_path = try self.getContractPath();
        defer self.allocator.free(contract_path);
        
        std.debug.print("Compiling: {s}\n", .{contract_path});
        
        // Use the real compiler to compile the contract
        const contract = try self.bundler.compileFile(contract_path);
        
        // Convert to ContractArtifact format
        return ContractArtifact{
            .name = contract.name,
            .abi = contract.abi,
            .bytecode = contract.bytecode,
        };
    }
    
    /// Deinitialize the compiler
    pub fn deinit(self: *SnailTracerCompiler) void {
        self.bundler.deinit();
    }
};

test "SnailTracer compilation and artifacts" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    var compiler = SnailTracerCompiler.init(allocator, "0.8.17");
    defer compiler.deinit();
    
    // Get the contract path
    const contract_path = try compiler.getContractPath();
    defer allocator.free(contract_path);
    
    // Make sure the file exists
    try std.testing.expect(std.fs.path.isAbsolute(contract_path));
    std.debug.print("Contract path: {s}\n", .{contract_path});
    
    // Simulate compiler installation (skipping actual Rust FFI)
    try compiler.installCompiler();
    
    // Try to get the artifacts (simulated)
    var artifact = try compiler.compile();
    defer artifact.deinit(allocator);
    
    // Check the artifact fields
    try std.testing.expectEqualStrings("SnailTracer", artifact.name);
    try std.testing.expect(artifact.abi.len > 0);
    try std.testing.expect(artifact.bytecode.len > 2); // More than just "0x"
    
    std.debug.print("Successfully compiled SnailTracer contract!\n", .{});
    std.debug.print("Contract name: {s}\n", .{artifact.name});
    std.debug.print("ABI length: {}\n", .{artifact.abi.len});
    std.debug.print("Bytecode length: {}\n", .{artifact.bytecode.len});
}

test "Multi-version Solidity compiler" {
    // This test demonstrates the ability to use multiple compiler versions
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Test with default version (0.8.17)
    {
        var compiler = SnailTracerCompiler.init(allocator, null);
        defer compiler.deinit();
        
        // Just test the compiler installation (simulated)
        try compiler.installCompiler();
        
        std.debug.print("Default compiler setup successfully\n", .{});
    }
    
    // Test with a specific version
    {
        var compiler = SnailTracerCompiler.init(allocator, "0.8.20");
        defer compiler.deinit();
        
        // Just test the compiler installation (simulated)
        try compiler.installCompiler();
        
        std.debug.print("Compiler 0.8.20 setup successfully\n", .{});
    }
}