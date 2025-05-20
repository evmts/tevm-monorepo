const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const JumpTable = @import("../JumpTable.zig");
const EvmLogger = @import("../EvmLogger.zig").EvmLogger;
const createLogger = @import("../EvmLogger.zig").createLogger;
const logStack = @import("../EvmLogger.zig").logStack;
const logStackSlop = @import("../EvmLogger.zig").logStackSlop;
const logMemory = @import("../EvmLogger.zig").logMemory;
const debugOnly = @import("../EvmLogger.zig").debugOnly;
const logHexBytes = @import("../EvmLogger.zig").logHexBytes;
const createScopedLogger = @import("../EvmLogger.zig").createScopedLogger;
const hex = @import("../../Utils/hex.zig");
const u256 = @import("../../Types/U256.ts").u256;

// Create a file-specific logger
const logger = EvmLogger.init("controlflow.zig");

/// STOP (0x00) - Halt execution
pub fn opStop(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("Executing STOP at PC={d} [Contract: {x}]", .{pc, frame.contract.address});
        
        // Log stack state at STOP for debugging
        debugOnly(struct {
            fn callback() void {
                if (frame.stack.size > 0) {
                    frame.logger.debug("STOP: Final stack state (will be discarded):", .{});
                    logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "STOP", pc);
                } else {
                    frame.logger.debug("STOP: Stack is empty upon execution halt", .{});
                }
                
                // Log memory if needed
                const memory_data = frame.memory.data();
                if (memory_data.len > 0) {
                    frame.logger.debug("STOP: Final memory state (first 64 bytes if any):", .{});
                    logMemory(frame.logger, memory_data, 64);
                }
            }
        }.callback);
        
        frame.logger.info("STOP: Halting execution normally at PC={d}", .{pc});
    }
    
    // Simply halt execution by returning STOP error
    return ExecutionError.STOP;
}

/// JUMP (0x56) - Jump to a destination position in code
pub fn opJump(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        const scoped = createScopedLogger(frame.logger, "JUMP Operation");
        defer scoped.deinit();
        
        frame.logger.debug("Executing JUMP at PC={d} [Contract: {x}]", .{pc, frame.contract.address});
        
        // Log current stack before operation
        debugOnly(struct {
            fn callback() void {
                logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "JUMP", pc);
            }
        }.callback);
    }
    
    // We need at least 1 item on the stack
    if (frame.stack.size < 1) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("JUMP: Stack underflow - cannot pop jump destination", .{});
        }
        return ExecutionError.StackUnderflow;
    }
    
    // Pop destination from the stack
    const dest = try frame.stack.pop();
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("JUMP: Destination popped from stack: {d} (0x{x})", .{dest, dest});
    }
    
    // Check if destination is too large for the code
    if (dest >= frame.contract.code.len) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("JUMP: Invalid destination {d} (0x{x}) - exceeds code length {d}", .{dest, dest, frame.contract.code.len});
        }
        return ExecutionError.InvalidJump;
    }
    
    // Convert to usize for indexing
    const dest_usize = @as(usize, @intCast(dest));
    
    // Check if destination is a JUMPDEST opcode
    const dest_opcode = frame.contract.code[dest_usize];
    if (dest_opcode != 0x5B) { // 0x5B is JUMPDEST
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("JUMP: Destination {d} (0x{x}) is not a JUMPDEST, found opcode 0x{X:0>2}", .{dest, dest, dest_opcode});
            
            // Additional debug info: show surrounding bytecode context at destination
            debugOnly(struct {
                fn callback() void {
                    const start = if (dest_usize > 5) dest_usize - 5 else 0;
                    const end = if (dest_usize + 6 < frame.contract.code.len) dest_usize + 6 else frame.contract.code.len;
                    frame.logger.debug("JUMP: Bytecode context around destination:", .{});
                    
                    var line_buf: [256]u8 = undefined;
                    var line_fbs = std.io.fixedBufferStream(&line_buf);
                    const line_writer = line_fbs.writer();
                    
                    for (frame.contract.code[start..end], start..) |byte, i| {
                        if (std.fmt.format(line_writer, "{}{x:0>2} ", .{
                            if (i == dest_usize) "[" else " ",
                            byte,
                        }) catch false) {}
                        if (i == dest_usize) {
                            if (std.fmt.format(line_writer, "] <- invalid jump dest ", .{}) catch false) {}
                        }
                    }
                    
                    frame.logger.debug("{s}", .{line_buf[0..line_fbs.pos]});
                }
            }.callback);
        }
        
        return ExecutionError.InvalidJump;
    }
    
    // Set the program counter to the destination (minus 1 because the interpreter will increment after)
    frame.pc = dest_usize - 1;
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("JUMP: Valid jump - Setting PC to {d} (will be {d} after increment)", .{frame.pc, frame.pc + 1});
        
        // Additional info about what instruction we're jumping to
        debugOnly(struct {
            fn callback() void {
                // Check if there's at least 1 byte after the JUMPDEST to get a hint about what's next
                if (dest_usize + 1 < frame.contract.code.len) {
                    const next_op = frame.contract.code[dest_usize + 1];
                    frame.logger.debug("JUMP: Next instruction after JUMPDEST is 0x{X:0>2}", .{next_op});
                }
            }
        }.callback);
    }
    
    return "";
}

