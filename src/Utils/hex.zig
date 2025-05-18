// TODO remove utils package
const std = @import("std");

// Helper function to convert a hex character to its numerical value
fn hexCharToValue(c: u8) ?u8 {
    return switch (c) {
        '0'...'9' => c - '0',
        'a'...'f' => c - 'a' + 10,
        'A'...'F' => c - 'A' + 10,
        else => null, // Invalid hex char
    };
}

// These functions use standard library implementions where possible
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

    // Create output slice for std.fmt.hexToBytes
    const out_slice = output_ptr[0..out_len];

    // Manual conversion using std functions for greater compatibility
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

// WASM-compatible bytesToHex function using std fmt utilities
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
