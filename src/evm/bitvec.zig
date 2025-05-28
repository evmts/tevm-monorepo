/// Production-quality BitVec module for EVM bytecode analysis
/// 
/// This module provides a high-performance bit vector implementation for tracking
/// JUMPDEST positions and valid code segments in EVM bytecode. It's optimized for
/// the critical path of bytecode execution where JUMP/JUMPI validation occurs.
/// 
/// Performance characteristics:
/// - O(1) bit access with minimal branching
/// - Cache-friendly memory layout using u64 chunks
/// - Zero-allocation path for common bytecode sizes
/// - SIMD-ready bit manipulation operations
/// 
/// Reference implementations:
/// - evmone: https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.cpp
/// - revm: https://github.com/bluealloy/revm/blob/main/crates/primitives/src/bytecode.rs

const std = @import("std");
const constants = @import("constants.zig");

/// Number of bits per chunk (using u64 for efficient operations)
const BITS_PER_CHUNK = 64;

/// Error types for BitVec operations
pub const BitVecError = error{
    /// Index out of bounds
    OutOfBounds,
    /// Allocation failure
    OutOfMemory,
};

/// High-performance bit vector for bytecode analysis
/// 
/// Memory layout optimized for cache efficiency:
/// - Bits are packed into u64 chunks for SIMD potential
/// - Bit 0 is the LSB of chunk 0
/// - Supports both owned and borrowed memory for flexibility
/// 
/// Example:
/// ```zig
/// var bv = try BitVec.init(allocator, 1024);
/// defer bv.deinit(allocator);
/// bv.set(100);
/// if (bv.isSet(100)) {
///     // Handle JUMPDEST at position 100
/// }
/// ```
pub const BitVec = struct {
    /// Bit storage in 64-bit chunks for efficient operations
    chunks: []u64,
    
    /// Total number of bits
    bit_count: usize,
    
    /// Number of u64 chunks
    chunk_count: usize,
    
    /// Whether this BitVec owns its memory
    owns_memory: bool,

    /// Static buffer for small bitvecs (avoids allocation for typical contracts)
    /// Most contracts are under 24KB, so 3072 bytes covers ~98% of cases
    const STATIC_BUFFER_SIZE = 48; // 48 * 64 = 3072 bits = 3KB
    
    /// Create a new BitVec with dynamic allocation
    /// 
    /// For performance-critical paths, consider using `initStatic` for small sizes.
    /// 
    /// Example:
    /// ```zig
    /// var bv = try BitVec.init(allocator, contract.code.len);
    /// defer bv.deinit(allocator);
    /// ```
    pub fn init(allocator: std.mem.Allocator, bit_count: usize) !BitVec {
        if (bit_count == 0) {
            return BitVec{
                .chunks = &.{},
                .bit_count = 0,
                .chunk_count = 0,
                .owns_memory = false,
            };
        }

        const chunk_count = (bit_count + BITS_PER_CHUNK - 1) / BITS_PER_CHUNK;
        const chunks = try allocator.alloc(u64, chunk_count);
        @memset(chunks, 0);

        return BitVec{
            .chunks = chunks,
            .bit_count = bit_count,
            .chunk_count = chunk_count,
            .owns_memory = true,
        };
    }

    /// Create a BitVec using a static buffer (no allocation)
    /// 
    /// This is the preferred method for typical contract sizes.
    /// Falls back to dynamic allocation for large contracts.
    /// 
    /// Example:
    /// ```zig
    /// var buffer: [BitVec.STATIC_BUFFER_SIZE]u64 = undefined;
    /// var bv = try BitVec.initStatic(&buffer, code.len, allocator);
    /// defer bv.deinit(allocator);
    /// ```
    pub fn initStatic(buffer: []u64, bit_count: usize, allocator: std.mem.Allocator) !BitVec {
        const needed_chunks = (bit_count + BITS_PER_CHUNK - 1) / BITS_PER_CHUNK;
        
        if (needed_chunks <= buffer.len) {
            // Use static buffer
            const chunks = buffer[0..needed_chunks];
            @memset(chunks, 0);
            return BitVec{
                .chunks = chunks,
                .bit_count = bit_count,
                .chunk_count = needed_chunks,
                .owns_memory = false,
            };
        } else {
            // Fall back to dynamic allocation
            return init(allocator, bit_count);
        }
    }

    /// Create a BitVec from existing memory (borrowed, not owned)
    /// 
    /// Useful for memory-mapped bytecode or pre-allocated buffers.
    /// 
    /// Example:
    /// ```zig
    /// var chunks = [_]u64{0xFF, 0x00, 0xFF00FF00};
    /// var bv = BitVec.fromSlice(&chunks, 192);
    /// ```
    pub fn fromSlice(chunks: []u64, bit_count: usize) BitVec {
        const chunk_count = (bit_count + BITS_PER_CHUNK - 1) / BITS_PER_CHUNK;
        return BitVec{
            .chunks = chunks[0..@min(chunk_count, chunks.len)],
            .bit_count = bit_count,
            .chunk_count = chunk_count,
            .owns_memory = false,
        };
    }

    /// Free allocated memory if owned
    pub fn deinit(self: *BitVec, allocator: std.mem.Allocator) void {
        if (self.owns_memory and self.chunks.len > 0) {
            allocator.free(self.chunks);
        }
        self.* = BitVec{
            .chunks = &.{},
            .bit_count = 0,
            .chunk_count = 0,
            .owns_memory = false,
        };
    }

    /// Set a bit at the given index
    /// 
    /// Performance: O(1) with no branching in the common path
    /// 
    /// Example:
    /// ```zig
    /// bv.set(256); // Mark position 256 as JUMPDEST
    /// ```
    pub inline fn set(self: *BitVec, index: usize) void {
        if (index >= self.bit_count) return;
        
        const chunk_idx = index / BITS_PER_CHUNK;
        const bit_idx: u6 = @truncate(index % BITS_PER_CHUNK);
        self.chunks[chunk_idx] |= @as(u64, 1) << bit_idx;
    }

    /// Clear a bit at the given index
    /// 
    /// Performance: O(1) with no branching in the common path
    pub inline fn clear(self: *BitVec, index: usize) void {
        if (index >= self.bit_count) return;
        
        const chunk_idx = index / BITS_PER_CHUNK;
        const bit_idx: u6 = @truncate(index % BITS_PER_CHUNK);
        self.chunks[chunk_idx] &= ~(@as(u64, 1) << bit_idx);
    }

    /// Check if a bit is set at the given index
    /// 
    /// Performance: O(1) with minimal branching
    /// This is on the critical path for JUMP validation.
    /// 
    /// Example:
    /// ```zig
    /// if (jumpdests.isSet(target)) {
    ///     // Valid jump target
    /// } else {
    ///     return error.InvalidJump;
    /// }
    /// ```
    pub inline fn isSet(self: *const BitVec, index: usize) bool {
        if (index >= self.bit_count) return false;
        
        const chunk_idx = index / BITS_PER_CHUNK;
        const bit_idx: u6 = @truncate(index % BITS_PER_CHUNK);
        return (self.chunks[chunk_idx] & (@as(u64, 1) << bit_idx)) != 0;
    }

    /// Toggle a bit at the given index
    pub inline fn toggle(self: *BitVec, index: usize) void {
        if (index >= self.bit_count) return;
        
        const chunk_idx = index / BITS_PER_CHUNK;
        const bit_idx: u6 = @truncate(index % BITS_PER_CHUNK);
        self.chunks[chunk_idx] ^= @as(u64, 1) << bit_idx;
    }

    /// Set all bits to 1
    pub fn setAll(self: *BitVec) void {
        @memset(self.chunks, 0xFFFFFFFFFFFFFFFF);
        
        // Clear unused bits in the last chunk
        const used_bits_in_last = self.bit_count % BITS_PER_CHUNK;
        if (used_bits_in_last != 0 and self.chunk_count > 0) {
            const mask = (@as(u64, 1) << @as(u6, @truncate(used_bits_in_last))) - 1;
            self.chunks[self.chunk_count - 1] &= mask;
        }
    }

    /// Clear all bits to 0
    pub fn clearAll(self: *BitVec) void {
        @memset(self.chunks, 0);
    }
    
    /// Set a bit without bounds checking (for performance)
    /// 
    /// # Safety
    /// Caller must ensure index < self.bit_count
    pub inline fn setUnchecked(self: *BitVec, index: usize) void {
        const chunk_idx = index / BITS_PER_CHUNK;
        const bit_idx: u6 = @truncate(index % BITS_PER_CHUNK);
        self.chunks[chunk_idx] |= @as(u64, 1) << bit_idx;
    }
    
    /// Clear a bit without bounds checking (for performance)
    /// 
    /// # Safety
    /// Caller must ensure index < self.bit_count
    pub inline fn clearUnchecked(self: *BitVec, index: usize) void {
        const chunk_idx = index / BITS_PER_CHUNK;
        const bit_idx: u6 = @truncate(index % BITS_PER_CHUNK);
        self.chunks[chunk_idx] &= ~(@as(u64, 1) << bit_idx);
    }
    
    /// Check if a bit is set without bounds checking (for performance)
    /// 
    /// # Safety
    /// Caller must ensure index < self.bit_count
    pub inline fn isSetUnchecked(self: *const BitVec, index: usize) bool {
        const chunk_idx = index / BITS_PER_CHUNK;
        const bit_idx: u6 = @truncate(index % BITS_PER_CHUNK);
        return (self.chunks[chunk_idx] & (@as(u64, 1) << bit_idx)) != 0;
    }

    /// Count the number of set bits (population count)
    /// 
    /// Uses hardware popcount instructions when available.
    pub fn popcount(self: *const BitVec) usize {
        var count: usize = 0;
        for (self.chunks) |chunk| {
            count += @popCount(chunk);
        }
        return count;
    }

    /// Find the first set bit, returns null if none found
    /// 
    /// Useful for iterating over JUMPDEST positions.
    pub fn findFirstSet(self: *const BitVec) ?usize {
        for (self.chunks, 0..) |chunk, chunk_idx| {
            if (chunk != 0) {
                const bit_idx = @ctz(chunk);
                const index = chunk_idx * BITS_PER_CHUNK + bit_idx;
                return if (index < self.bit_count) index else null;
            }
        }
        return null;
    }

    /// Find the next set bit after the given index
    pub fn findNextSet(self: *const BitVec, after_index: usize) ?usize {
        if (after_index >= self.bit_count) return null;
        
        const start_index = after_index + 1;
        if (start_index >= self.bit_count) return null;
        
        var chunk_idx = start_index / BITS_PER_CHUNK;
        const bit_idx: u6 = @truncate(start_index % BITS_PER_CHUNK);
        
        // Check remaining bits in the first chunk
        if (bit_idx != 0) {
            const mask = ~((@as(u64, 1) << bit_idx) - 1);
            const masked_chunk = self.chunks[chunk_idx] & mask;
            if (masked_chunk != 0) {
                const found_bit = @ctz(masked_chunk);
                const index = chunk_idx * BITS_PER_CHUNK + found_bit;
                return if (index < self.bit_count) index else null;
            }
            chunk_idx += 1;
        }
        
        // Check remaining chunks
        while (chunk_idx < self.chunk_count) : (chunk_idx += 1) {
            const chunk = self.chunks[chunk_idx];
            if (chunk != 0) {
                const found_bit = @ctz(chunk);
                const index = chunk_idx * BITS_PER_CHUNK + found_bit;
                return if (index < self.bit_count) index else null;
            }
        }
        
        return null;
    }

    /// Check if this is a valid code position (convenience alias)
    pub inline fn isValidCodePosition(self: *const BitVec, pc: usize) bool {
        return self.isSet(pc);
    }
    
    /// Get raw bytes of the bit vector (for serialization)
    /// 
    /// Returns a byte slice view of the underlying u64 chunks.
    /// This can be used to persist the bit vector to disk or send over network.
    /// 
    /// Example:
    /// ```zig
    /// const bytes = bv.asSlice();
    /// try file.writeAll(bytes);
    /// ```
    pub fn asSlice(self: *const BitVec) []const u8 {
        const byte_ptr = @as([*]const u8, @ptrCast(self.chunks.ptr));
        const byte_len = self.chunks.len * @sizeOf(u64);
        return byte_ptr[0..byte_len];
    }
    
    /// Create from raw bytes (for deserialization)
    /// 
    /// Reconstructs a BitVec from serialized bytes.
    /// The caller must ensure the byte slice is properly aligned and sized.
    /// 
    /// Example:
    /// ```zig
    /// const bytes = try file.readAll();
    /// const bv = try BitVec.fromBytes(allocator, bytes, 1024);
    /// defer bv.deinit(allocator);
    /// ```
    pub fn fromBytes(allocator: std.mem.Allocator, bytes: []const u8, bit_count: usize) !BitVec {
        const chunk_count = (bit_count + BITS_PER_CHUNK - 1) / BITS_PER_CHUNK;
        const needed_bytes = chunk_count * @sizeOf(u64);
        
        if (bytes.len < needed_bytes) {
            return error.InsufficientData;
        }
        
        const chunks = try allocator.alloc(u64, chunk_count);
        errdefer allocator.free(chunks);
        
        // Copy bytes to chunks
        const dest_bytes = @as([*]u8, @ptrCast(chunks.ptr));
        @memcpy(dest_bytes[0..needed_bytes], bytes[0..needed_bytes]);
        
        return BitVec{
            .chunks = chunks,
            .bit_count = bit_count,
            .chunk_count = chunk_count,
            .owns_memory = true,
        };
    }
};

