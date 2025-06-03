const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");

// Helper to convert Stack errors to ExecutionError
inline fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| switch (err) {
        Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
}

inline fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

pub fn op_pop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    _ = try stack_pop(&frame.stack);
    
    return Operation.ExecutionResult{};
}

pub fn op_push0(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    try stack_push(&frame.stack, 0);
    
    return Operation.ExecutionResult{};
}

// Generate push operations for PUSH1 through PUSH32
pub fn make_push(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn push(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = interpreter;
            
            const frame = @as(*Frame, @ptrCast(@alignCast(state)));
            
            // Read n bytes from code after PC
            var value: u256 = 0;
            const code = frame.contract.code;
            
            for (0..n) |i| {
                if (pc + 1 + i < code.len) {
                    value = (value << 8) | code[pc + 1 + i];
                } else {
                    value = value << 8;
                }
            }
            
            try stack_push(&frame.stack, value);
            
            // PUSH operations consume 1 + n bytes
            // (1 for the opcode itself, n for the immediate data)
            return Operation.ExecutionResult{ .bytes_consumed = 1 + n };
        }
    }.push;
}

// Generate all PUSH operations
pub const op_push1 = make_push(1);
pub const op_push2 = make_push(2);
pub const op_push3 = make_push(3);
pub const op_push4 = make_push(4);
pub const op_push5 = make_push(5);
pub const op_push6 = make_push(6);
pub const op_push7 = make_push(7);
pub const op_push8 = make_push(8);
pub const op_push9 = make_push(9);
pub const op_push10 = make_push(10);
pub const op_push11 = make_push(11);
pub const op_push12 = make_push(12);
pub const op_push13 = make_push(13);
pub const op_push14 = make_push(14);
pub const op_push15 = make_push(15);
pub const op_push16 = make_push(16);
pub const op_push17 = make_push(17);
pub const op_push18 = make_push(18);
pub const op_push19 = make_push(19);
pub const op_push20 = make_push(20);
pub const op_push21 = make_push(21);
pub const op_push22 = make_push(22);
pub const op_push23 = make_push(23);
pub const op_push24 = make_push(24);
pub const op_push25 = make_push(25);
pub const op_push26 = make_push(26);
pub const op_push27 = make_push(27);
pub const op_push28 = make_push(28);
pub const op_push29 = make_push(29);
pub const op_push30 = make_push(30);
pub const op_push31 = make_push(31);
pub const op_push32 = make_push(32);

// Generate dup operations
pub fn make_dup(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn dup(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;
            _ = interpreter;
            
            const frame = @as(*Frame, @ptrCast(@alignCast(state)));
            
            // Duplicate the nth item from the top
            frame.stack.dup(n) catch |err| switch (err) {
                Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
                Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
                Stack.Error.OutOfBounds => return ExecutionError.Error.StackUnderflow,
                Stack.Error.InvalidPosition => return ExecutionError.Error.StackUnderflow,
            };
            
            return Operation.ExecutionResult{};
        }
    }.dup;
}

// Generate all DUP operations
pub const op_dup1 = make_dup(1);
pub const op_dup2 = make_dup(2);
pub const op_dup3 = make_dup(3);
pub const op_dup4 = make_dup(4);
pub const op_dup5 = make_dup(5);
pub const op_dup6 = make_dup(6);
pub const op_dup7 = make_dup(7);
pub const op_dup8 = make_dup(8);
pub const op_dup9 = make_dup(9);
pub const op_dup10 = make_dup(10);
pub const op_dup11 = make_dup(11);
pub const op_dup12 = make_dup(12);
pub const op_dup13 = make_dup(13);
pub const op_dup14 = make_dup(14);
pub const op_dup15 = make_dup(15);
pub const op_dup16 = make_dup(16);

// Generate swap operations
pub fn make_swap(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn swap(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;
            _ = interpreter;
            
            const frame = @as(*Frame, @ptrCast(@alignCast(state)));
            
            // Swap the top item with the nth item
            frame.stack.swap(n) catch |err| switch (err) {
                Stack.Error.OutOfBounds => return ExecutionError.Error.StackUnderflow,
                Stack.Error.InvalidPosition => return ExecutionError.Error.StackUnderflow,
                else => return ExecutionError.Error.StackUnderflow,
            };
            
            return Operation.ExecutionResult{};
        }
    }.swap;
}

// Generate all SWAP operations
pub const op_swap1 = make_swap(1);
pub const op_swap2 = make_swap(2);
pub const op_swap3 = make_swap(3);
pub const op_swap4 = make_swap(4);
pub const op_swap5 = make_swap(5);
pub const op_swap6 = make_swap(6);
pub const op_swap7 = make_swap(7);
pub const op_swap8 = make_swap(8);
pub const op_swap9 = make_swap(9);
pub const op_swap10 = make_swap(10);
pub const op_swap11 = make_swap(11);
pub const op_swap12 = make_swap(12);
pub const op_swap13 = make_swap(13);
pub const op_swap14 = make_swap(14);
pub const op_swap15 = make_swap(15);
pub const op_swap16 = make_swap(16);