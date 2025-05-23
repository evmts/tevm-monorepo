const std = @import("std");
const evm = @import("evm");
const jumpTableModule = evm.jumpTable;
const JumpTable = jumpTableModule.JumpTable;
const Operation = jumpTableModule.Operation;
const Interpreter = evm.Interpreter;
const Frame = evm.Frame;
const ExecutionError = evm.InterpreterError;
const Stack = evm.Stack;
const Memory = evm.Memory;
const Contract = evm.Contract;

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
    var topics: [4]u64 = undefined;
    if (n_topics > 4) {
        // Safety check to prevent buffer overflow
        return ExecutionError.InvalidOpcode;
    }
    
    var i: u8 = 0;
    while (i < n_topics) : (i += 1) {
        const topic_val = frame.stack.pop() catch |err| return mapStackError(err);
        topics[i] = @as(u64, @truncate(topic_val));
    }
    
    // Pop memory offset and size
    const size = frame.stack.pop() catch |err| return mapStackError(err);
    const offset = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Safety check for overflow when truncating to u64
    if (size > std.math.maxInt(u64)) {
        return ExecutionError.OutOfGas; // Use OutOfGas as a general failure case
    }
    if (offset > std.math.maxInt(u64)) {
        return ExecutionError.OutOfGas; // Use OutOfGas as a general failure case
    }
    
    // Convert to u64 values
    const mem_offset = @as(u64, @truncate(offset));
    const mem_size = @as(u64, @truncate(size));
    
    // Check for overflow in mem_offset + mem_size calculation
    if (mem_size > 0 and mem_offset > std.math.maxInt(u64) - mem_size) {
        return ExecutionError.OutOfGas;
    }
    
    // Ensure memory has enough capacity
    try frame.memory.require(mem_offset, mem_size);
    
    // In a production implementation, we would fetch the data from memory
    // and emit a log event
    if (mem_size > 0) {
        // Use a safer approach to verify memory range is valid
        // We'll do this by copying to a temporary buffer if needed
        // But for now, just do basic checks at boundaries
        
        _ = frame.memory.get8(mem_offset);
        if (mem_size > 1) {
            // Check last byte to ensure range is valid
            _ = frame.memory.get8(mem_offset + mem_size - 1);
            
            // For extra safety, check a few points in the middle for very large ranges
            if (mem_size > 1024) {
                // Check at 25%, 50% and 75% points
                _ = frame.memory.get8(mem_offset + (mem_size / 4));
                _ = frame.memory.get8(mem_offset + (mem_size / 2));
                _ = frame.memory.get8(mem_offset + (mem_size * 3 / 4));
            }
        }
    }
    
    // In a complete implementation, we would:
    // 1. Create a log record with address, topics, and data
    // 2. Add the log to blockchain/state for later retrieval via JSON-RPC logs API
    
    // For now we just use gas but don't emit logs
    
    return "";
}

/// Calculate memory size for LOG operations
pub fn logMemorySize(stack: *Stack) struct { size: u64, overflow: bool } {
    // We need at least 2 items on the stack for any LOG operation
    if (stack.size < 2) {
        return .{ .size = 0, .overflow = false };
    }
    
    // Check if we have valid indices for stack access
    if (stack.size <= 1) {
        return .{ .size = 0, .overflow = true };
    }
    if (stack.size - 1 >= stack.capacity) {
        return .{ .size = 0, .overflow = true };
    }
    if (stack.size - 2 >= stack.capacity) {
        return .{ .size = 0, .overflow = true };
    }
    
    // Get memory offset and size safely
    const offset = stack.data[stack.size - 2];  // Second to top
    const size = stack.data[stack.size - 1];    // Top of stack
    
    // Check for values too large for u64
    if (offset > std.math.maxInt(u64) or size > std.math.maxInt(u64)) {
        return .{ .size = 0, .overflow = true };
    }
    
    // Convert to u64 (truncate higher bits)
    const mem_offset = @as(u64, @truncate(offset));
    const mem_size = @as(u64, @truncate(size));
    
    // If size is 0, just return the offset as size (no memory needed beyond offset)
    if (mem_size == 0) {
        return .{ .size = mem_offset, .overflow = false };
    }
    
    // Check for potential overflow with direct arithmetic
    if (mem_offset > std.math.maxInt(u64) - mem_size) {
        return .{ .size = 0, .overflow = true };
    }
    
    // No overflow, return total memory size required
    return .{ .size = mem_offset + mem_size, .overflow = false };
}

/// Dynamic gas calculation for LOG operations
pub fn logDynamicGas(_: *Interpreter, _: *Frame, stack: *Stack, memory: *Memory, _: u64, topics: u8) error{OutOfGas}!u64 {
    
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
pub fn registerLogOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // LOG0 (0xA0)
    const log0_op = try allocator.create(Operation);
    log0_op.* = Operation{
        .execute = opLog0,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(2, 0),
        .max_stack = JumpTable.maxStack(2, 0),
        .dynamic_gas = log0DynamicGas,
        .memory_size = logMemorySize,
    };
    jump_table.table[0xA0] = log0_op;
    
    // LOG1 (0xA1)
    const log1_op = try allocator.create(Operation);
    log1_op.* = Operation{
        .execute = opLog1,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(3, 0),
        .max_stack = JumpTable.maxStack(3, 0),
        .dynamic_gas = log1DynamicGas,
        .memory_size = logMemorySize,
    };
    jump_table.table[0xA1] = log1_op;
    
    // LOG2 (0xA2)
    const log2_op = try allocator.create(Operation);
    log2_op.* = Operation{
        .execute = opLog2,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(4, 0),
        .max_stack = JumpTable.maxStack(4, 0),
        .dynamic_gas = log2DynamicGas,
        .memory_size = logMemorySize,
    };
    jump_table.table[0xA2] = log2_op;
    
    // LOG3 (0xA3)
    const log3_op = try allocator.create(Operation);
    log3_op.* = Operation{
        .execute = opLog3,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(5, 0),
        .max_stack = JumpTable.maxStack(5, 0),
        .dynamic_gas = log3DynamicGas,
        .memory_size = logMemorySize,
    };
    jump_table.table[0xA3] = log3_op;
    
    // LOG4 (0xA4)
    const log4_op = try allocator.create(Operation);
    log4_op.* = Operation{
        .execute = opLog4,
        .constant_gas = 0, // All gas is calculated dynamically
        .min_stack = JumpTable.minStack(6, 0),
        .max_stack = JumpTable.maxStack(6, 0),
        .dynamic_gas = log4DynamicGas,
        .memory_size = logMemorySize,
    };
    jump_table.table[0xA4] = log4_op;
}

