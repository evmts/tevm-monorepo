const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const JumpTable = @import("../JumpTable.zig");
const StateManager = @import("StateManager").StateManager;
const B256 = @import("../../Types/B256.ts");
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;
const EvmLogger = @import("../EvmLogger.zig").EvmLogger;
const createLogger = @import("../EvmLogger.zig").createLogger;
const createScopedLogger = @import("../EvmLogger.zig").createScopedLogger;
const debugOnly = @import("../EvmLogger.zig").debugOnly;

// Module-level logger initialization
var _logger: ?EvmLogger = null;

fn getLogger() EvmLogger {
    if (_logger == null) {
        _logger = createLogger(@src().file);
    }
    return _logger.?;
}
// We don't need to define this since u256 is now a built-in type in Zig

/// SLOAD operation - loads a value from storage at the specified key
pub fn opSload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    var scoped = createScopedLogger(getLogger(), "opSload()");
    defer scoped.deinit();
    
    getLogger().debug("Executing SLOAD at PC: {d}", .{pc});
    
    // Check stack underflow
    if (frame.stack.size < 1) {
        getLogger().err("Stack underflow in SLOAD: stack size = {d}", .{frame.stack.size});
        return ExecutionError.StackUnderflow;
    }
    
    // Pop key from stack
    const key = try frame.stack.pop();
    getLogger().debug("SLOAD key: 0x{x}", .{key});
    
    // Get EVM from interpreter
    const evm = interpreter.evm;
    
    // Get state manager from EVM
    const state_manager = evm.getStateManager() orelse {
        getLogger().err("State manager not available in SLOAD", .{});
        return ExecutionError.StaticStateChange;
    };
    
    // Get contract address
    const address = frame.contract.address;
    getLogger().debug("SLOAD address: {}", .{address});
    
    // Check if this is a cold or warm access
    const is_warm = state_manager.isWarmStorage(address, key);
    const cold_access_cost: u64 = if (is_warm) 0 else JumpTable.ColdSloadCost;
    
    // Calculate gas cost (base + cold access if applicable)
    const gas_cost = JumpTable.WarmStorageReadCost + cold_access_cost;
    getLogger().debug("SLOAD gas calculation: warm={}, cold_cost={d}, total_cost={d}", 
                     .{is_warm, cold_access_cost, gas_cost});
    
    // Charge gas
    if (frame.contract.gas < gas_cost) {
        getLogger().err("Out of gas in SLOAD: available={d}, required={d}", 
                       .{frame.contract.gas, gas_cost});
        return ExecutionError.OutOfGas;
    }
    frame.contract.gas -= gas_cost;
    getLogger().debug("Gas remaining after SLOAD: {d}", .{frame.contract.gas});
    
    // Mark the storage slot as warm for future accesses
    state_manager.markStorageWarm(address, key);
    getLogger().debug("Marked storage slot as warm: address={}, key=0x{x}", .{address, key});
    
    // Get value from state
    const value = try state_manager.getStorage(address, key);
    getLogger().debug("SLOAD result: key=0x{x}, value=0x{x}", .{key, value});
    
    // Push value to stack
    try frame.stack.push(value);
    
    debugOnly(struct {
        fn callback() void {
            // Log stack state after push
            const stack_data = frame.stack.data();
            if (stack_data.len > 0) {
                getLogger().debug("Stack after SLOAD (top item): 0x{x}", 
                                 .{stack_data[stack_data.len-1]});
            }
        }
    }.callback);
    
    return "";
}

