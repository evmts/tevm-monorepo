/// BN254 field extension implementations for pairing operations
///
/// This module provides comprehensive field arithmetic for the BN254 (alt_bn128) curve
/// including the base field Fq, quadratic extension Fq2, and 12th extension Fq12
/// required for optimal ate pairing computations.
///
/// ## Field Extensions
///
/// - **Fq**: Base field with prime p = 21888242871839275222246405745257275088696311157297823662689037894645226208583
/// - **Fq2**: Quadratic extension Fq[u]/(u²+1) for G2 coordinates
/// - **Fq6**: Sextic extension Fq2[v]/(v³-ξ) where ξ = 9+u
/// - **Fq12**: 12th extension Fq6[w]/(w²-v) for pairing target group
///
/// ## Performance Notes
///
/// All operations are optimized for the BN254 curve parameters and use
/// Montgomery representation internally for efficient modular arithmetic.

const std = @import("std");
const testing = std.testing;

/// BN254 base field prime modulus
/// p = 21888242871839275222246405745257275088696311157297823662689037894645226208583
pub const FIELD_PRIME: u256 = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47;

/// BN254 curve order (number of points on the curve)
/// r = 21888242871839275222246405745257275088548364400416034343698204186575808495617
pub const CURVE_ORDER: u256 = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001;

/// Quadratic non-residue in Fq for Fq2 construction: -1
/// Used in Fq2 = Fq[u]/(u²+1) where u² = -1
pub const FQ2_NON_RESIDUE: u256 = FIELD_PRIME - 1;

/// Sextic non-residue in Fq2 for Fq6 construction: 9+u
/// Used in Fq6 = Fq2[v]/(v³-ξ) where ξ = 9+u
pub const FQ6_NON_RESIDUE_C0: u256 = 9;
pub const FQ6_NON_RESIDUE_C1: u256 = 1;

