const std = @import("std");
const abi = @import("abi.zig");

/// Error type for ABI encoding operations
pub const EncodeError = error{
    ValueTypeMismatch,
    InvalidArrayLength,
    BufferTooSmall,
    OutOfMemory,
    InvalidValue,
    BufferFull,
};

/// Encodes values according to the Contract ABI specification
/// 
/// out_buffer: Pre-allocated buffer to write the encoded data to
/// params: Array of ABI parameters that describe the types
/// values: HashMap of values to encode by parameter name
/// 
/// Returns the number of bytes written to out_buffer
pub fn encodeAbiParameters(
    out_buffer: []u8,
    params: []const abi.Param,
    values: std.StringHashMap([]const u8),
) !usize {
    // Use temporary buffers for head and tail parts
    var head_buf: [4096]u8 = undefined; // Adjust size as needed
    var tail_buf: [4096]u8 = undefined; // Adjust size as needed
    
    var head_len: usize = 0;
    var tail_len: usize = 0;
    
    // Calculate the minimum head size (32 bytes per static param)
    var head_size: usize = 0;
    
    // First pass: calculate the total head size
    for (params) |_| {
        head_size += 32; // All types use at least 32 bytes in the head
    }
    
    // Second pass: encode each parameter
    for (params) |param| {
        const value_opt = values.get(param.name);
        if (value_opt == null) {
            return EncodeError.ValueTypeMismatch;
        }
        const value = value_opt.?;
        
        try encodeParam(
            param, 
            value, 
            head_buf[head_len..], 
            tail_buf[tail_len..], 
            &head_len, 
            &tail_len, 
            head_size
        );
    }
    
    // Check if we have enough space in the output buffer
    const total_len = head_len + tail_len;
    if (out_buffer.len < total_len) {
        return EncodeError.BufferTooSmall;
    }
    
    // Copy head and tail to output buffer
    std.mem.copy(u8, out_buffer[0..head_len], head_buf[0..head_len]);
    std.mem.copy(u8, out_buffer[head_len..total_len], tail_buf[0..tail_len]);
    
    return total_len;
}

