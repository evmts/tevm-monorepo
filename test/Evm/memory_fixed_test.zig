const std = @import("std");
const testing = std.testing;
const Allocator = std.mem.Allocator;

// Memory module for EVM - focused on memory safety
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
        }
        
        return .{ .gas_cost = gas_cost, .expanded = expanded };
    }

    // Safely store a value at the given offset
    fn store(self: *Memory, offset: usize, value: []const u8) !u64 {
        // Expand memory if needed
        const result = try self.expand(offset, value.len);
        
        // Perform the store operation
        @memcpy(self.data.items[offset..offset+value.len], value);
        
        return result.gas_cost;
    }

    // Safely load a value from the given offset
    fn load(self: *Memory, offset: usize, size: usize) !struct { gas_cost: u64, data: []u8 } {
        // Expand memory if needed
        const result = try self.expand(offset, size);
        
        // Create a slice pointing to the memory region
        // This is safe because we've already expanded memory if needed
        const data = self.data.items[offset..offset+size];
        
        return .{ .gas_cost = result.gas_cost, .data = data };
    }

    // Safely copy data within memory
    fn copy(self: *Memory, dest_offset: usize, source_offset: usize, size: usize) !u64 {
        if (size == 0) return 0;
        
        // Make sure both source and destination areas are within bounds
        const max_required = @max(dest_offset + size, source_offset + size);
        const result = try self.expand(0, max_required);
        
        // Handle overlapping memory regions safely
        if (dest_offset <= source_offset) {
            // Copy forward (no risk of overwriting source data)
            for (0..size) |i| {
                self.data.items[dest_offset + i] = self.data.items[source_offset + i];
            }
        } else {
            // Copy backward to avoid corrupting source data
            var i: usize = size;
            while (i > 0) {
                i -= 1;
                self.data.items[dest_offset + i] = self.data.items[source_offset + i];
            }
        }
        
        return result.gas_cost;
    }
};

// Test memory safety features
test "Memory safety operations" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    var memory = Memory.init(allocator);
    defer memory.deinit();
    
    // Test 1: Basic store and load operations
    {
        // Prepare test data
        const test_data = [_]u8{0x11, 0x22, 0x33, 0x44, 0x55};
        
        // Store data at offset 10
        const store_gas = try memory.store(10, &test_data);
        try testing.expect(store_gas > 0); // Should have expanded memory
        
        // Verify memory expanded properly
        try testing.expectEqual(@as(usize, 32), memory.data.items.len); // 1 word (32 bytes)
        
        // Load data and verify contents
        const load_result = try memory.load(10, 5);
        try testing.expectEqual(@as(u64, 0), load_result.gas_cost); // No additional expansion
        try testing.expectEqualSlices(u8, &test_data, load_result.data);
    }
    
    // Test 2: Large memory expansion
    {
        // Store data near the end of current allocation
        const test_data = [_]u8{0xAA, 0xBB, 0xCC, 0xDD, 0xEE};
        const store_gas = try memory.store(30, &test_data);
        
        // Memory should have expanded to 2 words (64 bytes)
        try testing.expectEqual(@as(usize, 64), memory.data.items.len);
        try testing.expect(store_gas > 0); // Gas cost for expansion
        
        // Verify data was stored correctly across word boundary
        const load_result = try memory.load(30, 5);
        try testing.expectEqualSlices(u8, &test_data, load_result.data);
    }
    
    // Test 3: Memory copy operation (non-overlapping)
    {
        // Set up source data
        const source_data = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05};
        _ = try memory.store(40, &source_data);
        
        // Copy to non-overlapping destination
        const copy_gas = try memory.copy(50, 40, 5);
        try testing.expectEqual(@as(u64, 0), copy_gas); // No expansion needed
        
        // Verify copy worked correctly
        const load_result = try memory.load(50, 5);
        try testing.expectEqualSlices(u8, &source_data, load_result.data);
    }
    
    // Test 4: Memory copy with overlap (forward)
    {
        // Set up source data
        const source_data = [_]u8{0xA1, 0xA2, 0xA3, 0xA4, 0xA5};
        _ = try memory.store(20, &source_data);
        
        // Copy to overlapping destination (forward)
        const copy_gas = try memory.copy(18, 20, 5);
        try testing.expectEqual(@as(u64, 0), copy_gas); // No expansion needed
        
        // Verify that copy worked correctly despite overlap
        const load_result = try memory.load(18, 5);
        
        // Expect A1, A2, A3, A4, A5 shifted two positions earlier
        // Original data is at position 20, we copied to 18
        try testing.expectEqual(@as(u8, 0xA1), load_result.data[0]);
        try testing.expectEqual(@as(u8, 0xA2), load_result.data[1]);
        try testing.expectEqual(@as(u8, 0xA3), load_result.data[2]);
        try testing.expectEqual(@as(u8, 0xA4), load_result.data[3]);
        try testing.expectEqual(@as(u8, 0xA5), load_result.data[4]);
    }
    
    // Test 5: Memory copy with overlap (backward)
    {
        // Set up source data
        const source_data = [_]u8{0xB1, 0xB2, 0xB3, 0xB4, 0xB5};
        _ = try memory.store(60, &source_data);
        
        // Copy to overlapping destination (backward)
        const copy_gas = try memory.copy(62, 60, 5);
        try testing.expectEqual(@as(u64, 0), copy_gas); // No expansion needed
        
        // Verify that copy worked correctly despite overlap
        const load_result = try memory.load(62, 5);
        try testing.expectEqual(source_data[0], load_result.data[0]);
        try testing.expectEqual(source_data[1], load_result.data[1]);
        try testing.expectEqual(source_data[2], load_result.data[2]);
    }
    
    // Test 6: Very large memory expansion
    {
        // Calculate a large offset (requires multiple words)
        const large_offset = 1000;
        const test_data = [_]u8{0xF1, 0xF2, 0xF3, 0xF4, 0xF5};
        
        // Store data at large offset
        const store_gas = try memory.store(large_offset, &test_data);
        try testing.expect(store_gas > 0); // Should have significant gas cost
        
        // Memory should have expanded to cover the large offset
        try testing.expect(memory.data.items.len >= large_offset + test_data.len);
        
        // Verify data was stored correctly
        const load_result = try memory.load(large_offset, 5);
        try testing.expectEqualSlices(u8, &test_data, load_result.data);
    }
}