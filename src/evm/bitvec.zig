const std = @import("std");
const opcodes = @import("opcodes.zig");

/// BitVec is a bit vector implementation used for tracking JUMPDEST positions in bytecode
pub const BitVec = struct {
    /// Bit array stored in u64 chunks
    bits: []u64,
    /// Total length in bits
    size: usize,
    /// Whether this bitvec owns its memory (and should free it)
    owned: bool,

    /// Create a new BitVec with the given size
    pub fn init(allocator: std.mem.Allocator, size: usize) !BitVec {
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
    pub fn fromMemory(bits: []u64, size: usize) BitVec {
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
    pub fn set(self: *BitVec, pos: usize) void {
        if (pos >= self.size) return;
        const idx = pos / 64;
        const bit = @as(u64, 1) << @intCast(pos % 64);
        self.bits[idx] |= bit;
    }

    /// Clear a bit at the given position
    pub fn clear(self: *BitVec, pos: usize) void {
        if (pos >= self.size) return;
        const idx = pos / 64;
        const bit = @as(u64, 1) << @intCast(pos % 64);
        self.bits[idx] &= ~bit;
    }

    /// Check if a bit is set at the given position
    pub fn isSet(self: *const BitVec, pos: usize) bool {
        if (pos >= self.size) return false;
        const idx = pos / 64;
        const bit = @as(u64, 1) << @intCast(pos % 64);
        return (self.bits[idx] & bit) != 0;
    }

    /// Check if the position represents a valid code segment
    pub fn codeSegment(self: *const BitVec, pos: usize) bool {
        return self.isSet(pos);
    }
};

/// Analyze bytecode to identify valid JUMPDEST locations and code segments
pub fn codeBitmap(code: []const u8) BitVec {
    const allocator = std.heap.page_allocator;
    var bitmap = BitVec.init(allocator, code.len) catch {
        // If allocation fails, return an empty bitmap
        return BitVec{ .bits = &.{}, .size = 0, .owned = false };
    };
    
    // Mark all positions as valid code initially
    for (0..code.len) |i| {
        bitmap.set(i);
    }
    
    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];
        
        // If the opcode is a PUSH, skip the pushed bytes
        if (opcodes.isPush(op)) {
            const push_bytes = op - 0x5F; // Calculate number of bytes to push (PUSH1 = 1, etc.)
            
            // Mark pushed bytes as data (not code)
            var j: usize = 1;
            while (j <= push_bytes and i + j < code.len) : (j += 1) {
                bitmap.clear(i + j);
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

test "BitVec basic operations" {
    const allocator = std.testing.allocator;
    var bv = try BitVec.init(allocator, 128);
    defer bv.deinit(allocator);
    
    // Test setting and checking bits
    bv.set(0);
    bv.set(63);
    bv.set(64);
    bv.set(127);
    
    try std.testing.expect(bv.isSet(0));
    try std.testing.expect(bv.isSet(63));
    try std.testing.expect(bv.isSet(64));
    try std.testing.expect(bv.isSet(127));
    
    try std.testing.expect(!bv.isSet(1));
    try std.testing.expect(!bv.isSet(62));
    try std.testing.expect(!bv.isSet(65));
    try std.testing.expect(!bv.isSet(126));
    
    // Test clearing bits
    bv.clear(0);
    bv.clear(64);
    
    try std.testing.expect(!bv.isSet(0));
    try std.testing.expect(bv.isSet(63));
    try std.testing.expect(!bv.isSet(64));
    try std.testing.expect(bv.isSet(127));
}

test "codeBitmap with PUSH opcodes" {
    // Test bytecode with some PUSH instructions
    // PUSH1 0x01 PUSH2 0x0203 ADD
    const code = [_]u8{ 0x60, 0x01, 0x61, 0x02, 0x03, 0x01 };
    
    var bitmap = codeBitmap(&code);
    defer bitmap.deinit(std.heap.page_allocator);
    
    // The opcodes are valid code
    try std.testing.expect(bitmap.codeSegment(0)); // PUSH1
    try std.testing.expect(bitmap.codeSegment(2)); // PUSH2
    try std.testing.expect(bitmap.codeSegment(5)); // ADD
    
    // The pushed data is not valid code
    try std.testing.expect(!bitmap.codeSegment(1)); // 0x01 (data for PUSH1)
    try std.testing.expect(!bitmap.codeSegment(3)); // 0x02 (data for PUSH2)
    try std.testing.expect(!bitmap.codeSegment(4)); // 0x03 (data for PUSH2)
}