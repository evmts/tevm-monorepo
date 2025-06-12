const std = @import("std");

// Export stub for __zig_probe_stack to satisfy linker
export fn __zig_probe_stack() callconv(.C) void {}

// Simple test exports to verify WASM build works
export fn add(a: u32, b: u32) u32 {
    return a + b;
}

export fn getVersion() u32 {
    return 100; // v1.0.0
}

// Memory allocation for WASM
export fn alloc(len: usize) ?[*]u8 {
    const allocator = std.heap.wasm_allocator;
    const slice = allocator.alloc(u8, len) catch return null;
    return slice.ptr;
}

export fn free(ptr: [*]u8, len: usize) void {
    const allocator = std.heap.wasm_allocator;
    const slice = ptr[0..len];
    allocator.free(slice);
}

// Minimal EVM-like call that just returns success
export fn evmCall(
    input_ptr: [*]const u8,
    input_len: usize,
    output_ptr: [*]u8,
    output_max_len: usize,
) i32 {
    _ = input_ptr;
    _ = input_len;
    
    // Just write a simple success response
    if (output_max_len >= 8) {
        // Write length 0
        @memset(output_ptr[0..8], 0);
        return 0; // Success
    }
    
    return -1; // Buffer too small
}

// =============================================================================
// Crypto utility exports for JavaScript integration
// =============================================================================

// Keccac256 hash with binary input/output
export fn keccac256(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) void {
    const input = input_ptr[0..input_len];
    const output = output_ptr[0..32];
    
    // For now, use a simple stub implementation
    // TODO: Replace with actual Keccac256 implementation
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        output[i] = if (i < input.len) input[i % input.len] else 0;
    }
}

// Keccac256 hash with hex string input/output
export fn keccac256_hex(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) usize {
    // Allocate temporary buffers
    var allocator = std.heap.wasm_allocator;
    const input_bytes = allocator.alloc(u8, input_len / 2) catch return 0;
    defer allocator.free(input_bytes);
    
    // Decode hex input to bytes
    const decoded_len = hexToBytes_simple(input_ptr[0..input_len], input_bytes) catch return 0;
    
    // Hash the decoded bytes (stub implementation)
    var hash_bytes: [32]u8 = undefined;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        hash_bytes[i] = if (i < decoded_len) input_bytes[i % decoded_len] else 0;
    }
    
    // Encode hash to hex with 0x prefix
    const hex_len = bytesToHex_simple(&hash_bytes, output_ptr[0..66]) catch return 0;
    return hex_len;
}

// Convert hex string to bytes
export fn hexToBytes(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) usize {
    const input_hex = input_ptr[0..input_len];
    const output_slice = output_ptr[0..input_len]; // Max possible output size
    
    return hexToBytes_simple(input_hex, output_slice) catch 0;
}

// Convert bytes to hex string
export fn bytesToHex(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) usize {
    const input_bytes = input_ptr[0..input_len];
    
    return bytesToHex_simple(input_bytes, output_ptr[0..(input_len * 2 + 2)]) catch 0;
}

// Stdlib versions using standard library implementations
export fn hexToBytes_stdlib(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) usize {
    // Skip "0x" prefix if present
    var start_idx: usize = 0;
    if (input_len >= 2 and input_ptr[0] == '0' and (input_ptr[1] == 'x' or input_ptr[1] == 'X')) {
        start_idx = 2;
    }

    // Get the hex string (without prefix)
    const hex_string = input_ptr[start_idx..input_len];
    const hex_len_adjusted = input_len - start_idx;
    const out_len = (hex_len_adjusted + 1) / 2; // Handle odd length
    const out_slice = output_ptr[0..out_len];

    // Use std.fmt.hexToBytes
    _ = std.fmt.hexToBytes(out_slice, hex_string) catch return 0;
    return out_len;
}

