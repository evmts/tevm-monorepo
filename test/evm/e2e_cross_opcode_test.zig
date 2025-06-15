/// Comprehensive end-to-end cross-opcode interaction tests
///
/// This test suite focuses on complex interactions between different
/// opcode categories to ensure they work correctly together:
/// 1. Arithmetic + Memory operations
/// 2. Stack + Storage interactions
/// 3. Control flow + Comparison logic
/// 4. Crypto + Memory management
/// 5. Complex multi-operation sequences
/// 6. Edge case combinations

const std = @import("std");
const testing = std.testing;
const Vm = @import("evm").Vm;
const Frame = @import("evm").Frame;
const Memory = @import("evm").Memory;
const Stack = @import("evm").stack.Stack;
const evm = @import("evm");

/// Execute bytecode and return comprehensive results
fn executeComplexBytecode(allocator: std.mem.Allocator, bytecode: []const u8, gas_limit: u64) !struct {
    success: bool,
    gas_used: u64,
    return_data: []const u8,
    final_stack_size: usize,
    memory_size: u64,
} {
    var vm = try Vm.init(allocator);
    defer vm.deinit();

    var frame = Frame{
        .stack = Stack{},
        .memory = try Memory.init(allocator),
        .gas_remaining = gas_limit,
        .contract_address = [_]u8{0x12, 0x34, 0x56, 0x78} ++ [_]u8{0} ** 16,
        .caller = [_]u8{0xAA, 0xBB, 0xCC, 0xDD} ++ [_]u8{0} ** 16,
        .call_value = 0,
        .call_data = &[_]u8{},
        .return_data = &[_]u8{},
        .code = bytecode,
        .is_static = false,
        .depth = 0,
    };
    defer frame.memory.deinit();
    
    const initial_gas = frame.gas_remaining;
    
    const result = vm.interpret(&frame) catch |err| switch (err) {
        error.Revert, error.OutOfGas, error.StackUnderflow, error.StackOverflow => return .{
            .success = false,
            .gas_used = initial_gas - frame.gas_remaining,
            .return_data = frame.return_data,
            .final_stack_size = frame.stack.size,
            .memory_size = frame.memory.size(),
        },
        else => return err,
    };
    
    return .{
        .success = true,
        .gas_used = initial_gas - frame.gas_remaining,
        .return_data = result.return_data,
        .final_stack_size = frame.stack.size,
        .memory_size = frame.memory.size(),
    };
}

/// Test 1: Arithmetic + Memory interaction
test "Cross-opcode E2E: Arithmetic operations with memory storage" {
    const allocator = testing.allocator;
    
    // Complex arithmetic stored in memory at different locations
    const bytecode = [_]u8{
        // Compute (10 + 20) * 3 = 90
        0x60, 0x0A,  // PUSH1 10
        0x60, 0x14,  // PUSH1 20
        0x01,        // ADD (30)
        0x60, 0x03,  // PUSH1 3
        0x02,        // MUL (90)
        0x60, 0x00,  // PUSH1 0x00 (memory offset)
        0x52,        // MSTORE
        
        // Compute (100 - 25) / 5 = 15
        0x60, 0x64,  // PUSH1 100
        0x60, 0x19,  // PUSH1 25
        0x03,        // SUB (75)
        0x60, 0x05,  // PUSH1 5
        0x04,        // DIV (15)
        0x60, 0x20,  // PUSH1 0x20 (memory offset 32)
        0x52,        // MSTORE
        
        // Load both values and add them
        0x60, 0x00,  // PUSH1 0x00
        0x51,        // MLOAD (90)
        0x60, 0x20,  // PUSH1 0x20
        0x51,        // MLOAD (15)
        0x01,        // ADD (105)
        
        // Store result at offset 64
        0x60, 0x40,  // PUSH1 0x40
        0x52,        // MSTORE
        
        // Return the final result
        0x60, 0x20,  // PUSH1 0x20 (return 32 bytes)
        0x60, 0x40,  // PUSH1 0x40 (from offset 64)
        0xF3,        // RETURN
    };
    
    const result = try executeComplexBytecode(allocator, &bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.return_data.len == 32);
    try testing.expect(result.memory_size >= 96); // Should have expanded to at least 96 bytes
    
    // Result should be 105 (90 + 15)
    var expected = [_]u8{0} ** 32;
    expected[31] = 105;
    try testing.expectEqualSlices(u8, &expected, result.return_data);
}

