const std = @import("std");
const ExecutionError = @import("../execution/execution_error.zig");
const Contract = @import("../frame/contract.zig");
const Frame = @import("../frame/frame.zig");
const Operation = @import("../opcodes/operation.zig");
const RunResult = @import("run_result.zig").RunResult;
const Log = @import("../log.zig");
const Vm = @import("../vm.zig");

/// Core bytecode execution with configurable static context.
/// Runs the main VM loop, executing opcodes sequentially while tracking
/// gas consumption and handling control flow changes.
pub fn interpret_with_context(self: *Vm, contract: *Contract, input: []const u8, is_static: bool) ExecutionError.Error!RunResult {
    @branchHint(.likely);
    Log.debug("VM.interpret_with_context: Starting execution, depth={}, gas={}, static={}", .{ self.depth, contract.gas, is_static });

    self.depth += 1;
    defer self.depth -= 1;

    const prev_read_only = self.read_only;
    defer self.read_only = prev_read_only;

    self.read_only = self.read_only or is_static;

    const initial_gas = contract.gas;
    var pc: usize = 0;
    var frame = try Frame.init(self.allocator, contract);
    defer frame.deinit();
    frame.memory.finalize_root();
    frame.is_static = self.read_only;
    frame.depth = @as(u32, @intCast(self.depth));
    frame.input = input;
    frame.gas_remaining = contract.gas;

    const interpreter_ptr = @as(*Operation.Interpreter, @ptrCast(self));
    const state_ptr = @as(*Operation.State, @ptrCast(&frame));

    while (pc < contract.code_size) {
        @branchHint(.likely);
        const opcode = contract.get_op(pc);
        frame.pc = pc;

        const result = self.table.execute(pc, interpreter_ptr, state_ptr, opcode) catch |err| {
            @branchHint(.cold);
            contract.gas = frame.gas_remaining;
            self.return_data = @constCast(frame.return_data.get());

            var output: ?[]const u8 = null;
            const return_data = frame.return_data.get();
            if (return_data.len > 0) {
                output = self.allocator.dupe(u8, return_data) catch {
                    // We are out of memory, which is a critical failure. The safest way to
                    // handle this is to treat it as an OutOfGas error, which consumes
                    // all gas and stops execution.
                    return RunResult.init(initial_gas, 0, .OutOfGas, ExecutionError.Error.OutOfMemory, null);
                };
            }

            return switch (err) {
                ExecutionError.Error.InvalidOpcode => {
                    @branchHint(.cold);
                    // INVALID opcode consumes all remaining gas
                    frame.gas_remaining = 0;
                    contract.gas = 0;
                    return RunResult.init(initial_gas, 0, .Invalid, err, output);
                },
                ExecutionError.Error.STOP => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Success, null, output);
                },
                ExecutionError.Error.REVERT => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Revert, err, output);
                },
                ExecutionError.Error.OutOfGas => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .OutOfGas, err, output);
                },
                ExecutionError.Error.InvalidJump,
                ExecutionError.Error.StackUnderflow,
                ExecutionError.Error.StackOverflow,
                ExecutionError.Error.StaticStateChange,
                ExecutionError.Error.WriteProtection,
                ExecutionError.Error.DepthLimit,
                ExecutionError.Error.MaxCodeSizeExceeded,
                ExecutionError.Error.OutOfMemory,
                => {
                    @branchHint(.cold);
                    return RunResult.init(initial_gas, frame.gas_remaining, .Invalid, err, output);
                },
                else => return err, // Unexpected error
            };
        };

        if (frame.pc != pc) {
            @branchHint(.likely);
            pc = frame.pc;
        } else {
            pc += result.bytes_consumed;
        }
    }

    contract.gas = frame.gas_remaining;
    self.return_data = @constCast(frame.return_data.get());

    const return_data = frame.return_data.get();
    const output: ?[]const u8 = if (return_data.len > 0) try self.allocator.dupe(u8, return_data) else null;

    return RunResult.init(
        initial_gas,
        frame.gas_remaining,
        .Success,
        null,
        output,
    );
}