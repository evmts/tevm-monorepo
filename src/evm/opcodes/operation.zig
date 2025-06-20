const std = @import("std");
const Opcode = @import("opcode.zig");
const ExecutionError = @import("../execution/execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame/frame.zig");
const Memory = @import("../memory/memory.zig");

/// Operation metadata and execution functions for EVM opcodes.
///
/// This module defines the structure for EVM operations, including their
/// execution logic, gas costs, and stack requirements. Each opcode in the
/// EVM is associated with an Operation that controls its behavior.
///
/// ## Design Philosophy
/// Operations encapsulate all opcode-specific logic:
/// - Execution function that implements the opcode
/// - Gas calculation (both constant and dynamic)
/// - Stack validation requirements
/// - Memory expansion calculations
///
/// ## Function Types
/// The module uses function pointers for flexibility, allowing:
/// - Different implementations for different hardforks
/// - Optimized variants for specific conditions
/// - Mock implementations for testing
///
/// ## Gas Model
/// EVM gas costs consist of:
/// - Constant gas: Fixed cost for the operation
/// - Dynamic gas: Variable cost based on operation parameters
///
/// Example:
/// ```zig
/// // ADD operation
/// const add_op = Operation{
///     .execute = executeAdd,
///     .constant_gas = 3,
///     .min_stack = 2,
///     .max_stack = Stack.CAPACITY - 1,
/// };
/// ```
pub const ExecutionResult = @import("../execution/execution_result.zig");

/// Forward declaration for the interpreter context.
/// The actual interpreter implementation provides VM state and context.
pub const Interpreter = opaque {};

/// Forward declaration for execution state.
/// Contains transaction context, account state, and execution environment.
pub const State = opaque {};

/// Function signature for opcode execution.
///
/// Each opcode implements this signature to perform its operation.
/// The function has access to:
/// - Program counter for reading immediate values
/// - Interpreter for stack/memory manipulation
/// - State for account and storage access
///
/// @param pc Current program counter position
/// @param interpreter VM interpreter context
/// @param state Execution state and environment
/// @return Execution result indicating success/failure and gas consumption
pub const ExecutionFunc = *const fn (pc: usize, interpreter: *Interpreter, state: *State) ExecutionError.Error!ExecutionResult;

/// Function signature for dynamic gas calculation.
///
/// Some operations have variable gas costs based on:
/// - Current state (e.g., cold vs warm storage access)
/// - Operation parameters (e.g., memory expansion size)
/// - Network rules (e.g., EIP-2929 access lists)
///
/// @param interpreter VM interpreter context
/// @param state Execution state
/// @param stack Current stack for parameter inspection
/// @param memory Current memory for size calculations
/// @param requested_size Additional memory requested by operation
/// @return Dynamic gas cost to add to constant gas
/// @throws OutOfGas if gas calculation overflows
pub const GasFunc = *const fn (interpreter: *Interpreter, state: *State, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64;

/// Function signature for memory size calculation.
///
/// Operations that access memory need to calculate the required size
/// before execution to:
/// - Charge memory expansion gas
/// - Validate memory bounds
/// - Pre-allocate memory if needed
///
/// @param stack Stack containing operation parameters
/// @return Required memory size for the operation
pub const MemorySizeFunc = *const fn (stack: *Stack) Opcode.MemorySize;

/// EVM operation definition containing all metadata and functions.
///
/// Each entry in the jump table is an Operation that fully describes
/// how to execute an opcode, including validation, gas calculation,
/// and the actual execution logic.
pub const Operation = struct {
    /// Execution function implementing the opcode logic.
    /// This is called after all validations pass.
    execute: ExecutionFunc,

    /// Base gas cost for this operation.
    /// This is the minimum gas charged regardless of parameters.
    /// Defined by the Ethereum Yellow Paper and EIPs.
    constant_gas: u64,

    /// Optional dynamic gas calculation function.
    /// Operations with variable costs (storage, memory, calls) use this
    /// to calculate additional gas based on runtime parameters.
    dynamic_gas: ?GasFunc = null,

    /// Minimum stack items required before execution.
    /// The operation will fail with StackUnderflow if the stack
    /// has fewer than this many items.
    min_stack: u32,

    /// Maximum stack size allowed before execution.
    /// Ensures the operation won't cause stack overflow.
    /// Calculated as: CAPACITY - (pushes - pops)
    max_stack: u32,

    /// Optional memory size calculation function.
    /// Operations that access memory use this to determine
    /// memory expansion requirements before execution.
    memory_size: ?MemorySizeFunc = null,

    /// Indicates if this is an undefined/invalid opcode.
    /// Undefined opcodes consume all gas and fail execution.
    /// Used for opcodes not assigned in the current hardfork.
    undefined: bool = false,
};

/// Singleton NULL operation for unassigned opcode slots.
///
/// This operation is used for opcodes that:
/// - Are not yet defined in the current hardfork
/// - Have been removed in the current hardfork
/// - Are reserved for future use
///
/// Executing NULL always results in InvalidOpcode error.
pub const NULL_OPERATION = Operation{
    .execute = undefined_execute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
    .undefined = true,
};

/// Execution function for undefined opcodes.
///
/// Consumes all remaining gas and returns InvalidOpcode error.
/// This ensures undefined opcodes cannot be used for computation.
fn undefined_execute(pc: usize, interpreter: *Interpreter, state: *State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.Error.InvalidOpcode;
}