/// JUMPI (0x57) - Conditional jump
pub fn opJumpi(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        const scoped = createScopedLogger(frame.logger, "JUMPI Operation");
        defer scoped.deinit();
        
        frame.logger.debug("Executing JUMPI at PC={d} [Contract: {x}]", .{pc, frame.contract.address});
        
        // Log current stack before operation
        debugOnly(struct {
            fn callback() void {
                logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "JUMPI", pc);
            }
        }.callback);
    }
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("JUMPI: Stack underflow - need 2 items: [destination, condition]", .{});
        }
        return ExecutionError.StackUnderflow;
    }
    
    // Pop condition and destination from the stack
    const condition = try frame.stack.pop();
    const dest = try frame.stack.pop();
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("JUMPI: Destination={d} (0x{x}), condition={d} (0x{x})", .{dest, dest, condition, condition});
    }
    
    // Only jump if condition is not zero
    if (condition != 0) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.debug("JUMPI: Condition is true (non-zero), jumping to destination {d} (0x{x})", .{dest, dest});
        }
        
        // Check if destination is too large for the code
        if (dest >= frame.contract.code.len) {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("JUMPI: Invalid destination {d} (0x{x}) - exceeds code length {d}", .{dest, dest, frame.contract.code.len});
            }
            return ExecutionError.InvalidJump;
        }
        
        // Convert to usize for indexing
        const dest_usize = @as(usize, @intCast(dest));
        
        // Check if destination is a JUMPDEST opcode
        const dest_opcode = frame.contract.code[dest_usize];
        if (dest_opcode != 0x5B) { // 0x5B is JUMPDEST
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("JUMPI: Destination {d} (0x{x}) is not a JUMPDEST, found opcode 0x{X:0>2}", .{dest, dest, dest_opcode});
                
                // Additional debug info: show surrounding bytecode context at destination
                debugOnly(struct {
                    fn callback() void {
                        const start = if (dest_usize > 5) dest_usize - 5 else 0;
                        const end = if (dest_usize + 6 < frame.contract.code.len) dest_usize + 6 else frame.contract.code.len;
                        frame.logger.debug("JUMPI: Bytecode context around destination:", .{});
                        
                        var line_buf: [256]u8 = undefined;
                        var line_fbs = std.io.fixedBufferStream(&line_buf);
                        const line_writer = line_fbs.writer();
                        
                        for (frame.contract.code[start..end], start..) |byte, i| {
                            if (std.fmt.format(line_writer, "{}{x:0>2} ", .{
                                if (i == dest_usize) "[" else " ",
                                byte,
                            }) catch false) {}
                            if (i == dest_usize) {
                                if (std.fmt.format(line_writer, "] <- invalid jump dest ", .{}) catch false) {}
                            }
                        }
                        
                        frame.logger.debug("{s}", .{line_buf[0..line_fbs.pos]});
                    }
                }.callback);
            }
            
            return ExecutionError.InvalidJump;
        }
        
        // Set the program counter to the destination (minus 1 because the interpreter will increment after)
        frame.pc = dest_usize - 1;
        
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.debug("JUMPI: Valid conditional jump - Setting PC to {d} (will be {d} after increment)", .{frame.pc, frame.pc + 1});
            
            // Additional info about what instruction we're jumping to
            debugOnly(struct {
                fn callback() void {
                    // Check if there's at least 1 byte after the JUMPDEST to get a hint about what's next
                    if (dest_usize + 1 < frame.contract.code.len) {
                        const next_op = frame.contract.code[dest_usize + 1];
                        frame.logger.debug("JUMPI: Next instruction after JUMPDEST is 0x{X:0>2}", .{next_op});
                    }
                }
            }.callback);
        }
    } else if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("JUMPI: Condition is false (zero), continuing sequential execution from PC={d}", .{pc});
        frame.logger.debug("JUMPI: Next instruction will be at PC={d}", .{pc + 1});
    }
    
    return "";
}

