/// Miscellaneous operations module for the EVM
/// 
/// This module contains operations that don't fit neatly into other categories,
/// including gas-related operations and hardfork-specific variants of operations
/// that had different gas costs across network upgrades.

const std = @import("std");
const Operation = @import("operation.zig");
const Stack = @import("../stack.zig");
const ExecutionError = @import("../execution_error.zig");
const Frame = @import("../frame.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const misc = opcodes.misc;
const environment = opcodes.environment;
const system = opcodes.system;

/// GAS operation (0x5A): Get Remaining Gas
/// 
/// Pushes the amount of gas remaining in the current call frame onto the stack.
/// This value is after deducting the gas cost of the GAS operation itself.
/// 
/// Stack: [...] → [..., gas]
/// Gas: 2 (GasQuickStep)
/// 
/// Note: The value pushed is the remaining gas after this operation completes,
/// so it already accounts for the 2 gas units consumed by GAS itself.
pub const GAS = Operation{
    .execute = system.gas_op,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// EXTCODESIZE operation for current hardfork (Berlin+)
/// 
/// Returns the size of code at an address with dynamic gas based on warm/cold access.
/// Gas: 100 (warm) or 2600 (cold)
/// 
/// Used in hardforks: Berlin onwards
pub const EXTCODESIZE = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// EXTCODESIZE operation for Frontier to Tangerine Whistle
/// 
/// Early version with minimal gas cost that was exploited for DoS attacks.
/// Gas: 20 (GasExtStep)
/// 
/// Used in hardforks: Frontier, Homestead
pub const EXTCODESIZE_FRONTIER_TO_TANGERINE = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = opcodes.gas_constants.GasExtStep, // 20
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// EXTCODESIZE operation for Tangerine Whistle to Berlin
/// 
/// Increased gas cost to mitigate DoS attacks discovered in 2016.
/// Gas: 700
/// 
/// Used in hardforks: Tangerine Whistle through Muir Glacier
pub const EXTCODESIZE_TANGERINE_TO_BERLIN = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = 700,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};