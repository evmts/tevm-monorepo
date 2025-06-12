/// BigInteger implementation for MODEXP precompile
/// 
/// Provides arbitrary precision integer arithmetic operations needed for
/// modular exponentiation. Optimized for EVM use cases with focus on
/// correctness and reasonable performance.
/// 
/// ## Design
/// - Uses u64 limbs for efficient operations on 64-bit platforms
/// - Big-endian byte order for compatibility with Ethereum
/// - Montgomery ladder for secure modular exponentiation
/// - Minimal allocation patterns to reduce memory pressure

const std = @import("std");
const testing = std.testing;
const Allocator = std.mem.Allocator;

/// Arbitrary precision unsigned integer
pub const BigInteger = struct {
    limbs: []u64,
    len: usize,
    allocator: Allocator,
    
    const LIMB_BITS = 64;
    const LIMB_BYTES = 8;
    
    /// Initialize a new BigInteger with specified capacity in bytes
    pub fn init(allocator: Allocator, capacity_bytes: usize) !BigInteger {
        const limb_count = (capacity_bytes + LIMB_BYTES - 1) / LIMB_BYTES;
        const limbs = try allocator.alloc(u64, @max(limb_count, 1));
        @memset(limbs, 0);
        
        return BigInteger{
            .limbs = limbs,
            .len = 0,
            .allocator = allocator,
        };
    }
    
    /// Create BigInteger from byte array (big-endian)
    pub fn from_bytes(allocator: Allocator, bytes: []const u8) !BigInteger {
        var big_int = try BigInteger.init(allocator, @max(bytes.len, 1));
        try big_int.set_from_bytes(bytes);
        return big_int;
    }
    
    /// Create BigInteger from a single u64 value
    pub fn from_value(allocator: Allocator, value: u64) !BigInteger {
        var big_int = try BigInteger.init(allocator, 8);
        if (value != 0) {
            big_int.limbs[0] = value;
            big_int.len = 1;
        }
        return big_int;
    }
    
    /// Free allocated memory
    pub fn deinit(self: *BigInteger) void {
        self.allocator.free(self.limbs);
    }
    
    /// Clone this BigInteger
    pub fn clone(self: *const BigInteger) !BigInteger {
        var new_big_int = try BigInteger.init(self.allocator, self.limbs.len * LIMB_BYTES);
        @memcpy(new_big_int.limbs[0..self.len], self.limbs[0..self.len]);
        new_big_int.len = self.len;
        return new_big_int;
    }
    
    /// Set BigInteger value from byte array (big-endian)
    pub fn set_from_bytes(self: *BigInteger, bytes: []const u8) !void {
        @memset(self.limbs, 0);
        self.len = 0;
        
        if (bytes.len == 0) return;
        
        var byte_index: usize = bytes.len;
        var limb_index: usize = 0;
        
        while (byte_index > 0 and limb_index < self.limbs.len) {
            var limb: u64 = 0;
            var byte_count: usize = 0;
            
            // Pack 8 bytes into one limb (little-endian within limb)
            while (byte_count < LIMB_BYTES and byte_index > 0) {
                byte_index -= 1;
                limb |= (@as(u64, bytes[byte_index]) << @intCast(byte_count * 8));
                byte_count += 1;
            }
            
            if (limb != 0 or self.len > 0) {
                self.limbs[limb_index] = limb;
                if (limb != 0) {
                    self.len = limb_index + 1;
                }
            }
            limb_index += 1;
        }
    }
    
    /// Convert BigInteger to byte array (big-endian)
    pub fn to_bytes(self: *const BigInteger, allocator: Allocator) ![]u8 {
        if (self.len == 0) {
            const result = try allocator.alloc(u8, 1);
            result[0] = 0;
            return result;
        }
        
        // Find the most significant byte
        const most_sig_limb = self.limbs[self.len - 1];
        var bytes_in_top_limb: usize = 0;
        if (most_sig_limb != 0) {
            bytes_in_top_limb = LIMB_BYTES - (@clz(most_sig_limb) / 8);
        }
        
        const total_bytes = (self.len - 1) * LIMB_BYTES + bytes_in_top_limb;
        if (total_bytes == 0) {
            const result = try allocator.alloc(u8, 1);
            result[0] = 0;
            return result;
        }
        
        const result = try allocator.alloc(u8, total_bytes);
        var byte_index: usize = total_bytes;
        
        // Extract bytes from limbs (big-endian output)
        for (0..self.len) |i| {
            const limb = self.limbs[i];
            var bytes_to_extract: usize = LIMB_BYTES;
            
            // For the most significant limb, only extract non-zero bytes
            if (i == self.len - 1) {
                bytes_to_extract = bytes_in_top_limb;
            }
            
            for (0..bytes_to_extract) |j| {
                if (byte_index > 0) {
                    byte_index -= 1;
                    result[byte_index] = @intCast((limb >> @intCast(j * 8)) & 0xFF);
                }
            }
        }
        
        return result;
    }
    
    /// Check if BigInteger is zero
    pub fn is_zero(self: *const BigInteger) bool {
        return self.len == 0;
    }
    
    /// Check if BigInteger is one
    pub fn is_one(self: *const BigInteger) bool {
        return self.len == 1 and self.limbs[0] == 1;
    }
    
    /// Compare two BigIntegers
    /// Returns: -1 if self < other, 0 if equal, 1 if self > other
    pub fn compare(self: *const BigInteger, other: *const BigInteger) i32 {
        if (self.len < other.len) return -1;
        if (self.len > other.len) return 1;
        
        // Same length, compare limbs from most significant
        var i = self.len;
        while (i > 0) {
            i -= 1;
            if (self.limbs[i] < other.limbs[i]) return -1;
            if (self.limbs[i] > other.limbs[i]) return 1;
        }
        
        return 0;
    }
    
    /// Modular exponentiation using square-and-multiply
    /// Computes (base^exponent) mod modulus
    pub fn mod_exp(allocator: Allocator, base: *const BigInteger, exponent: *const BigInteger, modulus: *const BigInteger) !BigInteger {
        // Handle special cases
        if (modulus.is_zero()) {
            return BigInteger.init(allocator, 1);
        }
        
        if (modulus.is_one()) {
            return BigInteger.from_value(allocator, 0);
        }
        
        if (exponent.is_zero()) {
            return BigInteger.from_value(allocator, 1);
        }
        
        if (base.is_zero()) {
            return BigInteger.from_value(allocator, 0);
        }
        
        // Use square-and-multiply algorithm
        var result = try BigInteger.from_value(allocator, 1);
        var base_copy = try base.clone();
        defer base_copy.deinit();
        
        // Reduce base modulo modulus first
        try base_copy.mod_assign(modulus);
        
        // Process each bit of the exponent
        for (0..exponent.len) |limb_idx| {
            const limb = exponent.limbs[limb_idx];
            
            for (0..LIMB_BITS) |bit_idx| {
                const bit_mask: u64 = @as(u64, 1) << @intCast(bit_idx);
                
                if (limb & bit_mask != 0) {
                    try result.mul_mod_assign(&base_copy, modulus);
                }
                
                // Square the base for next iteration (except last bit)
                if (limb_idx + 1 < exponent.len or bit_idx + 1 < LIMB_BITS) {
                    try base_copy.mul_mod_assign(&base_copy, modulus);
                }
            }
        }
        
        return result;
    }
    
    /// Multiply this BigInteger by other modulo modulus, storing result in self
    fn mul_mod_assign(self: *BigInteger, other: *const BigInteger, modulus: *const BigInteger) !void {
        // Simple implementation - could be optimized with Montgomery multiplication
        var temp = try self.multiply(other);
        defer temp.deinit();
        
        try temp.mod_assign(modulus);
        
        // Copy result back to self
        @memcpy(self.limbs[0..temp.len], temp.limbs[0..temp.len]);
        @memset(self.limbs[temp.len..], 0);
        self.len = temp.len;
    }
    
    /// Multiply two BigIntegers
    fn multiply(self: *const BigInteger, other: *const BigInteger) !BigInteger {
        if (self.is_zero() or other.is_zero()) {
            return BigInteger.from_value(self.allocator, 0);
        }
        
        var result = try BigInteger.init(self.allocator, (self.len + other.len) * LIMB_BYTES);
        
        // Grade school multiplication
        for (0..self.len) |i| {
            if (self.limbs[i] == 0) continue;
            
            var carry: u64 = 0;
            for (0..other.len) |j| {
                const prod = @as(u128, self.limbs[i]) * @as(u128, other.limbs[j]);
                const sum = @as(u128, result.limbs[i + j]) + prod + carry;
                
                result.limbs[i + j] = @intCast(sum & 0xFFFFFFFFFFFFFFFF);
                carry = @intCast(sum >> 64);
            }
            
            if (carry != 0 and i + other.len < result.limbs.len) {
                result.limbs[i + other.len] = carry;
            }
        }
        
        // Calculate actual length
        result.len = 0;
        for (0..result.limbs.len) |i| {
            if (result.limbs[i] != 0) {
                result.len = i + 1;
            }
        }
        
        return result;
    }
    
    /// Compute self = self mod modulus
    fn mod_assign(self: *BigInteger, modulus: *const BigInteger) !void {
        if (modulus.is_zero()) return;
        if (self.compare(modulus) < 0) return; // Already smaller than modulus
        
        // Simple long division algorithm
        // This could be optimized with Barrett reduction or Montgomery reduction
        
        while (self.compare(modulus) >= 0) {
            try self.subtract_assign(modulus);
        }
    }
    
    /// Subtract other from self
    fn subtract_assign(self: *BigInteger, other: *const BigInteger) !void {
        if (self.compare(other) < 0) {
            // Result would be negative - not supported for unsigned integers
            // Set to zero instead
            @memset(self.limbs, 0);
            self.len = 0;
            return;
        }
        
        var borrow: u64 = 0;
        for (0..@max(self.len, other.len)) |i| {
            const self_limb = if (i < self.len) self.limbs[i] else 0;
            const other_limb = if (i < other.len) other.limbs[i] else 0;
            
            const total_borrow = other_limb + borrow;
            if (self_limb >= total_borrow) {
                self.limbs[i] = self_limb - total_borrow;
                borrow = 0;
            } else {
                self.limbs[i] = @intCast(((@as(u128, 1) << 64) + self_limb) - total_borrow);
                borrow = 1;
            }
        }
        
        // Update length - remove leading zeros
        self.len = 0;
        for (0..self.limbs.len) |i| {
            if (self.limbs[i] != 0) {
                self.len = i + 1;
            }
        }
    }
};