/// JUMPDEST (0x5B) - Mark a valid jump destination
pub fn opJumpdest(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("Executing JUMPDEST at PC={d} [Contract: {x}]", .{pc, frame.contract.address});
        
        // Log stack state when reaching a jump destination
        debugOnly(struct {
            fn callback() void {
                frame.logger.debug("JUMPDEST: Reached valid jump destination at PC={d}", .{pc});
                if (frame.stack.size > 0) {
                    frame.logger.debug("JUMPDEST: Current stack depth: {d}", .{frame.stack.size});
                    logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "JUMPDEST", pc);
                }
                
                // Show a few bytes ahead to give context about what code path we've jumped to
                const preview_size = 8;
                const bytes_to_preview = @min(preview_size, frame.contract.code.len - pc - 1);
                if (bytes_to_preview > 0) {
                    var line_buf: [256]u8 = undefined;
                    var line_fbs = std.io.fixedBufferStream(&line_buf);
                    const line_writer = line_fbs.writer();
                    
                    if (std.fmt.format(line_writer, "JUMPDEST: Next {d} bytes: ", .{bytes_to_preview}) catch false) {}
                    
                    for (frame.contract.code[pc+1..pc+1+bytes_to_preview]) |byte| {
                        if (std.fmt.format(line_writer, "{x:0>2} ", .{byte}) catch false) {}
                    }
                    
                    frame.logger.debug("{s}", .{line_buf[0..line_fbs.pos]});
                }
            }
        }.callback);
    }
    
    // This operation does nothing at runtime, it's just a marker
    return "";
}

/// PC (0x58) - Get the value of the program counter before the increment for this instruction
pub fn opPc(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("Executing PC at PC={d} [Contract: {x}]", .{pc, frame.contract.address});
        
        // Log current stack before operation
        debugOnly(struct {
            fn callback() void {
                if (frame.stack.size > 0) {
                    logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "PC (before)", pc);
                } else {
                    frame.logger.debug("PC: Stack is empty before operation", .{});
                }
            }
        }.callback);
    }
    
    // We need to have room on the stack
    if (frame.stack.size >= frame.stack.capacity) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("PC: Stack overflow - cannot push PC value to stack (capacity={d})", .{frame.stack.capacity});
        }
        return ExecutionError.StackOverflow;
    }
    
    // Push the current program counter onto the stack
    try frame.stack.push(@as(u256, @intCast(pc)));
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("PC: Pushed current PC value {d} (0x{x}) to stack", .{pc, pc});
        
        // Log stack after push
        debugOnly(struct {
            fn callback() void {
                logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "PC (after)", pc);
                frame.logger.debug("PC: Analyzing control context - this opcode is often used for dynamic jumps", .{});
                
                // Look at surrounding code to check if we're part of a pattern like PUSH, PC, ADD, JUMP
                // which is a common pattern for dynamic jumps in compiled contracts
                if (pc > 0 and pc + 2 < frame.contract.code.len) {
                    const prev_op = frame.contract.code[pc-1];
                    const next_op = frame.contract.code[pc+1];
                    const next_next_op = frame.contract.code[pc+2];
                    
                    frame.logger.debug("PC: Surrounding operations - prev: 0x{x:0>2}, current: 0x58 (PC), next: 0x{x:0>2}, next+1: 0x{x:0>2}", 
                        .{prev_op, next_op, next_next_op});
                    
                    // Check for common patterns
                    if (next_op == 0x01 && next_next_op == 0x56) { // ADD followed by JUMP
                        frame.logger.debug("PC: Detected PC + value -> JUMP pattern (dynamic jump table)", .{});
                    } else if (next_op >= 0x60 && next_op <= 0x7F && frame.contract.code[pc+2] == 0x01) { // PUSH followed by ADD
                        frame.logger.debug("PC: Detected PC + literal pattern", .{});
                    }
                }
            }
        }.callback);
    }
    
    return "";
}