/// Analyze bytecode to create a bitmap of valid code positions
/// 
/// This function identifies which bytes in the bytecode are actual opcodes
/// vs data bytes (e.g., PUSH arguments). This is critical for:
/// 1. JUMPDEST validation - only JUMPDEST in code sections are valid
/// 2. Preventing execution of data as code
/// 
/// Algorithm:
/// 1. Start with all positions marked as code
/// 2. When encountering PUSH opcodes, mark their data bytes as non-code
/// 3. Handle edge cases like truncated PUSH at end of bytecode
/// 
/// Performance notes:
/// - Single pass through bytecode (O(n))
/// - No allocations for typical contract sizes
/// - Optimized for sequential memory access
/// 
/// Example:
/// ```zig
/// const jumpdests = try analyzeJumpdests(allocator, contract.code);
/// defer jumpdests.deinit(allocator);
/// ```
pub fn analyzeCode(allocator: std.mem.Allocator, code: []const u8) !BitVec {
    // Use static buffer for typical contract sizes
    var static_buffer: [BitVec.STATIC_BUFFER_SIZE]u64 = undefined;
    var bitmap = try BitVec.initStatic(&static_buffer, code.len, allocator);
    errdefer bitmap.deinit(allocator);
    
    // Initially mark all positions as valid code
    bitmap.setAll();
    
    var pc: usize = 0;
    while (pc < code.len) {
        const opcode = code[pc];
        
        // Check if this is a PUSH instruction
        if (constants.isPush(opcode)) {
            const push_size = constants.getPushSize(opcode);
            
            // Mark the PUSH data bytes as non-code
            var i: usize = 1;
            while (i <= push_size and pc + i < code.len) : (i += 1) {
                bitmap.clear(pc + i);
            }
            
            // Skip past the PUSH instruction and its data
            pc += 1 + push_size;
        } else {
            pc += 1;
        }
    }
    
    return bitmap;
}