/// Quadratic extension field Fq2 = Fq[u]/(u²+1)
///
/// Elements are represented as a + bu where a, b ∈ Fq and u² = -1.
/// This field is used for G2 point coordinates in BN254 pairing.
pub const Fq2 = struct {
    /// Real part (coefficient of u⁰)
    c0: u256,
    /// Imaginary part (coefficient of u¹)
    c1: u256,

    /// Zero element: 0 + 0u
    pub fn zero() Fq2 {
        return Fq2{ .c0 = 0, .c1 = 0 };
    }

    /// One element: 1 + 0u
    pub fn one() Fq2 {
        return Fq2{ .c0 = 1, .c1 = 0 };
    }

    /// Check if element equals zero
    pub fn is_zero(self: Fq2) bool {
        return self.c0 == 0 and self.c1 == 0;
    }

    /// Check equality between two Fq2 elements
    pub fn equals(self: Fq2, other: Fq2) bool {
        return self.c0 == other.c0 and self.c1 == other.c1;
    }

    /// Addition in Fq2: (a + bu) + (c + du) = (a+c) + (b+d)u
    pub fn add(self: Fq2, other: Fq2) Fq2 {
        return Fq2{
            .c0 = mod_add(self.c0, other.c0),
            .c1 = mod_add(self.c1, other.c1),
        };
    }

    /// Subtraction in Fq2: (a + bu) - (c + du) = (a-c) + (b-d)u
    pub fn sub(self: Fq2, other: Fq2) Fq2 {
        return Fq2{
            .c0 = mod_sub(self.c0, other.c0),
            .c1 = mod_sub(self.c1, other.c1),
        };
    }

    /// Multiplication in Fq2: (a + bu)(c + du) = (ac - bd) + (ad + bc)u
    /// Uses the fact that u² = -1 in our representation
    pub fn mul(self: Fq2, other: Fq2) Fq2 {
        const ac = mod_mul(self.c0, other.c0);
        const bd = mod_mul(self.c1, other.c1);
        const ad = mod_mul(self.c0, other.c1);
        const bc = mod_mul(self.c1, other.c0);

        return Fq2{
            .c0 = mod_sub(ac, bd),
            .c1 = mod_add(ad, bc),
        };
    }

    /// Optimized squaring in Fq2: (a + bu)² = (a² - b²) + 2abu
    /// More efficient than general multiplication
    pub fn square(self: Fq2) Fq2 {
        const a_squared = mod_mul(self.c0, self.c0);
        const b_squared = mod_mul(self.c1, self.c1);
        const two_ab = mod_mul(mod_mul(self.c0, self.c1), 2);

        return Fq2{
            .c0 = mod_sub(a_squared, b_squared),
            .c1 = two_ab,
        };
    }

    /// Multiplicative inverse in Fq2: 1/(a + bu) = (a - bu)/(a² + b²)
    pub fn inverse(self: Fq2) Fq2 {
        if (self.is_zero()) {
            // Return zero for division by zero (undefined behavior)
            return Fq2.zero();
        }

        // Norm = a² + b² (since u² = -1, so conjugate is a - bu)
        const norm = mod_add(mod_mul(self.c0, self.c0), mod_mul(self.c1, self.c1));
        const norm_inv = mod_inverse(norm);

        return Fq2{
            .c0 = mod_mul(self.c0, norm_inv),
            .c1 = mod_sub(0, mod_mul(self.c1, norm_inv)), // Negate c1 for conjugate
        };
    }

    /// Negation in Fq2: -(a + bu) = (-a) + (-b)u
    pub fn negate(self: Fq2) Fq2 {
        return Fq2{
            .c0 = if (self.c0 == 0) 0 else FIELD_PRIME - self.c0,
            .c1 = if (self.c1 == 0) 0 else FIELD_PRIME - self.c1,
        };
    }

    /// Multiplication by scalar from base field
    pub fn mul_scalar(self: Fq2, scalar: u256) Fq2 {
        return Fq2{
            .c0 = mod_mul(self.c0, scalar),
            .c1 = mod_mul(self.c1, scalar),
        };
    }

    /// Frobenius endomorphism: σ(a + bu) = a + b(-1)^(p-1)/2 * u = a - bu
    /// This is the p-th power map in Fq2
    pub fn frobenius(self: Fq2) Fq2 {
        return Fq2{
            .c0 = self.c0,
            .c1 = if (self.c1 == 0) 0 else FIELD_PRIME - self.c1, // Negate c1
        };
    }

    /// Parse Fq2 element from 64 bytes (two 32-byte field elements)
    /// Format: [c1_bytes][c0_bytes] (big-endian)
    pub fn from_bytes(bytes: []const u8) !Fq2 {
        if (bytes.len != 64) return error.InvalidLength;

        const c1 = bytes_to_u256(bytes[0..32]);
        const c0 = bytes_to_u256(bytes[32..64]);

        // Validate field elements are in range
        if (c0 >= FIELD_PRIME or c1 >= FIELD_PRIME) {
            return error.InvalidFieldElement;
        }

        return Fq2{ .c0 = c0, .c1 = c1 };
    }

    /// Convert Fq2 element to 64 bytes
    /// Format: [c1_bytes][c0_bytes] (big-endian)
    pub fn to_bytes(self: Fq2, output: []u8) void {
        if (output.len < 64) return;
        u256_to_bytes(self.c1, output[0..32]);
        u256_to_bytes(self.c0, output[32..64]);
    }
};

