const std = @import("std");
const opcodes = @import("opcodes/package.zig");
const operations = @import("operations/package.zig");
const gas_constants = @import("gas_constants.zig");
const Stack = @import("stack.zig");
const Operation = @import("operations/operation.zig");

/// Specification for an EVM operation.
/// This data structure allows us to define all operations in a single place
/// and generate the Operation structs at compile time.
pub const OpSpec = struct {
    /// Operation name (e.g., "ADD", "MUL")
    name: []const u8,
    /// Opcode byte value (0x00-0xFF)
    opcode: u8,
    /// Execution function
    execute: Operation.ExecutionFunc,
    /// Base gas cost
    gas: u64,
    /// Minimum stack items required
    min_stack: u32,
    /// Maximum stack size allowed (usually Stack.CAPACITY or Stack.CAPACITY - 1)
    max_stack: u32,
    /// Optional: for hardfork variants, specify which variant this is
    variant: ?[]const u8 = null,
};

/// Complete specification of all EVM operations.
/// This replaces the scattered Operation definitions across multiple files.
pub const ALL_OPERATIONS = [_]OpSpec{
    // 0x00s: Stop and Arithmetic Operations
    .{ .name = "STOP", .opcode = 0x00, .execute = operations.control.op_stop, .gas = 0, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "ADD", .opcode = 0x01, .execute = operations.arithmetic.op_add, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MUL", .opcode = 0x02, .execute = operations.arithmetic.op_mul, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SUB", .opcode = 0x03, .execute = operations.arithmetic.op_sub, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "DIV", .opcode = 0x04, .execute = operations.arithmetic.op_div, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SDIV", .opcode = 0x05, .execute = operations.arithmetic.op_sdiv, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MOD", .opcode = 0x06, .execute = operations.arithmetic.op_mod, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SMOD", .opcode = 0x07, .execute = operations.arithmetic.op_smod, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "ADDMOD", .opcode = 0x08, .execute = operations.arithmetic.op_addmod, .gas = gas_constants.GasMidStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "MULMOD", .opcode = 0x09, .execute = operations.arithmetic.op_mulmod, .gas = gas_constants.GasMidStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "EXP", .opcode = 0x0a, .execute = operations.arithmetic.op_exp, .gas = gas_constants.ExpGas, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SIGNEXTEND", .opcode = 0x0b, .execute = operations.arithmetic.op_signextend, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    
    // 0x10s: Comparison & Bitwise Logic Operations
    .{ .name = "LT", .opcode = 0x10, .execute = operations.comparison.op_lt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "GT", .opcode = 0x11, .execute = operations.comparison.op_gt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SLT", .opcode = 0x12, .execute = operations.comparison.op_slt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SGT", .opcode = 0x13, .execute = operations.comparison.op_sgt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "EQ", .opcode = 0x14, .execute = operations.comparison.op_eq, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "ISZERO", .opcode = 0x15, .execute = operations.comparison.op_iszero, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "AND", .opcode = 0x16, .execute = operations.bitwise.op_and, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "OR", .opcode = 0x17, .execute = operations.bitwise.op_or, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "XOR", .opcode = 0x18, .execute = operations.bitwise.op_xor, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "NOT", .opcode = 0x19, .execute = operations.bitwise.op_not, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "BYTE", .opcode = 0x1a, .execute = operations.bitwise.op_byte, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SHL", .opcode = 0x1b, .execute = operations.bitwise.op_shl, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SHR", .opcode = 0x1c, .execute = operations.bitwise.op_shr, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SAR", .opcode = 0x1d, .execute = operations.bitwise.op_sar, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    
    // 0x20s: Crypto
    .{ .name = "SHA3", .opcode = 0x20, .execute = operations.crypto.op_sha3, .gas = gas_constants.Sha3Gas, .min_stack = 2, .max_stack = Stack.CAPACITY },
    
    // 0x30s: Environmental Information
    .{ .name = "ADDRESS", .opcode = 0x30, .execute = operations.environment.op_address, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "BALANCE_FRONTIER", .opcode = 0x31, .execute = operations.environment.op_balance, .gas = gas_constants.BalanceGasFrontier, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "FRONTIER_TO_TANGERINE" },
    .{ .name = "BALANCE_TANGERINE", .opcode = 0x31, .execute = operations.environment.op_balance, .gas = gas_constants.BalanceGasEIP150, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "TANGERINE_TO_ISTANBUL" },
    .{ .name = "BALANCE_ISTANBUL", .opcode = 0x31, .execute = operations.environment.op_balance, .gas = gas_constants.BalanceGasEIP1884, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "ISTANBUL_TO_BERLIN" },
    .{ .name = "BALANCE_BERLIN", .opcode = 0x31, .execute = operations.environment.op_balance, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "BERLIN_TO_PRESENT" },
    .{ .name = "ORIGIN", .opcode = 0x32, .execute = operations.environment.op_origin, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLER", .opcode = 0x33, .execute = operations.environment.op_caller, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLVALUE", .opcode = 0x34, .execute = operations.environment.op_callvalue, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLDATALOAD", .opcode = 0x35, .execute = operations.environment.op_calldataload, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "CALLDATASIZE", .opcode = 0x36, .execute = operations.environment.op_calldatasize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLDATACOPY", .opcode = 0x37, .execute = operations.memory.op_calldatacopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "CODESIZE", .opcode = 0x38, .execute = operations.environment.op_codesize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CODECOPY", .opcode = 0x39, .execute = operations.environment.op_codecopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "GASPRICE", .opcode = 0x3a, .execute = operations.environment.op_gasprice, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "EXTCODESIZE_FRONTIER", .opcode = 0x3b, .execute = operations.misc.op_extcodesize, .gas = gas_constants.ExtCodeSizeGasFrontier, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "FRONTIER_TO_TANGERINE" },
    .{ .name = "EXTCODESIZE_TANGERINE", .opcode = 0x3b, .execute = operations.misc.op_extcodesize, .gas = gas_constants.ExtCodeSizeGasEIP150, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "TANGERINE_TO_BERLIN" },
    .{ .name = "EXTCODESIZE", .opcode = 0x3b, .execute = operations.misc.op_extcodesize, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "EXTCODECOPY_FRONTIER", .opcode = 0x3c, .execute = operations.environment.op_extcodecopy, .gas = gas_constants.ExtCodeCopyBaseFrontier, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = "FRONTIER_TO_TANGERINE" },
    .{ .name = "EXTCODECOPY_TANGERINE", .opcode = 0x3c, .execute = operations.environment.op_extcodecopy, .gas = gas_constants.ExtCodeCopyBaseEIP150, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = "TANGERINE_TO_BERLIN" },
    .{ .name = "EXTCODECOPY", .opcode = 0x3c, .execute = operations.environment.op_extcodecopy, .gas = 0, .min_stack = 4, .max_stack = Stack.CAPACITY },
    .{ .name = "RETURNDATASIZE", .opcode = 0x3d, .execute = operations.memory.op_returndatasize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "RETURNDATACOPY", .opcode = 0x3e, .execute = operations.memory.op_returndatacopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "EXTCODEHASH", .opcode = 0x3f, .execute = operations.crypto.op_extcodehash, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY },
    
    // 0x40s: Block Information
    .{ .name = "BLOCKHASH", .opcode = 0x40, .execute = operations.block.op_blockhash, .gas = gas_constants.BlockhashGas, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "COINBASE", .opcode = 0x41, .execute = operations.block.op_coinbase, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "TIMESTAMP", .opcode = 0x42, .execute = operations.block.op_timestamp, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "NUMBER", .opcode = 0x43, .execute = operations.block.op_number, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "DIFFICULTY", .opcode = 0x44, .execute = operations.block.op_difficulty, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "GASLIMIT", .opcode = 0x45, .execute = operations.block.op_gaslimit, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CHAINID", .opcode = 0x46, .execute = operations.environment.op_chainid, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "SELFBALANCE", .opcode = 0x47, .execute = operations.environment.op_selfbalance, .gas = gas_constants.GasFastStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "BASEFEE", .opcode = 0x48, .execute = operations.block.op_basefee, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "BLOBHASH", .opcode = 0x49, .execute = operations.block.op_blobhash, .gas = gas_constants.BlobHashGas, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "BLOBBASEFEE", .opcode = 0x4a, .execute = operations.block.op_blobbasefee, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    
    // 0x50s: Stack, Memory, Storage and Flow Operations
    .{ .name = "POP", .opcode = 0x50, .execute = opcodes.stack.op_pop, .gas = gas_constants.GasQuickStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "MLOAD", .opcode = 0x51, .execute = operations.memory.op_mload, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "MSTORE", .opcode = 0x52, .execute = operations.memory.op_mstore, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MSTORE8", .opcode = 0x53, .execute = operations.memory.op_mstore8, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SLOAD_FRONTIER", .opcode = 0x54, .execute = operations.storage.op_sload, .gas = gas_constants.SloadGasFrontier, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "FRONTIER_TO_TANGERINE" },
    .{ .name = "SLOAD_TANGERINE", .opcode = 0x54, .execute = operations.storage.op_sload, .gas = gas_constants.SloadGasEIP150, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "TANGERINE_TO_ISTANBUL" },
    .{ .name = "SLOAD_ISTANBUL", .opcode = 0x54, .execute = operations.storage.op_sload, .gas = gas_constants.SloadGasEIP1884, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "ISTANBUL_TO_BERLIN" },
    .{ .name = "SLOAD", .opcode = 0x54, .execute = operations.storage.op_sload, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "SSTORE", .opcode = 0x55, .execute = operations.storage.op_sstore, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "JUMP", .opcode = 0x56, .execute = operations.control.op_jump, .gas = gas_constants.GasMidStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "JUMPI", .opcode = 0x57, .execute = operations.control.op_jumpi, .gas = gas_constants.GasSlowStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "PC", .opcode = 0x58, .execute = operations.control.op_pc, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "MSIZE", .opcode = 0x59, .execute = operations.memory.op_msize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "GAS", .opcode = 0x5a, .execute = operations.misc.op_gas, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "JUMPDEST", .opcode = 0x5b, .execute = operations.control.op_jumpdest, .gas = gas_constants.JumpdestGas, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "TLOAD", .opcode = 0x5c, .execute = operations.storage.op_tload, .gas = gas_constants.WarmStorageReadCostEIP2929, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "TSTORE", .opcode = 0x5d, .execute = operations.storage.op_tstore, .gas = gas_constants.WarmStorageReadCostEIP2929, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MCOPY", .opcode = 0x5e, .execute = operations.memory.op_mcopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "PUSH0", .opcode = 0x5f, .execute = opcodes.stack.op_push0, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    
    // 0x60s & 0x70s: Push operations (generated dynamically in jump table)
    // 0x80s: Duplication operations (generated dynamically in jump table)
    // 0x90s: Exchange operations (generated dynamically in jump table)
    // 0xa0s: Logging operations (generated dynamically in jump table)
    
    // 0xf0s: System operations
    .{ .name = "CREATE", .opcode = 0xf0, .execute = operations.system.op_create, .gas = gas_constants.CreateGas, .min_stack = 3, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALL_FRONTIER", .opcode = 0xf1, .execute = operations.system.op_call, .gas = gas_constants.CallGasFrontier, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = "FRONTIER_TO_TANGERINE" },
    .{ .name = "CALL", .opcode = 0xf1, .execute = operations.system.op_call, .gas = gas_constants.CallGasEIP150, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = "TANGERINE_TO_PRESENT" },
    .{ .name = "CALLCODE_FRONTIER", .opcode = 0xf2, .execute = operations.system.op_callcode, .gas = gas_constants.CallGasFrontier, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = "FRONTIER_TO_TANGERINE" },
    .{ .name = "CALLCODE", .opcode = 0xf2, .execute = operations.system.op_callcode, .gas = gas_constants.CallGasEIP150, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = "TANGERINE_TO_PRESENT" },
    .{ .name = "RETURN", .opcode = 0xf3, .execute = operations.control.op_return, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "DELEGATECALL", .opcode = 0xf4, .execute = operations.system.op_delegatecall, .gas = gas_constants.CallGasFrontier, .min_stack = 6, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "DELEGATECALL_TANGERINE", .opcode = 0xf4, .execute = operations.system.op_delegatecall, .gas = gas_constants.CallGasEIP150, .min_stack = 6, .max_stack = Stack.CAPACITY - 1, .variant = "TANGERINE_TO_PRESENT" },
    .{ .name = "CREATE2", .opcode = 0xf5, .execute = operations.system.op_create2, .gas = gas_constants.CreateGas, .min_stack = 4, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "STATICCALL", .opcode = 0xfa, .execute = operations.system.op_staticcall, .gas = gas_constants.CallGasEIP150, .min_stack = 6, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "REVERT", .opcode = 0xfd, .execute = operations.control.op_revert, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "INVALID", .opcode = 0xfe, .execute = operations.control.op_invalid, .gas = 0, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "SELFDESTRUCT_FRONTIER", .opcode = 0xff, .execute = operations.control.op_selfdestruct, .gas = gas_constants.SelfdestructGasFrontier, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "FRONTIER_TO_TANGERINE" },
    .{ .name = "SELFDESTRUCT", .opcode = 0xff, .execute = operations.control.op_selfdestruct, .gas = gas_constants.SelfdestructGasEIP150, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = "TANGERINE_TO_PRESENT" },
};

/// Generate an Operation struct from an OpSpec.
pub fn generate_operation(spec: OpSpec) Operation {
    return Operation{
        .execute = spec.execute,
        .constant_gas = spec.gas,
        .min_stack = spec.min_stack,
        .max_stack = spec.max_stack,
    };
}

/// Example of how this would be used in practice:
/// 
/// In jump_table.zig, instead of:
/// ```zig
/// jt.table[0x01] = &operations.arithmetic.ADD;
/// jt.table[0x02] = &operations.arithmetic.MUL;
/// // ... hundreds more lines
/// ```
/// 
/// We could do:
/// ```zig
/// inline for (operation_specs.ALL_OPERATIONS) |spec| {
///     const op = comptime generate_operation(spec);
///     jt.table[spec.opcode] = &op;
/// }
/// ```
/// 
/// This centralizes all operation definitions in one place, making it much
/// easier to see all opcodes at a glance, modify gas costs, add new opcodes,
/// or generate documentation.