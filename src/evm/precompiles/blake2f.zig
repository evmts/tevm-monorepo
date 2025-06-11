const std = @import("std");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;

/// BLAKE2F precompile implementation (address 0x09)
///
/// The BLAKE2F precompile implements the F compression function of BLAKE2b.
/// This precompile is available from the Istanbul hardfork (EIP-152).
///
/// ## Input Format (213 bytes)
/// - rounds (4 bytes, big-endian): number of compression rounds
/// - h (64 bytes, little-endian): hash state (8 x 64-bit words)
/// - m (128 bytes, little-endian): message (16 x 64-bit words)  
/// - t (16 bytes, little-endian): counter (2 x 64-bit words)
/// - f (1 byte): final block flag (0 or 1)
///
/// ## Gas Cost
/// 1 gas per round (dynamic based on rounds parameter)
///
/// ## Output
/// 64 bytes (little-endian): new hash state (8 x 64-bit words)

/// Gas constants for BLAKE2F precompile
pub const BLAKE2F_INPUT_LENGTH: usize = 213;
pub const BLAKE2F_OUTPUT_LENGTH: usize = 64;
pub const BLAKE2F_GAS_PER_ROUND: u64 = 1;

/// Final flag values
pub const BLAKE2F_FINAL_FLAG: u8 = 1;
pub const BLAKE2F_NON_FINAL_FLAG: u8 = 0;

/// Calculates the gas cost for BLAKE2F precompile execution
///
/// Gas cost is 1 per round. If input is malformed, returns 0.
///
/// @param input Input data (should be 213 bytes)
/// @return Gas cost (rounds count) or 0 if invalid input
pub fn calculate_gas(input: []const u8) u64 {
    // If input is malformed, return 0 (let execution handle the error)
    if (input.len != BLAKE2F_INPUT_LENGTH) {
        return 0;
    }
    
    // Extract rounds from first 4 bytes (big-endian)
    const rounds = std.mem.readInt(u32, input[0..4], .big);
    return @as(u64, rounds) * BLAKE2F_GAS_PER_ROUND;
}

/// Calculates the gas cost for BLAKE2F precompile execution (from input size)
///
/// This version calculates gas based on a dummy input of the correct size.
/// For BLAKE2F, we can't determine the actual gas cost without the rounds value,
/// so this is mainly for validation purposes.
///
/// @param input_size Size of the input data (should be 213 bytes)
/// @return Error if input size is invalid, otherwise 0 (placeholder)
pub fn calculate_gas_checked(input_size: usize) !u64 {
    if (input_size != BLAKE2F_INPUT_LENGTH) {
        return error.InvalidInputSize;
    }
    // We can't calculate actual gas without the rounds value
    // Return 0 as placeholder - actual gas calculated in execute()
    return 0;
}

/// Executes the BLAKE2F precompile
///
/// This is the main entry point for BLAKE2F precompile execution.
/// Implements the BLAKE2b F compression function according to EIP-152.
///
/// @param input Input data (must be exactly 213 bytes)
/// @param output Output buffer (must be at least 64 bytes)
/// @param gas_limit Maximum gas available for this operation
/// @return PrecompileOutput containing success/failure and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileOutput {
    // Validate input length
    if (input.len != BLAKE2F_INPUT_LENGTH) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Validate output buffer size
    if (output.len < BLAKE2F_OUTPUT_LENGTH) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Extract rounds from input (big-endian)
    const rounds = std.mem.readInt(u32, input[0..4], .big);
    
    // Calculate gas cost
    const gas_cost = @as(u64, rounds) * BLAKE2F_GAS_PER_ROUND;
    
    // Check gas limit
    if (gas_cost > gas_limit) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }
    
    // Validate final flag (must be 0 or 1)
    const final_flag = input[212];
    if (final_flag != BLAKE2F_FINAL_FLAG and final_flag != BLAKE2F_NON_FINAL_FLAG) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Parse input data
    var h: [8]u64 = undefined;
    var m: [16]u64 = undefined;
    var t: [2]u64 = undefined;
    
    // Extract h (hash state): 64 bytes starting at offset 4 (little-endian)
    for (0..8) |i| {
        const offset = 4 + i * 8;
        h[i] = std.mem.readInt(u64, input[offset..offset + 8][0..8], .little);
    }
    
    // Extract m (message block): 128 bytes starting at offset 68 (little-endian)
    for (0..16) |i| {
        const offset = 68 + i * 8;
        m[i] = std.mem.readInt(u64, input[offset..offset + 8][0..8], .little);
    }
    
    // Extract t (counter): 16 bytes starting at offset 196 (little-endian)
    t[0] = std.mem.readInt(u64, input[196..204][0..8], .little);
    t[1] = std.mem.readInt(u64, input[204..212][0..8], .little);
    
    // Execute BLAKE2b F compression function
    const final = final_flag == BLAKE2F_FINAL_FLAG;
    blake2b_f(&h, &m, &t, final, rounds);
    
    // Write result to output (little-endian)
    for (0..8) |i| {
        const offset = i * 8;
        std.mem.writeInt(u64, output[offset..offset + 8], h[i], .little);
    }
    
    return PrecompileOutput.success_result(gas_cost, BLAKE2F_OUTPUT_LENGTH);
}