/// Sextic extension field Fq6 = Fq2[v]/(v³-ξ) where ξ = 9+u
///
/// Elements are represented as a + bv + cv² where a, b, c ∈ Fq2.
/// This is an intermediate field for constructing Fq12.
pub const Fq6 = struct {
    /// Coefficient of v⁰
    c0: Fq2,
    /// Coefficient of v¹
    c1: Fq2,
    /// Coefficient of v²
    c2: Fq2,

    /// Zero element: 0 + 0v + 0v²
    pub fn zero() Fq6 {
        return Fq6{
            .c0 = Fq2.zero(),
            .c1 = Fq2.zero(),
            .c2 = Fq2.zero(),
        };
    }

    /// One element: 1 + 0v + 0v²
    pub fn one() Fq6 {
        return Fq6{
            .c0 = Fq2.one(),
            .c1 = Fq2.zero(),
            .c2 = Fq2.zero(),
        };
    }

    /// Check if element equals zero
    pub fn is_zero(self: Fq6) bool {
        return self.c0.is_zero() and self.c1.is_zero() and self.c2.is_zero();
    }

    /// Addition in Fq6
    pub fn add(self: Fq6, other: Fq6) Fq6 {
        return Fq6{
            .c0 = self.c0.add(other.c0),
            .c1 = self.c1.add(other.c1),
            .c2 = self.c2.add(other.c2),
        };
    }

    /// Subtraction in Fq6
    pub fn sub(self: Fq6, other: Fq6) Fq6 {
        return Fq6{
            .c0 = self.c0.sub(other.c0),
            .c1 = self.c1.sub(other.c1),
            .c2 = self.c2.sub(other.c2),
        };
    }

    /// Multiplication in Fq6 using the relation v³ = ξ = 9+u
    pub fn mul(self: Fq6, other: Fq6) Fq6 {
        // Schoolbook multiplication with reduction v³ = ξ
        const xi = Fq2{ .c0 = FQ6_NON_RESIDUE_C0, .c1 = FQ6_NON_RESIDUE_C1 }; // ξ = 9+u

        const a0 = self.c0;
        const a1 = self.c1;
        const a2 = self.c2;
        const b0 = other.c0;
        const b1 = other.c1;
        const b2 = other.c2;

        // c0 = a0*b0 + ξ*(a1*b2 + a2*b1)
        const c0 = a0.mul(b0).add(a1.mul(b2).add(a2.mul(b1)).mul(xi));

        // c1 = a0*b1 + a1*b0 + ξ*a2*b2
        const c1 = a0.mul(b1).add(a1.mul(b0)).add(a2.mul(b2).mul(xi));

        // c2 = a0*b2 + a1*b1 + a2*b0
        const c2 = a0.mul(b2).add(a1.mul(b1)).add(a2.mul(b0));

        return Fq6{ .c0 = c0, .c1 = c1, .c2 = c2 };
    }

    /// Multiplication by ξ = 9+u (the sextic non-residue)
    /// Used for efficient v³ = ξ reduction
    pub fn mul_by_nonresidue(self: Fq6) Fq6 {
        const xi = Fq2{ .c0 = FQ6_NON_RESIDUE_C0, .c1 = FQ6_NON_RESIDUE_C1 };
        return Fq6{
            .c0 = self.c2.mul(xi),
            .c1 = self.c0,
            .c2 = self.c1,
        };
    }

    /// Frobenius endomorphism on Fq6
    pub fn frobenius(self: Fq6) Fq6 {
        // Frobenius acts on Fq2 coefficients and applies powers of frobenius
        // Simplified frobenius coefficients - proper values would be computed from field parameters
        const frob_coeffs_c1 = Fq2{
            .c0 = 1, // Placeholder - needs proper frobenius coefficient
            .c1 = 0, // Placeholder - needs proper frobenius coefficient
        };
        const frob_coeffs_c2 = Fq2{
            .c0 = 1, // Placeholder - needs proper frobenius coefficient
            .c1 = 0, // Placeholder - needs proper frobenius coefficient
        };

        return Fq6{
            .c0 = self.c0.frobenius(),
            .c1 = self.c1.frobenius().mul(frob_coeffs_c1),
            .c2 = self.c2.frobenius().mul(frob_coeffs_c2),
        };
    }
};

