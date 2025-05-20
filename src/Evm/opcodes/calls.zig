const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;
const JumpTable = @import("../JumpTable.zig");
const keccak256 = @import("../../Utils/keccak256.zig").keccak256;
const Address = @import("../../Address/address.zig").Address;
const precompile = @import("../precompile/Precompiles.zig");
const EvmLogger = @import("../EvmLogger.zig").EvmLogger;
const createLogger = @import("../EvmLogger.zig").createLogger;

// Create a file-specific logger
const file_logger = createLogger("calls.zig");

/// Maximum call depth for Ethereum VM
const MAX_CALL_DEPTH: u32 = 1024;

/// Check if an address is a precompiled contract in the current chain context
/// Returns the precompiled contract if found, null otherwise
fn checkPrecompiled(addr: u256, interpreter: *Interpreter) ?*const precompile.PrecompiledContract {
    // Convert u256 address to Ethereum Address type
    var addr_bytes: [32]u8 = undefined;
    
    // Initialize with zeros
    std.mem.set(u8, &addr_bytes, 0);
    
    // Extract the last 20 bytes (Ethereum address size)
    var value = addr;
    var i: usize = 31;
    while (i >= 12) : (i -= 1) {
        addr_bytes[i] = @intCast(value & 0xFF);
        value >>= 8;
        
        // Stop if we've processed the lower 20 bytes
        if (i == 12) break;
    }
    
    // Extract the last 20 bytes for the Ethereum address
    var target_address: Address = undefined;
    @memcpy(&target_address, addr_bytes[12..32]);
    
    // Get precompiled contracts based on chain rules
    if (interpreter.evm.precompiles) |contracts| {
        // Check if this address is a precompiled contract
        if (contracts.get(target_address)) |contract| {
            file_logger.debug("Found precompiled contract at address 0x{x}", .{addr});
            return contract;
        }
    }
    
    return null;
}

/// Helper to convert 256-bit address to Ethereum Address type
fn addressFromU256(addr_u256: u256) Address {
    var addr_bytes: [32]u8 = undefined;
    
    // Initialize with zeros
    std.mem.set(u8, &addr_bytes, 0);
    
    // Extract the last 20 bytes (Ethereum address size)
    var value = addr_u256;
    var i: usize = 31;
    while (i >= 12) : (i -= 1) {
        addr_bytes[i] = @intCast(value & 0xFF);
        value >>= 8;
        
        // Stop if we've processed the lower 20 bytes
        if (i == 12) break;
    }
    
    // Extract the last 20 bytes for the Ethereum address
    var address: Address = undefined;
    @memcpy(&address, addr_bytes[12..32]);
    
    return address;
}

