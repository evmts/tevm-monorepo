const std = @import("std");
const evm = @import("evm");
const Address = @import("address");

// Export stub for __zig_probe_stack to satisfy linker when linking with Rust
export fn __zig_probe_stack() callconv(.C) void {
    // This is a no-op stub. Stack checking is disabled in build.zig
}

// Use WASM allocator for memory management
var gpa = std.heap.wasm_allocator;

// Global VM instance
var global_vm: ?*evm.Vm = null;

// Memory allocation functions for WASM
export fn alloc(len: usize) ?[*]u8 {
    const slice = gpa.alloc(u8, len) catch return null;
    return slice.ptr;
}

export fn free(ptr: [*]u8, len: usize) void {
    const slice = ptr[0..len];
    gpa.free(slice);
}

// Initialize the EVM
export fn evmInit() i32 {
    if (global_vm != null) return -1; // Already initialized

    // Initialize VM
    const vm = evm.Vm.init(gpa) catch return -2;
    global_vm = gpa.create(evm.Vm) catch return -3;
    global_vm.?.* = vm;

    return 0;
}

// Deinitialize the EVM
export fn evmDeinit() void {
    if (global_vm) |vm| {
        vm.deinit();
        gpa.destroy(vm);
        global_vm = null;
    }
}

// Simple call function that executes bytecode and returns result
// Returns: 0 on success, negative on error
// Output format: first 8 bytes = output length, followed by output data
export fn evmCall(
    bytecode_ptr: [*]const u8,
    bytecode_len: usize,
    gas_limit: u64,
    output_ptr: [*]u8,
    output_max_len: usize,
) i32 {
    const vm = global_vm orelse return -1;

    const bytecode = bytecode_ptr[0..bytecode_len];

    // Execute the bytecode
    const result = vm.run(bytecode, Address.zero(), gas_limit, null) catch {
        return -2;
    };

    // Get output data
    const output_data = result.output orelse &[_]u8{};

    // Check if output fits in buffer
    if (output_data.len + 8 > output_max_len) {
        return -3; // Output too large
    }

    // Write output length as first 8 bytes (little-endian)
    const output_len: u64 = @intCast(output_data.len);
    const output_len_bytes = std.mem.asBytes(&output_len);
    @memcpy(output_ptr[0..8], output_len_bytes);

    // Write output data after length
    if (output_data.len > 0) {
        @memcpy(output_ptr[8 .. 8 + output_data.len], output_data);
    }

    return if (result.status == .Success) 0 else -4;
}

// Get the minimum required WASM build size info
export fn getVersion() u32 {
    return 1; // Version 1.0.0
}

// =============================================================================
// Crypto utility exports for JavaScript integration
// =============================================================================

// Keccac256 hash with binary input/output
export fn keccac256(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) void {
    const input = input_ptr[0..input_len];
    const output = output_ptr[0..32];
    std.crypto.hash.sha3.Keccac256.hash(input, output, .{});
}

// Keccac256 hash with hex string input/output
export fn keccac256_hex(input_ptr: [*]const u8, input_len: usize, output_ptr: [*]u8) usize {
    // Allocate temporary buffers
    var input_bytes = gpa.alloc(u8, input_len / 2) catch return 0;
    defer gpa.free(input_bytes);
    
    // Decode hex input to bytes using simple hex decoding
    const decoded_len = hexToBytes_simple(input_ptr[0..input_len], input_bytes) catch return 0;
    
    // Hash the decoded bytes
    var hash_bytes: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccac256.hash(input_bytes[0..decoded_len], &hash_bytes, .{});
    
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

// Stdlib versions (using standard library implementations directly)
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
    std.fmt.hexToBytes(out_slice, hex_string) catch return 0;
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
    var input_bytes = gpa.alloc(u8, input_len / 2) catch return 0;
    defer gpa.free(input_bytes);
    
    const decoded_len = hexToBytes_stdlib(input_ptr, input_len, input_bytes.ptr);
    
    // Hash the decoded bytes
    var hash_bytes: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccac256.hash(input_bytes[0..decoded_len], &hash_bytes, .{});
    
    // Encode hash to hex with 0x prefix using stdlib
    const hex_len = bytesToHex_stdlib(&hash_bytes, 32, output_ptr);
    return hex_len;
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