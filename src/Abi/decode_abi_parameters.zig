const std = @import("std");
const abi = @import("abi.zig");

/// Error type for ABI decoding operations
pub const DecodeError = error{
    InvalidData,
    BufferTooShort,
    InvalidPadding,
    InvalidLength,
    InvalidType,
    OutOfBounds,
    EndOfStream,
    DynamicDataOutOfBounds,
};

/// Decodes ABI-encoded data according to the Contract ABI specification
/// 
/// params: Array of ABI parameters that describe the types
/// data: ABI-encoded data bytes to decode
/// 
/// Returns an array of decoded values allocated by the provided allocator
pub fn decodeAbiParameters(
    allocator: std.mem.Allocator,
    params: []const abi.Param,
    data: []const u8,
) !std.StringHashMap([]const u8) {
    var result = std.StringHashMap([]const u8).init(allocator);
    var offset: usize = 0;

    for (params) |param| {
        // Check if we have enough data left
        if (offset >= data.len) {
            return DecodeError.BufferTooShort;
        }

        const value = try decodeParam(allocator, param, data, &offset);
        try result.put(param.name, value);
    }

    return result;
}

/// Internal helper to decode a single parameter
fn decodeParam(
    allocator: std.mem.Allocator,
    param: abi.Param,
    data: []const u8,
    offset: *usize,
) ![]const u8 {
    const ty = param.ty;

    // Simple 32-byte static types
    if (std.mem.eql(u8, ty, "uint256") or 
        std.mem.eql(u8, ty, "int256") or
        std.mem.eql(u8, ty, "bytes32") or
        std.mem.eql(u8, ty, "address")) {
        
        if (offset.* + 32 > data.len) {
            return DecodeError.BufferTooShort;
        }
        
        const value = allocator.dupe(u8, data[offset.* .. offset.* + 32]) catch return DecodeError.OutOfBounds;
        offset.* += 32;
        return value;
    }

    // Handle uint8, uint16, etc.
    if (std.mem.startsWith(u8, ty, "uint") or std.mem.startsWith(u8, ty, "int")) {
        if (offset.* + 32 > data.len) {
            return DecodeError.BufferTooShort;
        }
        
        // Still consume 32 bytes as per ABI spec
        const value = allocator.dupe(u8, data[offset.* .. offset.* + 32]) catch return DecodeError.OutOfBounds;
        offset.* += 32;
        return value;
    }

    // Boolean
    if (std.mem.eql(u8, ty, "bool")) {
        if (offset.* + 32 > data.len) {
            return DecodeError.BufferTooShort;
        }
        
        // Check that all bytes except the last are 0
        for (data[offset.* .. offset.* + 31]) |b| {
            if (b != 0) {
                return DecodeError.InvalidPadding;
            }
        }
        
        // Get the boolean value from the last byte
        const value = allocator.alloc(u8, 1) catch return DecodeError.OutOfBounds;
        value[0] = if (data[offset.* + 31] == 0) 0 else 1;
        offset.* += 32;
        return value;
    }

    // Dynamic sized bytes
    if (std.mem.eql(u8, ty, "bytes")) {
        // Read the offset to the dynamic data
        if (offset.* + 32 > data.len) {
            return DecodeError.BufferTooShort;
        }
        
        const dynamic_offset = std.mem.bigToNative(u256, @ptrCast(*const u256, data[offset.* .. offset.* + 32].*));
        offset.* += 32;
        
        // Read the length
        if (dynamic_offset + 32 > data.len) {
            return DecodeError.DynamicDataOutOfBounds;
        }
        
        const length = std.mem.bigToNative(u256, @ptrCast(*const u256, data[dynamic_offset .. dynamic_offset + 32].*));
        
        // Check bounds
        if (dynamic_offset + 32 + length > data.len) {
            return DecodeError.DynamicDataOutOfBounds;
        }
        
        // Copy the actual bytes data
        return allocator.dupe(u8, data[dynamic_offset + 32 .. dynamic_offset + 32 + length]) catch return DecodeError.OutOfBounds;
    }

    // Fixed sized bytes (bytes1, bytes2, ..., bytes32)
    if (std.mem.startsWith(u8, ty, "bytes") and ty.len > 5) {
        if (offset.* + 32 > data.len) {
            return DecodeError.BufferTooShort;
        }
        
        const size_str = ty[5..]; // Extract the number after "bytes"
        const size = std.fmt.parseInt(usize, size_str, 10) catch return DecodeError.InvalidType;
        
        if (size > 32) {
            return DecodeError.InvalidType;
        }
        
        // Copy the actual bytes data (right padded in the 32 byte word)
        return allocator.dupe(u8, data[offset.* .. offset.* + size]) catch return DecodeError.OutOfBounds;
    }

    // String
    if (std.mem.eql(u8, ty, "string")) {
        // Strings are encoded like bytes
        // Read the offset to the dynamic data
        if (offset.* + 32 > data.len) {
            return DecodeError.BufferTooShort;
        }
        
        const dynamic_offset = std.mem.bigToNative(u256, @ptrCast(*const u256, data[offset.* .. offset.* + 32].*));
        offset.* += 32;
        
        // Read the length
        if (dynamic_offset + 32 > data.len) {
            return DecodeError.DynamicDataOutOfBounds;
        }
        
        const length = std.mem.bigToNative(u256, @ptrCast(*const u256, data[dynamic_offset .. dynamic_offset + 32].*));
        
        // Check bounds
        if (dynamic_offset + 32 + length > data.len) {
            return DecodeError.DynamicDataOutOfBounds;
        }
        
        // Copy the actual string data
        return allocator.dupe(u8, data[dynamic_offset + 32 .. dynamic_offset + 32 + length]) catch return DecodeError.OutOfBounds;
    }

    // Array types - both fixed and dynamic
    if (std.mem.indexOfScalar(u8, ty, '[') != null) {
        // TODO: Implement array decoding
        // This is complex and would require parsing the type string to determine array dimensions
        return DecodeError.InvalidType;
    }

    // Tuple or struct types
    if (param.components.len > 0) {
        // TODO: Implement tuple/struct decoding
        // This would require recursive decoding of the components
        return DecodeError.InvalidType;
    }

    // Unsupported type
    return DecodeError.InvalidType;
}