/// RETURN (0xF3) - Halt execution and return data
pub fn opReturn(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        const scoped = createScopedLogger(frame.logger, "RETURN Operation");
        defer scoped.deinit();
        
        frame.logger.debug("Executing RETURN at PC={d} [Contract: {x}]", .{pc, frame.contract.address});
        
        // Log stack before operation
        debugOnly(struct {
            fn callback() void {
                if (frame.stack.size > 0) {
                    logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "RETURN", pc);
                }
            }
        }.callback);
    }
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("RETURN: Stack underflow - need 2 items [offset, size]", .{});
        }
        return ExecutionError.StackUnderflow;
    }
    
    // Pop offset and size from the stack
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("RETURN: Memory offset={d} (0x{x}), size={d} (0x{x})", .{offset, offset, size, size});
    }
    
    // Sanity check size to prevent excessive memory usage
    const size_usize = if (size > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(size));
    
    if (size_usize > 0) {
        // Check if offset + size_usize would overflow
        const offset_usize = if (offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(offset));
        
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.debug("RETURN: Reading {d} bytes from memory at offset {d}", .{size_usize, offset_usize});
        }
        
        // Ensure memory access is within bounds
        try frame.memory.require(offset_usize, size_usize);
        
        // Get the memory slice
        const mem = frame.memory.data();
        
        // Set the return data
        if (offset_usize + size_usize <= mem.len) {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                // Log a detailed view of memory and the return data
                debugOnly(struct {
                    fn callback() void {
                        frame.logger.debug("RETURN: Memory snapshot before reading return data:", .{});
                        // Show memory around the return data
                        const start = if (offset_usize > 32) offset_usize - 32 else 0;
                        const end = @min(offset_usize + size_usize + 32, mem.len);
                        logMemory(frame.logger, mem[start..end], end - start);
                        
                        // Log a preview of the return data with hex encoding
                        if (size_usize <= 32) {
                            // If small enough, log the entire data
                            frame.logger.debug("RETURN: Complete return data ({d} bytes):", .{size_usize});
                            logHexBytes(frame.logger, "RETURN data", mem[offset_usize..offset_usize + size_usize]);
                        } else {
                            // Otherwise just log the first 32 bytes in hex
                            frame.logger.debug("RETURN: First 32 bytes of return data:", .{});
                            logHexBytes(frame.logger, "RETURN data prefix", mem[offset_usize..offset_usize + 32]);
                            frame.logger.debug("RETURN: ... plus {d} more bytes", .{size_usize - 32});
                            
                            // Also log the last 8 bytes if there are more than 40 bytes of return data
                            if (size_usize > 40) {
                                const last_bytes_start = offset_usize + size_usize - 8;
                                frame.logger.debug("RETURN: Last 8 bytes of return data:", .{});
                                logHexBytes(frame.logger, "RETURN data suffix", mem[last_bytes_start..offset_usize + size_usize]);
                            }
                        }
                    }
                }.callback);
                
                // Try to detect if this looks like an ABI-encoded return value
                debugOnly(struct {
                    fn callback() void {
                        const return_data = mem[offset_usize..offset_usize + size_usize];
                        
                        // Common return sizes and what they might represent
                        if (size_usize == 32) {
                            frame.logger.debug("RETURN: Data size (32 bytes) suggests a single word return value", .{});
                            // If it's all zeros except potentially the last byte, might be a boolean
                            var is_bool = true;
                            for (return_data[0..31]) |byte| {
                                if (byte != 0) {
                                    is_bool = false;
                                    break;
                                }
                            }
                            if (is_bool && (return_data[31] == 0 || return_data[31] == 1)) {
                                frame.logger.debug("RETURN: Data pattern suggests a boolean return value: {}", .{return_data[31] == 1});
                            }
                        } else if (size_usize == 64) {
                            frame.logger.debug("RETURN: Data size (64 bytes) suggests a two-word return value", .{});
                        } else if (size_usize >= 96 && size_usize % 32 == 0) { 
                            frame.logger.debug("RETURN: Data size ({d} bytes) suggests multiple word return values", .{size_usize});
                        } else if (size_usize > 32 + 32) {
                            // Check for dynamic data (string/bytes/array)
                            // If first 32 bytes contain a pointer (usually 32 or 64) and that matches total size
                            var offset_value: u256 = 0;
                            for (return_data[0..32], 0..) |byte, i| {
                                offset_value = (offset_value << 8) | byte;
                            }
                            if (offset_value == 32 && size_usize > 64) {
                                // Try to decode length from next word
                                var length_value: u256 = 0;
                                for (return_data[32..64], 0..) |byte, i| {
                                    length_value = (length_value << 8) | byte;
                                }
                                if (length_value + 64 == size_usize) {
                                    frame.logger.debug("RETURN: Data pattern suggests a dynamic return value (bytes/string) of length {d}", .{length_value});
                                }
                            }
                        }
                    }
                }.callback);
            }
            
            try frame.setReturnData(mem[offset_usize..offset_usize + size_usize]);
            
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.info("RETURN: Successfully set return data, {d} bytes", .{size_usize});
            }
        } else {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("RETURN: Memory access out of bounds - offset {d} + size {d} exceeds memory length {d}", 
                    .{offset_usize, size_usize, mem.len});
            }
            return ExecutionError.OutOfOffset;
        }
    } else {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.debug("RETURN: Empty return (size=0)", .{});
        }
        // Empty return data
        try frame.setReturnData(&[_]u8{});
    }
    
    // Halt execution
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.info("RETURN: Halting execution successfully at PC={d}", .{pc});
    }
    return ExecutionError.STOP;
}

