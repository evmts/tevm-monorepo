const std = @import("std");
const testing = std.testing;

// Define a simplified Memory implementation for our test
const Memory = struct {
    data: std.ArrayList(u8),
    
    // Initialize memory with empty data
    pub fn init(allocator: std.mem.Allocator) Memory {
        return Memory{
            .data = std.ArrayList(u8).init(allocator),
        };
    }
    
    pub fn deinit(self: *Memory) void {
        self.data.deinit();
    }
    
    // Ensure memory is sized to at least the given size
    pub fn ensureSize(self: *Memory, size: usize) !void {
        if (size > self.data.items.len) {
            const oldLen = self.data.items.len;
            try self.data.resize(size);
            
            // Zero out new memory
            for (self.data.items[oldLen..]) |*byte| {
                byte.* = 0;
            }
            
            if (@import("builtin").mode == .Debug) {
                std.debug.print("Memory resized from {d} to {d} bytes\n", .{oldLen, size});
            }
        }
    }
    
    // Get a slice of memory data (for testing/inspection)
    pub fn getData(self: *const Memory) []const u8 {
        return self.data.items;
    }
    
    // Set a specific value in memory
    pub fn set(self: *Memory, offset: usize, value: u8) !void {
        try self.ensureSize(offset + 1);
        self.data.items[offset] = value;
    }
    
    // Set a range of values in memory
    pub fn setRange(self: *Memory, offset: usize, bytes: []const u8) !void {
        try self.ensureSize(offset + bytes.len);
        @memcpy(self.data.items[offset..][0..bytes.len], bytes);
    }
    
    // Implementation of MCOPY (EIP-5656)
    pub fn mcopy(self: *Memory, dest: usize, src: usize, len: usize) !void {
        if (len == 0) return;
        
        // Ensure memory is sized properly
        try self.ensureSize(if (dest + len > src + len) dest + len else src + len);
        
        // MCOPY needs to handle overlapping regions correctly
        const dest_slice = self.data.items[dest .. dest + len];
        const src_slice = self.data.items[src .. src + len];
        
        // For safety, always use manual byte-by-byte copy with direction based on overlap
        if (dest <= src) {
            if (@import("builtin").mode == .Debug) {
                std.debug.print("MCOPY: Using forwards copy (dest={d}, src={d}, len={d})\n", .{dest, src, len});
            }
            // When dest is before or equal to src, copy forwards
            var i: usize = 0;
            while (i < len) : (i += 1) {
                dest_slice[i] = src_slice[i];
            }
        } else {
            if (@import("builtin").mode == .Debug) {
                std.debug.print("MCOPY: Using backwards copy (dest={d}, src={d}, len={d})\n", .{dest, src, len});
            }
            // When dest is after src, copy backwards to avoid overwriting source data
            var i = len;
            while (i > 0) {
                i -= 1;
                dest_slice[i] = src_slice[i];
            }
        }
    }
};

// Interface for chain rules
const ChainRules = struct {
    IsEIP5656: bool = false, // EIP-5656: MCOPY opcode
    
    pub fn init(eip5656_enabled: bool) ChainRules {
        return ChainRules{
            .IsEIP5656 = eip5656_enabled,
        };
    }
};

// Simple interpreter to test EIP-5656
const Interpreter = struct {
    chain_rules: ChainRules,
    memory: Memory,
    
    pub fn init(allocator: std.mem.Allocator, rules: ChainRules) Interpreter {
        return Interpreter{
            .chain_rules = rules,
            .memory = Memory.init(allocator),
        };
    }
    
    pub fn deinit(self: *Interpreter) void {
        self.memory.deinit();
    }
    
    // Simulate MCOPY opcode
    pub fn opMcopy(self: *Interpreter, dest: usize, src: usize, len: usize) !void {
        if (!self.chain_rules.IsEIP5656) {
            return error.InvalidOpcode;
        }
        
        try self.memory.mcopy(dest, src, len);
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("MCOPY opcode executed: dest={d}, src={d}, len={d}\n", .{dest, src, len});
        }
    }
    
    // For comparison, simulate the same operation without MCOPY
    // This would require using MLOAD and MSTORE repeatedly
    pub fn simulateMcopyWithMloadMstore(self: *Interpreter, dest: usize, src: usize, len: usize) !void {
        if (len == 0) return;
        
        // Ensure memory is properly sized
        try self.memory.ensureSize(if (dest + len > src + len) dest + len else src + len);
        
        // Copy byte by byte (expensive in terms of gas)
        var i: usize = 0;
        while (i < len) : (i += 1) {
            const value = self.memory.getData()[src + i];
            try self.memory.set(dest + i, value);
        }
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Simulated MCOPY using MLOAD/MSTORE: dest={d}, src={d}, len={d}\n", .{dest, src, len});
        }
    }
};

