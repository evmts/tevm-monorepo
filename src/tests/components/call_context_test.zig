//! Tests for call context propagation
//! Tests the behavior of different call types and their context propagation rules

const std = @import("std");
const testing = std.testing;
const types = @import("../../util/types.zig");
const Error = types.Error;
const U256 = types.U256;
const Address = types.Address;
const CallFrame = @import("../../interpreter/call_frame.zig").CallFrame;
const CallType = @import("../../interpreter/call_frame.zig").CallType;

/// Create a test execution environment for a call frame
const CallFrameExecutor = struct {
    // Call frame to execute
    frame: *CallFrame,
    // Whether call is static
    is_static: bool,
    
    fn init(frame: *CallFrame, is_static: bool) CallFrameExecutor {
        return .{
            .frame = frame,
            .is_static = is_static,
        };
    }
    
    /// Simulate execution of SSTORE (which is disallowed in static context)
    fn executeSStore(self: *CallFrameExecutor) !void {
        if (self.is_static) {
            return Error.WriteProtection;
        }
        
        // In a real implementation, this would actually modify storage
    }
};

/// Test CALL context propagation
test "CALL context propagation" {
    // In a CALL operation:
    // - The caller is the calling contract
    // - The address is the target contract
    // - Value is transferred if specified
    // - Static context is inherited from parent
    
    const allocator = testing.allocator;
    
    // Create parent frame
    const caller = Address.fromBytes(&[_]u8{1} ** 20) catch unreachable;
    const address = Address.fromBytes(&[_]u8{2} ** 20) catch unreachable;
    const target = Address.fromBytes(&[_]u8{3} ** 20) catch unreachable;
    
    // Test with non-static parent
    {
        var parent = try CallFrame.init(
            allocator,
            caller,
            address,
            address,
            &[_]u8{},
            &[_]u8{},
            U256.zero(),
            10000,
            0,
            false, // non-static
            false,
            null
        );
        defer parent.deinit();
        
        // Simulate CALL from parent to target
        var child = try CallFrame.init(
            allocator,
            address, // caller is parent's address
            target,  // address is target
            target,  // code address is same as target
            &[_]u8{},
            &[_]u8{},
            U256.fromU64(100), // value transfer
            5000,
            1,
            false, // inherits parent's static context
            true,  // should transfer value
            &parent
        );
        defer child.deinit();
        
        // Verify correct propagation
        try testing.expectEqualSlices(u8, &address.bytes, &child.caller.bytes);
        try testing.expectEqualSlices(u8, &target.bytes, &child.address.bytes);
        try testing.expectEqualSlices(u8, &target.bytes, &child.code_address.bytes);
        try testing.expectEqual(U256.fromU64(100), child.value);
        try testing.expectEqual(false, child.is_static);
        try testing.expectEqual(true, child.should_transfer);
        
        // Should be able to execute SSTORE in non-static context
        var executor = CallFrameExecutor.init(&child, child.is_static);
        try executor.executeSStore();
    }
    
    // Test with static parent
    {
        var parent = try CallFrame.init(
            allocator,
            caller,
            address,
            address,
            &[_]u8{},
            &[_]u8{},
            U256.zero(),
            10000,
            0,
            true, // static
            false,
            null
        );
        defer parent.deinit();
        
        // Simulate CALL from parent to target
        var child = try CallFrame.init(
            allocator,
            address, // caller is parent's address
            target,  // address is target
            target,  // code address is same as target
            &[_]u8{},
            &[_]u8{},
            U256.fromU64(100), // value transfer
            5000,
            1,
            true,  // inherits parent's static context
            true,  // should transfer value
            &parent
        );
        defer child.deinit();
        
        // Verify correct propagation
        try testing.expectEqualSlices(u8, &address.bytes, &child.caller.bytes);
        try testing.expectEqualSlices(u8, &target.bytes, &child.address.bytes);
        try testing.expectEqualSlices(u8, &target.bytes, &child.code_address.bytes);
        try testing.expectEqual(U256.fromU64(100), child.value);
        try testing.expectEqual(true, child.is_static);
        try testing.expectEqual(true, child.should_transfer);
        
        // Should not be able to execute SSTORE in static context
        var executor = CallFrameExecutor.init(&child, child.is_static);
        try testing.expectError(Error.WriteProtection, executor.executeSStore());
    }
}

