const std = @import("std");

pub fn memory_gas_cost(current_size: u64, new_size: u64) u64 {
    if (new_size <= current_size) return 0;
    
    // Round up to words (32 bytes)
    const current_words = (current_size + 31) / 32;
    const new_words = (new_size + 31) / 32;
    
    // Calculate total cost: 3n + n²/512
    const current_cost = 3 * current_words + (current_words * current_words) / 512;
    const new_cost = 3 * new_words + (new_words * new_words) / 512;
    
    return new_cost - current_cost;
}

pub fn main() void {
    std.debug.print("Expanding 0 to 32: {} gas\n", .{memory_gas_cost(0, 32)});
    std.debug.print("Expanding 0 to 64: {} gas\n", .{memory_gas_cost(0, 64)});
    std.debug.print("Expanding 32 to 64: {} gas\n", .{memory_gas_cost(32, 64)});
}
