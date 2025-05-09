//! Test call operations in the ZigEVM interpreter
//! This module tests the CALL, STATICCALL, DELEGATECALL, and CALLCODE operations

const std = @import("std");
const testing = std.testing;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Address = types.Address;
const Hash = types.Hash;
const ExecutionResult = types.ExecutionResult;
const Error = types.Error;
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const environment_mod = @import("../../opcodes/environment.zig");
const EvmEnvironment = environment_mod.EvmEnvironment;
const call_ops = @import("../../opcodes/call_ops.zig");

// Mock callback for testing call operations
fn mockCall(
    caller: Address,
    target: Address,
    value: U256,
    input_data: []const u8,
    gas_limit: u64,
    is_static: bool,
    delegated_from: ?Address,
) ExecutionResult {
    _ = caller;
    _ = target;
    _ = value;
    _ = gas_limit;
    _ = is_static;
    _ = delegated_from;
    
    // Echo back the first byte of input data in the return data
    if (input_data.len > 0) {
        return .{
            .Success = .{
                .gas_used = 100,
                .gas_refunded = 0,
                .return_data = input_data[0..1],
            }
        };
    } else {
        return .{
            .Success = .{
                .gas_used = 100,
                .gas_refunded = 0,
                .return_data = &[_]u8{0x42}, // Default return value
            }
        };
    }
}

// Mock callback that always fails
fn mockFailCall(
    caller: Address,
    target: Address,
    value: U256,
    input_data: []const u8,
    gas_limit: u64,
    is_static: bool,
    delegated_from: ?Address,
) ExecutionResult {
    _ = caller;
    _ = target;
    _ = value;
    _ = input_data;
    _ = gas_limit;
    _ = is_static;
    _ = delegated_from;
    
    return .{
        .Revert = .{
            .gas_used = 100,
            .return_data = &[_]u8{0xFF}, // Error return data
        }
    };
}

// Test the CALL operation
test "CALL operation" {
    // Setup stack and memory for testing
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Setup return data buffer
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Create test input data in memory (0xAA)
    const input_offset: usize = 0;
    const input_size: usize = 1;
    memory.store(input_offset, &[_]u8{0xAA});
    
    // Create a place for output data
    const output_offset: usize = 32;
    const output_size: usize = 1;
    
    // Set up environment
    var environment = EvmEnvironment{
        .address = Address.zero(),
        .caller = Address.fromHexString("0x1111111111111111111111111111111111111111"),
        .value = U256.fromU64(1000),
        .coinbase = Address.fromHexString("0x2222222222222222222222222222222222222222"),
        .number = U256.fromU64(1234),
        .timestamp = U256.fromU64(5678),
        .chainid = U256.fromU64(1),
        .difficulty = U256.fromU64(50000),
        .gaslimit = U256.fromU64(1000000),
        .basefee = U256.fromU64(10),
    };
    
    // Push CALL parameters onto the stack
    try stack.push(U256.fromU64(1000)); // Gas
    try stack.push(U256.fromU64(0x42)); // Target address
    try stack.push(U256.fromU64(123));  // Value to transfer
    try stack.push(U256.fromU64(input_offset));  // Input data offset
    try stack.push(U256.fromU64(input_size));    // Input data size
    try stack.push(U256.fromU64(output_offset)); // Output data offset
    try stack.push(U256.fromU64(output_size));   // Output data size
    
    // Execute CALL operation
    var pc: usize = 0;
    var gas_left: u64 = 10000;
    var gas_refund: u64 = 0;
    try call_ops.call(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, &environment, mockCall, false);
    
    // Check results
    try testing.expectEqual(@as(usize, 1), pc); // PC should be advanced
    try testing.expectEqual(@as(usize, 1), stack.getSize()); // Stack should have 1 item (success flag)
    try testing.expectEqual(U256.fromU64(1), try stack.pop()); // Should be success (1)
    
    // Output data should be 0xAA (first byte of input data echoed back)
    try testing.expectEqual(@as(u8, 0xAA), memory.page.buffer[output_offset]);
}

