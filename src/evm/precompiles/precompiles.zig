/// Precompile dispatcher and management system
/// 
/// This module provides the central dispatch system for all Ethereum precompiles.
/// It handles address-based routing, hardfork availability, and execution coordination.
/// Currently implements SHA256, with infrastructure ready for additional precompiles.

const std = @import("std");
const precompile_addresses = @import("precompile_addresses.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const PrecompileExecutionResult = @import("precompile_result.zig").PrecompileExecutionResult;
const sha256 = @import("sha256.zig");

/// Hardfork enumeration for precompile availability
/// TODO: Import from existing hardfork module when available
pub const Hardfork = enum {
    frontier,
    homestead,
    dao,
    tangerine_whistle,
    spurious_dragon,
    byzantium,
    constantinople,
    petersburg,
    istanbul,
    muir_glacier,
    berlin,
    london,
    arrow_glacier,
    gray_glacier,
    merge,
    shanghai,
    cancun,
};

/// Precompile availability information
pub const PrecompileInfo = struct {
    /// Minimum hardfork where precompile is available
    available_from: Hardfork,
    
    /// Whether precompile is currently implemented
    implemented: bool,
    
    /// Human-readable name for debugging
    name: []const u8,
};

/// Get precompile information by ID
fn get_precompile_info_by_id(precompile_id: u8) ?PrecompileInfo {
    return switch (precompile_id) {
        0x01 => PrecompileInfo{ .available_from = .frontier, .implemented = false, .name = "ECRECOVER" },
        0x02 => PrecompileInfo{ .available_from = .frontier, .implemented = true, .name = "SHA256" },
        0x03 => PrecompileInfo{ .available_from = .frontier, .implemented = false, .name = "RIPEMD160" },
        0x04 => PrecompileInfo{ .available_from = .frontier, .implemented = false, .name = "IDENTITY" },
        0x05 => PrecompileInfo{ .available_from = .byzantium, .implemented = false, .name = "MODEXP" },
        0x06 => PrecompileInfo{ .available_from = .byzantium, .implemented = false, .name = "ECADD" },
        0x07 => PrecompileInfo{ .available_from = .byzantium, .implemented = false, .name = "ECMUL" },
        0x08 => PrecompileInfo{ .available_from = .byzantium, .implemented = false, .name = "ECPAIRING" },
        0x09 => PrecompileInfo{ .available_from = .istanbul, .implemented = false, .name = "BLAKE2F" },
        else => null,
    };
}

/// Check if a precompile is available in a given hardfork
/// 
/// ## Parameters
/// - `precompile_id`: Precompile address (0x01-0x09)
/// - `hardfork`: Current hardfork version
/// 
/// ## Returns
/// - `true` if precompile is available and implemented, `false` otherwise
pub fn is_precompile_available(precompile_id: u8, hardfork: Hardfork) bool {
    const info = get_precompile_info_by_id(precompile_id) orelse return false;
    
    // Check if hardfork is recent enough and precompile is implemented
    return hardfork_gte(hardfork, info.available_from) and info.implemented;
}

/// Get precompile information by ID
/// 
/// ## Parameters
/// - `precompile_id`: Precompile address (0x01-0x09)
/// 
/// ## Returns
/// - PrecompileInfo if valid precompile, null otherwise
pub fn get_precompile_info(precompile_id: u8) ?PrecompileInfo {
    return get_precompile_info_by_id(precompile_id);
}

/// Execute a precompile by address
/// 
/// Central dispatch function that routes execution to the appropriate precompile
/// implementation based on the address and validates hardfork availability.
/// 
/// ## Parameters
/// - `address`: 20-byte Ethereum address
/// - `input`: Input data for the precompile
/// - `output`: Output buffer for results
/// - `gas_limit`: Maximum gas that can be consumed
/// - `hardfork`: Current hardfork version
/// 
/// ## Returns
/// - PrecompileExecutionResult with success/failure information
/// 
/// ## Examples
/// ```zig
/// const sha256_addr = [_]u8{0} ** 19 ++ [_]u8{0x02};
/// var output: [32]u8 = undefined;
/// const result = execute_precompile(sha256_addr, "hello", &output, 1000, .frontier);
/// try testing.expect(result.is_success());
/// ```
pub fn execute_precompile(
    address: [20]u8, 
    input: []const u8, 
    output: []u8, 
    gas_limit: u64, 
    hardfork: Hardfork
) PrecompileExecutionResult {
    // Check if address is a precompile
    const precompile_id = precompile_addresses.get_precompile_id(address) orelse {
        return PrecompileExecutionResult.err(PrecompileError.InvalidInput);
    };
    
    // Check if precompile is available in this hardfork
    if (!is_precompile_available(precompile_id, hardfork)) {
        return PrecompileExecutionResult.err(PrecompileError.ComputationError);
    }
    
    // Dispatch to specific precompile implementation
    return switch (precompile_id) {
        precompile_addresses.SHA256_ADDRESS => sha256.execute_wrapped(input, output, gas_limit),
        
        // Future precompiles will be added here:
        // precompile_addresses.IDENTITY_ADDRESS => identity.execute_wrapped(input, output, gas_limit),
        // precompile_addresses.RIPEMD160_ADDRESS => ripemd160.execute_wrapped(input, output, gas_limit),
        // precompile_addresses.ECRECOVER_ADDRESS => ecrecover.execute_wrapped(input, output, gas_limit),
        
        else => PrecompileExecutionResult.err(PrecompileError.ComputationError),
    };
}

/// Calculate gas cost for a precompile without executing it
/// 
/// Useful for gas estimation and validation before actual execution.
/// 
/// ## Parameters
/// - `address`: 20-byte Ethereum address
/// - `input`: Input data for gas calculation
/// - `hardfork`: Current hardfork version
/// 
/// ## Returns
/// - Gas cost, or 0 if precompile is invalid/unavailable
pub fn calculate_precompile_gas(address: [20]u8, input: []const u8, hardfork: Hardfork) u64 {
    const precompile_id = precompile_addresses.get_precompile_id(address) orelse return 0;
    
    if (!is_precompile_available(precompile_id, hardfork)) return 0;
    
    return switch (precompile_id) {
        precompile_addresses.SHA256_ADDRESS => sha256.calculate_gas(input.len),
        else => 0,
    };
}

// ============================================================================
// Helper Functions  
// ============================================================================

/// Compare hardfork versions (greater than or equal)
/// 
/// ## Parameters
/// - `current`: Current hardfork
/// - `required`: Required minimum hardfork
/// 
/// ## Returns
/// - `true` if current >= required, `false` otherwise
fn hardfork_gte(current: Hardfork, required: Hardfork) bool {
    return @intFromEnum(current) >= @intFromEnum(required);
}

// ============================================================================
// Tests
// ============================================================================

test "precompile availability" {
    const testing = std.testing;
    
    // SHA256 available from Frontier
    try testing.expect(is_precompile_available(0x02, .frontier));
    try testing.expect(is_precompile_available(0x02, .cancun));
    
    // MODEXP available from Byzantium
    try testing.expect(!is_precompile_available(0x05, .frontier));
    // NOTE: Would be true if implemented: try testing.expect(is_precompile_available(0x05, .byzantium));
    
    // Invalid precompile ID
    try testing.expect(!is_precompile_available(0xFF, .frontier));
}

test "precompile info retrieval" {
    const testing = std.testing;
    
    const sha256_info = get_precompile_info(0x02).?;
    try testing.expectEqual(Hardfork.frontier, sha256_info.available_from);
    try testing.expect(sha256_info.implemented);
    try testing.expectEqualStrings("SHA256", sha256_info.name);
    
    try testing.expectEqual(@as(?PrecompileInfo, null), get_precompile_info(0xFF));
}

test "sha256 precompile execution" {
    const testing = std.testing;
    
    const sha256_addr = [_]u8{0} ** 19 ++ [_]u8{0x02};
    var output: [32]u8 = undefined;
    
    // Test successful execution
    const result = execute_precompile(sha256_addr, "hello", &output, 1000, .frontier);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 72), result.gas_used()); // 60 + 12 * 1 word
    try testing.expectEqual(@as(usize, 32), result.output_size());
    
    // Test invalid address
    const invalid_addr = [_]u8{0x12, 0x34} ++ [_]u8{0} ** 18;
    const invalid_result = execute_precompile(invalid_addr, "hello", &output, 1000, .frontier);
    try testing.expect(!invalid_result.is_success());
}

test "precompile gas calculation" {
    const testing = std.testing;
    
    const sha256_addr = [_]u8{0} ** 19 ++ [_]u8{0x02};
    
    // Test gas calculation
    try testing.expectEqual(@as(u64, 60), calculate_precompile_gas(sha256_addr, "", .frontier));
    try testing.expectEqual(@as(u64, 72), calculate_precompile_gas(sha256_addr, "hello", .frontier));
    
    // Test invalid address
    const invalid_addr = [_]u8{0x12, 0x34} ++ [_]u8{0} ** 18;
    try testing.expectEqual(@as(u64, 0), calculate_precompile_gas(invalid_addr, "hello", .frontier));
}

test "hardfork comparison" {
    const testing = std.testing;
    
    try testing.expect(hardfork_gte(.frontier, .frontier));
    try testing.expect(hardfork_gte(.byzantium, .frontier));
    try testing.expect(hardfork_gte(.cancun, .istanbul));
    try testing.expect(!hardfork_gte(.frontier, .byzantium));
}