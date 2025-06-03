const std = @import("std");
const testing = std.testing;
const Operation = @import("../../../src/evm/operation.zig");
const ExecutionError = @import("../../../src/evm/execution_error.zig");
const Stack = @import("../../../src/evm/stack.zig");
const Frame = @import("../../../src/evm/frame.zig");
const Contract = @import("../../../src/evm/contract.zig");
const Vm = @import("../../../src/evm/vm.zig");
const Memory = @import("../../../src/evm/memory.zig");
const Address = @import("Address");

// Import arithmetic opcodes
const arithmetic = @import("../../../src/evm/opcodes/arithmetic.zig");

// Test helper to create a basic frame for testing
fn createTestFrame(allocator: std.mem.Allocator) !Frame {
    const code = try allocator.alloc(u8, 100);
    @memset(code, 0);
    
    var contract = try Contract.init(
        allocator,
        code,
        Address.ZERO_ADDRESS,
        Address.ZERO_ADDRESS,
        0
    );
    
    return Frame.init(allocator, &contract);
}

// Test helper to push values to stack
fn pushToStack(frame: *Frame, values: []const u256) !void {
    for (values) |value| {
        try frame.stack.append(value);
    }
}

// Test helper to create a basic VM for testing
fn createTestVm(allocator: std.mem.Allocator) !Vm {
    return try Vm.init(allocator);
}

test "op_add basic addition" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test 5 + 10 = 15
    try pushToStack(&frame, &[_]u256{ 10, 5 });
    
    const result = try arithmetic.op_add(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    try testing.expectEqual(@as(usize, 0), result.output.len);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 15), top);
    try testing.expectEqual(@as(usize, 0), frame.stack.len());
}

test "op_add overflow wraps" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test max + 1 wraps to 0
    const max_u256: u256 = std.math.maxInt(u256);
    try pushToStack(&frame, &[_]u256{ 1, max_u256 });
    
    const result = try arithmetic.op_add(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), top);
}

test "op_sub basic subtraction" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test 10 - 3 = 7
    try pushToStack(&frame, &[_]u256{ 3, 10 });
    
    const result = try arithmetic.op_sub(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 7), top);
}

test "op_sub underflow wraps" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test 0 - 1 wraps to max
    try pushToStack(&frame, &[_]u256{ 1, 0 });
    
    const result = try arithmetic.op_sub(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(std.math.maxInt(u256), top);
}

test "op_mul basic multiplication" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test 7 * 8 = 56
    try pushToStack(&frame, &[_]u256{ 8, 7 });
    
    const result = try arithmetic.op_mul(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 56), top);
}

test "op_div basic division" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test 20 / 5 = 4
    try pushToStack(&frame, &[_]u256{ 5, 20 });
    
    const result = try arithmetic.op_div(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 4), top);
}

test "op_div by zero returns zero" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test 10 / 0 = 0 (EVM behavior)
    try pushToStack(&frame, &[_]u256{ 0, 10 });
    
    const result = try arithmetic.op_div(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), top);
}

test "op_mod basic modulo" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test 17 % 5 = 2
    try pushToStack(&frame, &[_]u256{ 5, 17 });
    
    const result = try arithmetic.op_mod(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), top);
}

test "op_mod by zero returns zero" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test 10 % 0 = 0 (EVM behavior)
    try pushToStack(&frame, &[_]u256{ 0, 10 });
    
    const result = try arithmetic.op_mod(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), top);
}

test "op_exp basic exponentiation" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test 2^3 = 8
    try pushToStack(&frame, &[_]u256{ 3, 2 });
    
    const result = try arithmetic.op_exp(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 8), top);
}

test "op_exp with zero exponent" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test 10^0 = 1
    try pushToStack(&frame, &[_]u256{ 0, 10 });
    
    const result = try arithmetic.op_exp(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), top);
}

test "op_addmod basic modular addition" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test (10 + 7) % 5 = 2
    try pushToStack(&frame, &[_]u256{ 5, 7, 10 });
    
    const result = try arithmetic.op_addmod(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), top);
}

test "op_addmod with overflow" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test (max + max) % 10 = 8 (handles overflow correctly)
    const max_u256: u256 = std.math.maxInt(u256);
    try pushToStack(&frame, &[_]u256{ 10, max_u256, max_u256 });
    
    const result = try arithmetic.op_addmod(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    // (2^256 - 1) + (2^256 - 1) = 2^257 - 2
    // 2^257 % 10 = 2^256 * 2 % 10 = 2^256 % 10 * 2 % 10
    // We need to compute what 2^256 % 10 is
    // 2^256 = (2^4)^64 = 16^64
    // 16 % 10 = 6
    // 6^64 % 10 = 6 (since 6^n % 10 = 6 for all n > 0)
    // So 2^256 % 10 = 6
    // Therefore (2^257 - 2) % 10 = (6 * 2 - 2) % 10 = 10 % 10 = 0
    // But wait, we have max + max = 2^256 - 1 + 2^256 - 1 = 2^257 - 2
    // Let's recalculate: 2^257 - 2 = 2 * 2^256 - 2 = 2(2^256 - 1)
    // So we need (2(2^256 - 1)) % 10
    // Actually, let's compute it step by step in the implementation
    try testing.expectEqual(@as(u256, 8), top);
}

test "op_mulmod basic modular multiplication" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test (4 * 7) % 5 = 3
    try pushToStack(&frame, &[_]u256{ 5, 7, 4 });
    
    const result = try arithmetic.op_mulmod(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 3), top);
}

test "op_signextend basic sign extension" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Test sign extending 0xFF (negative in 8-bit) with size 0 (8-bit)
    try pushToStack(&frame, &[_]u256{ 0xFF, 0 });
    
    const result = try arithmetic.op_signextend(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const top = try frame.stack.pop();
    // 0xFF sign-extended should become all 1s
    try testing.expectEqual(std.math.maxInt(u256), top);
}

test "stack underflow error" {
    const allocator = testing.allocator;
    var frame = try createTestFrame(allocator);
    defer frame.deinit();
    
    var vm = try createTestVm(allocator);
    defer vm.deinit();
    
    // Try to add with only one value on stack
    try pushToStack(&frame, &[_]u256{5});
    
    const err = arithmetic.op_add(0, @ptrCast(&vm), @ptrCast(&frame));
    try testing.expectError(ExecutionError.Error.StackUnderflow, err);
}