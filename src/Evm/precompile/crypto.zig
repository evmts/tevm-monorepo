const std = @import("std");
const common = @import("common.zig");
const params = @import("params.zig");
const PrecompiledContract = common.PrecompiledContract;

// Externally import crypto libraries
const sha2 = std.crypto.hash.sha2;
const Sha256 = sha2.Sha256;
const bigint = std.math.big.int;

// ECRECOVER precompiled contract
pub const ECRecover = PrecompiledContract{
    .requiredGas = ecrecoverRequiredGas,
    .run = ecrecoverRun,
};

// SHA256 precompiled contract
pub const SHA256Hash = PrecompiledContract{
    .requiredGas = sha256RequiredGas,
    .run = sha256Run,
};

// RIPEMD160 precompiled contract
pub const RIPEMD160Hash = PrecompiledContract{
    .requiredGas = ripemd160RequiredGas,
    .run = ripemd160Run,
};

// BN256 Add for Byzantium
pub const Bn256AddByzantium = PrecompiledContract{
    .requiredGas = bn256AddByzantiumRequiredGas,
    .run = bn256AddRun,
};

// BN256 Add for Istanbul
pub const Bn256AddIstanbul = PrecompiledContract{
    .requiredGas = bn256AddIstanbulRequiredGas,
    .run = bn256AddRun,
};

// BN256 Scalar Multiplication for Byzantium
pub const Bn256ScalarMulByzantium = PrecompiledContract{
    .requiredGas = bn256ScalarMulByzantiumRequiredGas,
    .run = bn256ScalarMulRun,
};

// BN256 Scalar Multiplication for Istanbul
pub const Bn256ScalarMulIstanbul = PrecompiledContract{
    .requiredGas = bn256ScalarMulIstanbulRequiredGas,
    .run = bn256ScalarMulRun,
};

// BN256 Pairing for Byzantium
pub const Bn256PairingByzantium = PrecompiledContract{
    .requiredGas = bn256PairingByzantiumRequiredGas,
    .run = bn256PairingRun,
};

// BN256 Pairing for Istanbul
pub const Bn256PairingIstanbul = PrecompiledContract{
    .requiredGas = bn256PairingIstanbulRequiredGas,
    .run = bn256PairingRun,
};

// Blake2F precompiled contract
pub const Blake2F = PrecompiledContract{
    .requiredGas = blake2fRequiredGas,
    .run = blake2fRun,
};

// Implementation of gas calculation functions

fn ecrecoverRequiredGas(input: []const u8) u64 {
    _ = input;
    return params.EcrecoverGas;
}

fn sha256RequiredGas(input: []const u8) u64 {
    return (@as(u64, input.len) + 31) / 32 * params.Sha256PerWordGas + params.Sha256BaseGas;
}

fn ripemd160RequiredGas(input: []const u8) u64 {
    return (@as(u64, input.len) + 31) / 32 * params.Ripemd160PerWordGas + params.Ripemd160BaseGas;
}

fn bn256AddByzantiumRequiredGas(input: []const u8) u64 {
    _ = input;
    return params.Bn256AddGasByzantium;
}

fn bn256AddIstanbulRequiredGas(input: []const u8) u64 {
    _ = input;
    return params.Bn256AddGasIstanbul;
}

fn bn256ScalarMulByzantiumRequiredGas(input: []const u8) u64 {
    _ = input;
    return params.Bn256ScalarMulGasByzantium;
}

fn bn256ScalarMulIstanbulRequiredGas(input: []const u8) u64 {
    _ = input;
    return params.Bn256ScalarMulGasIstanbul;
}

fn bn256PairingByzantiumRequiredGas(input: []const u8) u64 {
    return params.Bn256PairingBaseGasByzantium + @as(u64, input.len) / 192 * params.Bn256PairingPerPointGasByzantium;
}

fn bn256PairingIstanbulRequiredGas(input: []const u8) u64 {
    return params.Bn256PairingBaseGasIstanbul + @as(u64, input.len) / 192 * params.Bn256PairingPerPointGasIstanbul;
}

