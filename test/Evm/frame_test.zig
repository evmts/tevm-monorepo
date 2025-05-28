const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Frame = evm.Frame;
const FrameError = evm.FrameError;
const HaltReason = evm.HaltReason;
const Gas = evm.Gas;
const Memory = evm.Memory;
const Stack = evm.Stack;
const Contract = evm.Contract;
const constants = evm.constants;

// Import Address separately since it's not part of evm module
const Address = @import("address").Address;

// Test helpers

fn createTestAddress(value: u8) Address {
    var addr: Address = undefined;
    @memset(&addr, value);
    return addr;
}

fn createTestContract(allocator: std.mem.Allocator) !*Contract {
    const code = try allocator.alloc(u8, 10);
    @memcpy(code, &[_]u8{ constants.PUSH1, 0x42, constants.JUMPDEST, constants.PUSH1, 0x00, constants.JUMP, constants.JUMPDEST, constants.STOP, 0x00, 0x00 });
    
    const contract = try allocator.create(Contract);
    contract.* = Contract.init(
        createTestAddress(0x11), // caller
        createTestAddress(0x22), // address
        1000,                    // value
        100000,                  // gas
        code,                    // code
        [_]u8{0} ** 32,         // code_hash
        &[_]u8{},               // input
        false,                   // is_static
    );
    
    // Manually set has_jumpdests since we know our test code has JUMPDESTs
    contract.has_jumpdests = true;
    
    return contract;
}

// Basic initialization tests

test "Frame initialization and cleanup" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Test initial state
    try testing.expectEqual(@as(usize, 0), frame.pc);
    try testing.expectEqual(@as(usize, 0), frame.stack.len());
    try testing.expectEqual(@as(usize, 0), frame.memory.size());
    try testing.expectEqual(HaltReason.None, frame.halt_reason);
    try testing.expectEqual(false, frame.is_static);
    try testing.expectEqual(@as(u32, 0), frame.depth);
    try testing.expect(frame.return_data == null);
}

test "Frame static mode initialization" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(50000);
    var frame = try Frame.init(allocator, contract, &gas, true, 5);
    defer frame.deinit();
    
    try testing.expectEqual(true, frame.is_static);
    try testing.expectEqual(@as(u32, 5), frame.depth);
    try testing.expectEqual(false, frame.canWrite());
}

// Execution control tests

test "Frame program counter operations" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Test currentOp
    try testing.expectEqual(@as(u8, constants.PUSH1), frame.currentOp().?);
    
    // Test advance
    frame.advance(1);
    try testing.expectEqual(@as(usize, 1), frame.pc);
    try testing.expectEqual(@as(u8, 0x42), frame.currentOp().?);
    
    frame.advance(2);
    try testing.expectEqual(@as(usize, 3), frame.pc);
    try testing.expectEqual(@as(u8, constants.PUSH1), frame.currentOp().?);
    
    // Test PC at end of code
    frame.pc = contract.code.len;
    try testing.expect(frame.currentOp() == null);
}

test "Frame jump validation" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Valid jump to JUMPDEST at position 2
    try frame.jump(2);
    try testing.expectEqual(@as(usize, 2), frame.pc);
    try testing.expectEqual(HaltReason.None, frame.halt_reason);
    
    // Valid jump to JUMPDEST at position 6
    try frame.jump(6);
    try testing.expectEqual(@as(usize, 6), frame.pc);
    
    // Invalid jump to non-JUMPDEST
    try testing.expectError(error.InvalidJump, frame.jump(1));
    try testing.expectEqual(HaltReason.InvalidJump, frame.halt_reason);
    
    // Reset halt reason for next test
    frame.halt_reason = .None;
    
    // Invalid jump beyond code
    try testing.expectError(error.InvalidPC, frame.jump(100));
    try testing.expectEqual(HaltReason.InvalidJump, frame.halt_reason);
}

test "Frame halt conditions" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    try testing.expectEqual(false, frame.shouldHalt());
    
    frame.halt(.Stop);
    try testing.expectEqual(true, frame.shouldHalt());
    try testing.expectEqual(HaltReason.Stop, frame.halt_reason);
    
    frame.halt_reason = .None;
    frame.halt(.OutOfGas);
    try testing.expectEqual(HaltReason.OutOfGas, frame.halt_reason);
}

// Stack operation tests

