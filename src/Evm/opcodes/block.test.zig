const std = @import("std");
const testing = std.testing;

// Import the interpreter module directly to get the correct types
const interpreter_mod = @import("../interpreter.zig");
const Interpreter = interpreter_mod.Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const JumpTable = @import("../JumpTable.zig");
const Evm = @import("../evm.zig").Evm;
const ChainRules = @import("../evm.zig").ChainRules;
const Hardfork = @import("../evm.zig").Hardfork;

// Import the Address module
const Address = @import("../../Address/address.zig").Address;

// Import the block opcodes directly
const block = @import("block.zig");

// For tests we'll use these types
const test_utils = @import("test_utils.zig");
const TestInterpreter = test_utils.Interpreter;
const TestFrame = test_utils.Frame;
const TestExecutionError = test_utils.ExecutionError;
const JumpTableTest = test_utils.JumpTable;
const TestStack = test_utils.Stack;
const TestMemory = test_utils.Memory;

// Use a disambiguated name for the 256-bit integer to avoid shadowing
const u256_native = u64;

test "BLOCKHASH opcode" {
    const allocator = testing.allocator;

    var address_bytes = [_]u8{0} ** 20;
    address_bytes[19] = 1;
    const contract_address = Address.fromBytes(address_bytes);

    var caller_bytes = [_]u8{0} ** 20;
    caller_bytes[19] = 2;
    const caller_address = Address.fromBytes(caller_bytes);

    var contract_instance = try test_utils.createContract(allocator, caller_address, contract_address, 0, 1000000);
    contract_instance.code = &[_]u8{}; // Set empty code for this test
    defer contract_instance.deinit(allocator);

    var evm_instance = try Evm.init(allocator, null);
    defer evm_instance.deinit();

    var jump_table_instance = try JumpTable.JumpTable.init(allocator, "latest");
    try block.registerBlockOpcodes(allocator, &jump_table_instance);
    defer jump_table_instance.deinit(allocator);

    var interpreter_instance = Interpreter.create(allocator, &evm_instance, jump_table_instance);
    defer interpreter_instance.deinit(allocator);

    var frame_instance = try Frame.init(allocator, &contract_instance);
    defer frame_instance.deinit(allocator);

    try frame_instance.stack.push(123);

    _ = try block.opBlockhash(0, &interpreter_instance, &frame_instance);

    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u64, 0), frame_instance.stack.data[0]);
}

test "Block information opcodes" {
    const allocator = testing.allocator;

    var address_bytes = [_]u8{0} ** 20;
    address_bytes[19] = 1;
    const contract_address = Address.fromBytes(address_bytes);

    var caller_bytes = [_]u8{0} ** 20;
    caller_bytes[19] = 2;
    const caller_address = Address.fromBytes(caller_bytes);

    var contract_instance = try test_utils.createContract(allocator, caller_address, contract_address, 0, 1000000);
    contract_instance.code = &[_]u8{}; // Set empty code
    defer contract_instance.deinit(allocator);

    var evm_instance = try Evm.init(allocator, null);
    defer evm_instance.deinit();

    var jump_table_instance = try JumpTable.JumpTable.init(allocator, "latest");
    try block.registerBlockOpcodes(allocator, &jump_table_instance);
    defer jump_table_instance.deinit(allocator);

    var interpreter_instance = Interpreter.create(allocator, &evm_instance, jump_table_instance);
    defer interpreter_instance.deinit(allocator);

    var frame_instance = try Frame.init(allocator, &contract_instance);
    defer frame_instance.deinit(allocator);

    // Test COINBASE
    _ = try block.opCoinbase(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u64, 0), frame_instance.stack.data[0]);

    frame_instance.stack.clear(); // Clear the stack for next test

    // Test TIMESTAMP
    _ = try block.opTimestamp(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expect(frame_instance.stack.data[0] > 0);

    frame_instance.stack.clear();

    // Test NUMBER
    _ = try block.opNumber(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u64, 1), frame_instance.stack.data[0]); // Default block number

    frame_instance.stack.clear();

    // Test DIFFICULTY (pre-merge)
    evm_instance.chainRules = ChainRules.forHardfork(.London);
    _ = try block.opDifficulty(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u64, 2500000000000000), frame_instance.stack.data[0]); 

    frame_instance.stack.clear();

    // Test PREVRANDAO (post-merge)
    evm_instance.chainRules = ChainRules.forHardfork(.Merge);
    _ = try block.opDifficulty(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u64, 0x0123456789abcdef), frame_instance.stack.data[0]); 

    frame_instance.stack.clear();

    // Test GASLIMIT
    _ = try block.opGaslimit(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u64, 30000000), frame_instance.stack.data[0]); 

    frame_instance.stack.clear();

    // Test CHAINID
    _ = try block.opChainid(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u64, 1), frame_instance.stack.data[0]); // Default chain ID

    frame_instance.stack.clear();

    // Test SELFBALANCE
    _ = try block.opSelfbalance(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u64, 0), frame_instance.stack.data[0]);

    frame_instance.stack.clear();

    // Test BASEFEE
    evm_instance.chainRules = ChainRules.forHardfork(.London);
    _ = try block.opBasefee(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u64, 1000000000), frame_instance.stack.data[0]); 

    frame_instance.stack.clear();

    // Test BASEFEE with EIP-1559 disabled
    evm_instance.chainRules = ChainRules.forHardfork(.Berlin);
    const basefee_result = block.opBasefee(0, &interpreter_instance, &frame_instance);
    try testing.expectError(ExecutionError.InvalidOpcode, basefee_result);
}