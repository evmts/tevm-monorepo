const std = @import("std");
const testing = std.testing;

// Simple custom Memory implementation for EVM
const Memory = struct {
    data: std.ArrayList(u8),
    allocator: std.mem.Allocator,

    fn init(allocator: std.mem.Allocator) Memory {
        return Memory{
            .data = std.ArrayList(u8).init(allocator),
            .allocator = allocator,
        };
    }

    fn deinit(self: *Memory) void {
        self.data.deinit();
    }

    // Memory expansion that safely handles capacity
    fn expand(self: *Memory, offset: usize, size: usize) !void {
        const required_size = offset + size;
        if (required_size > self.data.items.len) {
            try self.data.resize(required_size);
            // Zero out the newly allocated memory
            const old_size = self.data.items.len;
            for (old_size..required_size) |i| {
                self.data.items[i] = 0;
            }
        }
    }

    // Load 32 bytes from memory, safely handling bounds
    fn load32(self: *Memory, offset: usize) ![32]u8 {
        var result: [32]u8 = [_]u8{0} ** 32;
        try self.expand(offset, 32);

        // Copy memory contents safely with bounds checking
        const bytes_to_copy = @min(32, self.data.items.len - offset);
        if (bytes_to_copy > 0) {
            @memcpy(result[0..bytes_to_copy], self.data.items[offset..offset + bytes_to_copy]);
        }

        return result;
    }

    // Store 32 bytes to memory, safely expanding if needed
    fn store32(self: *Memory, offset: usize, value: [32]u8) !void {
        try self.expand(offset, 32);
        @memcpy(self.data.items[offset..offset + 32], &value);
    }

    // Copy data within memory, safely handling overlaps
    fn copy(self: *Memory, dest_offset: usize, src_offset: usize, length: usize) !void {
        if (length == 0) return;

        // Ensure memory is large enough
        const max_offset = @max(dest_offset + length, src_offset + length);
        try self.expand(0, max_offset);

        // Use memmove to handle potential overlaps
        if (dest_offset > src_offset) {
            // Copy from end to start to avoid clobbering source data
            var i: usize = length;
            while (i > 0) {
                i -= 1;
                self.data.items[dest_offset + i] = self.data.items[src_offset + i];
            }
        } else {
            // Standard forward copy
            for (0..length) |i| {
                self.data.items[dest_offset + i] = self.data.items[src_offset + i];
            }
        }
    }
};

// Stack used in EVM execution
const Stack = struct {
    items: std.ArrayList([32]u8),
    allocator: std.mem.Allocator,

    fn init(allocator: std.mem.Allocator) Stack {
        return Stack{
            .items = std.ArrayList([32]u8).init(allocator),
            .allocator = allocator,
        };
    }

    fn deinit(self: *Stack) void {
        self.items.deinit();
    }

    // Push a value onto the stack, with bounds checking
    fn push(self: *Stack, value: [32]u8) !void {
        // Check for stack overflow
        if (self.items.items.len >= 1024) {
            return error.StackOverflow;
        }
        try self.items.append(value);
    }

    // Pop a value from the stack, with underflow checking
    fn pop(self: *Stack) ![32]u8 {
        if (self.items.items.len == 0) {
            return error.StackUnderflow;
        }
        // Pop the last item directly
        const last_index = self.items.items.len - 1;
        const value = self.items.items[last_index];
        _ = self.items.orderedRemove(last_index);
        return value;
    }

    // Peek at a value on the stack, with bounds checking
    fn peek(self: *const Stack, offset: usize) ![32]u8 {
        if (offset >= self.items.items.len) {
            return error.StackUnderflow;
        }
        return self.items.items[self.items.items.len - 1 - offset];
    }

    // Get the current stack size
    fn size(self: *const Stack) usize {
        return self.items.items.len;
    }
};