/// Analyze bytecode to find all valid JUMPDEST positions
/// 
/// This is a more specialized version that only tracks JUMPDEST opcodes
/// that appear in valid code sections (not in PUSH data).
/// 
/// Example:
/// ```zig
/// const jumpdests = try analyzeJumpdests(allocator, contract.code);
/// defer jumpdests.deinit(allocator);
/// if (!jumpdests.isSet(jump_target)) {
///     return error.InvalidJump;
/// }
/// ```
pub fn analyzeJumpdests(allocator: std.mem.Allocator, code: []const u8) !BitVec {
    // Use static buffer for typical contract sizes
    var static_buffer: [BitVec.STATIC_BUFFER_SIZE]u64 = undefined;
    var jumpdests = try BitVec.initStatic(&static_buffer, code.len, allocator);
    errdefer jumpdests.deinit(allocator);
    
    // Start with no JUMPDEST positions
    jumpdests.clearAll();
    
    var pc: usize = 0;
    while (pc < code.len) {
        const opcode = code[pc];
        
        if (opcode == constants.JUMPDEST) {
            jumpdests.set(pc);
            pc += 1;
        } else if (constants.isPush(opcode)) {
            const push_size = constants.getPushSize(opcode);
            // Skip past the PUSH instruction and its data
            pc += 1 + push_size;
        } else {
            pc += 1;
        }
    }
    
    return jumpdests;
}