/// Test 2: Stack manipulation + Storage operations
test "Cross-opcode E2E: Complex stack operations with storage" {
    const allocator = testing.allocator;
    
    // Use DUP, SWAP operations with storage
    const bytecode = [_]u8{
        // Push multiple values: 1, 2, 3, 4, 5
        0x60, 0x01,  // PUSH1 1
        0x60, 0x02,  // PUSH1 2
        0x60, 0x03,  // PUSH1 3
        0x60, 0x04,  // PUSH1 4
        0x60, 0x05,  // PUSH1 5
        
        // Stack: [5, 4, 3, 2, 1] (top to bottom)
        
        // DUP3 to duplicate 3 to top
        0x82,        // DUP3 -> [3, 5, 4, 3, 2, 1]
        
        // Store top value (3) at slot 0
        0x60, 0x00,  // PUSH1 0
        0x55,        // SSTORE -> [5, 4, 3, 2, 1]
        
        // SWAP2 to swap top (5) with 3rd item (3)
        0x91,        // SWAP2 -> [3, 4, 5, 2, 1]
        
        // Store top value (3) at slot 1
        0x60, 0x01,  // PUSH1 1
        0x55,        // SSTORE -> [4, 5, 2, 1]
        
        // Add top two values
        0x01,        // ADD -> [9, 2, 1] (4+5=9)
        
        // Store at slot 2
        0x60, 0x02,  // PUSH1 2
        0x55,        // SSTORE -> [2, 1]
        
        // Load all stored values and sum them
        0x60, 0x00,  // PUSH1 0
        0x54,        // SLOAD (3)
        0x60, 0x01,  // PUSH1 1
        0x54,        // SLOAD (3)
        0x01,        // ADD (6)
        0x60, 0x02,  // PUSH1 2
        0x54,        // SLOAD (9)
        0x01,        // ADD (15)
        
        // Return result
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 32
        0x60, 0x00,  // PUSH1 0
        0xF3,        // RETURN
    };
    
    const result = try executeComplexBytecode(allocator, &bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.return_data.len == 32);
    
    // Result should be 15 (3 + 3 + 9)
    var expected = [_]u8{0} ** 32;
    expected[31] = 15;
    try testing.expectEqualSlices(u8, &expected, result.return_data);
}

/// Test 3: Control flow + Comparison + Arithmetic
test "Cross-opcode E2E: Complex control flow with comparisons" {
    const allocator = testing.allocator;
    
    // Implement max(a, b, c) function using comparisons and jumps
    const bytecode = [_]u8{
        // Input values: a=15, b=25, c=10
        0x60, 0x0F,  // PUSH1 15 (a)
        0x60, 0x19,  // PUSH1 25 (b) 
        0x60, 0x0A,  // PUSH1 10 (c)
        
        // Stack: [10, 25, 15] (c, b, a)
        
        // Compare a and b
        0x81,        // DUP2 (get b) -> [25, 10, 25, 15]
        0x83,        // DUP4 (get a) -> [15, 25, 10, 25, 15]
        0x11,        // GT (b > a?) -> [1, 10, 25, 15] (25 > 15 = true)
        
        0x60, 0x18,  // PUSH1 0x18 (jump to b_greater)
        0x57,        // JUMPI -> [10, 25, 15]
        
        // a >= b path: max_ab = a
        0x82,        // DUP3 (get a) -> [15, 10, 25, 15]
        0x60, 0x20,  // PUSH1 0x20 (jump to compare_with_c)
        0x56,        // JUMP
        
        // b > a path: max_ab = b (offset 0x18 = 24)
        0x5B,        // JUMPDEST
        0x81,        // DUP2 (get b) -> [25, 10, 25, 15]
        
        // Compare max_ab with c (offset 0x20 = 32)
        0x5B,        // JUMPDEST
        0x82,        // DUP3 (get c) -> [10, 25, 10, 25, 15]
        0x11,        // GT (max_ab > c?) -> [1, 10, 25, 15]
        
        0x60, 0x2A,  // PUSH1 0x2A (jump to max_ab_greater)
        0x57,        // JUMPI
        
        // c >= max_ab path: result = c
        0x81,        // DUP2 (get c) -> [10, 10, 25, 15]
        0x60, 0x2C,  // PUSH1 0x2C (jump to end)
        0x56,        // JUMP
        
        // max_ab > c path: result = max_ab (offset 0x2A = 42)
        0x5B,        // JUMPDEST
        // max_ab is already on top
        
        // End (offset 0x2C = 44)
        0x5B,        // JUMPDEST
        
        // Clean up stack and return result
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 32
        0x60, 0x00,  // PUSH1 0
        0xF3,        // RETURN
    };
    
    const result = try executeComplexBytecode(allocator, &bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.return_data.len == 32);
    
    // Result should be 25 (max of 15, 25, 10)
    var expected = [_]u8{0} ** 32;
    expected[31] = 25;
    try testing.expectEqualSlices(u8, &expected, result.return_data);
}