/// CALL (0xF1) - Call contract
pub fn opCall(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Stack: gas, address, value, inOffset, inSize, outOffset, outSize
    if (frame.stack.size < 7) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop parameters from stack
    const outSize = try frame.stack.pop();
    const outOffset = try frame.stack.pop();
    const inSize = try frame.stack.pop();
    const inOffset = try frame.stack.pop();
    const value = try frame.stack.pop();
    const to_addr = try frame.stack.pop();
    const gas = try frame.stack.pop();
    
    // Validate stack space for the return value
    if (frame.stack.size >= frame.stack.capacity) {
        return ExecutionError.StackOverflow;
    }
    
    // Check for static call violation when value > 0
    if (interpreter.readOnly and value > 0) {
        return ExecutionError.StaticStateChange;
    }
    
    // Check call depth to prevent stack overflow attacks
    if (interpreter.callDepth >= MAX_CALL_DEPTH) {
        // Push 0 to the stack (call failed) and return
        try frame.stack.push(0);
        return "";
    }
    
    var gas_cost = gas;

    // Ensure there's enough gas for the call
    if (frame.gas < gas_cost) {
        // If not enough gas, just push 0 (failure) and continue
        try frame.stack.push(0);
        return "";
    }

    // Prepare input from memory
    const in_size_usize = if (inSize > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(inSize));
    const in_offset_usize = if (inOffset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(inOffset));
    
    // Ensure memory access is within bounds
    try frame.memory.require(in_offset_usize, in_size_usize);
    
    // Prepare output memory area
    const out_size_usize = if (outSize > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(outSize));
    const out_offset_usize = if (outOffset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(outOffset));
    
    if (out_size_usize > 0) {
        try frame.memory.require(out_offset_usize, out_size_usize);
    }
    
    // Get the input data
    var input_data = std.ArrayList(u8).init(interpreter.allocator);
    defer input_data.deinit();
    
    if (in_size_usize > 0) {
        const mem = frame.memory.data();
        if (in_offset_usize + in_size_usize <= mem.len) {
            try input_data.appendSlice(mem[in_offset_usize..in_offset_usize + in_size_usize]);
        } else {
            return ExecutionError.OutOfOffset;
        }
    }
    
    // Log the call if we have a logger
    if (frame.logger) |logger| {
        logger.debug("CALL: to_addr={x}, value={}, gas={}", .{ to_addr, value, gas });
    }
    
    // Check if this is a call to a precompiled contract
    var success: bool = false;
    var return_data = std.ArrayList(u8).init(interpreter.allocator);
    defer return_data.deinit();
    
    // Check for precompiled contracts
    if (checkPrecompiled(to_addr, interpreter)) |contract| {
        // Execute precompiled contract
        file_logger.debug("Executing precompiled contract at address: 0x{x}", .{to_addr});
        
        // Cap gas to the remaining gas in the frame
        const capped_gas = @min(gas_cost, frame.gas);
        
        // Run the precompiled contract
        const result = precompile.runPrecompiledContract(
            contract,
            input_data.items,
            capped_gas,
            interpreter.allocator,
            &frame.logger
        ) catch |err| {
            file_logger.err("Precompiled contract execution failed: {}", .{err});
            
            // Push 0 to the stack to indicate failure
            try frame.stack.push(0);
            return "";
        };
        
        // Update gas used
        const gas_used = capped_gas - result.remaining_gas;
        frame.gas -= gas_used;
        
        // Process the result
        if (result.output) |output| {
            success = true;
            
            // Store the output in return data for future use
            try return_data.appendSlice(output);
            
            // Update the caller's memory with the return data
            if (out_size_usize > 0) {
                const memory_data = frame.memory.data();
                const copy_size = @min(out_size_usize, output.len);
                
                for (0..copy_size) |i| {
                    if (out_offset_usize + i < memory_data.len) {
                        memory_data[out_offset_usize + i] = output[i];
                    }
                }
                
                // Zero out any remaining output memory area
                for (copy_size..out_size_usize) |i| {
                    if (out_offset_usize + i < memory_data.len) {
                        memory_data[out_offset_usize + i] = 0;
                    }
                }
            }
            
            // Free the output if it was allocated
            interpreter.allocator.free(output);
        } else {
            // No output, but not necessarily a failure
            success = true;
        }
    } else {
        // Regular contract call (not precompiled)
        // In a real implementation, we would:
        // 1. Create a new call frame
        // 2. Run the call
        // 3. Process the result
        
        // For now, we'll simulate a basic call
        success = true; // Default to true for this stub
        
        // Deduct used gas from current frame
        frame.gas -= gas_cost;
        
        // Write the return data to memory if the call was successful
        if (success and out_size_usize > 0) {
            // In a real implementation, we would copy the actual return data
            // For now, just zero out the memory region
            const memory_data = frame.memory.data();
            for (out_offset_usize..out_offset_usize + out_size_usize) |i| {
                if (i < memory_data.len) {
                    memory_data[i] = 0;
                }
            }
        }
    }
    
    // Save return data for later retrieval with RETURNDATACOPY
    if (interpreter.returnData) |old_data| {
        interpreter.allocator.free(old_data);
        interpreter.returnData = null;
    }
    
    if (return_data.items.len > 0) {
        const return_copy = try interpreter.allocator.alloc(u8, return_data.items.len);
        @memcpy(return_copy, return_data.items);
        interpreter.returnData = return_copy;
    }
    
    // Push result to stack (1 for success, 0 for failure)
    try frame.stack.push(if (success) 1 else 0);
    
    return "";
}

