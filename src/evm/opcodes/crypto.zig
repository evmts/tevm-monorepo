const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const error_mapping = @import("../error_mapping.zig");

// Import helper functions from error_mapping
const stack_pop = error_mapping.stack_pop;
const stack_push = error_mapping.stack_push;
const map_memory_error = error_mapping.map_memory_error;

pub fn op_sha3(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    
    const offset = try stack_pop(&frame.stack);
    const size = try stack_pop(&frame.stack);
    
    if (size == 0) {
        // Hash of empty data = keccak256("")
        const empty_hash: u256 = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        try stack_push(&frame.stack, empty_hash);
        return Operation.ExecutionResult{};
    }
    
    if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
        return ExecutionError.Error.OutOfOffset;
    }
    
    const offset_usize = @as(usize, @intCast(offset));
    const size_usize = @as(usize, @intCast(size));
    
    // Dynamic gas cost for hashing
    const word_size = (size_usize + 31) / 32;
    const gas_cost = 6 * word_size;
    _ = vm;
    try frame.consume_gas(gas_cost);
    
    // Ensure memory is available
    _ = frame.memory.ensure_context_capacity(offset_usize + size_usize) catch |err| return map_memory_error(err);
    
    // Get data and hash
    const data = frame.memory.get_slice(offset_usize, size_usize) catch |err| return map_memory_error(err);
    
    // Calculate keccak256 hash
    var hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(data, &hash, .{});
    
    // Convert hash to u256
    var result: u256 = 0;
    for (hash) |byte| {
        result = (result << 8) | byte;
    }
    
    try stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

// Alias for backwards compatibility
pub const op_keccak256 = op_sha3;