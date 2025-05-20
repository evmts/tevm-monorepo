const std = @import("std");
const evm_pkg = @import("../package.zig");
const Interpreter = evm_pkg.Interpreter;
const Frame = evm_pkg.Frame;
const ExecutionError = evm_pkg.ExecutionError;
const JumpTable = evm_pkg.JumpTable;
const EvmLogger = evm_pkg.EvmLogger;
const createLogger = EvmLogger.createLogger;
const logStack = EvmLogger.logStack;
const logStackSlop = EvmLogger.logStackSlop;
const logMemory = EvmLogger.logMemory;
const debugOnly = EvmLogger.debugOnly;
const logHexBytes = EvmLogger.logHexBytes;
const createScopedLogger = EvmLogger.createScopedLogger;
// We'll use a simple hex conversion function for logging
const hex = struct {
    pub fn bytesToHex(bytes: []const u8, buf: *[32]u8) ![]const u8 {
        if (bytes.len * 2 > buf.len) return error.BufferTooSmall;
        
        const hex_chars = "0123456789abcdef";
        var i: usize = 0;
        
        for (bytes) |b| {
            buf[i] = hex_chars[b >> 4];
            buf[i + 1] = hex_chars[b & 0x0F];
            i += 2;
        }
        
        return buf[0..bytes.len * 2];
    }
};
const U256 = @import("../Stack.zig").@"u256";

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
                const mem_size = frame.memory.size();
                if (mem_size > 0) {
                    frame.logger.debug("STOP: Final memory state (memory size: {d} bytes)", .{mem_size});
                    // Only log a summary of memory size instead of accessing raw memory
                    // This approach is safer and avoids direct memory access
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
                if (frame.stack.size > 0) {
                    logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "JUMP", pc);
                } else {
                    frame.logger.debug("JUMP: Stack is empty", .{});
                }
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
    
    // Check if destination is negative or too large to fit in usize
    if (dest > std.math.maxInt(usize)) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("JUMP: Invalid destination {d} (0x{x}) - value too large for architecture", .{dest, dest});
        }
        return ExecutionError.InvalidJump;
    }
    
    // Convert to usize for indexing
    const dest_usize = @as(usize, @intCast(dest));
    
    // Check if destination is too large for the code
    if (dest_usize >= frame.contract.code.len) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("JUMP: Invalid destination {d} (0x{x}) - exceeds code length {d}", .{dest, dest, frame.contract.code.len});
        }
        return ExecutionError.InvalidJump;
    }
    
    // Check if destination is a JUMPDEST opcode
    const dest_opcode = frame.contract.code[dest_usize];
    if (dest_opcode != 0x5B) { // 0x5B is JUMPDEST
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("JUMP: Destination {d} (0x{x}) is not a JUMPDEST, found opcode 0x{X:0>2}", .{dest, dest, dest_opcode});
            
            // Additional debug info: show surrounding bytecode context at destination
            debugOnly(struct {
                fn callback() void {
                    // Find safe bounds for displaying context
                    const start = if (dest_usize > 5) dest_usize - 5 else 0;
                    const end = if (dest_usize + 6 < frame.contract.code.len) dest_usize + 6 else frame.contract.code.len;
                    frame.logger.debug("JUMP: Bytecode context around destination:", .{});
                    
                    var line_buf: [256]u8 = undefined;
                    var line_fbs = std.io.fixedBufferStream(&line_buf);
                    const line_writer = line_fbs.writer();
                    
                    // Safe way to build up context string
                    var i: usize = start;
                    while (i < end) : (i += 1) {
                        if (i == dest_usize) {
                            _ = line_writer.write("[") catch continue;
                        } else {
                            _ = line_writer.write(" ") catch continue;
                        }
                        
                        var hex_buf: [3]u8 = undefined;
                        _ = std.fmt.bufPrint(&hex_buf, "{x:0>2}", .{frame.contract.code[i]}) catch continue;
                        _ = line_writer.write(&hex_buf) catch continue;
                        
                        _ = line_writer.write(" ") catch continue;
                        
                        if (i == dest_usize) {
                            _ = line_writer.write("] <- invalid jump dest ") catch continue;
                        }
                    }
                    
                    frame.logger.debug("{s}", .{line_buf[0..line_fbs.pos]});
                }
            }.callback);
        }
        
        return ExecutionError.InvalidJump;
    }
    
    // Set the program counter to the destination (minus 1 because the interpreter will increment after)
    if (dest_usize > 0) {
        frame.pc = dest_usize - 1;
    } else {
        // Special case for jumping to position 0 to avoid underflow
        frame.pc = 0;
        // Interpreter will still increment PC, so we need to handle this specially
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.debug("JUMP: Special case - jumping to position 0, setting PC to 0", .{});
            frame.logger.debug("JUMP: Interpreter will increment PC, this may cause unexpected behavior", .{});
        }
    }
    
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
                if (frame.stack.size > 0) {
                    logStackSlop(frame.logger, frame.stack.data[0..frame.stack.size], "JUMPI", pc);
                } else {
                    frame.logger.debug("JUMPI: Stack is empty", .{});
                }
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
        
        // Check if destination is negative or too large to fit in usize
        if (dest > std.math.maxInt(usize)) {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("JUMPI: Invalid destination {d} (0x{x}) - value too large for architecture", .{dest, dest});
            }
            return ExecutionError.InvalidJump;
        }
        
        // Convert to usize for indexing
        const dest_usize = @as(usize, @intCast(dest));
        
        // Check if destination is too large for the code
        if (dest_usize >= frame.contract.code.len) {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("JUMPI: Invalid destination {d} (0x{x}) - exceeds code length {d}", .{dest, dest, frame.contract.code.len});
            }
            return ExecutionError.InvalidJump;
        }
        
        // Check if destination is a JUMPDEST opcode
        const dest_opcode = frame.contract.code[dest_usize];
        if (dest_opcode != 0x5B) { // 0x5B is JUMPDEST
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("JUMPI: Destination {d} (0x{x}) is not a JUMPDEST, found opcode 0x{X:0>2}", .{dest, dest, dest_opcode});
                
                // Additional debug info: show surrounding bytecode context at destination
                debugOnly(struct {
                    fn callback() void {
                        // Find safe bounds for displaying context
                        const start = if (dest_usize > 5) dest_usize - 5 else 0;
                        const end = if (dest_usize + 6 < frame.contract.code.len) dest_usize + 6 else frame.contract.code.len;
                        frame.logger.debug("JUMPI: Bytecode context around destination:", .{});
                        
                        var line_buf: [256]u8 = undefined;
                        var line_fbs = std.io.fixedBufferStream(&line_buf);
                        const line_writer = line_fbs.writer();
                        
                        // Safe way to build up context string
                        var i: usize = start;
                        while (i < end) : (i += 1) {
                            if (i == dest_usize) {
                                _ = line_writer.write("[") catch continue;
                            } else {
                                _ = line_writer.write(" ") catch continue;
                            }
                            
                            var hex_buf: [3]u8 = undefined;
                            _ = std.fmt.bufPrint(&hex_buf, "{x:0>2}", .{frame.contract.code[i]}) catch continue;
                            _ = line_writer.write(&hex_buf) catch continue;
                            
                            _ = line_writer.write(" ") catch continue;
                            
                            if (i == dest_usize) {
                                _ = line_writer.write("] <- invalid jump dest ") catch continue;
                            }
                        }
                        
                        frame.logger.debug("{s}", .{line_buf[0..line_fbs.pos]});
                    }
                }.callback);
            }
            
            return ExecutionError.InvalidJump;
        }
        
        // Set the program counter to the destination (minus 1 because the interpreter will increment after)
        if (dest_usize > 0) {
            frame.pc = dest_usize - 1;
        } else {
            // Special case for jumping to position 0 to avoid underflow
            frame.pc = 0;
            // Interpreter will still increment PC, so we need to handle this specially
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.debug("JUMPI: Special case - jumping to position 0, setting PC to 0", .{});
                frame.logger.debug("JUMPI: Interpreter will increment PC, this may cause unexpected behavior", .{});
            }
        }
        
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
    try frame.stack.push(@as(U256, @intCast(pc)));
    
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
                    if (next_op == 0x01 and next_next_op == 0x56) { // ADD followed by JUMP
                        frame.logger.debug("PC: Detected PC + value -> JUMP pattern (dynamic jump table)", .{});
                    } else if (next_op >= 0x60 and next_op <= 0x7F and frame.contract.code[pc+2] == 0x01) { // PUSH followed by ADD
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
    if (size > std.math.maxInt(usize)) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("RETURN: Size too large for this architecture", .{});
        }
        return ExecutionError.OutOfGas; // Use OutOfGas as a general "operation too expensive" error
    }
    
    const size_usize = @as(usize, @intCast(size));
    
    if (size_usize > 0) {
        // Check if offset is too large
        if (offset > std.math.maxInt(usize)) {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("RETURN: Offset too large for this architecture", .{});
            }
            return ExecutionError.OutOfGas;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        
        // Check if offset + size would overflow
        if (offset_usize > std.math.maxInt(usize) - size_usize) {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("RETURN: Memory range would overflow usize", .{});
            }
            return ExecutionError.OutOfGas;
        }
        
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.debug("RETURN: Reading {d} bytes from memory at offset {d}", .{size_usize, offset_usize});
        }
        
        // Ensure memory is sized appropriately before accessing
        try frame.memory.require(offset_usize, size_usize);
        
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            // Log a detailed view of memory and the return data
            debugOnly(struct {
                fn callback() void {
                    // Log a summary of memory being accessed for return data
                    frame.logger.debug("RETURN: Memory area being accessed for return data:", .{});
                    frame.logger.debug("RETURN: Offset: {d}, Size: {d}", .{offset_usize, size_usize});
                    
                    // Safely summarize return data size without accessing raw memory
                    frame.logger.debug("RETURN: Return data size: {d} bytes", .{size_usize});
                    
                    // Log size-specific information to help with debugging
                    if (size_usize == 0) {
                        frame.logger.debug("RETURN: Empty return data", .{});
                    } else if (size_usize == 32) {
                        frame.logger.debug("RETURN: Standard 32-byte (single word) return", .{});
                    } else if (size_usize == 64) {
                        frame.logger.debug("RETURN: 64-byte (two word) return", .{});
                    } else if (size_usize % 32 == 0) {
                        frame.logger.debug("RETURN: Multiple of 32 bytes ({d} words)", .{size_usize / 32});
                    } else {
                        frame.logger.debug("RETURN: Non-standard size return data", .{});
                    }
                }
            }.callback);
            
            // ABI return type analysis using just size information
            debugOnly(struct {
                fn callback() void {
                    frame.logger.debug("RETURN: ABI return size analysis", .{});
                    
                    // Common return sizes and what they might represent
                    if (size_usize == 32) {
                        frame.logger.debug("RETURN: 32-byte size suggests single word return value (uint256, address, bool, etc.)", .{});
                    } else if (size_usize == 64) {
                        frame.logger.debug("RETURN: 64-byte size suggests two-word return or struct with two fields", .{});
                    } else if (size_usize >= 96 and size_usize % 32 == 0) { 
                        frame.logger.debug("RETURN: Size ({d} bytes) suggests multiple word return values", .{size_usize});
                    } else if (size_usize > 64) {
                        frame.logger.debug("RETURN: Size ({d} bytes) may indicate dynamic return data like string/bytes/array", .{size_usize});
                    }
                }
            }.callback);
        }
        
        // Create a new buffer for the return data
        var return_buffer = try frame.memory.allocator.alloc(u8, size_usize);
        errdefer frame.memory.allocator.free(return_buffer);
        
        // Safely copy memory contents to the new buffer
        var i: usize = 0;
        while (i < size_usize) : (i += 1) {
            // Use safer get8 method that will handle bounds checking
            return_buffer[i] = frame.memory.get8(offset_usize + i);
        }
        
        // Set the return data using the safely constructed buffer
        try frame.setReturnData(return_buffer);
        
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.info("RETURN: Successfully set return data, {d} bytes", .{size_usize});
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
    if (size > std.math.maxInt(usize)) {
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.err("REVERT: Size too large for this architecture", .{});
        }
        return ExecutionError.OutOfGas; // Use OutOfGas as a general "operation too expensive" error
    }
    
    const size_usize = @as(usize, @intCast(size));
    
    if (size_usize > 0) {
        // Check if offset is too large
        if (offset > std.math.maxInt(usize)) {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("REVERT: Offset too large for this architecture", .{});
            }
            return ExecutionError.OutOfGas;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        
        // Check if offset + size would overflow
        if (offset_usize > std.math.maxInt(usize) - size_usize) {
            if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
                frame.logger.err("REVERT: Memory range would overflow usize", .{});
            }
            return ExecutionError.OutOfGas;
        }
        
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.debug("REVERT: Reading {d} bytes from memory at offset {d}", .{size_usize, offset_usize});
        }
        
        // Ensure memory is sized appropriately before accessing
        try frame.memory.require(offset_usize, size_usize);
        
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            // Log a detailed view of the revert data
            debugOnly(struct {
                fn callback() void {
                    frame.logger.debug("REVERT: Analyzing revert reason", .{});
                    
                    // Check for Solidity error selector 0x08c379a0 (Error(string))
                    const error_selector = "08c379a0";
                    var selector_buf: [32]u8 = undefined;
                    var has_selector = false;
                    
                    // Safe check for selector
                    if (size_usize >= 4) {
                        // Safely access the first 4 bytes using get8 method
                        var selector_bytes: [4]u8 = undefined;
                        for (0..4) |i| {
                            selector_bytes[i] = frame.memory.get8(offset_usize + i);
                        }
                        
                        const selector_str = hex.bytesToHex(&selector_bytes, &selector_buf) catch "";
                        if (selector_str.len >= 8) {
                            has_selector = std.mem.eql(u8, selector_str, error_selector);
                            frame.logger.debug("REVERT: Selector: 0x{s} {s} standard error selector", 
                                .{selector_str, if (has_selector) "matches" else "does not match"});
                        }
                    }
                    
                    // Try to decode the revert reason if it matches the standard error format
                    if (has_selector and size_usize >= 4 + 32 + 32) {
                        // Extract string length from the second 32-byte chunk
                        var length: u64 = 0;
                        // Safely build up the length from individual bytes
                        for (0..8) |i| {
                            if (4+32-8+i < offset_usize + size_usize) {
                                length = (length << 8) | frame.memory.get8(offset_usize + 4+32-8+i);
                            }
                        }
                        
                        if (4 + 32 + 32 + length <= size_usize) {
                            frame.logger.debug("REVERT: Error message length: {d} bytes", .{length});
                            
                            // Only log the first 100 characters of the error string to avoid memory issues
                            const max_display_length = @min(length, 100);
                            frame.logger.debug("REVERT: Error message preview (first {d} bytes):", .{max_display_length});
                            
                            // Don't access memory directly, use a buffer to store the preview
                            if (max_display_length > 0) {
                                var preview = frame.memory.allocator.alloc(u8, max_display_length) catch {
                                    frame.logger.debug("REVERT: Could not allocate memory for error preview", .{});
                                    return;
                                };
                                defer frame.memory.allocator.free(preview);
                                
                                // Safely copy the error message bytes using get8
                                for (0..max_display_length) |i| {
                                    preview[i] = frame.memory.get8(offset_usize + 4+32+32+i);
                                }
                                
                                frame.logger.debug("REVERT: Error message: {s}", .{preview});
                            }
                        } else {
                            frame.logger.debug("REVERT: Error message length ({d}) exceeds available data", .{length});
                        }
                    } else if (size_usize >= 4) {
                        // Try to interpret as a custom error selector
                        frame.logger.debug("REVERT: Possibly a custom error with selector shown above", .{});
                    }
                    
                    // Log a summary of the revert data size
                    frame.logger.debug("REVERT: Total revert data size: {d} bytes", .{size_usize});
                }
            }.callback);
        }
        
        // Create a new buffer for the return data
        var return_buffer = try frame.memory.allocator.alloc(u8, size_usize);
        errdefer frame.memory.allocator.free(return_buffer);
        
        // Safely copy memory contents to the new buffer
        var i: usize = 0;
        while (i < size_usize) : (i += 1) {
            // Use safer get8 method that will handle bounds checking
            return_buffer[i] = frame.memory.get8(offset_usize + i);
        }
        
        // Set the return data using the safely constructed buffer
        try frame.setReturnData(return_buffer);
        
        if (@import("../EvmLogger.zig").ENABLE_DEBUG_LOGS) {
            frame.logger.info("REVERT: Set return data from memory, {d} bytes", .{size_usize});
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
    
    // Safely get offset and size from stack with bound checking
    const offset_idx = stack.size - 1;
    const size_idx = stack.size - 2;
    if (offset_idx >= stack.capacity) {
        // This shouldn't happen with proper stack validation, but we check anyway
        return .{ .size = 0, .overflow = true };
    }
    if (size_idx >= stack.capacity) {
        // This shouldn't happen with proper stack validation, but we check anyway
        return .{ .size = 0, .overflow = true };
    }
    
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
    
    // Sanity check offset to prevent overflow
    if (offset > std.math.maxInt(usize)) {
        return .{ .size = 0, .overflow = true };
    }
    
    // Cast values to usize for calculations
    const offset_usize = @as(usize, @intCast(offset));
    const size_usize = @as(usize, @intCast(size));
    
    // Check for overflow in offset + size calculation
    if (offset_usize > std.math.maxInt(usize) - size_usize) {
        return .{ .size = 0, .overflow = true };
    }
    
    // Memory needed is offset + size
    const end_pos = offset_usize + size_usize;
    
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