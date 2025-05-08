//! Memory management for ZigEVM
//! This module implements a high-performance, memory-efficient EVM memory model
//! based on data-oriented design principles.
//!
//! Memory Management Architecture:
//! ┌──────────────────────────────────────────────────────────────┐
//! │                        Code Segment                         │
//! │  (text + rodata, loaded at program start)                    │
//! │                                                              │
//! │  ┌────────────────────────────────────────────────────────┐  │
//! │  │ Jump-Table (256 fn-ptrs)                             │  │
//! │  │  • 256 × 8 bytes = 2 KiB                             │  │
//! │  │  • Populated at compile-time; lives in .rodata       │  │
//! │  └────────────────────────────────────────────────────────┘  │
//! └──────────────────────────────────────────────────────────────┘
//!
//! ┌──────────────────────────────────────────────────────────────┐
//! │                        Heap Region                         │
//! │  (allocations via allocator during execution)               │
//! │                                                              │
//! │  ┌────────────────────────────────────────────────────────┐  │
//! │  │ BlockInfo Array (For advanced interpreter)            │  │
//! │  │  • One entry per basic-block in the bytecode          │  │
//! │  │  • Allocated once during bytecode analysis phase      │  │
//! │  │    (e.g. at contract load or first execute)           │  │
//! │  └────────────────────────────────────────────────────────┘  │
//! │                                                              │
//! │  ┌────────────────────────────────────────────────────────┐  │
//! │  │ EVM Memory Pages                                      │  │
//! │  │  • Grows in 4 KiB pages, doubling capacity            │  │
//! │  │  • First page allocated on first MSTORE/MLOAD          │  │
//! │  │  • Subsequent growth via fast realloc                 │  │
//! │  └────────────────────────────────────────────────────────┘  │
//! └──────────────────────────────────────────────────────────────┘
//!
//! ┌──────────────────────────────────────────────────────────────┐
//! │                        Stack Region                        │
//! │  (per-call stack frames, no dynamic allocation)            │
//! │                                                              │
//! │  ┌────────────────────────────────────────────────────────┐  │
//! │  │ ExecutionState struct                                 │  │
//! │  │  • `stack[1024]` array (8 KiB)                        │  │
//! │  │  • Local to `execute()` on the Zig call stack         │  │
//! │  │  • `pc`, `sp`, small fixed-size fields                │  │
//! │  └────────────────────────────────────────────────────────┘  │
//! └──────────────────────────────────────────────────────────────┘

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;

/// MemoryPage represents a single page of EVM memory
/// This struct tracks both the physical allocated memory and logical size
pub const MemoryPage = struct {
    /// The actual memory buffer (physically allocated)
    buffer: []u8,
    /// Current logical size in use (may be smaller than buffer.len)
    size: usize,
    /// Allocator used for this page
    allocator: std.mem.Allocator,
    
    /// Create a new memory page with the given size
    pub fn init(allocator: std.mem.Allocator, capacity: usize) !MemoryPage {
        // Allocate the memory buffer with alignment for optimal memory access
        const buffer = try allocator.alignedAlloc(u8, 16, capacity);
        // Zero-initialize all memory (EVM spec requires clean memory)
        @memset(buffer, 0);
        
        return MemoryPage{
            .buffer = buffer,
            .size = 0,
            .allocator = allocator,
        };
    }
    
    /// Free the memory page
    pub fn deinit(self: *MemoryPage) void {
        self.allocator.free(self.buffer);
        self.buffer = &[_]u8{};
        self.size = 0;
    }
    
    /// Expand the page to the new capacity
    pub fn expand(self: *MemoryPage, new_capacity: usize) !void {
        // Only expand if the requested capacity exceeds current buffer size
        if (new_capacity <= self.buffer.len) return;
        
        // Reallocate with new capacity
        const new_buffer = try self.allocator.reallocAtLeast(self.buffer, new_capacity);
        
        // Zero out newly allocated memory
        if (new_buffer.len > self.buffer.len) {
            @memset(new_buffer[self.buffer.len..], 0);
        }
        
        // Update the buffer reference
        self.buffer = new_buffer;
    }
};