test "Frame stack operations" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Test push
    try frame.push(42);
    try frame.push(100);
    try testing.expectEqual(@as(usize, 2), frame.stackDepth());
    
    // Test pop
    const val1 = try frame.pop();
    try testing.expectEqual(@as(u256, 100), val1);
    try testing.expectEqual(@as(usize, 1), frame.stackDepth());
    
    // Test peek
    const top = try frame.peek();
    try testing.expectEqual(@as(u256, 42), top.*);
    try testing.expectEqual(@as(usize, 1), frame.stackDepth()); // Peek doesn't change depth
    
    // Test dup
    try frame.push(1);
    try frame.push(2);
    try frame.push(3);
    try frame.dup(2); // Duplicate 3rd from top
    
    const dup_val = try frame.pop();
    try testing.expectEqual(@as(u256, 2), dup_val);
    
    // Test swap
    try frame.swap(1); // Swap top two
    const swap_val1 = try frame.pop();
    const swap_val2 = try frame.pop();
    try testing.expectEqual(@as(u256, 2), swap_val1);
    try testing.expectEqual(@as(u256, 3), swap_val2);
}

test "Frame stack error handling" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Test stack underflow on pop
    try testing.expectError(error.StackUnderflow, frame.pop());
    try testing.expectEqual(HaltReason.StackUnderflow, frame.halt_reason);
    
    frame.halt_reason = .None;
    
    // Test stack underflow on peek
    try testing.expectError(error.StackUnderflow, frame.peek());
    try testing.expectEqual(HaltReason.StackUnderflow, frame.halt_reason);
    
    frame.halt_reason = .None;
    
    // Test stack overflow
    var i: usize = 0;
    while (i < Stack.STACK_LIMIT) : (i += 1) {
        try frame.push(i);
    }
    
    try testing.expectError(error.StackOverflow, frame.push(999));
    try testing.expectEqual(HaltReason.StackOverflow, frame.halt_reason);
}

// Gas metering tests

test "Gas consumption and tracking" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(1000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Test initial state
    try testing.expectEqual(@as(u64, 1000), gas.remaining);
    try testing.expectEqual(@as(u64, 0), gas.used);
    
    // Test gas consumption
    try gas.consume(100);
    try testing.expectEqual(@as(u64, 900), gas.remaining);
    try testing.expectEqual(@as(u64, 100), gas.used);
    
    // Test gas refund
    gas.refund(50);
    try testing.expectEqual(@as(u64, 50), gas.refunded);
    
    // Test out of gas
    try testing.expectError(error.OutOfGas, gas.consume(1000));
}

test "Memory gas cost calculation" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Test zero size
    const zero_result = gas.memoryGasCost(0, 0);
    try testing.expectEqual(@as(u64, 0), zero_result.cost);
    try testing.expectEqual(false, zero_result.overflow);
    
    // Test first word (32 bytes)
    const first_word = gas.memoryGasCost(0, 32);
    try testing.expectEqual(@as(u64, 3), first_word.cost); // 1 word * 3 gas
    try testing.expectEqual(false, first_word.overflow);
    
    // Test expansion
    gas.expandMemory(32);
    const second_word = gas.memoryGasCost(32, 32);
    try testing.expectEqual(@as(u64, 3), second_word.cost); // Linear cost for second word
    try testing.expectEqual(false, second_word.overflow);
    
    // Test overflow
    const overflow_result = gas.memoryGasCost(std.math.maxInt(usize) - 10, 20);
    try testing.expectEqual(true, overflow_result.overflow);
}

// Memory operation tests

test "Frame memory operations" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Test write and read word
    const test_value: u256 = 0x1234567890ABCDEF;
    try frame.writeMemoryWord(0, test_value);
    const read_value = try frame.readMemoryWord(0);
    try testing.expectEqual(test_value, read_value);
    
    // Test memory expansion
    try testing.expect(frame.memorySize() >= 32);
    
    // Test write and read bytes
    const test_data = [_]u8{ 1, 2, 3, 4, 5 };
    try frame.writeMemory(64, &test_data);
    const read_data = try frame.readMemory(64, test_data.len);
    try testing.expectEqualSlices(u8, &test_data, read_data);
    
    // Test empty operations
    try frame.writeMemory(100, &[_]u8{});
    const empty_data = try frame.readMemory(100, 0);
    try testing.expectEqual(@as(usize, 0), empty_data.len);
}

test "Frame memory gas charging" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(10000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    const initial_gas = gas.remaining;
    
    // First memory access charges for expansion
    try frame.ensureMemory(0, 32);
    try testing.expect(gas.remaining < initial_gas);
    const first_cost = initial_gas - gas.remaining;
    try testing.expectEqual(@as(u64, 3), first_cost); // 1 word * 3 gas
    
    // Second access to same area is free
    const gas_before_second = gas.remaining;
    try frame.ensureMemory(0, 32);
    try testing.expectEqual(gas_before_second, gas.remaining);
    
    // Expansion to new area charges more
    const gas_before_expansion = gas.remaining;
    try frame.ensureMemory(32, 32);
    try testing.expect(gas.remaining < gas_before_expansion);
}

