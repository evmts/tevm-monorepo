const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const JumpTable = @import("../JumpTable.zig");
const StateManager = @import("../../StateManager/StateManager.zig").StateManager;
const B256 = @import("../../Types/B256.ts");
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;
// Built-in u256 type
const u256 = u256;

/// SLOAD operation - loads a value from storage at the specified key
pub fn opSload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check for read-only mode
    if (interpreter.readOnly) {
        return ExecutionError.WriteProtection;
    }
    
    // We need at least 1 item on the stack (the key)
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop the key from the stack
    const key = try frame.stack.pop();
    
    // EIP-2929: Check if this is a cold access and apply appropriate gas costs
    const is_cold_storage = frame.contract.isStorageSlotCold(key);
    
    // Calculate EIP-2929 gas cost
    const gas_cost = if (is_cold_storage)
        JumpTable.ColdSloadCost  // Cold access (2100 gas)
    else
        JumpTable.WarmStorageReadCost;  // Warm access (100 gas)
    
    // Check if we have enough gas
    if (frame.contract.gas < gas_cost) {
        return ExecutionError.OutOfGas;
    }
    
    // Use gas
    frame.contract.useGas(gas_cost);
    
    // Mark the slot as warm for future accesses
    _ = frame.contract.markStorageSlotWarm(key);
    
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
    
    // Also mark the contract account as warm for EIP-2929
    _ = frame.contract.markAccountWarm();
    
    // Get state manager from interpreter
    const evm = interpreter.evm;
    const state_manager = evm.state_manager orelse return ExecutionError.InvalidStateAccess;
    
    // Get value from storage
    const value_bytes = try state_manager.getContractStorage(addr, key_b256);
    
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

/// SSTORE operation - stores a value to storage at the specified key
/// Implements EIP-2200 Istanbul net gas metering and EIP-2929 cold/warm access
pub fn opSstore(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check for read-only mode
    if (interpreter.readOnly) {
        return ExecutionError.StaticStateChange;
    }
    
    // We need at least 2 items on the stack (key and value)
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Minimal gas check to fail fast
    if (frame.contract.gas < JumpTable.SstoreSentryGas) {
        return ExecutionError.OutOfGas;
    }
    
    // Pop value and key from the stack
    // Note: Stack pops in reverse order (LIFO)
    const value = try frame.stack.pop();  // Second item, the value to store
    const key = try frame.stack.pop();    // First item, the storage key
    
    // EIP-2929: Check if this is a cold access
    const is_cold_storage = frame.contract.isStorageSlotCold(key);
    
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
    
    // Mark account as warm (may already be warm)
    _ = frame.contract.markAccountWarm();
    
    // Get state manager from interpreter
    const evm = interpreter.evm;
    const state_manager = evm.state_manager orelse return ExecutionError.InvalidStateAccess;
    
    // Load current value to calculate gas cost
    const current_value_bytes = try state_manager.getContractStorage(addr, key_b256);
    
    // Convert current value bytes to u256
    var current_value: u256 = 0;
    for (current_value_bytes) |byte| {
        current_value = (current_value << 8) | byte;
    }
    
    // For EIP-2200 we also need the original value (before any transactions in the current execution)
    // For our implementation, we'll use the current value as the original value
    // In a full implementation, this would track the original values separately
    const original_value = current_value;
    
    // Calculate gas cost based on EIP-2200 (Istanbul net gas metering)
    var gas_cost: u64 = 0;
    
    if (value == current_value) {
        // No change, minimal gas (warm access)
        gas_cost = JumpTable.WarmStorageReadCost; // 100 gas per EIP-2929
    } else {
        // Need to calculate full gas cost based on value changes
        if (current_value == 0) {
            // Setting a zero slot to non-zero
            gas_cost = JumpTable.SstoreSetGas;
        } else {
            if (value == 0) {
                // Clearing a slot (refund may apply)
                gas_cost = JumpTable.SstoreClearGas;
                
                // EIP-2200: Add refund for clearing storage
                frame.contract.addGasRefund(JumpTable.SstoreRefundGas);
            } else {
                // Modifying an existing non-zero value
                gas_cost = JumpTable.SstoreResetGas;
                
                // EIP-2200: If we're replacing a non-zero value with another non-zero value
                // we need to account for potential storage refunds
                if (original_value != 0) {
                    // If we're restoring to the original value, refund some gas
                    if (original_value == value && current_value != value) {
                        // Refund for restoring original value
                        frame.contract.addGasRefund(JumpTable.SstoreResetGas - JumpTable.SstoreClearGas);
                    } else if (original_value == current_value && value == 0) {
                        // We're clearing a slot that was also cleared during this execution
                        // This means we need to remove the previous refund given for clearing
                        // (avoiding double refunds)
                        frame.contract.subGasRefund(JumpTable.SstoreRefundGas);
                    }
                }
            }
        }
    }
    
    // Add EIP-2929 cold access cost if needed
    if (is_cold_storage) {
        gas_cost += JumpTable.ColdSloadCost - JumpTable.WarmStorageReadCost; // 2100 - 100 = 2000
    }
    
    // Check if we have enough gas
    if (frame.contract.gas < gas_cost) {
        return ExecutionError.OutOfGas;
    }
    
    // Use gas
    frame.contract.useGas(gas_cost);
    
    // Mark the storage slot as warm for future accesses
    _ = frame.contract.markStorageSlotWarm(key);
    
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
    
    // Store the value
    try state_manager.putContractStorage(addr, key_b256, &value_bytes);
    
    return "";
}

