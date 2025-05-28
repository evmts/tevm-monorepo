/// Example demonstrating usage of the centralized constants module
///
/// This file shows how to use the constants module in EVM implementation code
/// and can be removed once the pattern is established throughout the codebase.

const std = @import("std");
const constants = @import("constants.zig");

/// Example function calculating gas cost for a memory operation
pub fn calculateMemoryOperationCost(current_memory_size: u64, target_size: u64) constants.GasResult {
    if (target_size <= current_memory_size) {
        return constants.GasResult{ .cost = 0, .overflow = false };
    }
    
    // Calculate expansion cost
    const expansion_cost = constants.memoryGasCostWithOverflow(target_size);
    if (expansion_cost.overflow) {
        return expansion_cost;
    }
    
    // Subtract already paid cost
    const already_paid = constants.memoryGasCost(current_memory_size);
    if (expansion_cost.cost < already_paid) {
        // This shouldn't happen, but handle gracefully
        return constants.GasResult{ .cost = 0, .overflow = false };
    }
    
    return constants.GasResult{ 
        .cost = expansion_cost.cost - already_paid, 
        .overflow = false 
    };
}

/// Example function checking if an opcode is valid in a given hardfork
pub fn isOpcodeValidForHardfork(opcode: u8, hardfork: constants.Hardfork) bool {
    // Some opcodes are only valid after certain hardforks
    return switch (opcode) {
        constants.PUSH0 => switch (hardfork) {
            .Shanghai, .Cancun => true,
            else => false,
        },
        constants.BASEFEE => switch (hardfork) {
            .London, .Paris, .Shanghai, .Cancun => true,
            else => false,
        },
        constants.BLOBHASH, constants.BLOBBASEFEE => switch (hardfork) {
            .Cancun => true,
            else => false,
        },
        else => true, // Most opcodes are valid in all hardforks
    };
}

/// Example function implementing dynamic gas calculation for SSTORE
pub fn calculateSstoreGas(
    hardfork: constants.Hardfork,
    current_value: u256,
    new_value: u256,
    original_value: u256,
    is_cold: bool,
) u64 {
    const gas_constants = constants.getGasConstants(hardfork);
    
    // EIP-2929 cold access cost
    var gas: u64 = if (is_cold) constants.COLD_SLOAD_COST else 0;
    
    // Simplified SSTORE gas calculation (actual implementation is more complex)
    if (current_value == new_value) {
        // No-op
        gas += constants.WARM_STORAGE_READ_COST;
    } else if (current_value == 0 and new_value != 0) {
        // Set from zero
        gas += gas_constants.sstore_set;
    } else if (current_value != 0 and new_value == 0) {
        // Clear to zero
        gas += gas_constants.sstore_reset;
        // Note: Refunds would be calculated separately
    } else {
        // Reset to non-zero
        gas += gas_constants.sstore_reset;
    }
    
    return gas;
}

/// Example showing how to use opcode classification
pub fn getOpcodeStackEffect(opcode: u8) struct { pop: u8, push: u8 } {
    if (constants.isPush(opcode)) {
        return .{ .pop = 0, .push = 1 };
    } else if (opcode == constants.PUSH0) {
        return .{ .pop = 0, .push = 1 };
    } else if (constants.isDup(opcode)) {
        const n = constants.getDupSize(opcode);
        return .{ .pop = 0, .push = 1 }; // DUP doesn't pop, just pushes
    } else if (constants.isSwap(opcode)) {
        return .{ .pop = 0, .push = 0 }; // SWAP doesn't change stack size
    } else if (constants.isLog(opcode)) {
        const topics = constants.getLogTopics(opcode);
        return .{ .pop = 2 + topics, .push = 0 }; // offset, size, and topics
    }
    
    // For other opcodes, would need a full mapping
    return switch (opcode) {
        constants.ADD, constants.MUL, constants.SUB, constants.DIV => .{ .pop = 2, .push = 1 },
        constants.POP => .{ .pop = 1, .push = 0 },
        constants.MLOAD, constants.SLOAD => .{ .pop = 1, .push = 1 },
        constants.MSTORE, constants.SSTORE => .{ .pop = 2, .push = 0 },
        constants.CALL => .{ .pop = 7, .push = 1 },
        constants.RETURN, constants.REVERT => .{ .pop = 2, .push = 0 },
        else => .{ .pop = 0, .push = 0 }, // Unknown or special handling needed
    };
}

test "memory operation cost calculation" {
    const std = @import("std");
    
    // Test no expansion needed
    const no_expansion = calculateMemoryOperationCost(1024, 512);
    try std.testing.expectEqual(@as(u64, 0), no_expansion.cost);
    try std.testing.expect(!no_expansion.overflow);
    
    // Test expansion from 0 to 32 bytes (1 word)
    const expand_one_word = calculateMemoryOperationCost(0, 32);
    try std.testing.expectEqual(@as(u64, 3), expand_one_word.cost); // 1 word * 3 gas
    try std.testing.expect(!expand_one_word.overflow);
    
    // Test expansion with quadratic cost
    const expand_large = calculateMemoryOperationCost(0, 1024);
    try std.testing.expectEqual(@as(u64, 98), expand_large.cost); // As calculated in constants tests
    try std.testing.expect(!expand_large.overflow);
}

test "opcode hardfork validation" {
    const std = @import("std");
    
    // PUSH0 is only valid from Shanghai
    try std.testing.expect(!isOpcodeValidForHardfork(constants.PUSH0, .Berlin));
    try std.testing.expect(!isOpcodeValidForHardfork(constants.PUSH0, .London));
    try std.testing.expect(isOpcodeValidForHardfork(constants.PUSH0, .Shanghai));
    try std.testing.expect(isOpcodeValidForHardfork(constants.PUSH0, .Cancun));
    
    // BASEFEE is only valid from London
    try std.testing.expect(!isOpcodeValidForHardfork(constants.BASEFEE, .Berlin));
    try std.testing.expect(isOpcodeValidForHardfork(constants.BASEFEE, .London));
    try std.testing.expect(isOpcodeValidForHardfork(constants.BASEFEE, .Paris));
    
    // Most opcodes are valid in all hardforks
    try std.testing.expect(isOpcodeValidForHardfork(constants.ADD, .Frontier));
    try std.testing.expect(isOpcodeValidForHardfork(constants.ADD, .Cancun));
}