const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame/frame.zig");

pub fn op_pop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    _ = try frame.stack.pop();

    return Operation.ExecutionResult{};
}

pub fn op_push0(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try frame.stack.append(0);

    return Operation.ExecutionResult{};
}

// Generate push operations for PUSH1 through PUSH32
pub fn make_push(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn push(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            if (frame.stack.size >= Stack.CAPACITY) {
                @branchHint(.cold);
                unreachable;
            }

            var value: u256 = 0;
            const code = frame.contract.code;

            for (0..n) |i| {
                if (pc + 1 + i < code.len) {
                    @branchHint(.likely);
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

            if (frame.stack.size < n) {
                @branchHint(.cold);
                unreachable;
            }
            if (frame.stack.size >= Stack.CAPACITY) {
                @branchHint(.cold);
                unreachable;
            }

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

            if (frame.stack.size < n + 1) {
                @branchHint(.cold);
                unreachable;
            }

            frame.stack.swapUnsafe(n);

            return Operation.ExecutionResult{};
        }
    }.swap;
}

// SWAP operations are now generated directly in jump_table.zig using make_swap()
