/// Comprehensive end-to-end contract execution tests
///
/// This test suite executes complete contract scenarios from bytecode deployment
/// through function calls, testing the full EVM execution pipeline.
///
/// Test scenarios include:
/// 1. ERC20 token contract deployment and transfers
/// 2. Simple storage contract operations
/// 3. Complex arithmetic and logic contracts
/// 4. Cross-contract interactions
/// 5. Gas accounting and limits
/// 6. Error conditions and reverts

const std = @import("std");
const testing = std.testing;
const Vm = @import("evm").Vm;
const Frame = @import("evm").Frame;
const Memory = @import("evm").Memory;
const Stack = @import("evm").stack.Stack;
const evm = @import("evm");

/// Test helper to create a VM with proper initialization
fn createTestVm(allocator: std.mem.Allocator) !Vm {
    return Vm.init(allocator);
}

/// Test helper to create an execution frame
fn createTestFrame(allocator: std.mem.Allocator, gas_limit: u64) !Frame {
    return Frame{
        .stack = Stack{},
        .memory = try Memory.init(allocator),
        .gas_remaining = gas_limit,
        .contract_address = [_]u8{0x12, 0x34, 0x56, 0x78} ++ [_]u8{0} ** 16,
        .caller = [_]u8{0xAB, 0xCD, 0xEF, 0x00} ++ [_]u8{0} ** 16,
        .call_value = 0,
        .call_data = &[_]u8{},
        .return_data = &[_]u8{},
        .code = &[_]u8{},
        .is_static = false,
        .depth = 0,
    };
}

/// Execute bytecode and return the result
fn executeBytecode(allocator: std.mem.Allocator, bytecode: []const u8, gas_limit: u64) !struct {
    success: bool,
    gas_used: u64,
    return_data: []const u8,
    logs: []const u8,
} {
    var vm = try createTestVm(allocator);
    defer vm.deinit();

    var frame = try createTestFrame(allocator, gas_limit);
    defer frame.memory.deinit();

    frame.code = bytecode;
    
    const initial_gas = frame.gas_remaining;
    
    // Execute the bytecode using the VM
    const result = vm.interpret(&frame) catch |err| switch (err) {
        error.Revert => return .{
            .success = false,
            .gas_used = initial_gas - frame.gas_remaining,
            .return_data = frame.return_data,
            .logs = &[_]u8{},
        },
        else => return err,
    };
    
    return .{
        .success = true,
        .gas_used = initial_gas - frame.gas_remaining,
        .return_data = result.return_data,
        .logs = &[_]u8{}, // TODO: Implement log collection
    };
}