/// EVM Memory implementation that efficiently manages memory expansion and gas costs
/// Uses a data-oriented design for optimal performance
pub const Memory = struct {
    /// Physical memory storage (lazily allocated and expanded in powers of 2)
    page: MemoryPage,
    /// Logical size of memory in bytes (as seen by EVM operations)
    size: usize = 0,
    /// Memory allocator for dynamic growth
    allocator: std.mem.Allocator,
    
    // Cached values for gas calculation to avoid redundant work
    last_gas_cost: u64 = 0,
    last_words: usize = 0,
    
    /// Initialize a new Memory instance
    /// Memory is lazily allocated on first access
    pub fn init(allocator: std.mem.Allocator) !Memory {
        // Initial page size is 4KB (one typical OS page)
        // Memory is aligned to 16 bytes for optimal SIMD operations
        const initial_capacity = 4096; // 4KB initial allocation
        const page = try MemoryPage.init(allocator, initial_capacity);
        
        return Memory{
            .page = page,
            .allocator = allocator,
        };
    }
    
    /// Clean up memory allocation
    pub fn deinit(self: *Memory) void {
        self.page.deinit();
        self.size = 0;
        self.last_gas_cost = 0;
        self.last_words = 0;
    }
    
    /// Expand memory to at least new_size bytes and calculate gas cost
    /// Returns the gas cost of the expansion
    pub fn expand(self: *Memory, new_size: usize) u64 {
        // No expansion needed if already large enough
        if (new_size <= self.size) {
            return 0;
        }
        
        // Round up to nearest word (32 bytes) as per EVM spec
        const words_required = (new_size + 31) / 32;
        
        // If we already calculated gas for this or larger size, return 0
        if (words_required <= self.last_words) {
            return 0;
        }
        
        // Ensure capacity - use exponential growth to minimize allocations
        if (new_size > self.page.buffer.len) {
            // Double capacity strategy: 4KB → 8KB → 16KB → 32KB → ...
            // This minimizes the number of reallocations while keeping
            // memory usage reasonable
            var new_capacity = self.page.buffer.len;
            while (new_capacity < new_size) {
                new_capacity *= 2;
            }
            
            // Reallocate memory buffer
            self.page.expand(new_capacity) catch {
                @panic("Memory allocation failed during expansion");
            };
        }
        
        // Calculate gas cost using the EVM gas model
        const new_gas_cost = memoryGasCost(words_required);
        const gas = new_gas_cost - self.last_gas_cost;
        
        // Update cached values to avoid redundant calculations
        self.last_words = words_required;
        self.last_gas_cost = new_gas_cost;
        self.size = new_size;
        
        return gas;
    }
    
    /// Calculate gas cost for a given number of words
    /// Gas formula: 3 * words + words * words / 512
    /// This implements the EVM memory expansion gas cost model
    fn memoryGasCost(words: usize) u64 {
        const squared = words * words;
        return @as(u64, 3) * @as(u64, @intCast(words)) + @as(u64, @intCast(squared / 512));
    }
    
    /// Store a single byte to memory
    pub fn store8(self: *Memory, offset: usize, value: u8) void {
        // Ensure memory is large enough
        _ = self.expand(offset + 1);
        self.page.buffer[offset] = value;
    }
    
    /// Store bytes to memory
    pub fn store(self: *Memory, offset: usize, value: []const u8) void {
        if (value.len == 0) return;
        
        // Ensure memory is large enough
        _ = self.expand(offset + value.len);
        @memcpy(self.page.buffer[offset..][0..value.len], value);
    }
    
    /// Store a 32-byte word (U256) to memory
    pub fn store32(self: *Memory, offset: usize, value: U256) void {
        // Ensure memory is large enough
        _ = self.expand(offset + 32);
        
        // Efficiently write U256 to memory
        var bytes: [32]u8 = undefined;
        value.toBytes(&bytes);
        @memcpy(self.page.buffer[offset..][0..32], &bytes);
    }
    
    /// Load a 32-byte word (U256) from memory
    pub fn load32(self: *Memory, offset: usize) U256 {
        // If offset beyond size, return zeros (EVM spec)
        if (offset >= self.size) {
            return U256.zero();
        }
        
        // Calculate available bytes
        const available = std.math.min(32, self.size - offset);
        
        // Prepare bytes array with zeros
        var bytes: [32]u8 = [_]u8{0} ** 32;
        
        // Copy available bytes
        @memcpy(bytes[0..available], self.page.buffer[offset..][0..available]);
        
        // Convert to U256
        return U256.fromBytes(&bytes) catch U256.zero();
    }
    
    /// Copy data within memory
    pub fn copy(self: *Memory, dest_offset: usize, src_offset: usize, length: usize) void {
        if (length == 0) {
            return;
        }
        
        // Ensure memory is large enough for destination
        _ = self.expand(dest_offset + length);
        
        // Compute actual bytes to copy (EVM spec: reading beyond size returns zeros)
        const available_src = if (src_offset >= self.size) 0 else std.math.min(length, self.size - src_offset);
        
        // Zero out the destination area first
        @memset(self.page.buffer[dest_offset..][0..length], 0);
        
        // Copy available data if any
        if (available_src > 0) {
            // Handle potential overlap with copyForwards
            std.mem.copyForwards(u8, 
                self.page.buffer[dest_offset..][0..available_src],
                self.page.buffer[src_offset..][0..available_src]
            );
        }
    }
    
    /// Get a slice of memory (zero-copy where possible)
    pub fn slice(self: *Memory, offset: usize, length: usize) ![]u8 {
        // Ensure memory is large enough
        _ = self.expand(offset + length);
        
        return self.page.buffer[offset..][0..length];
    }
    
    /// Get the current size of memory in bytes
    pub fn getSize(self: *const Memory) usize {
        return self.size;
    }
    
    /// Get the current capacity of memory in bytes
    pub fn getCapacity(self: *const Memory) usize {
        return self.page.buffer.len;
    }
    
    /// Get the current gas cost of memory
    pub fn getGasCost(self: *const Memory) u64 {
        return self.last_gas_cost;
    }
    
    /// Reset memory to zero
    /// Keeps the allocated memory but resets size to 0
    pub fn reset(self: *Memory) void {
        if (self.size > 0) {
            @memset(self.page.buffer[0..self.size], 0);
        }
        self.size = 0;
        self.last_gas_cost = 0;
        self.last_words = 0;
    }
    
    /// Access to the raw buffer (for advanced use cases)
    pub fn getRawBuffer(self: *const Memory) []const u8 {
        return self.page.buffer;
    }
};

