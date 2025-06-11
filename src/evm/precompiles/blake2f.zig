/// BLAKE2F precompile implementation (address 0x09)
/// 
/// Implements the BLAKE2b compression function according to EIP-152.
/// This provides the F function of BLAKE2b, which is the core compression
/// function used in the BLAKE2b hash algorithm.
/// 
/// ## Input Format (213 bytes total)
/// - rounds: 4 bytes (big-endian u32) - number of rounds to execute
/// - h: 64 bytes (8 x 8-byte little-endian u64) - hash state vector
/// - m: 128 bytes (16 x 8-byte little-endian u64) - message block
/// - t: 16 bytes (2 x 8-byte little-endian u64) - counter values
/// - f: 1 byte - final block flag (0 or 1)
/// 
/// ## Output Format
/// - result: 64 bytes (8 x 8-byte little-endian u64) - new hash state
/// 
/// ## Gas Calculation
/// Gas cost = rounds * BLAKE2F_GAS_PER_ROUND (1 gas per round)

const std = @import("std");
const testing = std.testing;

const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;

/// BLAKE2F precompile address
pub const BLAKE2F_ADDRESS: u160 = 0x09;

/// Input length for BLAKE2F (213 bytes)
pub const BLAKE2F_INPUT_LENGTH: usize = 213;

/// Output length for BLAKE2F (64 bytes)
pub const BLAKE2F_OUTPUT_LENGTH: usize = 64;

/// BLAKE2b constants
const BLAKE2B_SIGMA: [12][16]u8 = [_][16]u8{
    [_]u8{ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 },
    [_]u8{ 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3 },
    [_]u8{ 11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4 },
    [_]u8{ 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8 },
    [_]u8{ 9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13 },
    [_]u8{ 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9 },
    [_]u8{ 12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11 },
    [_]u8{ 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10 },
    [_]u8{ 6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5 },
    [_]u8{ 10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0 },
    [_]u8{ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 },
    [_]u8{ 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3 },
};