/// Test DELEGATECALL context propagation
test "DELEGATECALL context propagation" {
    // In a DELEGATECALL operation:
    // - The caller stays the same as the parent's caller
    // - The address stays the same as the parent's address
    // - The code address is the target contract
    // - Value is not transferred
    // - The value in context is the parent's value
    // - Static context is inherited from parent
    
    const allocator = testing.allocator;
    
    // Create parent frame
    const caller = Address.fromBytes(&[_]u8{1} ** 20) catch unreachable;
    const address = Address.fromBytes(&[_]u8{2} ** 20) catch unreachable;
    const target = Address.fromBytes(&[_]u8{3} ** 20) catch unreachable;
    
    var parent = try CallFrame.init(
        allocator,
        caller,
        address,
        address,
        &[_]u8{},
        &[_]u8{},
        U256.fromU64(100), // Parent's value
        10000,
        0,
        false, // non-static
        false,
        null
    );
    defer parent.deinit();
    
    // Simulate DELEGATECALL from parent to target
    var child = try CallFrame.init(
        allocator,
        caller,  // caller stays the same as parent's caller
        address, // address stays the same as parent's address
        target,  // code address is target
        &[_]u8{},
        &[_]u8{},
        U256.fromU64(100), // value inherited from parent
        5000,
        1,
        false, // inherits parent's static context
        false, // no value transfer in DELEGATECALL
        &parent
    );
    defer child.deinit();
    
    // Verify correct propagation
    try testing.expectEqualSlices(u8, &caller.bytes, &child.caller.bytes);
    try testing.expectEqualSlices(u8, &address.bytes, &child.address.bytes);
    try testing.expectEqualSlices(u8, &target.bytes, &child.code_address.bytes);
    try testing.expectEqual(U256.fromU64(100), child.value);
    try testing.expectEqual(false, child.is_static);
    try testing.expectEqual(false, child.should_transfer);
}

/// Test STATICCALL context propagation
test "STATICCALL context propagation" {
    // In a STATICCALL operation:
    // - The caller is the calling contract
    // - The address is the target contract
    // - No value is transferred
    // - The context is always static (even if parent is not)
    
    const allocator = testing.allocator;
    
    // Create parent frame
    const caller = Address.fromBytes(&[_]u8{1} ** 20) catch unreachable;
    const address = Address.fromBytes(&[_]u8{2} ** 20) catch unreachable;
    const target = Address.fromBytes(&[_]u8{3} ** 20) catch unreachable;
    
    var parent = try CallFrame.init(
        allocator,
        caller,
        address,
        address,
        &[_]u8{},
        &[_]u8{},
        U256.zero(),
        10000,
        0,
        false, // non-static
        false,
        null
    );
    defer parent.deinit();
    
    // Simulate STATICCALL from parent to target
    var child = try CallFrame.init(
        allocator,
        address, // caller is parent's address
        target,  // address is target
        target,  // code address is target
        &[_]u8{},
        &[_]u8{},
        U256.zero(), // no value in STATICCALL
        5000,
        1,
        true,  // always static in STATICCALL
        false, // no value transfer in STATICCALL
        &parent
    );
    defer child.deinit();
    
    // Verify correct propagation
    try testing.expectEqualSlices(u8, &address.bytes, &child.caller.bytes);
    try testing.expectEqualSlices(u8, &target.bytes, &child.address.bytes);
    try testing.expectEqualSlices(u8, &target.bytes, &child.code_address.bytes);
    try testing.expectEqual(U256.zero(), child.value);
    try testing.expectEqual(true, child.is_static);
    try testing.expectEqual(false, child.should_transfer);
    
    // Should not be able to execute SSTORE in static context
    var executor = CallFrameExecutor.init(&child, child.is_static);
    try testing.expectError(Error.WriteProtection, executor.executeSStore());
}

/// Test CALLCODE context propagation
test "CALLCODE context propagation" {
    // In a CALLCODE operation:
    // - The caller is the calling contract
    // - The address stays the same as the parent's address
    // - The code address is the target contract
    // - Value can be transferred but to the calling contract itself
    // - Static context is inherited from parent
    
    const allocator = testing.allocator;
    
    // Create parent frame
    const caller = Address.fromBytes(&[_]u8{1} ** 20) catch unreachable;
    const address = Address.fromBytes(&[_]u8{2} ** 20) catch unreachable;
    const target = Address.fromBytes(&[_]u8{3} ** 20) catch unreachable;
    
    var parent = try CallFrame.init(
        allocator,
        caller,
        address,
        address,
        &[_]u8{},
        &[_]u8{},
        U256.zero(),
        10000,
        0,
        false, // non-static
        false,
        null
    );
    defer parent.deinit();
    
    // Simulate CALLCODE from parent to target
    var child = try CallFrame.init(
        allocator,
        address, // caller is parent's address
        address, // address stays the same as parent's address
        target,  // code address is target
        &[_]u8{},
        &[_]u8{},
        U256.fromU64(100), // value can be specified
        5000,
        1,
        false, // inherits parent's static context
        true,  // value transfer is allowed
        &parent
    );
    defer child.deinit();
    
    // Verify correct propagation
    try testing.expectEqualSlices(u8, &address.bytes, &child.caller.bytes);
    try testing.expectEqualSlices(u8, &address.bytes, &child.address.bytes);
    try testing.expectEqualSlices(u8, &target.bytes, &child.code_address.bytes);
    try testing.expectEqual(U256.fromU64(100), child.value);
    try testing.expectEqual(false, child.is_static);
    try testing.expectEqual(true, child.should_transfer);
}