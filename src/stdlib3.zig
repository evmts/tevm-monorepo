const std = @import("std");

pub const EVM = struct {
    pub fn init() EVM {
        return EVM{};
    }

    pub fn execute(self: *const EVM) u32 {
        _ = self;
        return 42;
    }
};

// Export a function for WASM compatibility
export fn runEvm() u32 {
    const evm = EVM.init();
    return evm.execute();
}

// WASM-compatible hexToBytes function using std.fmt.hexToBytes
// Converts a hex string (with optional 0x prefix) to a byte array
export fn zig_hexToBytes(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
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

    // Use std.fmt.hexToBytes to convert hex to bytes
    const result = std.fmt.hexToBytes(out_slice, hex_string) catch {
        // If conversion fails, return 0 bytes written
        return 0;
    };

    return result.len;
}

// WASM-compatible bytesToHex function
// Converts a byte array to a hex string with 0x prefix
export fn zig_bytesToHex(bytes_ptr: [*]const u8, bytes_len: usize, output_ptr: [*]u8) usize {
    // Get the byte slice
    const bytes = bytes_ptr[0..bytes_len];

    // Write the 0x prefix
    output_ptr[0] = '0';
    output_ptr[1] = 'x';

    // Create a slice for the output (excluding prefix)
    const hex_out = output_ptr[2 .. 2 + bytes_len * 2];

    // Manual conversion for each byte (using std.fmt utilities)
    for (bytes, 0..) |byte, i| {
        const hex_idx = i * 2;
        const hi_nib = @as(u4, @truncate(byte >> 4));
        const lo_nib = @as(u4, @truncate(byte & 0x0F));

        hex_out[hex_idx] = std.fmt.digitToChar(hi_nib, std.fmt.Case.lower);
        hex_out[hex_idx + 1] = std.fmt.digitToChar(lo_nib, std.fmt.Case.lower);
    }

    return 2 + bytes_len * 2;
}

// WASM-compatible keccak256 function with bytes input/output
export fn zig_keccak256(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) void {
    const input = input_ptr[0..input_len];
    const output = output_ptr[0..32];
    std.crypto.hash.sha3.Keccak256.hash(input, output, .{});
}

// WASM-compatible keccak256 function that takes a hex string and returns a hex string
export fn zig_keccak256_hex(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
    var binary_buffer: [1024]u8 = undefined; // Buffer for binary data converted from hex
    
    // Convert hex to bytes
    const binary_len = zig_hexToBytes(hex_ptr, hex_len, &binary_buffer);
    
    // Compute keccak256 hash
    var hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(binary_buffer[0..binary_len], &hash, .{});
    
    // Convert hash to hex string
    return zig_bytesToHex(&hash, 32, output_ptr);
}