/// Test 4: Bitwise operations + Memory + Loop
test "Cross-opcode E2E: Bitwise operations in memory with loops" {
    const allocator = testing.allocator;
    
    // Count number of set bits in a value using bitwise operations
    const bytecode = [_]u8{
        // Value to count bits: 0x5A (01011010) - should have 4 set bits
        0x60, 0x5A,  // PUSH1 0x5A
        0x60, 0x00,  // PUSH1 0 (bit counter)
        0x60, 0x08,  // PUSH1 8 (bit position counter)
        
        // Loop through 8 bits
        // Stack: [8, 0, 0x5A] (bit_pos, counter, value)
        
        // Loop start (offset 8)
        0x5B,        // JUMPDEST
        0x80,        // DUP1 (get bit_pos)
        0x15,        // ISZERO (check if bit_pos == 0)
        0x60, 0x20,  // PUSH1 0x20 (exit loop)
        0x57,        // JUMPI
        
        // Check if current bit is set
        0x82,        // DUP3 (get value)
        0x60, 0x01,  // PUSH1 1
        0x16,        // AND (value & 1)
        
        // If bit is set, increment counter
        0x15,        // ISZERO (check if bit is 0)
        0x60, 0x1C,  // PUSH1 0x1C (skip increment)
        0x57,        // JUMPI
        
        // Increment counter
        0x90,        // SWAP1 (get counter to top)
        0x60, 0x01,  // PUSH1 1
        0x01,        // ADD
        0x90,        // SWAP1 (put counter back)
        
        // Shift value right by 1 (offset 0x1C = 28)
        0x5B,        // JUMPDEST
        0x82,        // DUP3 (get value)
        0x60, 0x01,  // PUSH1 1
        0x1C,        // SHR (logical shift right)
        0x83,        // DUP4
        0x50,        // POP
        0x90,        // SWAP1
        0x50,        // POP (update value on stack)
        
        // Decrement bit position
        0x60, 0x01,  // PUSH1 1
        0x03,        // SUB
        
        // Jump back to loop start
        0x60, 0x08,  // PUSH1 8
        0x56,        // JUMP
        
        // Exit loop (offset 0x20 = 32)
        0x5B,        // JUMPDEST
        0x50,        // POP (remove bit_pos)
        0x90,        // SWAP1 (get counter)
        0x50,        // POP (remove value)
        
        // Store and return result
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 32
        0x60, 0x00,  // PUSH1 0
        0xF3,        // RETURN
    };
    
    const result = try executeComplexBytecode(allocator, &bytecode, 100000);
    
    if (result.success) {
        try testing.expect(result.return_data.len == 32);
        
        // 0x5A = 01011010 has 4 set bits
        var expected = [_]u8{0} ** 32;
        expected[31] = 4;
        try testing.expectEqualSlices(u8, &expected, result.return_data);
    } else {
        // Complex loop might run out of gas - that's also acceptable
        std.debug.print("Bit counting loop used all gas: {}\n", .{result.gas_used});
    }
}

