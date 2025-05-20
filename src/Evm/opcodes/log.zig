const std = @import("std");
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const JumpTable = @import("../JumpTable.zig");
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;
const Contract = @import("../Contract.zig").Contract;

/// LOG0 operation
pub fn opLog0(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return opLog(pc, interpreter, frame, 0);
}

/// LOG1 operation
pub fn opLog1(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return opLog(pc, interpreter, frame, 1);
}

/// LOG2 operation
pub fn opLog2(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return opLog(pc, interpreter, frame, 2);
}

/// LOG3 operation
pub fn opLog3(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return opLog(pc, interpreter, frame, 3);
}

/// LOG4 operation
pub fn opLog4(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    return opLog(pc, interpreter, frame, 4);
}

/// Generic LOG operation implementation
fn opLog(pc: usize, interpreter: *Interpreter, frame: *Frame, n_topics: u8) ExecutionError![]const u8 {
    _ = pc;
    
    // Check for read-only mode
    if (interpreter.readOnly) {
        return ExecutionError.WriteProtection;
    }
    
    // We need at least 2 + n_topics items on the stack
    const required_stack_items = 2 + n_topics;
    if (frame.stack.size < required_stack_items) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop topics from the stack (in reverse order)
    var topics: [4]u256 = undefined;
    var i: u8 = 0;
    while (i < n_topics) : (i += 1) {
        topics[i] = try frame.stack.pop();
    }
    
    // Pop memory offset and size
    const size = try frame.stack.pop();
    const offset = try frame.stack.pop();
    
    // Convert to u64 values
    const mem_offset = @as(u64, @truncate(offset));
    const mem_size = @as(u64, @truncate(size));
    
    // Check if memory access is valid
    if (mem_offset + mem_size > frame.memory.data().len) {
        return ExecutionError.OutOfOffset;
    }
    
    // Get data from memory
    // We would use this data in a complete implementation
    _ = frame.memory.data()[mem_offset..mem_offset + mem_size];
    
    // In a complete implementation, we would:
    // 1. Create a log record with address, topics, and data
    // 2. Add the log to blockchain/state for later retrieval via JSON-RPC logs API
    
    // For now we just use gas but don't emit logs
    
    return "";
}

/// Calculate memory size for LOG operations
fn logMemorySize(stack: *Stack) struct { size: u64, overflow: bool } {
    // We need at least 2 items on the stack for any LOG operation
    if (stack.size < 2) {
        return .{ .size = 0, .overflow = false };
    }
    
    // Get memory offset and size
    const offset = stack.data[stack.size - 2];  // Second to top
    const size = stack.data[stack.size - 1];    // Top of stack
    
    // Convert to u64 (truncate higher bits)
    const mem_offset = @as(u64, @truncate(offset));
    const mem_size = @as(u64, @truncate(size));
    
    // Check for potential overflow
    if (mem_size > std.math.maxInt(u64) or mem_offset > std.math.maxInt(u64) - mem_size) {
        return .{ .size = 0, .overflow = true };
    }
    
    // Return total memory size required
    return .{ .size = mem_offset + mem_size, .overflow = false };
}

