const std = @import("std");
const constants = @import("../constants/constants.zig");

/// BitVec is a bit vector implementation used for tracking JUMPDEST positions in bytecode
const BitVec = @This();

/// Bit array stored in u64 chunks
bits: []u64,
/// Total length in bits
size: usize,
/// Whether this bitvec owns its memory (and should free it)
owned: bool,

/// Error types for BitVec operations
pub const BitVecError = error{
    /// Position is out of bounds for the bit vector
    PositionOutOfBounds,
};

/// Error type for BitVec initialization
pub const BitVecInitError = std.mem.Allocator.Error;

/// Error type for code bitmap creation
pub const CodeBitmapError = BitVecInitError;

/// Create a new BitVec with the given size
pub fn init(allocator: std.mem.Allocator, size: usize) BitVecInitError!BitVec {
    const u64_size = (size + 63) / 64; // Round up to nearest u64
    const bits = try allocator.alloc(u64, u64_size);
    @memset(bits, 0); // Initialize all bits to 0
    return BitVec{
        .bits = bits,
        .size = size,
        .owned = true,
    };
}

/// Create a BitVec from existing memory (not owned)
pub fn from_memory(bits: []u64, size: usize) BitVec {
    return BitVec{
        .bits = bits,
        .size = size,
        .owned = false,
    };
}

/// Free allocated memory if owned
pub fn deinit(self: *BitVec, allocator: std.mem.Allocator) void {
    if (self.owned) {
        allocator.free(self.bits);
        self.bits = &.{};
        self.size = 0;
    }
}

/// Set a bit at the given position
pub fn set(self: *BitVec, pos: usize) BitVecError!void {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] |= bit;
}

/// Set a bit at the given position without bounds checking
pub fn set_unchecked(self: *BitVec, pos: usize) void {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] |= bit;
}

/// Clear a bit at the given position
pub fn clear(self: *BitVec, pos: usize) BitVecError!void {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] &= ~bit;
}

/// Clear a bit at the given position without bounds checking
pub fn clear_unchecked(self: *BitVec, pos: usize) void {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] &= ~bit;
}

/// Check if a bit is set at the given position
pub fn is_set(self: *const BitVec, pos: usize) BitVecError!bool {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    return (self.bits[idx] & bit) != 0;
}

/// Check if a bit is set at the given position without bounds checking
pub fn is_set_unchecked(self: *const BitVec, pos: usize) bool {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    return (self.bits[idx] & bit) != 0;
}

/// Check if the position represents a valid code segment
pub fn code_segment(self: *const BitVec, pos: usize) BitVecError!bool {
    return self.is_set(pos);
}

/// Check if the position represents a valid code segment without bounds checking
pub fn code_segment_unchecked(self: *const BitVec, pos: usize) bool {
    return self.is_set_unchecked(pos);
}

/// Analyze bytecode to identify valid JUMPDEST locations and code segments
pub fn code_bitmap(allocator: std.mem.Allocator, code: []const u8) CodeBitmapError!BitVec {
    var bitmap = try BitVec.init(allocator, code.len);
    errdefer bitmap.deinit(allocator);

    // Mark all positions as valid code initially
    for (0..code.len) |i| {
        bitmap.set_unchecked(i);
    }

    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];

        // If the opcode is a PUSH, skip the pushed bytes
        if (constants.is_push(op)) {
            const push_bytes = constants.get_push_size(op); // Get number of bytes to push

            // Mark pushed bytes as data (not code)
            var j: usize = 1;
            while (j <= push_bytes and i + j < code.len) : (j += 1) {
                bitmap.clear_unchecked(i + j);
            }

            // Skip the pushed bytes
            if (i + push_bytes + 1 < code.len) {
                i += push_bytes + 1;
            } else {
                i = code.len;
            }
        } else {
            i += 1;
        }
    }

    return bitmap;
}

