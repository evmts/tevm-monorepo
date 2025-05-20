const std = @import("std");
const testing = std.testing;
const Allocator = std.mem.Allocator;
const assert = std.debug.assert;

// Memory module for EVM - focused on memory safety and expanded tests
const Memory = struct {
    data: std.ArrayList(u8),
    allocator: Allocator,

    fn init(allocator: Allocator) Memory {
        return Memory{
            .data = std.ArrayList(u8).init(allocator),
            .allocator = allocator,
        };
    }

    fn deinit(self: *Memory) void {
        self.data.deinit();
    }

    // Safely expand memory to the required size, with gas calculation
    fn expand(self: *Memory, offset: usize, size: usize) !struct { gas_cost: u64, expanded: bool } {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.expand: offset={d}, size={d}, current size={d}\n", 
                .{offset, size, self.data.items.len});
        }
        
        const required_size = offset + size;
        
        // Track if we're actually expanding
        var expanded = false;
        var new_words: usize = 0;
        var gas_cost: u64 = 0;
        
        if (required_size > self.data.items.len) {
            // Calculate words needed (32 bytes per word)
            const current_words = (self.data.items.len + 31) / 32;
            const required_words = (required_size + 31) / 32;
            
            // Calculate new memory size and required new words
            new_words = required_words - current_words;
            expanded = true;
            
            if (@import("builtin").mode == .Debug) {
                std.debug.print("Memory.expand: Expanding from {d} words to {d} words\n", 
                    .{current_words, required_words});
            }
            
            // Perform memory expansion
            try self.data.resize(required_words * 32);
            
            // Zero out newly allocated memory
            const old_size = current_words * 32;
            for (old_size..self.data.items.len) |i| {
                self.data.items[i] = 0;
            }
            
            // Calculate gas cost
            // Gas formula: 3 * words + words²/512
            gas_cost = @as(u64, @intCast(3 * required_words)) +
                @as(u64, @intCast(required_words * required_words / 512));
                
            if (@import("builtin").mode == .Debug) {
                std.debug.print("Memory.expand: Expansion complete, new size={d}, gas_cost={d}\n", 
                    .{self.data.items.len, gas_cost});
            }
        } else {
            if (@import("builtin").mode == .Debug) {
                std.debug.print("Memory.expand: No expansion needed\n", .{});
            }
        }
        
        return .{ .gas_cost = gas_cost, .expanded = expanded };
    }

    // Safely store a value at the given offset
    fn store(self: *Memory, offset: usize, value: []const u8) !u64 {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.store: offset={d}, value_len={d}\n", .{offset, value.len});
        }
        
        // Expand memory if needed
        const result = try self.expand(offset, value.len);
        
        // Perform the store operation
        @memcpy(self.data.items[offset..offset+value.len], value);
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.store: Stored successfully, gas_cost={d}\n", .{result.gas_cost});
        }
        
        return result.gas_cost;
    }

    // Safely load a value from the given offset
    fn load(self: *Memory, offset: usize, size: usize) !struct { gas_cost: u64, data: []u8 } {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.load: offset={d}, size={d}\n", .{offset, size});
        }
        
        // Expand memory if needed
        const result = try self.expand(offset, size);
        
        // Create a slice pointing to the memory region
        // This is safe because we've already expanded memory if needed
        const data = self.data.items[offset..offset+size];
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.load: Loaded successfully, gas_cost={d}\n", .{result.gas_cost});
        }
        
        return .{ .gas_cost = result.gas_cost, .data = data };
    }

    // Safely copy data within memory
    fn copy(self: *Memory, dest_offset: usize, source_offset: usize, size: usize) !u64 {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.copy: dest_offset={d}, source_offset={d}, size={d}\n", 
                .{dest_offset, source_offset, size});
        }
        
        if (size == 0) return 0;
        
        // Make sure both source and destination areas are within bounds
        const max_required = @max(dest_offset + size, source_offset + size);
        const result = try self.expand(0, max_required);
        
        // Handle overlapping memory regions safely
        if (dest_offset <= source_offset) {
            // Copy forward (no risk of overwriting source data)
            if (@import("builtin").mode == .Debug) {
                std.debug.print("Memory.copy: Using forward copy\n", .{});
            }
            for (0..size) |i| {
                self.data.items[dest_offset + i] = self.data.items[source_offset + i];
            }
        } else {
            // Copy backward to avoid corrupting source data
            if (@import("builtin").mode == .Debug) {
                std.debug.print("Memory.copy: Using backward copy for overlapping regions\n", .{});
            }
            var i: usize = size;
            while (i > 0) {
                i -= 1;
                self.data.items[dest_offset + i] = self.data.items[source_offset + i];
            }
        }
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.copy: Copy completed successfully, gas_cost={d}\n", .{result.gas_cost});
        }
        
        return result.gas_cost;
    }
    
    // Zero out a section of memory
    fn zero(self: *Memory, offset: usize, size: usize) !u64 {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.zero: offset={d}, size={d}\n", .{offset, size});
        }
        
        if (size == 0) return 0;
        
        // Expand memory if needed
        const result = try self.expand(offset, size);
        
        // Zero out the memory region
        @memset(self.data.items[offset..offset+size], 0);
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.zero: Zeroed successfully, gas_cost={d}\n", .{result.gas_cost});
        }
        
        return result.gas_cost;
    }
    
    // Check if two memory regions are equal
    fn equal(self: *const Memory, offset1: usize, offset2: usize, size: usize) bool {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.equal: offset1={d}, offset2={d}, size={d}\n", 
                .{offset1, offset2, size});
        }
        
        if (size == 0) return true;
        
        // Check if both regions are within bounds
        if (offset1 + size > self.data.items.len or offset2 + size > self.data.items.len) {
            if (@import("builtin").mode == .Debug) {
                std.debug.print("Memory.equal: Out of bounds access\n", .{});
            }
            return false;
        }
        
        // Compare byte by byte
        for (0..size) |i| {
            if (self.data.items[offset1 + i] != self.data.items[offset2 + i]) {
                if (@import("builtin").mode == .Debug) {
                    std.debug.print("Memory.equal: Mismatch at index {d}: {d} != {d}\n", 
                        .{i, self.data.items[offset1 + i], self.data.items[offset2 + i]});
                }
                return false;
            }
        }
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Memory.equal: Regions are equal\n", .{});
        }
        
        return true;
    }
};

