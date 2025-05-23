const std = @import("std");
const jumpTableModule = @import("../jumpTable/JumpTable.zig");
const JumpTable = jumpTableModule.JumpTable;
const Operation = jumpTableModule.Operation;
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../interpreter.zig").InterpreterError;
const stackModule = @import("../Stack.zig");
const Stack = stackModule.Stack;
const StackError = stackModule.StackError;

// Helper to convert Stack errors to ExecutionError
fn mapStackError(err: StackError) ExecutionError {
    return switch (err) {
        error.OutOfBounds => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        error.OutOfMemory => ExecutionError.OutOfGas,
    };
}
const Memory = @import("../Memory.zig").Memory;
// Import unified B256 type
const B256 = @import("utils").B256;
const EvmLogger = @import("../TestEvmLogger.zig").EvmLogger;
const createLogger = @import("../TestEvmLogger.zig").createLogger;
const createScopedLogger = @import("../TestEvmLogger.zig").createScopedLogger;
const debugOnly = @import("../TestEvmLogger.zig").debugOnly;

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
    const key_u256 = frame.stack.pop() catch |err| return mapStackError(err);
    getLogger().debug("SLOAD key: 0x{x}", .{key_u256});
    
    // Convert u256 key to B256 format
    var key_bytes: [32]u8 = undefined;
    var temp = key_u256;
    var i: usize = 31;
    while (i < 32) : (i -%= 1) {
        key_bytes[i] = @intCast(temp & 0xFF);
        temp >>= 8;
        if (i == 0) break;
    }
    const key = B256{ .bytes = key_bytes };
    
    // Get EVM from interpreter
    const evm_instance = interpreter.evm;
    
    // Get state manager from EVM
    const state_manager = evm_instance.state_manager orelse {
        getLogger().err("State manager not available in SLOAD", .{});
        return ExecutionError.StaticStateChange;
    };
    
    // Get contract address
    const address = frame.contract.address;
    getLogger().debug("SLOAD address: {}", .{address});
    
    // Get value from state
    // TODO: This is using the simplified StateManager which doesn't support EIP-2929
    // For now, we'll assume all accesses are cold on first access
    
    // Import the StateManager module to access types
    const SM = @import("state_manager");
    
    // Convert address to B160
    const addr_b160 = SM.B160{ .bytes = address };
    
    // Convert key to B256
    const key_b256 = SM.B256{ .bytes = key.bytes };
    
    const storage_bytes = try state_manager.getContractStorage(addr_b160, key_b256);
    
    // Convert storage bytes to B256
    var value_bytes: [32]u8 = [_]u8{0} ** 32;
    if (storage_bytes.len > 0) {
        const copy_len = @min(storage_bytes.len, 32);
        @memcpy(value_bytes[32 - copy_len..], storage_bytes[0..copy_len]);
    }
    const value = B256{ .bytes = value_bytes };
    
    // For now, assume first access is always cold
    const addr_was_cold = true;
    const slot_was_cold = true;
    
    // Calculate gas cost based on cold access
    const cold_access_cost: u64 = if (slot_was_cold) jumpTableModule.ColdSloadCost else 0;
    const gas_cost = jumpTableModule.WarmStorageReadCost + cold_access_cost;
    getLogger().debug("SLOAD gas calculation: addr_cold={}, slot_cold={}, cold_cost={d}, total_cost={d}", 
                     .{addr_was_cold, slot_was_cold, cold_access_cost, gas_cost});
    
    // Charge gas
    if (frame.contract.gas < gas_cost) {
        getLogger().err("Out of gas in SLOAD: available={d}, required={d}", 
                       .{frame.contract.gas, gas_cost});
        return ExecutionError.OutOfGas;
    }
    frame.contract.gas -= gas_cost;
    getLogger().debug("Gas remaining after SLOAD: {d}", .{frame.contract.gas});
    // Convert B256 value to u256
    var value_u256: u256 = 0;
    for (0..32) |j| {
        value_u256 = (value_u256 << 8) | value.bytes[j];
    }
    
    getLogger().debug("SLOAD result: key=0x{x}, value=0x{x}", .{key_u256, value_u256});
    
    // Push value to stack
    frame.stack.push(value_u256) catch |err| return mapStackError(err);
    
    // Debug logging removed due to closure limitations
    
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
    const value_u256 = frame.stack.pop() catch |err| return mapStackError(err);
    const key_u256 = frame.stack.pop() catch |err| return mapStackError(err);
    getLogger().debug("SSTORE key: 0x{x}, value: 0x{x}", .{key_u256, value_u256});
    
    // Convert u256 key to B256 format
    var key_bytes: [32]u8 = undefined;
    var temp = key_u256;
    var i: usize = 31;
    while (i < 32) : (i -%= 1) {
        key_bytes[i] = @intCast(temp & 0xFF);
        temp >>= 8;
        if (i == 0) break;
    }
    const key = B256{ .bytes = key_bytes };
    
    // Convert u256 value to B256 format
    var value_bytes: [32]u8 = undefined;
    temp = value_u256;
    i = 31;
    while (i < 32) : (i -%= 1) {
        value_bytes[i] = @intCast(temp & 0xFF);
        temp >>= 8;
        if (i == 0) break;
    }
    const value = B256{ .bytes = value_bytes };
    
    // Get EVM
    const evm_instance = interpreter.evm;
    
    // Get state manager
    const state_manager = evm_instance.state_manager orelse {
        getLogger().err("State manager not available in SSTORE", .{});
        return ExecutionError.StaticStateChange;
    };
    
    // Get contract address
    const address = frame.contract.address;
    getLogger().debug("SSTORE address: {}", .{address});
    
    // Get the current value from state
    // TODO: This is using the simplified StateManager which doesn't support EIP-2929
    
    // Import the StateManager module to access types
    const SM = @import("state_manager");
    
    // Convert address to B160
    const addr_b160 = SM.B160{ .bytes = address };
    
    // Convert key to B256
    const key_b256 = SM.B256{ .bytes = key.bytes };
    
    const storage_bytes = try state_manager.getContractStorage(addr_b160, key_b256);
    
    // Convert storage bytes to B256
    var current_value_bytes: [32]u8 = [_]u8{0} ** 32;
    if (storage_bytes.len > 0) {
        const copy_len = @min(storage_bytes.len, 32);
        @memcpy(current_value_bytes[32 - copy_len..], storage_bytes[0..copy_len]);
    }
    const current_value = B256{ .bytes = current_value_bytes };
    
    // For now, assume first access is always cold
    const addr_was_cold = true;
    const slot_was_cold = true;
    
    // Convert current_value B256 to u256 for comparison
    var current_value_u256: u256 = 0;
    for (0..32) |j| {
        current_value_u256 = (current_value_u256 << 8) | current_value.bytes[j];
    }
    
    getLogger().debug("Current value at storage slot: 0x{x}", .{current_value_u256});
    
    // Check if the slot is warm or cold for gas calculation
    const cold_access_cost: u64 = if (slot_was_cold) jumpTableModule.ColdSloadCost else 0;
    getLogger().debug("Storage slot access: addr_cold={}, slot_cold={}, cold_cost={d}", .{addr_was_cold, slot_was_cold, cold_access_cost});
    
    // Track original value for EIP-2200 gas calculations
    // This ensures we track the value at the start of the transaction
    frame.contract.trackOriginalStorageValue(key_u256, current_value_u256);
    
    // Calculate gas cost based on EIP-2200 (Istanbul net gas metering)
    var gas_cost: u64 = 0;
    
    if (value_u256 == current_value_u256) {
        // No change, minimal gas (warm access)
        gas_cost = jumpTableModule.WarmStorageReadCost; // 100 gas per EIP-2929
        getLogger().debug("SSTORE gas: No change case, minimal gas cost", .{});
    } else {
        // Need to calculate full gas cost based on value changes
        if (current_value_u256 == 0) {
            // Setting a zero slot to non-zero
            gas_cost = jumpTableModule.SstoreSetGas;
            getLogger().debug("SSTORE gas: Setting zero slot to non-zero (SstoreSetGas)", .{});
        } else {
            if (value_u256 == 0) {
                // Clearing a slot (refund will be added in the execution function)
                gas_cost = jumpTableModule.SstoreClearGas;
                getLogger().debug("SSTORE gas: Clearing non-zero slot (SstoreClearGas)", .{});
                
                // Note: We don't add refunds here in the gas calculation function
                // Refunds are handled in the execution function
            } else {
                // Modifying an existing non-zero value
                gas_cost = jumpTableModule.SstoreResetGas;
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
    
    // Now handle storage refunds according to EIP-2200
    
    // Get the original value (from the start of the transaction)
    const original_value = frame.contract.getOriginalStorageValue(key_u256, current_value_u256);
    getLogger().debug("Original value (from tx start): 0x{x}", .{original_value});
    
    // EIP-2200 refund logic
    if (current_value_u256 != value_u256) {
        getLogger().debug("Processing EIP-2200 refund logic", .{});
        
        if (original_value != 0) {
            // If we're restoring the original value (clearing a dirty slot)
            if (original_value == value_u256 and current_value_u256 != value_u256) {
                // Refund for restoring original value
                const refund_amount = jumpTableModule.SstoreResetGas - jumpTableModule.SstoreClearGas;
                frame.contract.addGasRefund(refund_amount);
                getLogger().debug("Added refund for restoring original value: {d}", .{refund_amount});
            } else if (original_value == current_value_u256 and value_u256 == 0) {
                // We're clearing a slot that was also cleared during this execution
                // This means we need to remove the previous refund given for clearing
                // (avoiding double refunds)
                frame.contract.subGasRefund(jumpTableModule.SstoreRefundGas);
                getLogger().debug("Removed previous refund to avoid double refund: {d}", 
                                 .{jumpTableModule.SstoreRefundGas});
            }
        }
        
        // Standard refund for clearing a slot (2900 gas)
        if (current_value_u256 != 0 and value_u256 == 0) {
            frame.contract.addGasRefund(jumpTableModule.SstoreRefundGas);
            getLogger().debug("Added standard refund for clearing slot: {d}", 
                             .{jumpTableModule.SstoreRefundGas});
        }
    } else {
        getLogger().debug("No value change, no refund processing needed", .{});
    }
    
    getLogger().debug("Current gas refund counter: {d}", .{frame.contract.gas_refund});
    
    // Update the storage
    var value_bytes_copy = value.bytes; // Create mutable copy
    try state_manager.putContractStorage(addr_b160, key_b256, &value_bytes_copy);
    getLogger().debug("Storage updated: key=0x{x}, value=0x{x}", .{key_u256, value_u256});
    
    return "";
}

// TODO: Implement transient storage in StateManager first
// TLOAD and TSTORE operations are commented out until transient storage is implemented

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
fn bytesTou256(bytes: []const u8) u256 {
    var scoped = createScopedLogger(getLogger(), "bytesTou256()");
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

/// Register storage opcodes in the jump table
pub fn registerStorageOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // SLOAD (0x54)
    const sload_op = try allocator.create(Operation);
    sload_op.* = Operation{
        .execute = opSload,
        .constant_gas = jumpTableModule.WarmStorageReadCost,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
    };
    jump_table.table[0x54] = sload_op;
    
    // SSTORE (0x55)
    const sstore_op = try allocator.create(Operation);
    sstore_op.* = Operation{
        .execute = opSstore,
        .constant_gas = 0, // Dynamic gas calculation
        .min_stack = jumpTableModule.minStack(2, 0),
        .max_stack = jumpTableModule.maxStack(2, 0),
    };
    jump_table.table[0x55] = sstore_op;
    
    // TODO: Add TLOAD (0x5C) and TSTORE (0x5D) when transient storage is implemented
}

// Tests
const testing = std.testing;

test "storage opcodes - placeholder test" {
    // TODO: Add comprehensive tests for storage opcodes functionality
    // This is a placeholder to ensure the test runs
    try testing.expect(true);
}