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

/// STOP (0x00) - Halt execution
/// 
/// The STOP opcode halts execution successfully. This is not an error condition
/// but a normal termination. We return an empty string to indicate success
/// and the interpreter should check for this and halt execution.
pub fn opStop(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = frame;
    // Return STOP error to halt execution
    return ExecutionError.STOP;
}

/// JUMP (0x56) - Jump to a destination position in code
pub fn opJump(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    // Pop destination from the stack
    const dest = frame.stack.pop() catch |err| return mapStackError(err);
    
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
    const condition = frame.stack.pop() catch |err| return mapStackError(err);
    const dest = frame.stack.pop() catch |err| return mapStackError(err);
    
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
    frame.stack.push(@as(u256, @intCast(pc))) catch |err| return mapStackError(err);
    return "";
}

/// RETURN (0xF3) - Halt execution and return data
pub fn opReturn(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    // Pop offset and size from the stack
    const offset = frame.stack.pop() catch |err| return mapStackError(err);
    const size = frame.stack.pop() catch |err| return mapStackError(err);
    
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
            // Map any error to OutOfGas for simplicity
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
            return_buffer[i] = frame.memory.get8(offset_usize + i) catch return ExecutionError.OutOfGas;
        }
        
        // Free any existing return data
        if (frame.returnData) |old_data| {
            // Only free if it's not a static empty slice
            if (@intFromPtr(old_data.ptr) != @intFromPtr((&[_]u8{}).ptr)) {
                frame.memory.allocator.free(old_data);
            }
        }
        
        // Set the return data using the safely constructed buffer
        frame.returnData = return_buffer;
        frame.returnSize = size_usize;
    } else {
        // Free any existing return data
        if (frame.returnData) |old_data| {
            // Only free if it's not a static empty slice
            if (@intFromPtr(old_data.ptr) != @intFromPtr((&[_]u8{}).ptr)) {
                frame.memory.allocator.free(old_data);
            }
        }
        
        // Create an empty buffer to avoid null return data
        const empty_buffer = frame.memory.allocator.alloc(u8, 0) catch {
            return ExecutionError.OutOfGas;
        };
        
        // Empty return data
        frame.returnData = empty_buffer;
        frame.returnSize = 0;
    }
    
    // Return empty data - the interpreter will check the return data on the frame
    return "";
}

/// REVERT (0xFD) - Halt execution, revert state changes, and return data
pub fn opRevert(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    // Pop offset and size from the stack
    const offset = frame.stack.pop() catch |err| return mapStackError(err);
    const size = frame.stack.pop() catch |err| return mapStackError(err);
    
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
            // Map any error to OutOfGas for simplicity
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
            return_buffer[i] = frame.memory.get8(offset_usize + i) catch return ExecutionError.OutOfGas;
        }
        
        // Free any existing return data
        if (frame.returnData) |old_data| {
            // Only free if it's not a static empty slice
            if (@intFromPtr(old_data.ptr) != @intFromPtr((&[_]u8{}).ptr)) {
                frame.memory.allocator.free(old_data);
            }
        }
        
        // Set the return data using the safely constructed buffer
        frame.returnData = return_buffer;
        frame.returnSize = size_usize;
    } else {
        // Free any existing return data
        if (frame.returnData) |old_data| {
            // Only free if it's not a static empty slice
            if (@intFromPtr(old_data.ptr) != @intFromPtr((&[_]u8{}).ptr)) {
                frame.memory.allocator.free(old_data);
            }
        }
        
        // Create an empty buffer to avoid null return data
        const empty_buffer = frame.memory.allocator.alloc(u8, 0) catch {
            return ExecutionError.OutOfGas;
        };
        
        // Empty return data (silent revert)
        frame.returnData = empty_buffer;
        frame.returnSize = 0;
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
    _ = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Check if we're in a static call (can't modify state)
    if (interpreter.readOnly) {
        return ExecutionError.StaticStateChange;
    }
    
    // TODO: Implement SELFDESTRUCT state changes (mark account for deletion, transfer balance)
    // For now, just halt execution
    frame.stop = true;
    return "";
}