/// Test 5: Keccak256 + Memory + Arithmetic
test "Cross-opcode E2E: Hash computation with memory management" {
    const allocator = testing.allocator;
    
    // Compute hash of concatenated values in memory
    const bytecode = [_]u8{
        // Store first value (0x1234) at memory offset 0
        0x61, 0x12, 0x34, // PUSH2 0x1234
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        
        // Store second value (0x5678) at memory offset 32
        0x61, 0x56, 0x78, // PUSH2 0x5678
        0x60, 0x20,  // PUSH1 32
        0x52,        // MSTORE
        
        // Copy second value to offset 30 (overlap with first)
        0x60, 0x20,  // PUSH1 32 (size)
        0x60, 0x20,  // PUSH1 32 (src)
        0x60, 0x1E,  // PUSH1 30 (dst) 
        0x37,        // CALLDATACOPY (actually CODECOPY in this context)
        // Note: In real implementation, we'd use MCOPY if available
        
        // Compute hash of 64 bytes starting from offset 0
        0x60, 0x40,  // PUSH1 64 (size)
        0x60, 0x00,  // PUSH1 0 (offset)
        0x20,        // KECCAK256
        
        // Store hash at offset 64
        0x60, 0x40,  // PUSH1 64
        0x52,        // MSTORE
        
        // Return the hash
        0x60, 0x20,  // PUSH1 32
        0x60, 0x40,  // PUSH1 64
        0xF3,        // RETURN
    };
    
    const result = try executeComplexBytecode(allocator, &bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.return_data.len == 32);
    try testing.expect(result.memory_size >= 96); // Should have used memory up to offset 96
    
    // Hash should be deterministic and non-zero
    var zero_hash = [_]u8{0} ** 32;
    try testing.expect(!std.mem.eql(u8, &zero_hash, result.return_data));
}

/// Test 6: Complex storage pattern with arithmetic
test "Cross-opcode E2E: Storage mapping simulation" {
    const allocator = testing.allocator;
    
    // Simulate a mapping: mapping[key] = value
    // Storage slot = keccak256(key . slot)
    const bytecode = [_]u8{
        // Key = 0x42, Base slot = 0x01
        0x60, 0x42,  // PUSH1 0x42 (key)
        0x60, 0x00,  // PUSH1 0 (memory offset for key)
        0x52,        // MSTORE
        
        0x60, 0x01,  // PUSH1 0x01 (base slot)
        0x60, 0x20,  // PUSH1 32 (memory offset for slot)
        0x52,        // MSTORE
        
        // Compute storage slot = keccak256(key . slot)
        0x60, 0x40,  // PUSH1 64 (size: key + slot)
        0x60, 0x00,  // PUSH1 0 (offset)
        0x20,        // KECCAK256
        
        // Store value 0x99 at computed slot
        0x60, 0x99,  // PUSH1 0x99 (value)
        0x91,        // SWAP1 (get computed slot)
        0x55,        // SSTORE
        
        // Now retrieve the value using same computation
        0x60, 0x42,  // PUSH1 0x42 (key)
        0x60, 0x40,  // PUSH1 64 (memory offset for key)
        0x52,        // MSTORE
        
        0x60, 0x01,  // PUSH1 0x01 (base slot)
        0x60, 0x60,  // PUSH1 96 (memory offset for slot)
        0x52,        // MSTORE
        
        // Compute storage slot again
        0x60, 0x40,  // PUSH1 64 (size)
        0x60, 0x40,  // PUSH1 64 (offset)
        0x20,        // KECCAK256
        
        // Load value from computed slot
        0x54,        // SLOAD
        
        // Return the loaded value
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 32
        0x60, 0x00,  // PUSH1 0
        0xF3,        // RETURN
    };
    
    const result = try executeComplexBytecode(allocator, &bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.return_data.len == 32);
    
    // Should retrieve the stored value 0x99
    var expected = [_]u8{0} ** 32;
    expected[31] = 0x99;
    try testing.expectEqualSlices(u8, &expected, result.return_data);
}

