const std = @import("std");

pub const evm = @import("Evm");
pub const utils = @import("Utils");

/// Wasm compatible kekkak256
export fn keccak256(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) void {
    const input = input_ptr[0..input_len];
    const output = output_ptr[0..32];
    std.crypto.hash.sha3.Keccak256.hash(input, output, .{});
}