/// SSTORE operation - stores a value at the specified key in storage
pub fn opSstore(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    var scoped = createScopedLogger(getLogger(), "opSstore()");
    defer scoped.deinit();
    
    getLogger().debug("Executing SSTORE at PC: {d}", .{pc});
    
    // Check if we're in a static (read-only) context
    if (interpreter.readOnly) {
        getLogger().err("Cannot execute SSTORE in static (read-only) context", .{});
        return ExecutionError.StaticStateChange;
    }
    
    // Check stack underflow
    if (frame.stack.size < 2) {
        getLogger().err("Stack underflow in SSTORE: stack size = {d}", .{frame.stack.size});
        return ExecutionError.StackUnderflow;
    }
    
    // Pop value and key from stack
    const value = try frame.stack.pop();
    const key = try frame.stack.pop();
    getLogger().debug("SSTORE key: 0x{x}, value: 0x{x}", .{key, value});
    
    // Get EVM
    const evm = interpreter.evm;
    
    // Get state manager
    const state_manager = evm.getStateManager() orelse {
        getLogger().err("State manager not available in SSTORE", .{});
        return ExecutionError.StaticStateChange;
    };
    
    // Get contract address
    const address = frame.contract.address;
    getLogger().debug("SSTORE address: {}", .{address});
    
    // Get the current value from state
    const current_value = try state_manager.getStorage(address, key);
    getLogger().debug("Current value at storage slot: 0x{x}", .{current_value});
    
    // Check if the slot is warm or cold for gas calculation
    const is_warm = state_manager.isWarmStorage(address, key);
    const cold_access_cost: u64 = if (is_warm) 0 else JumpTable.ColdSloadCost;
    getLogger().debug("Storage slot access: warm={}, cold_cost={d}", .{is_warm, cold_access_cost});
    
    // Track original value for EIP-2200 gas calculations
    // This ensures we track the value at the start of the transaction
    frame.contract.trackOriginalStorageValue(key, current_value);
    
    // Calculate gas cost based on EIP-2200 (Istanbul net gas metering)
    var gas_cost: u64 = 0;
    
    if (value == current_value) {
        // No change, minimal gas (warm access)
        gas_cost = JumpTable.WarmStorageReadCost; // 100 gas per EIP-2929
        getLogger().debug("SSTORE gas: No change case, minimal gas cost", .{});
    } else {
        // Need to calculate full gas cost based on value changes
        if (current_value == 0) {
            // Setting a zero slot to non-zero
            gas_cost = JumpTable.SstoreSetGas;
            getLogger().debug("SSTORE gas: Setting zero slot to non-zero (SstoreSetGas)", .{});
        } else {
            if (value == 0) {
                // Clearing a slot (refund will be added in the execution function)
                gas_cost = JumpTable.SstoreClearGas;
                getLogger().debug("SSTORE gas: Clearing non-zero slot (SstoreClearGas)", .{});
                
                // Note: We don't add refunds here in the gas calculation function
                // Refunds are handled in the execution function
            } else {
                // Modifying an existing non-zero value
                gas_cost = JumpTable.SstoreResetGas;
                getLogger().debug("SSTORE gas: Modifying non-zero value (SstoreResetGas)", .{});
                
                // Note: Refund calculations for cases like restoring original values
                // are handled in the execution function, not in the gas calculation
            }
        }
    }
    
    // Add the cold access cost from EIP-2929 if applicable
    gas_cost += cold_access_cost;
    getLogger().debug("SSTORE total gas cost: {d} (base) + {d} (cold access) = {d}", 
                     .{gas_cost - cold_access_cost, cold_access_cost, gas_cost});
    
    // Charge gas
    if (frame.contract.gas < gas_cost) {
        getLogger().err("Out of gas in SSTORE: available={d}, required={d}", 
                       .{frame.contract.gas, gas_cost});
        return ExecutionError.OutOfGas;
    }
    frame.contract.gas -= gas_cost;
    getLogger().debug("Gas remaining after SSTORE base cost: {d}", .{frame.contract.gas});
    
    // Mark the storage slot as warm for future accesses
    state_manager.markStorageWarm(address, key);
    getLogger().debug("Marked storage slot as warm: address={}, key=0x{x}", .{address, key});
    
    // Now handle storage refunds according to EIP-2200
    
    // Get the original value (from the start of the transaction)
    const original_value = frame.contract.getOriginalStorageValue(key, current_value);
    getLogger().debug("Original value (from tx start): 0x{x}", .{original_value});
    
    // EIP-2200 refund logic
    if (current_value != value) {
        getLogger().debug("Processing EIP-2200 refund logic", .{});
        
        if (original_value != 0) {
            // If we're restoring the original value (clearing a dirty slot)
            if (original_value == value and current_value != value) {
                // Refund for restoring original value
                const refund_amount = JumpTable.SstoreResetGas - JumpTable.SstoreClearGas;
                frame.contract.addGasRefund(refund_amount);
                getLogger().debug("Added refund for restoring original value: {d}", .{refund_amount});
            } else if (original_value == current_value and value == 0) {
                // We're clearing a slot that was also cleared during this execution
                // This means we need to remove the previous refund given for clearing
                // (avoiding double refunds)
                frame.contract.subGasRefund(JumpTable.SstoreRefundGas);
                getLogger().debug("Removed previous refund to avoid double refund: {d}", 
                                 .{JumpTable.SstoreRefundGas});
            }
        }
        
        // Standard refund for clearing a slot (2900 gas)
        if (current_value != 0 and value == 0) {
            frame.contract.addGasRefund(JumpTable.SstoreRefundGas);
            getLogger().debug("Added standard refund for clearing slot: {d}", 
                             .{JumpTable.SstoreRefundGas});
        }
    } else {
        getLogger().debug("No value change, no refund processing needed", .{});
    }
    
    getLogger().debug("Current gas refund counter: {d}", .{frame.contract.gas_refund});
    
    // Update the storage
    try state_manager.putStorage(address, key, value);
    getLogger().debug("Storage updated: key=0x{x}, value=0x{x}", .{key, value});
    
    return "";
}