// Test the STATICCALL operation
test "STATICCALL operation" {
    // Setup stack and memory for testing
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Setup return data buffer
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Create test input data in memory (0xBB)
    const input_offset: usize = 0;
    const input_size: usize = 1;
    memory.store(input_offset, &[_]u8{0xBB});
    
    // Create a place for output data
    const output_offset: usize = 32;
    const output_size: usize = 1;
    
    // Set up environment
    var environment = EvmEnvironment{
        .address = Address.zero(),
        .caller = Address.fromHexString("0x1111111111111111111111111111111111111111"),
        .value = U256.fromU64(1000),
        .coinbase = Address.fromHexString("0x2222222222222222222222222222222222222222"),
        .number = U256.fromU64(1234),
        .timestamp = U256.fromU64(5678),
        .chainid = U256.fromU64(1),
        .difficulty = U256.fromU64(50000),
        .gaslimit = U256.fromU64(1000000),
        .basefee = U256.fromU64(10),
    };
    
    // Push STATICCALL parameters onto the stack
    try stack.push(U256.fromU64(1000)); // Gas
    try stack.push(U256.fromU64(0x42)); // Target address
    try stack.push(U256.fromU64(input_offset));  // Input data offset
    try stack.push(U256.fromU64(input_size));    // Input data size
    try stack.push(U256.fromU64(output_offset)); // Output data offset
    try stack.push(U256.fromU64(output_size));   // Output data size
    
    // Execute STATICCALL operation
    var pc: usize = 0;
    var gas_left: u64 = 10000;
    var gas_refund: u64 = 0;
    try call_ops.staticcall(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, &environment, mockCall, false);
    
    // Check results
    try testing.expectEqual(@as(usize, 1), pc); // PC should be advanced
    try testing.expectEqual(@as(usize, 1), stack.getSize()); // Stack should have 1 item (success flag)
    try testing.expectEqual(U256.fromU64(1), try stack.pop()); // Should be success (1)
    
    // Output data should be 0xBB (first byte of input data echoed back)
    try testing.expectEqual(@as(u8, 0xBB), memory.page.buffer[output_offset]);
}

// Test the DELEGATECALL operation
test "DELEGATECALL operation" {
    // Setup stack and memory for testing
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Setup return data buffer
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Create test input data in memory (0xCC)
    const input_offset: usize = 0;
    const input_size: usize = 1;
    memory.store(input_offset, &[_]u8{0xCC});
    
    // Create a place for output data
    const output_offset: usize = 32;
    const output_size: usize = 1;
    
    // Set up environment
    var environment = EvmEnvironment{
        .address = Address.zero(),
        .caller = Address.fromHexString("0x1111111111111111111111111111111111111111"),
        .value = U256.fromU64(1000),
        .coinbase = Address.fromHexString("0x2222222222222222222222222222222222222222"),
        .number = U256.fromU64(1234),
        .timestamp = U256.fromU64(5678),
        .chainid = U256.fromU64(1),
        .difficulty = U256.fromU64(50000),
        .gaslimit = U256.fromU64(1000000),
        .basefee = U256.fromU64(10),
    };
    
    // Push DELEGATECALL parameters onto the stack
    try stack.push(U256.fromU64(1000)); // Gas
    try stack.push(U256.fromU64(0x42)); // Target address
    try stack.push(U256.fromU64(input_offset));  // Input data offset
    try stack.push(U256.fromU64(input_size));    // Input data size
    try stack.push(U256.fromU64(output_offset)); // Output data offset
    try stack.push(U256.fromU64(output_size));   // Output data size
    
    // Execute DELEGATECALL operation
    var pc: usize = 0;
    var gas_left: u64 = 10000;
    var gas_refund: u64 = 0;
    try call_ops.delegatecall(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, &environment, mockCall);
    
    // Check results
    try testing.expectEqual(@as(usize, 1), pc); // PC should be advanced
    try testing.expectEqual(@as(usize, 1), stack.getSize()); // Stack should have 1 item (success flag)
    try testing.expectEqual(U256.fromU64(1), try stack.pop()); // Should be success (1)
    
    // Output data should be 0xCC (first byte of input data echoed back)
    try testing.expectEqual(@as(u8, 0xCC), memory.page.buffer[output_offset]);
}

