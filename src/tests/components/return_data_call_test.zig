//! Comprehensive tests for return data in nested call contexts
//! Tests the behavior of return data across different call frames

const std = @import("std");
const testing = std.testing;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const return_data_opcodes = @import("../../opcodes/return_data.zig");
const types = @import("../../util/types.zig");
const Error = types.Error;
const U256 = types.U256;
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;

/// Mock Call Context for simulating nested calls
const CallContext = struct {
    // Parent context (if any)
    parent: ?*CallContext = null,
    // Return data from this call context
    return_data: ReturnData,
    // Memory for this call context
    memory: Memory,
    // Stack for this call context
    stack: Stack,
    
    pub fn init(allocator: std.mem.Allocator, parent: ?*CallContext) !CallContext {
        return CallContext{
            .parent = parent,
            .return_data = ReturnData.init(allocator),
            .memory = try Memory.init(allocator),
            .stack = Stack.init(),
        };
    }
    
    pub fn deinit(self: *CallContext) void {
        self.return_data.deinit();
        self.memory.deinit();
    }
    
    /// Simulate a call from this context
    pub fn call(self: *CallContext, allocator: std.mem.Allocator, output_data: []const u8) !CallContext {
        // Create child context
        var child = try CallContext.init(allocator, self);
        
        // Simulate execution that returns output_data
        try child.return_data.set(output_data);
        
        return child;
    }
    
    /// Return from this call to parent context
    pub fn returnToParent(self: *CallContext) !void {
        if (self.parent) |parent| {
            // In real EVM, parent gets our return data
            try parent.return_data.set(self.return_data.buffer);
        }
    }
};

/// Test basic call context flow
test "Return data in basic call context" {
    var parent = try CallContext.init(testing.allocator, null);
    defer parent.deinit();
    
    // Simulate a call that returns data
    var child = try parent.call(testing.allocator, &[_]u8{0xAA, 0xBB, 0xCC});
    defer child.deinit();
    
    // Child has the return data
    try testing.expect(child.return_data.size() == 3);
    try testing.expectEqualSlices(u8, &[_]u8{0xAA, 0xBB, 0xCC}, child.return_data.buffer);
    
    // Parent has no return data yet
    try testing.expect(parent.return_data.size() == 0);
    
    // Return from child to parent
    try child.returnToParent();
    
    // Now parent has the return data
    try testing.expect(parent.return_data.size() == 3);
    try testing.expectEqualSlices(u8, &[_]u8{0xAA, 0xBB, 0xCC}, parent.return_data.buffer);
}

/// Test nested call contexts and return data flow
test "Return data in nested call contexts" {
    var root = try CallContext.init(testing.allocator, null);
    defer root.deinit();
    
    // First level call
    var level1 = try root.call(testing.allocator, &[_]u8{0x11, 0x22});
    defer level1.deinit();
    
    // Check return data in level1
    try testing.expect(level1.return_data.size() == 2);
    try testing.expectEqualSlices(u8, &[_]u8{0x11, 0x22}, level1.return_data.buffer);
    
    // Test RETURNDATASIZE in child context
    try return_data_opcodes.returndatasize(&level1.stack, &level1.return_data);
    try testing.expectEqual(U256.fromU64(2), try level1.stack.pop());
    
    // Second level call from level1
    var level2 = try level1.call(testing.allocator, &[_]u8{0xAA, 0xBB, 0xCC, 0xDD});
    defer level2.deinit();
    
    // Check return data in level2
    try testing.expect(level2.return_data.size() == 4);
    try testing.expectEqualSlices(u8, &[_]u8{0xAA, 0xBB, 0xCC, 0xDD}, level2.return_data.buffer);
    
    // Test RETURNDATACOPY in level2
    try level2.stack.push(U256.fromU64(16)); // destOffset
    try level2.stack.push(U256.fromU64(1));  // offset (skip 0xAA)
    try level2.stack.push(U256.fromU64(3));  // size
    
    try return_data_opcodes.returndatacopy(&level2.stack, &level2.memory, &level2.return_data);
    
    // Verify memory contains copied data
    try testing.expectEqual(@as(u8, 0xBB), level2.memory.page.buffer[16]);
    try testing.expectEqual(@as(u8, 0xCC), level2.memory.page.buffer[17]);
    try testing.expectEqual(@as(u8, 0xDD), level2.memory.page.buffer[18]);
    
    // Return from level2 to level1
    try level2.returnToParent();
    
    // Now level1 has level2's return data
    try testing.expect(level1.return_data.size() == 4);
    try testing.expectEqualSlices(u8, &[_]u8{0xAA, 0xBB, 0xCC, 0xDD}, level1.return_data.buffer);
    
    // Return from level1 to root
    try level1.returnToParent();
    
    // Root now has the return data from level2
    try testing.expect(root.return_data.size() == 4);
    try testing.expectEqualSlices(u8, &[_]u8{0xAA, 0xBB, 0xCC, 0xDD}, root.return_data.buffer);
}

/// Test out-of-bounds access handling
test "Return data out-of-bounds handling" {
    var context = try CallContext.init(testing.allocator, null);
    defer context.deinit();
    
    // Set small return data
    try context.return_data.set(&[_]u8{0x01, 0x02, 0x03});
    
    // Test valid RETURNDATACOPY
    try context.stack.push(U256.fromU64(10)); // destOffset
    try context.stack.push(U256.fromU64(0));  // offset
    try context.stack.push(U256.fromU64(3));  // size
    
    try return_data_opcodes.returndatacopy(&context.stack, &context.memory, &context.return_data);
    
    // Test invalid RETURNDATACOPY (offset + size > buffer.len)
    try context.stack.push(U256.fromU64(20)); // destOffset
    try context.stack.push(U256.fromU64(1));  // offset
    try context.stack.push(U256.fromU64(3));  // size (would go beyond return data size)
    
    try testing.expectError(Error.ReturnDataOutOfBounds, 
        return_data_opcodes.returndatacopy(&context.stack, &context.memory, &context.return_data));
        
    // Test invalid RETURNDATACOPY (offset > buffer.len)
    try context.stack.push(U256.fromU64(30)); // destOffset
    try context.stack.push(U256.fromU64(5));  // offset (beyond buffer)
    try context.stack.push(U256.fromU64(1));  // size
    
    try testing.expectError(Error.ReturnDataOutOfBounds, 
        return_data_opcodes.returndatacopy(&context.stack, &context.memory, &context.return_data));
}

/// Test the propagation of return data with different sizes
test "Return data size changes" {
    var root = try CallContext.init(testing.allocator, null);
    defer root.deinit();
    
    // Call with small data
    var call1 = try root.call(testing.allocator, &[_]u8{0x11, 0x22});
    defer call1.deinit();
    try call1.returnToParent();
    
    try testing.expect(root.return_data.size() == 2);
    
    // Call with larger data
    var call2 = try root.call(testing.allocator, &[_]u8{0xAA, 0xBB, 0xCC, 0xDD, 0xEE});
    defer call2.deinit();
    try call2.returnToParent();
    
    try testing.expect(root.return_data.size() == 5);
    
    // Call with empty data
    var call3 = try root.call(testing.allocator, &[_]u8{});
    defer call3.deinit();
    try call3.returnToParent();
    
    try testing.expect(root.return_data.size() == 0);
}