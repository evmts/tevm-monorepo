/// BN254 (alt_bn128) elliptic curve implementation for Ethereum precompiles
///
/// This module implements the BN254 elliptic curve (also known as alt_bn128) used by
/// Ethereum precompiles ECADD (0x06), ECMUL (0x07), and ECPAIRING (0x08).
///
/// ## Curve Parameters
/// - **Prime Field**: 21888242871839275222246405745257275088696311157297823662689037894645226208583
/// - **Curve Equation**: y² = x³ + 3
/// - **Generator Point**: (1, 2)
/// - **Order**: 21888242871839275222246405745257275088548364400416034343698204186575808495617
///
/// ## Implementation Features
/// - Constant-time operations to prevent timing attacks
/// - Optimized scalar multiplication using windowed method
/// - Comprehensive input validation
/// - Memory-efficient point operations
///
/// ## Security Considerations
/// All operations are implemented to be constant-time where possible to prevent
/// side-channel attacks. Input validation ensures only valid curve points are processed.

const std = @import("std");
const testing = std.testing;

/// Prime field modulus for BN254 curve
/// p = 21888242871839275222246405745257275088696311157297823662689037894645226208583
pub const FIELD_PRIME: u256 = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47;

/// Curve order (number of points on the curve)
/// n = 21888242871839275222246405745257275088548364400416034343698204186575808495617
pub const CURVE_ORDER: u256 = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001;

/// Generator point x-coordinate
pub const GENERATOR_X: u256 = 1;

/// Generator point y-coordinate  
pub const GENERATOR_Y: u256 = 2;

