const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const Address = @import("Address");
const from_u256 = Address.from_u256;

// Helper to convert Stack errors to ExecutionError
fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| switch (err) {
        Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
}

fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

pub fn op_stop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    
    return ExecutionError.Error.STOP;
}

pub fn op_jump(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const dest = try stack_pop(&frame.stack);
    
    if (dest > std.math.maxInt(usize)) {
        return ExecutionError.Error.InvalidJump;
    }
    
    const dest_usize = @as(usize, @intCast(dest));
    
    // Check if destination is a valid JUMPDEST
    if (!frame.contract.valid_jumpdest(dest_usize)) {
        return ExecutionError.Error.InvalidJump;
    }
    
    frame.pc = dest_usize;
    
    return Operation.ExecutionResult{};
}

pub fn op_jumpi(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const dest = try stack_pop(&frame.stack);
    const condition = try stack_pop(&frame.stack);
    
    if (condition != 0) {
        if (dest > std.math.maxInt(usize)) {
            return ExecutionError.Error.InvalidJump;
        }
        
        const dest_usize = @as(usize, @intCast(dest));
        
        // Check if destination is a valid JUMPDEST
        if (!frame.contract.valid_jumpdest(dest_usize)) {
            return ExecutionError.Error.InvalidJump;
        }
        
        frame.pc = dest_usize;
    }
    
    return Operation.ExecutionResult{};
}

pub fn op_pc(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    try stack_push(&frame.stack, @as(u256, @intCast(pc)));
    
    return Operation.ExecutionResult{};
}

pub fn op_jumpdest(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    
    // No-op, just marks valid jump destination
    return Operation.ExecutionResult{};
}

pub fn op_return(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));
        
        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);
            
            _ = frame.memory.ensure_context_capacity(end) catch return ExecutionError.Error.OutOfOffset;
        }
        
        // Get data from memory
        const data = frame.memory.get_slice(offset_usize, size_usize) catch return ExecutionError.Error.OutOfOffset;
        
        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        frame.return_data_buffer = data;
    }
    
    return ExecutionError.Error.STOP; // RETURN ends execution normally
}

pub fn op_revert(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
            return ExecutionError.Error.OutOfOffset;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));
        
        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);
            
            _ = frame.memory.ensure_context_capacity(end) catch return ExecutionError.Error.OutOfOffset;
        }
        
        // Get data from memory
        const data = frame.memory.get_slice(offset_usize, size_usize) catch return ExecutionError.Error.OutOfOffset;
        
        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        frame.return_data_buffer = data;
    }
    
    return ExecutionError.Error.REVERT;
}

pub fn op_invalid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    
    return ExecutionError.Error.InvalidOpcode;
}

pub fn op_selfdestruct(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    // Check if we're in a static call
    if (frame.is_static) {
        return ExecutionError.Error.WriteProtection;
    }
    
    const beneficiary_u256 = try stack_pop(&frame.stack);
    const beneficiary = from_u256(beneficiary_u256);
    
    // EIP-2929: Check if beneficiary address is cold and consume appropriate gas
    const is_cold = vm.mark_address_warm(beneficiary) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }
    
    // TODO: Schedule selfdestruct
    // For now, just return STOP
    
    return ExecutionError.Error.STOP;
}