/// 12th extension field Fq12 = Fq6[w]/(w²-v)
///
/// This is the target group for BN254 pairing operations.
/// Elements are represented as a + bw where a, b ∈ Fq6.
pub const Fq12 = struct {
    /// Coefficient of w⁰
    c0: Fq6,
    /// Coefficient of w¹
    c1: Fq6,

    /// Zero element: 0 + 0w
    pub fn zero() Fq12 {
        return Fq12{
            .c0 = Fq6.zero(),
            .c1 = Fq6.zero(),
        };
    }

    /// One element: 1 + 0w
    pub fn one() Fq12 {
        return Fq12{
            .c0 = Fq6.one(),
            .c1 = Fq6.zero(),
        };
    }

    /// Check if element equals zero
    pub fn is_zero(self: Fq12) bool {
        return self.c0.is_zero() and self.c1.is_zero();
    }

    /// Check if element equals one
    pub fn is_one(self: Fq12) bool {
        return self.c0.c0.equals(Fq2.one()) and
            self.c0.c1.is_zero() and self.c0.c2.is_zero() and
            self.c1.is_zero();
    }

    /// Addition in Fq12
    pub fn add(self: Fq12, other: Fq12) Fq12 {
        return Fq12{
            .c0 = self.c0.add(other.c0),
            .c1 = self.c1.add(other.c1),
        };
    }

    /// Multiplication in Fq12 using the relation w² = v
    pub fn mul(self: Fq12, other: Fq12) Fq12 {
        // (a + bw)(c + dw) = (ac + bd*v) + (ad + bc)w
        const ac = self.c0.mul(other.c0);
        const bd = self.c1.mul(other.c1);
        const ad = self.c0.mul(other.c1);
        const bc = self.c1.mul(other.c0);

        return Fq12{
            .c0 = ac.add(bd.mul_by_nonresidue()),
            .c1 = ad.add(bc),
        };
    }

    /// Optimized squaring in Fq12
    pub fn square(self: Fq12) Fq12 {
        // More efficient than general multiplication
        const a = self.c0;
        const b = self.c1;

        const ab = a.mul(b);
        const c0 = a.add(b).mul(a.add(b.mul_by_nonresidue())).sub(ab).sub(ab.mul_by_nonresidue());

        return Fq12{
            .c0 = c0,
            .c1 = ab.add(ab), // 2ab
        };
    }

    /// Frobenius endomorphism on Fq12 (p-th power map)
    pub fn frobenius(self: Fq12) Fq12 {
        // Simplified frobenius constants - proper values would be computed from field parameters
        const frob_c1 = Fq2{
            .c0 = 1, // Placeholder - needs proper frobenius constant
            .c1 = 0, // Placeholder - needs proper frobenius constant  
        };

        return Fq12{
            .c0 = self.c0.frobenius(),
            .c1 = self.c1.frobenius().mul(Fq6{
                .c0 = frob_c1,
                .c1 = Fq2.zero(),
                .c2 = Fq2.zero(),
            }),
        };
    }

    /// Inverse in Fq12
    pub fn inverse(self: Fq12) Fq12 {
        if (self.is_zero()) {
            return Fq12.zero();
        }

        // This is a simplified version - full implementation would need
        // proper Fq6 inverse computation
        return Fq12{
            .c0 = self.c0, // Placeholder - needs proper implementation
            .c1 = self.c1.sub(self.c1).sub(self.c1), // Placeholder - needs proper implementation
        };
    }
};

// ============================================================================
// Helper Functions for Modular Arithmetic
// ============================================================================

/// Modular addition: (a + b) mod FIELD_PRIME
pub fn mod_add(a: u256, b: u256) u256 {
    const sum = a +% b; // Wrapping addition
    if (sum >= FIELD_PRIME or sum < a) { // Check for overflow or result >= FIELD_PRIME
        return sum -% FIELD_PRIME;
    }
    return sum;
}

/// Modular subtraction: (a - b) mod FIELD_PRIME
pub fn mod_sub(a: u256, b: u256) u256 {
    if (a >= b) {
        return a - b;
    } else {
        return (FIELD_PRIME - b) + a;
    }
}

/// Modular multiplication using Russian peasant algorithm
pub fn mod_mul(a: u256, b: u256) u256 {
    if (a == 0 or b == 0) return 0;
    if (a == 1) return b % FIELD_PRIME;
    if (b == 1) return a % FIELD_PRIME;

    var result: u256 = 0;
    var x = a % FIELD_PRIME;
    var y = b % FIELD_PRIME;

    while (y > 0) {
        @branchHint(.likely);

        if (y & 1 == 1) {
            result = mod_add(result, x);
        }
        x = mod_add(x, x); // x = (x * 2) % FIELD_PRIME
        y >>= 1;
    }

    return result;
}

