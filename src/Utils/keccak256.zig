// TODO remove utils package
const std = @import("std");

// WASM-compatible keccak256 function with bytes input/output
export fn keccak256(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) void {
    const input = input_ptr[0..input_len];
    const output = output_ptr[0..32];
    std.crypto.hash.sha3.Keccak256.hash(input, output, .{});
}

// WASM-compatible keccak256 function that takes a hex string and returns a hex string
// using stdlib hex conversion
export fn keccak256_hex(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
    var binary_buffer: [1024]u8 = undefined; // Buffer for binary data converted from hex

    // Import the hex conversion function
    const hex = @import("hex.zig");

    // Convert hex to bytes using stdlib
    const binary_len = hex.hexToBytes(hex_ptr, hex_len, &binary_buffer);

    // Compute keccak256 hash
    var hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(binary_buffer[0..binary_len], &hash, .{});

    // Convert hash to hex string using stdlib
    return hex.bytesToHex(&hash, 32, output_ptr);
}