// Test the CALLCODE operation
test "CALLCODE operation" {
    // Setup stack and memory for testing
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Setup return data buffer
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Create test input data in memory (0xDD)
    const input_offset: usize = 0;
    const input_size: usize = 1;
    memory.store(input_offset, &[_]u8{0xDD});
    
    // Create a place for output data
    const output_offset: usize = 32;
    const output_size: usize = 1;
    
    // Set up environment
    var environment = EvmEnvironment{
        .address = Address.zero(),
        .caller = Address.fromHexString("0x1111111111111111111111111111111111111111"),
        .value = U256.fromU64(1000),
        .coinbase = Address.fromHexString("0x2222222222222222222222222222222222222222"),
        .number = U256.fromU64(1234),
        .timestamp = U256.fromU64(5678),
        .chainid = U256.fromU64(1),
        .difficulty = U256.fromU64(50000),
        .gaslimit = U256.fromU64(1000000),
        .basefee = U256.fromU64(10),
    };
    
    // Push CALLCODE parameters onto the stack
    try stack.push(U256.fromU64(1000)); // Gas
    try stack.push(U256.fromU64(0x42)); // Target address
    try stack.push(U256.fromU64(123));  // Value to transfer
    try stack.push(U256.fromU64(input_offset));  // Input data offset
    try stack.push(U256.fromU64(input_size));    // Input data size
    try stack.push(U256.fromU64(output_offset)); // Output data offset
    try stack.push(U256.fromU64(output_size));   // Output data size
    
    // Execute CALLCODE operation
    var pc: usize = 0;
    var gas_left: u64 = 10000;
    var gas_refund: u64 = 0;
    try call_ops.callcode(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, &environment, mockCall);
    
    // Check results
    try testing.expectEqual(@as(usize, 1), pc); // PC should be advanced
    try testing.expectEqual(@as(usize, 1), stack.getSize()); // Stack should have 1 item (success flag)
    try testing.expectEqual(U256.fromU64(1), try stack.pop()); // Should be success (1)
    
    // Output data should be 0xDD (first byte of input data echoed back)
    try testing.expectEqual(@as(u8, 0xDD), memory.page.buffer[output_offset]);
}

// Test for CALL failure case
test "CALL failure" {
    // Setup stack and memory for testing
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Setup return data buffer
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Create a place for output data
    const output_offset: usize = 32;
    const output_size: usize = 1;
    
    // Set up environment
    var environment = EvmEnvironment{
        .address = Address.zero(),
        .caller = Address.fromHexString("0x1111111111111111111111111111111111111111"),
        .value = U256.fromU64(1000),
        .coinbase = Address.fromHexString("0x2222222222222222222222222222222222222222"),
        .number = U256.fromU64(1234),
        .timestamp = U256.fromU64(5678),
        .chainid = U256.fromU64(1),
        .difficulty = U256.fromU64(50000),
        .gaslimit = U256.fromU64(1000000),
        .basefee = U256.fromU64(10),
    };
    
    // Push CALL parameters onto the stack
    try stack.push(U256.fromU64(1000)); // Gas
    try stack.push(U256.fromU64(0x42)); // Target address
    try stack.push(U256.fromU64(123));  // Value to transfer
    try stack.push(U256.fromU64(0));    // Input data offset
    try stack.push(U256.fromU64(0));    // Input data size
    try stack.push(U256.fromU64(output_offset)); // Output data offset
    try stack.push(U256.fromU64(output_size));   // Output data size
    
    // Execute CALL operation with failing call
    var pc: usize = 0;
    var gas_left: u64 = 10000;
    var gas_refund: u64 = 0;
    try call_ops.call(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, &environment, mockFailCall, false);
    
    // Check results
    try testing.expectEqual(@as(usize, 1), pc); // PC should be advanced
    try testing.expectEqual(@as(usize, 1), stack.getSize()); // Stack should have 1 item (success flag)
    try testing.expectEqual(U256.fromU64(0), try stack.pop()); // Should be failure (0)
    
    // Output data should contain the error data (0xFF)
    try testing.expectEqual(@as(u8, 0xFF), memory.page.buffer[output_offset]);
}

// Test that CALL with value transfer fails in static context
test "CALL with value in static context" {
    // Setup stack and memory for testing
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Push CALL parameters onto the stack
    try stack.push(U256.fromU64(1000)); // Gas
    try stack.push(U256.fromU64(0x42)); // Target address
    try stack.push(U256.fromU64(123));  // Value to transfer (non-zero)
    try stack.push(U256.fromU64(0));    // Input data offset
    try stack.push(U256.fromU64(0));    // Input data size
    try stack.push(U256.fromU64(0));    // Output data offset
    try stack.push(U256.fromU64(0));    // Output data size
    
    // Execute CALL operation in static context (should fail)
    var pc: usize = 0;
    var gas_left: u64 = 10000;
    var gas_refund: u64 = 0;
    
    // This should fail with StaticModeViolation
    try testing.expectError(
        Error.StaticModeViolation,
        call_ops.call(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, null, mockCall, true)
    );
    
    // Stack should be unchanged
    try testing.expectEqual(@as(usize, 7), stack.getSize());
}