fn blake2fRequiredGas(input: []const u8) u64 {
    // Per EIP-152, the Blake2F input should be 213 bytes
    const blake2FInputLength = 213;
    const rounds_offset = 0;  // Rounds value starts at byte 0
    const rounds_size = 4;    // Rounds value is 4 bytes (u32)
    
    // Validate input length - must be exactly 213 bytes for proper Blake2F input
    if (input.len != blake2FInputLength) {
        // Return a reasonable default for malformed input
        return params.Blake2FPerRoundGas;
    }
    
    // Safety check: ensure input has at least 4 bytes for the rounds value
    if (input.len < rounds_size) {
        return params.Blake2FPerRoundGas;
    }
    
    // Extract rounds from the first 4 bytes (big-endian format) using safer indexing
    var rounds: u32 = 0;
    if (rounds_offset + 3 < input.len) {
        rounds |= @as(u32, input[rounds_offset]) << 24;
        rounds |= @as(u32, input[rounds_offset + 1]) << 16;
        rounds |= @as(u32, input[rounds_offset + 2]) << 8;
        rounds |= @as(u32, input[rounds_offset + 3]);
    } else {
        // Not enough bytes to safely extract rounds
        return params.Blake2FPerRoundGas;
    }
    
    // Set an upper limit on acceptable rounds to prevent excessive gas consumption
    // Blake2 typically uses 12 rounds, but we allow up to 64 for flexibility
    const max_reasonable_rounds: u32 = 64;
    
    if (rounds > max_reasonable_rounds) {
        // If someone is trying to specify an unreasonable number of rounds,
        // return the maximum gas amount to effectively deny the transaction
        return std.math.maxInt(u64);
    }
    
    // Gas cost is proportional to the number of rounds (per EIP-152)
    // Safe conversion from u32 to u64
    return @as(u64, rounds);
}

// Implementation of execution functions

fn ecrecoverRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    const ecRecoverInputLength = 128;
    
    // Allocate a standard 32-byte result for the recovered address
    const result = try allocator.alloc(u8, 32);
    errdefer allocator.free(result); // Free on error if we return early
    
    // Initialize result to zeros (zero address is the default for invalid inputs)
    @memset(result, 0);
    
    // Handle empty input case - return zero address
    if (input.len == 0) {
        return result;
    }
    
    // Make sure we have enough input bytes for ECRECOVER by padding the input
    // The ECRECOVER precompile expects exactly 128 bytes:
    // - 32 bytes: message hash
    // - 32 bytes: v with bytes 1-31 = 0
    // - 32 bytes: r
    // - 32 bytes: s
    const padded_input = try common.rightPadBytes(allocator, input, ecRecoverInputLength);
    defer allocator.free(padded_input);
    
    // Safety check to ensure we have enough bytes to extract components
    if (padded_input.len < ecRecoverInputLength) {
        // This shouldn't happen since the rightPadBytes function should ensure we have exactly
        // ecRecoverInputLength bytes, but best to check for safety
        return result;
    }
    
    // Extract the components from padded input
    
    // Message hash is the first 32 bytes
    // const hash = padded_input[0..32];
    
    // Signature v value (must be 27 or 28 for legacy compatibility)
    const v = padded_input[32];
    
    // Check that bytes 33-63 are all zero (v should only use first byte)
    // Use a safer approach to ensure we can access all the bytes
    var valid_v_padding = true;
    if (padded_input.len >= 64) {
        valid_v_padding = common.allZero(padded_input[33..64]);
    } else {
        valid_v_padding = false;
    }
    
    if (v != 27 and v != 28 or !valid_v_padding) {
        // Return zero address for invalid signature
        return result;
    }
    
    // r value is bytes 64-95
    // const r = padded_input[64..96];
    
    // s value is bytes 96-127
    // const s = padded_input[96..128];
    
    // TODO: Implement actual ECRECOVER using secp256k1
    // 1. The recovery ID is computed as v - 27
    // 2. Use the message hash, r, s and recovery ID to recover the public key
    // 3. Take the Keccak-256 hash of the public key
    // 4. Take the last 20 bytes of the hash as the Ethereum address
    // 5. Put the 20-byte address in the last 20 bytes of the 32-byte result
    
    // For now, we return zeros (the result is already zeroed)
    return result;
}

fn sha256Run(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // Compute the SHA256 hash
    var hash: [Sha256.digest_length]u8 = undefined;
    Sha256.hash(input, &hash, .{});
    
    // In Ethereum, all precompile outputs must be 32 bytes
    // SHA256 output is already 32 bytes, so we just allocate 32 bytes
    var result = try allocator.alloc(u8, 32);
    errdefer allocator.free(result); // Ensure memory is freed on error
    
    // Safety check: ensure the hash length matches expected digest length
    if (hash.len != 32) {
        // Should never happen since Sha256.digest_length is 32,
        // but good for safety and future-proofing
        @memset(result, 0);  // Set all bytes to 0 in case of mismatch
        return result;
    }
    
    // Copy the hash to the result
    @memcpy(result[0..32], &hash);
    
    return result;
}

