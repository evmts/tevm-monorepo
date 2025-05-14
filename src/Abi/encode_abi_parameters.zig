const std = @import("std");
const abi = @import("abi.zig");

/// Error type for ABI encoding operations
pub const EncodeError = error{
    ValueTypeMismatch,
    InvalidArrayLength,
    BufferTooSmall,
    OutOfMemory,
    InvalidValue,
};

/// Encodes values according to the Contract ABI specification
/// 
/// params: Array of ABI parameters that describe the types
/// values: HashMap of values to encode by parameter name
/// 
/// Returns the ABI-encoded data allocated by the provided allocator
pub fn encodeAbiParameters(
    allocator: std.mem.Allocator,
    params: []const abi.Param,
    values: std.StringHashMap([]const u8),
) ![]u8 {
    // Initialize dynamic arrays for head and tail parts
    var head = std.ArrayList(u8).init(allocator);
    defer head.deinit();
    
    var tail = std.ArrayList(u8).init(allocator);
    defer tail.deinit();
    
    // Calculate the minimum head size (32 bytes per static param)
    var head_size: usize = 0;
    
    // First pass: calculate the total head size
    for (params) |param| {
        head_size += 32; // All types use at least 32 bytes in the head
    }
    
    // Second pass: encode each parameter
    for (params) |param| {
        const value_opt = values.get(param.name);
        if (value_opt == null) {
            return EncodeError.ValueTypeMismatch;
        }
        const value = value_opt.?;
        
        try encodeParam(allocator, param, value, &head, &tail, head_size);
    }
    
    // Combine head and tail
    var result = std.ArrayList(u8).init(allocator);
    try result.appendSlice(head.items);
    try result.appendSlice(tail.items);
    
    return result.toOwnedSlice();
}

/// Internal helper to encode a single parameter
fn encodeParam(
    allocator: std.mem.Allocator,
    param: abi.Param,
    value: []const u8,
    head: *std.ArrayList(u8),
    tail: *std.ArrayList(u8),
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
        
        // Create a 32-byte buffer with right padding (for uint/int) or left padding (for address)
        var buffer: [32]u8 = [_]u8{0} ** 32;
        
        if (std.mem.eql(u8, ty, "address")) {
            // Address: pad on the left (20 bytes for address)
            const start_idx = 32 - @minimum(value.len, 20);
            std.mem.copy(u8, buffer[start_idx..], value[value.len - @minimum(value.len, 20)..]);
        } else {
            // Other types: pad on the right
            std.mem.copy(u8, buffer[32 - value.len..], value);
        }
        
        try head.appendSlice(&buffer);
        return;
    }

    // Boolean type
    if (std.mem.eql(u8, ty, "bool")) {
        if (value.len != 1) {
            return EncodeError.ValueTypeMismatch;
        }
        
        var buffer: [32]u8 = [_]u8{0} ** 32;
        buffer[31] = value[0] != 0;
        
        try head.appendSlice(&buffer);
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
        
        // Pad the value to 32 bytes
        var buffer: [32]u8 = [_]u8{0} ** 32;
        
        // Copy with right padding
        std.mem.copy(u8, buffer[32 - value.len..], value);
        
        try head.appendSlice(&buffer);
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
        
        // Pad the value to 32 bytes with right padding (for bytesN)
        var buffer: [32]u8 = [_]u8{0} ** 32;
        std.mem.copy(u8, buffer[0..value.len], value);
        
        try head.appendSlice(&buffer);
        return;
    }

    // Dynamic types: bytes and string
    if (std.mem.eql(u8, ty, "bytes") or std.mem.eql(u8, ty, "string")) {
        // For dynamic types, store the offset to the data in the head
        const offset = head_size + tail.items.len;
        
        // Write the offset to the head
        var offset_buffer: [32]u8 = [_]u8{0} ** 32;
        const offset_bytes = valueToBytes(u256, @intCast(u256, offset));
        std.mem.copy(u8, offset_buffer[32 - offset_bytes.len..], offset_bytes);
        try head.appendSlice(&offset_buffer);
        
        // Write the length and data to the tail
        var length_buffer: [32]u8 = [_]u8{0} ** 32;
        const length_bytes = valueToBytes(u256, @intCast(u256, value.len));
        std.mem.copy(u8, length_buffer[32 - length_bytes.len..], length_bytes);
        try tail.appendSlice(&length_buffer);
        
        // Write the actual data
        try tail.appendSlice(value);
        
        // Pad to 32 bytes
        const padding_bytes = (32 - (value.len % 32)) % 32;
        try tail.appendNTimes(0, padding_bytes);
        
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

/// Convert various primitive values to bytes
pub fn valueToBytes(comptime T: type, value: T) []const u8 {
    if (T == bool) {
        return if (value) &[_]u8{1} else &[_]u8{0};
    }
    
    if (T == u256 or T == i256 or
        T == u128 or T == i128 or
        T == u64 or T == i64 or
        T == u32 or T == i32 or
        T == u16 or T == i16 or
        T == u8 or T == i8) {
        
        var buffer: [@sizeOf(T)]u8 = undefined;
        
        // Convert to big endian as per ABI spec
        const native_value = std.mem.nativeToBig(T, value);
        std.mem.copy(u8, &buffer, std.mem.asBytes(&native_value));
        
        return &buffer;
    }
    
    if (T == []const u8) {
        return value;
    }
    
    // For unsupported types, return an empty slice
    // In practice, this should be handled before calling this function
    return &[_]u8{};
}

/// Tests for encodeAbiParameters
test "encodeAbiParameters basic types" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();

    // Test encoding a uint256
    {
        const params = [_]abi.Param{.{
            .ty = "uint256",
            .name = "value",
            .components = &[_]abi.Param{},
            .internal_type = null,
        }};
        
        var values = std.StringHashMap([]const u8).init(alloc);
        defer values.deinit();
        
        // Value 42 as bytes
        const value = [_]u8{42};
        try values.put("value", &value);
        
        const result = try encodeAbiParameters(alloc, &params, values);
        defer alloc.free(result);
        
        // Expected: 0x000000000000000000000000000000000000000000000000000000000000002a
        try testing.expectEqual(@as(usize, 32), result.len);
        try testing.expectEqual(@as(u8, 0), result[30]);
        try testing.expectEqual(@as(u8, 42), result[31]);
    }

    // Test encoding a bool
    {
        const params = [_]abi.Param{.{
            .ty = "bool",
            .name = "flag",
            .components = &[_]abi.Param{},
            .internal_type = null,
        }};
        
        var values = std.StringHashMap([]const u8).init(alloc);
        defer values.deinit();
        
        // Value true as bytes
        const value = [_]u8{1};
        try values.put("flag", &value);
        
        const result = try encodeAbiParameters(alloc, &params, values);
        defer alloc.free(result);
        
        // Expected: 0x0000000000000000000000000000000000000000000000000000000000000001
        try testing.expectEqual(@as(usize, 32), result.len);
        for (result[0..31]) |b| {
            try testing.expectEqual(@as(u8, 0), b);
        }
        try testing.expectEqual(@as(u8, 1), result[31]);
    }

    // TODO: Add more tests for other types
}