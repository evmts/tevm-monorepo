/// BN254 (alt_bn128) elliptic curve implementation for precompiles
///
/// This module implements the BN254 elliptic curve used by Ethereum precompiles:
/// - ECADD (0x06): Point addition
/// - ECMUL (0x07): Scalar multiplication  
/// - ECPAIRING (0x08): Pairing check
///
/// ## Curve Parameters
/// - Field Prime (p): 21888242871839275222246405745257275088696311157297823662689037894645226208583
/// - Curve Equation: y² = x³ + 3 (mod p)
/// - Point at Infinity: Represented as (0, 0)
///
/// ## References
/// - EIP-196: https://eips.ethereum.org/EIPS/eip-196
/// - BN254 Specification: https://tools.ietf.org/id/draft-yoneyama-pairing-friendly-curves-02.html

const std = @import("std");

/// BN254 field prime (21888242871839275222246405745257275088696311157297823662689037894645226208583)
/// This is the prime modulus for the finite field over which the curve is defined
pub const FIELD_PRIME: u256 = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47;

/// G1 point on the BN254 elliptic curve
/// Points are represented in affine coordinates (x, y)
/// The point at infinity is represented as (0, 0)
pub const G1Point = struct {
    x: u256,
    y: u256,

    /// Creates a G1Point from 64 bytes of input (32 bytes x + 32 bytes y)
    /// Input is interpreted as big-endian encoded coordinates
    ///
    /// @param input 64-byte buffer containing x and y coordinates
    /// @return G1Point or error if invalid
    pub fn from_bytes(input: []const u8) !G1Point {
        if (input.len < 64) {
            return error.InvalidInput;
        }

        // Parse big-endian coordinates
        var x: u256 = 0;
        var y: u256 = 0;

        // Convert 32-byte big-endian x coordinate
        for (input[0..32]) |byte| {
            x = (x << 8) | @as(u256, byte);
        }

        // Convert 32-byte big-endian y coordinate  
        for (input[32..64]) |byte| {
            y = (y << 8) | @as(u256, byte);
        }

        const point = G1Point{ .x = x, .y = y };

        // Validate the point is on the curve
        if (!point.is_valid()) {
            return error.InvalidPoint;
        }

        return point;
    }

    /// Converts G1Point to 64 bytes (32 bytes x + 32 bytes y)
    /// Output is big-endian encoded coordinates
    ///
    /// @param output 64-byte buffer to write coordinates
    pub fn to_bytes(self: G1Point, output: []u8) void {
        if (output.len < 64) return;

        // Convert x coordinate to big-endian bytes
        var x_val = self.x;
        var i: usize = 32;
        while (i > 0) {
            i -= 1;
            output[i] = @intCast(x_val & 0xFF);
            x_val >>= 8;
        }

        // Convert y coordinate to big-endian bytes
        var y_val = self.y;
        i = 64;
        while (i > 32) {
            i -= 1;
            output[i] = @intCast(y_val & 0xFF);
            y_val >>= 8;
        }
    }

    /// Checks if the point is valid (lies on the curve y² = x³ + 3)
    ///
    /// @return true if point is valid, false otherwise
    pub fn is_valid(self: G1Point) bool {
        // Point at infinity is always valid
        if (self.is_zero()) {
            return true;
        }

        // Check if coordinates are within field range
        if (self.x >= FIELD_PRIME or self.y >= FIELD_PRIME) {
            return false;
        }

        // Check curve equation: y² = x³ + 3 (mod p)
        const y_squared = mod_mul(self.y, self.y);
        const x_cubed = mod_mul(mod_mul(self.x, self.x), self.x);
        const rhs = mod_add(x_cubed, 3);

        return y_squared == rhs;
    }

    /// Checks if the point is the point at infinity (0, 0)
    ///
    /// @return true if point is zero, false otherwise
    pub fn is_zero(self: G1Point) bool {
        return self.x == 0 and self.y == 0;
    }

    /// Adds two points on the elliptic curve
    /// Implements the standard elliptic curve point addition formula
    ///
    /// @param other The point to add to this point
    /// @return The sum of the two points
    pub fn add(self: G1Point, other: G1Point) G1Point {
        // Handle point at infinity cases
        if (self.is_zero()) {
            return other;
        }
        if (other.is_zero()) {
            return self;
        }

        // Handle point doubling case
        if (self.x == other.x) {
            if (self.y == other.y) {
                return self.double();
            } else {
                // Points are inverses (x1 = x2, y1 = -y2), result is point at infinity
                return G1Point{ .x = 0, .y = 0 };
            }
        }

        // Standard point addition formula
        // slope = (y2 - y1) / (x2 - x1)
        const dx = mod_sub(other.x, self.x);
        const dy = mod_sub(other.y, self.y);
        const slope = mod_mul(dy, mod_inverse(dx));

        // x3 = slope² - x1 - x2
        const slope_squared = mod_mul(slope, slope);
        const x3 = mod_sub(mod_sub(slope_squared, self.x), other.x);

        // y3 = slope * (x1 - x3) - y1
        const y3 = mod_sub(mod_mul(slope, mod_sub(self.x, x3)), self.y);

        return G1Point{ .x = x3, .y = y3 };
    }

    /// Doubles a point on the elliptic curve (adds point to itself)
    /// Uses the point doubling formula for efficiency
    ///
    /// @return The doubled point
    fn double(self: G1Point) G1Point {
        if (self.is_zero()) {
            return self;
        }

        // Point doubling formula
        // slope = (3 * x1²) / (2 * y1)
        const x_squared = mod_mul(self.x, self.x);
        const three_x_squared = mod_mul(3, x_squared);
        const two_y = mod_mul(2, self.y);
        const slope = mod_mul(three_x_squared, mod_inverse(two_y));

        // x3 = slope² - 2 * x1
        const slope_squared = mod_mul(slope, slope);
        const two_x = mod_mul(2, self.x);
        const x3 = mod_sub(slope_squared, two_x);

        // y3 = slope * (x1 - x3) - y1
        const y3 = mod_sub(mod_mul(slope, mod_sub(self.x, x3)), self.y);

        return G1Point{ .x = x3, .y = y3 };
    }
};