/// Calculate memory size required for return and revert operations
pub fn getReturnDataMemorySize(stack: *Stack) jumpTableModule.MemorySizeResult {
    
    // Need at least 2 items on the stack
    if (stack.size < 2) {
        return .{ .size = 0, .overflow = false };
    }
    
    // Safely get offset and size from stack with bound checking
    const offset_idx = stack.size - 1;
    const size_idx = stack.size - 2;
    if (offset_idx >= Stack.capacity) {
        // This shouldn't happen with proper stack validation, but we check anyway
        return .{ .size = 0, .overflow = true };
    }
    if (size_idx >= Stack.capacity) {
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
pub fn registerControlFlowOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // STOP (0x00)
    const stop_op = try allocator.create(Operation);
    stop_op.* = Operation{
        .execute = opStop,
        .constant_gas = 0,
        .min_stack = jumpTableModule.minStack(0, 0),
        .max_stack = jumpTableModule.maxStack(0, 0),
    };
    jump_table.table[0x00] = stop_op;
    
    // JUMP (0x56)
    const jump_op = try allocator.create(Operation);
    jump_op.* = Operation{
        .execute = opJump,
        .constant_gas = jumpTableModule.GasMidStep,
        .min_stack = jumpTableModule.minStack(1, 0),
        .max_stack = jumpTableModule.maxStack(1, 0),
    };
    jump_table.table[0x56] = jump_op;
    
    // JUMPI (0x57)
    const jumpi_op = try allocator.create(Operation);
    jumpi_op.* = Operation{
        .execute = opJumpi,
        .constant_gas = jumpTableModule.GasSlowStep,
        .min_stack = jumpTableModule.minStack(2, 0),
        .max_stack = jumpTableModule.maxStack(2, 0),
    };
    jump_table.table[0x57] = jumpi_op;
    
    // PC (0x58)
    const pc_op = try allocator.create(Operation);
    pc_op.* = Operation{
        .execute = opPc,
        .constant_gas = jumpTableModule.GasQuickStep,
        .min_stack = jumpTableModule.minStack(0, 1),
        .max_stack = jumpTableModule.maxStack(0, 1),
    };
    jump_table.table[0x58] = pc_op;
    
    // JUMPDEST (0x5B)
    const jumpdest_op = try allocator.create(Operation);
    jumpdest_op.* = Operation{
        .execute = opJumpdest,
        .constant_gas = 1, // JUMPDEST costs 1 gas
        .min_stack = jumpTableModule.minStack(0, 0),
        .max_stack = jumpTableModule.maxStack(0, 0),
    };
    jump_table.table[0x5B] = jumpdest_op;
    
    // RETURN (0xF3)
    const return_op = try allocator.create(Operation);
    return_op.* = Operation{
        .execute = opReturn,
        .constant_gas = 0,
        .min_stack = jumpTableModule.minStack(2, 0),
        .max_stack = jumpTableModule.maxStack(2, 0),
        .memory_size = getReturnDataMemorySize,
    };
    jump_table.table[0xF3] = return_op;
    
    // REVERT (0xFD)
    const revert_op = try allocator.create(Operation);
    revert_op.* = Operation{
        .execute = opRevert,
        .constant_gas = 0,
        .min_stack = jumpTableModule.minStack(2, 0),
        .max_stack = jumpTableModule.maxStack(2, 0),
        .memory_size = getReturnDataMemorySize,
    };
    jump_table.table[0xFD] = revert_op;
    
    // INVALID (0xFE)
    const invalid_op = try allocator.create(Operation);
    invalid_op.* = Operation{
        .execute = opInvalid,
        .constant_gas = 0,
        .min_stack = jumpTableModule.minStack(0, 0),
        .max_stack = jumpTableModule.maxStack(0, 0),
    };
    jump_table.table[0xFE] = invalid_op;
    
    // SELFDESTRUCT (0xFF)
    const selfdestruct_op = try allocator.create(Operation);
    selfdestruct_op.* = Operation{
        .execute = opSelfdestruct,
        .constant_gas = 5000, // Base cost, dynamic in recent versions
        .min_stack = jumpTableModule.minStack(1, 0),
        .max_stack = jumpTableModule.maxStack(1, 0),
        .dynamic_gas = null, // TODO: Implement proper gas calculation
    };
    jump_table.table[0xFF] = selfdestruct_op;
}

// Tests
const testing = std.testing;

test "JUMP opcode" {
    const allocator = testing.allocator;
    
    // Create a simple contract with JUMPDEST at position 3
    const code = [_]u8{ 0x60, 0x03, 0x56, 0x5B, 0x00 }; // PUSH1 0x03, JUMP, JUMPDEST, STOP
    var contract = try allocator.create(Frame.Contract);
    defer allocator.destroy(contract);
    
    contract.* = .{
        .code = try allocator.alloc(u8, code.len),
        .address = undefined,
        .caller = undefined,
        .value = 0,
    };
    defer allocator.free(contract.code);
    std.mem.copy(u8, contract.code, &code);
    
    // Create a frame with the contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up the stack with a jump destination
    try frame.stack.push(3); // Destination is position 3 (JUMPDEST)
    frame.pc = 2; // PC is at the JUMP opcode
    
    // Create a mock interpreter
    var interpreter = Interpreter{
        .gas = 100000,
        .readOnly = false,
        .evm = undefined,
    };
    
    // Execute the JUMP opcode
    _ = try opJump(frame.pc, &interpreter, &frame);
    
    // Check if PC was updated correctly (should be at JUMPDEST minus 1)
    try testing.expectEqual(@as(usize, 2), frame.pc);
}

test "JUMPI opcode - condition true" {
    const allocator = testing.allocator;
    
    // Create a simple contract with JUMPDEST at position 5
    const code = [_]u8{ 0x60, 0x05, 0x60, 0x01, 0x57, 0x5B, 0x00 }; // PUSH1 0x05, PUSH1 0x01, JUMPI, JUMPDEST, STOP
    var contract = try allocator.create(Frame.Contract);
    defer allocator.destroy(contract);
    
    contract.* = .{
        .code = try allocator.alloc(u8, code.len),
        .address = undefined,
        .caller = undefined,
        .value = 0,
    };
    defer allocator.free(contract.code);
    std.mem.copy(u8, contract.code, &code);
    
    // Create a frame with the contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up the stack with condition and destination (note: stack is LIFO)
    try frame.stack.push(5); // Destination is position 5 (JUMPDEST)
    try frame.stack.push(1); // Condition is true (non-zero)
    frame.pc = 4; // PC is at the JUMPI opcode
    
    // Create a mock interpreter
    var interpreter = Interpreter{
        .gas = 100000,
        .readOnly = false,
        .evm = undefined,
    };
    
    // Execute the JUMPI opcode
    _ = try opJumpi(frame.pc, &interpreter, &frame);
    
    // Check if PC was updated correctly (should be at JUMPDEST minus 1)
    try testing.expectEqual(@as(usize, 4), frame.pc);
}

test "JUMPI opcode - condition false" {
    const allocator = testing.allocator;
    
    // Create a simple contract with JUMPDEST at position 5
    const code = [_]u8{ 0x60, 0x04, 0x60, 0x00, 0x57, 0x5B, 0x00 }; // PUSH1 0x04, PUSH1 0x00, JUMPI, JUMPDEST, STOP
    var contract = try allocator.create(Frame.Contract);
    defer allocator.destroy(contract);
    
    contract.* = .{
        .code = try allocator.alloc(u8, code.len),
        .address = undefined,
        .caller = undefined,
        .value = 0,
    };
    defer allocator.free(contract.code);
    std.mem.copy(u8, contract.code, &code);
    
    // Create a frame with the contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up the stack with condition and destination (note: stack is LIFO)
    try frame.stack.push(5); // Destination
    try frame.stack.push(0); // Condition is false (zero)
    frame.pc = 4; // PC is at the JUMPI opcode
    
    // Create a mock interpreter
    var interpreter = Interpreter{
        .gas = 100000,
        .readOnly = false,
        .evm = undefined,
    };
    
    // Execute the JUMPI opcode
    _ = try opJumpi(frame.pc, &interpreter, &frame);
    
    // Check if PC was not updated (should remain at JUMPI)
    try testing.expectEqual(@as(usize, 4), frame.pc);
}

test "PC opcode" {
    const allocator = testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0x58, 0x00 }; // PC, STOP
    var contract = try allocator.create(Frame.Contract);
    defer allocator.destroy(contract);
    
    contract.* = .{
        .code = try allocator.alloc(u8, code.len),
        .address = undefined,
        .caller = undefined,
        .value = 0,
    };
    defer allocator.free(contract.code);
    std.mem.copy(u8, contract.code, &code);
    
    // Create a frame with the contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    frame.pc = 0; // PC is at the PC opcode
    
    // Create a mock interpreter
    var interpreter = Interpreter{
        .gas = 100000,
        .readOnly = false,
        .evm = undefined,
    };
    
    // Execute the PC opcode
    _ = try opPc(frame.pc, &interpreter, &frame);
    
    // Check if the stack contains the correct PC value
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    const pc_value = frame.stack.data[0];
    try testing.expectEqual(@as(u256, 0), pc_value); // PC was 0 when executed
}

