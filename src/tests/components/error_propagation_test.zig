// error_propagation_test.zig
//! Tests for error propagation through the call stack in ZigEVM
//! These tests verify that errors are properly propagated from nested calls

const std = @import("std");
const testing = std.testing;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Address = types.Address;
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const call_frame = @import("../../interpreter/call_frame.zig");
const CallFrame = call_frame.CallFrame;
const error_handling = @import("../../interpreter/error_handling.zig");
const StatusCode = error_handling.StatusCode;
const ExecutionStatus = error_handling.ExecutionStatus;
const CallResult = error_handling.CallResult;

// Mock CallExecutor - simulates how nested calls would work in full implementation
const CallExecutor = struct {
    allocator: std.mem.Allocator,
    current_depth: u16 = 0,
    max_depth: u16 = 1024,
    return_data: *ReturnData,
    gas_left: u64,
    
    pub fn init(allocator: std.mem.Allocator, gas: u64, return_data: *ReturnData) CallExecutor {
        return .{
            .allocator = allocator,
            .return_data = return_data,
            .gas_left = gas,
        };
    }
    
    pub fn executeCall(self: *CallExecutor, target_code: []const u8, depth: u16, should_fail: bool, with_revert: bool) !CallResult {
        // Check if we've exceeded the maximum call depth
        if (depth >= self.max_depth) {
            return CallResult.failure(Error.CallDepthExceeded);
        }
        
        // Simulate gas consumption
        if (self.gas_left < 100) {
            return CallResult.failure(Error.OutOfGas);
        }
        self.gas_left -= 100;
        
        // Simulate execution success or failure based on parameters
        if (should_fail) {
            if (with_revert) {
                // Simulate REVERT
                const revert_data = [_]u8{0xEF, 0xBE, 0xAD, 0xDE};
                try self.return_data.set(&revert_data);
                
                return .{
                    .status = .{
                        .code = .Revert,
                        .gas_used = 100,
                        .return_data = &revert_data,
                    },
                };
            } else {
                // Simulate error (e.g., invalid opcode)
                return CallResult.failure(Error.InvalidOpcode);
            }
        }
        
        // On success, set return data and return success
        const success_data = [_]u8{0x01, 0x02, 0x03, 0x04};
        try self.return_data.set(&success_data);
        
        return .{
            .status = .{
                .code = .Return,
                .gas_used = 100,
                .gas_refunded = 10,
                .return_data = &success_data,
            },
        };
    }
    
    pub fn simulateNestedCall(
        self: *CallExecutor, 
        depth: u16, 
        nested_depth: u16, 
        should_fail: bool, 
        with_revert: bool, 
        fail_level: u16
    ) !CallResult {
        // Base case: reached the maximum nesting level or should fail at this level
        if (depth >= nested_depth || (should_fail && depth == fail_level)) {
            return self.executeCall(&[_]u8{}, depth, should_fail && depth == fail_level, with_revert);
        }
        
        // Recursive case: simulate deeper call
        const result = try self.simulateNestedCall(depth + 1, nested_depth, should_fail, with_revert, fail_level);
        
        // Propagate the result
        if (!result.isSuccess() && !result.isRevert()) {
            // For errors, maintain the error but adjust gas used
            return .{
                .status = .{
                    .code = result.status.code,
                    .gas_used = result.status.gas_used + 50, // Add some gas used at this level
                    .return_data = result.status.return_data,
                },
            };
        } else if (result.isRevert()) {
            // For reverts, maintain the revert data
            return .{
                .status = .{
                    .code = .Revert,
                    .gas_used = result.status.gas_used + 50,
                    .return_data = result.status.return_data,
                },
            };
        } else {
            // For success, add our own return data
            const success_data = [_]u8{0x01, 0x02, 0x03, 0x04};
            try self.return_data.set(&success_data);
            
            return .{
                .status = .{
                    .code = .Return,
                    .gas_used = result.status.gas_used + 50,
                    .gas_refunded = result.status.gas_refunded,
                    .return_data = &success_data,
                },
            };
        }
    }
};

test "Error propagation: nested call fails" {
    // Initialize test components
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    var executor = CallExecutor.init(testing.allocator, 10000, &return_data);
    
    // Simulate a nested call that fails at level 3
    const result = try executor.simulateNestedCall(0, 5, true, false, 3);
    
    // Check that the error propagated correctly
    try testing.expect(result.isError());
    try testing.expectEqual(StatusCode.InvalidOpcode, result.status.code);
    
    // Gas should reflect the levels traversed (levels 0-2 = 3 levels * 50 gas + 100 for the failing call)
    try testing.expectEqual(@as(u64, 250), result.status.gas_used);
}

test "Error propagation: nested call reverts" {
    // Initialize test components
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    var executor = CallExecutor.init(testing.allocator, 10000, &return_data);
    
    // Simulate a nested call that reverts at level 2
    const result = try executor.simulateNestedCall(0, 5, true, true, 2);
    
    // Check that the revert propagated correctly
    try testing.expect(result.isRevert());
    try testing.expectEqual(StatusCode.Revert, result.status.code);
    
    // Gas should reflect the levels traversed (levels 0-1 = 2 levels * 50 gas + 100 for the reverting call)
    try testing.expectEqual(@as(u64, 200), result.status.gas_used);
    
    // Check revert data
    try testing.expectEqualSlices(u8, &[_]u8{0xEF, 0xBE, 0xAD, 0xDE}, result.status.return_data);
}

test "Error propagation: call depth exceeded" {
    // Initialize test components
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    var executor = CallExecutor.init(testing.allocator, 10000, &return_data);
    executor.max_depth = 10; // Set a lower max depth for testing
    
    // Simulate a nested call that tries to go too deep
    const result = try executor.simulateNestedCall(0, 15, false, false, 0);
    
    // Check that we got call depth exceeded error
    try testing.expect(result.isError());
    try testing.expectEqual(StatusCode.CallTooDeep, result.status.code);
    
    // Gas should reflect the levels traversed (levels 0-9 = 10 levels * 50 gas)
    try testing.expectEqual(@as(u64, 500), result.status.gas_used);
}

test "Error propagation: out of gas" {
    // Initialize test components
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    var executor = CallExecutor.init(testing.allocator, 250, &return_data);
    
    // Simulate a nested call that runs out of gas (each level uses 100 gas)
    const result = try executor.simulateNestedCall(0, 5, false, false, 0);
    
    // Check that we got out of gas error
    try testing.expect(result.isError());
    try testing.expectEqual(StatusCode.OutOfGas, result.status.code);
}

test "Error propagation: successful nested calls" {
    // Initialize test components
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    var executor = CallExecutor.init(testing.allocator, 10000, &return_data);
    
    // Simulate 3 levels of successful nested calls
    const result = try executor.simulateNestedCall(0, 3, false, false, 0);
    
    // Check that the call succeeded
    try testing.expect(result.isSuccess());
    try testing.expectEqual(StatusCode.Return, result.status.code);
    
    // Gas should reflect the levels traversed (3 levels * 50 gas + 100 for the innermost successful call)
    try testing.expectEqual(@as(u64, 250), result.status.gas_used);
    
    // Check return data
    try testing.expectEqualSlices(u8, &[_]u8{0x01, 0x02, 0x03, 0x04}, result.status.return_data);
}