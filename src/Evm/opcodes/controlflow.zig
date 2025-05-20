const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const JumpTable = @import("../JumpTable.zig");
const EvmLogger = @import("../EvmLogger.zig").EvmLogger;
const createLogger = @import("../EvmLogger.zig").createLogger;
const logStack = @import("../EvmLogger.zig").logStack;
const logMemory = @import("../EvmLogger.zig").logMemory;

// Create a file-specific logger
const logger = createLogger(@src().file);

/// STOP (0x00) - Halt execution
pub fn opStop(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    frame.logger.debug("Executing STOP at PC={d}", .{pc});
    
    // Simply halt execution by returning STOP error
    return ExecutionError.STOP;
}

/// JUMP (0x56) - Jump to a destination position in code
pub fn opJump(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    frame.logger.debug("Executing JUMP at PC={d}", .{pc});
    
    // We need at least 1 item on the stack
    if (frame.stack.size < 1) {
        frame.logger.err("JUMP: Stack underflow", .{});
        return ExecutionError.StackUnderflow;
    }
    
    // Pop destination from the stack
    const dest = try frame.stack.pop();
    frame.logger.debug("JUMP: Destination {d}", .{dest});
    
    // Check if destination is too large for the code
    if (dest >= frame.contract.code.len) {
        frame.logger.err("JUMP: Invalid destination {d}, code length {d}", .{dest, frame.contract.code.len});
        return ExecutionError.InvalidJump;
    }
    
    // Convert to usize for indexing
    const dest_usize = @as(usize, @intCast(dest));
    
    // Check if destination is a JUMPDEST opcode
    if (frame.contract.code[dest_usize] != 0x5B) { // 0x5B is JUMPDEST
        frame.logger.err("JUMP: Destination {d} is not a JUMPDEST, found opcode 0x{X:0>2}", .{dest, frame.contract.code[dest_usize]});
        return ExecutionError.InvalidJump;
    }
    
    // Set the program counter to the destination (minus 1 because the interpreter will increment after)
    frame.pc = dest_usize - 1;
    frame.logger.debug("JUMP: Set PC to {d}", .{frame.pc});
    
    return "";
}

/// JUMPI (0x57) - Conditional jump
pub fn opJumpi(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    frame.logger.debug("Executing JUMPI at PC={d}", .{pc});
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        frame.logger.err("JUMPI: Stack underflow", .{});
        return ExecutionError.StackUnderflow;
    }
    
    // Pop condition and destination from the stack
    const condition = try frame.stack.pop();
    const dest = try frame.stack.pop();
    frame.logger.debug("JUMPI: Destination {d}, condition {d}", .{dest, condition});
    
    // Only jump if condition is not zero
    if (condition != 0) {
        frame.logger.debug("JUMPI: Condition is true, jumping", .{});
        
        // Check if destination is too large for the code
        if (dest >= frame.contract.code.len) {
            frame.logger.err("JUMPI: Invalid destination {d}, code length {d}", .{dest, frame.contract.code.len});
            return ExecutionError.InvalidJump;
        }
        
        // Convert to usize for indexing
        const dest_usize = @as(usize, @intCast(dest));
        
        // Check if destination is a JUMPDEST opcode
        if (frame.contract.code[dest_usize] != 0x5B) { // 0x5B is JUMPDEST
            frame.logger.err("JUMPI: Destination {d} is not a JUMPDEST, found opcode 0x{X:0>2}", .{dest, frame.contract.code[dest_usize]});
            return ExecutionError.InvalidJump;
        }
        
        // Set the program counter to the destination (minus 1 because the interpreter will increment after)
        frame.pc = dest_usize - 1;
        frame.logger.debug("JUMPI: Set PC to {d}", .{frame.pc});
    } else {
        frame.logger.debug("JUMPI: Condition is false, not jumping", .{});
    }
    
    return "";
}

/// JUMPDEST (0x5B) - Mark a valid jump destination
pub fn opJumpdest(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    frame.logger.debug("Executing JUMPDEST at PC={d}", .{pc});
    
    // This operation does nothing at runtime, it's just a marker
    return "";
}

/// PC (0x58) - Get the value of the program counter before the increment for this instruction
pub fn opPc(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    frame.logger.debug("Executing PC at PC={d}", .{pc});
    
    // We need to have room on the stack
    if (frame.stack.size >= frame.stack.capacity) {
        frame.logger.err("PC: Stack overflow", .{});
        return ExecutionError.StackOverflow;
    }
    
    // Push the current program counter onto the stack
    try frame.stack.push(@as(u256, @intCast(pc)));
    frame.logger.debug("PC: Pushed value {d} to stack", .{pc});
    
    return "";
}

