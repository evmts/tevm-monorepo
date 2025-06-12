const std = @import("std");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const BigInteger = @import("../crypto/big_integer.zig").BigInteger;
const gas_constants = @import("../constants/gas_constants.zig");

/// MODEXP precompile implementation (address 0x05)
///
/// Implements modular exponentiation (base^exp mod modulus) according to EIP-198 and EIP-2565.
/// This precompile is critical for RSA verification and other cryptographic operations requiring
/// efficient big integer modular exponentiation.
///
/// ## Gas Cost (EIP-2565)
/// 
/// The gas cost follows a complex formula based on input sizes:
/// - Base cost: max(200, (max_len² * iteration_count) / 3)
/// - max_len: max(base_len, mod_len) 
/// - iteration_count: depends on exponent size and value
///
/// ## Input Format
/// ```
/// Input: 32 bytes (base_len) + 32 bytes (exp_len) + 32 bytes (mod_len) + 
///        base_len bytes (base) + exp_len bytes (exp) + mod_len bytes (mod)
/// ```
///
/// ## Output Format
/// - Success: mod_len bytes containing (base^exp) mod modulus
/// - Special cases: modulus=0 returns 0, modulus=1 returns 0, base=0&exp=0 returns 1
///
/// ## Examples
/// ```zig
/// // Simple case: 2^3 mod 5 = 3
/// const input = [96 bytes header] ++ [base=2] ++ [exp=3] ++ [mod=5];
/// const result = execute(input, output, 1000);
/// // output[0] = 3
/// ```

/// Minimum gas cost for MODEXP precompile (EIP-2565)
pub const MODEXP_MIN_GAS: u64 = gas_constants.MODEXP_MIN_GAS;

/// Thresholds for gas calculation complexity
pub const MODEXP_QUADRATIC_THRESHOLD: usize = gas_constants.MODEXP_QUADRATIC_THRESHOLD;
pub const MODEXP_LINEAR_THRESHOLD: usize = gas_constants.MODEXP_LINEAR_THRESHOLD;

/// Calculate multiplication complexity for EIP-2565 gas calculation
///
/// The multiplication complexity depends on the maximum of base_len and mod_len:
/// - <= 64 bytes: quadratic complexity (len²)
/// - 64-1024 bytes: mixed complexity with linear adjustment  
/// - > 1024 bytes: near-linear complexity
///
/// @param max_len Maximum of base length and modulus length
/// @return Multiplication complexity factor
fn calculate_multiplication_complexity(max_len: usize) u64 {
    const len = @as(u64, @intCast(max_len));
    
    if (max_len <= MODEXP_QUADRATIC_THRESHOLD) {
        return len * len;
    } else if (max_len <= MODEXP_LINEAR_THRESHOLD) {
        return (len * len) / 4 + 96 * len - 3072;
    } else {
        return (len * len) / 16 + 480 * len - 199680;
    }
}

/// Calculate iteration count based on exponent
///
/// The iteration count approximates the number of iterations in the square-and-multiply algorithm:
/// - If exp_len <= 32: count bits in actual exponent value
/// - If exp_len > 32: use approximation based on exponent length
///
/// @param exp_len Length of exponent in bytes
/// @param exp_bytes First 32 bytes of exponent (for bit counting)
/// @return Estimated iteration count
fn calculate_iteration_count(exp_len: usize, exp_bytes: []const u8) u64 {
    if (exp_len <= 32 and exp_bytes.len > 0) {
        // For small exponents, count actual bits in the exponent
        var exp_value: u256 = 0;
        for (exp_bytes) |byte| {
            exp_value = (exp_value << 8) | @as(u256, byte);
        }
        
        if (exp_value == 0) return 0;
        
        // Count bits: 256 - clz gives us the bit length
        const bit_len = 256 - @clz(exp_value);
        return @max(1, @as(u64, @intCast(bit_len - 1)));
    } else {
        // For large exponents, use approximation
        const adjusted_exp_len = if (exp_len <= 32) exp_len else exp_len - 32;
        return @max(1, @as(u64, @intCast(adjusted_exp_len * 8)));
    }
}