/// TLOAD operation - loads a value from transient storage at the specified key
pub fn opTload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    var scoped = createScopedLogger(getLogger(), "opTload()");
    defer scoped.deinit();
    
    getLogger().debug("Executing TLOAD at PC: {d}", .{pc});
    
    // Check stack underflow
    if (frame.stack.size < 1) {
        getLogger().err("Stack underflow in TLOAD: stack size = {d}", .{frame.stack.size});
        return ExecutionError.StackUnderflow;
    }
    
    // Pop key from stack
    const key = try frame.stack.pop();
    getLogger().debug("TLOAD key: 0x{x}", .{key});
    
    // Get EVM
    const evm = interpreter.evm;
    
    // Get state manager
    const state_manager = evm.getStateManager() orelse {
        getLogger().err("State manager not available in TLOAD", .{});
        return ExecutionError.StaticStateChange;
    };
    
    // Get contract address
    const address = frame.contract.address;
    getLogger().debug("TLOAD address: {}", .{address});
    
    // Define gas cost
    const gas_cost = @import("transient.zig").TLoadGas;
    getLogger().debug("TLOAD gas cost: {d}", .{gas_cost});
    
    // Charge gas
    if (frame.contract.gas < gas_cost) {
        getLogger().err("Out of gas in TLOAD: available={d}, required={d}", 
                      .{frame.contract.gas, gas_cost});
        return ExecutionError.OutOfGas;
    }
    frame.contract.gas -= gas_cost;
    getLogger().debug("Gas remaining after TLOAD: {d}", .{frame.contract.gas});
    
    // Get value from transient storage
    const value = try state_manager.getTransientStorage(address, key);
    getLogger().debug("TLOAD result: key=0x{x}, value=0x{x}", .{key, value});
    
    // Push value to stack
    try frame.stack.push(value);
    
    debugOnly(struct {
        fn callback() void {
            // Log stack state after push
            const stack_data = frame.stack.data();
            if (stack_data.len > 0) {
                getLogger().debug("Stack after TLOAD (top item): 0x{x}", 
                                 .{stack_data[stack_data.len-1]});
            }
        }
    }.callback);
    
    return "";
}

