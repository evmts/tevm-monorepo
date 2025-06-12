const std = @import("std");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const gas_constants = @import("../constants/gas_constants.zig");

/// RIPEMD160 precompile implementation (address 0x03)
///
/// The RIPEMD160 precompile provides RIPEMD160 hashing functionality, which produces
/// a 160-bit (20-byte) hash. This is one of the standard Ethereum precompiles available
/// from the Frontier hardfork.
///
/// ## Security Note
/// This implementation follows the RIPEMD160 specification exactly as defined in:
/// https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
///
/// ## Input Format
/// - Any length byte array (no restrictions)
///
/// ## Output Format  
/// - Always 32 bytes: 20-byte RIPEMD160 hash + 12 zero bytes (left-padding)
///
/// ## Gas Cost
/// - Base cost: 600 gas
/// - Per word cost: 120 gas per 32-byte word
/// - Total: 600 + 120 * ceil(input_size / 32)
///
/// ## Examples
/// ```zig
/// // Empty input hash
/// const empty_result = execute(&[_]u8{}, &output, 1000);
/// // RIPEMD160("") = 9c1185a5c5e9fc54612808977ee8f548b2258d31
///
/// // "abc" hash  
/// const abc_input = "abc";
/// const abc_result = execute(abc_input, &output, 1000);
/// // RIPEMD160("abc") = 8eb208f7e05d987a9b044a8e98c6b087f15a0bfc
/// ```

/// Gas constants for RIPEMD160 precompile
pub const RIPEMD160_BASE_GAS_COST: u64 = gas_constants.RIPEMD160_BASE_COST;
pub const RIPEMD160_WORD_GAS_COST: u64 = gas_constants.RIPEMD160_WORD_COST;

/// Expected output size for RIPEMD160 (32 bytes with padding)
const RIPEMD160_OUTPUT_SIZE: usize = 32;

/// Actual RIPEMD160 hash size (20 bytes)
const RIPEMD160_HASH_SIZE: usize = 20;

/// Calculates the gas cost for RIPEMD160 precompile execution
///
/// Follows the Ethereum specification: 600 + 120 * ceil(input_size / 32)
/// The cost increases linearly with input size to account for processing overhead.
///
/// @param input_size Size of the input data in bytes
/// @return Total gas cost for the operation
pub fn calculate_gas(input_size: usize) u64 {
    const word_count = (input_size + 31) / 32;
    return RIPEMD160_BASE_GAS_COST + RIPEMD160_WORD_GAS_COST * @as(u64, @intCast(word_count));
}

/// Calculates gas cost with overflow protection
///
/// This function provides safe gas calculation that prevents integer overflow
/// for extremely large inputs that could cause arithmetic overflow.
///
/// @param input_size Size of the input data in bytes
/// @return Gas cost or error if overflow would occur
pub fn calculate_gas_checked(input_size: usize) !u64 {
    // Check for potential overflow in word count calculation
    if (input_size > std.math.maxInt(u64) - 31) {
        return error.Overflow;
    }
    
    const word_count = (input_size + 31) / 32;
    
    // Check for overflow in multiplication
    if (word_count > std.math.maxInt(u64) / RIPEMD160_WORD_GAS_COST) {
        return error.Overflow;
    }
    
    const word_gas = RIPEMD160_WORD_GAS_COST * @as(u64, @intCast(word_count));
    
    // Check for overflow in addition
    if (word_gas > std.math.maxInt(u64) - RIPEMD160_BASE_GAS_COST) {
        return error.Overflow;
    }
    
    return RIPEMD160_BASE_GAS_COST + word_gas;
}

/// Executes the RIPEMD160 precompile
///
/// This function performs the complete RIPEMD160 precompile execution:
/// 1. Validates gas requirements
/// 2. Computes RIPEMD160 hash of input data
/// 3. Formats output as 32 bytes with zero padding
/// 4. Returns execution result with gas usage
///
/// @param input Input data to hash (any length)
/// @param output Output buffer to write result (must be >= 32 bytes)  
/// @param gas_limit Maximum gas available for this operation
/// @return PrecompileOutput containing success/failure and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileOutput {
    const gas_cost = calculate_gas(input.len);
    
    // Check if we have enough gas
    if (gas_cost > gas_limit) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }
    
    // Validate output buffer size
    if (output.len < RIPEMD160_OUTPUT_SIZE) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Compute RIPEMD160 hash
    const hash = ripemd160_hash(input);
    
    // Format output: 12 zero bytes + 20-byte hash (left-padding)
    @memset(output[0..RIPEMD160_OUTPUT_SIZE], 0);
    @memcpy(output[12..32], &hash);
    
    return PrecompileOutput.success_result(gas_cost, RIPEMD160_OUTPUT_SIZE);
}