/// CALLCODE (0xF2) - Call code from another account
pub fn opCallCode(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Stack: gas, address, value, inOffset, inSize, outOffset, outSize
    if (frame.stack.size < 7) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop parameters from stack
    const outSize = try frame.stack.pop();
    const outOffset = try frame.stack.pop();
    const inSize = try frame.stack.pop();
    const inOffset = try frame.stack.pop();
    const value = try frame.stack.pop();
    const to_addr = try frame.stack.pop();
    const gas = try frame.stack.pop();
    
    // Validate stack space for the return value
    if (frame.stack.size >= frame.stack.capacity) {
        return ExecutionError.StackOverflow;
    }
    
    // Check call depth to prevent stack overflow attacks
    if (interpreter.callDepth >= MAX_CALL_DEPTH) {
        // Push 0 to the stack (call failed) and return
        try frame.stack.push(0);
        return "";
    }
    
    var gas_cost = gas;

    // Ensure there's enough gas for the call
    if (frame.gas < gas_cost) {
        // If not enough gas, just push 0 (failure) and continue
        try frame.stack.push(0);
        return "";
    }

    // Prepare input from memory
    const in_size_usize = if (inSize > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(inSize));
    const in_offset_usize = if (inOffset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(inOffset));
    
    // Ensure memory access is within bounds
    try frame.memory.require(in_offset_usize, in_size_usize);
    
    // Prepare output memory area
    const out_size_usize = if (outSize > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(outSize));
    const out_offset_usize = if (outOffset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(outOffset));
    
    if (out_size_usize > 0) {
        try frame.memory.require(out_offset_usize, out_size_usize);
    }
    
    // Get the input data
    var input_data = std.ArrayList(u8).init(interpreter.allocator);
    defer input_data.deinit();
    
    if (in_size_usize > 0) {
        const mem = frame.memory.data();
        if (in_offset_usize + in_size_usize <= mem.len) {
            try input_data.appendSlice(mem[in_offset_usize..in_offset_usize + in_size_usize]);
        } else {
            return ExecutionError.OutOfOffset;
        }
    }
    
    // Log the callcode if we have a logger
    if (frame.logger) |logger| {
        logger.debug("CALLCODE: to_addr={x}, value={}, gas={}", .{ to_addr, value, gas });
    }
    
    // In a real implementation, we would:
    // 1. Create a new call frame with the target's code but the current context (sender, value, etc.)
    // 2. Run the call
    // 3. Process the result
    
    // For now, we'll simulate a basic call
    var success: bool = true; // Default to true for this stub
    var return_data = std.ArrayList(u8).init(interpreter.allocator);
    defer return_data.deinit();
    
    // Deduct used gas from current frame
    frame.gas -= gas_cost;
    
    // Write the return data to memory if the call was successful
    if (success and out_size_usize > 0) {
        // In a real implementation, we would copy the actual return data
        // For now, just zero out the memory region
        const memory_data = frame.memory.data();
        for (out_offset_usize..out_offset_usize + out_size_usize) |i| {
            if (i < memory_data.len) {
                memory_data[i] = 0;
            }
        }
    }
    
    // Push result to stack (1 for success, 0 for failure)
    try frame.stack.push(if (success) 1 else 0);
    
    return "";
}

/// DELEGATECALL (0xF4) - Message-call into this account with an alternative account's code
pub fn opDelegateCall(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Stack: gas, address, inOffset, inSize, outOffset, outSize
    if (frame.stack.size < 6) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop parameters from stack
    const outSize = try frame.stack.pop();
    const outOffset = try frame.stack.pop();
    const inSize = try frame.stack.pop();
    const inOffset = try frame.stack.pop();
    const to_addr = try frame.stack.pop();
    const gas = try frame.stack.pop();
    
    // Validate stack space for the return value
    if (frame.stack.size >= frame.stack.capacity) {
        return ExecutionError.StackOverflow;
    }
    
    // Check call depth to prevent stack overflow attacks
    if (interpreter.callDepth >= MAX_CALL_DEPTH) {
        // Push 0 to the stack (call failed) and return
        try frame.stack.push(0);
        return "";
    }
    
    var gas_cost = gas;

    // Ensure there's enough gas for the call
    if (frame.gas < gas_cost) {
        // If not enough gas, just push 0 (failure) and continue
        try frame.stack.push(0);
        return "";
    }

    // Prepare input from memory
    const in_size_usize = if (inSize > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(inSize));
    const in_offset_usize = if (inOffset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(inOffset));
    
    // Ensure memory access is within bounds
    try frame.memory.require(in_offset_usize, in_size_usize);
    
    // Prepare output memory area
    const out_size_usize = if (outSize > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(outSize));
    const out_offset_usize = if (outOffset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(outOffset));
    
    if (out_size_usize > 0) {
        try frame.memory.require(out_offset_usize, out_size_usize);
    }
    
    // Get the input data
    var input_data = std.ArrayList(u8).init(interpreter.allocator);
    defer input_data.deinit();
    
    if (in_size_usize > 0) {
        const mem = frame.memory.data();
        if (in_offset_usize + in_size_usize <= mem.len) {
            try input_data.appendSlice(mem[in_offset_usize..in_offset_usize + in_size_usize]);
        } else {
            return ExecutionError.OutOfOffset;
        }
    }
    
    // Log the delegatecall if we have a logger
    if (frame.logger) |logger| {
        logger.debug("DELEGATECALL: to_addr={x}, gas={}", .{ to_addr, gas });
    }
    
    // In a real implementation, we would:
    // 1. Create a new call frame with the target's code but preserving the sender, value, etc.
    // 2. Run the call
    // 3. Process the result
    
    // For now, we'll simulate a basic call
    var success: bool = true; // Default to true for this stub
    var return_data = std.ArrayList(u8).init(interpreter.allocator);
    defer return_data.deinit();
    
    // Deduct used gas from current frame
    frame.gas -= gas_cost;
    
    // Write the return data to memory if the call was successful
    if (success and out_size_usize > 0) {
        // In a real implementation, we would copy the actual return data
        // For now, just zero out the memory region
        const memory_data = frame.memory.data();
        for (out_offset_usize..out_offset_usize + out_size_usize) |i| {
            if (i < memory_data.len) {
                memory_data[i] = 0;
            }
        }
    }
    
    // Push result to stack (1 for success, 0 for failure)
    try frame.stack.push(if (success) 1 else 0);
    
    return "";
}