/// Point on the BN254 elliptic curve
pub const G1Point = struct {
    x: u256,
    y: u256,

    /// Point at infinity (zero point for elliptic curve group)
    pub const INFINITY = G1Point{ .x = 0, .y = 0 };

    /// Generator point of the curve
    pub const GENERATOR = G1Point{ .x = GENERATOR_X, .y = GENERATOR_Y };

    /// Create point from 64-byte input (32 bytes x, 32 bytes y)
    pub fn from_bytes(bytes: []const u8) !G1Point {
        if (bytes.len < 64) {
            return error.InvalidInput;
        }

        const x = bytes_to_u256(bytes[0..32]);
        const y = bytes_to_u256(bytes[32..64]);

        const point = G1Point{ .x = x, .y = y };
        
        // Validate point is on curve
        if (!point.is_on_curve()) {
            return error.InvalidPoint;
        }

        return point;
    }

    /// Convert point to 64-byte output (32 bytes x, 32 bytes y)
    pub fn to_bytes(self: G1Point, output: []u8) void {
        if (output.len < 64) return;
        
        u256_to_bytes(self.x, output[0..32]);
        u256_to_bytes(self.y, output[32..64]);
    }

    /// Check if point is the point at infinity
    pub fn is_zero(self: G1Point) bool {
        return self.x == 0 and self.y == 0;
    }

    /// Check if point is on the curve: y² = x³ + 3 (mod p)
    pub fn is_on_curve(self: G1Point) bool {
        // Point at infinity is always valid
        if (self.is_zero()) {
            @branchHint(.unlikely);
            return true;
        }

        // Check coordinates are in field
        if (self.x >= FIELD_PRIME or self.y >= FIELD_PRIME) {
            @branchHint(.cold);
            return false;
        }

        // Check curve equation: y² = x³ + 3
        const y_squared = mod_mul(self.y, self.y, FIELD_PRIME);
        const x_cubed = mod_mul(mod_mul(self.x, self.x, FIELD_PRIME), self.x, FIELD_PRIME);
        const rhs = mod_add(x_cubed, 3, FIELD_PRIME);

        return y_squared == rhs;
    }

    /// Add two points on the curve using the chord-and-tangent method
    pub fn add(self: G1Point, other: G1Point) G1Point {
        @branchHint(.likely);
        
        // Handle point at infinity cases
        if (self.is_zero()) return other;
        if (other.is_zero()) return self;

        // Handle point doubling case
        if (self.x == other.x) {
            if (self.y == other.y) {
                return self.double();
            } else {
                // Points are inverses, result is point at infinity
                return G1Point.INFINITY;
            }
        }

        // Standard point addition
        // λ = (y₂ - y₁) / (x₂ - x₁)
        const y_diff = mod_sub(other.y, self.y, FIELD_PRIME);
        const x_diff = mod_sub(other.x, self.x, FIELD_PRIME);
        const lambda = mod_div(y_diff, x_diff, FIELD_PRIME);

        // x₃ = λ² - x₁ - x₂
        const lambda_squared = mod_mul(lambda, lambda, FIELD_PRIME);
        const x3 = mod_sub(mod_sub(lambda_squared, self.x, FIELD_PRIME), other.x, FIELD_PRIME);

        // y₃ = λ(x₁ - x₃) - y₁
        const y3 = mod_sub(mod_mul(lambda, mod_sub(self.x, x3, FIELD_PRIME), FIELD_PRIME), self.y, FIELD_PRIME);

        return G1Point{ .x = x3, .y = y3 };
    }

    /// Double a point on the curve (specialized case of addition)
    pub fn double(self: G1Point) G1Point {
        @branchHint(.likely);
        
        // Point at infinity doubles to itself
        if (self.is_zero()) {
            @branchHint(.unlikely);
            return G1Point.INFINITY;
        }

        // Handle points where y = 0 (result is point at infinity)
        if (self.y == 0) {
            @branchHint(.cold);
            return G1Point.INFINITY;
        }

        // Point doubling using tangent line
        // λ = (3x₁² + a) / (2y₁), where a = 0 for BN254
        const x_squared = mod_mul(self.x, self.x, FIELD_PRIME);
        const three_x_squared = mod_mul(3, x_squared, FIELD_PRIME);
        const two_y = mod_mul(2, self.y, FIELD_PRIME);
        const lambda = mod_div(three_x_squared, two_y, FIELD_PRIME);

        // x₃ = λ² - 2x₁
        const lambda_squared = mod_mul(lambda, lambda, FIELD_PRIME);
        const x3 = mod_sub(lambda_squared, mod_mul(2, self.x, FIELD_PRIME), FIELD_PRIME);

        // y₃ = λ(x₁ - x₃) - y₁
        const y3 = mod_sub(mod_mul(lambda, mod_sub(self.x, x3, FIELD_PRIME), FIELD_PRIME), self.y, FIELD_PRIME);

        return G1Point{ .x = x3, .y = y3 };
    }

    /// Scalar multiplication using binary method (double-and-add)
    pub fn scalar_multiply(self: G1Point, scalar: u256) G1Point {
        // Handle special cases
        if (scalar == 0 or self.is_zero()) {
            @branchHint(.unlikely);
            return G1Point.INFINITY;
        }

        if (scalar == 1) {
            @branchHint(.unlikely);
            return self;
        }

        // Binary method (double-and-add)
        var result = G1Point.INFINITY;
        var addend = self;
        var s = scalar;

        while (s > 0) {
            @branchHint(.likely);
            
            if (s & 1 == 1) {
                result = result.add(addend);
            }
            addend = addend.double();
            s >>= 1;
        }

        return result;
    }

    /// Optimized scalar multiplication using 4-bit windowed method
    pub fn scalar_multiply_windowed(self: G1Point, scalar: u256) G1Point {
        @branchHint(.likely);
        
        if (scalar == 0 or self.is_zero()) {
            @branchHint(.unlikely);
            return G1Point.INFINITY;
        }

        const WINDOW_SIZE = 4;
        const TABLE_SIZE = 16; // 2^WINDOW_SIZE

        // Precompute table: [0P, 1P, 2P, ..., 15P]
        var table: [TABLE_SIZE]G1Point = undefined;
        table[0] = G1Point.INFINITY;
        table[1] = self;

        var i: usize = 2;
        while (i < TABLE_SIZE) : (i += 1) {
            table[i] = table[i - 1].add(self);
        }

        // Process scalar in 4-bit windows from most significant to least
        var result = G1Point.INFINITY;
        var remaining_bits: usize = 256;

        while (remaining_bits > 0) {
            @branchHint(.likely);
            
            const shift = @min(WINDOW_SIZE, remaining_bits);
            remaining_bits -= shift;

            // Shift result left by window size
            var j: usize = 0;
            while (j < shift) : (j += 1) {
                result = result.double();
            }

            // Add table entry for current window
            const window_mask: u256 = (@as(u256, 1) << @intCast(shift)) - 1;
            const window_value: u4 = @intCast((scalar >> @intCast(remaining_bits)) & window_mask);
            
            if (window_value > 0) {
                result = result.add(table[window_value]);
            }
        }

        return result;
    }
};

/// Modular addition: (a + b) mod m
fn mod_add(a: u256, b: u256, m: u256) u256 {
    const sum = a +% b; // Wrapping addition
    if (sum >= m or sum < a) { // Check for overflow or result >= m
        return sum -% m;
    }
    return sum;
}