test "JUMPDEST opcode" {
    const allocator = testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0x5B, 0x00 }; // JUMPDEST, STOP
    var contract = try allocator.create(Frame.Contract);
    defer allocator.destroy(contract);
    
    contract.* = .{
        .code = try allocator.alloc(u8, code.len),
        .address = undefined,
        .caller = undefined,
        .value = 0,
    };
    defer allocator.free(contract.code);
    std.mem.copy(u8, contract.code, &code);
    
    // Create a frame with the contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    frame.pc = 0; // PC is at the JUMPDEST opcode
    
    // Create a mock interpreter
    var interpreter = Interpreter{
        .gas = 100000,
        .readOnly = false,
        .evm = undefined,
    };
    
    // Execute the JUMPDEST opcode
    const result = try opJumpdest(frame.pc, &interpreter, &frame);
    
    // JUMPDEST does nothing, just check that it returns empty string
    try testing.expectEqualStrings("", result);
}

test "STOP opcode" {
    const allocator = testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0x00 }; // STOP
    var contract = try allocator.create(Frame.Contract);
    defer allocator.destroy(contract);
    
    contract.* = .{
        .code = try allocator.alloc(u8, code.len),
        .address = undefined,
        .caller = undefined,
        .value = 0,
    };
    defer allocator.free(contract.code);
    std.mem.copy(u8, contract.code, &code);
    
    // Create a frame with the contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Create a mock interpreter
    var interpreter = Interpreter{
        .gas = 100000,
        .readOnly = false,
        .evm = undefined,
    };
    
    // Execute the STOP opcode and expect STOP error
    const result = opStop(0, &interpreter, &frame);
    try testing.expectError(ExecutionError.STOP, result);
}

