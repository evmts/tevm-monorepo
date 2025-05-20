const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const JumpTable = @import("../JumpTable.zig");
const StateManager = @import("../../StateManager/StateManager.zig").StateManager;
const B256 = @import("../../Types/B256.ts");
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;
// We don't need to define this since u256 is now a built-in type in Zig

/// SLOAD operation - loads a value from storage at the specified key
pub fn opSload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check stack underflow
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop key from stack
    const key = try frame.stack.pop();
    
    // Get EVM from interpreter
    const evm = interpreter.evm;
    
    // Get state manager from EVM
    const state_manager = evm.getStateManager() orelse {
        return ExecutionError.StaticStateChange;
    };
    
    // Get contract address
    const address = frame.contract.address;
    
    // Check if this is a cold or warm access
    const is_warm = state_manager.isWarmStorage(address, key);
    const cold_access_cost: u64 = if (is_warm) 0 else JumpTable.ColdSloadCost;
    
    // Calculate gas cost (base + cold access if applicable)
    const gas_cost = JumpTable.WarmStorageReadCost + cold_access_cost;
    
    // Charge gas
    if (frame.contract.gas < gas_cost) {
        return ExecutionError.OutOfGas;
    }
    frame.contract.gas -= gas_cost;
    
    // Mark the storage slot as warm for future accesses
    state_manager.markStorageWarm(address, key);
    
    // Get value from state
    const value = try state_manager.getStorage(address, key);
    
    // Push value to stack
    try frame.stack.push(value);
    
    return "";
}

/// SSTORE operation - stores a value at the specified key in storage
pub fn opSstore(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if we're in a static (read-only) context
    if (interpreter.readOnly) {
        return ExecutionError.StaticStateChange;
    }
    
    // Check stack underflow
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop value and key from stack
    const value = try frame.stack.pop();
    const key = try frame.stack.pop();
    
    // Get EVM
    const evm = interpreter.evm;
    
    // Get state manager
    const state_manager = evm.getStateManager() orelse {
        return ExecutionError.StaticStateChange;
    };
    
    // Get contract address
    const address = frame.contract.address;
    
    // Get the current value from state
    const current_value = try state_manager.getStorage(address, key);
    
    // Check if the slot is warm or cold for gas calculation
    const is_warm = state_manager.isWarmStorage(address, key);
    const cold_access_cost: u64 = if (is_warm) 0 else JumpTable.ColdSloadCost;
    
    // Track original value for EIP-2200 gas calculations
    // This ensures we track the value at the start of the transaction
    frame.contract.trackOriginalStorageValue(key, current_value);
    
    // Get the original value (from the start of the transaction)
    // Currently commented out as it's not fully used yet, will be used for EIP-2200
    // const original_value = frame.contract.getOriginalStorageValue(key, current_value);
    
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
    
    // Charge gas
    if (frame.contract.gas < gas_cost) {
        return ExecutionError.OutOfGas;
    }
    frame.contract.gas -= gas_cost;
    
    // Mark the storage slot as warm for future accesses
    state_manager.markStorageWarm(address, key);
    
    // Now handle storage refunds according to EIP-2200
    
    // Get the original value (from the start of the transaction)
    const original_value = frame.contract.getOriginalStorageValue(key, current_value);
    
    // EIP-2200 refund logic
    if (current_value != value) {
        if (original_value != 0) {
            // If we're restoring the original value (clearing a dirty slot)
            if (original_value == value and current_value != value) {
                // Refund for restoring original value
                frame.contract.addGasRefund(JumpTable.SstoreResetGas - JumpTable.SstoreClearGas);
            } else if (original_value == current_value and value == 0) {
                // We're clearing a slot that was also cleared during this execution
                // This means we need to remove the previous refund given for clearing
                // (avoiding double refunds)
                frame.contract.subGasRefund(JumpTable.SstoreRefundGas);
            }
        }
        
        // Standard refund for clearing a slot (2900 gas)
        if (current_value != 0 and value == 0) {
            frame.contract.addGasRefund(JumpTable.SstoreRefundGas);
        }
    }
    
    // Update the storage
    try state_manager.putStorage(address, key, value);
    
    return "";
}

/// TLOAD operation - loads a value from transient storage at the specified key
pub fn opTload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check stack underflow
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop key from stack
    const key = try frame.stack.pop();
    
    // Get EVM
    const evm = interpreter.evm;
    
    // Get state manager
    const state_manager = evm.getStateManager() orelse {
        return ExecutionError.StaticStateChange;
    };
    
    // Get contract address
    const address = frame.contract.address;
    
    // Define gas cost
    const gas_cost = @import("transient.zig").TLoadGas;
    
    // Charge gas
    if (frame.contract.gas < gas_cost) {
        return ExecutionError.OutOfGas;
    }
    frame.contract.gas -= gas_cost;
    
    // Get value from transient storage
    const value = try state_manager.getTransientStorage(address, key);
    
    // Push value to stack
    try frame.stack.push(value);
    
    return "";
}

/// TSTORE operation - stores a value at the specified key in transient storage
pub fn opTstore(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Check if we're in a static (read-only) context
    if (interpreter.readOnly) {
        return ExecutionError.StaticStateChange;
    }
    
    // Check stack underflow
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop value and key from stack
    const value = try frame.stack.pop();
    const key = try frame.stack.pop();
    
    // Get EVM
    const evm = interpreter.evm;
    
    // Get state manager
    const state_manager = evm.getStateManager() orelse {
        return ExecutionError.StaticStateChange;
    };
    
    // Get contract address
    const address = frame.contract.address;
    
    // Define gas cost - EIP-1153: Transient Storage Opcodes
    const gas_cost = @import("transient.zig").TStoreGas;
    
    // Charge gas
    if (frame.contract.gas < gas_cost) {
        return ExecutionError.OutOfGas;
    }
    frame.contract.gas -= gas_cost;
    
    // Update the transient storage
    try state_manager.putTransientStorage(address, key, value);
    
    return "";
}

/// Get values from the stack and convert to storage slot
fn getKeyFromStack(frame: *Frame) !u256 {
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    return try frame.stack.peek(0);
}

/// Convert a 32-byte array to a u256 for storage key/value
fn bytesToU256(bytes: []const u8) u256 {
    var result: u256 = 0;
    
    // Process all available bytes (up to 32)
    const len = @min(bytes.len, 32);
    
    for (0..len) |i| {
        const byte = bytes[i];
        result = (result << 8) | byte;
    }
    
    return result;
}

/// Convert a u256 to a 32-byte array for storage operations
fn u256ToBytes(allocator: std.mem.Allocator, value: u256) ![]u8 {
    var bytes = try allocator.alloc(u8, 32);
    // Initialize all bytes to zero
    @memset(bytes, 0);
    
    var temp = value;
    var i: usize = 31;
    
    // Fill in bytes from right to left (most significant first)
    while (temp > 0 and i < 32) : (i -= 1) {
        bytes[i] = @intCast(temp & 0xFF);
        temp >>= 8;
    }
    
    return bytes;
}