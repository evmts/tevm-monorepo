const std = @import("std");
const Opcode = @import("opcode.zig");
const Operation = @import("operations/operation.zig");
const Hardfork = @import("hardfork.zig").Hardfork;
const ExecutionError = @import("execution_error.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");
const Frame = @import("frame.zig");
const Contract = @import("contract.zig");
const Address = @import("Address");
const Log = @import("log.zig");

// Import all opcode modules
const opcodes = @import("opcodes/package.zig");
const arithmetic = opcodes.arithmetic;
const comparison = opcodes.comparison;
const bitwise = opcodes.bitwise;
const memory_ops = opcodes.memory;
const storage = opcodes.storage;
const control = opcodes.control;
const stack_ops = opcodes.stack;
const environment = opcodes.environment;
const block = opcodes.block;
const crypto = opcodes.crypto;
const log = opcodes.log;
const system = opcodes.system;

/// Instruction sets module containing all EVM operation definitions.
///
/// This module defines all the Operation constants used by the jump table.
/// Each operation encapsulates:
/// - Execution function that implements the opcode
/// - Gas costs (constant and dynamic)
/// - Stack requirements (min/max)
/// - Memory expansion calculations
///
/// Operations are organized by category and hardfork variants.


// Storage operations
pub const SLOAD = Operation{
    .execute = storage.op_sload,
    .constant_gas = 0, // Gas handled dynamically in operation (cold/warm access)
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const SSTORE = Operation{
    .execute = storage.op_sstore,
    .constant_gas = 0, // Gas handled dynamically in operation
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// Define all operations as comptime constants
pub const STOP = Operation{
    .execute = control.op_stop,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

pub const ADD = Operation{
    .execute = arithmetic.op_add,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY, // Binary op: pop 2, push 1 - net -1
};

pub const MUL = Operation{
    .execute = arithmetic.op_mul,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SUB = Operation{
    .execute = arithmetic.op_sub,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const DIV = Operation{
    .execute = arithmetic.op_div,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SDIV = Operation{
    .execute = arithmetic.op_sdiv,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const MOD = Operation{
    .execute = arithmetic.op_mod,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SMOD = Operation{
    .execute = arithmetic.op_smod,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const ADDMOD = Operation{
    .execute = arithmetic.op_addmod,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const MULMOD = Operation{
    .execute = arithmetic.op_mulmod,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const EXP = Operation{
    .execute = arithmetic.op_exp,
    .constant_gas = 10,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SIGNEXTEND = Operation{
    .execute = arithmetic.op_signextend,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// Comparison operations
pub const LT = Operation{
    .execute = comparison.op_lt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const GT = Operation{
    .execute = comparison.op_gt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SLT = Operation{
    .execute = comparison.op_slt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SGT = Operation{
    .execute = comparison.op_sgt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const EQ = Operation{
    .execute = comparison.op_eq,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const ISZERO = Operation{
    .execute = comparison.op_iszero,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// Bitwise operations
pub const AND = Operation{
    .execute = bitwise.op_and,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const OR = Operation{
    .execute = bitwise.op_or,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const XOR = Operation{
    .execute = bitwise.op_xor,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const NOT = Operation{
    .execute = bitwise.op_not,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const BYTE = Operation{
    .execute = bitwise.op_byte,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SHL = Operation{
    .execute = bitwise.op_shl,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SHR = Operation{
    .execute = bitwise.op_shr,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SAR = Operation{
    .execute = bitwise.op_sar,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// SHA3
pub const SHA3 = Operation{
    .execute = crypto.op_sha3,
    .constant_gas = opcodes.gas_constants.Keccak256Gas,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// Environment operations
pub const ADDRESS = Operation{
    .execute = environment.op_address,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const BALANCE = Operation{
    .execute = environment.op_balance,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const ORIGIN = Operation{
    .execute = environment.op_origin,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const CALLER = Operation{
    .execute = environment.op_caller,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const CALLVALUE = Operation{
    .execute = environment.op_callvalue,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const CALLDATALOAD = Operation{
    .execute = environment.op_calldataload,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const CALLDATASIZE = Operation{
    .execute = environment.op_calldatasize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const CALLDATACOPY = Operation{
    .execute = memory_ops.op_calldatacopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const CODESIZE = Operation{
    .execute = environment.op_codesize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const CODECOPY = Operation{
    .execute = environment.op_codecopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const GASPRICE = Operation{
    .execute = environment.op_gasprice,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const EXTCODESIZE = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const EXTCODECOPY = Operation{
    .execute = environment.op_extcodecopy,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

pub const EXTCODEHASH = Operation{
    .execute = environment.op_extcodehash,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// Block operations
pub const BLOCKHASH = Operation{
    .execute = block.op_blockhash,
    .constant_gas = opcodes.gas_constants.GasExtStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const COINBASE = Operation{
    .execute = block.op_coinbase,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const TIMESTAMP = Operation{
    .execute = block.op_timestamp,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const NUMBER = Operation{
    .execute = block.op_number,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DIFFICULTY = Operation{
    .execute = block.op_difficulty,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const GASLIMIT = Operation{
    .execute = block.op_gaslimit,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// Stack operations
pub const POP = Operation{
    .execute = stack_ops.op_pop,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const MLOAD = Operation{
    .execute = memory_ops.op_mload,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const MSTORE = Operation{
    .execute = memory_ops.op_mstore,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const MSTORE8 = Operation{
    .execute = memory_ops.op_mstore8,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const JUMP = Operation{
    .execute = control.op_jump,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const JUMPI = Operation{
    .execute = control.op_jumpi,
    .constant_gas = opcodes.gas_constants.GasSlowStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const PC = Operation{
    .execute = control.op_pc,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const MSIZE = Operation{
    .execute = memory_ops.op_msize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const GAS = Operation{
    .execute = system.gas_op,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const JUMPDEST = Operation{
    .execute = control.op_jumpdest,
    .constant_gas = opcodes.gas_constants.JumpdestGas,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

// System operations
pub const CREATE = Operation{
    .execute = system.op_create,
    .constant_gas = opcodes.gas_constants.CreateGas,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const CALL = Operation{
    .execute = system.op_call,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

pub const CALLCODE = Operation{
    .execute = system.op_callcode,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

pub const RETURN = Operation{
    .execute = control.op_return,
    .constant_gas = 0,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const INVALID = Operation{
    .execute = control.op_invalid,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

pub const SELFDESTRUCT = Operation{
    .execute = control.op_selfdestruct,
    .constant_gas = 5000,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// Byzantium operations
pub const RETURNDATASIZE = Operation{
    .execute = memory_ops.op_returndatasize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const RETURNDATACOPY = Operation{
    .execute = memory_ops.op_returndatacopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const REVERT = Operation{
    .execute = control.op_revert,
    .constant_gas = 0,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const STATICCALL = Operation{
    .execute = system.op_staticcall,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

// Constantinople operations
pub const CREATE2 = Operation{
    .execute = system.op_create2,
    .constant_gas = opcodes.gas_constants.CreateGas,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

// Homestead operations
pub const DELEGATECALL = Operation{
    .execute = system.op_delegatecall,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

// Istanbul operations
pub const CHAINID = Operation{
    .execute = environment.op_chainid,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const SELFBALANCE = Operation{
    .execute = environment.op_selfbalance,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// London operations
pub const BASEFEE = Operation{
    .execute = block.op_basefee,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// DUP operations
pub const DUP1 = Operation{
    .execute = stack_ops.op_dup1,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP2 = Operation{
    .execute = stack_ops.op_dup2,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP3 = Operation{
    .execute = stack_ops.op_dup3,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP4 = Operation{
    .execute = stack_ops.op_dup4,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP5 = Operation{
    .execute = stack_ops.op_dup5,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 5,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP6 = Operation{
    .execute = stack_ops.op_dup6,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP7 = Operation{
    .execute = stack_ops.op_dup7,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP8 = Operation{
    .execute = stack_ops.op_dup8,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 8,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP9 = Operation{
    .execute = stack_ops.op_dup9,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 9,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP10 = Operation{
    .execute = stack_ops.op_dup10,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 10,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP11 = Operation{
    .execute = stack_ops.op_dup11,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 11,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP12 = Operation{
    .execute = stack_ops.op_dup12,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 12,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP13 = Operation{
    .execute = stack_ops.op_dup13,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 13,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP14 = Operation{
    .execute = stack_ops.op_dup14,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 14,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP15 = Operation{
    .execute = stack_ops.op_dup15,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 15,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP16 = Operation{
    .execute = stack_ops.op_dup16,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 16,
    .max_stack = Stack.CAPACITY - 1,
};

// SWAP operations
pub const SWAP1 = Operation{
    .execute = stack_ops.op_swap1,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP2 = Operation{
    .execute = stack_ops.op_swap2,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP3 = Operation{
    .execute = stack_ops.op_swap3,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP4 = Operation{
    .execute = stack_ops.op_swap4,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 5,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP5 = Operation{
    .execute = stack_ops.op_swap5,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP6 = Operation{
    .execute = stack_ops.op_swap6,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP7 = Operation{
    .execute = stack_ops.op_swap7,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 8,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP8 = Operation{
    .execute = stack_ops.op_swap8,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 9,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP9 = Operation{
    .execute = stack_ops.op_swap9,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 10,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP10 = Operation{
    .execute = stack_ops.op_swap10,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 11,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP11 = Operation{
    .execute = stack_ops.op_swap11,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 12,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP12 = Operation{
    .execute = stack_ops.op_swap12,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 13,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP13 = Operation{
    .execute = stack_ops.op_swap13,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 14,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP14 = Operation{
    .execute = stack_ops.op_swap14,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 15,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP15 = Operation{
    .execute = stack_ops.op_swap15,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 16,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP16 = Operation{
    .execute = stack_ops.op_swap16,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 17,
    .max_stack = Stack.CAPACITY,
};

// Shanghai operations
pub const PUSH0 = Operation{
    .execute = stack_ops.op_push0,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// Cancun operations
pub const BLOBHASH = Operation{
    .execute = block.op_blobhash,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const BLOBBASEFEE = Operation{
    .execute = block.op_blobbasefee,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const MCOPY = Operation{
    .execute = memory_ops.op_mcopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const TLOAD = Operation{
    .execute = storage.op_tload,
    .constant_gas = 100,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const TSTORE = Operation{
    .execute = storage.op_tstore,
    .constant_gas = 100,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// ===== HARDFORK-SPECIFIC OPERATION VARIANTS =====
// These replace the unsafe @constCast approach with immutable operation objects
// Following the pattern: OPCODE_HARDFORK_FROM_TO_HARDFORK_TO

// BALANCE variants for different hardforks
pub const BALANCE_FRONTIER_TO_TANGERINE = Operation{
    .execute = environment.op_balance,
    .constant_gas = opcodes.gas_constants.GasExtStep, // 20
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const BALANCE_TANGERINE_TO_ISTANBUL = Operation{
    .execute = environment.op_balance,
    .constant_gas = 400,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const BALANCE_ISTANBUL_TO_BERLIN = Operation{
    .execute = environment.op_balance,
    .constant_gas = 700,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const BALANCE_BERLIN_TO_PRESENT = Operation{
    .execute = environment.op_balance,
    .constant_gas = 0, // Dynamic gas in Berlin+
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// EXTCODESIZE variants
pub const EXTCODESIZE_FRONTIER_TO_TANGERINE = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = opcodes.gas_constants.GasExtStep, // 20
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const EXTCODESIZE_TANGERINE_TO_BERLIN = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = 700,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// EXTCODECOPY variants
pub const EXTCODECOPY_FRONTIER_TO_TANGERINE = Operation{
    .execute = environment.op_extcodecopy,
    .constant_gas = opcodes.gas_constants.GasExtStep, // 20
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

pub const EXTCODECOPY_TANGERINE_TO_BERLIN = Operation{
    .execute = environment.op_extcodecopy,
    .constant_gas = 700,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

// SLOAD variants
pub const SLOAD_FRONTIER_TO_TANGERINE = Operation{
    .execute = storage.op_sload,
    .constant_gas = opcodes.gas_constants.SloadGas, // 50
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const SLOAD_TANGERINE_TO_ISTANBUL = Operation{
    .execute = storage.op_sload,
    .constant_gas = 200,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const SLOAD_ISTANBUL_TO_BERLIN = Operation{
    .execute = storage.op_sload,
    .constant_gas = 800,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// CALL variants
pub const CALL_FRONTIER_TO_TANGERINE = Operation{
    .execute = system.op_call,
    .constant_gas = opcodes.gas_constants.CallGas, // 40
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

pub const CALL_TANGERINE_TO_PRESENT = Operation{
    .execute = system.op_call,
    .constant_gas = 700,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

// CALLCODE variants
pub const CALLCODE_FRONTIER_TO_TANGERINE = Operation{
    .execute = system.op_callcode,
    .constant_gas = opcodes.gas_constants.CallGas, // 40
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

pub const CALLCODE_TANGERINE_TO_PRESENT = Operation{
    .execute = system.op_callcode,
    .constant_gas = 700,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

// DELEGATECALL variants
pub const DELEGATECALL_TANGERINE_TO_PRESENT = Operation{
    .execute = system.op_delegatecall,
    .constant_gas = 700,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

// SELFDESTRUCT variants
pub const SELFDESTRUCT_FRONTIER_TO_TANGERINE = Operation{
    .execute = control.op_selfdestruct,
    .constant_gas = 0,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const SELFDESTRUCT_TANGERINE_TO_PRESENT = Operation{
    .execute = control.op_selfdestruct,
    .constant_gas = 5000,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};