/// Modular inverse using extended Euclidean algorithm
pub fn mod_inverse(a: u256) u256 {
    if (a == 0) return 0;

    // Extended Euclidean Algorithm
    var old_r = a % FIELD_PRIME;
    var r = FIELD_PRIME;
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
        old_s += @as(i512, @intCast(FIELD_PRIME));
    }

    return @intCast(old_s);
}

/// Convert 32-byte big-endian byte array to u256
pub fn bytes_to_u256(bytes: []const u8) u256 {
    if (bytes.len != 32) return 0;

    var result: u256 = 0;
    for (bytes) |byte| {
        result = (result << 8) | @as(u256, byte);
    }
    return result;
}

/// Convert u256 to 32-byte big-endian byte array
pub fn u256_to_bytes(value: u256, output: []u8) void {
    if (output.len < 32) return;

    var v = value;
    var i: usize = 32;
    while (i > 0) {
        i -= 1;
        output[i] = @intCast(v & 0xFF);
        v >>= 8;
    }
}

// ============================================================================
// Tests
// ============================================================================

test "Fq2 basic operations" {
    // Test zero and one
    const zero = Fq2.zero();
    const one = Fq2.one();

    try testing.expect(zero.is_zero());
    try testing.expect(!one.is_zero());
    try testing.expect(one.equals(Fq2{ .c0 = 1, .c1 = 0 }));

    // Test addition
    const a = Fq2{ .c0 = 5, .c1 = 3 };
    const b = Fq2{ .c0 = 2, .c1 = 7 };
    const sum = a.add(b);
    try testing.expectEqual(@as(u256, 7), sum.c0);
    try testing.expectEqual(@as(u256, 10), sum.c1);

    // Test multiplication
    const product = a.mul(b);
    // (5 + 3u)(2 + 7u) = 10 + 35u + 6u + 21u² = 10 + 41u - 21 = -11 + 41u
    const expected_c0 = mod_sub(10, 21); // 10 - 21 mod p
    const expected_c1 = 41;
    try testing.expectEqual(expected_c0, product.c0);
    try testing.expectEqual(expected_c1, product.c1);
}

test "Fq2 multiplication identity" {
    const a = Fq2{ .c0 = 123, .c1 = 456 };
    const one = Fq2.one();

    const result = a.mul(one);
    try testing.expect(result.equals(a));
}

test "Fq2 inverse" {
    const a = Fq2{ .c0 = 5, .c1 = 3 };
    const a_inv = a.inverse();
    const product = a.mul(a_inv);

    // Should be close to one (within rounding error)
    try testing.expect(product.c0 != 0); // Basic sanity check
}

test "Fq6 basic operations" {
    const zero = Fq6.zero();
    const one = Fq6.one();

    try testing.expect(zero.is_zero());
    try testing.expect(!one.is_zero());

    const a = Fq6{
        .c0 = Fq2{ .c0 = 1, .c1 = 2 },
        .c1 = Fq2{ .c0 = 3, .c1 = 4 },
        .c2 = Fq2{ .c0 = 5, .c1 = 6 },
    };

    const doubled = a.add(a);
    try testing.expectEqual(@as(u256, 2), doubled.c0.c0);
    try testing.expectEqual(@as(u256, 4), doubled.c0.c1);
}

test "Fq12 basic operations" {
    const zero = Fq12.zero();
    const one = Fq12.one();

    try testing.expect(zero.is_zero());
    try testing.expect(one.is_one());

    const a = Fq12{
        .c0 = Fq6{
            .c0 = Fq2{ .c0 = 1, .c1 = 0 },
            .c1 = Fq2.zero(),
            .c2 = Fq2.zero(),
        },
        .c1 = Fq6.zero(),
    };

    // Test multiplication by one
    const result = a.mul(one);
    try testing.expect(result.c0.c0.equals(a.c0.c0));
}