/// REVERT (0xFD) - Halt execution, revert state changes, and return data
pub fn opRevert(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        const scoped = createScopedLogger(frame.logger, "REVERT Operation");
        defer scoped.deinit();
        
        frame.logger.debug("Executing REVERT at PC={d} [Contract: {x}]", .{pc, frame.contract.address});
        
        // Log stack before operation
        debugOnly(struct {
            fn callback() void {
                if (frame.stack.size > 0) {
                    logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "REVERT", pc);
                }
            }
        }.callback);
    }
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("REVERT: Stack underflow - need 2 items [offset, size]", .{});
        }
        return ExecutionError.StackUnderflow;
    }
    
    // Pop offset and size from the stack
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("REVERT: Memory offset={d} (0x{x}), size={d} (0x{x})", .{offset, offset, size, size});
    }
    
    // Sanity check size to prevent excessive memory usage
    const size_usize = if (size > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(size));
    
    if (size_usize > 0) {
        // Check if offset + size_usize would overflow
        const offset_usize = if (offset > std.math.maxInt(usize)) std.math.maxInt(usize) else @as(usize, @intCast(offset));
        
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.debug("REVERT: Reading {d} bytes from memory at offset {d}", .{size_usize, offset_usize});
        }
        
        // Ensure memory access is within bounds
        try frame.memory.require(offset_usize, size_usize);
        
        // Get the memory slice
        const mem = frame.memory.data();
        
        // Set the return data
        if (offset_usize + size_usize <= mem.len) {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                // Log a detailed view of the revert data
                debugOnly(struct {
                    fn callback() void {
                        // Get the error data
                        const revert_data = mem[offset_usize..offset_usize + size_usize];
                        
                        // Standard error format check: Error(string)
                        frame.logger.debug("REVERT: Analyzing revert reason", .{});
                        
                        // Check for Solidity error selector 0x08c379a0 (Error(string))
                        const error_selector = "08c379a0";
                        var selector_buf: [32]u8 = undefined;
                        var has_selector = false;
                        
                        if (size_usize >= 4) {
                            var selector_str = hex.bytesToHex(revert_data[0..4], &selector_buf) catch "";
                            if (selector_str.len >= 8) {
                                has_selector = std.mem.eql(u8, selector_str, error_selector);
                                frame.logger.debug("REVERT: Selector: 0x{s} {s} standard error selector", 
                                    .{selector_str, if (has_selector) "matches" else "does not match"});
                            }
                        }
                        
                        // Try to decode the revert reason if it matches the standard error format
                        if (has_selector && size_usize >= 4 + 32 + 32) {
                            // Extract string length from the second 32-byte chunk
                            var length: u64 = 0;
                            for (revert_data[4+32-8..4+32]) |byte| {
                                length = (length << 8) | byte;
                            }
                            
                            if (4 + 32 + 32 + length <= size_usize) {
                                // We can extract the error string
                                const error_string = revert_data[4+32+32..4+32+32+length];
                                frame.logger.debug("REVERT: Error message: {s}", .{error_string});
                            } else {
                                frame.logger.debug("REVERT: Error message length ({d}) exceeds available data", .{length});
                            }
                        } else if (size_usize >= 4) {
                            // Try to interpret as a custom error selector
                            frame.logger.debug("REVERT: Possibly a custom error with selector 0x{s}", 
                                .{hex.bytesToHex(revert_data[0..4], &selector_buf) catch "??"});
                        }
                        
                        // Log the raw revert data
                        if (size_usize <= 32) {
                            // If small enough, log the entire data
                            frame.logger.debug("REVERT: Complete revert data ({d} bytes):", .{size_usize});
                            logHexBytes(frame.logger, "REVERT data", revert_data);
                        } else {
                            // Otherwise just log the first 32 bytes
                            frame.logger.debug("REVERT: First 32 bytes of revert data:", .{});
                            logHexBytes(frame.logger, "REVERT data prefix", revert_data[0..32]);
                            frame.logger.debug("REVERT: ... plus {d} more bytes", .{size_usize - 32});
                            
                            // Also log the last 8 bytes if there are more than 40 bytes
                            if (size_usize > 40) {
                                const last_bytes = revert_data[size_usize-8..size_usize];
                                frame.logger.debug("REVERT: Last 8 bytes of revert data:", .{});
                                logHexBytes(frame.logger, "REVERT data suffix", last_bytes);
                            }
                        }
                    }
                }.callback);
            }
            
            try frame.setReturnData(mem[offset_usize..offset_usize + size_usize]);
            
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.info("REVERT: Set return data from memory, {d} bytes", .{size_usize});
            }
        } else {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("REVERT: Memory access out of bounds - offset {d} + size {d} exceeds memory length {d}", 
                    .{offset_usize, size_usize, mem.len});
            }
            return ExecutionError.OutOfOffset;
        }
    } else {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.debug("REVERT: Empty revert data (size=0)", .{});
        }
        // Empty return data (silent revert)
        try frame.setReturnData(&[_]u8{});
    }
    
    // Halt execution and revert state changes
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.warn("REVERT: Halting execution and reverting state changes at PC={d}", .{pc});
    }
    return ExecutionError.REVERT;
}