/// BlockInfo stores metadata about a basic block in the bytecode
/// Used by the advanced interpreter for optimized gas metering
pub const BlockInfo = struct {
    /// Offset in bytecode where this block starts
    offset: usize,
    /// Size of the block in bytes
    size: usize,
    /// Precalculated gas cost for this block
    gas_cost: u64,
    /// Maximum stack height required for this block
    max_stack: u16,
    
    /// Create a new BlockInfo
    pub fn init(offset: usize, size: usize, gas_cost: u64, max_stack: u16) BlockInfo {
        return BlockInfo{
            .offset = offset,
            .size = size,
            .gas_cost = gas_cost,
            .max_stack = max_stack,
        };
    }
};

/// BlockInfoManager maintains a list of basic blocks for optimized execution
pub const BlockInfoManager = struct {
    /// Array of block info entries, indexed by their offset in the bytecode
    blocks: []BlockInfo,
    /// Allocator used for this manager
    allocator: std.mem.Allocator,
    
    /// Initialize a block info manager from analyzed bytecode
    pub fn init(allocator: std.mem.Allocator, blocks: []BlockInfo) !BlockInfoManager {
        // Create a copy of the blocks array
        const blocks_copy = try allocator.alloc(BlockInfo, blocks.len);
        @memcpy(blocks_copy, blocks);
        
        return BlockInfoManager{
            .blocks = blocks_copy,
            .allocator = allocator,
        };
    }
    
    /// Free the block info resources
    pub fn deinit(self: *BlockInfoManager) void {
        self.allocator.free(self.blocks);
        self.blocks = &[_]BlockInfo{};
    }
    
    /// Find a block at the given offset
    pub fn findBlock(self: *const BlockInfoManager, offset: usize) ?*const BlockInfo {
        for (self.blocks) |*block| {
            if (block.offset == offset) {
                return block;
            }
        }
        return null;
    }
    
    /// Get the number of blocks
    pub fn getBlockCount(self: *const BlockInfoManager) usize {
        return self.blocks.len;
    }
};

/// Shared memory implementation that allows efficient memory sharing between call frames
pub const SharedMemory = struct {
    memory: *Memory,
    checkpoint_size: usize,
    
    /// Initialize shared memory with an existing memory instance
    pub fn init(memory: *Memory) SharedMemory {
        return .{
            .memory = memory,
            .checkpoint_size = memory.size,
        };
    }
    
    /// Restore memory size to checkpoint (content remains unchanged)
    /// This is used when returning from an EVM call to restore the parent's
    /// memory size while preserving the content of memory that may have
    /// been written by the child call.
    pub fn restore(self: *SharedMemory) void {
        self.memory.size = self.checkpoint_size;
        self.memory.last_words = (self.checkpoint_size + 31) / 32;
        self.memory.last_gas_cost = Memory.memoryGasCost(self.memory.last_words);
    }
    
    /// Get the current size of memory
    pub fn size(self: *const SharedMemory) usize {
        return self.memory.size;
    }
};