// Test the BALANCE operation
test "BALANCE operation" {
    // Setup stack and memory for testing
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Push address to get balance for
    try stack.push(U256.fromU64(0x42));
    
    // Create a mock get_balance function
    const mock_get_balance = struct {
        fn getBalance(addr: Address) U256 {
            // For testing, return a balance based on the last byte of the address
            return U256.fromU64(addr.bytes[19]);
        }
    }.getBalance;
    
    // Execute BALANCE operation
    var pc: usize = 0;
    var gas_left: u64 = 10000;
    var gas_refund: u64 = 0;
    try call_ops.balance(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, mock_get_balance);
    
    // Check results
    try testing.expectEqual(@as(usize, 1), pc); // PC should be advanced
    try testing.expectEqual(@as(usize, 1), stack.getSize()); // Stack should have 1 item (balance)
    try testing.expectEqual(U256.fromU64(0x42), try stack.pop()); // Should be the balance (0x42)
}

// Test the EXTCODESIZE operation
test "EXTCODESIZE operation" {
    // Setup stack and memory for testing
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Push address to get code size for
    try stack.push(U256.fromU64(0x42));
    
    // Create a mock get_code function
    const mock_get_code = struct {
        fn getCode(addr: Address) []const u8 {
            _ = addr;
            // For testing, return a fixed code
            return &[_]u8{0x60, 0x01, 0x01, 0x00}; // PUSH1 1, ADD, STOP
        }
    }.getCode;
    
    // Execute EXTCODESIZE operation
    var pc: usize = 0;
    var gas_left: u64 = 10000;
    var gas_refund: u64 = 0;
    try call_ops.extcodesize(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, mock_get_code);
    
    // Check results
    try testing.expectEqual(@as(usize, 1), pc); // PC should be advanced
    try testing.expectEqual(@as(usize, 1), stack.getSize()); // Stack should have 1 item (code size)
    try testing.expectEqual(U256.fromU64(4), try stack.pop()); // Should be 4 (length of the mock code)
}

// Test the EXTCODECOPY operation
test "EXTCODECOPY operation" {
    // Setup stack and memory for testing
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Create a place for output data
    const dest_offset: usize = 0;
    const src_offset: usize = 1; // Skip first byte
    const size: usize = 2;      // Copy 2 bytes
    
    // Push EXTCODECOPY parameters onto the stack
    try stack.push(U256.fromU64(0x42));       // Target address
    try stack.push(U256.fromU64(dest_offset)); // Destination memory offset
    try stack.push(U256.fromU64(src_offset));  // Source code offset
    try stack.push(U256.fromU64(size));        // Size to copy
    
    // Create a mock get_code function
    const mock_get_code = struct {
        fn getCode(addr: Address) []const u8 {
            _ = addr;
            // For testing, return a fixed code
            return &[_]u8{0x60, 0x01, 0x01, 0x00}; // PUSH1 1, ADD, STOP
        }
    }.getCode;
    
    // Execute EXTCODECOPY operation
    var pc: usize = 0;
    var gas_left: u64 = 10000;
    var gas_refund: u64 = 0;
    try call_ops.extcodecopy(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, mock_get_code);
    
    // Check results
    try testing.expectEqual(@as(usize, 1), pc); // PC should be advanced
    try testing.expectEqual(@as(usize, 0), stack.getSize()); // Stack should be empty
    
    // Memory should contain the copied code (bytes 1-2: 0x01, 0x01)
    try testing.expectEqual(@as(u8, 0x01), memory.page.buffer[dest_offset]);
    try testing.expectEqual(@as(u8, 0x01), memory.page.buffer[dest_offset + 1]);
}

// Test the EXTCODEHASH operation
test "EXTCODEHASH operation" {
    // Setup stack and memory for testing
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Push address to get code hash for
    try stack.push(U256.fromU64(0x42));
    
    // Create a mock get_code function
    const mock_get_code = struct {
        fn getCode(addr: Address) []const u8 {
            _ = addr;
            // For testing, return a fixed code
            return &[_]u8{0x60, 0x01, 0x01, 0x00}; // PUSH1 1, ADD, STOP
        }
    }.getCode;
    
    // Execute EXTCODEHASH operation
    var pc: usize = 0;
    var gas_left: u64 = 10000;
    var gas_refund: u64 = 0;
    try call_ops.extcodehash(&stack, &memory, &[_]u8{0}, &pc, &gas_left, &gas_refund, mock_get_code);
    
    // Check results
    try testing.expectEqual(@as(usize, 1), pc); // PC should be advanced
    try testing.expectEqual(@as(usize, 1), stack.getSize()); // Stack should have 1 item (code hash)
    
    // The hash value is computed by a simple hash function in the implementation
    // We're not checking the exact value, just that it's non-zero for non-empty code
    const hash = try stack.pop();
    try testing.expect(!hash.isZero());
}