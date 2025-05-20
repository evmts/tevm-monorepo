// Fixed version of controlflow.zig that only depends on fixed_package_test.zig
const std = @import("std");
const pkg = @import("fixed_package_test.zig");
const Interpreter = pkg.Interpreter;
const Frame = pkg.Frame;
const ExecutionError = pkg.ExecutionError;
const JumpTable = pkg.JumpTable;
const U256 = pkg.@"u256";

/// STOP (0x00) - Halt execution
pub fn opStop(_: usize, _: *Interpreter, _: *Frame) ExecutionError![]const u8 {
    return ExecutionError.STOP;
}

/// JUMP (0x56) - Jump to a destination position in code
pub fn opJump(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    // Pop destination from the stack
    const dest = try frame.stack.pop();
    
    // Check if destination is negative or too large to fit in usize
    if (dest > std.math.maxInt(usize)) {
        return ExecutionError.InvalidJump;
    }
    
    // Convert to usize for indexing
    const dest_usize = @as(usize, @intCast(dest));
    
    // Check if destination is too large for the code
    if (dest_usize >= frame.contract.code.len) {
        return ExecutionError.InvalidJump;
    }
    
    // Check if destination is a JUMPDEST opcode
    const dest_opcode = frame.contract.code[dest_usize];
    if (dest_opcode != 0x5B) { // 0x5B is JUMPDEST
        return ExecutionError.InvalidJump;
    }
    
    // Set the program counter to the destination (minus 1 because the interpreter will increment after)
    frame.pc = dest_usize - 1;
    
    return "";
}

/// JUMPI (0x57) - Conditional jump
pub fn opJumpi(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    // Pop condition and destination from the stack
    const condition = try frame.stack.pop();
    const dest = try frame.stack.pop();
    
    // Only jump if condition is not zero
    if (condition != 0) {
        // Check if destination is negative or too large to fit in usize
        if (dest > std.math.maxInt(usize)) {
            return ExecutionError.InvalidJump;
        }
        
        // Convert to usize for indexing
        const dest_usize = @as(usize, @intCast(dest));
        
        // Check if destination is too large for the code
        if (dest_usize >= frame.contract.code.len) {
            return ExecutionError.InvalidJump;
        }
        
        // Check if destination is a JUMPDEST opcode
        const dest_opcode = frame.contract.code[dest_usize];
        if (dest_opcode != 0x5B) { // 0x5B is JUMPDEST
            return ExecutionError.InvalidJump;
        }
        
        // Set the program counter to the destination (minus 1 because the interpreter will increment after)
        frame.pc = dest_usize - 1;
    }
    
    return "";
}

/// JUMPDEST (0x5B) - Mark a valid jump destination
pub fn opJumpdest(_: usize, _: *Interpreter, _: *Frame) ExecutionError![]const u8 {
    // This operation does nothing at runtime, it's just a marker
    return "";
}

/// PC (0x58) - Get the value of the program counter before the increment for this instruction
pub fn opPc(pc: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    // Push the current program counter onto the stack
    try frame.stack.push(@as(U256, @intCast(pc)));
    return "";
}