test "RETURN opcode" {
    const allocator = testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0xF3 }; // RETURN
    var contract = try allocator.create(Frame.Contract);
    defer allocator.destroy(contract);
    
    contract.* = .{
        .code = try allocator.alloc(u8, code.len),
        .address = undefined,
        .caller = undefined,
        .value = 0,
    };
    defer allocator.free(contract.code);
    std.mem.copy(u8, contract.code, &code);
    
    // Create a frame with the contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up memory with some data
    for (0..4) |i| {
        try frame.memory.store8(i, @truncate(0xaa + i));
    }
    
    // Stack is in reverse order - first push is popped last
    try frame.stack.push(4); // size: 4 bytes
    try frame.stack.push(0); // offset: 0
    
    // Create a mock interpreter
    var interpreter = Interpreter{
        .gas = 100000,
        .readOnly = false,
        .evm = undefined,
    };
    
    // Execute the RETURN opcode
    const result = try opReturn(0, &interpreter, &frame);
    
    // Check that it returns empty string (success)
    try testing.expectEqualStrings("", result);
    
    // Check that return data was set correctly
    try testing.expect(frame.returnData != null);
    try testing.expectEqual(@as(usize, 4), frame.returnSize);
}

test "REVERT opcode" {
    const allocator = testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0xFD }; // REVERT
    var contract = try allocator.create(Frame.Contract);
    defer allocator.destroy(contract);
    
    contract.* = .{
        .code = try allocator.alloc(u8, code.len),
        .address = undefined,
        .caller = undefined,
        .value = 0,
    };
    defer allocator.free(contract.code);
    std.mem.copy(u8, contract.code, &code);
    
    // Create a frame with the contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up memory with some data
    for (0..4) |i| {
        try frame.memory.store8(i, @truncate(0xaa + i));
    }
    
    // Stack is in reverse order - first push is popped last
    try frame.stack.push(4); // size: 4 bytes
    try frame.stack.push(0); // offset: 0
    
    // Create a mock interpreter
    var interpreter = Interpreter{
        .gas = 100000,
        .readOnly = false,
        .evm = undefined,
    };
    
    // Execute the REVERT opcode and expect REVERT error
    const result = opRevert(0, &interpreter, &frame);
    try testing.expectError(ExecutionError.REVERT, result);
}

