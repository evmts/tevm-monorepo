const std = @import("std");
const testing = std.testing;
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const Contract = @import("../Contract.zig").Contract;
const Evm = @import("../evm.zig").Evm;
const storage = @import("storage.zig");
const StateManager = @import("../../StateManager/StateManager.zig").StateManager;
const JumpTable = @import("../JumpTable.zig");
const address = @import("../../Address");
const B256 = @import("../../Types/B256.ts");

// Mock address for testing
fn createTestAddress() address.Address {
    return address.createAddress("0x1234567890123456789012345678901234567890");
}

// Create minimal test environment for storage operations
fn createTestEnvironment(allocator: std.mem.Allocator) !struct {
    evm: Evm,
    contract: Contract,
    frame: Frame,
    interpreter: Interpreter,
    stateManager: *StateManager
} {
    var evm = Evm.init();
    
    // Create state manager with default options
    const options = StateManager.StateOptions{};
    const stateManager = try StateManager.init(allocator, options);
    
    // Set state manager in EVM
    evm.setStateManager(stateManager);
    
    // Create contract and frame
    const caller = createTestAddress();
    const contract_address = createTestAddress();
    
    var contract = Contract.init(
        caller,
        contract_address,
        100, // value
        100000, // gas
        null // jumpdests
    );
    
    // Set empty code
    const code_hash: [32]u8 = [_]u8{0} ** 32;
    contract.setCallCode(code_hash, &[_]u8{});
    
    const frame = try Frame.init(allocator, &contract);
    
    // Initialize an empty jump table for testing
    const table = JumpTable.JumpTable.init();
    
    // Create interpreter
    const interpreter = Interpreter.create(allocator, &evm, table);
    
    return .{
        .evm = evm,
        .contract = contract,
        .frame = frame,
        .interpreter = interpreter,
        .stateManager = stateManager
    };
}

test "SLOAD - basic functionality" {
    const allocator = testing.allocator;
    
    var env = try createTestEnvironment(allocator);
    defer env.frame.deinit();
    defer env.stateManager.deinit();
    
    // Setup: Create a key/value pair in storage
    const key = B256.fromHex("0x0000000000000000000000000000000000000000000000000000000000000001");
    const value = [_]u8{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42}; // 42 in big-endian
    
    try env.stateManager.putContractStorage(env.contract.getAddress(), key, &value);
    
    // Prepare stack with the key (1)
    try env.frame.stack.push(1);
    
    // Execute SLOAD operation
    const result = try storage.opSload(0, &env.interpreter, &env.frame);
    
    // Check that operation succeeded
    try testing.expectEqualStrings("", result);
    
    // Check that stack now has the value (42)
    try testing.expectEqual(@as(usize, 1), env.frame.stack.size);
    try testing.expectEqual(@as(u256, 42), env.frame.stack.data[0]);
}

test "SSTORE - basic functionality" {
    const allocator = testing.allocator;
    
    var env = try createTestEnvironment(allocator);
    defer env.frame.deinit();
    defer env.stateManager.deinit();
    
    // Prepare stack with key and value (key=1, value=42)
    try env.frame.stack.push(1);
    try env.frame.stack.push(42);
    
    // Execute SSTORE operation
    const result = try storage.opSstore(0, &env.interpreter, &env.frame);
    
    // Check that operation succeeded
    try testing.expectEqualStrings("", result);
    
    // Check that stack is now empty
    try testing.expectEqual(@as(usize, 0), env.frame.stack.size);
    
    // Verify storage was updated correctly
    const key = B256.fromHex("0x0000000000000000000000000000000000000000000000000000000000000001");
    const value_bytes = try env.stateManager.getContractStorage(env.contract.getAddress(), key);
    
    // Convert bytes to u256 to check value
    var value: u256 = 0;
    for (value_bytes) |byte| {
        value = (value << 8) | byte;
    }
    
    try testing.expectEqual(@as(u256, 42), value);
}

test "SSTORE - gas calculation" {
    const allocator = testing.allocator;
    
    var env = try createTestEnvironment(allocator);
    defer env.frame.deinit();
    defer env.stateManager.deinit();
    
    // Setup: Create a key/value pair in storage
    const key = B256.fromHex("0x0000000000000000000000000000000000000000000000000000000000000001");
    const value = [_]u8{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42}; // 42 in big-endian
    
    try env.stateManager.putContractStorage(env.contract.getAddress(), key, &value);
    
    // Test with same value (key=1, value=42)
    try env.frame.stack.push(1);
    try env.frame.stack.push(42);
    
    const initialGas = env.contract.gas;
    
    // Execute SSTORE operation
    _ = try storage.opSstore(0, &env.interpreter, &env.frame);
    
    // Check gas cost for writing the same value (should be JumpTable.SstoreSentryGas)
    try testing.expectEqual(initialGas - JumpTable.SstoreSentryGas, env.contract.gas);
    
    // Now test with different value to an existing slot (key=1, value=100)
    try env.frame.stack.push(1);
    try env.frame.stack.push(100);
    
    const gasBeforeModify = env.contract.gas;
    
    // Execute SSTORE operation
    _ = try storage.opSstore(0, &env.interpreter, &env.frame);
    
    // Check gas cost for modifying an existing value (should be JumpTable.SstoreResetGas)
    try testing.expectEqual(gasBeforeModify - JumpTable.SstoreResetGas, env.contract.gas);
}

test "SSTORE - read-only mode" {
    const allocator = testing.allocator;
    
    var env = try createTestEnvironment(allocator);
    defer env.frame.deinit();
    defer env.stateManager.deinit();
    
    // Set read-only mode
    env.interpreter.readOnly = true;
    
    // Prepare stack with key and value (key=1, value=42)
    try env.frame.stack.push(1);
    try env.frame.stack.push(42);
    
    // Execute SSTORE operation - should error due to read-only mode
    const result = storage.opSstore(0, &env.interpreter, &env.frame);
    
    // Check for StaticStateChange error
    try testing.expectError(ExecutionError.StaticStateChange, result);
}