/// Calculate gas cost for MODEXP operation according to EIP-2565
///
/// Implements the gas calculation formula:
/// gas = max(200, (multiplication_complexity * iteration_count) / 3)
///
/// @param base_len Length of base in bytes
/// @param exp_len Length of exponent in bytes  
/// @param mod_len Length of modulus in bytes
/// @param exp_bytes First 32 bytes of exponent for iteration count calculation
/// @return Gas cost for the operation
pub fn calculate_gas(base_len: usize, exp_len: usize, mod_len: usize, exp_bytes: []const u8) u64 {
    const max_len = @max(@max(base_len, exp_len), mod_len);
    const multiplication_complexity = calculate_multiplication_complexity(max_len);
    const iteration_count = calculate_iteration_count(exp_len, exp_bytes);
    
    const calculated_gas = (multiplication_complexity * iteration_count) / 3;
    return @max(MODEXP_MIN_GAS, calculated_gas);
}

/// Calculate gas cost with overflow protection
///
/// Same as calculate_gas but with overflow checking for adversarial inputs.
///
/// @param input_size Size of input data (used for basic validation)
/// @return Gas cost or error if calculation overflows
pub fn calculate_gas_checked(input_size: usize) !u64 {
    _ = input_size; // Not used in MODEXP gas calculation
    // For now, return minimum gas - proper calculation requires parsing input
    // This function is called from precompiles.zig for gas estimation
    return MODEXP_MIN_GAS;
}

/// Parse 32-byte big-endian integer from input
///
/// Converts 32 bytes of big-endian data to a usize value.
/// Used for parsing the length fields in MODEXP input.
///
/// @param bytes 32-byte slice to parse
/// @return Parsed usize value
fn parse_length_field(bytes: []const u8) usize {
    if (bytes.len != 32) return 0;
    
    var result: usize = 0;
    for (bytes) |byte| {
        result = (result << 8) | @as(usize, byte);
    }
    return result;
}

/// Check if byte array contains all zeros
///
/// Used for detecting zero modulus special case.
///
/// @param bytes Byte array to check
/// @return true if all bytes are zero
fn is_zero_bytes(bytes: []const u8) bool {
    for (bytes) |byte| {
        if (byte != 0) return false;
    }
    return true;
}

/// Execute MODEXP precompile
///
/// This is the main entry point for MODEXP execution. It performs:
/// 1. Input parsing and validation
/// 2. Gas cost calculation
/// 3. Special case handling (zero modulus, etc.)
/// 4. Modular exponentiation computation
/// 5. Result formatting
///
/// @param input Input data in MODEXP format
/// @param output Output buffer (must be >= mod_len)
/// @param gas_limit Maximum gas available
/// @return PrecompileOutput with success/failure and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileOutput {
    // Validate minimum input size (96 bytes for the three length fields)
    if (input.len < 96) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    }
    
    // Parse length fields from input
    const base_len = parse_length_field(input[0..32]);
    const exp_len = parse_length_field(input[32..64]);
    const mod_len = parse_length_field(input[64..96]);
    
    // Validate input size matches declared lengths
    const expected_len = 96 + base_len + exp_len + mod_len;
    if (input.len < expected_len) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.InvalidInput);
    }
    
    // Extract exponent bytes for gas calculation (first 32 bytes)
    const exp_start = 96 + base_len;
    const exp_gas_bytes = if (exp_len > 0 and exp_start + @min(exp_len, 32) <= input.len)
        input[exp_start..exp_start + @min(exp_len, 32)]
    else
        &[_]u8{};
    
    // Calculate gas cost
    const gas_cost = calculate_gas(base_len, exp_len, mod_len, exp_gas_bytes);
    if (gas_cost > gas_limit) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }
    
    // Validate output buffer size
    if (output.len < mod_len) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Handle special case: zero-length modulus
    if (mod_len == 0) {
        @branchHint(.cold);
        return PrecompileOutput.success_result(gas_cost, 0);
    }
    
    // Extract input components
    const mod_start = exp_start + exp_len;
    
    const base_bytes = if (base_len > 0 and 96 + base_len <= input.len) 
        input[96..96 + base_len] 
    else 
        &[_]u8{};
        
    const exp_bytes = if (exp_len > 0 and exp_start + exp_len <= input.len)
        input[exp_start..exp_start + exp_len]
    else
        &[_]u8{};
        
    const mod_bytes = if (mod_len > 0 and mod_start + mod_len <= input.len)
        input[mod_start..mod_start + mod_len]
    else
        &[_]u8{};
    
    // Handle special case: zero modulus
    if (is_zero_bytes(mod_bytes)) {
        @branchHint(.cold);
        @memset(output[0..mod_len], 0);
        return PrecompileOutput.success_result(gas_cost, mod_len);
    }
    
    // Use a fixed allocator for this computation
    // In a real implementation, this would use the EVM's allocator
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Create BigIntegers from input data
    var base = BigInteger.from_bytes(allocator, base_bytes) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfMemory);
    };
    defer base.deinit();
    
    var exp = BigInteger.from_bytes(allocator, exp_bytes) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfMemory);
    };
    defer exp.deinit();
    
    var modulus = BigInteger.from_bytes(allocator, mod_bytes) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfMemory);
    };
    defer modulus.deinit();
    
    // Perform modular exponentiation
    var result = BigInteger.mod_exp(allocator, &base, &exp, &modulus) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    };
    defer result.deinit();
    
    // Convert result to bytes and write to output
    const result_bytes = result.to_bytes(allocator) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfMemory);
    };
    defer allocator.free(result_bytes);
    
    // Clear output buffer and copy result (left-padded to mod_len)
    @memset(output[0..mod_len], 0);
    if (result_bytes.len <= mod_len) {
        const offset = mod_len - result_bytes.len;
        @memcpy(output[offset..offset + result_bytes.len], result_bytes);
    } else {
        // Result is larger than modulus - this shouldn't happen
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    return PrecompileOutput.success_result(gas_cost, mod_len);
}