/// Convert bytes to various primitive types
pub fn bytesToValue(comptime T: type, bytes: []const u8) !T {
    if (bytes.len < @sizeOf(T)) {
        return DecodeError.BufferTooShort;
    }
    
    if (T == bool) {
        // Check for valid boolean encoding
        for (bytes[0..bytes.len-1]) |b| {
            if (b != 0) return DecodeError.InvalidPadding;
        }
        return bytes[bytes.len-1] != 0;
    }
    
    if (T == u256 or T == i256) {
        return std.mem.bigToNative(T, @ptrCast(*const T, bytes[0..@sizeOf(T)]).*);
    }
    
    if (T == []const u8) {
        return bytes;
    }
    
    if (T == u8 or T == u16 or T == u32 or T == u64 or T == u128 or
        T == i8 or T == i16 or T == i32 or T == i64 or T == i128) {
        // For smaller integers, verify padding
        const size = @sizeOf(T);
        const is_signed = @typeInfo(T).Int.signedness == .signed;
        
        // Check padding based on sign
        const padding_byte: u8 = if (is_signed and (bytes[bytes.len - size] & 0x80) != 0) 0xFF else 0x00;
        
        for (bytes[0..bytes.len-size]) |b| {
            if (b != padding_byte) return DecodeError.InvalidPadding;
        }
        
        // Extract the value (always big-endian in ABI)
        var result: T = 0;
        for (bytes[bytes.len-size..bytes.len], 0..) |b, i| {
            result = result << 8 | @intCast(T, b);
        }
        return result;
    }
    
    return DecodeError.InvalidType;
}

/// Tests for decodeAbiParameters
test "decodeAbiParameters basic types" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const alloc = arena.allocator();

    // Test decoding a uint256
    {
        const params = [_]abi.Param{.{
            .ty = "uint256",
            .name = "value",
            .components = &[_]abi.Param{},
            .internal_type = null,
        }};
        
        // Hex: 0x000000000000000000000000000000000000000000000000000000000000002a (42 in decimal)
        const data = [_]u8{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,42};
        
        const result = try decodeAbiParameters(alloc, &params, &data);
        defer result.deinit();
        
        try testing.expect(result.contains("value"));
        const value = result.get("value").?;
        try testing.expectEqual(@as(usize, 32), value.len);
        try testing.expectEqual(@as(u8, 42), value[31]);
    }

    // Test decoding a bool
    {
        const params = [_]abi.Param{.{
            .ty = "bool",
            .name = "flag",
            .components = &[_]abi.Param{},
            .internal_type = null,
        }};
        
        // Hex: 0x0000000000000000000000000000000000000000000000000000000000000001 (true)
        const data = [_]u8{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1};
        
        const result = try decodeAbiParameters(alloc, &params, &data);
        defer result.deinit();
        
        try testing.expect(result.contains("flag"));
        const value = result.get("flag").?;
        try testing.expectEqual(@as(usize, 1), value.len);
        try testing.expectEqual(@as(u8, 1), value[0]);
    }

    // TODO: Add more tests for other types
}