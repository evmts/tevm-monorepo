//! Core types for ZigEVM
//! This module defines the fundamental types used throughout the ZigEVM implementation
//! including U256, Address, Hash, and error types.

const std = @import("std");

/// U256 represents a 256-bit unsigned integer, fundamental for EVM operations
pub const U256 = struct {
    // Use native 64-bit words for more efficient math operations
    words: [4]u64 align(8) = [_]u64{0} ** 4,
    
    /// Create a new U256 initialized to zero
    pub fn zero() U256 { 
        return .{ .words = [_]u64{0} ** 4 }; 
    }
    
    /// Create a new U256 initialized to one
    pub fn one() U256 {
        return fromU64(1);
    }
    
    /// Create a new U256 initialized to the maximum value (2^256 - 1)
    pub fn max() U256 {
        return .{ .words = [_]u64{std.math.maxInt(u64)} ** 4 };
    }
    
    /// Create a U256 from a u64 value
    pub fn fromU64(value: u64) U256 {
        return .{ .words = [_]u64{ value, 0, 0, 0 } };
    }
    
    /// Create a U256 from a byte array (big-endian)
    pub fn fromBytes(bytes: []const u8) !U256 {
        if (bytes.len != 32) return error.InvalidU256Length;
        var result = U256.zero();
        
        // Unaligned big-endian to little-endian conversion (optimized)
        inline for (0..4) |i| {
            const idx = 24 - (i * 8);
            result.words[i] = std.mem.readIntBig(u64, bytes[idx..][0..8]);
        }
        return result;
    }
    
    /// Convert U256 to a byte array (big-endian)
    pub fn toBytes(self: U256, dst: *[32]u8) void {
        // Little-endian to big-endian conversion
        inline for (0..4) |i| {
            const idx = 24 - (i * 8);
            std.mem.writeIntBig(u64, dst[idx..][0..8], self.words[i]);
        }
    }
    
    /// Convert U256 to a hexadecimal string
    pub fn toHexString(self: U256, allocator: std.mem.Allocator) ![]u8 {
        var bytes: [32]u8 = undefined;
        self.toBytes(&bytes);
        
        var result = try allocator.alloc(u8, 66); // 0x + 64 hex chars
        result[0] = '0';
        result[1] = 'x';
        
        const hex_charset = "0123456789abcdef";
        for (bytes, 0..) |byte, i| {
            result[2 + i * 2] = hex_charset[byte >> 4];
            result[2 + i * 2 + 1] = hex_charset[byte & 0x0F];
        }
        
        return result;
    }
    
    /// Create a U256 from a hexadecimal string
    pub fn fromHexString(hex_str: []const u8) !U256 {
        // Handle 0x prefix if present
        var hex = hex_str;
        if (hex.len >= 2 and hex[0] == '0' and (hex[1] == 'x' or hex[1] == 'X')) {
            hex = hex[2..];
        }
        
        // Validate hex string
        if (hex.len == 0 or hex.len > 64) {
            return error.InvalidHexString;
        }
        
        // Create a 32-byte buffer and fill it from the right
        var bytes: [32]u8 = [_]u8{0} ** 32;
        const start_idx = 32 - (hex.len + 1) / 2;
        
        // Handle odd length
        if (hex.len % 2 != 0) {
            bytes[start_idx] = try std.fmt.parseInt(u8, hex[0..1], 16);
            hex = hex[1..];
        }
        
        // Parse the rest of the hex string
        var i: usize = start_idx + (hex.len % 2 != 0);
        var j: usize = (hex.len % 2 != 0);
        while (j < hex.len) : (j += 2) {
            bytes[i] = try std.fmt.parseInt(u8, hex[j..][0..2], 16);
            i += 1;
        }
        
        return try U256.fromBytes(&bytes);
    }
    
    // Arithmetic operations - optimized for performance
    
    /// Add two U256 values
    pub fn add(self: U256, other: U256) U256 {
        var result = U256.zero();
        var carry: u1 = 0;
        
        inline for (0..4) |i| {
            const a = self.words[i];
            const b = other.words[i];
            const partial_sum = @addWithOverflow(a, b);
            const with_carry = @addWithOverflow(partial_sum[0], carry);
            result.words[i] = with_carry[0];
            carry = @intCast(partial_sum[1] | with_carry[1]);
        }
        
        return result;
    }
    
    /// Subtract one U256 from another
    pub fn sub(self: U256, other: U256) U256 {
        var result = U256.zero();
        var borrow: u1 = 0;
        
        inline for (0..4) |i| {
            const a = self.words[i];
            const b = other.words[i];
            const partial_diff = @subWithOverflow(a, b);
            const with_borrow = @subWithOverflow(partial_diff[0], borrow);
            result.words[i] = with_borrow[0];
            borrow = @intCast(partial_diff[1] | with_borrow[1]);
        }
        
        return result;
    }
    
    /// Multiply two U256 values
    pub fn mul(self: U256, other: U256) U256 {
        // Simple implementation - in production we'd use a more efficient algorithm
        var result = U256.zero();
        var temp = self;
        
        // For each bit in other, if set, add temp to result and double temp
        for (0..4) |i| {
            var word = other.words[i];
            var bit: u6 = 0;
            
            while (bit < 64) : (bit += 1) {
                if ((word & 1) != 0) {
                    result = result.add(temp);
                }
                
                temp = temp.shl(1);
                word >>= 1;
            }
        }
        
        return result;
    }
    
    /// Left shift a U256 by a given number of bits
    pub fn shl(self: U256, shift: u9) U256 {
        if (shift == 0) return self;
        if (shift >= 256) return U256.zero();
        
        var result = U256.zero();
        const word_shift = shift / 64;
        const bit_shift = @as(u6, @intCast(shift % 64));
        
        if (bit_shift == 0) {
            // Word-aligned shift
            for (word_shift..4) |i| {
                result.words[i - word_shift] = self.words[i];
            }
        } else {
            // Cross-word shift
            const inv_bit_shift = 64 - bit_shift;
            
            for (word_shift..4) |i| {
                const low_bits = self.words[i] << bit_shift;
                const high_bits = if (i + 1 < 4) self.words[i + 1] >> inv_bit_shift else 0;
                result.words[i - word_shift] = low_bits | high_bits;
            }
        }
        
        return result;
    }
    
    /// Right shift a U256 by a given number of bits
    pub fn shr(self: U256, shift: u9) U256 {
        if (shift == 0) return self;
        if (shift >= 256) return U256.zero();
        
        var result = U256.zero();
        const word_shift = shift / 64;
        const bit_shift = @as(u6, @intCast(shift % 64));
        
        if (bit_shift == 0) {
            // Word-aligned shift
            for (0..4 - word_shift) |i| {
                result.words[i + word_shift] = self.words[i];
            }
        } else {
            // Cross-word shift
            const inv_bit_shift = 64 - bit_shift;
            
            for (0..4 - word_shift) |i| {
                const high_bits = self.words[i] >> bit_shift;
                const low_bits = if (i > 0) self.words[i - 1] << inv_bit_shift else 0;
                result.words[i + word_shift] = high_bits | low_bits;
            }
        }
        
        return result;
    }
    
    /// Bitwise AND of two U256 values
    pub fn bitAnd(self: U256, other: U256) U256 {
        var result = U256.zero();
        
        inline for (0..4) |i| {
            result.words[i] = self.words[i] & other.words[i];
        }
        
        return result;
    }
    
    /// Bitwise OR of two U256 values
    pub fn bitOr(self: U256, other: U256) U256 {
        var result = U256.zero();
        
        inline for (0..4) |i| {
            result.words[i] = self.words[i] | other.words[i];
        }
        
        return result;
    }
    
    /// Bitwise XOR of two U256 values
    pub fn bitXor(self: U256, other: U256) U256 {
        var result = U256.zero();
        
        inline for (0..4) |i| {
            result.words[i] = self.words[i] ^ other.words[i];
        }
        
        return result;
    }
    
    /// Bitwise NOT (complement) of a U256
    pub fn bitNot(self: U256) U256 {
        var result = U256.zero();
        
        inline for (0..4) |i| {
            result.words[i] = ~self.words[i];
        }
        
        return result;
    }
    
    // Comparison operations
    
    /// Check if two U256 values are equal
    pub fn eq(self: U256, other: U256) bool {
        inline for (0..4) |i| {
            if (self.words[i] != other.words[i]) return false;
        }
        return true;
    }
    
    /// Check if self is greater than other
    pub fn gt(self: U256, other: U256) bool {
        var i: usize = 3;
        while (true) : (i -= 1) {
            if (self.words[i] > other.words[i]) return true;
            if (self.words[i] < other.words[i]) return false;
            if (i == 0) break;
        }
        return false;
    }
    
    /// Check if self is less than other
    pub fn lt(self: U256, other: U256) bool {
        var i: usize = 3;
        while (true) : (i -= 1) {
            if (self.words[i] < other.words[i]) return true;
            if (self.words[i] > other.words[i]) return false;
            if (i == 0) break;
        }
        return false;
    }
    
    /// Check if self is greater than or equal to other
    pub fn gte(self: U256, other: U256) bool {
        return !self.lt(other);
    }
    
    /// Check if self is less than or equal to other
    pub fn lte(self: U256, other: U256) bool {
        return !self.gt(other);
    }
    
    /// Check if U256 is zero
    pub fn isZero(self: U256) bool {
        inline for (0..4) |i| {
            if (self.words[i] != 0) return false;
        }
        return true;
    }
};