/// INVALID (0xFE) - Designated invalid opcode
pub fn opInvalid(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("Executing INVALID at PC={d} [Contract: {x}]", .{pc, frame.contract.address});
        
        // Log stack and execution context when hitting an invalid opcode
        debugOnly(struct {
            fn callback() void {
                frame.logger.debug("INVALID: Encountered 0xFE (designated invalid opcode) at PC={d}", .{pc});
                
                // Log the current stack
                if (frame.stack.size > 0) {
                    frame.logger.debug("INVALID: Stack state at invalid opcode:", .{});
                    logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "INVALID", pc);
                } else {
                    frame.logger.debug("INVALID: Stack is empty at invalid opcode", .{});
                }
                
                // Log surrounding bytecode for context
                const code = frame.contract.code;
                const start = if (pc >= 10) pc - 10 else 0;
                const end = if (pc + 10 < code.len) pc + 10 else code.len;
                
                frame.logger.debug("INVALID: Bytecode context around invalid opcode:", .{});
                var line_buf: [256]u8 = undefined;
                var line_fbs = std.io.fixedBufferStream(&line_buf);
                const line_writer = line_fbs.writer();
                
                for (code[start..end], start..) |byte, i| {
                    if (std.fmt.format(line_writer, "{}{x:0>2} ", .{
                        if (i == pc) "[" else " ",
                        byte,
                    }) catch false) {}
                    if (i == pc) {
                        if (std.fmt.format(line_writer, "] <- INVALID ", .{}) catch false) {}
                    }
                }
                
                frame.logger.debug("{s}", .{line_buf[0..line_fbs.pos]});
            }
        }.callback);
        
        frame.logger.err("INVALID: Execution halted due to invalid opcode at PC={d}", .{pc});
    }
    
    // Halt execution with invalid opcode error
    return ExecutionError.INVALID;
}

