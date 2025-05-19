const std = @import("std");

pub const evm = @import("Evm");
pub const utils = @import("Utils");

/// Wasm compatible kekkak256
export fn keccak256(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) void {
    const input = input_ptr[0..input_len];
    const output = output_ptr[0..32];
    std.crypto.hash.sha3.Keccak256.hash(input, output, .{});
}

/// Load bytecode into the EVM
export fn loadBytecode_zig(bytecode_hex_ptr: [*]const u8, bytecode_hex_len: usize) void {
    const bytecode_hex = bytecode_hex_ptr[0..bytecode_hex_len];
    // TODO: Implement bytecode loading functionality
    _ = bytecode_hex;
}

/// Reset the EVM state
export fn resetEvm_zig() void {
    // TODO: Implement EVM reset functionality
}

/// Execute one step in the EVM
export fn stepEvm_zig(state_ptr: [*]u8, state_len: *usize) void {
    // TODO: Implement EVM step functionality
    // For now, just create an empty JSON state
    const state_json = "{}";
    const json_bytes = state_json.len;

    if (json_bytes <= state_len.*) {
        @memcpy(state_ptr[0..json_bytes], state_json);
        state_len.* = json_bytes;
    } else {
        state_len.* = 0; // Indicate error: buffer too small
    }
}

/// Toggle EVM between running and paused states
export fn toggleRunPause_zig(state_ptr: [*]u8, state_len: *usize) void {
    // TODO: Implement run/pause toggle functionality
    // For now, just create an empty JSON state
    const state_json = "{}";
    const json_bytes = state_json.len;

    if (json_bytes <= state_len.*) {
        @memcpy(state_ptr[0..json_bytes], state_json);
        state_len.* = json_bytes;
    } else {
        state_len.* = 0; // Indicate error: buffer too small
    }
}

/// Get the current EVM state
export fn getEvmState_zig(state_ptr: [*]u8, state_len: *usize) void {
    // TODO: Implement state retrieval functionality
    // For now, just create an empty JSON state
    const state_json = "{}";
    const json_bytes = state_json.len;

    if (json_bytes <= state_len.*) {
        @memcpy(state_ptr[0..json_bytes], state_json);
        state_len.* = json_bytes;
    } else {
        state_len.* = 0; // Indicate error: buffer too small
    }
}
