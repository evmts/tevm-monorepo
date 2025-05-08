//! Dynamic gas cost calculation for ZigEVM
//! This module implements gas cost calculations that depend on runtime parameters

const std = @import("std");
const constants = @import("constants.zig");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Memory = @import("../memory/memory.zig").Memory;

/// Calculate gas cost for memory expansion
/// Returns the gas required to expand memory from current_size to new_size
pub fn memoryExpansionGas(current_size: usize, new_size: usize) u64 {
    if (new_size <= current_size) {
        return 0;
    }
    
    const current_cost = constants.memoryGas(current_size);
    const new_cost = constants.memoryGas(new_size);
    
    return new_cost - current_cost;
}

/// Calculate gas cost for EXP operation based on exponent size
pub fn expGas(exponent: U256) u64 {
    // Find highest non-zero byte of exponent
    var exponent_byte_size: usize = 0;
    
    inline for (0..4) |i| {
        const word = exponent.words[3 - i];
        if (word != 0) {
            // We found a non-zero word
            exponent_byte_size = (i * 8) + 8;
            
            // Find the highest non-zero byte in this word
            var temp = word;
            var byte_pos: usize = 7;
            while (temp != 0) : (byte_pos -= 1) {
                if ((temp & 0xFF) != 0) {
                    break;
                }
                temp >>= 8;
                exponent_byte_size -= 1;
                if (byte_pos == 0) break;
            }
            
            break;
        }
    }
    
    return constants.expGas(exponent_byte_size);
}

/// Calculate gas cost for CALLDATACOPY, CODECOPY, etc.
pub fn copyGas(size: usize) u64 {
    return constants.memoryCopyGas(size);
}

/// Calculate the amount of gas to forward to a child call
/// Implements EIP-150 logic where child calls receive at most 63/64 of remaining gas
pub fn callGas(gas_left: u64, requested_gas: u64, has_value: bool) u64 {
    const gas_costs = constants.GasCosts{};
    
    // If stipend applies (call with value), ensure it's available
    const stipend = if (has_value) gas_costs.callstipend else 0;
    
    // Maximum gas that can be provided to child
    const max_gas = gas_left - (gas_left / 64);
    
    // Use the minimum of requested gas and max available gas
    var gas_to_forward = if (requested_gas > max_gas) max_gas else requested_gas;
    
    // Add stipend if applicable
    if (has_value) {
        gas_to_forward += stipend;
    }
    
    return gas_to_forward;
}

/// Calculate gas cost for SSTORE operation
pub fn sstoreGas(
    is_cold: bool,
    current_value: U256,
    original_value: U256,
    new_value: U256,
) struct { cost: u64, refund: i64 } {
    // Convert to booleans for simplicity
    const current_nonzero = !current_value.isZero();
    const original_nonzero = !original_value.isZero();
    const new_nonzero = !new_value.isZero();
    
    return constants.storageGas(
        is_cold,
        current_nonzero,
        original_nonzero,
        new_nonzero,
    );
}

/// Calculate gas cost for access list operations
pub fn accessListGas(addresses: usize, storage_keys: usize) u64 {
    const gas_costs = constants.GasCosts{};
    
    return addresses * gas_costs.access_list_address +
           storage_keys * gas_costs.access_list_storage;
}

// Tests
const testing = std.testing;

test "Memory expansion gas calculation" {
    // Test no expansion
    try testing.expectEqual(@as(u64, 0), memoryExpansionGas(100, 100));
    
    // Test small expansion
    const small_expansion = memoryExpansionGas(32, 64);
    try testing.expect(small_expansion > 0);
    
    // Test large expansion
    const large_expansion = memoryExpansionGas(32, 1024);
    try testing.expect(large_expansion > small_expansion);
}

test "EXP gas calculation" {
    // Test zero exponent
    try testing.expectEqual(@as(u64, 5), expGas(U256.zero()));
    
    // Test small exponent
    var small_exp = U256.fromU64(15); // 0x0F - 1 byte
    try testing.expectEqual(@as(u64, 5 + 8), expGas(small_exp));
    
    // Test medium exponent
    var medium_exp = U256.fromU64(0x1234); // 2 bytes
    try testing.expectEqual(@as(u64, 5 + 2 * 8), expGas(medium_exp));
    
    // Test large exponent
    var large_bytes: [32]u8 = [_]u8{0} ** 32;
    large_bytes[0] = 0x01; // MSB set
    var large_exp = U256.fromBytes(&large_bytes) catch unreachable;
    try testing.expectEqual(@as(u64, 5 + 32 * 8), expGas(large_exp));
}

test "CALL gas calculation" {
    const gas_costs = constants.GasCosts{};
    
    // Test basic call gas
    const call_gas = callGas(1000, 500, false);
    try testing.expectEqual(@as(u64, 500), call_gas);
    
    // Test call with value (stipend added)
    const call_with_value = callGas(1000, 500, true);
    try testing.expectEqual(@as(u64, 500 + gas_costs.callstipend), call_with_value);
    
    // Test with EIP-150 limit
    const eip150_gas = callGas(1000, 1000, false);
    try testing.expectEqual(@as(u64, 1000 - (1000 / 64)), eip150_gas);
}

test "Access list gas calculation" {
    const gas_costs = constants.GasCosts{};
    
    // Test empty access list
    try testing.expectEqual(@as(u64, 0), accessListGas(0, 0));
    
    // Test with addresses only
    try testing.expectEqual(
        @as(u64, 3 * gas_costs.access_list_address), 
        accessListGas(3, 0)
    );
    
    // Test with storage keys only
    try testing.expectEqual(
        @as(u64, 5 * gas_costs.access_list_storage), 
        accessListGas(0, 5)
    );
    
    // Test with both
    try testing.expectEqual(
        @as(u64, 2 * gas_costs.access_list_address + 3 * gas_costs.access_list_storage), 
        accessListGas(2, 3)
    );
}