/// RETURN (0xF3) - Halt execution and return data
pub fn opReturn(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    frame.logger.debug("Executing RETURN at PC={d}", .{pc});
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        frame.logger.err("RETURN: Stack underflow", .{});
        return ExecutionError.StackUnderflow;
    }
    
    // Pop offset and size from the stack
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    frame.logger.debug("RETURN: offset={d}, size={d}", .{offset, size});
    
    // Sanity check size to prevent excessive memory usage
    const size_usize = if (size > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(size));
    
    if (size_usize > 0) {
        // Check if offset + size_usize would overflow
        const offset_usize = if (offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(offset));
        frame.logger.debug("RETURN: Reading {d} bytes from memory at offset {d}", .{size_usize, offset_usize});
        
        // Ensure memory access is within bounds
        try frame.memory.require(offset_usize, size_usize);
        
        // Get the memory slice
        const mem = frame.memory.data();
        
        // Set the return data
        if (offset_usize + size_usize <= mem.len) {
            // Log a preview of the return data
            if (size_usize <= 32) {
                // If small enough, log the entire data
                frame.logger.debug("RETURN data: {any}", .{mem[offset_usize..offset_usize + size_usize]});
            } else {
                // Otherwise just log the first 32 bytes
                frame.logger.debug("RETURN data (first 32 bytes): {any}", .{mem[offset_usize..offset_usize + 32]});
                frame.logger.debug("... plus {d} more bytes", .{size_usize - 32});
            }
            
            try frame.setReturnData(mem[offset_usize..offset_usize + size_usize]);
        } else {
            frame.logger.err("RETURN: Memory access out of bounds", .{});
            return ExecutionError.OutOfOffset;
        }
    } else {
        frame.logger.debug("RETURN: Empty return (size=0)", .{});
    }
    
    // Halt execution
    frame.logger.info("RETURN: Halting execution", .{});
    return ExecutionError.STOP;
}

/// REVERT (0xFD) - Halt execution, revert state changes, and return data
pub fn opRevert(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    frame.logger.debug("Executing REVERT at PC={d}", .{pc});
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        frame.logger.err("REVERT: Stack underflow", .{});
        return ExecutionError.StackUnderflow;
    }
    
    // Pop offset and size from the stack
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    frame.logger.debug("REVERT: offset={d}, size={d}", .{offset, size});
    
    // Sanity check size to prevent excessive memory usage
    const size_usize = if (size > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(size));
    
    if (size_usize > 0) {
        // Check if offset + size_usize would overflow
        const offset_usize = if (offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(offset));
        frame.logger.debug("REVERT: Reading {d} bytes from memory at offset {d}", .{size_usize, offset_usize});
        
        // Ensure memory access is within bounds
        try frame.memory.require(offset_usize, size_usize);
        
        // Get the memory slice
        const mem = frame.memory.data();
        
        // Set the return data
        if (offset_usize + size_usize <= mem.len) {
            // Log a preview of the revert data
            if (size_usize <= 32) {
                // If small enough, log the entire data
                frame.logger.debug("REVERT data: {any}", .{mem[offset_usize..offset_usize + size_usize]});
            } else {
                // Otherwise just log the first 32 bytes
                frame.logger.debug("REVERT data (first 32 bytes): {any}", .{mem[offset_usize..offset_usize + 32]});
                frame.logger.debug("... plus {d} more bytes", .{size_usize - 32});
            }
            
            try frame.setReturnData(mem[offset_usize..offset_usize + size_usize]);
        } else {
            frame.logger.err("REVERT: Memory access out of bounds", .{});
            return ExecutionError.OutOfOffset;
        }
    } else {
        frame.logger.debug("REVERT: Empty revert data (size=0)", .{});
    }
    
    // Halt execution and revert state changes
    frame.logger.info("REVERT: Halting execution and reverting state changes", .{});
    return ExecutionError.REVERT;
}

/// INVALID (0xFE) - Designated invalid opcode
pub fn opInvalid(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    frame.logger.debug("Executing INVALID at PC={d}", .{pc});
    frame.logger.err("Encountered invalid opcode", .{});
    
    // Halt execution with invalid opcode error
    return ExecutionError.INVALID;
}

/// SELFDESTRUCT (0xFF) - Halt execution and register account for deletion
pub fn opSelfdestruct(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = pc;
    
    // We need at least 1 item on the stack
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop beneficiary address from the stack
    const beneficiary = try frame.stack.pop();
    
    // Check if we're in a static call (can't modify state)
    if (interpreter.readOnly) {
        return ExecutionError.StaticStateChange;
    }
    
    // In a real implementation, this would:
    // 1. Transfer any remaining balance to the beneficiary address
    // 2. Mark the contract for deletion
    // But since we don't have those mechanisms yet, we just halt
    
    // Log the beneficiary to demonstrate we're using the variable
    if (frame.logger) |logger| {
        logger.debug("SELFDESTRUCT called with beneficiary: {x}", .{beneficiary});
    }
    
    // Halt execution
    return ExecutionError.STOP;
}

