const ExecutionError = @import("../execution/execution_error.zig");

/// Result of an EVM execution run.
///
/// RunResult encapsulates the outcome of executing EVM bytecode, including
/// success/failure status, gas consumption, and any output data. This is
/// the primary return type for VM execution functions.
///
/// ## Design Rationale
/// The result combines multiple pieces of information needed after execution:
/// - Status indicates how execution ended (success, revert, error)
/// - Gas tracking for accounting and refunds
/// - Output data for return values or revert messages
/// - Optional error details for debugging
///
/// ## Status Types
/// - Success: Execution completed normally
/// - Revert: Explicit revert (REVERT opcode or require failure)
/// - Invalid: Invalid operation (bad opcode, stack error, etc.)
/// - OutOfGas: Execution ran out of gas
///
/// ## Usage
/// ```zig
/// const result = vm.run(bytecode, gas_limit);
/// switch (result.status) {
///     .Success => {
///         // Process output data
///         const return_data = result.output orelse &[_]u8{};
///     },
///     .Revert => {
///         // Handle revert with reason
///         const revert_reason = result.output orelse &[_]u8{};
///     },
///     .Invalid => {
///         // Handle error
///         std.log.err("Execution failed: {?}", .{result.err});
///     },
///     .OutOfGas => {
///         // Handle out of gas
///     },
/// }
/// ```
pub const RunResult = @This();

/// Execution completion status.
///
/// Indicates how the execution ended. This maps to EVM execution outcomes:
/// - Success: Normal completion (STOP, RETURN, or end of code)
/// - Revert: Explicit revert (REVERT opcode)
/// - Invalid: Execution error (invalid opcode, stack error, etc.)
/// - OutOfGas: Gas exhausted during execution
pub const Status = enum {
    /// Execution completed successfully
    Success,
    /// Execution was explicitly reverted
    Revert,
    /// Execution failed due to invalid operation
    Invalid,
    /// Execution ran out of gas
    OutOfGas,
};
status: Status,

/// Optional execution error details.
///
/// Present when status is Invalid, providing specific error information
/// for debugging and error reporting.
err: ?ExecutionError.Error,

/// Remaining gas after execution.
///
/// For successful execution, this is refunded to the caller.
/// For failed execution, this may be zero or partially consumed.
gas_left: u64,

/// Total gas consumed during execution.
///
/// Calculated as: initial_gas - gas_left
/// Used for:
/// - Transaction receipts
/// - Gas accounting
/// - Performance monitoring
gas_used: u64,

/// Output data from execution.
///
/// Contents depend on execution status:
/// - Success: Return data from RETURN opcode
/// - Revert: Revert reason from REVERT opcode
/// - Invalid/OutOfGas: Usually null
///
/// Note: Empty output is different from null output.
/// Empty means explicit empty return, null means no return.
output: ?[]const u8,

pub fn init(
    initial_gas: u64,
    gas_left: u64,
    status: Status,
    err: ?ExecutionError.Error,
    output: ?[]const u8,
) RunResult {
    return RunResult{
        .status = status,
        .err = err,
        .gas_left = gas_left,
        .gas_used = initial_gas - gas_left,
        .output = output,
    };
}
