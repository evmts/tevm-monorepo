const std = @import("std");
const Allocator = std.mem.Allocator;

// Import existing EVM components
const Stack = @import("stack/stack.zig");
const Memory = @import("memory/memory.zig");
const execution = @import("execution/package.zig");
const Opcode = @import("opcodes/opcode.zig").Enum;
const Operation = @import("opcodes/operation.zig");
const Frame = @import("frame/frame.zig");
const Contract = @import("frame/contract.zig");
const ExecutionError = @import("execution/execution_error.zig");
const ReturnData = @import("vm/return_data.zig").ReturnData;
const Address = @import("Address");

// Execution context
pub const Context = struct {
    caller: Address.Address,
    value: u256,
    calldata: []const u8,
};

// Execution result
pub const ExecutionResult = struct {
    success: bool,
    return_data: []u8,
};

// Minimal interpreter structure that simulates the real interpreter
const MiniInterpreter = struct {
    allocator: Allocator,
    return_data: []const u8,
    depth: usize,
};

// Main execution function
pub fn execute(allocator: Allocator, code: []const u8, context: Context) !ExecutionResult {
    // Create a minimal contract to hold the code
    const address = Address.zero();
    var code_hash: [32]u8 = undefined;
    @memset(&code_hash, 0);

    var contract = Contract.init(
        context.caller,
        address,
        context.value,
        std.math.maxInt(u64), // No gas limit for mini EVM
        code,
        code_hash,
        context.calldata,
        false, // not static
    );

    // Initialize frame with the contract
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    frame.memory.finalize_root();
    frame.input = context.calldata;
    frame.gas_remaining = std.math.maxInt(u64); // No gas tracking

    // Create interpreter
    var interpreter = MiniInterpreter{
        .allocator = allocator,
        .return_data = &[_]u8{},
        .depth = 0,
    };

    const interpreter_ptr = @as(*Operation.Interpreter, @ptrCast(&interpreter));
    const state_ptr = @as(*Operation.State, @ptrCast(&frame));

    // Main execution loop with error handling
    var pc: usize = 0;
    while (pc < contract.code_size) {
        const opcode_byte = contract.get_op(pc);
        frame.pc = pc;

        // Execute opcodes with error handling for control flow
        execute_opcode(opcode_byte, pc, interpreter_ptr, state_ptr, &frame) catch |err| {
            switch (err) {
                ExecutionError.Error.STOP => {
                    // Normal termination - check if we have output data set by RETURN
                    const output_data = frame.output;
                    const output = if (output_data.len > 0)
                        try allocator.dupe(u8, output_data)
                    else
                        try allocator.alloc(u8, 0);

                    return ExecutionResult{
                        .success = true,
                        .return_data = output,
                    };
                },
                ExecutionError.Error.REVERT => {
                    // Revert with output data
                    const output_data = frame.output;
                    const output = if (output_data.len > 0)
                        try allocator.dupe(u8, output_data)
                    else
                        try allocator.alloc(u8, 0);

                    return ExecutionResult{
                        .success = false,
                        .return_data = output,
                    };
                },
                else => return err,
            }
        };

        // Update program counter
        if (frame.pc != pc) {
            // Jump occurred or PUSH consumed extra bytes
            pc = frame.pc;
        } else {
            // Normal execution, advance by 1
            pc += 1;
        }
    }

    // Execution completed without explicit return
    return ExecutionResult{
        .success = true,
        .return_data = try allocator.alloc(u8, 0),
    };
}