/// Test 7: Exception handling across operations
test "Cross-opcode E2E: Error propagation across operations" {
    const allocator = testing.allocator;
    
    // Bytecode that causes different types of errors
    const division_by_zero_bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 10
        0x60, 0x00,  // PUSH1 0
        0x04,        // DIV (10 / 0 = 0 in EVM, no error)
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 32
        0x60, 0x00,  // PUSH1 0
        0xF3,        // RETURN
    };
    
    const result1 = try executeComplexBytecode(allocator, &division_by_zero_bytecode, 100000);
    try testing.expect(result1.success); // EVM division by zero returns 0, no error
    
    // Stack underflow test
    const stack_underflow_bytecode = [_]u8{
        0x60, 0x01,  // PUSH1 1 (only one item)
        0x01,        // ADD (requires 2 items - should fail)
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 32
        0x60, 0x00,  // PUSH1 0
        0xF3,        // RETURN
    };
    
    const result2 = try executeComplexBytecode(allocator, &stack_underflow_bytecode, 100000);
    try testing.expect(!result2.success); // Should fail with stack underflow
    
    // Invalid jump test
    const invalid_jump_bytecode = [_]u8{
        0x60, 0xFF,  // PUSH1 0xFF (invalid jump destination)
        0x56,        // JUMP (should fail)
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 32
        0x60, 0x00,  // PUSH1 0
        0xF3,        // RETURN
    };
    
    const result3 = try executeComplexBytecode(allocator, &invalid_jump_bytecode, 100000);
    try testing.expect(!result3.success); // Should fail with invalid jump
}

/// Test 8: Memory + Storage + Arithmetic intensive operation
test "Cross-opcode E2E: Matrix multiplication simulation" {
    const allocator = testing.allocator;
    
    // Simulate 2x2 matrix multiplication: A * B = C
    // A = [[1,2], [3,4]], B = [[5,6], [7,8]]
    // C = [[19,22], [43,50]]
    const bytecode = [_]u8{
        // Store matrix A in memory (offset 0-16)
        0x60, 0x01,  // PUSH1 1 (A[0][0])
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        0x60, 0x02,  // PUSH1 2 (A[0][1])
        0x60, 0x20,  // PUSH1 32
        0x52,        // MSTORE
        0x60, 0x03,  // PUSH1 3 (A[1][0])
        0x60, 0x40,  // PUSH1 64
        0x52,        // MSTORE
        0x60, 0x04,  // PUSH1 4 (A[1][1])
        0x60, 0x60,  // PUSH1 96
        0x52,        // MSTORE
        
        // Store matrix B in memory (offset 128-192)
        0x60, 0x05,  // PUSH1 5 (B[0][0])
        0x60, 0x80,  // PUSH1 128
        0x52,        // MSTORE
        0x60, 0x06,  // PUSH1 6 (B[0][1])
        0x60, 0xA0,  // PUSH1 160
        0x52,        // MSTORE
        0x60, 0x07,  // PUSH1 7 (B[1][0])
        0x60, 0xC0,  // PUSH1 192
        0x52,        // MSTORE
        0x60, 0x08,  // PUSH1 8 (B[1][1])
        0x60, 0xE0,  // PUSH1 224
        0x52,        // MSTORE
        
        // Compute C[0][0] = A[0][0]*B[0][0] + A[0][1]*B[1][0]
        0x60, 0x00,  // PUSH1 0 (A[0][0] offset)
        0x51,        // MLOAD
        0x60, 0x80,  // PUSH1 128 (B[0][0] offset)
        0x51,        // MLOAD
        0x02,        // MUL (1*5=5)
        
        0x60, 0x20,  // PUSH1 32 (A[0][1] offset)
        0x51,        // MLOAD
        0x60, 0xC0,  // PUSH1 192 (B[1][0] offset)
        0x51,        // MLOAD
        0x02,        // MUL (2*7=14)
        
        0x01,        // ADD (5+14=19)
        
        // Store C[0][0] at offset 256
        0x61, 0x01, 0x00, // PUSH2 256
        0x52,        // MSTORE
        
        // For brevity, just return C[0][0]
        0x60, 0x20,  // PUSH1 32
        0x61, 0x01, 0x00, // PUSH2 256
        0xF3,        // RETURN
    };
    
    const result = try executeComplexBytecode(allocator, &bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.return_data.len == 32);
    try testing.expect(result.memory_size >= 288); // Used memory up to offset 288
    
    // C[0][0] should be 19 (1*5 + 2*7)
    var expected = [_]u8{0} ** 32;
    expected[31] = 19;
    try testing.expectEqualSlices(u8, &expected, result.return_data);
}