// Tests
test "Memory basic operations" {
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Test initial state
    try std.testing.expect(memory.size == 0);
    try std.testing.expect(memory.getCapacity() >= 4096);
    
    // Test expansion
    const gas_cost = memory.expand(100);
    try std.testing.expect(gas_cost > 0);
    try std.testing.expect(memory.size == 100);
    
    // Additional expansion should only charge for the difference
    const gas_cost2 = memory.expand(200);
    try std.testing.expect(gas_cost2 > 0);
    try std.testing.expect(memory.size == 200);
    
    // No gas for same size
    const gas_cost3 = memory.expand(200);
    try std.testing.expect(gas_cost3 == 0);
}

test "Memory store and load" {
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Test store8
    memory.store8(0, 0x42);
    try std.testing.expect(memory.page.buffer[0] == 0x42);
    try std.testing.expect(memory.size == 1);
    
    // Test store
    const bytes = [_]u8{0x10, 0x20, 0x30, 0x40};
    memory.store(10, &bytes);
    try std.testing.expect(memory.page.buffer[10] == 0x10);
    try std.testing.expect(memory.page.buffer[13] == 0x40);
    try std.testing.expect(memory.size == 14);
    
    // Test store32 and load32
    const value = U256.fromU64(0x1234567890);
    memory.store32(20, value);
    try std.testing.expect(memory.size == 52);
    
    const loaded = memory.load32(20);
    try std.testing.expect(loaded.eq(value));
    
    // Test load beyond size
    const zero = memory.load32(1000);
    try std.testing.expect(zero.isZero());
}

test "Memory copy" {
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Setup some data
    const bytes = [_]u8{0x10, 0x20, 0x30, 0x40, 0x50};
    memory.store(10, &bytes);
    
    // Test copy within memory
    memory.copy(20, 10, 5);
    try std.testing.expect(memory.page.buffer[20] == 0x10);
    try std.testing.expect(memory.page.buffer[24] == 0x50);
    
    // Test copy with overlap
    memory.copy(12, 10, 3);
    try std.testing.expect(memory.page.buffer[12] == 0x10);
    try std.testing.expect(memory.page.buffer[14] == 0x30);
    
    // Test copy from beyond size
    memory.copy(30, 100, 3);
    try std.testing.expect(memory.page.buffer[30] == 0);
    try std.testing.expect(memory.page.buffer[32] == 0);
}

test "SharedMemory operations" {
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Setup some data
    memory.store8(10, 0xAA);
    memory.store8(20, 0xBB);
    try std.testing.expect(memory.size == 21);
    
    // Create shared memory with a checkpoint
    var shared = SharedMemory.init(&memory);
    try std.testing.expect(shared.checkpoint_size == 21);
    
    // Modify memory beyond checkpoint
    memory.store8(30, 0xCC);
    try std.testing.expect(memory.size == 31);
    
    // Restore to checkpoint
    shared.restore();
    try std.testing.expect(memory.size == 21);
    
    // Verify data is still intact
    try std.testing.expect(memory.page.buffer[10] == 0xAA);
    try std.testing.expect(memory.page.buffer[20] == 0xBB);
    try std.testing.expect(memory.page.buffer[30] == 0xCC); // Content is preserved even beyond size
}

test "BlockInfoManager operations" {
    // Create some test blocks
    var blocks = [_]BlockInfo{
        BlockInfo.init(0, 10, 100, 2),
        BlockInfo.init(10, 5, 50, 3),
        BlockInfo.init(15, 8, 80, 4),
    };
    
    // Create a manager
    var manager = try BlockInfoManager.init(std.testing.allocator, &blocks);
    defer manager.deinit();
    
    // Test finding blocks
    const block0 = manager.findBlock(0);
    try std.testing.expect(block0 != null);
    try std.testing.expect(block0.?.gas_cost == 100);
    
    const block10 = manager.findBlock(10);
    try std.testing.expect(block10 != null);
    try std.testing.expect(block10.?.max_stack == 3);
    
    // Test non-existent block
    const nonexistent = manager.findBlock(100);
    try std.testing.expect(nonexistent == null);
    
    // Test block count
    try std.testing.expect(manager.getBlockCount() == 3);
}