/// Validates that a precompile call would succeed without executing
///
/// This function performs gas and input validation without actually executing
/// the hash computation. Useful for transaction validation and gas estimation.
///
/// @param input_size Size of the input data
/// @param gas_limit Available gas limit
/// @return true if the call would succeed
pub fn validate_call(input_size: usize, gas_limit: u64) bool {
    const gas_cost = calculate_gas(input_size);
    return gas_cost <= gas_limit;
}

/// Gets the expected output size for RIPEMD160 precompile
///
/// RIPEMD160 always returns exactly 32 bytes regardless of input size.
/// This consists of the 20-byte hash followed by 12 zero bytes.
///
/// @param input_size Size of input (unused, but kept for interface consistency)
/// @return Always returns 32
pub fn get_output_size(input_size: usize) usize {
    _ = input_size; // Unused parameter
    return RIPEMD160_OUTPUT_SIZE;
}

/// RIPEMD160 hasher implementation
///
/// This implements the RIPEMD160 cryptographic hash function according to the
/// specification. RIPEMD160 produces a 160-bit (20-byte) hash value.
///
/// The algorithm processes data in 512-bit (64-byte) blocks using a series of
/// operations on five 32-bit words. It's designed to be secure and efficient.
const RIPEMD160 = struct {
    /// Internal state: 5 x 32-bit words
    h: [5]u32,
    /// Input buffer for incomplete blocks
    buffer: [64]u8,
    /// Number of bytes in buffer
    buffer_len: u8,
    /// Total number of bytes processed
    total_len: u64,

    /// RIPEMD160 initialization values
    const INIT_H: [5]u32 = [5]u32{
        0x67452301,
        0xEFCDAB89, 
        0x98BADCFE,
        0x10325476,
        0xC3D2E1F0,
    };

    /// Initialize a new RIPEMD160 hasher
    pub fn init() RIPEMD160 {
        return RIPEMD160{
            .h = INIT_H,
            .buffer = [_]u8{0} ** 64,
            .buffer_len = 0,
            .total_len = 0,
        };
    }

    /// Update hasher with new data
    ///
    /// This function can be called multiple times to process data incrementally.
    /// Data is buffered internally and processed in 64-byte blocks.
    ///
    /// @param self Pointer to the hasher instance
    /// @param data Input data to process
    pub fn update(self: *RIPEMD160, data: []const u8) void {
        var offset: usize = 0;
        self.total_len += data.len;

        // If we have data in buffer, try to fill it
        if (self.buffer_len > 0) {
            const space_in_buffer = 64 - self.buffer_len;
            const bytes_to_copy = @min(space_in_buffer, data.len);
            
            @memcpy(self.buffer[self.buffer_len..self.buffer_len + bytes_to_copy], data[0..bytes_to_copy]);
            self.buffer_len += @intCast(bytes_to_copy);
            offset = bytes_to_copy;

            // If buffer is full, process it
            if (self.buffer_len == 64) {
                self.process_block(&self.buffer);
                self.buffer_len = 0;
            }
        }

        // Process complete 64-byte blocks
        while (offset + 64 <= data.len) {
            var block: [64]u8 = undefined;
            @memcpy(&block, data[offset..offset + 64]);
            self.process_block(&block);
            offset += 64;
        }

        // Store remaining bytes in buffer
        if (offset < data.len) {
            const remaining = data.len - offset;
            @memcpy(self.buffer[0..remaining], data[offset..]);
            self.buffer_len = @intCast(remaining);
        }
    }

    /// Finalize hash computation and return result
    ///
    /// This function applies the final padding, processes the last block,
    /// and returns the 20-byte RIPEMD160 hash value.
    ///
    /// @param self Pointer to the hasher instance
    /// @return 20-byte RIPEMD160 hash
    pub fn final(self: *RIPEMD160) [20]u8 {
        // Add padding: single 1 bit followed by zeros
        self.buffer[self.buffer_len] = 0x80;
        self.buffer_len += 1;

        // If not enough space for length, process current block and start new one
        if (self.buffer_len > 56) {
            @memset(self.buffer[self.buffer_len..], 0);
            self.process_block(&self.buffer);
            @memset(&self.buffer, 0);
            self.buffer_len = 0;
        }

        // Pad with zeros and append length
        @memset(self.buffer[self.buffer_len..56], 0);
        
        // Append bit length (total_len * 8) as little-endian 64-bit integer
        const bit_len = self.total_len * 8;
        std.mem.writeInt(u64, self.buffer[56..64], bit_len, .little);

        // Process final block
        self.process_block(&self.buffer);

        // Convert hash to bytes (little-endian)
        var result: [20]u8 = undefined;
        for (0..5) |i| {
            std.mem.writeInt(u32, result[i * 4..][0..4], self.h[i], .little);
        }

        return result;
    }

    /// Process a single 64-byte block
    ///
    /// This is the core RIPEMD160 compression function that processes one
    /// 512-bit block of data according to the algorithm specification.
    ///
    /// @param self Pointer to the hasher instance
    /// @param block 64-byte block to process
    fn process_block(self: *RIPEMD160, block: *const [64]u8) void {
        // Convert block to 16 32-bit words (little-endian)
        var x: [16]u32 = undefined;
        for (0..16) |i| {
            x[i] = std.mem.readInt(u32, block[i * 4..][0..4], .little);
        }

        // Initialize working variables
        var al = self.h[0];
        var bl = self.h[1]; 
        var cl = self.h[2];
        var dl = self.h[3];
        var el = self.h[4];
        
        var ar = self.h[0];
        var br = self.h[1];
        var cr = self.h[2]; 
        var dr = self.h[3];
        var er = self.h[4];

        // Left line rounds
        for (0..80) |i| {
            const f = switch (i / 16) {
                0 => bl ^ cl ^ dl,
                1 => (bl & cl) | (~bl & dl),
                2 => (bl | ~cl) ^ dl,
                3 => (bl & dl) | (cl & ~dl),
                4 => bl ^ (cl | ~dl),
                else => unreachable,
            };
            
            const k = switch (i / 16) {
                0 => @as(u32, 0x00000000),
                1 => @as(u32, 0x5A827999),
                2 => @as(u32, 0x6ED9EBA1),
                3 => @as(u32, 0x8F1BBCDC),
                4 => @as(u32, 0xA953FD4E),
                else => unreachable,
            };
            
            const r_table = [80]u8{
                // 0...15
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                // 16...31
                7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
                // 32...47
                3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
                // 48...63
                1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
                // 64...79
                4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
            };
            const r = r_table[i];
            
            const s_table = [80]u8{
                // 0...15
                11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
                // 16...31
                7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
                // 32...47
                11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
                // 48...63
                11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
                // 64...79
                9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
            };
            const s = s_table[i];

            const temp = al +% f +% x[r] +% k;
            const rotated = std.math.rotl(u32, temp, s) +% el;
            
            al = el;
            el = dl;
            dl = std.math.rotl(u32, cl, 10);
            cl = bl;
            bl = rotated;
        }

        // Right line rounds (similar structure with different constants)
        for (0..80) |i| {
            const f = switch (i / 16) {
                0 => br ^ (cr | ~dr),
                1 => (br & dr) | (cr & ~dr),
                2 => (br | ~cr) ^ dr,
                3 => (br & cr) | (~br & dr),
                4 => br ^ cr ^ dr,
                else => unreachable,
            };
            
            const k = switch (i / 16) {
                0 => @as(u32, 0x50A28BE6),
                1 => @as(u32, 0x5C4DD124),
                2 => @as(u32, 0x6D703EF3),
                3 => @as(u32, 0x7A6D76E9),
                4 => @as(u32, 0x00000000),
                else => unreachable,
            };
            
            const r_table_right = [80]u8{
                // 0...15
                5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
                // 16...31
                6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
                // 32...47
                15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
                // 48...63
                8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
                // 64...79
                12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
            };
            const r = r_table_right[i];
            
            const s_table_right = [80]u8{
                // 0...15
                8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
                // 16...31
                9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
                // 32...47
                9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
                // 48...63
                15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
                // 64...79
                8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
            };
            const s = s_table_right[i];

            const temp = ar +% f +% x[r] +% k;
            const rotated = std.math.rotl(u32, temp, s) +% er;
            
            ar = er;
            er = dr;
            dr = std.math.rotl(u32, cr, 10);
            cr = br;
            br = rotated;
        }

        // Combine results
        const temp = self.h[1] +% cl +% dr;
        self.h[1] = self.h[2] +% dl +% er;
        self.h[2] = self.h[3] +% el +% ar;
        self.h[3] = self.h[4] +% al +% br;
        self.h[4] = self.h[0] +% bl +% cr;
        self.h[0] = temp;
    }
};

/// Computes RIPEMD160 hash of input data
///
/// This is the main hash function that creates a hasher, processes all input data,
/// and returns the final 20-byte hash value.
///
/// @param input Data to hash
/// @return 20-byte RIPEMD160 hash
fn ripemd160_hash(input: []const u8) [20]u8 {
    var hasher = RIPEMD160.init();
    hasher.update(input);
    return hasher.final();
}