/// Combined analysis result for optimal performance
pub const CodeAnalysis = struct {
    /// Valid code positions (vs PUSH data)
    code_bitmap: BitVec,
    /// Valid JUMPDEST positions
    jumpdest_bitmap: BitVec,
    
    pub fn deinit(self: *CodeAnalysis, allocator: std.mem.Allocator) void {
        self.code_bitmap.deinit(allocator);
        self.jumpdest_bitmap.deinit(allocator);
    }
};

/// Perform combined analysis in a single pass for optimal performance
/// 
/// This is the most efficient way to analyze bytecode as it does everything
/// in a single pass with optimal cache usage.
/// 
/// Example:
/// ```zig
/// const analysis = try analyzeBytecode(allocator, contract.code);
/// defer analysis.deinit(allocator);
/// 
/// // Validate a jump
/// if (!analysis.jumpdest_bitmap.isSet(target)) {
///     return error.InvalidJump;
/// }
/// ```
pub fn analyzeBytecode(allocator: std.mem.Allocator, code: []const u8) !CodeAnalysis {
    // Use static buffers for typical contract sizes
    var code_buffer: [BitVec.STATIC_BUFFER_SIZE]u64 = undefined;
    var jumpdest_buffer: [BitVec.STATIC_BUFFER_SIZE]u64 = undefined;
    
    var code_bitmap = try BitVec.initStatic(&code_buffer, code.len, allocator);
    errdefer code_bitmap.deinit(allocator);
    
    var jumpdest_bitmap = try BitVec.initStatic(&jumpdest_buffer, code.len, allocator);
    errdefer jumpdest_bitmap.deinit(allocator);
    
    // Initially mark all positions as valid code
    code_bitmap.setAll();
    jumpdest_bitmap.clearAll();
    
    var pc: usize = 0;
    while (pc < code.len) {
        const opcode = code[pc];
        
        // Track JUMPDEST positions
        if (opcode == constants.JUMPDEST) {
            jumpdest_bitmap.set(pc);
        }
        
        // Handle PUSH instructions
        if (constants.isPush(opcode)) {
            const push_size = constants.getPushSize(opcode);
            
            // Mark the PUSH data bytes as non-code
            var i: usize = 1;
            while (i <= push_size and pc + i < code.len) : (i += 1) {
                code_bitmap.clear(pc + i);
            }
            
            // Skip past the PUSH instruction and its data
            pc += 1 + push_size;
        } else {
            pc += 1;
        }
    }
    
    return CodeAnalysis{
        .code_bitmap = code_bitmap,
        .jumpdest_bitmap = jumpdest_bitmap,
    };
}