/// STATICCALL (0xFA) - Static message-call into an account
pub fn opStaticCall(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Stack: gas, address, inOffset, inSize, outOffset, outSize
    if (frame.stack.size < 6) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop parameters from stack
    const outSize = try frame.stack.pop();
    const outOffset = try frame.stack.pop();
    const inSize = try frame.stack.pop();
    const inOffset = try frame.stack.pop();
    const to_addr = try frame.stack.pop();
    const gas = try frame.stack.pop();
    
    // Validate stack space for the return value
    if (frame.stack.size >= frame.stack.capacity) {
        return ExecutionError.StackOverflow;
    }
    
    // Check call depth to prevent stack overflow attacks
    if (interpreter.callDepth >= MAX_CALL_DEPTH) {
        // Push 0 to the stack (call failed) and return
        try frame.stack.push(0);
        return "";
    }
    
    var gas_cost = gas;

    // Ensure there's enough gas for the call
    if (frame.gas < gas_cost) {
        // If not enough gas, just push 0 (failure) and continue
        try frame.stack.push(0);
        return "";
    }

    // Prepare input from memory
    const in_size_usize = if (inSize > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(inSize));
    const in_offset_usize = if (inOffset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(inOffset));
    
    // Ensure memory access is within bounds
    try frame.memory.require(in_offset_usize, in_size_usize);
    
    // Prepare output memory area
    const out_size_usize = if (outSize > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(outSize));
    const out_offset_usize = if (outOffset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(outOffset));
    
    if (out_size_usize > 0) {
        try frame.memory.require(out_offset_usize, out_size_usize);
    }
    
    // Get the input data
    var input_data = std.ArrayList(u8).init(interpreter.allocator);
    defer input_data.deinit();
    
    if (in_size_usize > 0) {
        const mem = frame.memory.data();
        if (in_offset_usize + in_size_usize <= mem.len) {
            try input_data.appendSlice(mem[in_offset_usize..in_offset_usize + in_size_usize]);
        } else {
            return ExecutionError.OutOfOffset;
        }
    }
    
    // Log the staticcall if we have a logger
    if (frame.logger) |logger| {
        logger.debug("STATICCALL: to_addr={x}, gas={}", .{ to_addr, gas });
    }
    
    // Check if this is a call to a precompiled contract
    var success: bool = false;
    var return_data = std.ArrayList(u8).init(interpreter.allocator);
    defer return_data.deinit();
    
    // Set read-only flag for static call
    const prevReadOnly = interpreter.readOnly;
    interpreter.readOnly = true;
    defer interpreter.readOnly = prevReadOnly;
    
    // Check for precompiled contracts
    if (checkPrecompiled(to_addr, interpreter)) |contract| {
        // Execute precompiled contract
        file_logger.debug("Executing precompiled contract at address: 0x{x} in static context", .{to_addr});
        
        // Cap gas to the remaining gas in the frame
        const capped_gas = @min(gas_cost, frame.gas);
        
        // Run the precompiled contract
        const result = precompile.runPrecompiledContract(
            contract,
            input_data.items,
            capped_gas,
            interpreter.allocator,
            &frame.logger
        ) catch |err| {
            file_logger.err("Precompiled contract static execution failed: {}", .{err});
            
            // Push 0 to the stack to indicate failure
            try frame.stack.push(0);
            return "";
        };
        
        // Update gas used
        const gas_used = capped_gas - result.remaining_gas;
        frame.gas -= gas_used;
        
        // Process the result
        if (result.output) |output| {
            success = true;
            
            // Store the output in return data for future use
            try return_data.appendSlice(output);
            
            // Update the caller's memory with the return data
            if (out_size_usize > 0) {
                const memory_data = frame.memory.data();
                const copy_size = @min(out_size_usize, output.len);
                
                for (0..copy_size) |i| {
                    if (out_offset_usize + i < memory_data.len) {
                        memory_data[out_offset_usize + i] = output[i];
                    }
                }
                
                // Zero out any remaining output memory area
                for (copy_size..out_size_usize) |i| {
                    if (out_offset_usize + i < memory_data.len) {
                        memory_data[out_offset_usize + i] = 0;
                    }
                }
            }
            
            // Free the output if it was allocated
            interpreter.allocator.free(output);
        } else {
            // No output, but not necessarily a failure
            success = true;
        }
    } else {
        // Regular staticcall (not precompiled)
        // In a real implementation, we would:
        // 1. Create a new call frame with readOnly = true
        // 2. Run the call
        // 3. Process the result
        
        // For now, we'll simulate a basic call
        success = true; // Default to true for this stub
        
        // Deduct used gas from current frame
        frame.gas -= gas_cost;
        
        // Write the return data to memory if the call was successful
        if (success and out_size_usize > 0) {
            // In a real implementation, we would copy the actual return data
            // For now, just zero out the memory region
            const memory_data = frame.memory.data();
            for (out_offset_usize..out_offset_usize + out_size_usize) |i| {
                if (i < memory_data.len) {
                    memory_data[i] = 0;
                }
            }
        }
    }
    
    // Save return data for later retrieval with RETURNDATACOPY
    if (interpreter.returnData) |old_data| {
        interpreter.allocator.free(old_data);
        interpreter.returnData = null;
    }
    
    if (return_data.items.len > 0) {
        const return_copy = try interpreter.allocator.alloc(u8, return_data.items.len);
        @memcpy(return_copy, return_data.items);
        interpreter.returnData = return_copy;
    }
    
    // Push result to stack (1 for success, 0 for failure)
    try frame.stack.push(if (success) 1 else 0);
    
    return "";
}

