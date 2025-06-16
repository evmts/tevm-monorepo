const std = @import("std");

// Package module for precompiles
// This file exports the appropriate implementation based on the target

pub const precompiles = if (@import("builtin").target.cpu.arch.isWasm())
    @import("precompiles_wasm.zig")
else
    @import("precompiles.zig");

// Re-export main types and functions
pub const Precompiles = precompiles.Precompiles;
pub const PrecompileResult = precompiles.PrecompileResult;
pub const PrecompileError = precompiles.PrecompileError;
pub const PrecompileType = precompiles.PrecompileType;

// Re-export convenience functions
pub const sha256 = precompiles.sha256;
pub const identity = precompiles.identity;

// Export additional functions only if available (non-WASM)
pub const ecrecover = if (@hasDecl(precompiles, "ecrecover")) precompiles.ecrecover else struct {
    pub fn ecrecover(_: anytype, _: anytype, _: anytype) !PrecompileResult {
        return error.UnsupportedInWasm;
    }
}.ecrecover;

pub const ripemd160 = if (@hasDecl(precompiles, "ripemd160")) precompiles.ripemd160 else struct {
    pub fn ripemd160(_: anytype, _: anytype, _: anytype) !PrecompileResult {
        return error.UnsupportedInWasm;
    }
}.ripemd160;

pub const modexp = if (@hasDecl(precompiles, "modexp")) precompiles.modexp else struct {
    pub fn modexp(_: anytype, _: anytype, _: anytype) !PrecompileResult {
        return error.UnsupportedInWasm;
    }
}.modexp;

pub const blake2f = if (@hasDecl(precompiles, "blake2f")) precompiles.blake2f else struct {
    pub fn blake2f(_: anytype, _: anytype, _: anytype) !PrecompileResult {
        return error.UnsupportedInWasm;
    }
}.blake2f;

// Export SpecId only if available (non-WASM)
pub const SpecId = if (@hasDecl(precompiles, "SpecId")) precompiles.SpecId else enum(u32) {
    latest = 6,
};

// Compatibility layer for EVM integration
// These functions provide the API expected by src/evm/vm.zig

/// Check if the given address is a precompile address
/// Compatible with src/evm/vm.zig expectations
pub fn is_precompile(address: [20]u8) bool {
    // Check if the address corresponds to any known precompile
    if (address[0] != 0 or address[1] != 0 or address[2] != 0 or address[3] != 0 or
        address[4] != 0 or address[5] != 0 or address[6] != 0 or address[7] != 0 or
        address[8] != 0 or address[9] != 0 or address[10] != 0 or address[11] != 0 or
        address[12] != 0 or address[13] != 0 or address[14] != 0 or address[15] != 0 or
        address[16] != 0 or address[17] != 0 or address[18] != 0) {
        return false;
    }
    
    // Check if the last byte corresponds to a valid precompile
    return switch (address[19]) {
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10 => true, // Standard precompiles 0x01-0x0A
        else => false,
    };
}

/// Check if a precompile is available for the given chain rules
/// Compatible with src/evm/vm.zig expectations  
pub fn is_available(address: [20]u8, chain_rules: anytype) bool {
    if (!is_precompile(address)) {
        return false;
    }
    
    // For compatibility, we assume all precompiles are available
    // since the new package provides comprehensive implementations
    // The hardfork-specific logic can be handled at a higher level if needed
    _ = chain_rules; // Suppress unused parameter warning
    return true;
}

/// Get the expected output size for a precompile call
/// Compatible with src/evm/vm.zig expectations
pub fn get_output_size(address: [20]u8, input_size: usize, chain_rules: anytype) !usize {
    _ = chain_rules; // Suppress unused parameter warning
    
    if (!is_precompile(address)) {
        return error.InvalidPrecompile;
    }
    
    return switch (address[19]) {
        1 => 32, // ECRECOVER - fixed 32 bytes (address)
        2 => 32, // SHA256 - fixed 32 bytes (hash)
        3 => 20, // RIPEMD160 - fixed 20 bytes (hash) 
        4 => input_size, // IDENTITY - same as input size
        5 => 256, // MODEXP - fixed size for now (input_size will be used in future implementation)
        6 => 64, // ECADD - fixed 64 bytes (point)
        7 => 64, // ECMUL - fixed 64 bytes (point)  
        8 => 32, // ECPAIRING - fixed 32 bytes (boolean result)
        9 => 64, // BLAKE2F - fixed 64 bytes (hash)
        10 => 64, // KZG_POINT_EVALUATION - fixed 64 bytes
        else => error.InvalidPrecompile,
    };
}