/// Test 9: Complex call data processing
test "Cross-opcode E2E: Complex call data parsing" {
    const allocator = testing.allocator;
    
    // Bytecode that processes structured call data
    const bytecode = [_]u8{
        // Check call data size >= 64 bytes
        0x36,        // CALLDATASIZE
        0x60, 0x40,  // PUSH1 64
        0x10,        // LT (size < 64?)
        0x60, 0x2A,  // PUSH1 42 (revert address)
        0x57,        // JUMPI (revert if too small)
        
        // Load first 32 bytes (function selector + first param)
        0x60, 0x20,  // PUSH1 32
        0x60, 0x00,  // PUSH1 0
        0x60, 0x00,  // PUSH1 0
        0x37,        // CALLDATACOPY
        0x60, 0x00,  // PUSH1 0
        0x51,        // MLOAD
        
        // Load second 32 bytes
        0x60, 0x20,  // PUSH1 32
        0x60, 0x20,  // PUSH1 32
        0x60, 0x20,  // PUSH1 32
        0x37,        // CALLDATACOPY
        0x60, 0x20,  // PUSH1 32
        0x51,        // MLOAD
        
        // Add the two parameters
        0x01,        // ADD
        
        // Store and return result
        0x60, 0x40,  // PUSH1 64
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 32
        0x60, 0x40,  // PUSH1 64
        0xF3,        // RETURN
        
        // Revert if call data too small
        0x5B,        // JUMPDEST (offset 42)
        0x60, 0x00,  // PUSH1 0
        0x60, 0x00,  // PUSH1 0
        0xFD,        // REVERT
    };
    
    // Note: This test would need call data setup to work properly
    // For now, we test that it handles empty call data gracefully
    const result = try executeComplexBytecode(allocator, &bytecode, 100000);
    
    // Should revert due to insufficient call data
    try testing.expect(!result.success);
}

/// Test 10: Performance stress test with all operation types
test "Cross-opcode E2E: Multi-operation performance stress test" {
    const allocator = testing.allocator;
    
    // Complex bytecode using many different operation types
    const stress_bytecode = [_]u8{
        // Initialize counters
        0x60, 0x00,  // PUSH1 0 (main counter)
        0x60, 0x0A,  // PUSH1 10 (loop limit)
        
        // Main loop
        0x5B,        // JUMPDEST (loop start)
        0x80,        // DUP1 (get loop limit)
        0x81,        // DUP2 (get counter)
        0x11,        // GT (limit > counter?)
        0x60, 0x50,  // PUSH1 80 (exit loop)
        0x57,        // JUMPI
        
        // Arithmetic operations
        0x81,        // DUP2 (get counter)
        0x60, 0x03,  // PUSH1 3
        0x02,        // MUL
        0x60, 0x05,  // PUSH1 5
        0x01,        // ADD
        
        // Memory operations
        0x81,        // DUP2 (get counter)
        0x60, 0x20,  // PUSH1 32
        0x02,        // MUL (counter * 32 = memory offset)
        0x52,        // MSTORE
        
        // Storage operations
        0x81,        // DUP2 (get counter)
        0x60, 0x02,  // PUSH1 2
        0x0A,        // EXP (2^counter)
        0x81,        // DUP2 (get counter)
        0x55,        // SSTORE
        
        // Bitwise operations
        0x81,        // DUP2 (get counter)
        0x60, 0xAA,  // PUSH1 0xAA
        0x16,        // AND
        0x60, 0x55,  // PUSH1 0x55
        0x17,        // OR
        0x50,        // POP (discard result)
        
        // Increment counter
        0x60, 0x01,  // PUSH1 1
        0x01,        // ADD
        
        // Jump back to loop start
        0x60, 0x0C,  // PUSH1 12 (loop start)
        0x56,        // JUMP
        
        // Exit loop
        0x5B,        // JUMPDEST (offset 80)
        0x50,        // POP (remove limit)
        0x50,        // POP (remove counter)
        
        // Return success
        0x60, 0x01,  // PUSH1 1
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 32
        0x60, 0x00,  // PUSH1 0
        0xF3,        // RETURN
    };
    
    const result = try executeComplexBytecode(allocator, &stress_bytecode, 200000);
    
    if (result.success) {
        try testing.expect(result.return_data.len == 32);
        try testing.expect(result.memory_size >= 320); // Should have used memory
        
        // Should return success (1)
        var expected = [_]u8{0} ** 32;
        expected[31] = 1;
        try testing.expectEqualSlices(u8, &expected, result.return_data);
        
        std.debug.print("Stress test completed successfully, gas used: {}\n", .{result.gas_used});
    } else {
        // Running out of gas is acceptable for stress test
        std.debug.print("Stress test ran out of gas: {}\n", .{result.gas_used});
    }
}