/// CREATE (0xF0) - Create a new account with associated code
pub fn opCreate(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Stack: value, offset, size
    if (frame.stack.size < 3) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop parameters from stack
    const size = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const value = try frame.stack.pop();
    
    // Validate stack space for the return value (new contract address)
    if (frame.stack.size >= frame.stack.capacity) {
        return ExecutionError.StackOverflow;
    }
    
    // Check if we're in a static call (can't modify state)
    if (interpreter.readOnly) {
        return ExecutionError.StaticStateChange;
    }
    
    // Check call depth to prevent stack overflow attacks
    if (interpreter.callDepth >= MAX_CALL_DEPTH) {
        // Push 0 to the stack (call failed) and return
        try frame.stack.push(0);
        return "";
    }
    
    // Prepare code from memory
    const size_usize = if (size > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(size));
    const offset_usize = if (offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(offset));
    
    // Ensure memory access is within bounds
    try frame.memory.require(offset_usize, size_usize);
    
    // Get the contract code
    var contract_code = std.ArrayList(u8).init(interpreter.allocator);
    defer contract_code.deinit();
    
    if (size_usize > 0) {
        const mem = frame.memory.data();
        if (offset_usize + size_usize <= mem.len) {
            try contract_code.appendSlice(mem[offset_usize..offset_usize + size_usize]);
        } else {
            return ExecutionError.OutOfOffset;
        }
    }
    
    // Log the create if we have a logger
    if (frame.logger) |logger| {
        logger.debug("CREATE: value={}, code_size={}", .{ value, size_usize });
    }
    
    // In a real implementation, we would:
    // 1. Calculate the new contract address
    // 2. Create a new contract with the provided code
    // 3. Execute the contract's constructor
    // 4. Return the new contract address
    
    // For now, we'll simulate a basic create
    var success: bool = true; // Default to true for this stub
    
    var contract_addr: u256 = 0;
    if (success) {
        // In a real implementation, we would return the actual contract address
        // For now, just return a fake address
        contract_addr = 0x1234;
    }
    
    // Push result to stack (contract address or 0 for failure)
    try frame.stack.push(if (success) contract_addr else 0);
    
    return "";
}