/// Validates the gas requirement without executing
///
/// @param input_size Size of the input data (should be 213)
/// @param gas_limit Available gas limit  
/// @return true if the operation would succeed, false if out of gas
pub fn validate_gas_requirement(input_size: usize, gas_limit: u64) bool {
    // Create dummy input of correct size to calculate gas
    if (input_size != BLAKE2F_INPUT_LENGTH) {
        return false;
    }
    
    // We can't calculate gas without the actual rounds value
    // For validation, assume worst case is acceptable if any gas provided
    return gas_limit > 0;
}

/// Gets the expected output size for given input
///
/// For BLAKE2F, output is always 64 bytes regardless of input.
///
/// @param input_size Size of the input data (ignored for BLAKE2F)
/// @return Expected output size (always 64 bytes)
pub fn get_output_size(input_size: usize) usize {
    _ = input_size; // BLAKE2F output size is fixed
    return BLAKE2F_OUTPUT_LENGTH;
}

// BLAKE2b constants and implementation
// Based on RFC 7693 and Go-Ethereum implementation for exact Ethereum compatibility

/// BLAKE2b mixing function G
fn blake2b_g(v: *[16]u64, a: u8, b: u8, c: u8, d: u8, x: u64, y: u64) void {
    v[a] = v[a] +% v[b] +% x;
    v[d] = std.math.rotr(u64, v[d] ^ v[a], 32);
    v[c] = v[c] +% v[d];
    v[b] = std.math.rotr(u64, v[b] ^ v[c], 24);
    v[a] = v[a] +% v[b] +% y;
    v[d] = std.math.rotr(u64, v[d] ^ v[a], 16);
    v[c] = v[c] +% v[d];
    v[b] = std.math.rotr(u64, v[b] ^ v[c], 63);
}

/// BLAKE2b permutation sigma
const SIGMA: [12][16]u8 = .{
    .{ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 },
    .{ 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3 },
    .{ 11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4 },
    .{ 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8 },
    .{ 9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13 },
    .{ 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9 },
    .{ 12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11 },
    .{ 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10 },
    .{ 6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5 },
    .{ 10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0 },
    .{ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 },
    .{ 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3 },
};

/// BLAKE2b initialization vector
const BLAKE2B_IV: [8]u64 = .{
    0x6a09e667f3bcc908, 0xbb67ae8584caa73b, 0x3c6ef372fe94f82b, 0xa54ff53a5f1d36f1,
    0x510e527fade682d1, 0x9b05688c2b3e6c1f, 0x1f83d9abfb41bd6b, 0x5be0cd19137e2179,
};

/// BLAKE2b F compression function
///
/// This is the core compression function that performs the BLAKE2b compression.
/// It follows RFC 7693 specification exactly and matches the Go-Ethereum implementation
/// for complete Ethereum compatibility.
///
/// @param h Hash state (8 x 64-bit words, modified in-place)
/// @param m Message block (16 x 64-bit words)
/// @param t Counter (2 x 64-bit words)
/// @param final Final block flag
/// @param rounds Number of compression rounds to perform
fn blake2b_f(h: *[8]u64, m: *const [16]u64, t: *const [2]u64, final: bool, rounds: u32) void {
    // Initialize working vector v
    var v: [16]u64 = undefined;
    
    // First half: copy hash state
    for (0..8) |i| {
        v[i] = h[i];
    }
    
    // Second half: initialize with IV
    for (0..8) |i| {
        v[i + 8] = BLAKE2B_IV[i];
    }
    
    // Mix in counter
    v[12] ^= t[0];
    v[13] ^= t[1];
    
    // Mix in final flag
    if (final) {
        v[14] = ~v[14];
    }
    
    // Perform compression rounds
    for (0..rounds) |round| {
        const s = &SIGMA[round % 12];
        
        // Column step
        blake2b_g(&v, 0, 4, 8, 12, m[s[0]], m[s[1]]);
        blake2b_g(&v, 1, 5, 9, 13, m[s[2]], m[s[3]]);
        blake2b_g(&v, 2, 6, 10, 14, m[s[4]], m[s[5]]);
        blake2b_g(&v, 3, 7, 11, 15, m[s[6]], m[s[7]]);
        
        // Diagonal step
        blake2b_g(&v, 0, 5, 10, 15, m[s[8]], m[s[9]]);
        blake2b_g(&v, 1, 6, 11, 12, m[s[10]], m[s[11]]);
        blake2b_g(&v, 2, 7, 8, 13, m[s[12]], m[s[13]]);
        blake2b_g(&v, 3, 4, 9, 14, m[s[14]], m[s[15]]);
    }
    
    // Update hash state
    for (0..8) |i| {
        h[i] ^= v[i] ^ v[i + 8];
    }
}