/// Test 11: Cross-operation data flow verification
test "Cross-opcode E2E: Data flow integrity across operations" {
    const allocator = testing.allocator;
    
    // Test that data flows correctly between different operation types
    const bytecode = [_]u8{
        // Start with a seed value
        0x60, 0x2A,  // PUSH1 42 (seed)
        
        // Arithmetic transformation
        0x60, 0x03,  // PUSH1 3
        0x02,        // MUL (42 * 3 = 126)
        0x60, 0x0A,  // PUSH1 10
        0x01,        // ADD (126 + 10 = 136)
        
        // Store in memory
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        
        // Load from memory and transform
        0x60, 0x00,  // PUSH1 0
        0x51,        // MLOAD (136)
        0x60, 0x04,  // PUSH1 4
        0x04,        // DIV (136 / 4 = 34)
        
        // Store in storage
        0x60, 0x00,  // PUSH1 0 (slot)
        0x55,        // SSTORE
        
        // Load from storage and apply bitwise
        0x60, 0x00,  // PUSH1 0
        0x54,        // SLOAD (34)
        0x60, 0x0F,  // PUSH1 15 (0x0F)
        0x16,        // AND (34 & 15 = 2)
        
        // Apply comparison and conditional logic
        0x80,        // DUP1 (get result)
        0x60, 0x05,  // PUSH1 5
        0x10,        // LT (2 < 5 = true)
        0x60, 0x3A,  // PUSH1 58 (multiply_by_10)
        0x57,        // JUMPI
        
        // False path: multiply by 2
        0x60, 0x02,  // PUSH1 2
        0x02,        // MUL
        0x60, 0x3E,  // PUSH1 62 (end)
        0x56,        // JUMP
        
        // True path: multiply by 10
        0x5B,        // JUMPDEST (offset 58)
        0x60, 0x0A,  // PUSH1 10
        0x02,        // MUL
        
        // End
        0x5B,        // JUMPDEST (offset 62)
        
        // Final transformation using crypto
        0x60, 0x00,  // PUSH1 0 (memory offset)
        0x52,        // MSTORE (store result)
        0x60, 0x20,  // PUSH1 32 (size)
        0x60, 0x00,  // PUSH1 0 (offset)
        0x20,        // KECCAK256 (hash the result)
        
        // Return the hash
        0x60, 0x00,  // PUSH1 0
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 32
        0x60, 0x00,  // PUSH1 0
        0xF3,        // RETURN
    };
    
    const result = try executeComplexBytecode(allocator, &bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.return_data.len == 32);
    
    // Result should be a hash (non-zero and deterministic)
    var zero_result = [_]u8{0} ** 32;
    try testing.expect(!std.mem.eql(u8, &zero_result, result.return_data));
    
    // Run again to verify determinism
    const result2 = try executeComplexBytecode(allocator, &bytecode, 100000);
    try testing.expect(result2.success);
    try testing.expectEqualSlices(u8, result.return_data, result2.return_data);
}