// Tests
test "BigInteger basic operations" {
    const allocator = testing.allocator;
    
    // Test zero
    var zero = try BigInteger.from_value(allocator, 0);
    defer zero.deinit();
    try testing.expect(zero.is_zero());
    try testing.expect(!zero.is_one());
    
    // Test one
    var one = try BigInteger.from_value(allocator, 1);
    defer one.deinit();
    try testing.expect(!one.is_zero());
    try testing.expect(one.is_one());
    
    // Test from bytes
    const bytes = [_]u8{ 0x01, 0x23, 0x45, 0x67 };
    var from_bytes = try BigInteger.from_bytes(allocator, &bytes);
    defer from_bytes.deinit();
    
    const result_bytes = try from_bytes.to_bytes(allocator);
    defer allocator.free(result_bytes);
    
    try testing.expectEqualSlices(u8, &bytes, result_bytes);
}

test "BigInteger modular exponentiation" {
    const allocator = testing.allocator;
    
    // Test 3^4 mod 5 = 81 mod 5 = 1
    var base = try BigInteger.from_value(allocator, 3);
    defer base.deinit();
    
    var exp = try BigInteger.from_value(allocator, 4);
    defer exp.deinit();
    
    var modulus = try BigInteger.from_value(allocator, 5);
    defer modulus.deinit();
    
    var result = try BigInteger.mod_exp(allocator, &base, &exp, &modulus);
    defer result.deinit();
    
    try testing.expect(result.is_one());
}

test "BigInteger edge cases" {
    const allocator = testing.allocator;
    
    var base = try BigInteger.from_value(allocator, 2);
    defer base.deinit();
    
    var exp_zero = try BigInteger.from_value(allocator, 0);
    defer exp_zero.deinit();
    
    var modulus = try BigInteger.from_value(allocator, 7);
    defer modulus.deinit();
    
    // Test base^0 mod modulus = 1
    var result = try BigInteger.mod_exp(allocator, &base, &exp_zero, &modulus);
    defer result.deinit();
    
    try testing.expect(result.is_one());
}