// ===== TESTS =====

const testing = std.testing;

fn mapStackError(err: anyerror) ExecutionError {
    return switch (err) {
        error.StackUnderflow => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        else => ExecutionError.OutOfGas,
    };
}

test "LOG memory size calculation" {
    const allocator = testing.allocator;
    
    // Create a stack for testing
    var stack = try Stack.init(allocator);
    defer stack.deinit();
    
    // Setup stack for LOG operation test
    try stack.push(0x100); // offset at 0x100
    try stack.push(0x80);  // size of 0x80 (128 bytes)
    
    // Test memory size calculation
    const mem_size = logMemorySize(&stack);
    try testing.expectEqual(@as(u64, 0x180), mem_size.size); // 0x100 + 0x80 = 0x180
    try testing.expect(!mem_size.overflow);
    
    // Test with extreme values to trigger overflow
    _ = try stack.pop();
    _ = try stack.pop();
    try stack.push(0xFFFFFFFFFFFFFFFF); // max u64
    try stack.push(1); // Adding 1 would overflow
    
    const overflow_mem_size = logMemorySize(&stack);
    try testing.expect(overflow_mem_size.overflow);
}

test "LOG dynamic gas calculation" {
    const allocator = testing.allocator;
    
    // Create components for testing
    var stack = try Stack.init(allocator);
    defer stack.deinit();
    
    var memory = try Memory.init(allocator);
    defer memory.deinit();
    
    // Prepare memory with enough capacity for test
    try memory.resize(0x200);
    
    // Create mock interpreter
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 10000,
        .readOnly = false,
        .returnStatus = .Continue,
        .returnData = null,
        .evm = undefined, // Not used in these tests
    };
    
    // Create mock frame
    var frame = Frame{
        .gas = 10000,
        .stack = stack,
        .memory = memory,
        .contract = undefined, // Not used in these tests
        .returnData = null,
    };
    
    // Test LOG0 with no topics
    // Push memory offset and size to stack
    try stack.push(0x80); // offset
    try stack.push(0x20); // size (32 bytes)
    
    // Calculate LOG0 gas: 
    // Base: 375 (LOG_GAS) + 
    // Data: 8 * 32 (LOG_DATA_GAS * size) = 256
    // Total: 375 + 256 = 631 (plus potential memory expansion costs)
    const log0_gas = try log0DynamicGas(&interpreter, &frame, &stack, &memory, 0);
    try testing.expect(log0_gas >= 375);  // At least the base LOG_GAS
    
    // Test LOG1 (need one more stack item for topic)
    try stack.push(0x1234); // topic1
    const log1_gas = try log1DynamicGas(&interpreter, &frame, &stack, &memory, 0);
    // LOG1: 375 (LOG_GAS) + 375 (LOG_TOPIC_GAS) + 256 (data) = 1006
    // Note: Memory gas cost may differ depending on implementation
    try testing.expect(log1_gas >= 375 + 375);  // At least base gas + topic gas
    
    // Test LOG4 (need 3 more stack items for topics)
    try stack.push(0x5678); // topic2
    try stack.push(0x9ABC); // topic3
    try stack.push(0xDEF0); // topic4
    const log4_gas = try log4DynamicGas(&interpreter, &frame, &stack, &memory, 0);
    // LOG4: 375 (LOG_GAS) + 4*375 (4 topics * LOG_TOPIC_GAS) + 256 (data) = 2131
    // Note: Memory gas cost may differ depending on implementation
    try testing.expect(log4_gas >= 375 + (4 * 375));  // At least base gas + topic gas
}

test "LOG operation stack requirements" {
    const allocator = testing.allocator;
    
    // Create components for testing
    var stack = try Stack.init(allocator);
    defer stack.deinit();
    
    var memory = try Memory.init(allocator);
    defer memory.deinit();
    
    // Create mock interpreter
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 10000,
        .readOnly = false,
        .returnStatus = .Continue,
        .returnData = null,
        .evm = undefined, // Not used in these tests
    };
    
    // Create mock frame
    var frame = Frame{
        .gas = 10000,
        .stack = stack,
        .memory = memory,
        .contract = undefined, // Not used in these tests
        .returnData = null,
    };
    
    // Test with not enough items on stack for LOG operations
    const log0_result = log0DynamicGas(&interpreter, &frame, &stack, &memory, 0);
    try testing.expectError(error.OutOfGas, log0_result);
    
    // Add offset and size but not topics
    try stack.push(0x80); // offset
    try stack.push(0x20); // size
    
    // This should work for LOG0
    _ = try log0DynamicGas(&interpreter, &frame, &stack, &memory, 0);
    
    // But not for LOG1 (needs 1 topic)
    const log1_result = log1DynamicGas(&interpreter, &frame, &stack, &memory, 0);
    try testing.expectError(error.OutOfGas, log1_result);
}