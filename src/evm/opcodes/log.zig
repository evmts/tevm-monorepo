const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../gas_constants.zig");
const Address = @import("Address");
const error_mapping = @import("../error_mapping.zig");

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
                try vm.emit_log(frame.contract.address, topics[0..n], &[_]u8{});
                return Operation.ExecutionResult{};
            }
            
            if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
                return ExecutionError.Error.OutOfOffset;
            }
            
            const offset_usize = @as(usize, @intCast(offset));
            const size_usize = @as(usize, @intCast(size));
            
            // Calculate memory expansion gas cost
            const current_size = frame.memory.context_size();
            const new_size = offset_usize + size_usize;
            const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
            try frame.consume_gas(memory_gas);
            
            // Dynamic gas for data
            const byte_cost = 8 * size_usize;
            try frame.consume_gas(byte_cost);
            
            // Ensure memory is available
            _ = frame.memory.ensure_context_capacity(offset_usize + size_usize) catch |err| return map_memory_error(err);
            
            // Get log data
            const data = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);
            
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