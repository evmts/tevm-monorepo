const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const Address = @import("Address");
const error_mapping = @import("../error_mapping.zig");

// Compile-time verification that this file is being used
const COMPILE_TIME_LOG_VERSION = "2024_LOG_FIX_V2";

// Import Log struct from VM
const Log = Vm.Log;

// Import helper functions from error_mapping
const stack_pop = error_mapping.stack_pop;
const stack_push = error_mapping.stack_push;
const map_memory_error = error_mapping.map_memory_error;

fn make_log(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn log(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));
            const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

<<<<<<< Updated upstream
=======
            // Always print to see if function is called
            std.debug.print("*** LOG{}: FUNCTION CALLED ***\n", .{n});

>>>>>>> Stashed changes
            if (@import("builtin").mode == .Debug) {
                std.debug.print("LOG{}: gas_remaining={}\n", .{ n, frame.gas_remaining });
            }

            // Check if we're in a static call
            if (frame.is_static) {
                return ExecutionError.Error.WriteProtection;
            }

<<<<<<< Updated upstream
            // Pop offset and size first (correct order: offset is on top, then size)
            const offset = try stack_pop(&frame.stack);
            const size = try stack_pop(&frame.stack);
=======
            // Pop size and offset first (correct order: size is on top, then offset)
            const size = try stack_pop(&frame.stack);
            const offset = try stack_pop(&frame.stack);

            // ALWAYS print key debug info to understand the issue
            std.debug.print("*** LOG{}: size={}, offset={}, memory_size={} ***\n", .{ n, size, offset, frame.memory.context_size() });
>>>>>>> Stashed changes

            if (@import("builtin").mode == .Debug) {
                std.debug.print("LOG{}: popped size={}, offset={}\n", .{ n, size, offset });
                std.debug.print("LOG{}: current memory size={}\n", .{ n, frame.memory.context_size() });
            }

            var topics: [4]u256 = undefined;
            // Then pop topics (they come in reverse order from stack)
            // Pop from stack and store in reverse order to maintain correct topic order
            for (0..n) |i| {
<<<<<<< Updated upstream
                topics[n - 1 - i] = try stack_pop(&frame.stack);
                if (@import("builtin").mode == .Debug) {
                    std.debug.print("LOG{}: popped topic[{}]={}\n", .{ n, n - 1 - i, topics[n - 1 - i] });
=======
                topics[i] = try stack_pop(&frame.stack);
                if (@import("builtin").mode == .Debug) {
                    std.debug.print("LOG{}: popped topic[{}]={}\n", .{ n, i, topics[i] });
>>>>>>> Stashed changes
                }
            }

            if (size == 0) {
                // Empty data
                if (@import("builtin").mode == .Debug) {
                    std.debug.print("LOG{}: emitting empty log\n", .{n});
                }
                try vm.emit_log(frame.contract.address, topics[0..n], &[_]u8{});
                return Operation.ExecutionResult{};
            }

            if (@import("builtin").mode == .Debug) {
                std.debug.print("LOG{}: NON-EMPTY data path, size={}\n", .{ n, size });
            }

            if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
                if (@import("builtin").mode == .Debug) {
                    std.debug.print("LOG{}: OutOfOffset - offset={}, size={}\n", .{ n, offset, size });
                }
                return ExecutionError.Error.OutOfOffset;
            }

            const offset_usize = @as(usize, @intCast(offset));
            const size_usize = @as(usize, @intCast(size));

            if (@import("builtin").mode == .Debug) {
                std.debug.print("LOG{}: offset_usize={}, size_usize={}\n", .{ n, offset_usize, size_usize });
            }

            // Note: Base LOG gas (375) and topic gas (375 * N) are handled by jump table as constant_gas
            // We only need to handle dynamic costs: memory expansion and data bytes

            // 1. Calculate memory expansion gas cost
            const current_size = frame.memory.context_size();
            const new_size = offset_usize + size_usize;
            const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);

            if (@import("builtin").mode == .Debug) {
                std.debug.print("LOG{}: memory expansion: current={}, new={}, gas_cost={}\n", .{ n, current_size, new_size, memory_gas });
            }

            try frame.consume_gas(memory_gas);

            // 2. Dynamic gas for data
            const byte_cost = gas_constants.LogDataGas * size_usize;

            if (@import("builtin").mode == .Debug) {
                std.debug.print("LOG{}: byte_cost={} (8 * {})\n", .{ n, byte_cost, size_usize });
<<<<<<< Updated upstream
=======
                std.debug.print("LOG{}: about to consume byte_cost gas\n", .{n});
>>>>>>> Stashed changes
            }

            try frame.consume_gas(byte_cost);

            if (@import("builtin").mode == .Debug) {
                std.debug.print("LOG{}: successfully consumed byte_cost gas\n", .{n});
            }

            // Ensure memory is available
            _ = frame.memory.ensure_context_capacity(offset_usize + size_usize) catch |err| {
                if (@import("builtin").mode == .Debug) {
                    std.debug.print("LOG{}: memory ensure_context_capacity failed: {}\n", .{ n, err });
                }
                return map_memory_error(err);
            };

            // Get log data
            const data = frame.memory.get_slice(offset_usize, size_usize) catch |err| {
                if (@import("builtin").mode == .Debug) {
                    std.debug.print("LOG{}: memory get_slice failed: {}\n", .{ n, err });
                }
                return map_memory_error(err);
            };

            if (@import("builtin").mode == .Debug) {
                std.debug.print("LOG{}: emitting log with data len={}, data={any}\n", .{ n, data.len, data });
            }

            // Add log
            try vm.emit_log(frame.contract.address, topics[0..n], data);

            return Operation.ExecutionResult{};
        }
    }.log;
}

pub const op_log0 = make_log(0);
pub const op_log1 = make_log(1);
pub const op_log2 = make_log(2);
pub const op_log3 = make_log(3);
pub const op_log4 = make_log(4);