test "INVALID opcode" {
    const allocator = testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0xFE }; // INVALID
    var contract = try allocator.create(Frame.Contract);
    defer allocator.destroy(contract);
    
    contract.* = .{
        .code = try allocator.alloc(u8, code.len),
        .address = undefined,
        .caller = undefined,
        .value = 0,
    };
    defer allocator.free(contract.code);
    std.mem.copy(u8, contract.code, &code);
    
    // Create a frame with the contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Create a mock interpreter
    var interpreter = Interpreter{
        .gas = 100000,
        .readOnly = false,
        .evm = undefined,
    };
    
    // Execute the INVALID opcode and expect INVALID error
    const result = opInvalid(0, &interpreter, &frame);
    try testing.expectError(ExecutionError.INVALID, result);
}

test "SELFDESTRUCT opcode" {
    const allocator = testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0xFF }; // SELFDESTRUCT
    var contract = try allocator.create(Frame.Contract);
    defer allocator.destroy(contract);
    
    contract.* = .{
        .code = try allocator.alloc(u8, code.len),
        .address = undefined,
        .caller = undefined,
        .value = 0,
    };
    defer allocator.free(contract.code);
    std.mem.copy(u8, contract.code, &code);
    
    // Create a frame with the contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up the stack with beneficiary address
    try frame.stack.push(0x1234); // Some beneficiary address
    
    // Create a mock interpreter
    var interpreter = Interpreter{
        .gas = 100000,
        .readOnly = false,
        .evm = undefined,
    };
    
    // Execute the SELFDESTRUCT opcode
    const result = try opSelfdestruct(0, &interpreter, &frame);
    
    // Check that it returns empty string and sets stop flag
    try testing.expectEqualStrings("", result);
    try testing.expect(frame.stop);
    
    // Test with readOnly=true
    try frame.stack.push(0x1234); // Push beneficiary address again
    interpreter.readOnly = true;
    const readonly_result = opSelfdestruct(0, &interpreter, &frame);
    try testing.expectError(ExecutionError.StaticStateChange, readonly_result);
}

test "getReturnDataMemorySize" {
    const allocator = testing.allocator;
    
    // Test with valid offset and size
    var stack = Stack{ .data = undefined, .size = 0 };
    try stack.push(10); // offset
    try stack.push(20); // size
    
    const result = getReturnDataMemorySize(&stack);
    try testing.expectEqual(@as(usize, 30), result.size); // offset + size
    try testing.expectEqual(false, result.overflow);
    
    // Test with zero size
    stack.size = 0;
    try stack.push(10); // offset
    try stack.push(0); // size
    
    const zero_result = getReturnDataMemorySize(&stack);
    try testing.expectEqual(@as(usize, 0), zero_result.size);
    try testing.expectEqual(false, zero_result.overflow);
    
    // Test with insufficient stack
    stack.size = 1;
    
    const underflow_result = getReturnDataMemorySize(&stack);
    try testing.expectEqual(@as(usize, 0), underflow_result.size);
    try testing.expectEqual(false, underflow_result.overflow);
}