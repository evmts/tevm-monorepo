const std = @import("std");
const common = @import("common.zig");
const params = @import("params.zig");
const PrecompiledContract = common.PrecompiledContract;

// Errors
const BLS12381InputEmptyError = error.BLS12381InputEmpty;
const BLS12381InvalidInputLengthError = error.BLS12381InvalidInputLength;
const BLS12381FpNotInFieldError = error.BLS12381FpNotInField;
const BLS12381PointNotOnCurveError = error.BLS12381PointNotOnCurve;
const BLS12381G1PointSubgroupError = error.BLS12381G1PointSubgroup;
const BLS12381G2PointSubgroupError = error.BLS12381G2PointSubgroup;

const BLS12381_FIELD_SIZE: usize = 48; // 384 bits
const BLS12381_G1_POINT_SIZE: usize = 128; // 2 field elements each 64 bytes (padded from 48)
const BLS12381_G2_POINT_SIZE: usize = 256; // 4 field elements each 64 bytes (padded from 48)

// BLS12-381 G1 addition precompiled contract
pub const G1Add = PrecompiledContract{
    .requiredGas = g1AddRequiredGas,
    .run = g1AddRun,
};

// BLS12-381 G1 scalar multiplication precompiled contract
pub const G1MultiExp = PrecompiledContract{
    .requiredGas = g1MultiExpRequiredGas,
    .run = g1MultiExpRun,
};

// BLS12-381 G2 addition precompiled contract
pub const G2Add = PrecompiledContract{
    .requiredGas = g2AddRequiredGas,
    .run = g2AddRun,
};

// BLS12-381 G2 scalar multiplication precompiled contract
pub const G2MultiExp = PrecompiledContract{
    .requiredGas = g2MultiExpRequiredGas,
    .run = g2MultiExpRun,
};

// BLS12-381 pairing check precompiled contract
pub const Pairing = PrecompiledContract{
    .requiredGas = pairingRequiredGas,
    .run = pairingRun,
};

// BLS12-381 map to G1 precompiled contract
pub const MapG1 = PrecompiledContract{
    .requiredGas = mapG1RequiredGas,
    .run = mapG1Run,
};

// BLS12-381 map to G2 precompiled contract
pub const MapG2 = PrecompiledContract{
    .requiredGas = mapG2RequiredGas,
    .run = mapG2Run,
};

// Implementation of gas calculation functions

fn g1AddRequiredGas(input: []const u8) u64 {
    _ = input;
    return params.Bls12381G1AddGas;
}

fn g1MultiExpRequiredGas(input: []const u8) u64 {
    // Calculate G1 point, scalar value pair length
    const k = input.len / 160;
    if (k == 0) {
        // Return 0 gas for small input length
        return 0;
    }
    
    // Lookup discount value for G1 point, scalar value pair length
    var discount: u64 = 0;
    if (k <= params.Bls12381G1MultiExpDiscountTable.len) {
        discount = params.Bls12381G1MultiExpDiscountTable[k - 1];
    } else {
        discount = params.Bls12381G1MultiExpDiscountTable[params.Bls12381G1MultiExpDiscountTable.len - 1];
    }
    
    // Calculate gas and return the result
    return (k * params.Bls12381G1MulGas * discount) / 1000;
}

fn g2AddRequiredGas(input: []const u8) u64 {
    _ = input;
    return params.Bls12381G2AddGas;
}

fn g2MultiExpRequiredGas(input: []const u8) u64 {
    // Calculate G2 point, scalar value pair length
    const k = input.len / 288;
    if (k == 0) {
        // Return 0 gas for small input length
        return 0;
    }
    
    // Lookup discount value for G2 point, scalar value pair length
    var discount: u64 = 0;
    if (k <= params.Bls12381G2MultiExpDiscountTable.len) {
        discount = params.Bls12381G2MultiExpDiscountTable[k - 1];
    } else {
        discount = params.Bls12381G2MultiExpDiscountTable[params.Bls12381G2MultiExpDiscountTable.len - 1];
    }
    
    // Calculate gas and return the result
    return (k * params.Bls12381G2MulGas * discount) / 1000;
}

fn pairingRequiredGas(input: []const u8) u64 {
    return params.Bls12381PairingBaseGas + input.len / 384 * params.Bls12381PairingPerPairGas;
}