/// CREATE2 (0xF5) - Create a new account with associated code at a predictable address
pub fn opCreate2(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // Stack: value, offset, size, salt
    if (frame.stack.size < 4) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop parameters from stack
    const salt = try frame.stack.pop();
    const size = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const value = try frame.stack.pop();
    
    // Validate stack space for the return value (new contract address)
    if (frame.stack.size >= frame.stack.capacity) {
        return ExecutionError.StackOverflow;
    }
    
    // Check if we're in a static call (can't modify state)
    if (interpreter.readOnly) {
        return ExecutionError.StaticStateChange;
    }
    
    // Check call depth to prevent stack overflow attacks
    if (interpreter.callDepth >= MAX_CALL_DEPTH) {
        // Push 0 to the stack (call failed) and return
        try frame.stack.push(0);
        return "";
    }
    
    // Prepare code from memory
    const size_usize = if (size > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(size));
    const offset_usize = if (offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(offset));
    
    // Ensure memory access is within bounds
    try frame.memory.require(offset_usize, size_usize);
    
    // Get the contract code
    var contract_code = std.ArrayList(u8).init(interpreter.allocator);
    defer contract_code.deinit();
    
    if (size_usize > 0) {
        const mem = frame.memory.data();
        if (offset_usize + size_usize <= mem.len) {
            try contract_code.appendSlice(mem[offset_usize..offset_usize + size_usize]);
        } else {
            return ExecutionError.OutOfOffset;
        }
    }
    
    // Log the create2 if we have a logger
    if (frame.logger) |logger| {
        logger.debug("CREATE2: value={}, code_size={}, salt={x}", .{ value, size_usize, salt });
    }
    
    // In a real implementation, we would:
    // 1. Calculate the new contract address using keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))
    // 2. Create a new contract with the provided code
    // 3. Execute the contract's constructor
    // 4. Return the new contract address
    
    // For now, we'll simulate a basic create2
    var success: bool = true; // Default to true for this stub
    
    var contract_addr: u256 = 0;
    if (success) {
        // In a real implementation, we would calculate and return the actual contract address
        // For now, just return a fake address
        contract_addr = 0x5678;
    }
    
    // Push result to stack (contract address or 0 for failure)
    try frame.stack.push(if (success) contract_addr else 0);
    
    return "";
}

/// Calculate memory size required for call operations
pub fn getCallMemorySize(stack: *const JumpTable.Stack, memory: *const JumpTable.Memory) JumpTable.MemorySizeFunc.ReturnType {
    _ = memory;
    
    // For CALL and CALLCODE, we need at least 7 items on the stack
    if (stack.size < 7) {
        return .{ .size = 0, .overflow = false };
    }
    
    // Get input offset, input size, output offset, output size from stack
    // For CALL: input offset at stack.size - 4, input size at stack.size - 3,
    // output offset at stack.size - 2, output size at stack.size - 1
    const in_offset = stack.data[stack.size - 4];
    const in_size = stack.data[stack.size - 3];
    const out_offset = stack.data[stack.size - 2];
    const out_size = stack.data[stack.size - 1];
    
    // Calculate memory needed for input
    var mem_size: usize = 0;
    
    if (in_size > 0) {
        const in_offset_usize = if (in_offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(in_offset));
        const in_size_usize = if (in_size > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(in_size));
        
        const in_end_pos = in_offset_usize + in_size_usize;
        if (in_end_pos < in_offset_usize) {
            return .{ .size = 0, .overflow = true };
        }
        
        mem_size = in_end_pos;
    }
    
    // Calculate memory needed for output
    if (out_size > 0) {
        const out_offset_usize = if (out_offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(out_offset));
        const out_size_usize = if (out_size > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(out_size));
        
        const out_end_pos = out_offset_usize + out_size_usize;
        if (out_end_pos < out_offset_usize) {
            return .{ .size = 0, .overflow = true };
        }
        
        if (out_end_pos > mem_size) {
            mem_size = out_end_pos;
        }
    }
    
    return .{ .size = mem_size, .overflow = false };
}

/// Calculate memory size required for delegate call and static call operations
pub fn getDelegateCallMemorySize(stack: *const JumpTable.Stack, memory: *const JumpTable.Memory) JumpTable.MemorySizeFunc.ReturnType {
    _ = memory;
    
    // For DELEGATECALL and STATICCALL, we need at least 6 items on the stack
    if (stack.size < 6) {
        return .{ .size = 0, .overflow = false };
    }
    
    // Get input offset, input size, output offset, output size from stack
    // For DELEGATECALL: input offset at stack.size - 4, input size at stack.size - 3,
    // output offset at stack.size - 2, output size at stack.size - 1
    const in_offset = stack.data[stack.size - 4];
    const in_size = stack.data[stack.size - 3];
    const out_offset = stack.data[stack.size - 2];
    const out_size = stack.data[stack.size - 1];
    
    // Calculate memory needed for input
    var mem_size: usize = 0;
    
    if (in_size > 0) {
        const in_offset_usize = if (in_offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(in_offset));
        const in_size_usize = if (in_size > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(in_size));
        
        const in_end_pos = in_offset_usize + in_size_usize;
        if (in_end_pos < in_offset_usize) {
            return .{ .size = 0, .overflow = true };
        }
        
        mem_size = in_end_pos;
    }
    
    // Calculate memory needed for output
    if (out_size > 0) {
        const out_offset_usize = if (out_offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(out_offset));
        const out_size_usize = if (out_size > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(out_size));
        
        const out_end_pos = out_offset_usize + out_size_usize;
        if (out_end_pos < out_offset_usize) {
            return .{ .size = 0, .overflow = true };
        }
        
        if (out_end_pos > mem_size) {
            mem_size = out_end_pos;
        }
    }
    
    return .{ .size = mem_size, .overflow = false };
}

