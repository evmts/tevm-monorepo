//! Tests for call depth tracking and management
//! Verifies proper handling of call depth and context preservation

const std = @import("std");
const testing = std.testing;
const types = @import("../../util/types.zig");
const Error = types.Error;
const U256 = types.U256;
const Address = types.Address;
const CallFrame = @import("../../interpreter/call_frame.zig").CallFrame;
const CallType = @import("../../interpreter/call_frame.zig").CallType;
const MAX_CALL_DEPTH = @import("../../interpreter/call_frame.zig").MAX_CALL_DEPTH;

/// Test basic call frame initialization
test "CallFrame initialization" {
    const allocator = testing.allocator;
    
    const caller = Address.fromBytes(&[_]u8{1} ** 20) catch unreachable;
    const address = Address.fromBytes(&[_]u8{2} ** 20) catch unreachable;
    const code_address = Address.fromBytes(&[_]u8{3} ** 20) catch unreachable;
    const code = [_]u8{0x60, 0x01}; // PUSH1 1
    const call_data = [_]u8{0xAA, 0xBB};
    const value = U256.fromU64(100);
    const gas = 10000;
    const depth = 0;
    const is_static = false;
    const should_transfer = true;
    
    var frame = try CallFrame.init(
        allocator,
        caller,
        address,
        code_address,
        &code,
        &call_data,
        value,
        gas,
        depth,
        is_static,
        should_transfer,
        null
    );
    
    defer frame.deinit();
    
    // Verify basic properties
    try testing.expectEqualSlices(u8, &caller.bytes, &frame.caller.bytes);
    try testing.expectEqualSlices(u8, &address.bytes, &frame.address.bytes);
    try testing.expectEqualSlices(u8, &code_address.bytes, &frame.code_address.bytes);
    try testing.expectEqualSlices(u8, &code, frame.code);
    try testing.expectEqualSlices(u8, &call_data, frame.call_data);
    try testing.expectEqual(value, frame.value);
    try testing.expectEqual(gas, frame.gas_left);
    try testing.expectEqual(depth, frame.depth);
    try testing.expectEqual(is_static, frame.is_static);
    try testing.expectEqual(should_transfer, frame.should_transfer);
    try testing.expectEqual(@as(?*CallFrame, null), frame.parent);
}

/// Test nested call frames
test "Nested call frames" {
    const allocator = testing.allocator;
    
    // Create parent frame
    const parent_caller = Address.fromBytes(&[_]u8{1} ** 20) catch unreachable;
    const parent_address = Address.fromBytes(&[_]u8{2} ** 20) catch unreachable;
    const parent_code = [_]u8{0x60, 0x01}; // PUSH1 1
    
    var parent = try CallFrame.init(
        allocator,
        parent_caller,
        parent_address,
        parent_address,
        &parent_code,
        &[_]u8{},
        U256.fromU64(0),
        10000,
        0,
        false,
        false,
        null
    );
    defer parent.deinit();
    
    // Store parent data in memory
    parent.memory.store(100, "Parent data");
    try parent.stack.push(U256.fromU64(42));
    
    // Create child frame with parent as parent
    const child_address = Address.fromBytes(&[_]u8{3} ** 20) catch unreachable;
    const child_code = [_]u8{0x60, 0x02}; // PUSH1 2
    
    var child = try CallFrame.init(
        allocator,
        parent_address,
        child_address,
        child_address,
        &child_code,
        &[_]u8{},
        U256.fromU64(10),
        5000,
        1,
        false,
        true,
        &parent
    );
    defer child.deinit();
    
    // Verify child frame
    try testing.expectEqualSlices(u8, &parent_address.bytes, &child.caller.bytes);
    try testing.expectEqualSlices(u8, &child_address.bytes, &child.address.bytes);
    try testing.expectEqual(@as(*CallFrame, &parent), child.parent.?);
    try testing.expectEqual(@as(u16, 1), child.depth);
    
    // Verify parent and child have separate memory and stack
    try testing.expectEqual(@as(u16, 1), parent.stack.getSize());
    try testing.expectEqual(@as(u16, 0), child.stack.getSize());
    
    // Parent memory should still have its data
    const parent_mem_data = parent.memory.page.buffer[100..][0..11];
    try testing.expectEqualStrings("Parent data", parent_mem_data);
    
    // Child memory should be empty
    try testing.expectEqual(@as(usize, 0), child.memory.size);
}