/// Result of bytecode analysis with safe padding
pub const PaddedAnalysis = struct {
    /// Bitmap of valid JUMPDEST positions
    jumpdest_bitmap: BitVec,
    /// Padded bytecode (ensures proper termination)
    padded_code: []u8,
    /// Whether the code was padded
    was_padded: bool,
    
    pub fn deinit(self: *PaddedAnalysis, allocator: std.mem.Allocator) void {
        self.jumpdest_bitmap.deinit(allocator);
        allocator.free(self.padded_code);
    }
};

/// Analyze bytecode and ensure safe execution padding
/// 
/// This function performs comprehensive bytecode analysis including:
/// 1. Finding all valid JUMPDEST positions
/// 2. Ensuring bytecode ends with STOP opcode
/// 3. Padding incomplete PUSH instructions
/// 
/// The padding ensures that:
/// - Bytecode always ends with a STOP opcode
/// - Incomplete PUSH instructions at the end are padded with zeros
/// - The VM never reads beyond valid bytecode
/// 
/// Example:
/// ```zig
/// const analysis = try analyzeWithPadding(allocator, contract.code);
/// defer analysis.deinit(allocator);
/// 
/// // Use padded code for execution
/// vm.execute(analysis.padded_code);
/// 
/// // Validate jump destinations
/// if (!analysis.jumpdest_bitmap.isSet(jump_target)) {
///     return error.InvalidJump;
/// }
/// ```
pub fn analyzeWithPadding(allocator: std.mem.Allocator, code: []const u8) !PaddedAnalysis {
    if (code.len == 0) {
        // Empty code needs just a STOP opcode
        const padded = try allocator.alloc(u8, 1);
        padded[0] = constants.STOP;
        
        const jumpdests = try BitVec.init(allocator, 0);
        
        return PaddedAnalysis{
            .jumpdest_bitmap = jumpdests,
            .padded_code = padded,
            .was_padded = true,
        };
    }
    
    // Use static buffer for typical contract sizes
    var static_buffer: [BitVec.STATIC_BUFFER_SIZE]u64 = undefined;
    var jumpdests = try BitVec.initStatic(&static_buffer, code.len, allocator);
    errdefer jumpdests.deinit(allocator);
    
    jumpdests.clearAll();
    
    // Analyze bytecode
    var pc: usize = 0;
    var last_opcode: u8 = 0;
    
    while (pc < code.len) {
        const opcode = code[pc];
        last_opcode = opcode;
        
        if (opcode == constants.JUMPDEST) {
            jumpdests.setUnchecked(pc);
            pc += 1;
        } else if (constants.isPush(opcode)) {
            const push_size = constants.getPushSize(opcode);
            // Skip the opcode and its data
            pc += 1 + push_size;
        } else {
            pc += 1;
        }
    }
    
    // Calculate padding needed
    const overshoot = if (pc > code.len) pc - code.len else 0;
    const needs_stop = last_opcode != constants.STOP;
    const padding_size = overshoot + @as(usize, @intFromBool(needs_stop));
    
    // Create padded bytecode if needed
    const padded_code = if (padding_size > 0) blk: {
        const padded = try allocator.alloc(u8, code.len + padding_size);
        @memcpy(padded[0..code.len], code);
        @memset(padded[code.len..], constants.STOP);
        break :blk padded;
    } else blk: {
        // No padding needed, but we still need to copy
        const padded = try allocator.alloc(u8, code.len);
        @memcpy(padded, code);
        break :blk padded;
    };
    
    return PaddedAnalysis{
        .jumpdest_bitmap = jumpdests,
        .padded_code = padded_code,
        .was_padded = padding_size > 0,
    };
}
