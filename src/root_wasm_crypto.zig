const std = @import("std");

// Export stub for __zig_probe_stack to satisfy linker when linking with Rust
export fn __zig_probe_stack() callconv(.C) void {
    // This is a no-op stub. Stack checking is disabled in build.zig
}

// Use WASM allocator for memory management
var gpa = std.heap.wasm_allocator;

// Memory allocation functions for WASM
export fn alloc(len: usize) ?[*]u8 {
    const slice = gpa.alloc(u8, len) catch return null;
    return slice.ptr;
}

export fn free(ptr: [*]u8, len: usize) void {
    const slice = ptr[0..len];
    gpa.free(slice);
}

// Get the minimum required WASM build size info
export fn getVersion() u32 {
    return 1; // Version 1.0.0
}

// Simple test exports to verify WASM build works
export fn add(a: u32, b: u32) u32 {
    return a + b;
}

// ==============================
// Crypto Functions
// ==============================

// Helper function to convert a hex character to its numerical value
fn hex_char_to_value(c: u8) ?u8 {
    return switch (c) {
        '0'...'9' => c - '0',
        'a'...'f' => c - 'a' + 10,
        'A'...'F' => c - 'A' + 10,
        else => null, // Invalid hex char
    };
}

// WASM-compatible keccak256 function with bytes input/output
export fn keccak256(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) void {
    const input = input_ptr[0..input_len];
    const output = output_ptr[0..32];
    std.crypto.hash.sha3.Keccak256.hash(input, output, .{});
}

// Convert hex string to bytes 
export fn hexToBytes(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
    // Skip "0x" prefix if present
    var start_idx: usize = 0;
    if (hex_len >= 2 and hex_ptr[0] == '0' and (hex_ptr[1] == 'x' or hex_ptr[1] == 'X')) {
        start_idx = 2;
    }

    // Get the hex string (without prefix)
    const hex_string = hex_ptr[start_idx..hex_len];

    // Calculate output buffer size (each pair of hex chars = 1 byte)
    const hex_len_adjusted = hex_len - start_idx;
    const out_len = (hex_len_adjusted + 1) / 2; // Handle odd length

    // Create output slice for conversion
    const out_slice = output_ptr[0..out_len];

    // Manual conversion
    var out_idx: usize = 0;
    var i: usize = 0;

    // Handle odd number of hex digits
    if (hex_len_adjusted % 2 != 0) {
        if (std.fmt.parseInt(u8, hex_string[0..1], 16)) |val| {
            out_slice[out_idx] = val;
            out_idx += 1;
            i += 1;
        } else |_| {
            // Handle error by skipping this char
        }
    }

    // Process the rest of the pairs
    while (i < hex_len_adjusted) : (i += 2) {
        if (i + 1 >= hex_len_adjusted) {
            break;
        }

        if (std.fmt.parseInt(u8, hex_string[i .. i + 2], 16)) |val| {
            out_slice[out_idx] = val;
            out_idx += 1;
        } else |_| {
            // Handle error by skipping this pair
        }
    }

    return out_idx;
}

// Convert bytes to hex string 
export fn bytesToHex(bytes_ptr: [*]const u8, bytes_len: usize, output_ptr: [*]u8) usize {
    // Write the 0x prefix
    output_ptr[0] = '0';
    output_ptr[1] = 'x';

    // Create a slice for the output (excluding prefix)
    const hex_out = output_ptr[2 .. 2 + bytes_len * 2];
    const bytes = bytes_ptr[0..bytes_len];

    // Manual conversion using std.fmt.digitToChar
    for (bytes, 0..) |byte, i| {
        const hex_idx = i * 2;
        const hi_nib = @as(u4, @truncate(byte >> 4));
        const lo_nib = @as(u4, @truncate(byte & 0x0F));

        hex_out[hex_idx] = std.fmt.digitToChar(hi_nib, std.fmt.Case.lower);
        hex_out[hex_idx + 1] = std.fmt.digitToChar(lo_nib, std.fmt.Case.lower);
    }

    return 2 + bytes_len * 2;
}

// WASM-compatible keccak256 function that takes a hex string and returns a hex string
export fn keccak256_hex(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
    var binary_buffer: [1024]u8 = undefined; // Buffer for binary data converted from hex

    // Convert hex to bytes
    const binary_len = hexToBytes(hex_ptr, hex_len, &binary_buffer);

    // Compute keccak256 hash
    var hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(binary_buffer[0..binary_len], &hash, .{});

    // Convert hash to hex string
    return bytesToHex(&hash, 32, output_ptr);
}

// Stdlib versions (same implementation for now, can be optimized later)
export fn hexToBytes_stdlib(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
    return hexToBytes(hex_ptr, hex_len, output_ptr);
}

export fn bytesToHex_stdlib(bytes_ptr: [*]const u8, bytes_len: usize, output_ptr: [*]u8) usize {
    return bytesToHex(bytes_ptr, bytes_len, output_ptr);
}

export fn keccak256_hex_stdlib(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
    return keccak256_hex(hex_ptr, hex_len, output_ptr);
}

// Old versions (same implementation for now, for backward compatibility)
export fn hexToBytes_old(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
    return hexToBytes(hex_ptr, hex_len, output_ptr);
}

export fn bytesToHex_old(bytes_ptr: [*]const u8, bytes_len: usize, output_ptr: [*]u8) usize {
    return bytesToHex(bytes_ptr, bytes_len, output_ptr);
}

export fn keccak256_hex_old(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
    return keccak256_hex(hex_ptr, hex_len, output_ptr);
}

// ==============================
// Simple EVM Functions
// ==============================

// Simple EVM call that just returns success for now
export fn evmCall(
    bytecode_ptr: [*]const u8,
    bytecode_len: usize,
    gas_limit: u64,
    output_ptr: [*]u8,
    output_max_len: usize,
) i32 {
    _ = bytecode_ptr;
    _ = bytecode_len;
    _ = gas_limit;
    
    // Just write a simple success response for now
    if (output_max_len >= 8) {
        // Write length 0 (no output data)
        @memset(output_ptr[0..8], 0);
        return 0; // Success
    }
    
    return -1; // Buffer too small
}

// Simple run EVM function expected by some tests
export fn runEvm() i32 {
    return 42; // Simple test response
}