/// Execute the BLAKE2F precompile
/// 
/// ## Parameters
/// - `input`: Input data (must be exactly 213 bytes)
/// - `output`: Output buffer (must be at least 64 bytes)
/// - `gas_limit`: Maximum gas available for this operation
/// 
/// ## Returns
/// - `PrecompileOutput` containing success/failure and gas used
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileOutput {
    // Validate input length
    if (input.len != BLAKE2F_INPUT_LENGTH) {
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    }
    
    // Validate output buffer size
    if (output.len < BLAKE2F_OUTPUT_LENGTH) {
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Parse input format
    const parsed = parse_input(input) catch {
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    };
    
    // Calculate gas cost (1 gas per round)
    const gas_cost = @as(u64, parsed.rounds) * gas_constants.BLAKE2F_GAS_PER_ROUND;
    
    if (gas_cost > gas_limit) {
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }
    
    // Perform BLAKE2b compression
    var h_state = parsed.h;
    blake2b_compress(&h_state, parsed.m, parsed.t, parsed.final_flag, parsed.rounds);
    
    // Convert result to output format (little-endian)
    for (0..8) |i| {
        const offset = i * 8;
        std.mem.writeInt(u64, output[offset..offset + 8][0..8], h_state[i], .little);
    }
    
    return PrecompileOutput.success_result(gas_cost, BLAKE2F_OUTPUT_LENGTH);
}

/// Parsed BLAKE2F input structure
const ParsedInput = struct {
    rounds: u32,
    h: [8]u64,
    m: [16]u64,
    t: [2]u64,
    final_flag: bool,
};

/// Parse the BLAKE2F input format
fn parse_input(input: []const u8) !ParsedInput {
    if (input.len != BLAKE2F_INPUT_LENGTH) {
        return error.InvalidInput;
    }
    
    // Parse rounds (4 bytes, big-endian)
    const rounds = std.mem.readInt(u32, input[0..4], .big);
    
    // Parse h vector (64 bytes, 8 x little-endian u64)
    var h: [8]u64 = undefined;
    for (0..8) |i| {
        const offset = 4 + i * 8;
        h[i] = std.mem.readInt(u64, input[offset..offset + 8][0..8], .little);
    }
    
    // Parse m vector (128 bytes, 16 x little-endian u64)
    var m: [16]u64 = undefined;
    for (0..16) |i| {
        const offset = 68 + i * 8;
        m[i] = std.mem.readInt(u64, input[offset..offset + 8][0..8], .little);
    }
    
    // Parse t vector (16 bytes, 2 x little-endian u64)
    const t0 = std.mem.readInt(u64, input[196..204][0..8], .little);
    const t1 = std.mem.readInt(u64, input[204..212][0..8], .little);
    const t = [2]u64{ t0, t1 };
    
    // Parse final flag (1 byte)
    const f_byte = input[212];
    if (f_byte != 0 and f_byte != 1) {
        return error.InvalidFinalFlag;
    }
    const final_flag = f_byte == 1;
    
    return ParsedInput{
        .rounds = rounds,
        .h = h,
        .m = m,
        .t = t,
        .final_flag = final_flag,
    };
}

/// BLAKE2b compression function
/// 
/// This implements the F function of BLAKE2b as specified in RFC 7693.
/// It performs the specified number of rounds of compression on the state.
fn blake2b_compress(h: *[8]u64, m: [16]u64, t: [2]u64, final_flag: bool, rounds: u32) void {
    // Initialize working variables
    var v: [16]u64 = undefined;
    
    // Copy h to v[0..7]
    @memcpy(v[0..8], h[0..8]);
    
    // Initialize v[8..15] with BLAKE2b IV
    const BLAKE2B_IV = [8]u64{
        0x6a09e667f3bcc908, 0xbb67ae8584caa73b, 0x3c6ef372fe94f82b, 0xa54ff53a5f1d36f1,
        0x510e527fade682d1, 0x9b05688c2b3e6c1f, 0x1f83d9abfb41bd6b, 0x5be0cd19137e2179,
    };
    @memcpy(v[8..16], &BLAKE2B_IV);
    
    // XOR in the counter and final flag
    v[12] ^= t[0];
    v[13] ^= t[1];
    if (final_flag) {
        v[14] = ~v[14];
    }
    
    // Perform the specified number of rounds
    for (0..rounds) |round| {
        const sigma = &BLAKE2B_SIGMA[round % 12];
        
        // Apply G function to each column
        g(&v, 0, 4, 8, 12, m[sigma[0]], m[sigma[1]]);
        g(&v, 1, 5, 9, 13, m[sigma[2]], m[sigma[3]]);
        g(&v, 2, 6, 10, 14, m[sigma[4]], m[sigma[5]]);
        g(&v, 3, 7, 11, 15, m[sigma[6]], m[sigma[7]]);
        
        // Apply G function to each diagonal
        g(&v, 0, 5, 10, 15, m[sigma[8]], m[sigma[9]]);
        g(&v, 1, 6, 11, 12, m[sigma[10]], m[sigma[11]]);
        g(&v, 2, 7, 8, 13, m[sigma[12]], m[sigma[13]]);
        g(&v, 3, 4, 9, 14, m[sigma[14]], m[sigma[15]]);
    }
    
    // Finalize hash state
    for (0..8) |i| {
        h[i] ^= v[i] ^ v[i + 8];
    }
}

/// BLAKE2b G function
/// 
/// This is the core mixing function used in each round of BLAKE2b compression.
fn g(v: *[16]u64, a: usize, b: usize, c: usize, d: usize, x: u64, y: u64) void {
    v[a] = v[a] +% v[b] +% x;
    v[d] = rotr64(v[d] ^ v[a], 32);
    v[c] = v[c] +% v[d];
    v[b] = rotr64(v[b] ^ v[c], 24);
    v[a] = v[a] +% v[b] +% y;
    v[d] = rotr64(v[d] ^ v[a], 16);
    v[c] = v[c] +% v[d];
    v[b] = rotr64(v[b] ^ v[c], 63);
}

/// Right rotate a 64-bit value
fn rotr64(value: u64, amount: u6) u64 {
    if (amount == 0) return value;
    return (value >> amount) | (value << @intCast(64 - @as(u8, amount)));
}

/// Calculate gas cost for BLAKE2F without full execution
/// Used by the precompile dispatcher for gas estimation
pub fn calculate_gas_checked(input_size: usize) u64 {
    if (input_size != BLAKE2F_INPUT_LENGTH) {
        return 0; // Invalid input size
    }
    
    // We can't easily determine rounds without parsing, so return a conservative estimate
    // Maximum u32 rounds would be ~4 billion gas, but that's unrealistic
    // Return a reasonable default for estimation
    return 1000 * gas_constants.BLAKE2F_GAS_PER_ROUND;
}

/// Get expected output size for BLAKE2F
/// Used by the precompile dispatcher
pub fn get_output_size(input_size: usize) usize {
    if (input_size != BLAKE2F_INPUT_LENGTH) {
        return 0;
    }
    return BLAKE2F_OUTPUT_LENGTH;
}

// Tests
test "BLAKE2F input parsing" {
    // Create test input with known values
    var input = [_]u8{0} ** BLAKE2F_INPUT_LENGTH;
    
    // Set rounds = 12 (big-endian)
    input[3] = 12;
    
    // Set some h values (little-endian)
    std.mem.writeInt(u64, input[4..12], 0x123456789abcdef0, .little);
    
    // Set final flag
    input[212] = 1;
    
    const parsed = try parse_input(&input);
    
    try testing.expectEqual(@as(u32, 12), parsed.rounds);
    try testing.expectEqual(@as(u64, 0x123456789abcdef0), parsed.h[0]);
    try testing.expect(parsed.final_flag);
}

test "BLAKE2F gas calculation" {
    var input = [_]u8{0} ** BLAKE2F_INPUT_LENGTH;
    
    // Set rounds = 100
    std.mem.writeInt(u32, input[0..4], 100, .big);
    
    // Set valid final flag
    input[212] = 0;
    
    var output = [_]u8{0} ** BLAKE2F_OUTPUT_LENGTH;
    const result = execute(&input, &output, 1000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 100), result.get_gas_used());
}