/// Address represents a 20-byte Ethereum address
pub const Address = struct { 
    bytes: [20]u8 = [_]u8{0} ** 20,
    
    /// Create a new Address initialized to zero
    pub fn zero() Address {
        return .{ .bytes = [_]u8{0} ** 20 };
    }
    
    /// Create an Address from a byte array
    pub fn fromBytes(bytes: []const u8) !Address {
        if (bytes.len != 20) return error.InvalidAddressLength;
        var addr = Address.zero();
        @memcpy(&addr.bytes, bytes);
        return addr;
    }
    
    /// Create an Address from a hex string
    pub fn fromHexString(hex_str: []const u8) !Address {
        // Handle 0x prefix
        var hex = hex_str;
        if (hex.len >= 2 and hex[0] == '0' and (hex[1] == 'x' or hex[1] == 'X')) {
            hex = hex[2..];
        }
        
        // Validate length
        if (hex.len != 40) {
            return error.InvalidAddressLength;
        }
        
        var addr = Address.zero();
        
        // Parse hex string
        for (0..20) |i| {
            const byte_str = hex[i * 2 .. i * 2 + 2];
            addr.bytes[i] = try std.fmt.parseInt(u8, byte_str, 16);
        }
        
        return addr;
    }
    
    /// Convert Address to a hex string
    pub fn toHexString(self: Address, allocator: std.mem.Allocator) ![]u8 {
        var result = try allocator.alloc(u8, 42); // 0x + 40 hex chars
        result[0] = '0';
        result[1] = 'x';
        
        const hex_charset = "0123456789abcdef";
        for (self.bytes, 0..) |byte, i| {
            result[2 + i * 2] = hex_charset[byte >> 4];
            result[2 + i * 2 + 1] = hex_charset[byte & 0x0F];
        }
        
        return result;
    }
    
    /// Check if two addresses are equal
    pub fn eq(self: Address, other: Address) bool {
        return std.mem.eql(u8, &self.bytes, &other.bytes);
    }
};