// Simple execution frame for testing memory safety
const Frame = struct {
    memory: Memory,
    stack: Stack,
    return_data: ?[]u8,
    allocator: std.mem.Allocator,

    fn init(allocator: std.mem.Allocator) Frame {
        return Frame{
            .memory = Memory.init(allocator),
            .stack = Stack.init(allocator),
            .return_data = null,
            .allocator = allocator,
        };
    }

    fn deinit(self: *Frame) void {
        self.memory.deinit();
        self.stack.deinit();
        if (self.return_data) |data| {
            self.allocator.free(data);
        }
    }

    // Set return data safely, freeing previous value if any
    fn setReturnData(self: *Frame, data: []const u8) !void {
        // Free any existing return data
        if (self.return_data) |old_data| {
            self.allocator.free(old_data);
            self.return_data = null;
        }

        // Allocate and copy new return data
        if (data.len > 0) {
            const new_data = try self.allocator.alloc(u8, data.len);
            @memcpy(new_data, data);
            self.return_data = new_data;
        }
    }

    // Execute a memory copy operation safely
    fn executeCopy(self: *Frame, dest_offset: u256, src_offset: u256, length: u256) !void {
        // Check for reasonable sizes to avoid OOM
        if (length > 0x1000000) { // 16MB limit
            return error.MemoryLimitExceeded;
        }

        // Safe conversion from u256 to usize with overflow check
        const dest: usize = if (dest_offset > std.math.maxInt(usize)) 
            return error.MemoryAccessOutOfBounds else @intCast(dest_offset);
        const src: usize = if (src_offset > std.math.maxInt(usize)) 
            return error.MemoryAccessOutOfBounds else @intCast(src_offset);
        const len: usize = if (length > std.math.maxInt(usize)) 
            return error.MemoryAccessOutOfBounds else @intCast(length);

        try self.memory.copy(dest, src, len);
    }

    // Execute a memory load operation safely
    fn executeLoad(self: *Frame, offset: u256) ![32]u8 {
        // Safe conversion from u256 to usize with overflow check
        const offs: usize = if (offset > std.math.maxInt(usize)) 
            return error.MemoryAccessOutOfBounds else @intCast(offset);
        
        return try self.memory.load32(offs);
    }

    // Execute a memory store operation safely
    fn executeStore(self: *Frame, offset: u256, value: [32]u8) !void {
        // Safe conversion from u256 to usize with overflow check
        const offs: usize = if (offset > std.math.maxInt(usize)) 
            return error.MemoryAccessOutOfBounds else @intCast(offset);
        
        try self.memory.store32(offs, value);
    }

    // Execute a stack push operation safely
    fn executePush(self: *Frame, value: [32]u8) !void {
        try self.stack.push(value);
    }

    // Execute a stack pop operation safely
    fn executePop(self: *Frame) ![32]u8 {
        return try self.stack.pop();
    }
};

// Allocation size large enough to cause issues if not handled properly
const LARGE_ALLOCATION = 1024 * 1024; // 1MB

// Memory safety test for Frame operations
test "Frame memory safety" {
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var frame = Frame.init(allocator);
    defer frame.deinit();
    
    // Test 1: Memory expansion with bounds checking
    {
        // Store 32 bytes at various offsets that require expansion
        var value: [32]u8 = [_]u8{0} ** 32;
        value[0] = 0xAA;
        value[31] = 0xBB;
        
        try frame.executeStore(0, value);
        try frame.executeStore(100, value);
        
        // Load and verify
        const loaded1 = try frame.executeLoad(0);
        try testing.expectEqual(value, loaded1);
        
        const loaded2 = try frame.executeLoad(100);
        try testing.expectEqual(value, loaded2);
    }
    
    // Test 2: Memory copying with bounds checking
    {
        // Set up memory with some data
        var data1: [32]u8 = [_]u8{0} ** 32;
        data1[0] = 0xCC;
        data1[31] = 0xDD;
        
        var data2: [32]u8 = [_]u8{0} ** 32;
        data2[0] = 0xEE;
        data2[31] = 0xFF;
        
        try frame.executeStore(200, data1);
        try frame.executeStore(300, data2);
        
        // Copy data1 to a different location
        try frame.executeCopy(400, 200, 32);
        
        // Load and verify the copied data
        const loaded = try frame.executeLoad(400);
        try testing.expectEqual(data1, loaded);
        
        // Test overlapping copy
        try frame.executeCopy(210, 200, 32);
        const loaded_overlap = try frame.executeLoad(210);
        try testing.expectEqual(data1, loaded_overlap);
    }
    
    // Test 3: Stack operations with bounds checking
    {
        // Push values onto the stack
        var value1: [32]u8 = [_]u8{0} ** 32;
        value1[0] = 0x11;
        
        var value2: [32]u8 = [_]u8{0} ** 32;
        value2[0] = 0x22;
        
        try frame.executePush(value1);
        try frame.executePush(value2);
        
        // Verify stack size
        try testing.expectEqual(@as(usize, 2), frame.stack.size());
        
        // Pop and verify values (LIFO order)
        const popped1 = try frame.executePop();
        try testing.expectEqual(value2, popped1);
        
        const popped2 = try frame.executePop();
        try testing.expectEqual(value1, popped2);
        
        // Stack should be empty now
        try testing.expectEqual(@as(usize, 0), frame.stack.size());
        
        // Verify that popping from empty stack errors
        try testing.expectError(error.StackUnderflow, frame.executePop());
    }
    
    // Test 4: Large memory allocation safety
    {
        // Try to allocate a very large memory region
        try testing.expectError(error.MemoryLimitExceeded, frame.executeCopy(0, 0, LARGE_ALLOCATION * 20));
    }
    
    // Test 5: Return data management
    {
        // Set return data
        const return_data = "Return data test";
        try frame.setReturnData(return_data);
        
        // Verify return data content
        try testing.expectEqualStrings(return_data, frame.return_data.?);
        
        // Replace with new return data
        const new_return_data = "New return data";
        try frame.setReturnData(new_return_data);
        
        // Verify the new return data
        try testing.expectEqualStrings(new_return_data, frame.return_data.?);
        
        // Set to empty
        try frame.setReturnData("");
        try testing.expect(frame.return_data == null);
    }
}