/// Calculate memory size required for return and revert operations
pub fn getReturnDataMemorySize(stack: *const JumpTable.Stack, memory: *const JumpTable.Memory) JumpTable.MemorySizeFunc.ReturnType {
    _ = memory;
    
    // Need at least 2 items on the stack
    if (stack.size < 2) {
        return .{ .size = 0, .overflow = false };
    }
    
    // Get offset and size from stack
    // offset is at stack.size - 1, size is at stack.size - 2
    const offset = stack.data[stack.size - 1];
    const size = stack.data[stack.size - 2];
    
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

/// Register all control flow opcodes in the given jump table
pub fn registerControlFlowOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // STOP (0x00)
    const stop_op = try allocator.create(JumpTable.Operation);
    stop_op.* = JumpTable.Operation{
        .execute = opStop,
        .constant_gas = 0,
        .min_stack = JumpTable.minStack(0, 0),
        .max_stack = JumpTable.maxStack(0, 0),
    };
    jump_table.table[0x00] = stop_op;
    
    // JUMP (0x56)
    const jump_op = try allocator.create(JumpTable.Operation);
    jump_op.* = JumpTable.Operation{
        .execute = opJump,
        .constant_gas = JumpTable.GasMidStep,
        .min_stack = JumpTable.minStack(1, 0),
        .max_stack = JumpTable.maxStack(1, 0),
    };
    jump_table.table[0x56] = jump_op;
    
    // JUMPI (0x57)
    const jumpi_op = try allocator.create(JumpTable.Operation);
    jumpi_op.* = JumpTable.Operation{
        .execute = opJumpi,
        .constant_gas = JumpTable.GasSlowStep,
        .min_stack = JumpTable.minStack(2, 0),
        .max_stack = JumpTable.maxStack(2, 0),
    };
    jump_table.table[0x57] = jumpi_op;
    
    // PC (0x58)
    const pc_op = try allocator.create(JumpTable.Operation);
    pc_op.* = JumpTable.Operation{
        .execute = opPc,
        .constant_gas = JumpTable.GasQuickStep,
        .min_stack = JumpTable.minStack(0, 1),
        .max_stack = JumpTable.maxStack(0, 1),
    };
    jump_table.table[0x58] = pc_op;
    
    // JUMPDEST (0x5B)
    const jumpdest_op = try allocator.create(JumpTable.Operation);
    jumpdest_op.* = JumpTable.Operation{
        .execute = opJumpdest,
        .constant_gas = JumpTable.JumpdestGas,
        .min_stack = JumpTable.minStack(0, 0),
        .max_stack = JumpTable.maxStack(0, 0),
    };
    jump_table.table[0x5B] = jumpdest_op;
    
    // RETURN (0xF3)
    const return_op = try allocator.create(JumpTable.Operation);
    return_op.* = JumpTable.Operation{
        .execute = opReturn,
        .constant_gas = 0,
        .min_stack = JumpTable.minStack(2, 0),
        .max_stack = JumpTable.maxStack(2, 0),
        .memory_size = getReturnDataMemorySize,
    };
    jump_table.table[0xF3] = return_op;
    
    // REVERT (0xFD)
    const revert_op = try allocator.create(JumpTable.Operation);
    revert_op.* = JumpTable.Operation{
        .execute = opRevert,
        .constant_gas = 0,
        .min_stack = JumpTable.minStack(2, 0),
        .max_stack = JumpTable.maxStack(2, 0),
        .memory_size = getReturnDataMemorySize,
    };
    jump_table.table[0xFD] = revert_op;
    
    // INVALID (0xFE)
    const invalid_op = try allocator.create(JumpTable.Operation);
    invalid_op.* = JumpTable.Operation{
        .execute = opInvalid,
        .constant_gas = 0,
        .min_stack = JumpTable.minStack(0, 0),
        .max_stack = JumpTable.maxStack(0, 0),
    };
    jump_table.table[0xFE] = invalid_op;
    
    // SELFDESTRUCT (0xFF)
    const selfdestruct_op = try allocator.create(JumpTable.Operation);
    selfdestruct_op.* = JumpTable.Operation{
        .execute = opSelfdestruct,
        .constant_gas = 5000, // Base cost, dynamic in recent versions
        .min_stack = JumpTable.minStack(1, 0),
        .max_stack = JumpTable.maxStack(1, 0),
        .dynamic_gas = null, // TODO: Implement proper gas calculation
    };
    jump_table.table[0xFF] = selfdestruct_op;
}