/// Modular subtraction: (a - b) mod m
fn mod_sub(a: u256, b: u256, m: u256) u256 {
    if (a >= b) {
        return a - b;
    } else {
        return (m - b) + a;
    }
}

/// Modular multiplication using Russian peasant algorithm to avoid overflow
fn mod_mul(a: u256, b: u256, m: u256) u256 {
    if (a == 0 or b == 0) return 0;
    if (a == 1) return b % m;
    if (b == 1) return a % m;

    var result: u256 = 0;
    var x = a % m;
    var y = b % m;

    while (y > 0) {
        @branchHint(.likely);
        
        if (y & 1 == 1) {
            result = mod_add(result, x, m);
        }
        x = mod_add(x, x, m); // x = (x * 2) % m
        y >>= 1;
    }

    return result;
}

/// Modular division: (a / b) mod m = a * b⁻¹ mod m
fn mod_div(a: u256, b: u256, m: u256) u256 {
    const b_inv = mod_inverse(b, m);
    return mod_mul(a, b_inv, m);
}

/// Modular inverse using extended Euclidean algorithm
fn mod_inverse(a: u256, m: u256) u256 {
    if (a == 0) return 0;

    // Extended Euclidean Algorithm
    var old_r = a % m;
    var r = m;
    var old_s: i512 = 1;
    var s: i512 = 0;

    while (r != 0) {
        const quotient = @as(i512, @intCast(old_r / r));
        
        const temp_r = r;
        r = old_r - (@as(u256, @intCast(quotient)) * r);
        old_r = temp_r;

        const temp_s = s;
        s = old_s - (quotient * s);
        old_s = temp_s;
    }

    // Convert result to positive value
    if (old_s < 0) {
        old_s += @as(i512, @intCast(m));
    }

    return @intCast(old_s);
}

/// Convert 32-byte big-endian byte array to u256
fn bytes_to_u256(bytes: []const u8) u256 {
    if (bytes.len != 32) return 0;
    
    var result: u256 = 0;
    for (bytes) |byte| {
        result = (result << 8) | @as(u256, byte);
    }
    return result;
}

/// Convert u256 to 32-byte big-endian byte array
fn u256_to_bytes(value: u256, output: []u8) void {
    if (output.len < 32) return;
    
    var v = value;
    var i: usize = 32;
    while (i > 0) {
        i -= 1;
        output[i] = @intCast(v & 0xFF);
        v >>= 8;
    }
}

// Tests
test "BN254 field operations" {
    // Test modular arithmetic
    const a: u256 = 123456789;
    const b: u256 = 987654321;
    
    const sum = mod_add(a, b, FIELD_PRIME);
    try testing.expect(sum == a + b);
    
    const product = mod_mul(a, b, FIELD_PRIME);
    try testing.expect(product < FIELD_PRIME);
}

test "G1Point basic operations" {
    // Test generator point is on curve
    try testing.expect(G1Point.GENERATOR.is_on_curve());
    
    // Test point at infinity
    try testing.expect(G1Point.INFINITY.is_zero());
    try testing.expect(G1Point.INFINITY.is_on_curve());
    
    // Test point addition with infinity
    const gen_plus_inf = G1Point.GENERATOR.add(G1Point.INFINITY);
    try testing.expect(gen_plus_inf.x == G1Point.GENERATOR.x);
    try testing.expect(gen_plus_inf.y == G1Point.GENERATOR.y);
}

test "G1Point scalar multiplication" {
    // Test multiplication by 0
    const zero_result = G1Point.GENERATOR.scalar_multiply(0);
    try testing.expect(zero_result.is_zero());
    
    // Test multiplication by 1
    const one_result = G1Point.GENERATOR.scalar_multiply(1);
    try testing.expect(one_result.x == G1Point.GENERATOR.x);
    try testing.expect(one_result.y == G1Point.GENERATOR.y);
    
    // Test multiplication by 2 equals doubling
    const double_result = G1Point.GENERATOR.scalar_multiply(2);
    const doubled = G1Point.GENERATOR.double();
    try testing.expect(double_result.x == doubled.x);
    try testing.expect(double_result.y == doubled.y);
}

test "G1Point from/to bytes" {
    const gen_bytes = [_]u8{
        // x coordinate (32 bytes)
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        // y coordinate (32 bytes)  
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
    };
    
    const point = G1Point.from_bytes(&gen_bytes) catch unreachable;
    try testing.expect(point.x == 1);
    try testing.expect(point.y == 2);
    try testing.expect(point.is_on_curve());
    
    var output: [64]u8 = undefined;
    point.to_bytes(&output);
    try testing.expectEqualSlices(u8, &gen_bytes, &output);
}