/// Internal helper to encode a single parameter
fn encodeParam(
    param: abi.Param,
    value: []const u8,
    head: []u8,
    tail: []u8,
    head_len: *usize,
    tail_len: *usize,
    head_size: usize,
) !void {
    const ty = param.ty;

    // Handle simple static types (uint256, int256, address, bytes32, bool)
    if (std.mem.eql(u8, ty, "uint256") or 
        std.mem.eql(u8, ty, "int256") or
        std.mem.eql(u8, ty, "address") or
        std.mem.eql(u8, ty, "bytes32")) {
        
        // Validate and pad the value to 32 bytes
        if (value.len > 32) {
            return EncodeError.ValueTypeMismatch;
        }
        
        if (head_len.* + 32 > head.len) {
            return EncodeError.BufferTooSmall;
        }
        
        // Zero out the buffer
        std.mem.set(u8, head[head_len.* .. head_len.* + 32], 0);
        
        if (std.mem.eql(u8, ty, "address")) {
            // Address: pad on the left (20 bytes for address)
            const start_idx = head_len.* + 32 - @minimum(value.len, 20);
            std.mem.copy(u8, head[start_idx..], value[value.len - @minimum(value.len, 20)..]);
        } else {
            // Other types: pad on the right
            std.mem.copy(u8, head[head_len.* + 32 - value.len..], value);
        }
        
        head_len.* += 32;
        return;
    }

    // Boolean type
    if (std.mem.eql(u8, ty, "bool")) {
        if (value.len != 1) {
            return EncodeError.ValueTypeMismatch;
        }
        
        if (head_len.* + 32 > head.len) {
            return EncodeError.BufferTooSmall;
        }
        
        // Zero out the buffer
        std.mem.set(u8, head[head_len.* .. head_len.* + 32], 0);
        
        // Set the last byte to the boolean value
        head[head_len.* + 31] = value[0] != 0;
        
        head_len.* += 32;
        return;
    }

    // Handle uint8 to uint248, int8 to int248
    if ((std.mem.startsWith(u8, ty, "uint") or std.mem.startsWith(u8, ty, "int")) and ty.len > 3) {
        // Get the bit size from the type name
        const size_str = ty[if (ty[0] == 'u') 4 else 3..];
        const bit_size = std.fmt.parseInt(usize, size_str, 10) catch return EncodeError.ValueTypeMismatch;
        
        if (bit_size == 0 or bit_size > 256 or bit_size % 8 != 0) {
            return EncodeError.ValueTypeMismatch;
        }
        
        const byte_size = bit_size / 8;
        if (value.len > byte_size) {
            return EncodeError.ValueTypeMismatch;
        }
        
        if (head_len.* + 32 > head.len) {
            return EncodeError.BufferTooSmall;
        }
        
        // Zero out the buffer
        std.mem.set(u8, head[head_len.* .. head_len.* + 32], 0);
        
        // Copy with right padding
        std.mem.copy(u8, head[head_len.* + 32 - value.len..], value);
        
        head_len.* += 32;
        return;
    }

    // Fixed size bytes (bytes1 to bytes32)
    if (std.mem.startsWith(u8, ty, "bytes") and ty.len > 5) {
        const size_str = ty[5..];
        const byte_size = std.fmt.parseInt(usize, size_str, 10) catch return EncodeError.ValueTypeMismatch;
        
        if (byte_size == 0 or byte_size > 32) {
            return EncodeError.ValueTypeMismatch;
        }
        
        if (value.len != byte_size) {
            return EncodeError.ValueTypeMismatch;
        }
        
        if (head_len.* + 32 > head.len) {
            return EncodeError.BufferTooSmall;
        }
        
        // Zero out the buffer
        std.mem.set(u8, head[head_len.* .. head_len.* + 32], 0);
        
        // Copy with left padding (for bytesN)
        std.mem.copy(u8, head[head_len.* .. head_len.* + value.len], value);
        
        head_len.* += 32;
        return;
    }

    // Dynamic types: bytes and string
    if (std.mem.eql(u8, ty, "bytes") or std.mem.eql(u8, ty, "string")) {
        if (head_len.* + 32 > head.len) {
            return EncodeError.BufferTooSmall;
        }
        
        // For dynamic types, store the offset to the data in the head
        const offset = head_size + tail_len.*;
        
        // Zero out the offset buffer
        std.mem.set(u8, head[head_len.* .. head_len.* + 32], 0);
        
        // Write the offset
        writeUint256(offset, head[head_len.* .. head_len.* + 32]);
        head_len.* += 32;
        
        // Check if we have enough space for length and data
        const length_and_padding = 32 + value.len + ((32 - (value.len % 32)) % 32);
        if (tail_len.* + length_and_padding > tail.len) {
            return EncodeError.BufferTooSmall;
        }
        
        // Write the length
        std.mem.set(u8, tail[tail_len.* .. tail_len.* + 32], 0);
        writeUint256(value.len, tail[tail_len.* .. tail_len.* + 32]);
        tail_len.* += 32;
        
        // Write the actual data
        std.mem.copy(u8, tail[tail_len.* .. tail_len.* + value.len], value);
        tail_len.* += value.len;
        
        // Pad to 32 bytes
        const padding_bytes = (32 - (value.len % 32)) % 32;
        std.mem.set(u8, tail[tail_len.* .. tail_len.* + padding_bytes], 0);
        tail_len.* += padding_bytes;
        
        return;
    }

    // Arrays (fixed and dynamic)
    if (std.mem.indexOfScalar(u8, ty, '[') != null) {
        // TODO: Implement array encoding
        // This is complex and requires parsing the type string and handling arrays of different dimensions
        return EncodeError.ValueTypeMismatch;
    }

    // Tuples or structs
    if (param.components.len > 0) {
        // TODO: Implement tuple/struct encoding
        // This would need to recursively encode nested structures
        return EncodeError.ValueTypeMismatch;
    }

    // Unsupported type
    return EncodeError.ValueTypeMismatch;
}