fn execute_opcode(opcode_byte: u8, pc: usize, interpreter_ptr: *Operation.Interpreter, state_ptr: *Operation.State, frame: *Frame) !void {
    const opcode: Opcode = @enumFromInt(opcode_byte);
    // Direct switch statement for opcode execution
    // We need to validate stack requirements before each operation since we're not using the jump table
    switch (opcode) {
        // Stop and Arithmetic Operations
        .STOP => return ExecutionError.Error.STOP,
        .ADD => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.arithmetic.op_add(pc, interpreter_ptr, state_ptr);
        },
        .MUL => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.arithmetic.op_mul(pc, interpreter_ptr, state_ptr);
        },
        .SUB => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.arithmetic.op_sub(pc, interpreter_ptr, state_ptr);
        },
        .DIV => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.arithmetic.op_div(pc, interpreter_ptr, state_ptr);
        },
        .MOD => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.arithmetic.op_mod(pc, interpreter_ptr, state_ptr);
        },

        // Comparison & Bitwise Logic Operations
        .LT => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.comparison.op_lt(pc, interpreter_ptr, state_ptr);
        },
        .GT => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.comparison.op_gt(pc, interpreter_ptr, state_ptr);
        },
        .EQ => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.comparison.op_eq(pc, interpreter_ptr, state_ptr);
        },
        .ISZERO => {
            if (frame.stack.size < 1) return ExecutionError.Error.StackUnderflow;
            _ = try execution.comparison.op_iszero(pc, interpreter_ptr, state_ptr);
        },
        .AND => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.bitwise.op_and(pc, interpreter_ptr, state_ptr);
        },
        .OR => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.bitwise.op_or(pc, interpreter_ptr, state_ptr);
        },
        .NOT => {
            if (frame.stack.size < 1) return ExecutionError.Error.StackUnderflow;
            _ = try execution.bitwise.op_not(pc, interpreter_ptr, state_ptr);
        },

        // Memory Operations
        .MLOAD => {
            if (frame.stack.size < 1) return ExecutionError.Error.StackUnderflow;
            _ = try execution.memory.op_mload(pc, interpreter_ptr, state_ptr);
        },
        .MSTORE => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.memory.op_mstore(pc, interpreter_ptr, state_ptr);
        },

        // Stack Operations
        .POP => {
            if (frame.stack.size < 1) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.op_pop(pc, interpreter_ptr, state_ptr);
        },
        .PUSH0 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.op_push0(pc, interpreter_ptr, state_ptr);
        },
        .PUSH1 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(1)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH2 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(2)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH3 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(3)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH4 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(4)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH5 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(5)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH6 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(6)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH7 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(7)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH8 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(8)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH9 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(9)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH10 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(10)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH11 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(11)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH12 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(12)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH13 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(13)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH14 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(14)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH15 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(15)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH16 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(16)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH17 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(17)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH18 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(18)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH19 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(19)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH20 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(20)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH21 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(21)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH22 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(22)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH23 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(23)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH24 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(24)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH25 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(25)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH26 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(26)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH27 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(27)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH28 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(28)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH29 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(29)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH30 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(30)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH31 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(31)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .PUSH32 => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            const result = try execution.stack.make_push(32)(pc, interpreter_ptr, state_ptr);
            frame.pc = pc + result.bytes_consumed;
        },
        .DUP1 => {
            if (frame.stack.size < 1) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(1)(pc, interpreter_ptr, state_ptr);
        },
        .DUP2 => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(2)(pc, interpreter_ptr, state_ptr);
        },
        .DUP3 => {
            if (frame.stack.size < 3) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(3)(pc, interpreter_ptr, state_ptr);
        },
        .DUP4 => {
            if (frame.stack.size < 4) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(4)(pc, interpreter_ptr, state_ptr);
        },
        .DUP5 => {
            if (frame.stack.size < 5) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(5)(pc, interpreter_ptr, state_ptr);
        },
        .DUP6 => {
            if (frame.stack.size < 6) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(6)(pc, interpreter_ptr, state_ptr);
        },
        .DUP7 => {
            if (frame.stack.size < 7) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(7)(pc, interpreter_ptr, state_ptr);
        },
        .DUP8 => {
            if (frame.stack.size < 8) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(8)(pc, interpreter_ptr, state_ptr);
        },
        .DUP9 => {
            if (frame.stack.size < 9) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(9)(pc, interpreter_ptr, state_ptr);
        },
        .DUP10 => {
            if (frame.stack.size < 10) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(10)(pc, interpreter_ptr, state_ptr);
        },
        .DUP11 => {
            if (frame.stack.size < 11) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(11)(pc, interpreter_ptr, state_ptr);
        },
        .DUP12 => {
            if (frame.stack.size < 12) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(12)(pc, interpreter_ptr, state_ptr);
        },
        .DUP13 => {
            if (frame.stack.size < 13) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(13)(pc, interpreter_ptr, state_ptr);
        },
        .DUP14 => {
            if (frame.stack.size < 14) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(14)(pc, interpreter_ptr, state_ptr);
        },
        .DUP15 => {
            if (frame.stack.size < 15) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(15)(pc, interpreter_ptr, state_ptr);
        },
        .DUP16 => {
            if (frame.stack.size < 16) return ExecutionError.Error.StackUnderflow;
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.stack.make_dup(16)(pc, interpreter_ptr, state_ptr);
        },

        .SWAP1 => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(1)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP2 => {
            if (frame.stack.size < 3) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(2)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP3 => {
            if (frame.stack.size < 4) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(3)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP4 => {
            if (frame.stack.size < 5) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(4)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP5 => {
            if (frame.stack.size < 6) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(5)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP6 => {
            if (frame.stack.size < 7) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(6)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP7 => {
            if (frame.stack.size < 8) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(7)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP8 => {
            if (frame.stack.size < 9) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(8)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP9 => {
            if (frame.stack.size < 10) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(9)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP10 => {
            if (frame.stack.size < 11) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(10)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP11 => {
            if (frame.stack.size < 12) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(11)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP12 => {
            if (frame.stack.size < 13) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(12)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP13 => {
            if (frame.stack.size < 14) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(13)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP14 => {
            if (frame.stack.size < 15) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(14)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP15 => {
            if (frame.stack.size < 16) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(15)(pc, interpreter_ptr, state_ptr);
        },
        .SWAP16 => {
            if (frame.stack.size < 17) return ExecutionError.Error.StackUnderflow;
            _ = try execution.stack.make_swap(16)(pc, interpreter_ptr, state_ptr);
        },

        // Control Flow
        .JUMP => {
            if (frame.stack.size < 1) return ExecutionError.Error.StackUnderflow;
            _ = try execution.control.op_jump(pc, interpreter_ptr, state_ptr);
        },
        .JUMPI => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.control.op_jumpi(pc, interpreter_ptr, state_ptr);
        },
        .PC => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.control.op_pc(pc, interpreter_ptr, state_ptr);
        },
        .JUMPDEST => {
            _ = try execution.control.op_jumpdest(pc, interpreter_ptr, state_ptr);
        },

        // Environmental Information
        .CALLER => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.environment.op_caller(pc, interpreter_ptr, state_ptr);
        },
        .CALLVALUE => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.environment.op_callvalue(pc, interpreter_ptr, state_ptr);
        },
        .CALLDATALOAD => {
            if (frame.stack.size < 1) return ExecutionError.Error.StackUnderflow;
            _ = try execution.environment.op_calldataload(pc, interpreter_ptr, state_ptr);
        },
        .CALLDATASIZE => {
            if (frame.stack.size >= Stack.CAPACITY) return ExecutionError.Error.StackOverflow;
            _ = try execution.environment.op_calldatasize(pc, interpreter_ptr, state_ptr);
        },

        // System operations
        .RETURN => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.control.op_return(pc, interpreter_ptr, state_ptr);
            unreachable; // op_return throws STOP error
        },
        .REVERT => {
            if (frame.stack.size < 2) return ExecutionError.Error.StackUnderflow;
            _ = try execution.control.op_revert(pc, interpreter_ptr, state_ptr);
            unreachable; // op_revert throws REVERT error
        },

        // For any unsupported opcodes
        else => return ExecutionError.Error.InvalidOpcode,
    }
}