/// Calculate dynamic gas for SSTORE operation
/// Implements EIP-2200 Istanbul net gas metering and EIP-2929 cold/warm storage access
pub fn sstoreDynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    // Parameters needed in this function
    _ = memory;
    _ = requested_size;
    
    // We need at least 2 items on stack for SSTORE
    if (stack.size < 2) {
        return error.OutOfGas;
    }
    
    // Minimum gas requirement for SSTORE
    if (frame.contract.gas < JumpTable.SstoreSentryGas) {
        return error.OutOfGas;
    }
    
    // Take a snapshot of the stack to avoid modifying it
    const key = stack.data[stack.size - 2];      // 2nd from top is key
    const value = stack.data[stack.size - 1];    // Top of stack is value
    
    // Get account address
    const addr = frame.address();
    
    // Check cold access status for EIP-2929
    // In gas calculation, we don't modify the access status, just check it
    // The actual opcode execution will mark it warm 
    const cold_access = frame.contract.isStorageSlotCold(key);
    
    // Additional cold access gas (EIP-2929)
    var cold_access_cost: u64 = 0;
    if (cold_access) {
        cold_access_cost = JumpTable.ColdSloadCost - JumpTable.WarmStorageReadCost; // 2100 - 100 = 2000
    }
    
    // Get state manager
    const evm = interpreter.evm;
    const state_manager = evm.state_manager orelse return error.OutOfGas;
    
    // Convert key to B256 format
    var key_bytes: [32]u8 = undefined;
    var temp_key = key;
    var i: isize = 31;
    while (i >= 0) : (i -= 1) {
        key_bytes[@intCast(i)] = @truncate(temp_key);
        temp_key >>= 8;
    }
    const key_b256 = B256.fromBytes(&key_bytes);
    
    // Get current value
    const current_value_bytes = state_manager.getContractStorage(addr, key_b256) catch return error.OutOfGas;
    
    // Convert to u256
    var current_value: u256 = 0;
    for (current_value_bytes) |byte| {
        current_value = (current_value << 8) | byte;
    }
    
    // For EIP-2200 we also need the original value (before any transactions in the current execution)
    // For a full implementation, we would look this up from a separate tracking mechanism
    // For our implementation, we'll use the current value for original_value
    // In a full implementation, this would track the original values separately
    const original_value = current_value;
    
    // Calculate gas cost based on EIP-2200 (Istanbul net gas metering)
    var gas_cost: u64 = 0;
    
    if (value == current_value) {
        // No change, minimal gas (warm access)
        gas_cost = JumpTable.WarmStorageReadCost; // 100 gas per EIP-2929
    } else {
        // Need to calculate full gas cost based on value changes
        if (current_value == 0) {
            // Setting a zero slot to non-zero
            gas_cost = JumpTable.SstoreSetGas;
        } else {
            if (value == 0) {
                // Clearing a slot (refund will be added in the execution function)
                gas_cost = JumpTable.SstoreClearGas;
                
                // Note: We don't add refunds here in the gas calculation function
                // Refunds are handled in the execution function
            } else {
                // Modifying an existing non-zero value
                gas_cost = JumpTable.SstoreResetGas;
                
                // Note: Refund calculations for cases like restoring original values
                // are handled in the execution function, not in the gas calculation
            }
        }
    }
    
    // Add the cold access cost from EIP-2929 if applicable
    gas_cost += cold_access_cost;
    
    return gas_cost;
}

/// Register storage opcodes in the jump table
pub fn registerStorageOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // SLOAD (0x54)
    const sload_op = try allocator.create(JumpTable.Operation);
    sload_op.* = JumpTable.Operation{
        .execute = opSload,
        .constant_gas = 0, // We use dynamic gas costs based on warm/cold access
        .dynamic_gas = sloadDynamicGas,
        .min_stack = JumpTable.minStack(1, 1),
        .max_stack = JumpTable.maxStack(1, 1),
    };
    jump_table.table[0x54] = sload_op;
    
    // SSTORE (0x55)
    const sstore_op = try allocator.create(JumpTable.Operation);
    sstore_op.* = JumpTable.Operation{
        .execute = opSstore,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(2, 0),
        .max_stack = JumpTable.maxStack(2, 0),
        .dynamic_gas = sstoreDynamicGas,
    };
    jump_table.table[0x55] = sstore_op;
}

/// Calculate dynamic gas for SLOAD operation
/// Implements EIP-2929 warm/cold storage access
pub fn sloadDynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    // Parameters needed in this function
    _ = interpreter;
    _ = memory;
    _ = requested_size;
    
    // We need at least 1 item on stack for SLOAD
    if (stack.size < 1) {
        return error.OutOfGas;
    }
    
    // Take a snapshot of the stack to avoid modifying it
    const key = stack.data[stack.size - 1]; // Top of stack is the key
    
    // Check if this is a cold access
    const is_cold_storage = frame.contract.isStorageSlotCold(key);
    
    // Calculate gas cost based on EIP-2929
    const gas_cost = if (is_cold_storage)
        JumpTable.ColdSloadCost  // Cold access (2100 gas)
    else
        JumpTable.WarmStorageReadCost;  // Warm access (100 gas)
    
    return gas_cost;
}