export fn bytesToHex_stdlib(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) usize {
    const bytes = input_ptr[0..input_len];
    
    // Write the 0x prefix
    output_ptr[0] = '0';
    output_ptr[1] = 'x';
    
    // Create a slice for the output (excluding prefix)
    const hex_out = output_ptr[2 .. 2 + input_len * 2];
    
    // Use std.fmt.bufPrint to format as hex
    const hex_str = std.fmt.bufPrint(hex_out, "{x}", .{std.fmt.fmtSliceHexLower(bytes)}) catch return 0;
    
    return 2 + hex_str.len;
}

export fn keccac256_hex_stdlib(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) usize {
    // Decode hex input to bytes using stdlib
    var allocator = std.heap.wasm_allocator;
    const input_bytes = allocator.alloc(u8, input_len / 2) catch return 0;
    defer allocator.free(input_bytes);
    
    const decoded_len = hexToBytes_stdlib(input_ptr, input_len, input_bytes.ptr);
    
    // Hash the decoded bytes (stub implementation)
    var hash_bytes: [32]u8 = undefined;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        hash_bytes[i] = if (i < decoded_len) input_bytes[i % decoded_len] else 0;
    }
    
    // Encode hash to hex with 0x prefix using stdlib
    const hex_len = bytesToHex_stdlib(&hash_bytes, 32, output_ptr);
    return hex_len;
}

// Legacy versions with _old suffix for backward compatibility
export fn hexToBytes_old(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) usize {
    return hexToBytes(input_ptr, input_len, output_ptr);
}

export fn bytesToHex_old(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) usize {
    return bytesToHex(input_ptr, input_len, output_ptr);
}

export fn keccac256_hex_old(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) usize {
    return keccac256_hex(input_ptr, input_len, output_ptr);
}

// =============================================================================
// Simple hex utility functions (to avoid module conflicts)
// =============================================================================

fn hex_char_to_value(c: u8) ?u8 {
    return switch (c) {
        '0'...'9' => c - '0',
        'a'...'f' => c - 'a' + 10,
        'A'...'F' => c - 'A' + 10,
        else => null,
    };
}

fn hexToBytes_simple(hex_string: []const u8, output: []u8) !usize {
    // Skip "0x" prefix if present
    var start_idx: usize = 0;
    if (hex_string.len >= 2 and hex_string[0] == '0' and (hex_string[1] == 'x' or hex_string[1] == 'X')) {
        start_idx = 2;
    }

    const hex_chars = hex_string[start_idx..];
    const out_len = (hex_chars.len + 1) / 2;
    
    if (output.len < out_len) return error.BufferTooSmall;

    var out_idx: usize = 0;
    var i: usize = 0;

    // Handle odd number of hex digits
    if (hex_chars.len % 2 != 0) {
        const val = hex_char_to_value(hex_chars[0]) orelse return error.InvalidHex;
        output[out_idx] = val;
        out_idx += 1;
        i += 1;
    }

    // Process pairs
    while (i < hex_chars.len) : (i += 2) {
        const high = hex_char_to_value(hex_chars[i]) orelse return error.InvalidHex;
        const low = hex_char_to_value(hex_chars[i + 1]) orelse return error.InvalidHex;
        output[out_idx] = (high << 4) | low;
        out_idx += 1;
    }

    return out_idx;
}

fn bytesToHex_simple(bytes: []const u8, output: []u8) !usize {
    if (output.len < 2 + bytes.len * 2) return error.BufferTooSmall;
    
    // Write the 0x prefix
    output[0] = '0';
    output[1] = 'x';

    // Convert each byte to hex
    for (bytes, 0..) |byte, i| {
        const hex_idx = 2 + i * 2;
        const hi_nib = @as(u4, @truncate(byte >> 4));
        const lo_nib = @as(u4, @truncate(byte & 0x0F));

        output[hex_idx] = std.fmt.digitToChar(hi_nib, std.fmt.Case.lower);
        output[hex_idx + 1] = std.fmt.digitToChar(lo_nib, std.fmt.Case.lower);
    }

    return 2 + bytes.len * 2;
}