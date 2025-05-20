const std = @import("std");
const common = @import("common.zig");
const params = @import("params.zig");
const PrecompiledContract = common.PrecompiledContract;
const getData = common.getData;

/// BigModExp precompiled contract (pre EIP-2565)
pub const BigModExp = PrecompiledContract{
    .requiredGas = bigModExpRequiredGas,
    .run = bigModExpRun,
};

/// BigModExp precompiled contract with EIP-2565 gas cost formula
pub const BigModExpEIP2565 = PrecompiledContract{
    .requiredGas = bigModExpEIP2565RequiredGas,
    .run = bigModExpRun,
};

// Implementation of gas calculation functions

/// Calculate gas cost for modular exponentiation (pre EIP-2565)
fn bigModExpRequiredGas(input: []const u8) u64 {
    // Extract the input dimensions from the first 96 bytes
    var baseLen: u256 = undefined;
    var expLen: u256 = undefined;
    var modLen: u256 = undefined;
    
    if (input.len < 96) {
        // If input is too short, use empty values
        baseLen = 0;
        expLen = 0;
        modLen = 0;
    } else {
        // Parse big-endian integers from input
        baseLen = bytesToBigInt(getData(input, 0, 32));
        expLen = bytesToBigInt(getData(input, 32, 32));
        modLen = bytesToBigInt(getData(input, 64, 32));
    }
    
    // Use the longer of baseLen and modLen as the size parameter
    const arithSize = if (baseLen > modLen) baseLen else modLen;
    
    // Calculate the adjusted exp length
    var adjExpLen = u256(0);
    
    if (expLen > 32) {
        adjExpLen = expLen - 32;
        adjExpLen = adjExpLen * 8;
    }
    
    // Get the highest bit of the exponent (only the first 32 bytes are used)
    var expHead = u256(0);
    if (input.len > 96) {
        const expHeadBytes = getData(input, 96 + @as(usize, @intCast(baseLen)), if (expLen > 32) 32 else @as(usize, @intCast(expLen)));
        expHead = bytesToBigInt(expHeadBytes);
    }
    
    // Find the highest bit set in expHead
    var msb: i32 = -1;
    const expHeadInt: usize = @intCast(expHead);
    var tempVal = expHeadInt;
    while (tempVal > 0) {
        tempVal >>= 1;
        msb += 1;
    }
    
    adjExpLen = adjExpLen + @as(u256, @intCast(@as(u64, @intCast(msb))));
    
    // Calculate gas based on the complexity formula
    var gas = u256(0);
    
    // Compute the multiplier
    if (arithSize <= 64) {
        // x^2
        gas = arithSize * arithSize;
    } else if (arithSize <= 1024) {
        // (x^2)/4 + 96*x - 3072
        gas = arithSize * arithSize / 4 + 96 * arithSize - 3072;
    } else {
        // (x^2)/16 + 480*x - 199680
        gas = arithSize * arithSize / 16 + 480 * arithSize - 199680;
    }
    
    // Apply the adjExpLen multiplier
    if (adjExpLen > 1) {
        gas = gas * adjExpLen;
    }
    
    // Divide by 20 to get final gas cost
    gas = gas / 20;
    
    // Handle overflow
    if (gas > std.math.maxInt(u64)) {
        return std.math.maxInt(u64);
    }
    
    return @intCast(gas);
}