/// Dynamic gas calculation for LOG operations
pub fn logDynamicGas(_: *Interpreter, _: *Frame, stack: *Stack, memory: *Memory, requested_size: u64, topics: u8) error{OutOfGas}!u64 {
    
    // We need at least 2 + topics items on the stack
    if (stack.size < 2 + topics) {
        return error.OutOfGas;
    }
    
    // Calculate memory size and expansion cost
    const mem_result = logMemorySize(stack);
    if (mem_result.overflow) {
        return error.OutOfGas;
    }
    
    // Calculate memory expansion cost if any
    var gas: u64 = 0;
    if (mem_result.size > memory.size()) {
        gas = try JumpTable.memoryGasCost(memory, mem_result.size);
    }
    
    // Take a snapshot of the stack to avoid modifying it
    const size = stack.data[stack.size - 1];  // Top of stack
    
    // Convert to u64 (truncate higher bits)
    const data_size = @as(u64, @truncate(size));
    
    // Calculate log operation gas:
    // 1. Base cost: LOG_GAS (375)
    // 2. Per topic cost: LOG_TOPIC_GAS * topics (375 * topics)
    // 3. Data cost: LOG_DATA_GAS * data_size (8 * data_size)
    
    // Handle potential overflow with safe addition
    if (JumpTable.LogGas > std.math.maxInt(u64) - (JumpTable.LogTopicGas * topics)) {
        return error.OutOfGas;
    }
    
    var log_cost = JumpTable.LogGas + (JumpTable.LogTopicGas * topics);
    
    // Add data gas
    if (JumpTable.LogDataGas > std.math.maxInt(u64) / data_size) {
        return error.OutOfGas; // Potential overflow
    }
    
    const data_gas = JumpTable.LogDataGas * data_size;
    
    if (log_cost > std.math.maxInt(u64) - data_gas) {
        return error.OutOfGas; // Potential overflow
    }
    
    log_cost += data_gas;
    
    // Add memory expansion cost
    if (log_cost > std.math.maxInt(u64) - gas) {
        return error.OutOfGas; // Potential overflow
    }
    
    gas += log_cost;
    
    return gas;
}

/// LOG0 dynamic gas calculation
pub fn log0DynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    return logDynamicGas(interpreter, frame, stack, memory, requested_size, 0);
}

/// LOG1 dynamic gas calculation
pub fn log1DynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    return logDynamicGas(interpreter, frame, stack, memory, requested_size, 1);
}

/// LOG2 dynamic gas calculation
pub fn log2DynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    return logDynamicGas(interpreter, frame, stack, memory, requested_size, 2);
}

/// LOG3 dynamic gas calculation
pub fn log3DynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    return logDynamicGas(interpreter, frame, stack, memory, requested_size, 3);
}

/// LOG4 dynamic gas calculation
pub fn log4DynamicGas(interpreter: *Interpreter, frame: *Frame, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64 {
    return logDynamicGas(interpreter, frame, stack, memory, requested_size, 4);
}

/// Register LOG opcodes in the jump table
pub fn registerLogOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // LOG0 (0xA0)
    const log0_op = try allocator.create(JumpTable.Operation);
    log0_op.* = JumpTable.Operation{
        .execute = opLog0,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(2, 0),
        .max_stack = JumpTable.maxStack(2, 0),
        .dynamic_gas = log0DynamicGas,
        .memory_size = logMemorySize,
    };
    jump_table.table[0xA0] = log0_op;
    
    // LOG1 (0xA1)
    const log1_op = try allocator.create(JumpTable.Operation);
    log1_op.* = JumpTable.Operation{
        .execute = opLog1,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(3, 0),
        .max_stack = JumpTable.maxStack(3, 0),
        .dynamic_gas = log1DynamicGas,
        .memory_size = logMemorySize,
    };
    jump_table.table[0xA1] = log1_op;
    
    // LOG2 (0xA2)
    const log2_op = try allocator.create(JumpTable.Operation);
    log2_op.* = JumpTable.Operation{
        .execute = opLog2,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(4, 0),
        .max_stack = JumpTable.maxStack(4, 0),
        .dynamic_gas = log2DynamicGas,
        .memory_size = logMemorySize,
    };
    jump_table.table[0xA2] = log2_op;
    
    // LOG3 (0xA3)
    const log3_op = try allocator.create(JumpTable.Operation);
    log3_op.* = JumpTable.Operation{
        .execute = opLog3,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(5, 0),
        .max_stack = JumpTable.maxStack(5, 0),
        .dynamic_gas = log3DynamicGas,
        .memory_size = logMemorySize,
    };
    jump_table.table[0xA3] = log3_op;
    
    // LOG4 (0xA4)
    const log4_op = try allocator.create(JumpTable.Operation);
    log4_op.* = JumpTable.Operation{
        .execute = opLog4,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(6, 0),
        .max_stack = JumpTable.maxStack(6, 0),
        .dynamic_gas = log4DynamicGas,
        .memory_size = logMemorySize,
    };
    jump_table.table[0xA4] = log4_op;
}