/// Execute a precompile with the given parameters
/// Compatible with src/evm/vm.zig expectations
/// Returns a result compatible with PrecompileOutput from the old API
pub fn execute_precompile(address: [20]u8, input: []const u8, output: []u8, gas_limit: u64, chain_rules: anytype) PrecompileExecutionResult {
    _ = chain_rules; // Suppress unused parameter warning
    
    if (!is_precompile(address)) {
        return PrecompileExecutionResult{ .failure = PrecompileExecutionError.ExecutionFailed };
    }
    
    // For now, create a thread-local precompiles instance  
    // TODO: This should be passed in or managed at a higher level
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    if (@import("builtin").target.cpu.arch.isWasm()) {
        var precompiles_instance = Precompiles.create(allocator);
        defer precompiles_instance.deinit();
        
        const result = precompiles_instance.run(address, input, gas_limit) catch |err| {
            return PrecompileExecutionResult{ .failure = switch (err) {
                error.OutOfMemory => PrecompileExecutionError.OutOfMemory,
                error.UnsupportedPrecompile => PrecompileExecutionError.ExecutionFailed,
                error.InsufficientGas => PrecompileExecutionError.OutOfGas,
                else => PrecompileExecutionError.ExecutionFailed,
            }};
        };
        
        // Copy result to output buffer
        const copy_len = @min(output.len, result.output.len);
        std.mem.copy(u8, output[0..copy_len], result.output[0..copy_len]);
        
        return PrecompileExecutionResult{ 
            .success = .{
                .gas_used = result.gas_used,
                .output_size = copy_len,
            }
        };
    } else {
        var precompiles_instance = Precompiles.create_latest(allocator) catch {
            return PrecompileExecutionResult{ .failure = PrecompileExecutionError.ExecutionFailed };
        };
        defer precompiles_instance.deinit();
        
        const result = precompiles_instance.run(address, input, gas_limit) catch |err| {
            return PrecompileExecutionResult{ .failure = switch (err) {
                error.OutOfMemory => PrecompileExecutionError.OutOfMemory,
                else => PrecompileExecutionError.ExecutionFailed,
            }};
        };
        
        switch (result) {
            .success => |success| {
                // Copy result to output buffer
                const copy_len = @min(output.len, success.output.len);
                std.mem.copy(u8, output[0..copy_len], success.output[0..copy_len]);
                
                return PrecompileExecutionResult{ 
                    .success = .{
                        .gas_used = success.gas_used,
                        .output_size = copy_len,
                    }
                };
            },
            .failure => |failure| {
                return PrecompileExecutionResult{ .failure = switch (failure) {
                    PrecompileError.OutOfGas => PrecompileExecutionError.OutOfGas,
                    PrecompileError.ExecutionFailed => PrecompileExecutionError.ExecutionFailed,
                    PrecompileError.InvalidInput => PrecompileExecutionError.InvalidInput,
                    PrecompileError.UnsupportedPrecompile => PrecompileExecutionError.ExecutionFailed,
                    PrecompileError.PrecompileCreationFailed => PrecompileExecutionError.ExecutionFailed,
                }};
            },
        }
    }
}

// Compatibility types to match the old API

/// Error types that match the old precompiles API
pub const PrecompileExecutionError = error{
    OutOfGas,
    InvalidInput,
    ExecutionFailed,
    OutOfMemory,
};

/// Result type that matches the old precompiles API structure
pub const PrecompileExecutionResult = union(enum) {
    success: struct {
        gas_used: u64,
        output_size: usize,
    },
    failure: PrecompileExecutionError,
    
    pub fn is_success(self: PrecompileExecutionResult) bool {
        return switch (self) {
            .success => true,
            .failure => false,
        };
    }
    
    pub fn get_gas_used(self: PrecompileExecutionResult) u64 {
        return switch (self) {
            .success => |result| result.gas_used,
            .failure => 0,
        };
    }
    
    pub fn get_output_size(self: PrecompileExecutionResult) usize {
        return switch (self) {
            .success => |result| result.output_size,
            .failure => 0,
        };
    }
    
    pub fn get_error(self: PrecompileExecutionResult) ?PrecompileExecutionError {
        return switch (self) {
            .success => null,
            .failure => |err| err,
        };
    }
};

// Export compatibility alias for the old API
pub const PrecompileOutput = PrecompileExecutionResult;

test "package exports" {
    const testing = std.testing;
    const allocator = testing.allocator;

    // Test that we can create precompiles
    const precomp = if (@import("builtin").target.cpu.arch.isWasm()) 
        Precompiles.create(allocator)
    else 
        try Precompiles.create_latest(allocator);
    
    var precompiles_instance = precomp;
    defer precompiles_instance.deinit();

    // Test that we can get addresses
    const sha256_addr = try Precompiles.get_address(.sha256);
    try testing.expect(sha256_addr[19] == 2);

    // Test basic functionality
    try testing.expect(precompiles_instance.contains(sha256_addr));
}