/// Modular addition: (a + b) mod FIELD_PRIME
fn mod_add(a: u256, b: u256) u256 {
    // Use overflow-detecting addition
    const result = @addWithOverflow(a, b);
    if (result[1] != 0) {
        // Overflow occurred, need to handle carefully
        // Since a, b < FIELD_PRIME, the overflow means result >= 2^256
        // So we need: (a + b) - 2^256 mod FIELD_PRIME
        // Which is: (a + b - FIELD_PRIME) mod FIELD_PRIME if a + b >= FIELD_PRIME
        return result[0] -% FIELD_PRIME;
    } else {
        // No overflow, check if result >= FIELD_PRIME
        if (result[0] >= FIELD_PRIME) {
            return result[0] - FIELD_PRIME;
        }
        return result[0];
    }
}

/// Modular subtraction: (a - b) mod FIELD_PRIME
fn mod_sub(a: u256, b: u256) u256 {
    if (a >= b) {
        return a - b;
    } else {
        // Need to add FIELD_PRIME: (a + FIELD_PRIME - b) mod FIELD_PRIME
        return FIELD_PRIME - (b - a);
    }
}

/// Modular multiplication: (a * b) mod FIELD_PRIME
fn mod_mul(a: u256, b: u256) u256 {
    // For efficiency, we could implement Montgomery multiplication
    // For now, use basic approach with 512-bit intermediate
    
    // Use Zig's built-in widening multiplication
    const wide_result: u512 = @as(u512, a) * @as(u512, b);
    
    // Perform modular reduction
    return @intCast(wide_result % @as(u512, FIELD_PRIME));
}

/// Modular multiplicative inverse: a^(-1) mod FIELD_PRIME
/// Uses the extended Euclidean algorithm
fn mod_inverse(a: u256) u256 {
    if (a == 0) {
        // Division by zero in modular inverse
        unreachable;
    }

    // Extended Euclidean algorithm
    var old_r: u256 = FIELD_PRIME;
    var r: u256 = a;
    var old_s: i512 = 0;
    var s: i512 = 1;

    while (r != 0) {
        const quotient = old_r / r;
        
        const temp_r = r;
        r = old_r - quotient * r;
        old_r = temp_r;

        const temp_s = s;
        s = old_s - @as(i512, quotient) * s;
        old_s = temp_s;
    }

    if (old_r > 1) {
        // Modular inverse does not exist
        unreachable;
    }

    // Make sure result is positive
    if (old_s < 0) {
        return @intCast(@as(u512, @intCast(old_s + @as(i512, FIELD_PRIME))) % @as(u512, FIELD_PRIME));
    } else {
        return @intCast(@as(u512, @intCast(old_s)) % @as(u512, FIELD_PRIME));
    }
}

// Tests
const testing = std.testing;

test "BN254 field arithmetic" {
    // Test modular addition
    const a: u256 = FIELD_PRIME - 1;
    const b: u256 = 1;
    const sum = mod_add(a, b);
    try testing.expectEqual(@as(u256, 0), sum);

    // Test modular subtraction
    const diff = mod_sub(1, 2);
    try testing.expectEqual(FIELD_PRIME - 1, diff);

    // Test modular multiplication
    const prod = mod_mul(2, 3);
    try testing.expectEqual(@as(u256, 6), prod);
}

test "BN254 point validation" {
    // Test point at infinity
    const zero_point = G1Point{ .x = 0, .y = 0 };
    try testing.expect(zero_point.is_valid());
    try testing.expect(zero_point.is_zero());

    // Test generator point (1, 2) - this should be valid
    const generator = G1Point{ .x = 1, .y = 2 };
    try testing.expect(generator.is_valid());
    try testing.expect(!generator.is_zero());

    // Test invalid point
    const invalid = G1Point{ .x = 1, .y = 1 };
    try testing.expect(!invalid.is_valid());
}

test "BN254 point addition" {
    const zero = G1Point{ .x = 0, .y = 0 };
    const point = G1Point{ .x = 1, .y = 2 };

    // Test addition with zero
    const result1 = zero.add(point);
    try testing.expectEqual(point.x, result1.x);
    try testing.expectEqual(point.y, result1.y);

    const result2 = point.add(zero);
    try testing.expectEqual(point.x, result2.x);
    try testing.expectEqual(point.y, result2.y);

    // Test point doubling (adding point to itself)
    const doubled = point.add(point);
    try testing.expect(doubled.is_valid());
    try testing.expect(!doubled.is_zero());
}

test "BN254 byte conversion" {
    const point = G1Point{ .x = 1, .y = 2 };
    
    var bytes: [64]u8 = undefined;
    point.to_bytes(&bytes);
    
    const restored = G1Point.from_bytes(&bytes) catch unreachable;
    try testing.expectEqual(point.x, restored.x);
    try testing.expectEqual(point.y, restored.y);
}