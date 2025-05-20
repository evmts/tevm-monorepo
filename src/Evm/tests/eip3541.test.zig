const std = @import("std");
const testing = std.testing;

const EvmModule = @import("Evm");
const Interpreter = EvmModule.Interpreter;
const ExecutionError = EvmModule.Frame.ExecutionError;
const Evm = EvmModule.Evm;
const Frame = EvmModule.Frame;
const JumpTable = EvmModule.JumpTable;
const calls = EvmModule.opcodes.calls;
const Contract = EvmModule.Contract;
const Memory = EvmModule.Memory.Memory;
const Stack = EvmModule.Stack.Stack;
const Address = @import("Address").Address;

// For convenience and compatibility with test stubs
// The actual u256 type would be imported from a proper bigint library
// Since u256 is now a primitive in Zig, we'll use an alias instead
const BigInt = u64;

// Test setup helper function
fn setupInterpreter(enable_eip3541: bool) !Interpreter {
    // Create a custom chain rules configuration
    var custom_rules = EvmModule.ChainRules{};
    custom_rules.IsEIP3541 = enable_eip3541; // Control EIP-3541 (Reject new contracts starting with 0xEF)

    // Create an EVM instance with custom chain rules
    var custom_evm = try Evm.init(std.testing.allocator, custom_rules);

    // Create jump table
    var jump_table = JumpTable.init();
    try JumpTable.initMainnetJumpTable(std.testing.allocator, &jump_table);
    
    // Create an interpreter with our custom EVM
    var test_interpreter = Interpreter.create(std.testing.allocator, &custom_evm, jump_table);

    return test_interpreter;
}

// Test that CREATE rejects contracts starting with 0xEF when EIP-3541 is enabled
test "CREATE rejects contracts starting with 0xEF with EIP-3541 enabled" {
    const test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };

    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE: value, offset, size
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)

    // We need to make sure memory is allocated and contains 0xEF at the first byte
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF

    // Execute CREATE operation
    const result = try calls.opCreate(0, &test_interpreter, &frame);

    // Verify CREATE executed (returned an empty string) but pushed 0 (failure) to the stack
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(BigInt, 0), try frame.stack.peek(0)); // Should return 0 (failure)
}

// Test that CREATE accepts contracts not starting with 0xEF with EIP-3541 enabled
test "CREATE accepts contracts not starting with 0xEF with EIP-3541 enabled" {
    const test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };

    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE: value, offset, size
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)

    // We need to make sure memory is allocated and contains something other than 0xEF
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0x60; // First byte is not 0xEF

    // Execute CREATE operation
    const result = try calls.opCreate(0, &test_interpreter, &frame);

    // Verify CREATE executed successfully
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(BigInt, 0x1234), try frame.stack.peek(0)); // Using our stub's fake address
}

// Test that CREATE2 rejects contracts starting with 0xEF when EIP-3541 is enabled
test "CREATE2 rejects contracts starting with 0xEF with EIP-3541 enabled" {
    const test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };

    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE2: value, offset, size, salt
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)
    try frame.stack.push(0); // salt: 0

    // We need to make sure memory is allocated and contains 0xEF at the first byte
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF

    // Execute CREATE2 operation
    const result = try calls.opCreate2(0, &test_interpreter, &frame);

    // Verify CREATE2 executed (returned an empty string) but pushed 0 (failure) to the stack
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(BigInt, 0), try frame.stack.peek(0)); // Should return 0 (failure)
}

// Test that CREATE2 accepts contracts not starting with 0xEF with EIP-3541 enabled
test "CREATE2 accepts contracts not starting with 0xEF with EIP-3541 enabled" {
    const test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };

    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE2: value, offset, size, salt
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)
    try frame.stack.push(0); // salt: 0

    // We need to make sure memory is allocated and contains something other than 0xEF
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0x60; // First byte is not 0xEF

    // Execute CREATE2 operation
    const result = try calls.opCreate2(0, &test_interpreter, &frame);

    // Verify CREATE2 executed successfully
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(BigInt, 0x5678), try frame.stack.peek(0)); // Using our stub's fake address
}

// Test that CREATE accepts contracts starting with 0xEF when EIP-3541 is disabled
test "CREATE accepts contracts starting with 0xEF with EIP-3541 disabled" {
    const test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };

    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE: value, offset, size
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)

    // We need to make sure memory is allocated and contains 0xEF at the first byte
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF

    // Execute CREATE operation
    const result = try calls.opCreate(0, &test_interpreter, &frame);

    // Verify CREATE executed successfully even with 0xEF as first byte
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(BigInt, 0x1234), try frame.stack.peek(0)); // Using our stub's fake address
}

// Test that CREATE2 accepts contracts starting with 0xEF when EIP-3541 is disabled
test "CREATE2 accepts contracts starting with 0xEF with EIP-3541 disabled" {
    const test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();

    // Create a dummy contract for the test
    const contract = try std.testing.allocator.create(Contract);
    defer std.testing.allocator.destroy(contract);

    // Initialize the contract with minimal required fields
    contract.* = Contract{
        .code = &[_]u8{},
        .input = &[_]u8{},
        .gas = 1000000,
        .address = std.mem.zeroes(Address), // Zero address
        .caller = std.mem.zeroes(Address), // Zero address
        .value = 0,
        .gas_refund = 0,
    };

    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator, contract);
    defer frame.deinit();

    // Push parameters for CREATE2: value, offset, size, salt
    try frame.stack.push(0); // value: 0
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(10); // size: 10 (small contract)
    try frame.stack.push(0); // salt: 0

    // We need to make sure memory is allocated and contains 0xEF at the first byte
    try frame.memory.resize(10);
    const mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF

    // Execute CREATE2 operation
    const result = try calls.opCreate2(0, &test_interpreter, &frame);

    // Verify CREATE2 executed successfully even with 0xEF as first byte
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(BigInt, 0x5678), try frame.stack.peek(0)); // Using our stub's fake address
}