/// TSTORE operation - stores a value at the specified key in transient storage
pub fn opTstore(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    var scoped = createScopedLogger(getLogger(), "opTstore()");
    defer scoped.deinit();
    
    getLogger().debug("Executing TSTORE at PC: {d}", .{pc});
    
    // Check if we're in a static (read-only) context
    if (interpreter.readOnly) {
        getLogger().err("Cannot execute TSTORE in static (read-only) context", .{});
        return ExecutionError.StaticStateChange;
    }
    
    // Check stack underflow
    if (frame.stack.size < 2) {
        getLogger().err("Stack underflow in TSTORE: stack size = {d}", .{frame.stack.size});
        return ExecutionError.StackUnderflow;
    }
    
    // Pop value and key from stack
    const value = try frame.stack.pop();
    const key = try frame.stack.pop();
    getLogger().debug("TSTORE key: 0x{x}, value: 0x{x}", .{key, value});
    
    // Get EVM
    const evm = interpreter.evm;
    
    // Get state manager
    const state_manager = evm.getStateManager() orelse {
        getLogger().err("State manager not available in TSTORE", .{});
        return ExecutionError.StaticStateChange;
    };
    
    // Get contract address
    const address = frame.contract.address;
    getLogger().debug("TSTORE address: {}", .{address});
    
    // Define gas cost - EIP-1153: Transient Storage Opcodes
    const gas_cost = @import("transient.zig").TStoreGas;
    getLogger().debug("TSTORE gas cost: {d}", .{gas_cost});
    
    // Charge gas
    if (frame.contract.gas < gas_cost) {
        getLogger().err("Out of gas in TSTORE: available={d}, required={d}", 
                      .{frame.contract.gas, gas_cost});
        return ExecutionError.OutOfGas;
    }
    frame.contract.gas -= gas_cost;
    getLogger().debug("Gas remaining after TSTORE: {d}", .{frame.contract.gas});
    
    // Get the current value for logging (if debug is enabled)
    debugOnly(struct {
        fn callback() void {
            if (state_manager.getTransientStorage(address, key)) |current_value| {
                getLogger().debug("Current transient storage value: 0x{x}", .{current_value});
            } else |_| {
                getLogger().debug("No current value in transient storage", .{});
            }
        }
    }.callback);
    
    // Update the transient storage
    try state_manager.putTransientStorage(address, key, value);
    getLogger().debug("Transient storage updated: key=0x{x}, value=0x{x}", .{key, value});
    
    return "";
}

/// Get values from the stack and convert to storage slot
fn getKeyFromStack(frame: *Frame) !u256 {
    var scoped = createScopedLogger(getLogger(), "getKeyFromStack()");
    defer scoped.deinit();
    
    getLogger().debug("Getting key from stack", .{});
    
    if (frame.stack.size < 1) {
        getLogger().err("Stack underflow trying to get key: stack size = {d}", .{frame.stack.size});
        return ExecutionError.StackUnderflow;
    }
    
    const key = try frame.stack.peek(0);
    getLogger().debug("Retrieved key from stack: 0x{x}", .{key});
    return key;
}

/// Convert a 32-byte array to a u256 for storage key/value
fn bytesToU256(bytes: []const u8) u256 {
    var scoped = createScopedLogger(getLogger(), "bytesToU256()");
    defer scoped.deinit();
    
    getLogger().debug("Converting byte array (length: {d}) to u256", .{bytes.len});
    
    var result: u256 = 0;
    
    // Process all available bytes (up to 32)
    const len = @min(bytes.len, 32);
    
    for (0..len) |i| {
        const byte = bytes[i];
        result = (result << 8) | byte;
    }
    
    getLogger().debug("Conversion result: 0x{x}", .{result});
    return result;
}

/// Convert a u256 to a 32-byte array for storage operations
fn u256ToBytes(allocator: std.mem.Allocator, value: u256) ![]u8 {
    var scoped = createScopedLogger(getLogger(), "u256ToBytes()");
    defer scoped.deinit();
    
    getLogger().debug("Converting u256 value 0x{x} to byte array", .{value});
    
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
    
    // Create a copy of bytes for the debug function to avoid the capturing issue
    const bytes_copy = bytes;
    
    debugOnly(struct {
        fn callback() void {
            // Log a preview of the byte array
            if (bytes_copy.len > 0) {
                const preview_len = @min(bytes_copy.len, 8);
                var preview_buf: [256]u8 = undefined;
                var preview_fbs = std.io.fixedBufferStream(&preview_buf);
                const preview_writer = preview_fbs.writer();
                
                for (0..preview_len) |j| {
                    std.fmt.format(preview_writer, "{x:0>2} ", .{bytes_copy[j]}) catch {};
                }
                
                if (bytes_copy.len > preview_len) {
                    std.fmt.format(preview_writer, "... ({d} more bytes)", .{bytes_copy.len - preview_len}) catch {};
                }
                
                getLogger().debug("Byte array result: {s}", .{preview_buf[0..preview_fbs.pos]});
            }
        }
    }.callback);
    
    return bytes;
}