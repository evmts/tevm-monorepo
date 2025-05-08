//! Memory management for ZigEVM
//! This module implements the linear memory model used by the EVM

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;

/// EVM Memory implementation that efficiently manages memory expansion and gas costs
pub const Memory = struct {
    // Initial allocation size (4KB)
    data: []u8,
    size: usize = 0,
    allocator: std.mem.Allocator,
    
    // Cached values for gas calculation
    last_gas_cost: u64 = 0,
    last_words: usize = 0,
    
    /// Initialize a new Memory instance
    pub fn init(allocator: std.mem.Allocator) !Memory {
        const initial_size = 4096; // 4KB initial allocation
        const data = try allocator.alloc(u8, initial_size);
        // Zero out memory
        @memset(data, 0);
        
        return Memory{
            .data = data,
            .allocator = allocator,
        };
    }
    
    /// Clean up memory allocation
    pub fn deinit(self: *Memory) void {
        self.allocator.free(self.data);
        self.data = &[_]u8{};
        self.size = 0;
    }
    
    /// Expand memory to at least new_size bytes and calculate gas cost
    pub fn expand(self: *Memory, new_size: usize) u64 {
        if (new_size <= self.size) {
            return 0;
        }
        
        // Round up to nearest word
        const words_required = (new_size + 31) / 32;
        
        // If we already calculated gas for this size or larger, return 0
        if (words_required <= self.last_words) {
            return 0;
        }
        
        // Ensure capacity - use exponential growth to minimize allocations
        if (new_size > self.data.len) {
            // Double capacity strategy
            var new_capacity = self.data.len;
            while (new_capacity < new_size) {
                new_capacity *= 2;
            }
            
            // Reallocate memory
            self.data = self.allocator.realloc(self.data, new_capacity) catch {
                @panic("Memory allocation failed");
            };
            
            // Zero out the newly allocated memory
            @memset(self.data[self.size..new_capacity], 0);
        }
        
        // Calculate gas cost
        const new_gas_cost = memoryGasCost(words_required);
        const gas = new_gas_cost - self.last_gas_cost;
        
        // Update cached values
        self.last_words = words_required;
        self.last_gas_cost = new_gas_cost;
        self.size = new_size;
        
        return gas;
    }
    
    /// Calculate gas cost for a given number of words
    /// Gas formula: 3 * words + words * words / 512
    fn memoryGasCost(words: usize) u64 {
        const squared = words * words;
        return @as(u64, 3) * @as(u64, @intCast(words)) + @as(u64, @intCast(squared / 512));
    }
    
    /// Store a single byte to memory
    pub fn store8(self: *Memory, offset: usize, value: u8) void {
        // Ensure memory is large enough
        _ = self.expand(offset + 1);
        self.data[offset] = value;
    }
    
    /// Store bytes to memory
    pub fn store(self: *Memory, offset: usize, value: []const u8) void {
        if (value.len == 0) return;
        
        // Ensure memory is large enough
        _ = self.expand(offset + value.len);
        @memcpy(self.data[offset..][0..value.len], value);
    }
    
    /// Store a 32-byte word (U256) to memory
    pub fn store32(self: *Memory, offset: usize, value: U256) void {
        // Ensure memory is large enough
        _ = self.expand(offset + 32);
        
        // Efficiently write U256 to memory
        var bytes: [32]u8 = undefined;
        value.toBytes(&bytes);
        @memcpy(self.data[offset..][0..32], &bytes);
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
        @memcpy(bytes[0..available], self.data[offset..][0..available]);
        
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
        @memset(self.data[dest_offset..][0..length], 0);
        
        // Copy available data if any
        if (available_src > 0) {
            // Handle potential overlap with memmove
            std.mem.copyForwards(u8, 
                self.data[dest_offset..][0..available_src],
                self.data[src_offset..][0..available_src]
            );
        }
    }
    
    /// Get a slice of memory (zero-copy where possible)
    pub fn slice(self: *Memory, offset: usize, length: usize) ![]u8 {
        // Ensure memory is large enough
        _ = self.expand(offset + length);
        
        return self.data[offset..][0..length];
    }
    
    /// Get the current size of memory in bytes
    pub fn getSize(self: *const Memory) usize {
        return self.size;
    }
    
    /// Get the current capacity of memory in bytes
    pub fn getCapacity(self: *const Memory) usize {
        return self.data.len;
    }
    
    /// Get the current gas cost of memory
    pub fn getGasCost(self: *const Memory) u64 {
        return self.last_gas_cost;
    }
    
    /// Reset memory to zero
    pub fn reset(self: *Memory) void {
        if (self.size > 0) {
            @memset(self.data[0..self.size], 0);
        }
        self.size = 0;
        self.last_gas_cost = 0;
        self.last_words = 0;
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
    try std.testing.expect(memory.data[0] == 0x42);
    try std.testing.expect(memory.size == 1);
    
    // Test store
    const bytes = [_]u8{0x10, 0x20, 0x30, 0x40};
    memory.store(10, &bytes);
    try std.testing.expect(memory.data[10] == 0x10);
    try std.testing.expect(memory.data[13] == 0x40);
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
    try std.testing.expect(memory.data[20] == 0x10);
    try std.testing.expect(memory.data[24] == 0x50);
    
    // Test copy with overlap
    memory.copy(12, 10, 3);
    try std.testing.expect(memory.data[12] == 0x10);
    try std.testing.expect(memory.data[14] == 0x30);
    
    // Test copy from beyond size
    memory.copy(30, 100, 3);
    try std.testing.expect(memory.data[30] == 0);
    try std.testing.expect(memory.data[32] == 0);
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
    try std.testing.expect(memory.data[10] == 0xAA);
    try std.testing.expect(memory.data[20] == 0xBB);
    try std.testing.expect(memory.data[30] == 0xCC); // Content is preserved even beyond size
}