// Return data tests

test "Frame return data management" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Test initial state
    try testing.expectEqual(@as(usize, 0), frame.getReturnDataSize());
    try testing.expectEqual(@as(usize, 0), frame.getReturnData().len);
    
    // Test setting return data
    const test_data = [_]u8{ 0xAA, 0xBB, 0xCC };
    try frame.setReturnData(&test_data);
    try testing.expectEqual(@as(usize, 3), frame.getReturnDataSize());
    try testing.expectEqualSlices(u8, &test_data, frame.getReturnData());
    
    // Test replacing return data
    const new_data = [_]u8{ 0x11, 0x22 };
    try frame.setReturnData(&new_data);
    try testing.expectEqual(@as(usize, 2), frame.getReturnDataSize());
    try testing.expectEqualSlices(u8, &new_data, frame.getReturnData());
    
    // Test clearing return data
    try frame.setReturnData(&[_]u8{});
    try testing.expectEqual(@as(usize, 0), frame.getReturnDataSize());
}

// Context accessor tests

test "Frame context accessors" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Test accessors
    try testing.expectEqual(createTestAddress(0x11), frame.getCaller());
    try testing.expectEqual(createTestAddress(0x22), frame.getAddress());
    try testing.expectEqual(@as(u256, 1000), frame.getValue());
    try testing.expectEqual(@as(usize, 0), frame.getInput().len);
    try testing.expectEqual(@as(usize, 10), frame.getCodeSize());
    try testing.expectEqual(contract.code, frame.getCode());
}

// State inspection tests

test "Frame state inspection" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 1023);
    defer frame.deinit();
    
    // Test depth limit
    try testing.expectEqual(false, frame.atDepthLimit());
    
    var deep_frame = try Frame.init(allocator, contract, &gas, false, 1024);
    defer deep_frame.deinit();
    try testing.expectEqual(true, deep_frame.atDepthLimit());
    
    // Test stack slice
    try frame.push(1);
    try frame.push(2);
    try frame.push(3);
    const stack_slice = frame.getStackSlice();
    try testing.expectEqual(@as(usize, 3), stack_slice.len);
    try testing.expectEqual(@as(u256, 1), stack_slice[0]);
    try testing.expectEqual(@as(u256, 2), stack_slice[1]);
    try testing.expectEqual(@as(u256, 3), stack_slice[2]);
    
    // Test memory slice
    try frame.writeMemory(0, &[_]u8{ 0xFF, 0xEE, 0xDD });
    const mem_slice = frame.getMemorySlice();
    try testing.expect(mem_slice.len >= 3);
    try testing.expectEqual(@as(u8, 0xFF), mem_slice[0]);
    try testing.expectEqual(@as(u8, 0xEE), mem_slice[1]);
    try testing.expectEqual(@as(u8, 0xDD), mem_slice[2]);
}

// Integration tests

test "Frame execution scenario" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Simulate executing PUSH1 0x42
    const op = frame.currentOp().?;
    try testing.expectEqual(constants.PUSH1, op);
    frame.advance(1);
    const value = frame.currentOp().?;
    try frame.push(value);
    frame.advance(1);
    
    // Check state after PUSH1
    try testing.expectEqual(@as(usize, 2), frame.pc);
    try testing.expectEqual(@as(usize, 1), frame.stackDepth());
    const stack_top = try frame.peek();
    try testing.expectEqual(@as(u256, 0x42), stack_top.*);
}

test "Frame out of gas scenario" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100); // Very limited gas
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // Try to allocate large memory
    try testing.expectError(error.OutOfGas, frame.ensureMemory(0, 10000));
    try testing.expectEqual(HaltReason.OutOfGas, frame.halt_reason);
}

// Debug support tests

test "Frame debug functionality" {
    const allocator = testing.allocator;
    
    const contract = try createTestContract(allocator);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    var gas = Gas.init(100000);
    var frame = try Frame.init(allocator, contract, &gas, false, 0);
    defer frame.deinit();
    
    // These should not crash
    frame.dumpState();
    frame.logOperation(constants.PUSH1);
    
    // Add some state and dump again
    try frame.push(42);
    try frame.writeMemory(0, &[_]u8{ 1, 2, 3 });
    frame.halt(.Stop);
    frame.dumpState();
}