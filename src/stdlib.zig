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

// WASM-compatible hexToBytes function using Zig's standard library
// Converts a hex string (with optional 0x prefix) to a byte array
export fn zig_hexToBytes(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
    // Skip "0x" prefix if present
    var start_idx: usize = 0;
    if (hex_len >= 2 and hex_ptr[0] == '0' and (hex_ptr[1] == 'x' or hex_ptr[1] == 'X')) {
        start_idx = 2;
    }

    const hex_string = hex_ptr[start_idx..hex_len];
    const hex_len_adjusted = hex_len - start_idx;

    // Calculate output size (each pair of hex chars = 1 byte)
    const out_len = (hex_len_adjusted + 1) / 2; // Handle odd length

    // Use Zig format parser to convert hex to bytes
    _ = std.fmt.hexToBytes(output_ptr[0..out_len], hex_string[0..hex_len_adjusted]) catch {
        // If conversion fails, return 0 bytes written
        return 0;
    };

    return out_len; // Return number of bytes written
}

// WASM-compatible bytesToHex function using Zig's standard library
// Converts a byte array to a hex string with 0x prefix
export fn zig_bytesToHex(bytes_ptr: [*]const u8, bytes_len: usize, output_ptr: [*]u8) usize {
    // Write 0x prefix
    output_ptr[0] = '0';
    output_ptr[1] = 'x';

    // Calculate output buffer size (2 hex chars per byte + 0x prefix)
    const hex_len = bytes_len * 2 + 2;

    // Create slice that Zig's std.fmt can work with
    const bytes_slice = bytes_ptr[0..bytes_len];

    // Skip the "0x" prefix we manually added
    const hex_out_slice = output_ptr[2..hex_len];

    // Use std.fmt.bytesToHex from standard library
    const hex_result = std.fmt.bytesToHex(bytes_slice, std.fmt.Case.lower);

    // Copy the result to our output buffer
    for (hex_result, 0..) |c, i| {
        hex_out_slice[i] = c;
    }

    return hex_len; // Return total length (prefix + hex chars)
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