/// Test creating call frames up to maximum depth
test "Call depth limit" {
    const allocator = testing.allocator;
    
    // Create a series of nested frames up to max depth
    var frames: [MAX_CALL_DEPTH]CallFrame = undefined;
    
    // Initialize first frame
    const base_address = Address.fromBytes(&[_]u8{1} ** 20) catch unreachable;
    const code = [_]u8{0x00}; // STOP
    
    frames[0] = try CallFrame.init(
        allocator,
        base_address,
        base_address,
        base_address,
        &code,
        &[_]u8{},
        U256.fromU64(0),
        10000,
        0,
        false,
        false,
        null
    );
    
    // Create frames up to max depth - 1
    for (1..MAX_CALL_DEPTH) |i| {
        frames[i] = try CallFrame.init(
            allocator,
            base_address,
            base_address,
            base_address,
            &code,
            &[_]u8{},
            U256.fromU64(0),
            10000,
            @intCast(i),
            false,
            false,
            &frames[i-1]
        );
    }
    
    // Clean up in reverse order
    var i: usize = MAX_CALL_DEPTH;
    while (i > 0) {
        i -= 1;
        frames[i].deinit();
    }
    
    // Attempting to create a frame at MAX_CALL_DEPTH should fail
    const result = CallFrame.init(
        allocator,
        base_address,
        base_address,
        base_address,
        &code,
        &[_]u8{},
        U256.fromU64(0),
        10000,
        MAX_CALL_DEPTH,
        false,
        false,
        null
    );
    
    try testing.expectError(Error.CallDepthExceeded, result);
}

/// Test different call types
test "Call types" {
    // Test that we can create different call types
    // For now, just ensure the enum values exist and can be used
    const call_types = [_]CallType{
        .CALL,
        .CALLCODE,
        .DELEGATECALL,
        .STATICCALL,
    };
    
    inline for (call_types) |call_type| {
        // Create call args with this type
        const args = CallFrame.CallArgs{
            .call_type = call_type,
            .gas = 1000,
            .address = Address.zero(),
            .value = U256.zero(),
            .call_data_offset = 0,
            .call_data_size = 0,
            .return_data_offset = 0,
            .return_data_size = 0,
        };
        
        try testing.expect(args.call_type == call_type);
    }
}

/// Test call operation placeholders
test "Call operations placeholders" {
    const call_ops = @import("../../interpreter/call_frame.zig");
    
    // For now, just test that the placeholders return the expected error
    try testing.expectError(Error.InvalidOpcode, call_ops.call());
    try testing.expectError(Error.InvalidOpcode, call_ops.callcode());
    try testing.expectError(Error.InvalidOpcode, call_ops.delegatecall());
    try testing.expectError(Error.InvalidOpcode, call_ops.staticcall());
    
    // Test call processing method (should also return InvalidOpcode for now)
    const allocator = testing.allocator;
    const address = Address.fromBytes(&[_]u8{1} ** 20) catch unreachable;
    
    var frame = try CallFrame.init(
        allocator,
        address,
        address,
        address,
        &[_]u8{},
        &[_]u8{},
        U256.zero(),
        1000,
        0,
        false,
        false,
        null
    );
    defer frame.deinit();
    
    const args = CallFrame.CallArgs{
        .call_type = .CALL,
        .gas = 500,
        .address = address,
        .value = U256.zero(),
        .call_data_offset = 0,
        .call_data_size = 0,
        .return_data_offset = 0,
        .return_data_size = 0,
    };
    
    try testing.expectError(Error.InvalidOpcode, frame.processCall(args));
}