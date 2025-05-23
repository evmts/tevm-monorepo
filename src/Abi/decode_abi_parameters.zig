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
    BufferFull,
};

/// Decodes ABI-encoded data according to the Contract ABI specification
/// 
/// result: Pre-initialized map to store decoded values by parameter name
/// params: Array of ABI parameters that describe the types
/// data: ABI-encoded data bytes to decode
/// 
/// Fills the result map with decoded values
pub fn decodeAbiParameters(
    result: *std.StringHashMap([]const u8),
    params: []const abi.Param,
    data: []const u8,
) !void {
    var offset: usize = 0;

    for (params) |param| {
        // Check if we have enough data left
        if (offset >= data.len) {
            return DecodeError.BufferTooShort;
        }

        var out_value: []const u8 = undefined;
        try decodeParam(param, data, &offset, &out_value);
        try result.put(param.name, out_value);
    }
}

/// Internal helper to decode a single parameter
fn decodeParam(
    param: abi.Param,
    data: []const u8,
    offset: *usize,
    out_value: *[]const u8,
) !void {
    const ty = param.ty;

    // Simple 32-byte static types
    if (std.mem.eql(u8, ty, "uint256") or 
        std.mem.eql(u8, ty, "int256") or
        std.mem.eql(u8, ty, "bytes32") or
        std.mem.eql(u8, ty, "address")) {
        
        if (offset.* + 32 > data.len) {
            return DecodeError.BufferTooShort;
        }
        
        out_value.* = data[offset.* .. offset.* + 32];
        offset.* += 32;
        return;
    }

    // Handle uint8, uint16, etc.
    if (std.mem.startsWith(u8, ty, "uint") or std.mem.startsWith(u8, ty, "int")) {
        if (offset.* + 32 > data.len) {
            return DecodeError.BufferTooShort;
        }
        
        // Still consume 32 bytes as per ABI spec
        out_value.* = data[offset.* .. offset.* + 32];
        offset.* += 32;
        return;
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
        
        // Return the entire 32-byte word with the boolean in the last byte
        out_value.* = data[offset.* .. offset.* + 32];
        offset.* += 32;
        return;
    }

    // Dynamic sized bytes
    if (std.mem.eql(u8, ty, "bytes")) {
        // Read the offset to the dynamic data
        if (offset.* + 32 > data.len) {
            return DecodeError.BufferTooShort;
        }
        
        const dynamic_offset = std.mem.bigToNative(u256, @as(*const u256, @ptrCast(@alignCast(data[offset.* .. offset.* + 32].ptr))).*);
        offset.* += 32;
        
        // Read the length
        const dynamic_offset_usize = @as(usize, @intCast(dynamic_offset));
        if (dynamic_offset_usize + 32 > data.len) {
            return DecodeError.DynamicDataOutOfBounds;
        }
        
        const length = std.mem.bigToNative(u256, @as(*const u256, @ptrCast(@alignCast(&data[dynamic_offset_usize]))).*);
        
        // Check bounds
        const length_usize = @as(usize, @intCast(length));
        if (dynamic_offset_usize + 32 + length_usize > data.len) {
            return DecodeError.DynamicDataOutOfBounds;
        }
        
        // Return the actual bytes data
        out_value.* = data[dynamic_offset_usize + 32 .. dynamic_offset_usize + 32 + length_usize];
        return;
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
        
        // Return the actual bytes data (right padded in the 32 byte word)
        out_value.* = data[offset.* .. offset.* + size];
        offset.* += 32; // Still consume the full 32 bytes
        return;
    }

    // String
    if (std.mem.eql(u8, ty, "string")) {
        // Strings are encoded like bytes
        // Read the offset to the dynamic data
        if (offset.* + 32 > data.len) {
            return DecodeError.BufferTooShort;
        }
        
        const dynamic_offset = std.mem.bigToNative(u256, @as(*const u256, @ptrCast(@alignCast(data[offset.* .. offset.* + 32].ptr))).*);
        offset.* += 32;
        
        // Read the length
        const dynamic_offset_usize = @as(usize, @intCast(dynamic_offset));
        if (dynamic_offset_usize + 32 > data.len) {
            return DecodeError.DynamicDataOutOfBounds;
        }
        
        const length = std.mem.bigToNative(u256, @as(*const u256, @ptrCast(@alignCast(&data[dynamic_offset_usize]))).*);
        
        // Check bounds
        const length_usize = @as(usize, @intCast(length));
        if (dynamic_offset_usize + 32 + length_usize > data.len) {
            return DecodeError.DynamicDataOutOfBounds;
        }
        
        // Return the actual string data
        out_value.* = data[dynamic_offset_usize + 32 .. dynamic_offset_usize + 32 + length_usize];
        return;
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

/// Converts bytes to a primitive type - in-place variant
pub fn bytesToValueInPlace(comptime T: type, bytes: []const u8, out: *T) !void {
    if (bytes.len < @sizeOf(T)) {
        return DecodeError.BufferTooShort;
    }
    
    if (T == bool) {
        // Check for valid boolean encoding
        for (bytes[0..bytes.len-1]) |b| {
            if (b != 0) return DecodeError.InvalidPadding;
        }
        out.* = bytes[bytes.len-1] != 0;
        return;
    }
    
    if (T == u256 or T == i256) {
        out.* = std.mem.bigToNative(T, @as(*const T, @ptrCast(@alignCast(bytes[0..@sizeOf(T)].ptr))).*);
        return;
    }
    
    if (T == u8 or T == u16 or T == u32 or T == u64 or T == u128 or
        T == i8 or T == i16 or T == i32 or T == i64 or T == i128) {
        // For smaller integers, verify padding
        const size = @sizeOf(T);
        const is_signed = @typeInfo(T).int.signedness == .signed;
        
        // Check padding based on sign
        const padding_byte: u8 = if (is_signed and (bytes[bytes.len - size] & 0x80) != 0) 0xFF else 0x00;
        
        for (bytes[0..bytes.len-size]) |b| {
            if (b != padding_byte) return DecodeError.InvalidPadding;
        }
        
        // Extract the value (always big-endian in ABI)
        var result: T = 0;
        for (bytes[bytes.len-size..bytes.len]) |b| {
            if (@bitSizeOf(T) >= 8) {
                result = (result << 8) | @as(T, @intCast(b));
            } else {
                // For types smaller than u8, just use the last byte
                result = @as(T, @intCast(b & ((1 << @bitSizeOf(T)) - 1)));
            }
        }
        out.* = result;
        return;
    }
    
    return DecodeError.InvalidType;
}

test "decodeAbiParameters basic types" {
    const testing = std.testing;
    
    // Test decoding a uint256
    {
        var result = std.StringHashMap([]const u8).init(testing.allocator);
        defer result.deinit();
        
        const params = [_]abi.Param{.{
            .ty = "uint256",
            .name = "value",
            .components = &[_]abi.Param{},
            .internal_type = null,
        }};
        
        // Hex: 0x000000000000000000000000000000000000000000000000000000000000002a (42 in decimal)
        const data = [_]u8{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,42};
        
        try decodeAbiParameters(&result, &params, &data);
        
        try testing.expect(result.contains("value"));
        const value = result.get("value").?;
        try testing.expectEqual(@as(usize, 32), value.len);
        try testing.expectEqual(@as(u8, 42), value[31]);
    }

    // Test decoding a bool
    {
        var result = std.StringHashMap([]const u8).init(testing.allocator);
        defer result.deinit();
        
        const params = [_]abi.Param{.{
            .ty = "bool",
            .name = "flag",
            .components = &[_]abi.Param{},
            .internal_type = null,
        }};
        
        // Hex: 0x0000000000000000000000000000000000000000000000000000000000000001 (true)
        const data = [_]u8{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1};
        
        try decodeAbiParameters(&result, &params, &data);
        
        try testing.expect(result.contains("flag"));
        const value = result.get("flag").?;
        try testing.expectEqual(@as(usize, 32), value.len);
        try testing.expectEqual(@as(u8, 1), value[31]);
        
        // Test bytesToValueInPlace for bool
        var bool_value: bool = false;
        try bytesToValueInPlace(bool, value, &bool_value);
        try testing.expect(bool_value);
    }

    // Test bytesToValueInPlace for uint8
    {
        const data = [_]u8{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,123};
        var value: u8 = 0;
        try bytesToValueInPlace(u8, &data, &value);
        try testing.expectEqual(@as(u8, 123), value);
    }
}