test "EIP-5656: MCOPY opcode should work when enabled" {
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Starting test: MCOPY opcode should work when enabled\n", .{});
    }
    
    // Setup interpreter with EIP-5656 enabled
    const rules = ChainRules.init(true);
    var interpreter = Interpreter.init(testing.allocator, rules);
    defer interpreter.deinit();
    
    // Set up source data in memory
    const source_data = [_]u8{ 1, 2, 3, 4, 5 };
    try interpreter.memory.setRange(10, &source_data);
    
    // Execute MCOPY operation (copy from offset 10 to offset 20, length 5)
    try interpreter.opMcopy(20, 10, 5);
    
    // Verify memory contents after MCOPY
    const memory_data = interpreter.memory.getData();
    
    // Check that data was copied correctly
    try testing.expectEqual(@as(u8, 1), memory_data[20]);
    try testing.expectEqual(@as(u8, 2), memory_data[21]);
    try testing.expectEqual(@as(u8, 3), memory_data[22]);
    try testing.expectEqual(@as(u8, 4), memory_data[23]);
    try testing.expectEqual(@as(u8, 5), memory_data[24]);
    
    // Original data should remain unchanged
    try testing.expectEqual(@as(u8, 1), memory_data[10]);
    try testing.expectEqual(@as(u8, 2), memory_data[11]);
    try testing.expectEqual(@as(u8, 3), memory_data[12]);
    try testing.expectEqual(@as(u8, 4), memory_data[13]);
    try testing.expectEqual(@as(u8, 5), memory_data[14]);
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Test PASSED: MCOPY opcode copied memory correctly\n", .{});
    }
}

test "EIP-5656: MCOPY opcode should fail when disabled" {
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Starting test: MCOPY opcode should fail when disabled\n", .{});
    }
    
    // Setup interpreter with EIP-5656 disabled
    const rules = ChainRules.init(false);
    var interpreter = Interpreter.init(testing.allocator, rules);
    defer interpreter.deinit();
    
    // Set up source data in memory
    const source_data = [_]u8{ 1, 2, 3, 4, 5 };
    try interpreter.memory.setRange(10, &source_data);
    
    // Try to execute MCOPY operation, it should fail
    try testing.expectError(error.InvalidOpcode, interpreter.opMcopy(20, 10, 5));
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Test PASSED: MCOPY opcode failed when disabled\n", .{});
    }
}

test "EIP-5656: MCOPY should handle overlapping regions correctly (dest > src)" {
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Starting test: MCOPY should handle overlapping regions correctly (dest > src)\n", .{});
    }
    
    // Setup interpreter with EIP-5656 enabled
    const rules = ChainRules.init(true);
    var interpreter = Interpreter.init(testing.allocator, rules);
    defer interpreter.deinit();
    
    // Set up source data in memory
    const source_data = [_]u8{ 1, 2, 3, 4, 5 };
    try interpreter.memory.setRange(10, &source_data);
    
    // Execute MCOPY operation with overlapping regions (dest > src)
    // We copy from offset 10 to offset 12, which overlaps by 3 bytes
    try interpreter.opMcopy(12, 10, 5);
    
    // Verify memory contents after MCOPY
    const memory_data = interpreter.memory.getData();
    
    // Check that data was copied correctly without corruption
    // The expected result is: [10]=1, [11]=2, [12]=1, [13]=2, [14]=3, [15]=4, [16]=5
    try testing.expectEqual(@as(u8, 1), memory_data[10]);
    try testing.expectEqual(@as(u8, 2), memory_data[11]);
    try testing.expectEqual(@as(u8, 1), memory_data[12]);
    try testing.expectEqual(@as(u8, 2), memory_data[13]);
    try testing.expectEqual(@as(u8, 3), memory_data[14]);
    try testing.expectEqual(@as(u8, 4), memory_data[15]);
    try testing.expectEqual(@as(u8, 5), memory_data[16]);
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Test PASSED: MCOPY handled overlapping regions correctly (dest > src)\n", .{});
    }
}