/// Calculate memory size required for create operations
pub fn getCreateMemorySize(stack: *const JumpTable.Stack, memory: *const JumpTable.Memory) JumpTable.MemorySizeFunc.ReturnType {
    _ = memory;
    
    // For CREATE and CREATE2, we need at least 3 items on the stack (4 for CREATE2)
    if (stack.size < 3) {
        return .{ .size = 0, .overflow = false };
    }
    
    // Get offset and size from stack
    // For CREATE: offset at stack.size - 2, size at stack.size - 1
    const offset = stack.data[stack.size - 2];
    const size = stack.data[stack.size - 1];
    
    // If size is 0, no memory expansion needed
    if (size == 0) {
        return .{ .size = 0, .overflow = false };
    }
    
    // Sanity check size to prevent excessive memory usage
    if (size > std.math.maxInt(usize)) {
        return .{ .size = 0, .overflow = true };
    }
    
    // Calculate the size needed
    const offset_usize = if (offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(offset));
    const size_usize = @as(usize, @intCast(size));
    
    // Memory needed is offset + size
    const end_pos = offset_usize + size_usize;
    
    // Check for overflow
    if (end_pos < offset_usize) {
        return .{ .size = 0, .overflow = true };
    }
    
    return .{ .size = end_pos, .overflow = false };
}

/// Calculate gas cost for call operations
pub fn callGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    _ = interpreter;
    _ = frame;
    _ = stack;
    _ = memory;
    _ = requested_size;
    
    // For now, return a fixed gas cost
    // In a real implementation, this would calculate the dynamic gas cost
    // based on the call parameters, value transfer, memory expansion, etc.
    return JumpTable.CallGas;
}

/// Calculate gas cost for create operations
pub fn createGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    _ = interpreter;
    _ = frame;
    _ = stack;
    _ = memory;
    _ = requested_size;
    
    // For now, return a fixed gas cost
    // In a real implementation, this would calculate the dynamic gas cost
    // based on the create parameters, value, code size, memory expansion, etc.
    return JumpTable.CreateGas;
}

/// Register all call opcodes in the given jump table
pub fn registerCallOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // CALL (0xF1)
    const call_op = try allocator.create(JumpTable.Operation);
    call_op.* = JumpTable.Operation{
        .execute = opCall,
        .constant_gas = JumpTable.CallGas, // Base cost
        .dynamic_gas = callGas, // Complex gas calculation based on parameters
        .min_stack = JumpTable.minStack(7, 1),
        .max_stack = JumpTable.maxStack(7, 1),
        .memory_size = getCallMemorySize,
    };
    jump_table.table[0xF1] = call_op;
    
    // CALLCODE (0xF2)
    const callcode_op = try allocator.create(JumpTable.Operation);
    callcode_op.* = JumpTable.Operation{
        .execute = opCallCode,
        .constant_gas = JumpTable.CallGas, // Base cost
        .dynamic_gas = callGas, // Complex gas calculation based on parameters
        .min_stack = JumpTable.minStack(7, 1),
        .max_stack = JumpTable.maxStack(7, 1),
        .memory_size = getCallMemorySize,
    };
    jump_table.table[0xF2] = callcode_op;
    
    // DELEGATECALL (0xF4)
    const delegatecall_op = try allocator.create(JumpTable.Operation);
    delegatecall_op.* = JumpTable.Operation{
        .execute = opDelegateCall,
        .constant_gas = JumpTable.CallGas, // Base cost
        .dynamic_gas = callGas, // Complex gas calculation based on parameters
        .min_stack = JumpTable.minStack(6, 1),
        .max_stack = JumpTable.maxStack(6, 1),
        .memory_size = getDelegateCallMemorySize,
    };
    jump_table.table[0xF4] = delegatecall_op;
    
    // STATICCALL (0xFA)
    const staticcall_op = try allocator.create(JumpTable.Operation);
    staticcall_op.* = JumpTable.Operation{
        .execute = opStaticCall,
        .constant_gas = JumpTable.CallGas, // Base cost
        .dynamic_gas = callGas, // Complex gas calculation based on parameters
        .min_stack = JumpTable.minStack(6, 1),
        .max_stack = JumpTable.maxStack(6, 1),
        .memory_size = getDelegateCallMemorySize,
    };
    jump_table.table[0xFA] = staticcall_op;
    
    // CREATE (0xF0)
    const create_op = try allocator.create(JumpTable.Operation);
    create_op.* = JumpTable.Operation{
        .execute = opCreate,
        .constant_gas = JumpTable.CreateGas, // Base cost
        .dynamic_gas = createGas, // Complex gas calculation based on parameters
        .min_stack = JumpTable.minStack(3, 1),
        .max_stack = JumpTable.maxStack(3, 1),
        .memory_size = getCreateMemorySize,
    };
    jump_table.table[0xF0] = create_op;
    
    // CREATE2 (0xF5)
    const create2_op = try allocator.create(JumpTable.Operation);
    create2_op.* = JumpTable.Operation{
        .execute = opCreate2,
        .constant_gas = JumpTable.CreateGas, // Base cost
        .dynamic_gas = createGas, // Complex gas calculation based on parameters
        .min_stack = JumpTable.minStack(4, 1),
        .max_stack = JumpTable.maxStack(4, 1),
        .memory_size = getCreateMemorySize,
    };
    jump_table.table[0xF5] = create2_op;
}

