const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");

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

            std.debug.assert(frame.stack.size < Stack.CAPACITY);

            var value: u256 = 0;
            const code = frame.contract.code;

            for (0..n) |i| {
                if (pc + 1 + i < code.len) {
                    value = (value << 8) | code[pc + 1 + i];
                } else {
                    value = value << 8;
                }
            }

            frame.stack.append_unsafe(value);

            // PUSH operations consume 1 + n bytes
            // (1 for the opcode itself, n for the immediate data)
            return Operation.ExecutionResult{ .bytes_consumed = 1 + n };
        }
    }.push;
}

// PUSH operations are now generated directly in jump_table.zig using make_push()

// Generate dup operations
pub fn make_dup(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn dup(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            std.debug.assert(frame.stack.size >= n);
            std.debug.assert(frame.stack.size < Stack.CAPACITY);

            frame.stack.dup_unsafe(n);

            return Operation.ExecutionResult{};
        }
    }.dup;
}

// DUP operations are now generated directly in jump_table.zig using make_dup()

// Generate swap operations
pub fn make_swap(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn swap(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            std.debug.assert(frame.stack.size >= n + 1);

            frame.stack.swapUnsafe(n);

            return Operation.ExecutionResult{};
        }
    }.swap;
}

// SWAP operations are now generated directly in jump_table.zig using make_swap()