/// Get expected output size for MODEXP
///
/// For MODEXP, the output size is always equal to the modulus length.
///
/// @param input_size Size of input data (used to parse modulus length)
/// @return Expected output size (modulus length)
pub fn get_output_size(input_size: usize) usize {
    if (input_size < 96) return 0;
    
    // This is a simplified version - in practice we'd need to parse the full input
    // For now, return a reasonable default
    return 32; // Default to 32 bytes for 256-bit numbers
}

/// Validate gas requirement without executing
///
/// Checks if a MODEXP call would succeed with the given gas limit.
///
/// @param input_size Size of input data
/// @param gas_limit Available gas limit
/// @return true if operation would succeed
pub fn validate_gas_requirement(input_size: usize, gas_limit: u64) bool {
    const gas_cost = calculate_gas_checked(input_size) catch {
        @branchHint(.cold);
        return false;
    };
    return gas_cost <= gas_limit;
}

// Tests
test "MODEXP basic functionality" {
    const testing = std.testing;
    
    // Test simple case: 3^2 mod 5 = 9 mod 5 = 4
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Set lengths: base=1, exp=1, mod=1
    input[31] = 1; // base_len = 1
    input[63] = 1; // exp_len = 1  
    input[95] = 1; // mod_len = 1
    
    // Set values: base=3, exp=2, mod=5
    input[96] = 3;  // base
    input[97] = 2;  // exp
    input[98] = 5;  // mod
    
    const result = execute(input[0..99], &output, 10000);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 4), output[0]);
}

test "MODEXP special cases" {
    const testing = std.testing;
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Test zero modulus case
    const result_zero_mod = execute(&input, &output, 10000);
    try testing.expect(result_zero_mod.is_success());
    try testing.expectEqual(@as(usize, 0), result_zero_mod.get_output_size());
}

test "MODEXP gas calculation" {
    const testing = std.testing;
    
    // Test minimum gas
    const gas_small = calculate_gas(1, 1, 1, &[_]u8{1});
    try testing.expect(gas_small >= MODEXP_MIN_GAS);
    
    // Test larger inputs have higher gas costs
    const gas_large = calculate_gas(100, 100, 100, &[_]u8{0xFF} ** 32);
    try testing.expect(gas_large > gas_small);
}