/// Calculate gas cost for modular exponentiation with EIP-2565
fn bigModExpEIP2565RequiredGas(input: []const u8) u64 {
    // Extract the input dimensions from the first 96 bytes
    var baseLen: u256 = undefined;
    var expLen: u256 = undefined;
    var modLen: u256 = undefined;
    
    if (input.len < 96) {
        // If input is too short, use empty values
        baseLen = 0;
        expLen = 0;
        modLen = 0;
    } else {
        // Parse big-endian integers from input
        baseLen = bytesToBigInt(getData(input, 0, 32));
        expLen = bytesToBigInt(getData(input, 32, 32));
        modLen = bytesToBigInt(getData(input, 64, 32));
    }
    
    // Use the longer of baseLen and modLen as the size parameter
    const arithSize = if (baseLen > modLen) baseLen else modLen;
    
    // Calculate the adjusted exp length
    var adjExpLen = u256(0);
    
    if (expLen > 32) {
        adjExpLen = expLen - 32;
        adjExpLen = adjExpLen * 8;
    }
    
    // Get the highest bit of the exponent (only the first 32 bytes are used)
    var expHead = u256(0);
    if (input.len > 96) {
        const expHeadBytes = getData(input, 96 + @as(usize, @intCast(baseLen)), if (expLen > 32) 32 else @as(usize, @intCast(expLen)));
        expHead = bytesToBigInt(expHeadBytes);
    }
    
    // Find the highest bit set in expHead
    var msb: i32 = -1;
    const expHeadInt: usize = @intCast(expHead);
    var tempVal = expHeadInt;
    while (tempVal > 0) {
        tempVal >>= 1;
        msb += 1;
    }
    
    adjExpLen = adjExpLen + @as(u256, @intCast(@as(u64, @intCast(msb))));
    
    // Calculate gas based on the EIP-2565 complexity formula
    var gas = u256(0);
    
    // EIP-2565 has three changes
    // 1. Different complexity formula: ceiling(x/8)^2
    arithSize = (arithSize + 7) / 8; // ceiling division by 8
    gas = arithSize * arithSize;
    
    // Apply the exponent multiplier
    if (adjExpLen > 1) {
        gas = gas * adjExpLen;
    }
    
    // 2. Different divisor (GQUADDIVISOR) = 3
    gas = gas / 3;
    
    // Handle overflow
    if (gas > std.math.maxInt(u64)) {
        return std.math.maxInt(u64);
    }
    
    // 3. Minimum gas of 200
    if (gas < params.ModExpMinGas) {
        return params.ModExpMinGas;
    }
    
    return @intCast(gas);
}

/// Convert a byte slice to a big integer in big-endian order
fn bytesToBigInt(bytes: []const u8) u256 {
    var result: u256 = 0;
    
    for (bytes) |byte| {
        result = (result << 8) | byte;
    }
    
    return result;
}

/// Implementation of modular exponentiation
fn bigModExpRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    if (input.len < 96) {
        // Return empty result for invalid input
        return try allocator.alloc(u8, 0);
    }
    
    // Extract the input dimensions
    const baseLen = bytesToBigInt(getData(input, 0, 32));
    const expLen = bytesToBigInt(getData(input, 32, 32));
    const modLen = bytesToBigInt(getData(input, 64, 32));
    
    // Handle a special case when both the base and mod length is zero
    if (baseLen == 0 and modLen == 0) {
        return try allocator.alloc(u8, 0);
    }
    
    // Extract the actual parameters
    const baseStart = 96;
    const expStart = baseStart + @as(usize, @intCast(baseLen));
    const modStart = expStart + @as(usize, @intCast(expLen));
    
    const baseBytes = getData(input, baseStart, @intCast(baseLen));
    const expBytes = getData(input, expStart, @intCast(expLen));
    const modBytes = getData(input, modStart, @intCast(modLen));
    
    const base = bytesToBigInt(baseBytes);
    const exp = bytesToBigInt(expBytes);
    const mod = bytesToBigInt(modBytes);
    
    var result: u256 = undefined;
    
    // Special cases
    if (mod == 0) {
        // Modulo 0 is undefined, return zero
        const zeroes = try allocator.alloc(u8, @intCast(modLen));
        @memset(zeroes, 0);
        return zeroes;
    } else if (base == 1) {
        // If base == 1, return 1 % mod
        result = 1 % mod;
    } else {
        // TODO: Implement efficient modular exponentiation
        // This is a simplified implementation and won't handle large numbers efficiently
        result = 1;
        var e = exp;
        var b = base % mod;
        
        while (e > 0) {
            if (e & 1 == 1) {
                result = (result * b) % mod;
            }
            e >>= 1;
            b = (b * b) % mod;
        }
    }
    
    // Convert result back to byte array with proper padding
    var resultBytes = try allocator.alloc(u8, @intCast(modLen));
    @memset(resultBytes, 0);
    
    // Fill in the bytes from the right (big-endian)
    var tempResult = result;
    var i: usize = resultBytes.len;
    while (i > 0 and tempResult > 0) {
        i -= 1;
        resultBytes[i] = @intCast(tempResult & 0xFF);
        tempResult >>= 8;
    }
    
    return resultBytes;
}

// Type definition for 256-bit integer (placeholder)
// In a real implementation, use proper big integer library
// We don't need to define this since u256 is now a built-in type in Zig