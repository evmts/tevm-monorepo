const ExecutionError = @import("../execution/execution_error.zig");
const Contract = @import("../frame/contract.zig");
const RunResult = @import("run_result.zig").RunResult;
const Vm = @import("../vm.zig");

/// Execute contract bytecode in read-only mode.
/// Identical to interpret() but prevents any state modifications.
/// Used for view functions and static analysis.
pub fn interpret_static(self: *Vm, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, true);
}