// Test memory safety features
test "Memory expanded safety operations" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    var memory = Memory.init(allocator);
    defer memory.deinit();
    
    // Test 1: Memory expansion with various offsets
    {
        // Expand to different sizes
        _ = try memory.expand(0, 32); // 1 word
        try testing.expectEqual(@as(usize, 32), memory.data.items.len);
        
        _ = try memory.expand(32, 1); // Just over 1 word, should expand to 2 words
        try testing.expectEqual(@as(usize, 64), memory.data.items.len);
        
        _ = try memory.expand(100, 10); // In the middle of word 4
        try testing.expectEqual(@as(usize, 128), memory.data.items.len); // Should expand to 4 words
    }
    
    // Test 2: Edge case testing for memory operations
    {
        // Edge case: Store at the very end of memory
        const edge_data = [_]u8{0xAB, 0xCD};
        _ = try memory.store(126, &edge_data); // Will store at offsets 126-127 (last 2 bytes of memory)
        
        // Edge case: Try to read at boundary
        const load_result = try memory.load(126, 2);
        try testing.expectEqualSlices(u8, &edge_data, load_result.data);
        
        // Edge case: Zero memory at boundary
        _ = try memory.zero(126, 2);
        const after_zero = try memory.load(126, 2);
        try testing.expectEqual(@as(u8, 0), after_zero.data[0]);
        try testing.expectEqual(@as(u8, 0), after_zero.data[1]);
    }
    
    // Test 3: Memory region comparison
    {
        // Set up two identical regions
        const test_data = [_]u8{0x11, 0x22, 0x33, 0x44, 0x55};
        _ = try memory.store(10, &test_data); // Region 1
        _ = try memory.store(50, &test_data); // Region 2
        
        // Regions should be equal
        try testing.expect(memory.equal(10, 50, 5));
        
        // Change one byte in second region
        _ = try memory.store(52, &[_]u8{0x99});
        
        // Regions should no longer be equal
        try testing.expect(!memory.equal(10, 50, 5));
    }
    
    // Test 4: Complex copy operation across word boundaries
    {
        // Clear a region for this test
        _ = try memory.zero(200, 100);
        
        // Create pattern data
        var pattern = [_]u8{0} ** 50;
        for (0..50) |i| {
            pattern[i] = @truncate(i);
        }
        
        // Store pattern at offset 200
        _ = try memory.store(200, &pattern);
        
        // Copy part of it to another offset (crossing word boundary)
        _ = try memory.copy(240, 210, 30);
        
        // Verify the copy worked correctly
        for (0..30) |i| {
            try testing.expectEqual(pattern[i + 10], memory.data.items[240 + i]);
        }
    }
    
    // Test 5: Very large memory operations
    {
        // Handle a very large memory expansion (multiple words)
        const large_result = try memory.expand(5000, 1000);
        try testing.expect(large_result.expanded);
        try testing.expect(large_result.gas_cost > 0);
        try testing.expect(memory.data.items.len >= 6000);
        
        // Zero out a large region
        _ = try memory.zero(5000, 1000);
        
        // Verify it's all zeros
        for (0..1000) |i| {
            try testing.expectEqual(@as(u8, 0), memory.data.items[5000 + i]);
        }
        
        // Write a large pattern
        var large_pattern = [_]u8{0} ** 1000;
        for (0..1000) |i| {
            large_pattern[i] = @truncate(i % 256);
        }
        _ = try memory.store(5000, &large_pattern);
        
        // Verify the pattern
        for (0..1000) |i| {
            try testing.expectEqual(large_pattern[i], memory.data.items[5000 + i]);
        }
    }
}