fn mapG1RequiredGas(input: []const u8) u64 {
    _ = input;
    return params.Bls12381MapG1Gas;
}

fn mapG2RequiredGas(input: []const u8) u64 {
    _ = input;
    return params.Bls12381MapG2Gas;
}

// Implementation of execution functions

// Validates that a BLS12-381 G1 point is correctly encoded and on the curve.
// Returns an error if not valid.
fn validateG1Point(input: []const u8) !void {
    if (input.len != BLS12381_G1_POINT_SIZE) {
        return BLS12381InvalidInputLengthError;
    }
    
    // Check if this is the point at infinity
    var is_infinity = true;
    for (input) |byte| {
        if (byte != 0) {
            is_infinity = false;
            break;
        }
    }
    
    if (is_infinity) {
        return; // Point at infinity is valid
    }
    
    // Check that the encoding is valid:
    // - First 16 bytes of each coordinate must be zero
    for (0..16) |i| {
        if (input[i] != 0 or input[64 + i] != 0) {
            return BLS12381FpNotInFieldError;
        }
    }
    
    // In a real implementation, we would check if the point is on the curve
    // using a BLS12-381 library. For now, we assume it is.

    // TODO: Add curve validation check
    // TODO: Add subgroup check if required
}

// Validates that a BLS12-381 G2 point is correctly encoded and on the curve.
// Returns an error if not valid.
fn validateG2Point(input: []const u8) !void {
    if (input.len != BLS12381_G2_POINT_SIZE) {
        return BLS12381InvalidInputLengthError;
    }
    
    // Check if this is the point at infinity
    var is_infinity = true;
    for (input) |byte| {
        if (byte != 0) {
            is_infinity = false;
            break;
        }
    }
    
    if (is_infinity) {
        return; // Point at infinity is valid
    }
    
    // Check that the encoding is valid:
    // - First 16 bytes of each coordinate must be zero
    for (0..16) |i| {
        if (input[i] != 0 or input[64 + i] != 0 or 
            input[128 + i] != 0 or input[192 + i] != 0) {
            return BLS12381FpNotInFieldError;
        }
    }
    
    // In a real implementation, we would check if the point is on the curve
    // using a BLS12-381 library. For now, we assume it is.

    // TODO: Add curve validation check
    // TODO: Add subgroup check if required
}

// Validates a field element
fn validateFieldElement(input: []const u8) !void {
    if (input.len != 64) {
        return BLS12381InvalidInputLengthError;
    }
    
    // Check that the encoding is valid:
    // - First 16 bytes must be zero
    for (0..16) |i| {
        if (input[i] != 0) {
            return BLS12381FpNotInFieldError;
        }
    }
    
    // TODO: Check if the element is in the field (less than field modulus)
}

// Main implementation of the G1 addition operation
fn g1AddRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // Implements EIP-2537 G1Add precompile.
    // G1 addition call expects `256` bytes as an input that is interpreted as byte concatenation of two G1 points (`128` bytes each).
    // Output is an encoding of addition operation result - single G1 point (`128` bytes).
    
    if (input.len != 256) {
        return BLS12381InvalidInputLengthError;
    }
    
    // Validate both points
    try validateG1Point(input[0..128]);
    try validateG1Point(input[128..256]);
    
    // In a real implementation, we would use the BLS12-381 library to add the points
    // For now we have a placeholder that checks for certain cases:
    
    // Check if first point is infinity
    var first_is_infinity = true;
    for (input[0..128]) |byte| {
        if (byte != 0) {
            first_is_infinity = false;
            break;
        }
    }
    
    // Check if second point is infinity
    var second_is_infinity = true;
    for (input[128..256]) |byte| {
        if (byte != 0) {
            second_is_infinity = false;
            break;
        }
    }
    
    const result = try allocator.alloc(u8, 128);
    
    // If both points are infinity, return infinity
    if (first_is_infinity and second_is_infinity) {
        @memset(result, 0);
        return result;
    }
    
    // If first point is infinity, return second point
    if (first_is_infinity) {
        @memcpy(result, input[128..256]);
        return result;
    }
    
    // If second point is infinity, return first point
    if (second_is_infinity) {
        @memcpy(result, input[0..128]);
        return result;
    }
    
    // Otherwise, we should add the points using a BLS12-381 library
    // For now we return a placeholder result
    
    // TODO: Replace with actual point addition implementation using a BLS12-381 library
    @memcpy(result, input[0..128]); // Just return the first point as a placeholder
    
    return result;
}

