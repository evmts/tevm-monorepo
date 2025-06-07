/// Control flow operations module for the EVM
/// 
/// This module defines operations that control the execution flow of smart contracts,
/// including jumps, halts, returns, and contract destruction. These operations are
/// fundamental for implementing conditional logic, loops, function returns, and
/// error handling in the EVM.

const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const ExecutionError = @import("../execution_error.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const control = opcodes.control;

/// STOP operation (0x00): Halt Execution
/// 
/// Halts execution of the current context successfully. No data is returned.
/// This is the normal way to end execution when no return value is needed.
/// 
/// Stack: [...] → [...] (unchanged)
/// Gas: 0
/// 
/// Often placed at the end of contract initialization code or after
/// completing operations that don't need to return data.
pub const STOP = Operation{
    .execute = control.op_stop,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

/// JUMP operation (0x56): Unconditional Jump
/// 
/// Alters the program counter to jump to a specific location in the code.
/// The destination must be a valid JUMPDEST instruction, or execution will fail.
/// 
/// Stack: [..., destination] → [...]
/// Gas: 8 (GasMidStep)
/// 
/// Used for implementing function calls, loops, and other control structures.
/// The jump destination is validated during execution to ensure it points to a JUMPDEST.
pub const JUMP = Operation{
    .execute = control.op_jump,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// JUMPI operation (0x57): Conditional Jump
/// 
/// Conditionally alters the program counter based on a boolean condition.
/// Jumps to the destination if the condition is non-zero, otherwise continues
/// to the next instruction.
/// 
/// Stack: [..., destination, condition] → [...]
/// Gas: 10 (GasSlowStep)
/// 
/// Essential for implementing if-else statements, loops with conditions,
/// and other conditional control flow. Destination must be a valid JUMPDEST.
pub const JUMPI = Operation{
    .execute = control.op_jumpi,
    .constant_gas = opcodes.gas_constants.GasSlowStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// PC operation (0x58): Program Counter
/// 
/// Pushes the current program counter onto the stack. The value represents
/// the position of the PC instruction itself in the bytecode.
/// 
/// Stack: [...] → [..., pc]
/// Gas: 2 (GasQuickStep)
/// 
/// Rarely used in practice but can be useful for:
/// - Calculating relative positions in code
/// - Implementing position-dependent logic
/// - Debugging and introspection
pub const PC = Operation{
    .execute = control.op_pc,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// JUMPDEST operation (0x5B): Jump Destination Marker
/// 
/// Marks a valid destination for JUMP and JUMPI operations. This is a no-op
/// instruction that only serves as a jump target marker.
/// 
/// Stack: [...] → [...] (unchanged)
/// Gas: 1 (JumpdestGas)
/// 
/// Must be present at any location that is the target of a jump.
/// Jumping to any location without a JUMPDEST causes execution to fail.
pub const JUMPDEST = Operation{
    .execute = control.op_jumpdest,
    .constant_gas = opcodes.gas_constants.JumpdestGas,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

/// RETURN operation (0xF3): Return Data and Halt
/// 
/// Halts execution and returns data from memory. The returned data becomes
/// the output of the current execution context.
/// 
/// Stack: [..., offset, size] → [] (execution ends)
/// Gas: 0 + memory expansion cost
/// 
/// Where:
/// - offset: Starting position in memory
/// - size: Number of bytes to return
/// 
/// Used to return results from successful contract calls or function executions.
pub const RETURN = Operation{
    .execute = control.op_return,
    .constant_gas = 0,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// REVERT operation (0xFD): Revert State and Return Data
/// 
/// Halts execution, reverts all state changes made during this call, and
/// returns data from memory. Gas is not refunded to the caller.
/// 
/// Stack: [..., offset, size] → [] (execution ends)
/// Gas: 0 + memory expansion cost
/// 
/// Where:
/// - offset: Starting position in memory for error data
/// - size: Number of bytes to return as error data
/// 
/// Introduced in Byzantium (EIP-140) for explicit error handling.
/// Essential for require() statements and error messages in Solidity.
pub const REVERT = Operation{
    .execute = control.op_revert,
    .constant_gas = 0,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// INVALID operation (0xFE): Invalid Instruction
/// 
/// Represents an invalid opcode that always causes execution to fail.
/// Consumes all remaining gas and reverts all state changes.
/// 
/// Stack: [...] → [] (execution fails)
/// Gas: All remaining gas
/// 
/// Used as a placeholder for unimplemented opcodes or to explicitly
/// mark unreachable code. Any undefined opcode behaves like INVALID.
pub const INVALID = Operation{
    .execute = control.op_invalid,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

/// SELFDESTRUCT operation (0xFF): Destroy Contract
/// 
/// Destroys the current contract, sending all remaining balance to a
/// specified address. The contract's code and storage are marked for deletion.
/// 
/// Stack: [..., beneficiary] → [] (execution ends)
/// Gas: 5000 (base) + dynamic costs
/// 
/// Notes:
/// - Actual deletion happens at the end of the transaction
/// - Creates the beneficiary account if it doesn't exist
/// - Deprecated in favor of alternative patterns due to security concerns
/// - Behavior changes based on EIP-6780 (Cancun): only works in same transaction
pub const SELFDESTRUCT = Operation{
    .execute = control.op_selfdestruct,
    .constant_gas = 5000,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// SELFDESTRUCT operation for Frontier to Tangerine Whistle
/// 
/// Early version of SELFDESTRUCT with no base gas cost.
/// Used in hardforks: Frontier, Homestead
/// 
/// Stack: [..., beneficiary] → [] (execution ends)
/// Gas: 0 + dynamic costs
pub const SELFDESTRUCT_FRONTIER_TO_TANGERINE = Operation{
    .execute = control.op_selfdestruct,
    .constant_gas = 0,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// SELFDESTRUCT operation for Tangerine Whistle to Present
/// 
/// Current version of SELFDESTRUCT with 5000 base gas cost.
/// Introduced in Tangerine Whistle to prevent DoS attacks.
/// 
/// Stack: [..., beneficiary] → [] (execution ends)
/// Gas: 5000 + dynamic costs
pub const SELFDESTRUCT_TANGERINE_TO_PRESENT = Operation{
    .execute = control.op_selfdestruct,
    .constant_gas = 5000,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};