fn ripemd160Run(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // TODO: Implement actual RIPEMD160 (need to either import a library or implement it)
    
    // In Ethereum, RIPEMD160 outputs 20 bytes but precompiles return 32 bytes
    // The result is left-padded with zeros
    const result = try allocator.alloc(u8, 32);
    errdefer allocator.free(result); // Ensure memory is freed on error
    
    // Zero-initialize all 32 bytes
    @memset(result, 0);
    
    // TODO: Replace with actual RIPEMD160 computation and copy to bytes 12-31
    // For now, we're just returning zeros as a placeholder
    
    // Use input to silence unused parameter warning
    if (input.len > 0) {
        // Just a placeholder - without actual implementation
        result[31] = if (input[0] % 2 == 0) 1 else 2;
    }
    
    return result;
}

fn bn256AddRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // TODO: Implement BN256 elliptic curve operations
    // For now, just return a placeholder
    _ = input;
    
    // Allocate memory for result
    const result = try allocator.alloc(u8, 64);
    
    // Free the memory in case of error after allocation
    errdefer allocator.free(result);
    
    // Zero-initialize the result
    @memset(result, 0);
    
    return result;
}

fn bn256ScalarMulRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // TODO: Implement BN256 scalar multiplication
    // For now, just return a placeholder
    _ = input;
    
    // Allocate memory for result
    const result = try allocator.alloc(u8, 64);
    
    // Free the memory in case of error after allocation
    errdefer allocator.free(result);
    
    // Zero-initialize the result
    @memset(result, 0);
    
    return result;
}

fn bn256PairingRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // TODO: Implement BN256 pairing check
    // For now, return false (all zeros) as a placeholder
    _ = input;
    
    // Allocate memory for result
    const result = try allocator.alloc(u8, 32);
    
    // Free the memory in case of error after allocation
    errdefer allocator.free(result);
    
    // Zero-initialize the result
    @memset(result, 0);
    
    return result;
}

fn blake2fRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    // TODO: Implement Blake2F compression function
    // For now, return placeholder output
    _ = input;
    
    // Allocate memory for result with proper safety handling
    const result = try allocator.alloc(u8, 64);
    
    // Free the memory in case of error after allocation
    errdefer allocator.free(result);
    
    // Zero-initialize the result
    @memset(result, 0);
    
    return result;
}

// Tests
test "SHA256 precompile" {
    const allocator = std.testing.allocator;
    
    const input = "hello world";
    
    // Test gas calculation
    const gas = sha256RequiredGas(input);
    try std.testing.expect(gas >= params.Sha256BaseGas);
    
    // Test execution
    const output = try sha256Run(input, allocator);
    defer if (output) |data| allocator.free(data);
    
    try std.testing.expect(output != null);
    if (output) |data| {
        try std.testing.expectEqual(@as(usize, 32), data.len);
        // Known SHA256 hash of "hello world"
        const expected = [_]u8{
            0xb9, 0x4d, 0x27, 0xb9, 0x93, 0x4d, 0x3e, 0x08,
            0xa5, 0x2e, 0x52, 0xd7, 0xda, 0x7d, 0xab, 0xfa,
            0xc4, 0x84, 0xef, 0xe3, 0x7a, 0x53, 0x80, 0xee,
            0x90, 0x88, 0xf7, 0xac, 0xe2, 0xef, 0xcd, 0xe9,
        };
        try std.testing.expectEqualSlices(u8, &expected, data);
    }
}

test "ECRECOVER precompile" {
    const allocator = std.testing.allocator;
    
    // Test with empty input
    {
        const output = try ecrecoverRun(&[_]u8{}, allocator);
        defer if (output) |data| allocator.free(data);
        
        try std.testing.expect(output != null);
        if (output) |data| {
            try std.testing.expectEqual(@as(usize, 32), data.len);
            // Should return all zeros for empty input
            try std.testing.expectEqualSlices(u8, &[_]u8{0} ** 32, data);
        }
    }
    
    // Test with invalid input (too short, not a valid signature)
    {
        const invalid_input = [_]u8{1, 2, 3, 4};
        const output = try ecrecoverRun(&invalid_input, allocator);
        defer if (output) |data| allocator.free(data);
        
        try std.testing.expect(output != null);
        if (output) |data| {
            try std.testing.expectEqual(@as(usize, 32), data.len);
            // Should return all zeros for invalid input
            try std.testing.expectEqualSlices(u8, &[_]u8{0} ** 32, data);
        }
    }
    
    // Test with valid-looking input format but invalid v value
    {
        var valid_format = [_]u8{0} ** 128;
        valid_format[32] = 29; // Invalid v value (must be 27 or 28)
        
        const output = try ecrecoverRun(&valid_format, allocator);
        defer if (output) |data| allocator.free(data);
        
        try std.testing.expect(output != null);
        if (output) |data| {
            try std.testing.expectEqual(@as(usize, 32), data.len);
            // Should return all zeros for invalid signature
            try std.testing.expectEqualSlices(u8, &[_]u8{0} ** 32, data);
        }
    }
}