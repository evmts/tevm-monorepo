const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");

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

fn make_log(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error![]const u8 {
    return struct {
        pub fn log(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
            _ = pc;
            
            const frame = @as(*Frame, @ptrCast(@alignCast(state)));
            const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
            
            // Check if we're in a static call
            if (frame.is_static) {
                return ExecutionError.Error.WriteProtection;
            }
            
            const offset = try stack_pop(&frame.stack);
            const size = try stack_pop(&frame.stack);
            
            var topics: [4]u256 = undefined;
            for (0..n) |i| {
                topics[i] = try stack_pop(&frame.stack);
            }
            
            if (size == 0) {
                // Empty data
                // TODO: Add log
                _ = vm;
                return "";
            }
            
            if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
                return ExecutionError.Error.OutOfOffset;
            }
            
            const offset_usize = @as(usize, @intCast(offset));
            const size_usize = @as(usize, @intCast(size));
            
            // Dynamic gas for data
            const byte_cost = 8 * size_usize;
            // TODO: consume gas
            _ = byte_cost;
            _ = vm;
            
            // Ensure memory is available
            _ = frame.memory.ensure_context_capacity(offset_usize + size_usize) catch return ExecutionError.Error.OutOfOffset;
            
            // Get log data
            const data = frame.memory.get_slice(offset_usize, size_usize) catch return ExecutionError.Error.OutOfOffset;
            
            // Add log
            // TODO: Add log
            _ = vm;
            _ = data;
            
            return "";
        }
    }.log;
}

pub const op_log0 = make_log(0);
pub const op_log1 = make_log(1);
pub const op_log2 = make_log(2);
pub const op_log3 = make_log(3);
pub const op_log4 = make_log(4);