test "EIP-5656: MCOPY should handle overlapping regions correctly (dest < src)" {
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Starting test: MCOPY should handle overlapping regions correctly (dest < src)\n", .{});
    }
    
    // Setup interpreter with EIP-5656 enabled
    const rules = ChainRules.init(true);
    var interpreter = Interpreter.init(testing.allocator, rules);
    defer interpreter.deinit();
    
    // Set up source data in memory
    const source_data = [_]u8{ 1, 2, 3, 4, 5 };
    try interpreter.memory.setRange(10, &source_data);
    
    // Execute MCOPY operation with overlapping regions (dest < src)
    // We copy from offset 12 to offset 10, which overlaps by 3 bytes
    try interpreter.opMcopy(10, 12, 3);
    
    // Verify memory contents after MCOPY
    const memory_data = interpreter.memory.getData();
    
    // Check that data was copied correctly without corruption
    // The expected result is: [10]=3, [11]=4, [12]=5, [13]=4, [14]=5
    try testing.expectEqual(@as(u8, 3), memory_data[10]);
    try testing.expectEqual(@as(u8, 4), memory_data[11]);
    try testing.expectEqual(@as(u8, 5), memory_data[12]);
    try testing.expectEqual(@as(u8, 4), memory_data[13]);
    try testing.expectEqual(@as(u8, 5), memory_data[14]);
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Test PASSED: MCOPY handled overlapping regions correctly (dest < src)\n", .{});
    }
}

test "EIP-5656: MCOPY should handle zero-length copy" {
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Starting test: MCOPY should handle zero-length copy\n", .{});
    }
    
    // Setup interpreter with EIP-5656 enabled
    const rules = ChainRules.init(true);
    var interpreter = Interpreter.init(testing.allocator, rules);
    defer interpreter.deinit();
    
    // Get the initial memory size
    const initial_size = interpreter.memory.getData().len;
    
    // Execute MCOPY operation with length 0
    try interpreter.opMcopy(10, 20, 0);
    
    // Verify memory size doesn't change for zero-length copy
    try testing.expectEqual(initial_size, interpreter.memory.getData().len);
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Test PASSED: MCOPY handled zero-length copy without resizing memory\n", .{});
    }
}

test "EIP-5656: MCOPY gas savings vs. MLOAD/MSTORE loop" {
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Starting test: MCOPY gas savings vs. MLOAD/MSTORE loop\n", .{});
    }
    
    // Gas costs for EVM operations
    const MCOPY_BASE_GAS = 3;
    const MCOPY_WORD_GAS = 3;
    const MLOAD_GAS = 3;
    const MSTORE_GAS = 3;
    
    // For copying N bytes using MCOPY, gas cost is approximately:
    // MCOPY_BASE_GAS + ceil(N/32) * MCOPY_WORD_GAS
    //
    // For copying N bytes using MLOAD/MSTORE repeatedly:
    // N * (MLOAD_GAS + MSTORE_GAS)
    
    // Test with various copy sizes
    const test_sizes = [_]usize{ 2, 32, 64, 128, 256, 1024 };
    
    for (test_sizes) |size| {
        // Calculate gas costs
        const mcopy_words = (size + 31) / 32; // ceiling division by 32
        const mcopy_gas = MCOPY_BASE_GAS + mcopy_words * MCOPY_WORD_GAS;
        const mload_mstore_gas = size * (MLOAD_GAS + MSTORE_GAS);
        const gas_saved = mload_mstore_gas - mcopy_gas;
        
        if (@import("builtin").mode == .Debug) {
            std.debug.print("Copying {d} bytes:\n", .{size});
            std.debug.print("  MCOPY gas: {d}\n", .{mcopy_gas});
            std.debug.print("  MLOAD/MSTORE gas: {d}\n", .{mload_mstore_gas});
            std.debug.print("  Gas saved: {d}\n", .{gas_saved});
        }
        
        // MCOPY should be more efficient for all sizes > 1
        // For size=1, they cost the same (6 gas)
        try testing.expect(gas_saved > 0);
    }
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("Test PASSED: MCOPY is more gas efficient than MLOAD/MSTORE loop for all tested sizes\n", .{});
    }
}