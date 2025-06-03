const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const opcodes = evm.opcodes;
const test_helpers = @import("test_helpers.zig");
const ExecutionError = evm.ExecutionError;

// Test PUSH0 operation
test "PUSH0: push zero value" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Execute PUSH0
    try test_helpers.executeOpcode(opcodes.stack.op_push0, &frame);
    
    // Should push 0
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

// Test PUSH1 operation
test "PUSH1: push 1 byte value" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set contract code with PUSH1 0xAB
    const code = [_]u8{ 0x60, 0xAB };
    vm.setCode(test_helpers.TEST_CONTRACT_ADDRESS, &code);
    
    // Set PC to 0 (at PUSH1 opcode)
    frame.frame.pc = 0;
    
    // Execute PUSH1
    const result = try test_helpers.executeOpcode(opcodes.stack.op_push1, &frame);
    
    // Should consume 2 bytes (opcode + data)
    try testing.expectEqual(@as(usize, 2), result.bytes_consumed);
    
    // Should push 0xAB
    try testing.expectEqual(@as(u256, 0xAB), try frame.popValue());
}

// Test PUSH2 through PUSH32
test "PUSH2: push 2 byte value" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set contract code with PUSH2 0x1234
    const code = [_]u8{ 0x61, 0x12, 0x34 };
    vm.setCode(test_helpers.TEST_CONTRACT_ADDRESS, &code);
    
    frame.frame.pc = 0;
    
    // Execute PUSH2
    const result = try test_helpers.executeOpcode(opcodes.stack.op_push2, &frame);
    
    // Should consume 3 bytes
    try testing.expectEqual(@as(usize, 3), result.bytes_consumed);
    
    // Should push 0x1234
    try testing.expectEqual(@as(u256, 0x1234), try frame.popValue());
}

test "PUSH32: push 32 byte value" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set contract code with PUSH32 followed by 32 bytes
    var code: [33]u8 = undefined;
    code[0] = 0x7f; // PUSH32 opcode
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        code[i + 1] = @intCast(i + 1); // 0x01, 0x02, ..., 0x20
    }
    vm.setCode(test_helpers.TEST_CONTRACT_ADDRESS, &code);
    
    frame.frame.pc = 0;
    
    // Execute PUSH32
    const result = try test_helpers.executeOpcode(opcodes.stack.op_push32, &frame);
    
    // Should consume 33 bytes
    try testing.expectEqual(@as(usize, 33), result.bytes_consumed);
    
    // Should push the value (first byte 0x01 in most significant position)
    const value = try frame.popValue();
    try testing.expect((value >> 248) == 0x01);
    try testing.expect(((value >> 240) & 0xFF) == 0x02);
    try testing.expect((value & 0xFF) == 0x20);
}

// Test POP operation
test "POP: remove top stack item" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push some values
    try frame.pushValue(0x123);
    try frame.pushValue(0x456);
    
    // Execute POP
    try test_helpers.executeOpcode(opcodes.stack.op_pop, &frame);
    
    // Should have removed top item (0x456)
    try testing.expectEqual(@as(u256, 0x123), try frame.popValue());
    try testing.expectEqual(@as(usize, 0), frame.stack.items.len);
}

// Test DUP operations
test "DUP1: duplicate top stack item" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push a value
    try frame.pushValue(0xABCD);
    
    // Execute DUP1
    try test_helpers.executeOpcode(opcodes.stack.op_dup1, &frame);
    
    // Should have two copies of the value
    try testing.expectEqual(@as(u256, 0xABCD), try frame.popValue());
    try testing.expectEqual(@as(u256, 0xABCD), try frame.popValue());
}

test "DUP2: duplicate second stack item" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push two values
    try frame.pushValue(0x111); // bottom
    try frame.pushValue(0x222); // top
    
    // Execute DUP2
    try test_helpers.executeOpcode(opcodes.stack.op_dup2, &frame);
    
    // Stack should be: 0x111, 0x222, 0x111
    try testing.expectEqual(@as(u256, 0x111), try frame.popValue());
    try testing.expectEqual(@as(u256, 0x222), try frame.popValue());
    try testing.expectEqual(@as(u256, 0x111), try frame.popValue());
}

test "DUP16: duplicate 16th stack item" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push 16 values
    var i: u256 = 1;
    while (i <= 16) : (i += 1) {
        try frame.pushValue(i * 100);
    }
    
    // Execute DUP16
    try test_helpers.executeOpcode(opcodes.stack.op_dup16, &frame);
    
    // Should duplicate the bottom item (100)
    try testing.expectEqual(@as(u256, 100), try frame.popValue());
    
    // Original stack should still be intact
    i = 16;
    while (i >= 1) : (i -= 1) {
        try testing.expectEqual(i * 100, try frame.popValue());
    }
}

// Test SWAP operations
test "SWAP1: swap top two stack items" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push two values
    try frame.pushValue(0x111); // bottom
    try frame.pushValue(0x222); // top
    
    // Execute SWAP1
    try test_helpers.executeOpcode(opcodes.stack.op_swap1, &frame);
    
    // Order should be swapped
    try testing.expectEqual(@as(u256, 0x111), try frame.popValue());
    try testing.expectEqual(@as(u256, 0x222), try frame.popValue());
}