/// Hash represents a 32-byte hash, used for various purposes in Ethereum
pub const Hash = struct { 
    bytes: [32]u8 = [_]u8{0} ** 32,
    
    /// Create a new Hash initialized to zero
    pub fn zero() Hash {
        return .{ .bytes = [_]u8{0} ** 32 };
    }
    
    /// Create a Hash from a byte array
    pub fn fromBytes(bytes: []const u8) !Hash {
        if (bytes.len != 32) return error.InvalidHashLength;
        var hash = Hash.zero();
        @memcpy(&hash.bytes, bytes);
        return hash;
    }
    
    /// Create a Hash from a hex string
    pub fn fromHexString(hex_str: []const u8) !Hash {
        // Handle 0x prefix
        var hex = hex_str;
        if (hex.len >= 2 and hex[0] == '0' and (hex[1] == 'x' or hex[1] == 'X')) {
            hex = hex[2..];
        }
        
        // Validate length
        if (hex.len != 64) {
            return error.InvalidHashLength;
        }
        
        var hash = Hash.zero();
        
        // Parse hex string
        for (0..32) |i| {
            const byte_str = hex[i * 2 .. i * 2 + 2];
            hash.bytes[i] = try std.fmt.parseInt(u8, byte_str, 16);
        }
        
        return hash;
    }
    
    /// Convert Hash to a hex string
    pub fn toHexString(self: Hash, allocator: std.mem.Allocator) ![]u8 {
        var result = try allocator.alloc(u8, 66); // 0x + 64 hex chars
        result[0] = '0';
        result[1] = 'x';
        
        const hex_charset = "0123456789abcdef";
        for (self.bytes, 0..) |byte, i| {
            result[2 + i * 2] = hex_charset[byte >> 4];
            result[2 + i * 2 + 1] = hex_charset[byte & 0x0F];
        }
        
        return result;
    }
    
    /// Check if two hashes are equal
    pub fn eq(self: Hash, other: Hash) bool {
        return std.mem.eql(u8, &self.bytes, &other.bytes);
    }
};

