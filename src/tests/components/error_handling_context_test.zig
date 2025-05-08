// error_handling_context_test.zig
//! Tests for error handling in different execution contexts
//! These tests verify how errors are handled in specific execution environments (static calls, etc.)

const std = @import("std");
const testing = std.testing;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Address = types.Address;
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const error_handling = @import("../../interpreter/error_handling.zig");
const StatusCode = error_handling.StatusCode;
const ExecutionStatus = error_handling.ExecutionStatus;
const CallResult = error_handling.CallResult;

// Mock execution context with different flags
const ExecutionContext = struct {
    is_static: bool = false,
    depth: u16 = 0,
    gas_limit: u64 = 1000000,
    
    pub fn init() ExecutionContext {
        return ExecutionContext{};
    }
    
    pub fn withStatic(self: ExecutionContext) ExecutionContext {
        var ctx = self;
        ctx.is_static = true;
        return ctx;
    }
    
    pub fn withDepth(self: ExecutionContext, depth: u16) ExecutionContext {
        var ctx = self;
        ctx.depth = depth;
        return ctx;
    }
    
    pub fn withGasLimit(self: ExecutionContext, gas: u64) ExecutionContext {
        var ctx = self;
        ctx.gas_limit = gas;
        return ctx;
    }
};

// Mock wrapper for tracking static violations
const StaticContext = struct {
    ctx: ExecutionContext,
    
    pub fn init(ctx: ExecutionContext) StaticContext {
        return .{ .ctx = ctx };
    }
    
    // Simulate a state-modifying operation
    pub fn modifyState(self: *const StaticContext) !void {
        if (self.ctx.is_static) {
            return Error.WriteProtection;
        }
    }
    
    // Simulate a read-only operation (should always succeed)
    pub fn readState(self: *const StaticContext) !void {
        _ = self;
        return;
    }
};

// Mock for call stack depth management
const CallDepthTracker = struct {
    ctx: ExecutionContext,
    
    pub fn init(ctx: ExecutionContext) CallDepthTracker {
        return .{ .ctx = ctx };
    }
    
    // Simulate a nested call
    pub fn call(self: *const CallDepthTracker) !void {
        // Check call depth
        if (self.ctx.depth >= 1024) {
            return Error.CallDepthExceeded;
        }
        
        // Simulate a successful call
        return;
    }
};

// Mock gas tracking
const GasTracker = struct {
    ctx: ExecutionContext,
    gas_used: u64 = 0,
    
    pub fn init(ctx: ExecutionContext) GasTracker {
        return .{ .ctx = ctx };
    }
    
    // Simulate a gas-consuming operation
    pub fn useGas(self: *GasTracker, amount: u64) !void {
        // Check if we have enough gas
        if (self.ctx.gas_limit - self.gas_used < amount) {
            return Error.OutOfGas;
        }
        
        // Use gas
        self.gas_used += amount;
        return;
    }
    
    // Get remaining gas
    pub fn remaining(self: *const GasTracker) u64 {
        return self.ctx.gas_limit - self.gas_used;
    }
};

test "Static context restrictions" {
    // Setup
    var non_static_ctx = ExecutionContext.init();
    var static_ctx = ExecutionContext.init().withStatic();
    
    var non_static = StaticContext.init(non_static_ctx);
    var static_mode = StaticContext.init(static_ctx);
    
    // Test read operations (should succeed in both contexts)
    try non_static.readState();
    try static_mode.readState();
    
    // Test write operations (should fail in static mode)
    try non_static.modifyState(); // Should work
    try testing.expectError(Error.WriteProtection, static_mode.modifyState());
    
    // Convert the error to a status code
    const status = ExecutionStatus.fromError(Error.WriteProtection, 1000);
    try testing.expectEqual(StatusCode.StaticModeViolation, status.code);
    try testing.expect(status.isError());
}

test "Call depth enforcement" {
    // Setup
    var normal_ctx = ExecutionContext.init().withDepth(10);
    var deep_ctx = ExecutionContext.init().withDepth(1024);
    
    var normal_calls = CallDepthTracker.init(normal_ctx);
    var deep_calls = CallDepthTracker.init(deep_ctx);
    
    // Test normal depth call (should succeed)
    try normal_calls.call();
    
    // Test excessive depth call (should fail)
    try testing.expectError(Error.CallDepthExceeded, deep_calls.call());
    
    // Convert the error to a status code
    const status = ExecutionStatus.fromError(Error.CallDepthExceeded, 1000);
    try testing.expectEqual(StatusCode.CallTooDeep, status.code);
    try testing.expect(status.isError());
}