test "SWAP2: swap 1st and 3rd stack items" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push three values
    try frame.pushValue(0x111); // bottom
    try frame.pushValue(0x222); // middle
    try frame.pushValue(0x333); // top
    
    // Execute SWAP2
    try test_helpers.executeOpcode(opcodes.stack.op_swap2, &frame);
    
    // Stack should be: 0x222, 0x111, 0x333
    try testing.expectEqual(@as(u256, 0x111), try frame.popValue());
    try testing.expectEqual(@as(u256, 0x222), try frame.popValue());
    try testing.expectEqual(@as(u256, 0x333), try frame.popValue());
}

test "SWAP16: swap 1st and 17th stack items" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push 17 values
    var i: u256 = 1;
    while (i <= 17) : (i += 1) {
        try frame.pushValue(i);
    }
    
    // Execute SWAP16
    try test_helpers.executeOpcode(opcodes.stack.op_swap16, &frame);
    
    // Top should now be 1, bottom should be 17
    try testing.expectEqual(@as(u256, 1), try frame.popValue());
    
    // Pop middle values
    i = 16;
    while (i >= 2) : (i -= 1) {
        try testing.expectEqual(i, try frame.popValue());
    }
    
    // Bottom should be 17
    try testing.expectEqual(@as(u256, 17), try frame.popValue());
}

// Test edge cases
test "PUSH1: at end of code" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set contract code with PUSH1 but no data byte
    const code = [_]u8{0x60}; // Just PUSH1 opcode
    vm.setCode(test_helpers.TEST_CONTRACT_ADDRESS, &code);
    
    frame.frame.pc = 0;
    
    // Execute PUSH1
    const result = try test_helpers.executeOpcode(opcodes.stack.op_push1, &frame);
    
    // Should consume 2 bytes (even though only 1 exists)
    try testing.expectEqual(@as(usize, 2), result.bytes_consumed);
    
    // Should push 0 (padding)
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

test "PUSH32: partial data available" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set contract code with PUSH32 but only 10 data bytes
    var code: [11]u8 = undefined;
    code[0] = 0x7f; // PUSH32 opcode
    var i: usize = 0;
    while (i < 10) : (i += 1) {
        code[i + 1] = 0xFF;
    }
    vm.setCode(test_helpers.TEST_CONTRACT_ADDRESS, &code);
    
    frame.frame.pc = 0;
    
    // Execute PUSH32
    const result = try test_helpers.executeOpcode(opcodes.stack.op_push32, &frame);
    
    // Should consume 33 bytes
    try testing.expectEqual(@as(usize, 33), result.bytes_consumed);
    
    // Should push value with padding
    const value = try frame.popValue();
    // First 10 bytes should be 0xFF
    var j: usize = 0;
    while (j < 10) : (j += 1) {
        try testing.expectEqual(@as(u8, 0xFF), @as(u8, @intCast((value >> @intCast(8 * (31 - j))) & 0xFF)));
    }
    // Remaining bytes should be 0
    while (j < 32) : (j += 1) {
        try testing.expectEqual(@as(u8, 0), @as(u8, @intCast((value >> @intCast(8 * (31 - j))) & 0xFF)));
    }
}

// Test stack errors
test "POP: stack underflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Empty stack
    
    // Execute POP - should fail
    const result = test_helpers.executeOpcode(opcodes.stack.op_pop, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "DUP1: stack underflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Empty stack
    
    // Execute DUP1 - should fail
    const result = test_helpers.executeOpcode(opcodes.stack.op_dup1, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "DUP16: insufficient stack items" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only 15 values (need 16)
    var i: u256 = 0;
    while (i < 15) : (i += 1) {
        try frame.pushValue(i);
    }
    
    // Execute DUP16 - should fail
    const result = test_helpers.executeOpcode(opcodes.stack.op_dup16, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "SWAP1: stack underflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only one value (need two)
    try frame.pushValue(0x123);
    
    // Execute SWAP1 - should fail
    const result = test_helpers.executeOpcode(opcodes.stack.op_swap1, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "PUSH1: stack overflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Fill stack to maximum (1024 items)
    var i: usize = 0;
    while (i < 1024) : (i += 1) {
        try frame.pushValue(i);
    }
    
    // Set contract code
    const code = [_]u8{ 0x60, 0x01 };
    vm.setCode(test_helpers.TEST_CONTRACT_ADDRESS, &code);
    frame.frame.pc = 0;
    
    // Execute PUSH1 - should fail with stack overflow
    const result = test_helpers.executeOpcode(opcodes.stack.op_push1, &frame);
    try testing.expectError(ExecutionError.Error.StackOverflow, result);
}

test "DUP1: stack overflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Fill stack to maximum (1024 items)
    var i: usize = 0;
    while (i < 1024) : (i += 1) {
        try frame.pushValue(i);
    }
    
    // Execute DUP1 - should fail with stack overflow
    const result = test_helpers.executeOpcode(opcodes.stack.op_dup1, &frame);
    try testing.expectError(ExecutionError.Error.StackOverflow, result);
}