/// Error types for ZigEVM operations
pub const Error = error{
    // Stack-related errors
    StackOverflow,
    StackUnderflow,
    
    // Gas-related errors
    OutOfGas,
    
    // Instruction-related errors
    InvalidOpcode,
    InvalidJump,
    InvalidJumpDest,
    
    // State-related errors
    WriteProtection,
    StorageUnavailable,
    StaticModeViolation,
    
    // Memory-related errors
    ReturnDataOutOfBounds,
    InvalidOffset,
    
    // Call-related errors
    CallDepthExceeded,
    
    // Format-related errors
    InvalidAddressLength,
    InvalidHashLength,
    InvalidU256Length,
    InvalidHexString,
    
    // State-related errors
    AccountNotFound,
    
    // Other errors
    InternalError,
};

/// Result of EVM execution
pub const ExecutionResult = union(enum) {
    Success: struct {
        gas_used: u64,
        gas_refunded: u64,
        return_data: []const u8,
    },
    Revert: struct {
        gas_used: u64,
        return_data: []const u8,
    },
    Error: struct {
        error_type: Error,
        gas_used: u64,
    },
};

// Tests
test "U256 basic operations" {
    const a = U256.fromU64(42);
    const b = U256.fromU64(100);
    
    try std.testing.expect(a.words[0] == 42);
    try std.testing.expect(a.words[1] == 0);
    try std.testing.expect(a.words[2] == 0);
    try std.testing.expect(a.words[3] == 0);
    
    const sum = a.add(b);
    try std.testing.expect(sum.words[0] == 142);
    
    const diff = b.sub(a);
    try std.testing.expect(diff.words[0] == 58);
    
    try std.testing.expect(a.lt(b));
    try std.testing.expect(b.gt(a));
    try std.testing.expect(!a.eq(b));
    try std.testing.expect(a.eq(a));
}

test "Address conversions" {
    const addr1 = Address.zero();
    try std.testing.expect(addr1.bytes[0] == 0);
    try std.testing.expect(addr1.bytes[19] == 0);
    
    const hex = "0x1234567890123456789012345678901234567890";
    const addr2 = try Address.fromHexString(hex);
    try std.testing.expect(addr2.bytes[0] == 0x12);
    try std.testing.expect(addr2.bytes[19] == 0x90);
    
    const hex_str = try addr2.toHexString(std.testing.allocator);
    defer std.testing.allocator.free(hex_str);
    try std.testing.expect(std.mem.eql(u8, hex_str, hex));
}

test "Hash conversions" {
    const hash1 = Hash.zero();
    try std.testing.expect(hash1.bytes[0] == 0);
    try std.testing.expect(hash1.bytes[31] == 0);
    
    const hex = "0x1234567890123456789012345678901234567890123456789012345678901234";
    const hash2 = try Hash.fromHexString(hex);
    try std.testing.expect(hash2.bytes[0] == 0x12);
    try std.testing.expect(hash2.bytes[31] == 0x34);
    
    const hex_str = try hash2.toHexString(std.testing.allocator);
    defer std.testing.allocator.free(hex_str);
    try std.testing.expect(std.mem.eql(u8, hex_str, hex));
}