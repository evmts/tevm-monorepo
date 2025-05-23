const std = @import("std");

/// B256 represents a 256-bit (32-byte) value, commonly used for hashes and storage keys in Ethereum
pub const B256 = struct {
    bytes: [32]u8,

    /// Create a zero-filled B256
    pub fn zero() B256 {
        return B256{ .bytes = [_]u8{0} ** 32 };
    }

    /// Check if all bytes are zero
    pub fn isZero(self: B256) bool {
        for (self.bytes) |byte| {
            if (byte != 0) return false;
        }
        return true;
    }

    /// Create B256 from byte array
    pub fn fromBytes(bytes: [32]u8) B256 {
        return B256{ .bytes = bytes };
    }

    /// Create B256 from slice (must be exactly 32 bytes)
    pub fn fromSlice(slice: []const u8) !B256 {
        if (slice.len != 32) {
            return error.InvalidLength;
        }
        var result = B256.zero();
        @memcpy(&result.bytes, slice);
        return result;
    }

    /// Compare two B256 values for equality
    pub fn equal(self: B256, other: B256) bool {
        return std.mem.eql(u8, &self.bytes, &other.bytes);
    }

    /// Create B256 from integer (big-endian)
    pub fn fromInt(value: u256) B256 {
        var result = B256.zero();
        std.mem.writeInt(u256, &result.bytes, value, .big);
        return result;
    }

    /// Convert to integer (big-endian)
    pub fn toInt(self: B256) u256 {
        return std.mem.readInt(u256, &self.bytes, .big);
    }

    /// Create B256 from hex string (with or without 0x prefix)
    pub fn fromHex(hex: []const u8) !B256 {
        const start = if (std.mem.startsWith(u8, hex, "0x")) 2 else 0;
        const hex_chars = hex[start..];
        
        if (hex_chars.len != 64) {
            return error.InvalidHexLength;
        }

        var result = B256.zero();
        _ = try std.fmt.hexToBytes(&result.bytes, hex_chars);
        return result;
    }

    /// Convert to hex string (without 0x prefix)
    pub fn toHex(self: B256, allocator: std.mem.Allocator) ![]u8 {
        var hex_buf = try allocator.alloc(u8, 64);
        _ = std.fmt.bytesToHex(hex_buf, &self.bytes, .lower);
        return hex_buf;
    }

    /// Format for printing
    pub fn format(
        self: B256,
        comptime fmt: []const u8,
        options: std.fmt.FormatOptions,
        writer: anytype,
    ) !void {
        _ = fmt;
        _ = options;
        try writer.writeAll("0x");
        for (self.bytes) |byte| {
            try writer.print("{x:0>2}", .{byte});
        }
    }
};

// Test the B256 implementation
test "B256 basic operations" {
    const testing = std.testing;

    // Test zero
    const zero = B256.zero();
    try testing.expect(zero.isZero());

    // Test fromBytes
    var bytes: [32]u8 = undefined;
    bytes[0] = 0xFF;
    bytes[1] = 0xAA;
    for (2..32) |i| {
        bytes[i] = 0;
    }
    const b256 = B256.fromBytes(bytes);
    try testing.expect(!b256.isZero());

    // Test equal
    const b256_copy = B256.fromBytes(bytes);
    try testing.expect(b256.equal(b256_copy));
    try testing.expect(!b256.equal(zero));

    // Test fromInt/toInt
    const value: u256 = 0x123456789ABCDEF;
    const from_int = B256.fromInt(value);
    try testing.expectEqual(value, from_int.toInt());

    // Test fromHex
    const hex_value = try B256.fromHex("0x0000000000000000000000000000000000000000000000000000000000000001");
    try testing.expectEqual(@as(u256, 1), hex_value.toInt());

    const hex_no_prefix = try B256.fromHex("0000000000000000000000000000000000000000000000000000000000000001");
    try testing.expectEqual(@as(u256, 1), hex_no_prefix.toInt());
}