fn g1MultiExpRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // Implements EIP-2537 G1MultiExp precompile.
    // G1 multiplication call expects `160*k` bytes as an input that is interpreted as byte concatenation of `k` slices
    // each of them being a byte concatenation of encoding of G1 point (`128` bytes) and encoding of a scalar value (`32` bytes).
    // Output is an encoding of multiexponentiation operation result - single G1 point (`128` bytes).
    
    const k = input.len / 160;
    if (input.len == 0 or input.len % 160 != 0) {
        return BLS12381InvalidInputLengthError;
    }
    
    // Validate all points and scalars
    var i: usize = 0;
    while (i < k) : (i += 1) {
        const offset = i * 160;
        try validateG1Point(input[offset .. offset + 128]);
        // Scalars don't need validation beyond length check
    }
    
    // In a real implementation, use BLS12-381 library for multi-exponentiation
    // For now, create a placeholder result
    const result = try allocator.alloc(u8, 128);
    @memset(result, 0);
    
    // TODO: Replace with actual multi-exponentiation implementation

    return result;
}

fn g2AddRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // Implements EIP-2537 G2Add precompile.
    // G2 addition call expects `512` bytes as an input that is interpreted as byte concatenation of two G2 points (`256` bytes each).
    // Output is an encoding of addition operation result - single G2 point (`256` bytes).
    
    if (input.len != 512) {
        return BLS12381InvalidInputLengthError;
    }
    
    // Validate both points
    try validateG2Point(input[0..256]);
    try validateG2Point(input[256..512]);
    
    // In a real implementation, we would use the BLS12-381 library to add the points
    // For now we have a placeholder that checks for certain cases:
    
    // Check if first point is infinity
    var first_is_infinity = true;
    for (input[0..256]) |byte| {
        if (byte != 0) {
            first_is_infinity = false;
            break;
        }
    }
    
    // Check if second point is infinity
    var second_is_infinity = true;
    for (input[256..512]) |byte| {
        if (byte != 0) {
            second_is_infinity = false;
            break;
        }
    }
    
    const result = try allocator.alloc(u8, 256);
    
    // If both points are infinity, return infinity
    if (first_is_infinity and second_is_infinity) {
        @memset(result, 0);
        return result;
    }
    
    // If first point is infinity, return second point
    if (first_is_infinity) {
        @memcpy(result, input[256..512]);
        return result;
    }
    
    // If second point is infinity, return first point
    if (second_is_infinity) {
        @memcpy(result, input[0..256]);
        return result;
    }
    
    // Otherwise, we should add the points using a BLS12-381 library
    // For now we return a placeholder result
    
    // TODO: Replace with actual point addition implementation using a BLS12-381 library
    @memcpy(result, input[0..256]); // Just return the first point as a placeholder
    
    return result;
}

fn g2MultiExpRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // Implements EIP-2537 G2MultiExp precompile logic.
    // G2 multiplication call expects `288*k` bytes as an input that is interpreted as byte concatenation of `k` slices
    // each of them being a byte concatenation of encoding of G2 point (`256` bytes) and encoding of a scalar value (`32` bytes).
    // Output is an encoding of multiexponentiation operation result - single G2 point (`256` bytes).
    
    const k = input.len / 288;
    if (input.len == 0 or input.len % 288 != 0) {
        return BLS12381InvalidInputLengthError;
    }
    
    // Validate all points and scalars
    var i: usize = 0;
    while (i < k) : (i += 1) {
        const offset = i * 288;
        try validateG2Point(input[offset .. offset + 256]);
        // Scalars don't need validation beyond length check
    }
    
    // In a real implementation, use BLS12-381 library for multi-exponentiation
    // For now, create a placeholder result
    const result = try allocator.alloc(u8, 256);
    @memset(result, 0);
    
    // TODO: Replace with actual multi-exponentiation implementation

    return result;
}

