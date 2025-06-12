const std = @import("std");
const gas_constants = @import("src/evm/constants/gas_constants.zig");

pub fn main() !void {
    std.log.info("=== MEMORY GAS COST DEBUG ===", .{});
    
    // Test case from the failing test:
    // Memory is already expanded to 1056 bytes (33 words) from previous operations
    // Now expanding to 1088 bytes (34 words) for offset 1056 + 32
    
    const current_size: u64 = 1056; // 33 words
    const new_size: u64 = 1088;     // 34 words
    
    const expansion_cost = gas_constants.memory_gas_cost(current_size, new_size);
    
    std.log.info("Current size: {} bytes ({} words)", .{ current_size, (current_size + 31) / 32 });
    std.log.info("New size: {} bytes ({} words)", .{ new_size, (new_size + 31) / 32 });
    std.log.info("Expansion gas cost: {}", .{expansion_cost});
    
    // Calculate expected costs manually using the formula: 3n + n²/512
    const current_words = (current_size + 31) / 32;
    const new_words = (new_size + 31) / 32;
    
    const current_cost = gas_constants.MemoryGas * current_words + (current_words * current_words) / gas_constants.QuadCoeffDiv;
    const new_cost = gas_constants.MemoryGas * new_words + (new_words * new_words) / gas_constants.QuadCoeffDiv;
    
    std.log.info("Manual calculation:", .{});
    std.log.info("  Current words: {}, cost: {}", .{ current_words, current_cost });
    std.log.info("  New words: {}, cost: {}", .{ new_words, new_cost });
    std.log.info("  Difference: {}", .{ new_cost - current_cost });
    
    // Test what happens if memory is empty initially
    const from_zero_to_32 = gas_constants.memory_gas_cost(0, 32);
    std.log.info("From 0 to 32 bytes: {} gas", .{from_zero_to_32});
    
    const from_zero_to_1088 = gas_constants.memory_gas_cost(0, 1088);
    std.log.info("From 0 to 1088 bytes: {} gas", .{from_zero_to_1088});
}