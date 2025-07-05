const std = @import("std");
const sha256_impl = @import("sha256.zig");
const identity_impl = @import("identity.zig");

/// WASM-compatible precompiles implementation
/// Only includes pure Zig implementations that work in WASM environment
/// Complex cryptographic operations that require REVM are not available

/// Error types for precompile operations
pub const PrecompileError = error{
    OutOfMemory,
    InvalidInput,
    InvalidAddress,
    UnsupportedPrecompile,
    InsufficientGas,
};

/// Result of precompile execution
pub const PrecompileResult = struct {
    output: []u8,
    gas_used: u64,
    
    const Self = @This();
    
    pub fn deinit(self: Self, allocator: std.mem.Allocator) void {
        allocator.free(self.output);
    }
};

/// Precompile types supported in WASM
pub const PrecompileType = enum(u8) {
    sha256 = 0x02,
    identity = 0x04,
    
    pub fn fromAddress(address: [20]u8) ?PrecompileType {
        if (address[19] == 0x02) return .sha256;
        if (address[19] == 0x04) return .identity;
        return null;
    }
};

/// WASM-compatible precompiles instance
pub const Precompiles = struct {
    allocator: std.mem.Allocator,
    
    const Self = @This();
    
    /// Create precompiles instance for WASM
    pub fn create(allocator: std.mem.Allocator) Self {
        return Self{
            .allocator = allocator,
        };
    }
    
    /// Get address for precompile type
    pub fn get_address(precompile_type: PrecompileType) ![20]u8 {
        var address = [_]u8{0} ** 20;
        address[19] = @intFromEnum(precompile_type);
        return address;
    }
    
    /// Check if precompile exists at address
    pub fn contains(self: Self, address: [20]u8) bool {
        _ = self;
        return PrecompileType.fromAddress(address) != null;
    }
    
    /// Execute precompile at address
    pub fn run(self: Self, address: [20]u8, input: []const u8, gas_limit: u64) PrecompileError!PrecompileResult {
        const precompile_type = PrecompileType.fromAddress(address) orelse return error.UnsupportedPrecompile;
        
        switch (precompile_type) {
            .sha256 => {
                const gas_cost = sha256_impl.gasCost(input);
                if (gas_cost > gas_limit) return error.InsufficientGas;
                
                var hash: [32]u8 = undefined;
                std.crypto.hash.sha2.Sha256.hash(input, &hash, .{});
                
                const output = try self.allocator.dupe(u8, &hash);
                return PrecompileResult{
                    .output = output,
                    .gas_used = gas_cost,
                };
            },
            .identity => {
                const gas_cost = identity_impl.gasCost(input);
                if (gas_cost > gas_limit) return error.InsufficientGas;
                
                const output = try self.allocator.dupe(u8, input);
                return PrecompileResult{
                    .output = output,
                    .gas_used = gas_cost,
                };
            },
        }
    }
    
    /// Clean up resources
    pub fn deinit(self: Self) void {
        _ = self;
        // Nothing to clean up in WASM version
    }
};

/// Convenience function for SHA256
pub fn sha256(precompiles_instance: *const Precompiles, input: []const u8, gas_limit: u64) PrecompileError!PrecompileResult {
    const address = try Precompiles.get_address(.sha256);
    return precompiles_instance.run(address, input, gas_limit);
}

/// Convenience function for IDENTITY
pub fn identity(precompiles_instance: *const Precompiles, input: []const u8, gas_limit: u64) PrecompileError!PrecompileResult {
    const address = try Precompiles.get_address(.identity);
    return precompiles_instance.run(address, input, gas_limit);
}

// Tests
test "WASM precompiles basic functionality" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var precompiles_instance = Precompiles.create(allocator);
    defer precompiles_instance.deinit();
    
    // Test SHA256 address
    const sha256_addr = try Precompiles.get_address(.sha256);
    try testing.expect(sha256_addr[19] == 2);
    try testing.expect(precompiles_instance.contains(sha256_addr));
    
    // Test IDENTITY address
    const identity_addr = try Precompiles.get_address(.identity);
    try testing.expect(identity_addr[19] == 4);
    try testing.expect(precompiles_instance.contains(identity_addr));
    
    // Test unsupported address
    var unsupported_addr = [_]u8{0} ** 20;
    unsupported_addr[19] = 1; // ECRECOVER not supported in WASM
    try testing.expect(!precompiles_instance.contains(unsupported_addr));
}

test "WASM SHA256 execution" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var precompiles_instance = Precompiles.create(allocator);
    defer precompiles_instance.deinit();
    
    const input = "hello world";
    const result = try sha256(&precompiles_instance, input, 1000);
    defer result.deinit(allocator);
    
    try testing.expect(result.output.len == 32);
    try testing.expect(result.gas_used > 0);
}

test "WASM IDENTITY execution" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var precompiles_instance = Precompiles.create(allocator);
    defer precompiles_instance.deinit();
    
    const input = "test data";
    const result = try identity(&precompiles_instance, input, 1000);
    defer result.deinit(allocator);
    
    try testing.expectEqualSlices(u8, input, result.output);
    try testing.expect(result.gas_used > 0);
}