// error_handling_test.zig
//! Tests for the error handling and status codes in ZigEVM
//! These tests verify that error conditions are properly detected, propagated, and managed

const std = @import("std");
const testing = std.testing;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Address = types.Address;
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const error_handling = @import("../../interpreter/error_handling.zig");
const StatusCode = error_handling.StatusCode;
const ExecutionStatus = error_handling.ExecutionStatus;

test "StatusCode to Error and back conversion" {
    // Test error conversion in both directions
    const errors = [_]Error{
        Error.OutOfGas,
        Error.InvalidOpcode,
        Error.InvalidJump,
        Error.StackOverflow,
        Error.StackUnderflow,
        Error.ReturnDataOutOfBounds,
        Error.InvalidOffset,
        Error.WriteProtection,
        Error.CallDepthExceeded,
        Error.InternalError,
    };
    
    for (errors) |err| {
        // Convert error to status code
        const status = ExecutionStatus.fromError(err, 1000);
        
        // Then convert back to error
        const converted_error = status.toError();
        
        // Verify specific error types for proper round-trip conversion
        switch (err) {
            Error.InvalidJumpDest => try testing.expectEqual(Error.InvalidJump, converted_error), 
            else => try testing.expectEqual(err, converted_error),
        }
        
        // Verify gas is passed correctly
        try testing.expectEqual(@as(u64, 1000), status.gas_used);
    }
}

test "ExecutionStatus property checks" {
    // Test success states
    {
        const status = ExecutionStatus{
            .code = .Stop,
            .gas_used = 100,
            .gas_refunded = 10,
        };
        
        try testing.expect(status.isSuccess());
        try testing.expect(!status.isRevert());
        try testing.expect(!status.isError());
        try testing.expect(!status.shouldContinue());
    }
    
    // Test revert states
    {
        const status = ExecutionStatus{
            .code = .Revert,
            .gas_used = 100,
        };
        
        try testing.expect(!status.isSuccess());
        try testing.expect(status.isRevert());
        try testing.expect(!status.isError());
        try testing.expect(!status.shouldContinue());
    }
    
    // Test error states
    {
        const status = ExecutionStatus{
            .code = .OutOfGas,
            .gas_used = 100,
        };
        
        try testing.expect(!status.isSuccess());
        try testing.expect(!status.isRevert());
        try testing.expect(status.isError());
        try testing.expect(!status.shouldContinue());
    }
    
    // Test continue state
    {
        const status = ExecutionStatus{
            .code = .Continue,
            .gas_used = 100,
        };
        
        try testing.expect(!status.isSuccess());
        try testing.expect(!status.isRevert());
        try testing.expect(!status.isError());
        try testing.expect(status.shouldContinue());
    }
}

test "ExecutionStatus to ExecutionResult conversion" {
    // Test successful conversion
    {
        const status = ExecutionStatus{
            .code = .Return,
            .gas_used = 100,
            .gas_refunded = 10,
            .return_data = &[_]u8{1, 2, 3},
        };
        
        const result = try status.toExecutionResult(testing.allocator);
        defer {
            switch (result) {
                .Success => |success| if (success.return_data.len > 0) testing.allocator.free(success.return_data),
                .Revert => |revert| if (revert.return_data.len > 0) testing.allocator.free(revert.return_data),
                .Error => {},
            }
        }
        
        switch (result) {
            .Success => |success| {
                try testing.expectEqual(@as(u64, 100), success.gas_used);
                try testing.expectEqual(@as(u64, 10), success.gas_refunded);
                try testing.expectEqualSlices(u8, &[_]u8{1, 2, 3}, success.return_data);
            },
            .Revert, .Error => {
                try testing.expect(false); // Should not reach here
            },
        }
    }
    
    // Test revert conversion
    {
        const status = ExecutionStatus{
            .code = .Revert,
            .gas_used = 100,
            .return_data = &[_]u8{1, 2, 3},
        };
        
        const result = try status.toExecutionResult(testing.allocator);
        defer {
            switch (result) {
                .Success => |success| if (success.return_data.len > 0) testing.allocator.free(success.return_data),
                .Revert => |revert| if (revert.return_data.len > 0) testing.allocator.free(revert.return_data),
                .Error => {},
            }
        }
        
        switch (result) {
            .Revert => |revert| {
                try testing.expectEqual(@as(u64, 100), revert.gas_used);
                try testing.expectEqualSlices(u8, &[_]u8{1, 2, 3}, revert.return_data);
            },
            .Success, .Error => {
                try testing.expect(false); // Should not reach here
            },
        }
    }
    
    // Test error conversion
    {
        const status = ExecutionStatus{
            .code = .OutOfGas,
            .gas_used = 100,
        };
        
        const result = try status.toExecutionResult(testing.allocator);
        
        switch (result) {
            .Error => |err| {
                try testing.expectEqual(@as(u64, 100), err.gas_used);
                try testing.expectEqual(Error.OutOfGas, err.error_type);
            },
            .Success, .Revert => {
                try testing.expect(false); // Should not reach here
            },
        }
    }
}

test "CallResult functionality" {
    // Test success
    {
        const result = error_handling.CallResult.success();
        
        try testing.expect(result.isSuccess());
        try testing.expect(!result.isRevert());
        try testing.expect(!result.isError());
        try testing.expectEqual(StatusCode.Stop, result.status.code);
    }
    
    // Test failure
    {
        const result = error_handling.CallResult.failure(Error.OutOfGas);
        
        try testing.expect(!result.isSuccess());
        try testing.expect(!result.isRevert());
        try testing.expect(result.isError());
        try testing.expectEqual(StatusCode.OutOfGas, result.status.code);
    }
}