/// Helper to write a uint256 value to a 32-byte buffer
fn writeUint256(value: usize, out: []u8) void {
    std.debug.assert(out.len >= 32);
    
    var val = value;
    // Clear buffer first
    std.mem.set(u8, out, 0);
    
    // Write bytes from least to most significant
    var i: usize = 31;
    while (val > 0) : (i -= 1) {
        out[i] = @truncate(u8, val);
        val >>= 8;
        if (i == 0) break;
    }
}

/// Convert a primitive value to bytes and write to out_buffer
pub fn valueToBytes(comptime T: type, value: T, out_buffer: []u8) !usize {
    if (T == bool) {
        if (out_buffer.len < 1) {
            return EncodeError.BufferTooSmall;
        }
        out_buffer[0] = if (value) 1 else 0;
        return 1;
    }
    
    if (T == u256 or T == i256 or
        T == u128 or T == i128 or
        T == u64 or T == i64 or
        T == u32 or T == i32 or
        T == u16 or T == i16 or
        T == u8 or T == i8) {
        
        const size = @sizeOf(T);
        if (out_buffer.len < size) {
            return EncodeError.BufferTooSmall;
        }
        
        // Convert to big endian as per ABI spec
        const native_value = std.mem.nativeToBig(T, value);
        std.mem.copy(u8, out_buffer[0..size], std.mem.asBytes(&native_value));
        
        return size;
    }
    
    return EncodeError.ValueTypeMismatch;
}

/// Tests for encodeAbiParameters
test "encodeAbiParameters basic types" {
    const testing = std.testing;
    
    // Test encoding a uint256
    {
        var values = std.StringHashMap([]const u8).init(testing.allocator);
        defer values.deinit();
        
        // Value 42 as bytes
        const value = [_]u8{42};
        try values.put("value", &value);
        
        const params = [_]abi.Param{.{
            .ty = "uint256",
            .name = "value",
            .components = &[_]abi.Param{},
            .internal_type = null,
        }};
        
        // Allocate buffer for result
        var result: [32]u8 = undefined;
        
        const written = try encodeAbiParameters(&result, &params, values);
        
        // Expected: 0x000000000000000000000000000000000000000000000000000000000000002a
        try testing.expectEqual(@as(usize, 32), written);
        try testing.expectEqual(@as(u8, 0), result[30]);
        try testing.expectEqual(@as(u8, 42), result[31]);
    }

    // Test encoding a bool
    {
        var values = std.StringHashMap([]const u8).init(testing.allocator);
        defer values.deinit();
        
        // Value true as bytes
        const value = [_]u8{1};
        try values.put("flag", &value);
        
        const params = [_]abi.Param{.{
            .ty = "bool",
            .name = "flag",
            .components = &[_]abi.Param{},
            .internal_type = null,
        }};
        
        // Allocate buffer for result
        var result: [32]u8 = undefined;
        
        const written = try encodeAbiParameters(&result, &params, values);
        
        // Expected: 0x0000000000000000000000000000000000000000000000000000000000000001
        try testing.expectEqual(@as(usize, 32), written);
        for (result[0..31]) |b| {
            try testing.expectEqual(@as(u8, 0), b);
        }
        try testing.expectEqual(@as(u8, 1), result[31]);
    }

    // Test valueToBytes
    {
        var buffer: [8]u8 = undefined;
        
        // Test bool
        const bool_size = try valueToBytes(bool, true, &buffer);
        try testing.expectEqual(@as(usize, 1), bool_size);
        try testing.expectEqual(@as(u8, 1), buffer[0]);
        
        // Test uint32
        const u32_size = try valueToBytes(u32, 0x12345678, buffer[0..4]);
        try testing.expectEqual(@as(usize, 4), u32_size);
        try testing.expectEqual(@as(u8, 0x12), buffer[0]);
        try testing.expectEqual(@as(u8, 0x34), buffer[1]);
        try testing.expectEqual(@as(u8, 0x56), buffer[2]);
        try testing.expectEqual(@as(u8, 0x78), buffer[3]);
    }
}