// Basic test for call operations
test "Calls basic operations" {
    const testing = std.testing;
    
    // Create a test allocator
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Create a new jumptable
    var jt = JumpTable.JumpTable.init();
    
    // Register call opcodes
    try registerCallOpcodes(allocator, &jt);
    
    // Verify the opcode entries
    try testing.expectEqual(false, jt.table[0xF0] == null); // CREATE
    try testing.expectEqual(false, jt.table[0xF1] == null); // CALL
    try testing.expectEqual(false, jt.table[0xF2] == null); // CALLCODE
    try testing.expectEqual(false, jt.table[0xF4] == null); // DELEGATECALL
    try testing.expectEqual(false, jt.table[0xF5] == null); // CREATE2
    try testing.expectEqual(false, jt.table[0xFA] == null); // STATICCALL
    
    // Verify gas costs
    try testing.expectEqual(JumpTable.CreateGas, jt.table[0xF0].?.constant_gas); // CREATE
    try testing.expectEqual(JumpTable.CallGas, jt.table[0xF1].?.constant_gas); // CALL
    try testing.expectEqual(JumpTable.CallGas, jt.table[0xF2].?.constant_gas); // CALLCODE
    try testing.expectEqual(JumpTable.CallGas, jt.table[0xF4].?.constant_gas); // DELEGATECALL
    try testing.expectEqual(JumpTable.CreateGas, jt.table[0xF5].?.constant_gas); // CREATE2
    try testing.expectEqual(JumpTable.CallGas, jt.table[0xFA].?.constant_gas); // STATICCALL
    
    // Verify min/max stack
    try testing.expectEqual(@as(u32, 3), jt.table[0xF0].?.min_stack); // CREATE
    try testing.expectEqual(@as(u32, 7), jt.table[0xF1].?.min_stack); // CALL
    try testing.expectEqual(@as(u32, 7), jt.table[0xF2].?.min_stack); // CALLCODE
    try testing.expectEqual(@as(u32, 6), jt.table[0xF4].?.min_stack); // DELEGATECALL
    try testing.expectEqual(@as(u32, 4), jt.table[0xF5].?.min_stack); // CREATE2
    try testing.expectEqual(@as(u32, 6), jt.table[0xFA].?.min_stack); // STATICCALL
    
    // Verify memory size functions are set
    try testing.expectEqual(true, jt.table[0xF0].?.memory_size != null); // CREATE
    try testing.expectEqual(true, jt.table[0xF1].?.memory_size != null); // CALL
    try testing.expectEqual(true, jt.table[0xF2].?.memory_size != null); // CALLCODE
    try testing.expectEqual(true, jt.table[0xF4].?.memory_size != null); // DELEGATECALL
    try testing.expectEqual(true, jt.table[0xF5].?.memory_size != null); // CREATE2
    try testing.expectEqual(true, jt.table[0xFA].?.memory_size != null); // STATICCALL
}

// Test precompiled contract detection and address conversion
test "Precompiled contract address detection" {
    const testing = std.testing;
    
    // We'll just test our address conversion code to ensure it works
    // Create some test addresses
    
    // Address 0x01 (ECRECOVER precompile)
    const ecrecover_addr: u256 = 1;
    const ecrecover_eth = addressFromU256(ecrecover_addr);
    
    try testing.expectEqualSlices(u8, 
        &[_]u8{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1}, 
        &ecrecover_eth
    );
    
    // Address 0x05 (MODEXP precompile)
    const modexp_addr: u256 = 5;
    const modexp_eth = addressFromU256(modexp_addr);
    
    try testing.expectEqualSlices(u8, 
        &[_]u8{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5}, 
        &modexp_eth
    );
    
    // A larger address to test conversion
    const addr: u256 = 0x1234567890123456789012345678901234567890;
    const eth_addr = addressFromU256(addr);
    
    try testing.expectEqualSlices(u8, 
        &[_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90, 
               0x12, 0x34, 0x56, 0x78, 0x90, 0x12, 0x34, 0x56, 0x78, 0x90}, 
        &eth_addr
    );
}