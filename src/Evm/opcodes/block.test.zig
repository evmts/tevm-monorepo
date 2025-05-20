const std = @import("std");
const testing = std.testing;

const EvmModule = @import("Evm");
const Interpreter = EvmModule.Interpreter;
const Frame = EvmModule.Frame;
const Contract = EvmModule.Contract;
const Stack = EvmModule.Stack;
const Memory = EvmModule.Memory;
const JumpTable = EvmModule.JumpTable;
const Evm = EvmModule.Evm;
const ChainRules = EvmModule.ChainRules;
const Hardfork = EvmModule.Hardfork;

const AddressModule = @import("Address");
const Address = AddressModule.Address;

const block = EvmModule.opcodes.block; // Get block opcodes from Evm module
const u256_native = u256;

test "BLOCKHASH opcode" {
    const allocator = testing.allocator;

    var address_bytes = [_]u8{0} ** 20;
    address_bytes[19] = 1;
    const contract_address: Address = address_bytes;

    var caller_bytes = [_]u8{0} ** 20;
    caller_bytes[19] = 2;
    const caller_address: Address = caller_bytes;

    var contract_instance = EvmModule.createContract(caller_address, contract_address, 0, 1000000);
    contract_instance.code = &[_]u8{}; // Set empty code for this test
    // defer contract_instance.deinit(); // If needed

    var evm_instance = try Evm.init(allocator, null);

    var jump_table_instance = try JumpTable.init(allocator); // Assuming init(allocator)
    try block.registerBlockOpcodes(allocator, &jump_table_instance);
    // defer jump_table_instance.deinit(); // If needed

    var interpreter_instance = Interpreter.create(allocator, &evm_instance, jump_table_instance);
    // defer interpreter_instance.deinit();

    var frame_instance = try Frame.init(allocator, &contract_instance);
    // defer frame_instance.deinit();

    try frame_instance.stack.push(u256_native, 123);

    _ = try block.opBlockhash(0, &interpreter_instance, &frame_instance);

    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u256, 0), frame_instance.stack.items[0]); // Assuming stack has .items
}

test "Block information opcodes" {
    const allocator = testing.allocator;

    var address_bytes = [_]u8{0} ** 20;
    address_bytes[19] = 1;
    const contract_address: Address = address_bytes;

    var caller_bytes = [_]u8{0} ** 20;
    caller_bytes[19] = 2;
    const caller_address: Address = caller_bytes;

    var contract_instance = EvmModule.createContract(caller_address, contract_address, 0, 1000000);
    contract_instance.code = &[_]u8{}; // Set empty code

    var evm_instance = try Evm.init(allocator, null);

    var jump_table_instance = try JumpTable.init(allocator);
    try block.registerBlockOpcodes(allocator, &jump_table_instance);

    var interpreter_instance = Interpreter.create(allocator, &evm_instance, jump_table_instance);

    var frame_instance = try Frame.init(allocator, &contract_instance);

    // Test COINBASE
    _ = try block.opCoinbase(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u256, 0), frame_instance.stack.items[0]);

    frame_instance.stack.clear(); // Assuming stack has clear()

    // Test TIMESTAMP
    _ = try block.opTimestamp(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expect(frame_instance.stack.items[0] > 0);

    frame_instance.stack.clear();

    // Test NUMBER
    _ = try block.opNumber(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u256, 1), frame_instance.stack.items[0]); // Default block number

    frame_instance.stack.clear();

    // Test DIFFICULTY (pre-merge)
    evm_instance.chainRules = ChainRules.forHardfork(.London);
    _ = try block.opDifficulty(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    // try testing.expectEqual(@as(u256, 2500000000000000), frame_instance.stack.items[0]); // Placeholder, actual value depends on mock

    frame_instance.stack.clear();

    // Test PREVRANDAO (post-merge)
    evm_instance.chainRules = ChainRules.forHardfork(.Merge);
    _ = try block.opDifficulty(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    // try testing.expectEqual(@as(u256, 0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef), frame_instance.stack.items[0]); // Placeholder

    frame_instance.stack.clear();

    // Test GASLIMIT
    _ = try block.opGaslimit(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    // try testing.expectEqual(@as(u256, 30000000), frame_instance.stack.items[0]); // Placeholder

    frame_instance.stack.clear();

    // Test CHAINID
    _ = try block.opChainid(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u256, 1), frame_instance.stack.items[0]); // Default chain ID

    frame_instance.stack.clear();

    // Test SELFBALANCE
    _ = try block.opSelfbalance(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    try testing.expectEqual(@as(u256, 0), frame_instance.stack.items[0]);

    frame_instance.stack.clear();

    // Test BASEFEE
    evm_instance.chainRules = ChainRules.forHardfork(.London);
    _ = try block.opBasefee(0, &interpreter_instance, &frame_instance);
    try testing.expectEqual(@as(usize, 1), frame_instance.stack.size);
    // try testing.expectEqual(@as(u256, 1000000000), frame_instance.stack.items[0]); // Placeholder

    frame_instance.stack.clear();

    // Test BASEFEE with EIP-1559 disabled
    evm_instance.chainRules = ChainRules.forHardfork(.Berlin);
    const basefee_result = block.opBasefee(0, &interpreter_instance, &frame_instance);
    try testing.expectError(EvmModule.InterpreterError.InvalidOpcode, basefee_result);
}
