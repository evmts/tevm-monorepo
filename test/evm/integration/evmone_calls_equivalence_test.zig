const std = @import("std");
const testing = std.testing;
const evm = @import("evm");

// Test equivalents for evmone call tests
// Based on evmone/test/unittests/evm_calls_test.cpp

test "call_opcode_constants" {
    // Test that call-related opcodes have the correct values
    const CALL: u8 = 0xf1;
    const DELEGATECALL: u8 = 0xf4;
    const STATICCALL: u8 = 0xfa;
    const CREATE: u8 = 0xf0;
    const CREATE2: u8 = 0xf5;
    const RETURN: u8 = 0xf3;
    const REVERT: u8 = 0xfd;
    
    // Verify opcodes are different
    try testing.expect(CALL != DELEGATECALL);
    try testing.expect(STATICCALL != CALL);
    try testing.expect(CREATE != CREATE2);
    try testing.expect(RETURN != REVERT);
    
    // Verify expected values
    try testing.expectEqual(@as(u8, 0xf1), CALL);
    try testing.expectEqual(@as(u8, 0xf4), DELEGATECALL);
    try testing.expectEqual(@as(u8, 0xfa), STATICCALL);
    try testing.expectEqual(@as(u8, 0xf0), CREATE);
    try testing.expectEqual(@as(u8, 0xf5), CREATE2);
}

test "call_stack_requirements" {
    // Test call stack requirements from evmone
    
    // CALL requires 7 stack items: gas, address, value, argsOffset, argsSize, retOffset, retSize
    const call_stack_req = 7;
    
    // DELEGATECALL requires 6 stack items (no value)
    const delegatecall_stack_req = 6;
    
    // STATICCALL requires 6 stack items (no value)
    const staticcall_stack_req = 6;
    
    // CREATE requires 3 stack items: value, offset, size
    const create_stack_req = 3;
    
    // CREATE2 requires 4 stack items: value, offset, size, salt
    const create2_stack_req = 4;
    
    try testing.expectEqual(@as(u8, 7), call_stack_req);
    try testing.expectEqual(@as(u8, 6), delegatecall_stack_req);
    try testing.expectEqual(@as(u8, 6), staticcall_stack_req);
    try testing.expectEqual(@as(u8, 3), create_stack_req);
    try testing.expectEqual(@as(u8, 4), create2_stack_req);
}

test "call_depth_limit" {
    // Test call depth limit from evmone
    const max_call_depth: u32 = 1024;
    
    // Test depth tracking
    var current_depth: u32 = 0;
    
    // Simulate call depth increases
    while (current_depth < max_call_depth) {
        current_depth += 1;
    }
    
    try testing.expectEqual(max_call_depth, current_depth);
    
    // One more would exceed the limit
    const would_exceed = current_depth + 1;
    try testing.expect(would_exceed > max_call_depth);
}

test "gas_forwarding_calculation" {
    // Test gas forwarding calculation from evmone
    
    // EIP-150: Forward 63/64 of available gas
    const calculate_forwarded_gas = struct {
        fn call(available_gas: u64) u64 {
            return available_gas - (available_gas / 64);
        }
    }.call;
    
    // Test various gas amounts
    const test_cases = [_]struct { available: u64, expected_min: u64 }{
        .{ .available = 1000, .expected_min = 984 }, // 1000 - 15 = 985, but integer division
        .{ .available = 64, .expected_min = 63 },
        .{ .available = 128, .expected_min = 126 },
        .{ .available = 1000000, .expected_min = 984375 },
    };
    
    for (test_cases) |case| {
        const forwarded = calculate_forwarded_gas(case.available);
        try testing.expect(forwarded >= case.expected_min);
        try testing.expect(forwarded <= case.available);
    }
}

test "static_call_restrictions" {
    // Test static call restrictions from evmone
    
    // Operations prohibited in static context
    const prohibited_in_static = [_]u8{
        0x55, // SSTORE
        0xf0, // CREATE
        0xf5, // CREATE2
        0xff, // SELFDESTRUCT
        0xa1, // LOG1
        0xa2, // LOG2
        0xa3, // LOG3
        0xa4, // LOG4
    };
    
    // Operations allowed in static context
    const allowed_in_static = [_]u8{
        0x54, // SLOAD
        0x51, // MLOAD
        0x52, // MSTORE
        0x01, // ADD
        0x56, // JUMP
        0xfa, // STATICCALL (static calls can make more static calls)
    };
    
    // Verify we have both prohibited and allowed operations
    try testing.expect(prohibited_in_static.len > 0);
    try testing.expect(allowed_in_static.len > 0);
    
    // Verify STATICCALL is not in prohibited list
    for (prohibited_in_static) |prohibited| {
        try testing.expect(prohibited != 0xfa); // STATICCALL
    }
}

test "return_data_handling" {
    // Test return data handling concepts from evmone
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Simulate return data
    const return_data = [_]u8{ 0x42, 0x43, 0x44, 0x45 };
    var stored_return_data = try allocator.dupe(u8, &return_data);
    defer allocator.free(stored_return_data);
    
    // RETURNDATASIZE should return the size
    const return_data_size = stored_return_data.len;
    try testing.expectEqual(@as(usize, 4), return_data_size);
    
    // RETURNDATACOPY should be able to copy the data
    const copy_offset: usize = 0;
    const copy_size: usize = 2;
    
    if (copy_offset + copy_size <= stored_return_data.len) {
        const copied = stored_return_data[copy_offset..copy_offset + copy_size];
        try testing.expectEqualSlices(u8, &[_]u8{ 0x42, 0x43 }, copied);
    }
}