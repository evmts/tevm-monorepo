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

// Optimized WASM-compatible hexToBytes function
// Converts a hex string (with optional 0x prefix) to a byte array
export fn zig_hexToBytes(hex_ptr: [*]const u8, hex_len: usize, output_ptr: [*]u8) usize {
    // Skip "0x" prefix if present
    var start_idx: usize = 0;
    if (hex_len >= 2 and hex_ptr[0] == '0' and (hex_ptr[1] == 'x' or hex_ptr[1] == 'X')) {
        start_idx = 2;
    }

    const hex_string = hex_ptr[start_idx..hex_len];
    const hex_len_adjusted = hex_len - start_idx;
    
    // Handle odd number of hex digits
    const out_len = (hex_len_adjusted + 1) / 2;
    var out_idx: usize = 0;
    var i: usize = 0;
    
    // Process in chunks of 4 bytes (8 hex chars) when possible
    while (i + 8 <= hex_len_adjusted) : (i += 8) {
        inline for (0..4) |j| {
            const hi_pos = i + j * 2;
            const lo_pos = hi_pos + 1;
            
            const hi = std.fmt.charToDigit(hex_string[hi_pos], 16) catch continue;
            const lo = std.fmt.charToDigit(hex_string[lo_pos], 16) catch continue;
            
            output_ptr[out_idx] = (hi << 4) | lo;
            out_idx += 1;
        }
    }
    
    // Process remaining bytes
    while (i + 1 < hex_len_adjusted) : (i += 2) {
        const hi = std.fmt.charToDigit(hex_string[i], 16) catch continue;
        const lo = std.fmt.charToDigit(hex_string[i+1], 16) catch continue;
        
        output_ptr[out_idx] = (hi << 4) | lo;
        out_idx += 1;
    }
    
    // Handle odd-length hex string
    if (i < hex_len_adjusted) {
        const val = std.fmt.charToDigit(hex_string[i], 16) catch 0;
        output_ptr[out_idx] = val;
        out_idx += 1;
    }
    
    return out_idx;
}

// WASM-compatible bytesToHex function
// Converts a byte array to a hex string with 0x prefix
export fn zig_bytesToHex(bytes_ptr: [*]const u8, bytes_len: usize, output_ptr: [*]u8) usize {
    const hex_chars = "0123456789abcdef";
    
    // Write 0x prefix
    output_ptr[0] = '0';
    output_ptr[1] = 'x';
    
    // Process in chunks of 4 bytes (8 hex chars) when possible
    var i: usize = 0;
    while (i + 4 <= bytes_len) : (i += 4) {
        inline for (0..4) |j| {
            const idx = i + j;
            const byte = bytes_ptr[idx];
            const hi = (byte >> 4) & 0x0F;
            const lo = byte & 0x0F;
            
            output_ptr[2 + idx * 2] = hex_chars[hi];
            output_ptr[2 + idx * 2 + 1] = hex_chars[lo];
        }
    }
    
    // Process remaining bytes
    while (i < bytes_len) : (i += 1) {
        const byte = bytes_ptr[i];
        const hi = (byte >> 4) & 0x0F;
        const lo = byte & 0x0F;
        
        output_ptr[2 + i * 2] = hex_chars[hi];
        output_ptr[2 + i * 2 + 1] = hex_chars[lo];
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