test "Gas usage and tracking" {
    // Setup
    var small_gas_ctx = ExecutionContext.init().withGasLimit(100);
    var large_gas_ctx = ExecutionContext.init().withGasLimit(10000);
    
    var small_gas = GasTracker.init(small_gas_ctx);
    var large_gas = GasTracker.init(large_gas_ctx);
    
    // Test gas usage within limits
    try small_gas.useGas(50);
    try testing.expectEqual(@as(u64, 50), small_gas.gas_used);
    try testing.expectEqual(@as(u64, 50), small_gas.remaining());
    
    // Test gas usage exceeding limits
    try testing.expectError(Error.OutOfGas, small_gas.useGas(60));
    
    // Test larger gas operations
    try large_gas.useGas(5000);
    try large_gas.useGas(4000);
    try testing.expectEqual(@as(u64, 9000), large_gas.gas_used);
    try testing.expectEqual(@as(u64, 1000), large_gas.remaining());
    
    // Test exceeding large gas limit
    try testing.expectError(Error.OutOfGas, large_gas.useGas(1001));
    
    // Convert the error to a status code
    const status = ExecutionStatus.fromError(Error.OutOfGas, 9000);
    try testing.expectEqual(StatusCode.OutOfGas, status.code);
    try testing.expect(status.isError());
}

test "Execution Result conversion" {
    // Setup
    // Create an out-of-gas error status
    const error_status = ExecutionStatus{
        .code = .OutOfGas,
        .gas_used = 5000,
        .gas_refunded = 0,
    };
    
    // Create a revert status with data
    const revert_status = ExecutionStatus{
        .code = .Revert,
        .gas_used = 3000,
        .return_data = &[_]u8{0x08, 0x07, 0x06},
    };
    
    // Create a success status
    const success_status = ExecutionStatus{
        .code = .Return,
        .gas_used = 2000,
        .gas_refunded = 500,
        .return_data = &[_]u8{0x01, 0x02, 0x03},
    };
    
    // Test conversion of error status
    const error_result = try error_status.toExecutionResult(testing.allocator);
    switch (error_result) {
        .Error => |err| {
            try testing.expectEqual(@as(u64, 5000), err.gas_used);
            try testing.expectEqual(Error.OutOfGas, err.error_type);
        },
        .Success, .Revert => {
            try testing.expect(false); // Should not reach here
        },
    }
    
    // Test conversion of revert status
    const revert_result = try revert_status.toExecutionResult(testing.allocator);
    defer {
        switch (revert_result) {
            .Revert => |revert| if (revert.return_data.len > 0) testing.allocator.free(revert.return_data),
            else => {},
        }
    }
    switch (revert_result) {
        .Revert => |revert| {
            try testing.expectEqual(@as(u64, 3000), revert.gas_used);
            try testing.expectEqualSlices(u8, &[_]u8{0x08, 0x07, 0x06}, revert.return_data);
        },
        .Success, .Error => {
            try testing.expect(false); // Should not reach here
        },
    }
    
    // Test conversion of success status
    const success_result = try success_status.toExecutionResult(testing.allocator);
    defer {
        switch (success_result) {
            .Success => |success| if (success.return_data.len > 0) testing.allocator.free(success.return_data),
            else => {},
        }
    }
    switch (success_result) {
        .Success => |success| {
            try testing.expectEqual(@as(u64, 2000), success.gas_used);
            try testing.expectEqual(@as(u64, 500), success.gas_refunded);
            try testing.expectEqualSlices(u8, &[_]u8{0x01, 0x02, 0x03}, success.return_data);
        },
        .Revert, .Error => {
            try testing.expect(false); // Should not reach here
        },
    }
}

test "CallResult wrapping" {
    // Create a success result
    const success = CallResult.success();
    try testing.expect(success.isSuccess());
    try testing.expect(!success.isRevert());
    try testing.expect(!success.isError());
    
    // Create error results
    const out_of_gas = CallResult.failure(Error.OutOfGas);
    try testing.expect(!out_of_gas.isSuccess());
    try testing.expect(!out_of_gas.isRevert());
    try testing.expect(out_of_gas.isError());
    try testing.expectEqual(StatusCode.OutOfGas, out_of_gas.status.code);
    
    const call_too_deep = CallResult.failure(Error.CallDepthExceeded);
    try testing.expect(!call_too_deep.isSuccess());
    try testing.expect(!call_too_deep.isRevert());
    try testing.expect(call_too_deep.isError());
    try testing.expectEqual(StatusCode.CallTooDeep, call_too_deep.status.code);
    
    // Create a revert result manually
    const revert = CallResult{
        .status = ExecutionStatus{
            .code = .Revert,
            .gas_used = 1000,
            .return_data = &[_]u8{0xDE, 0xAD, 0xBE, 0xEF},
        },
    };
    
    try testing.expect(!revert.isSuccess());
    try testing.expect(revert.isRevert());
    try testing.expect(!revert.isError());
    try testing.expectEqual(StatusCode.Revert, revert.status.code);
}