/// SELFDESTRUCT (0xFF) - Halt execution and register account for deletion
pub fn opSelfdestruct(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        const scoped = createScopedLogger(frame.logger, "SELFDESTRUCT Operation");
        defer scoped.deinit();
        
        frame.logger.debug("Executing SELFDESTRUCT at PC={d} [Contract: {x}]", .{pc, frame.contract.address});
        
        // Log stack before operation
        debugOnly(struct {
            fn callback() void {
                if (frame.stack.size > 0) {
                    logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "SELFDESTRUCT", pc);
                } else {
                    frame.logger.debug("SELFDESTRUCT: Stack is empty - expecting at least one item for beneficiary", .{});
                }
            }
        }.callback);
    }
    
    // We need at least 1 item on the stack
    if (frame.stack.size < 1) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("SELFDESTRUCT: Stack underflow - cannot pop beneficiary address", .{});
        }
        return ExecutionError.StackUnderflow;
    }
    
    // Pop beneficiary address from the stack
    const beneficiary = try frame.stack.pop();
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.debug("SELFDESTRUCT: Beneficiary address: 0x{x}", .{beneficiary});
    }
    
    // Check if we're in a static call (can't modify state)
    if (interpreter.readOnly) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("SELFDESTRUCT: Cannot modify state in static call context", .{});
        }
        return ExecutionError.StaticStateChange;
    }
    
    if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
        frame.logger.info("SELFDESTRUCT: Contract at 0x{x} will be destroyed", .{frame.contract.address});
        frame.logger.info("SELFDESTRUCT: Any remaining balance will be transferred to 0x{x}", .{beneficiary});
        
        // In a real implementation, this would:
        // 1. Transfer any remaining balance to the beneficiary address
        // 2. Mark the contract for deletion
        // But since we don't have those mechanisms yet, we just halt
        debugOnly(struct {
            fn callback() void {
                frame.logger.debug("SELFDESTRUCT: Note - in current implementation this is a placeholder", .{});
                frame.logger.debug("SELFDESTRUCT: Balance transfer and contract deletion are not yet implemented", .{});
            }
        }.callback);
        
        frame.logger.info("SELFDESTRUCT: Halting execution with STOP", .{});
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