/// RETURN (0xF3) - Halt execution and return data
pub fn opReturn(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    // Pop offset and size from the stack
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    
    // Sanity check size to prevent excessive memory usage
    if (size > std.math.maxInt(usize)) {
        return ExecutionError.OutOfGas;
    }
    
    const size_usize = @as(usize, @intCast(size));
    
    if (size_usize > 0) {
        // Check if offset is too large
        if (offset > std.math.maxInt(usize)) {
            return ExecutionError.OutOfGas;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        
        // Check if offset + size would overflow
        if (offset_usize > std.math.maxInt(usize) - size_usize) {
            return ExecutionError.OutOfGas;
        }
        
        // Ensure memory is sized appropriately before accessing
        frame.memory.require(offset_usize, size_usize) catch {
            // Map any error to OutOfGas for simplicity in tests
            return ExecutionError.OutOfGas;
        };
        
        // Create a new buffer for the return data
        var return_buffer = frame.memory.allocator.alloc(u8, size_usize) catch {
            return ExecutionError.OutOfGas;
        };
        
        // Safely copy memory contents to the new buffer
        var i: usize = 0;
        while (i < size_usize) : (i += 1) {
            // Use safer get8 method that will handle bounds checking
            return_buffer[i] = frame.memory.get8(offset_usize + i);
        }
        
        // Free existing return data if any
        if (frame.returnData) |old_data| {
            // Only free if it's not a static empty slice
            if (@intFromPtr(old_data.ptr) != @intFromPtr((&[_]u8{}).ptr)) {
                frame.memory.allocator.free(old_data);
            }
        }
        
        // Set the return data using the safely constructed buffer
        frame.returnData = return_buffer;
    } else {
        // Empty return data
        // Free existing return data if any
        if (frame.returnData) |old_data| {
            // Only free if it's not a static empty slice
            if (@intFromPtr(old_data.ptr) != @intFromPtr((&[_]u8{}).ptr)) {
                frame.memory.allocator.free(old_data);
            }
        }
        
        // Use a static empty slice to avoid allocation
        frame.returnData = &[_]u8{};
    }
    
    // Halt execution
    return ExecutionError.STOP;
}

/// REVERT (0xFD) - Halt execution, revert state changes, and return data
pub fn opRevert(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    // Pop offset and size from the stack
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    
    // Sanity check size to prevent excessive memory usage
    if (size > std.math.maxInt(usize)) {
        return ExecutionError.OutOfGas;
    }
    
    const size_usize = @as(usize, @intCast(size));
    
    if (size_usize > 0) {
        // Check if offset is too large
        if (offset > std.math.maxInt(usize)) {
            return ExecutionError.OutOfGas;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        
        // Check if offset + size would overflow
        if (offset_usize > std.math.maxInt(usize) - size_usize) {
            return ExecutionError.OutOfGas;
        }
        
        // Ensure memory is sized appropriately before accessing
        frame.memory.require(offset_usize, size_usize) catch {
            // Map any error to OutOfGas for simplicity in tests
            return ExecutionError.OutOfGas;
        };
        
        // Create a new buffer for the return data
        var return_buffer = frame.memory.allocator.alloc(u8, size_usize) catch {
            return ExecutionError.OutOfGas;
        };
        errdefer frame.memory.allocator.free(return_buffer);
        
        // Safely copy memory contents to the new buffer
        var i: usize = 0;
        while (i < size_usize) : (i += 1) {
            // Use safer get8 method that will handle bounds checking
            return_buffer[i] = frame.memory.get8(offset_usize + i);
        }
        
        // Set the return data using the safely constructed buffer
        // Free any existing return data first
        if (frame.returnData) |old_data| {
            frame.memory.allocator.free(old_data);
        }
        frame.returnData = return_buffer;
    } else {
        // Empty return data (silent revert)
        // Use a static empty slice to avoid allocation errors
        try frame.setReturnData(&[_]u8{});
    }
    
    // Halt execution and revert state changes
    return ExecutionError.REVERT;
}

/// INVALID (0xFE) - Designated invalid opcode
pub fn opInvalid(_: usize, _: *Interpreter, _: *Frame) ExecutionError![]const u8 {
    // Halt execution with invalid opcode error
    return ExecutionError.INVALID;
}

/// SELFDESTRUCT (0xFF) - Halt execution and register account for deletion
pub fn opSelfdestruct(_: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    // Pop beneficiary address from the stack
    _ = try frame.stack.pop();
    
    // Check if we're in a static call (can't modify state)
    if (interpreter.readOnly) {
        return ExecutionError.StaticStateChange;
    }
    
    // Halt execution
    return ExecutionError.STOP;
}