const std = @import("std");

const EvmModule = @import("Evm");
const Interpreter = EvmModule.Interpreter;
const Frame = EvmModule.Frame;
const ExecutionError = EvmModule.InterpreterError;
const JumpTable = EvmModule.JumpTable;
const B256 = EvmModule.B256;
const Stack = EvmModule.Stack;
const Memory = EvmModule.Memory;
// StateManager is accessed via interpreter.evm.state_manager, so direct import not needed for type if not used directly.
// If StateManager type is needed for casting or struct definition, it would be EvmModule.StateManager.

// EIP-1153: Transient Storage gas costs
pub const TLoadGas: u64 = 100; // Aligned with the SLOAD gas cost, but a bit higher
pub const TStoreGas: u64 = 100; // Warm access cost, significantly less than SSTORE

/// TLOAD operation - loads a value from transient storage at the specified key
/// EIP-1153: Transient Storage
pub fn opTload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;

    // Check if EIP-1153 is enabled
    if (!interpreter.evm.chainRules.IsEIP1153) {
        return ExecutionError.InvalidOpcode;
    }

    // We need at least 1 item on the stack (the key)
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }

    // Pop the key from the stack
    const key = try frame.stack.pop();

    // Convert key to B256 format
    var key_bytes: [32]u8 = undefined;

    // Convert u256 to bytes in big-endian format
    var temp_key = key;

    // Fill the byte array from right to left (big-endian)
    var i: isize = 31;
    while (i >= 0) : (i -= 1) {
        key_bytes[@intCast(i)] = @truncate(temp_key);
        temp_key >>= 8;
    }

    const key_b256 = B256.fromBytes(&key_bytes);

    // Get account address
    const addr = frame.address();

    // Get state manager from interpreter
    const evm = interpreter.evm;
    const state_manager = evm.state_manager orelse return ExecutionError.InvalidStateAccess;

    // Get value from transient storage
    // Note: In a full implementation, the state manager would need a special method for transient storage
    // Since this is a new feature, we'll need to add this to the state manager
    // For now, we'll return 0 as a placeholder
    var value_bytes: [32]u8 = [_]u8{0} ** 32;

    // In a full implementation, this would be:
    // const value_bytes = try state_manager.getTransientStorage(addr, key_b256);

    // Get the transient storage if implemented in the state manager
    if (@hasDecl(state_manager, "getTransientStorage")) {
        value_bytes = state_manager.getTransientStorage(addr, key_b256) catch [_]u8{0} ** 32;
    }

    // Convert bytes to u256
    var value: u256 = 0;

    // Convert storage bytes to u256 (big-endian format)
    for (value_bytes) |byte| {
        value = (value << 8) | byte;
    }

    // Push the result onto the stack
    try frame.stack.push(value);

    return "";
}

/// TSTORE operation - stores a value to transient storage at the specified key
/// EIP-1153: Transient Storage
pub fn opTstore(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;

    // Check if EIP-1153 is enabled
    if (!interpreter.evm.chainRules.IsEIP1153) {
        return ExecutionError.InvalidOpcode;
    }

    // Check for read-only mode
    if (interpreter.readOnly) {
        return ExecutionError.WriteProtection;
    }

    // We need at least 2 items on the stack (key and value)
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }

    // Pop value and key from the stack
    // Note: Stack pops in reverse order (LIFO)
    const value = try frame.stack.pop(); // Second item, the value to store
    const key = try frame.stack.pop(); // First item, the storage key

    // Convert key to B256 format
    var key_bytes: [32]u8 = undefined;

    // Convert u256 to bytes in big-endian format
    var temp_key = key;

    // Fill the byte array from right to left (big-endian)
    var i: isize = 31;
    while (i >= 0) : (i -= 1) {
        key_bytes[@intCast(i)] = @truncate(temp_key);
        temp_key >>= 8;
    }

    const key_b256 = B256.fromBytes(&key_bytes);

    // Get account address
    const addr = frame.address();

    // Get state manager from interpreter
    const evm = interpreter.evm;
    const state_manager = evm.state_manager orelse return ExecutionError.InvalidStateAccess;

    // Convert value to bytes for storage
    var value_bytes: [32]u8 = undefined;

    // Convert u256 to bytes in big-endian format
    var temp_value = value;

    // Fill the byte array from right to left (big-endian)
    i = 31;
    while (i >= 0) : (i -= 1) {
        value_bytes[@intCast(i)] = @truncate(temp_value);
        temp_value >>= 8;
    }

    // Store the value in transient storage
    // Note: In a full implementation, the state manager would need a special method for transient storage
    // Since this is a new feature, we'll need to add this to the state manager
    // For now, this is a placeholder

    // In a full implementation, this would be:
    // try state_manager.putTransientStorage(addr, key_b256, &value_bytes);

    // Put the transient storage if implemented in the state manager
    if (@hasDecl(state_manager, "putTransientStorage")) {
        state_manager.putTransientStorage(addr, key_b256, &value_bytes) catch {};
    }

    return "";
}

/// Register transient storage opcodes in the jump table
pub fn registerTransientOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // TLOAD (0x5C)
    const tload_op = try allocator.create(JumpTable.Operation);
    tload_op.* = JumpTable.Operation{
        .execute = opTload,
        .constant_gas = TLoadGas,
        .min_stack = JumpTable.minStack(1, 1),
        .max_stack = JumpTable.maxStack(1, 1),
    };
    jump_table.table[0x5C] = tload_op;

    // TSTORE (0x5D)
    const tstore_op = try allocator.create(JumpTable.Operation);
    tstore_op.* = JumpTable.Operation{
        .execute = opTstore,
        .constant_gas = TStoreGas,
        .min_stack = JumpTable.minStack(2, 0),
        .max_stack = JumpTable.maxStack(2, 0),
    };
    jump_table.table[0x5D] = tstore_op;
}