fn pairingRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // Implements EIP-2537 Pairing precompile logic.
    // Pairing call expects `384*k` bytes as an inputs that is interpreted as byte concatenation of `k` slices. 
    // Each slice has the following structure:
    // - `128` bytes of G1 point encoding
    // - `256` bytes of G2 point encoding
    // Output is a `32` bytes where last single byte is `0x01` if pairing result is equal to multiplicative identity 
    // in a pairing target field and `0x00` otherwise.
    
    // Special case: empty input means empty product, which is identity (returns 1)
    if (input.len == 0) {
        const result = try allocator.alloc(u8, 32);
        @memset(result, 0);
        result[31] = 1; // Empty product equals identity (1)
        return result;
    }
    
    // For non-empty input, validate length is multiple of 384
    if (input.len % 384 != 0) {
        return BLS12381InvalidInputLengthError;
    }
    
    const k = input.len / 384;
    
    // Validate all point pairs
    var i: usize = 0;
    while (i < k) : (i += 1) {
        const offset = i * 384;
        try validateG1Point(input[offset .. offset + 128]);
        try validateG2Point(input[offset + 128 .. offset + 384]);
    }
    
    // In a real implementation, compute the pairing check using a BLS12-381 library
    const result = try allocator.alloc(u8, 32);
    @memset(result, 0);
    
    // We need to verify: e(p1, q1) * e(p2, q2) * ... * e(pk, qk) == 1
    // For now, just return success (1) as placeholder
    result[31] = 1;
    
    // TODO: Replace with actual pairing implementation
    
    return result;
}

fn mapG1Run(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // Implements EIP-2537 Map_To_G1 precompile.
    // Field-to-curve call expects an `64` bytes input that is interpreted as an element of the base field.
    // Output of this call is `128` bytes and is G1 point following respective encoding rules.
    
    if (input.len != 64) {
        return BLS12381InvalidInputLengthError;
    }
    
    // Validate the field element
    try validateFieldElement(input);
    
    // Map the field element to a G1 point
    // For now, create a placeholder result (a valid G1 point)
    const result = try allocator.alloc(u8, 128);
    @memset(result, 0);
    
    // TODO: Replace with actual field-to-curve mapping implementation
    
    return result;
}

fn mapG2Run(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // Implements EIP-2537 Map_FP2_TO_G2 precompile logic.
    // Field-to-curve call expects an `128` bytes input that is interpreted as an element of the quadratic extension field.
    // Output of this call is `256` bytes and is G2 point following respective encoding rules.
    
    if (input.len != 128) {
        return BLS12381InvalidInputLengthError;
    }
    
    // Validate both field elements
    try validateFieldElement(input[0..64]);
    try validateFieldElement(input[64..128]);
    
    // Map the field element to a G2 point
    // For now, create a placeholder result (a valid G2 point)
    const result = try allocator.alloc(u8, 256);
    @memset(result, 0);
    
    // TODO: Replace with actual field-to-curve mapping implementation
    
    return result;
}

// Test for BLS12-381 precompiled contracts
test "BLS12-381 G1 addition gas cost" {
    const input = [_]u8{0} ** 256;
    const gas = g1AddRequiredGas(&input);
    try std.testing.expectEqual(params.Bls12381G1AddGas, gas);
}

test "BLS12-381 G2 addition gas cost" {
    const input = [_]u8{0} ** 512;
    const gas = g2AddRequiredGas(&input);
    try std.testing.expectEqual(params.Bls12381G2AddGas, gas);
}

test "BLS12-381 pairing gas cost" {
    const input = [_]u8{0} ** 384;
    const gas = pairingRequiredGas(&input);
    try std.testing.expectEqual(params.Bls12381PairingBaseGas + params.Bls12381PairingPerPairGas, gas);
}

test "BLS12-381 multi-exponentiation discount" {
    // Test G1 multi-exponentiation discount table
    {
        const input = [_]u8{0} ** 160;
        const gas = g1MultiExpRequiredGas(&input);
        const expected = (params.Bls12381G1MulGas * params.Bls12381G1MultiExpDiscountTable[0]) / 1000;
        try std.testing.expectEqual(expected, gas);
    }

    // Test G2 multi-exponentiation discount table
    {
        const input = [_]u8{0} ** 288;
        const gas = g2MultiExpRequiredGas(&input);
        const expected = (params.Bls12381G2MulGas * params.Bls12381G2MultiExpDiscountTable[0]) / 1000;
        try std.testing.expectEqual(expected, gas);
    }
}