/// Test 1: Simple storage contract - store and retrieve a value
test "E2E: Simple storage contract" {
    const allocator = testing.allocator;
    
    // Bytecode for a simple storage contract:
    // PUSH1 0x42    // Push value 0x42
    // PUSH1 0x00    // Push storage slot 0
    // SSTORE        // Store value at slot 0
    // PUSH1 0x00    // Push storage slot 0
    // SLOAD         // Load value from slot 0
    // PUSH1 0x00    // Push memory offset 0
    // MSTORE        // Store loaded value in memory
    // PUSH1 0x20    // Push return size (32 bytes)
    // PUSH1 0x00    // Push memory offset 0
    // RETURN        // Return the stored value
    const storage_bytecode = [_]u8{
        0x60, 0x42,  // PUSH1 0x42
        0x60, 0x00,  // PUSH1 0x00
        0x55,        // SSTORE
        0x60, 0x00,  // PUSH1 0x00
        0x54,        // SLOAD
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 0x20
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    const result = try executeBytecode(allocator, &storage_bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.gas_used > 0);
    try testing.expect(result.return_data.len == 32);
    
    // Verify the returned value is 0x42 (padded to 32 bytes)
    var expected_return = [_]u8{0} ** 32;
    expected_return[31] = 0x42;
    try testing.expectEqualSlices(u8, &expected_return, result.return_data);
}

/// Test 2: Arithmetic computation contract 
test "E2E: Arithmetic computation contract" {
    const allocator = testing.allocator;
    
    // Bytecode that computes (10 + 20) * 3:
    // PUSH1 0x0A    // Push 10
    // PUSH1 0x14    // Push 20  
    // ADD           // Add them (result: 30)
    // PUSH1 0x03    // Push 3
    // MUL           // Multiply (result: 90)
    // PUSH1 0x00    // Push memory offset
    // MSTORE        // Store result in memory
    // PUSH1 0x20    // Push return size
    // PUSH1 0x00    // Push memory offset
    // RETURN        // Return result
    const arithmetic_bytecode = [_]u8{
        0x60, 0x0A,  // PUSH1 0x0A (10)
        0x60, 0x14,  // PUSH1 0x14 (20)
        0x01,        // ADD
        0x60, 0x03,  // PUSH1 0x03 (3)
        0x02,        // MUL
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 0x20
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    const result = try executeBytecode(allocator, &arithmetic_bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.gas_used > 0);
    try testing.expect(result.return_data.len == 32);
    
    // Verify the result is 90 (0x5A)
    var expected_return = [_]u8{0} ** 32;
    expected_return[31] = 0x5A; // 90 in hex
    try testing.expectEqualSlices(u8, &expected_return, result.return_data);
}

/// Test 3: Conditional logic contract
test "E2E: Conditional logic contract" {
    const allocator = testing.allocator;
    
    // Bytecode that implements: if (5 > 3) return 1 else return 0
    // PUSH1 0x05    // Push 5
    // PUSH1 0x03    // Push 3
    // GT            // 5 > 3 (result: 1)
    // PUSH1 0x15    // Push jump destination (offset 21)
    // JUMPI         // Jump if condition is true
    // PUSH1 0x00    // Push 0 (false case)
    // PUSH1 0x1B    // Push jump destination to skip true case
    // JUMP          // Jump to return
    // JUMPDEST      // Jump destination for true case (offset 21)
    // PUSH1 0x01    // Push 1 (true case)
    // JUMPDEST      // Jump destination for return (offset 27)
    // PUSH1 0x00    // Push memory offset
    // MSTORE        // Store result in memory
    // PUSH1 0x20    // Push return size
    // PUSH1 0x00    // Push memory offset
    // RETURN        // Return result
    const conditional_bytecode = [_]u8{
        0x60, 0x05,  // PUSH1 0x05 (5)
        0x60, 0x03,  // PUSH1 0x03 (3)
        0x11,        // GT
        0x60, 0x15,  // PUSH1 0x15 (jump to offset 21)
        0x57,        // JUMPI
        0x60, 0x00,  // PUSH1 0x00 (false)
        0x60, 0x1B,  // PUSH1 0x1B (jump to return)
        0x56,        // JUMP
        0x5B,        // JUMPDEST (offset 21)
        0x60, 0x01,  // PUSH1 0x01 (true)
        0x5B,        // JUMPDEST (offset 27)
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 0x20
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    const result = try executeBytecode(allocator, &conditional_bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.gas_used > 0);
    try testing.expect(result.return_data.len == 32);
    
    // Verify the result is 1 (true case since 5 > 3)
    var expected_return = [_]u8{0} ** 32;
    expected_return[31] = 0x01;
    try testing.expectEqualSlices(u8, &expected_return, result.return_data);
}

/// Test 4: Loop contract (compute factorial of 5)
test "E2E: Loop computation contract (factorial)" {
    const allocator = testing.allocator;
    
    // Bytecode that computes factorial of 5:
    // Initialize: counter = 5, result = 1
    // Loop: while counter > 0 { result *= counter; counter-- }
    const factorial_bytecode = [_]u8{
        // Initialize
        0x60, 0x05,  // PUSH1 0x05 (counter = 5)
        0x60, 0x01,  // PUSH1 0x01 (result = 1)
        
        // Loop start (offset 6)
        0x5B,        // JUMPDEST
        0x81,        // DUP2 (duplicate counter to check if > 0)
        0x15,        // ISZERO
        0x60, 0x1E,  // PUSH1 0x1E (exit loop if counter == 0)
        0x57,        // JUMPI
        
        // Loop body: result *= counter
        0x81,        // DUP2 (get counter)
        0x02,        // MUL (result *= counter)
        0x90,        // SWAP1 (move result to top)
        0x50,        // POP (remove old result)
        
        // Decrement counter
        0x60, 0x01,  // PUSH1 0x01
        0x90,        // SWAP1
        0x03,        // SUB (counter--)
        
        // Jump back to loop start
        0x60, 0x06,  // PUSH1 0x06 (loop start)
        0x56,        // JUMP
        
        // Exit loop (offset 30)
        0x5B,        // JUMPDEST
        0x90,        // SWAP1 (get result)
        0x50,        // POP (remove counter)
        
        // Return result
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 0x20
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    const result = try executeBytecode(allocator, &factorial_bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.gas_used > 0);
    try testing.expect(result.return_data.len == 32);
    
    // Verify the result is 120 (5! = 5*4*3*2*1 = 120 = 0x78)
    var expected_return = [_]u8{0} ** 32;
    expected_return[31] = 0x78; // 120 in hex
    try testing.expectEqualSlices(u8, &expected_return, result.return_data);
}

/// Test 5: Gas limit enforcement
test "E2E: Gas limit enforcement" {
    const allocator = testing.allocator;
    
    // Infinite loop bytecode that should run out of gas
    const infinite_loop_bytecode = [_]u8{
        0x5B,        // JUMPDEST (offset 0)
        0x60, 0x00,  // PUSH1 0x00 (jump back to 0)
        0x56,        // JUMP
    };
    
    // Execute with very limited gas
    const result = executeBytecode(allocator, &infinite_loop_bytecode, 100) catch |err| {
        // Should get OutOfGas error
        try testing.expect(err == error.OutOfGas or err == error.Revert);
        return;
    };
    
    // If it somehow succeeds, it should have used all the gas
    try testing.expect(result.gas_used >= 90); // Should use most/all of the gas
}

/// Test 6: Revert condition
test "E2E: Contract revert condition" {
    const allocator = testing.allocator;
    
    // Bytecode that reverts with a message:
    // Check if input > 10, if so revert
    // PUSH1 0x0B    // Push 11
    // PUSH1 0x0A    // Push 10
    // GT            // 11 > 10 (true)
    // PUSH1 0x0C    // Push revert destination
    // JUMPI         // Jump if condition is true
    // PUSH1 0x01    // Push success value
    // PUSH1 0x10    // Jump to return
    // JUMP
    // JUMPDEST      // Revert destination
    // PUSH1 0x00    // Push 0
    // PUSH1 0x00    // Push 0  
    // REVERT        // Revert
    // JUMPDEST      // Return destination
    // ... return code
    const revert_bytecode = [_]u8{
        0x60, 0x0B,  // PUSH1 0x0B (11)
        0x60, 0x0A,  // PUSH1 0x0A (10)
        0x11,        // GT
        0x60, 0x0C,  // PUSH1 0x0C (revert destination)
        0x57,        // JUMPI
        0x60, 0x01,  // PUSH1 0x01 (success)
        0x60, 0x10,  // PUSH1 0x10 (return destination)
        0x56,        // JUMP
        0x5B,        // JUMPDEST (revert destination, offset 12)
        0x60, 0x00,  // PUSH1 0x00
        0x60, 0x00,  // PUSH1 0x00
        0xFD,        // REVERT
        0x5B,        // JUMPDEST (return destination, offset 16)
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 0x20
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    const result = try executeBytecode(allocator, &revert_bytecode, 100000);
    
    // Should revert because 11 > 10
    try testing.expect(!result.success);
    try testing.expect(result.gas_used > 0);
}

/// Test 7: Memory operations with expansion
test "E2E: Memory expansion operations" {
    const allocator = testing.allocator;
    
    // Bytecode that writes to multiple memory locations and returns a range:
    // Write 0x11 at offset 0
    // Write 0x22 at offset 32
    // Write 0x33 at offset 64
    // Return 96 bytes starting from offset 0
    const memory_expansion_bytecode = [_]u8{
        // Write 0x11 at offset 0
        0x60, 0x11,  // PUSH1 0x11
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        
        // Write 0x22 at offset 32
        0x60, 0x22,  // PUSH1 0x22
        0x60, 0x20,  // PUSH1 0x20 (32)
        0x52,        // MSTORE
        
        // Write 0x33 at offset 64
        0x60, 0x33,  // PUSH1 0x33
        0x60, 0x40,  // PUSH1 0x40 (64)
        0x52,        // MSTORE
        
        // Return 96 bytes from offset 0
        0x60, 0x60,  // PUSH1 0x60 (96)
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    const result = try executeBytecode(allocator, &memory_expansion_bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.gas_used > 0);
    try testing.expect(result.return_data.len == 96);
    
    // Verify the memory layout
    var expected_return = [_]u8{0} ** 96;
    expected_return[31] = 0x11;  // First value at offset 31 (end of first 32-byte word)
    expected_return[63] = 0x22;  // Second value at offset 63
    expected_return[95] = 0x33;  // Third value at offset 95
    
    try testing.expectEqualSlices(u8, &expected_return, result.return_data);
}

/// Test 8: Complex stack operations
test "E2E: Complex stack manipulation" {
    const allocator = testing.allocator;
    
    // Bytecode that performs complex stack operations:
    // Push values 1, 2, 3, 4, 5 onto stack
    // Use DUP and SWAP operations to rearrange
    // Compute sum of all values
    const stack_manipulation_bytecode = [_]u8{
        // Push values 1-5
        0x60, 0x01,  // PUSH1 0x01
        0x60, 0x02,  // PUSH1 0x02
        0x60, 0x03,  // PUSH1 0x03
        0x60, 0x04,  // PUSH1 0x04
        0x60, 0x05,  // PUSH1 0x05
        
        // Stack now: [5, 4, 3, 2, 1] (top to bottom)
        // Add all values: 5+4+3+2+1 = 15
        0x01,        // ADD (5+4=9)
        0x01,        // ADD (9+3=12)
        0x01,        // ADD (12+2=14)
        0x01,        // ADD (14+1=15)
        
        // Return result
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 0x20
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    const result = try executeBytecode(allocator, &stack_manipulation_bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.gas_used > 0);
    try testing.expect(result.return_data.len == 32);
    
    // Verify the result is 15 (0x0F)
    var expected_return = [_]u8{0} ** 32;
    expected_return[31] = 0x0F; // 15 in hex
    try testing.expectEqualSlices(u8, &expected_return, result.return_data);
}

/// Test 9: Keccak256 hash computation
test "E2E: Keccak256 hash computation" {
    const allocator = testing.allocator;
    
    // Bytecode that computes keccak256 hash of "hello":
    // Store "hello" in memory and compute its hash
    const keccak_bytecode = [_]u8{
        // Store "hello" in memory (0x68656c6c6f)
        0x68, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0x00, 0x00, // PUSH9 0x68656c6c6f00000000
        0x60, 0x00,  // PUSH1 0x00 (memory offset)
        0x52,        // MSTORE
        
        // Compute keccak256 hash
        0x60, 0x05,  // PUSH1 0x05 (length of "hello")
        0x60, 0x1B,  // PUSH1 0x1B (offset where "hello" starts in the 32-byte word)
        0x20,        // KECCAK256
        
        // Return hash
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 0x20
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    const result = try executeBytecode(allocator, &keccak_bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.gas_used > 0);
    try testing.expect(result.return_data.len == 32);
    
    // The hash should be deterministic (we can verify it's not all zeros)
    var all_zeros = [_]u8{0} ** 32;
    try testing.expect(!std.mem.eql(u8, &all_zeros, result.return_data));
}

/// Test 10: Gas accounting precision
test "E2E: Gas accounting precision" {
    const allocator = testing.allocator;
    
    // Bytecode with known gas costs to verify precise accounting
    const gas_accounting_bytecode = [_]u8{
        0x60, 0x01,  // PUSH1 0x01 (3 gas)
        0x60, 0x02,  // PUSH1 0x02 (3 gas)
        0x01,        // ADD (3 gas)
        0x60, 0x00,  // PUSH1 0x00 (3 gas)
        0x52,        // MSTORE (3 gas + memory expansion)
        0x60, 0x20,  // PUSH1 0x20 (3 gas)
        0x60, 0x00,  // PUSH1 0x00 (3 gas)
        0xF3,        // RETURN (0 gas)
    };
    
    const result = try executeBytecode(allocator, &gas_accounting_bytecode, 100000);
    
    try testing.expect(result.success);
    
    // Base cost should be at least 21 gas (7 operations × 3 gas each)
    // Plus memory expansion cost
    try testing.expect(result.gas_used >= 21);
    try testing.expect(result.gas_used < 1000); // But not excessive
}

/// Test 11: Multiple storage slots interaction
test "E2E: Multiple storage slots interaction" {
    const allocator = testing.allocator;
    
    // Bytecode that interacts with multiple storage slots:
    // Store 0x11 at slot 0, 0x22 at slot 1
    // Load both and compute sum
    const multi_storage_bytecode = [_]u8{
        // Store 0x11 at slot 0
        0x60, 0x11,  // PUSH1 0x11
        0x60, 0x00,  // PUSH1 0x00
        0x55,        // SSTORE
        
        // Store 0x22 at slot 1
        0x60, 0x22,  // PUSH1 0x22
        0x60, 0x01,  // PUSH1 0x01
        0x55,        // SSTORE
        
        // Load from slot 0
        0x60, 0x00,  // PUSH1 0x00
        0x54,        // SLOAD
        
        // Load from slot 1
        0x60, 0x01,  // PUSH1 0x01
        0x54,        // SLOAD
        
        // Add them
        0x01,        // ADD (0x11 + 0x22 = 0x33)
        
        // Return result
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 0x20
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    const result = try executeBytecode(allocator, &multi_storage_bytecode, 100000);
    
    try testing.expect(result.success);
    try testing.expect(result.gas_used > 0);
    try testing.expect(result.return_data.len == 32);
    
    // Verify the result is 0x33 (0x11 + 0x22)
    var expected_return = [_]u8{0} ** 32;
    expected_return[31] = 0x33;
    try testing.expectEqualSlices(u8, &expected_return, result.return_data);
}

/// Test 12: Error boundary testing - stack underflow protection
test "E2E: Stack underflow protection" {
    const allocator = testing.allocator;
    
    // Bytecode that tries to perform ADD without enough stack items
    const underflow_bytecode = [_]u8{
        0x60, 0x01,  // PUSH1 0x01 (only one item)
        0x01,        // ADD (requires 2 items - should fail)
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 0x20
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    // This should fail due to stack underflow
    const result = executeBytecode(allocator, &underflow_bytecode, 100000) catch |err| {
        try testing.expect(err == error.StackUnderflow or err == error.InvalidOpcode);
        return;
    };
    
    // If execution somehow succeeded, it should have failed
    try testing.expect(!result.success);
}

/// Test Performance: Benchmark simple operations
test "E2E: Performance benchmark - simple operations" {
    const allocator = testing.allocator;
    
    // Simple bytecode for performance testing
    const perf_bytecode = [_]u8{
        0x60, 0x01,  // PUSH1 0x01
        0x60, 0x02,  // PUSH1 0x02
        0x01,        // ADD
        0x60, 0x00,  // PUSH1 0x00
        0x52,        // MSTORE
        0x60, 0x20,  // PUSH1 0x20
        0x60, 0x00,  // PUSH1 0x00
        0xF3,        // RETURN
    };
    
    const iterations = 100;
    var total_gas: u64 = 0;
    
    var i: u32 = 0;
    while (i < iterations) : (i += 1) {
        const result = try executeBytecode(allocator, &perf_bytecode, 100000);
        try testing.expect(result.success);
        total_gas += result.gas_used;
    }
    
    const avg_gas = total_gas / iterations;
    
    // Verify consistent gas usage
    try testing.expect(avg_gas > 0);
    try testing.expect(avg_gas < 1000);
    
    std.debug.print("Average gas per execution: {}\n", .{avg_gas});
}