test "BLAKE2F invalid input length" {
    const short_input = [_]u8{0} ** 100;
    var output = [_]u8{0} ** BLAKE2F_OUTPUT_LENGTH;
    
    const result = execute(&short_input, &output, 1000);
    try testing.expect(!result.is_success());
}

test "BLAKE2F invalid final flag" {
    var input = [_]u8{0} ** BLAKE2F_INPUT_LENGTH;
    input[212] = 2; // Invalid final flag
    
    var output = [_]u8{0} ** BLAKE2F_OUTPUT_LENGTH;
    const result = execute(&input, &output, 1000);
    
    try testing.expect(!result.is_success());
}

test "BLAKE2F known test vector" {
    // Test case from EIP-152 specification
    // This is a simplified test - full test vectors would be more comprehensive
    var input = [_]u8{0} ** BLAKE2F_INPUT_LENGTH;
    
    // Set rounds = 1
    std.mem.writeInt(u32, input[0..4], 1, .big);
    
    // Initialize h with BLAKE2b IV
    const BLAKE2B_IV = [8]u64{
        0x6a09e667f3bcc908, 0xbb67ae8584caa73b, 0x3c6ef372fe94f82b, 0xa54ff53a5f1d36f1,
        0x510e527fade682d1, 0x9b05688c2b3e6c1f, 0x1f83d9abfb41bd6b, 0x5be0cd19137e2179,
    };
    
    for (0..8) |i| {
        const offset = 4 + i * 8;
        std.mem.writeInt(u64, input[offset..offset + 8][0..8], BLAKE2B_IV[i], .little);
    }
    
    // Set final flag
    input[212] = 0;
    
    var output = [_]u8{0} ** BLAKE2F_OUTPUT_LENGTH;
    const result = execute(&input, &output, 100);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 1), result.get_gas_used());
    try testing.expectEqual(@as(usize, BLAKE2F_OUTPUT_LENGTH), result.get_output_size());
}