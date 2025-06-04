const std = @import("std");
const Opcode = @import("opcode.zig");
const Operation = @import("operation.zig");
const Hardfork = @import("hardfork.zig").Hardfork;
const ExecutionError = @import("execution_error.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");
const Frame = @import("frame.zig");
const Contract = @import("contract.zig");
const Address = @import("Address");

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

const Self = @This();

// Cache line alignment for better performance
const CACHE_LINE_SIZE = 64;

table: [256]?*const Operation align(CACHE_LINE_SIZE),

pub fn init() Self {
    return Self{
        .table = [_]?*const Operation{null} ** 256,
    };
}

pub inline fn get_operation(self: *const Self, opcode: u8) *const Operation {
    return self.table[opcode] orelse &Operation.NULL;
}

pub fn execute(self: *const Self, pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State, opcode: u8) ExecutionError.Error!Operation.ExecutionResult {
    const operation = self.get_operation(opcode);

    // Cast state to Frame to access gas_remaining and stack
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const opcode_enum = @as(Opcode.Enum, @enumFromInt(opcode));
    std.debug.print("JumpTable: Opcode 0x{x} ({s}), initial frame gas: {}\n", .{ opcode, Opcode.get_name(opcode_enum), frame.gas_remaining });
    // Validate stack requirements before execution
    const stack_validation = @import("stack_validation.zig");
    try stack_validation.validate_stack_requirements(&frame.stack, operation);

    // Consume base gas cost before executing the opcode
    if (operation.constant_gas > 0) {
        const gas_before_const = frame.gas_remaining;
        try frame.consume_gas(operation.constant_gas);
        std.debug.print("JumpTable: Opcode 0x{x}, const_gas = {}, gas after const_consume: {} (consumed {})\n", .{ opcode, operation.constant_gas, frame.gas_remaining, gas_before_const - frame.gas_remaining });
    }

    // Execute the opcode handler
    const res = operation.execute(pc, interpreter, state);
    std.debug.print("JumpTable: Opcode 0x{x}, gas after op_execute: {}\n", .{ opcode, frame.gas_remaining });
    return res;
}

pub fn validate(self: *Self) void {
    for (0..256) |i| {
        if (self.table[i] == null) {
            self.table[i] = &UNDEFINED;
        } else if (self.table[i].?.memory_size != null and self.table[i].?.dynamic_gas == null) {
            // Log error instead of panicking
            std.debug.print("Warning: Operation 0x{x} has memory size but no dynamic gas calculation\n", .{i});
            // Set to UNDEFINED to prevent issues
            self.table[i] = &UNDEFINED;
        }
    }
}

pub fn copy(self: *const Self, allocator: std.mem.Allocator) !Self {
    _ = allocator;
    return Self{
        .table = self.table,
    };
}

// Helper functions
pub fn min_stack(min_pop: u32, min_push: u32) u32 {
    _ = min_push;
    return min_pop;
}

pub fn max_stack(max_pop: u32, max_push: u32) u32 {
    _ = max_pop;
    _ = max_push;
    return Stack.CAPACITY;
}

pub fn min_dup_stack(n: u32) u32 {
    return n;
}

pub fn max_dup_stack(_: u32) u32 {
    return Stack.CAPACITY - 1;
}

pub fn min_swap_stack(n: u32) u32 {
    return n + 1;
}

pub fn max_swap_stack(n: u32) u32 {
    _ = n;
    return Stack.CAPACITY;
}

// Define operations
const UNDEFINED = Operation{
    .execute = undefined_execute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
    .undefined = true,
};

fn undefined_execute(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.Error.InvalidOpcode;
}

// Define all operations as comptime constants
const STOP = Operation{
    .execute = control.op_stop,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

const ADD = Operation{
    .execute = arithmetic.op_add,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY, // Binary op: pop 2, push 1 - net -1
};

const MUL = Operation{
    .execute = arithmetic.op_mul,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SUB = Operation{
    .execute = arithmetic.op_sub,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const DIV = Operation{
    .execute = arithmetic.op_div,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SDIV = Operation{
    .execute = arithmetic.op_sdiv,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const MOD = Operation{
    .execute = arithmetic.op_mod,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SMOD = Operation{
    .execute = arithmetic.op_smod,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const ADDMOD = Operation{
    .execute = arithmetic.op_addmod,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const MULMOD = Operation{
    .execute = arithmetic.op_mulmod,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const EXP = Operation{
    .execute = arithmetic.op_exp,
    .constant_gas = 10,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SIGNEXTEND = Operation{
    .execute = arithmetic.op_signextend,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// Comparison operations
const LT = Operation{
    .execute = comparison.op_lt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const GT = Operation{
    .execute = comparison.op_gt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SLT = Operation{
    .execute = comparison.op_slt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SGT = Operation{
    .execute = comparison.op_sgt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const EQ = Operation{
    .execute = comparison.op_eq,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const ISZERO = Operation{
    .execute = comparison.op_iszero,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// Bitwise operations
const AND = Operation{
    .execute = bitwise.op_and,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const OR = Operation{
    .execute = bitwise.op_or,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const XOR = Operation{
    .execute = bitwise.op_xor,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const NOT = Operation{
    .execute = bitwise.op_not,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const BYTE = Operation{
    .execute = bitwise.op_byte,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SHL = Operation{
    .execute = bitwise.op_shl,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SHR = Operation{
    .execute = bitwise.op_shr,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SAR = Operation{
    .execute = bitwise.op_sar,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// SHA3
const SHA3 = Operation{
    .execute = crypto.op_sha3,
    .constant_gas = opcodes.gas_constants.Keccak256Gas,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// Environment operations
const ADDRESS = Operation{
    .execute = environment.op_address,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const BALANCE = Operation{
    .execute = environment.op_balance,
    .constant_gas = 700,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const ORIGIN = Operation{
    .execute = environment.op_origin,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const CALLER = Operation{
    .execute = environment.op_caller,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const CALLVALUE = Operation{
    .execute = environment.op_callvalue,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const CALLDATALOAD = Operation{
    .execute = environment.op_calldataload,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const CALLDATASIZE = Operation{
    .execute = environment.op_calldatasize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const CALLDATACOPY = Operation{
    .execute = memory_ops.op_calldatacopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const CODESIZE = Operation{
    .execute = environment.op_codesize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const CODECOPY = Operation{
    .execute = environment.op_codecopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const GASPRICE = Operation{
    .execute = environment.op_gasprice,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const EXTCODESIZE = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = 700, // Will be adjusted for different hardforks
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const EXTCODECOPY = Operation{
    .execute = environment.op_extcodecopy,
    .constant_gas = 700, // Will be adjusted for different hardforks
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

const EXTCODEHASH = Operation{
    .execute = environment.op_extcodehash,
    .constant_gas = 700,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// Block operations
const BLOCKHASH = Operation{
    .execute = block.op_blockhash,
    .constant_gas = opcodes.gas_constants.GasExtStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const COINBASE = Operation{
    .execute = block.op_coinbase,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const TIMESTAMP = Operation{
    .execute = block.op_timestamp,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const NUMBER = Operation{
    .execute = block.op_number,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const DIFFICULTY = Operation{
    .execute = block.op_difficulty,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const GASLIMIT = Operation{
    .execute = block.op_gaslimit,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// Stack operations
const POP = Operation{
    .execute = stack_ops.op_pop,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const MLOAD = Operation{
    .execute = memory_ops.op_mload,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const MSTORE = Operation{
    .execute = memory_ops.op_mstore,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const MSTORE8 = Operation{
    .execute = memory_ops.op_mstore8,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SLOAD = Operation{
    .execute = storage.op_sload,
    .constant_gas = 800,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const SSTORE = Operation{
    .execute = storage.op_sstore,
    .constant_gas = 0, // Dynamic gas calculation
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const JUMP = Operation{
    .execute = control.op_jump,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const JUMPI = Operation{
    .execute = control.op_jumpi,
    .constant_gas = opcodes.gas_constants.GasSlowStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const PC = Operation{
    .execute = control.op_pc,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const MSIZE = Operation{
    .execute = memory_ops.op_msize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const GAS = Operation{
    .execute = gas_op,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const JUMPDEST = Operation{
    .execute = control.op_jumpdest,
    .constant_gas = opcodes.gas_constants.JumpdestGas,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

// System operations
const CREATE = Operation{
    .execute = system.op_create,
    .constant_gas = opcodes.gas_constants.CreateGas,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const CALL = Operation{
    .execute = system.op_call,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

const CALLCODE = Operation{
    .execute = system.op_callcode,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

const RETURN = Operation{
    .execute = control.op_return,
    .constant_gas = 0,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const INVALID = Operation{
    .execute = control.op_invalid,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

const SELFDESTRUCT = Operation{
    .execute = control.op_selfdestruct,
    .constant_gas = 5000,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// Byzantium operations
const RETURNDATASIZE = Operation{
    .execute = memory_ops.op_returndatasize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const RETURNDATACOPY = Operation{
    .execute = memory_ops.op_returndatacopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const REVERT = Operation{
    .execute = control.op_revert,
    .constant_gas = 0,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const STATICCALL = Operation{
    .execute = system.op_staticcall,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

// Constantinople operations
const CREATE2 = Operation{
    .execute = system.op_create2,
    .constant_gas = opcodes.gas_constants.CreateGas,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

// Homestead operations
const DELEGATECALL = Operation{
    .execute = system.op_delegatecall,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

// Istanbul operations
const CHAINID = Operation{
    .execute = environment.op_chainid,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const SELFBALANCE = Operation{
    .execute = environment.op_selfbalance,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// London operations
const BASEFEE = Operation{
    .execute = block.op_basefee,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// DUP operations
const DUP1 = Operation{
    .execute = stack_ops.op_dup1,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP2 = Operation{
    .execute = stack_ops.op_dup2,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP3 = Operation{
    .execute = stack_ops.op_dup3,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP4 = Operation{
    .execute = stack_ops.op_dup4,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP5 = Operation{
    .execute = stack_ops.op_dup5,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 5,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP6 = Operation{
    .execute = stack_ops.op_dup6,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP7 = Operation{
    .execute = stack_ops.op_dup7,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP8 = Operation{
    .execute = stack_ops.op_dup8,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 8,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP9 = Operation{
    .execute = stack_ops.op_dup9,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 9,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP10 = Operation{
    .execute = stack_ops.op_dup10,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 10,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP11 = Operation{
    .execute = stack_ops.op_dup11,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 11,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP12 = Operation{
    .execute = stack_ops.op_dup12,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 12,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP13 = Operation{
    .execute = stack_ops.op_dup13,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 13,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP14 = Operation{
    .execute = stack_ops.op_dup14,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 14,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP15 = Operation{
    .execute = stack_ops.op_dup15,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 15,
    .max_stack = Stack.CAPACITY - 1,
};

const DUP16 = Operation{
    .execute = stack_ops.op_dup16,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 16,
    .max_stack = Stack.CAPACITY - 1,
};

// SWAP operations
const SWAP1 = Operation{
    .execute = stack_ops.op_swap1,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SWAP2 = Operation{
    .execute = stack_ops.op_swap2,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const SWAP3 = Operation{
    .execute = stack_ops.op_swap3,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

const SWAP4 = Operation{
    .execute = stack_ops.op_swap4,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 5,
    .max_stack = Stack.CAPACITY,
};

const SWAP5 = Operation{
    .execute = stack_ops.op_swap5,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

const SWAP6 = Operation{
    .execute = stack_ops.op_swap6,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

const SWAP7 = Operation{
    .execute = stack_ops.op_swap7,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 8,
    .max_stack = Stack.CAPACITY,
};

const SWAP8 = Operation{
    .execute = stack_ops.op_swap8,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 9,
    .max_stack = Stack.CAPACITY,
};

const SWAP9 = Operation{
    .execute = stack_ops.op_swap9,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 10,
    .max_stack = Stack.CAPACITY,
};

const SWAP10 = Operation{
    .execute = stack_ops.op_swap10,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 11,
    .max_stack = Stack.CAPACITY,
};

const SWAP11 = Operation{
    .execute = stack_ops.op_swap11,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 12,
    .max_stack = Stack.CAPACITY,
};

const SWAP12 = Operation{
    .execute = stack_ops.op_swap12,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 13,
    .max_stack = Stack.CAPACITY,
};

const SWAP13 = Operation{
    .execute = stack_ops.op_swap13,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 14,
    .max_stack = Stack.CAPACITY,
};

const SWAP14 = Operation{
    .execute = stack_ops.op_swap14,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 15,
    .max_stack = Stack.CAPACITY,
};

const SWAP15 = Operation{
    .execute = stack_ops.op_swap15,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 16,
    .max_stack = Stack.CAPACITY,
};

const SWAP16 = Operation{
    .execute = stack_ops.op_swap16,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 17,
    .max_stack = Stack.CAPACITY,
};

// Shanghai operations
const PUSH0 = Operation{
    .execute = stack_ops.op_push0,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// Cancun operations
const BLOBHASH = Operation{
    .execute = block.op_blobhash,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const BLOBBASEFEE = Operation{
    .execute = block.op_blobbasefee,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const MCOPY = Operation{
    .execute = memory_ops.op_mcopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const TLOAD = Operation{
    .execute = storage.op_tload,
    .constant_gas = 100,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const TSTORE = Operation{
    .execute = storage.op_tstore,
    .constant_gas = 100,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// Helper to convert Stack errors to ExecutionError
inline fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

// Gas opcode handler
fn gas_op(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try stack_push(&frame.stack, @as(u256, @intCast(frame.gas_remaining)));

    return Operation.ExecutionResult{};
}

// Convenience functions for creating jump tables for specific hardforks
pub fn new_frontier_instruction_set() Self {
    return init_from_hardfork(.FRONTIER);
}

pub fn new_homestead_instruction_set() Self {
    return init_from_hardfork(.HOMESTEAD);
}

pub fn new_tangerine_whistle_instruction_set() Self {
    return init_from_hardfork(.TANGERINE_WHISTLE);
}

pub fn new_spurious_dragon_instruction_set() Self {
    return init_from_hardfork(.SPURIOUS_DRAGON);
}

pub fn new_byzantium_instruction_set() Self {
    return init_from_hardfork(.BYZANTIUM);
}

pub fn new_constantinople_instruction_set() Self {
    return init_from_hardfork(.CONSTANTINOPLE);
}

pub fn new_petersburg_instruction_set() Self {
    return init_from_hardfork(.PETERSBURG);
}

pub fn new_istanbul_instruction_set() Self {
    return init_from_hardfork(.ISTANBUL);
}

pub fn new_berlin_instruction_set() Self {
    return init_from_hardfork(.BERLIN);
}

pub fn new_london_instruction_set() Self {
    return init_from_hardfork(.LONDON);
}

pub fn new_merge_instruction_set() Self {
    return init_from_hardfork(.MERGE);
}

pub fn new_shanghai_instruction_set() Self {
    return init_from_hardfork(.SHANGHAI);
}

pub fn new_cancun_instruction_set() Self {
    return init_from_hardfork(.CANCUN);
}

// Legacy function for backward compatibility
pub fn new_frontier_instruction_set_legacy() Self {
    var jt = Self.init();

    // Setup operation table for Frontier
    jt.table[0x00] = &STOP;
    jt.table[0x01] = &ADD;
    jt.table[0x02] = &MUL;
    jt.table[0x03] = &SUB;
    jt.table[0x04] = &DIV;
    jt.table[0x05] = &SDIV;
    jt.table[0x06] = &MOD;
    jt.table[0x07] = &SMOD;
    jt.table[0x08] = &ADDMOD;
    jt.table[0x09] = &MULMOD;
    jt.table[0x0a] = &EXP;
    jt.table[0x0b] = &SIGNEXTEND;

    // 0x10s: Comparison & Bitwise Logic
    jt.table[0x10] = &LT;
    jt.table[0x11] = &GT;
    jt.table[0x12] = &SLT;
    jt.table[0x13] = &SGT;
    jt.table[0x14] = &EQ;
    jt.table[0x15] = &ISZERO;
    jt.table[0x16] = &AND;
    jt.table[0x17] = &OR;
    jt.table[0x18] = &XOR;
    jt.table[0x19] = &NOT;
    jt.table[0x1a] = &BYTE;

    // 0x20s: SHA3
    jt.table[0x20] = &SHA3;

    // 0x30s: Environmental Information
    jt.table[0x30] = &ADDRESS;
    jt.table[0x31] = &BALANCE;
    jt.table[0x32] = &ORIGIN;
    jt.table[0x33] = &CALLER;
    jt.table[0x34] = &CALLVALUE;
    jt.table[0x35] = &CALLDATALOAD;
    jt.table[0x36] = &CALLDATASIZE;
    jt.table[0x37] = &CALLDATACOPY;
    jt.table[0x38] = &CODESIZE;
    jt.table[0x39] = &CODECOPY;
    jt.table[0x3a] = &GASPRICE;
    jt.table[0x3b] = &EXTCODESIZE;
    jt.table[0x3c] = &EXTCODECOPY;

    // 0x40s: Block Information
    jt.table[0x40] = &BLOCKHASH;
    jt.table[0x41] = &COINBASE;
    jt.table[0x42] = &TIMESTAMP;
    jt.table[0x43] = &NUMBER;
    jt.table[0x44] = &DIFFICULTY;
    jt.table[0x45] = &GASLIMIT;

    // 0x50s: Stack, Memory, Storage and Flow Operations
    jt.table[0x50] = &POP;
    jt.table[0x51] = &MLOAD;
    jt.table[0x52] = &MSTORE;
    jt.table[0x53] = &MSTORE8;
    jt.table[0x54] = &SLOAD;
    jt.table[0x55] = &SSTORE;
    jt.table[0x56] = &JUMP;
    jt.table[0x57] = &JUMPI;
    jt.table[0x58] = &PC;
    jt.table[0x59] = &MSIZE;
    jt.table[0x5a] = &GAS;
    jt.table[0x5b] = &JUMPDEST;

    // 0x60s & 0x70s: Push operations
    inline for (0..32) |i| {
        jt.table[0x60 + i] = &Operation{
            .execute = switch (i + 1) {
                1 => stack_ops.op_push1,
                2 => stack_ops.op_push2,
                3 => stack_ops.op_push3,
                4 => stack_ops.op_push4,
                5 => stack_ops.op_push5,
                6 => stack_ops.op_push6,
                7 => stack_ops.op_push7,
                8 => stack_ops.op_push8,
                9 => stack_ops.op_push9,
                10 => stack_ops.op_push10,
                11 => stack_ops.op_push11,
                12 => stack_ops.op_push12,
                13 => stack_ops.op_push13,
                14 => stack_ops.op_push14,
                15 => stack_ops.op_push15,
                16 => stack_ops.op_push16,
                17 => stack_ops.op_push17,
                18 => stack_ops.op_push18,
                19 => stack_ops.op_push19,
                20 => stack_ops.op_push20,
                21 => stack_ops.op_push21,
                22 => stack_ops.op_push22,
                23 => stack_ops.op_push23,
                24 => stack_ops.op_push24,
                25 => stack_ops.op_push25,
                26 => stack_ops.op_push26,
                27 => stack_ops.op_push27,
                28 => stack_ops.op_push28,
                29 => stack_ops.op_push29,
                30 => stack_ops.op_push30,
                31 => stack_ops.op_push31,
                32 => stack_ops.op_push32,
                else => unreachable,
            },
            .constant_gas = opcodes.gas_constants.GasFastestStep,
            .min_stack = 0,
            .max_stack = Stack.CAPACITY - 1,
        };
    }

    // 0x80s: Duplication Operations
    jt.table[0x80] = &DUP1;
    jt.table[0x81] = &DUP2;
    jt.table[0x82] = &DUP3;
    jt.table[0x83] = &DUP4;
    jt.table[0x84] = &DUP5;
    jt.table[0x85] = &DUP6;
    jt.table[0x86] = &DUP7;
    jt.table[0x87] = &DUP8;
    jt.table[0x88] = &DUP9;
    jt.table[0x89] = &DUP10;
    jt.table[0x8a] = &DUP11;
    jt.table[0x8b] = &DUP12;
    jt.table[0x8c] = &DUP13;
    jt.table[0x8d] = &DUP14;
    jt.table[0x8e] = &DUP15;
    jt.table[0x8f] = &DUP16;

    // 0x90s: Exchange Operations
    jt.table[0x90] = &SWAP1;
    jt.table[0x91] = &SWAP2;
    jt.table[0x92] = &SWAP3;
    jt.table[0x93] = &SWAP4;
    jt.table[0x94] = &SWAP5;
    jt.table[0x95] = &SWAP6;
    jt.table[0x96] = &SWAP7;
    jt.table[0x97] = &SWAP8;
    jt.table[0x98] = &SWAP9;
    jt.table[0x99] = &SWAP10;
    jt.table[0x9a] = &SWAP11;
    jt.table[0x9b] = &SWAP12;
    jt.table[0x9c] = &SWAP13;
    jt.table[0x9d] = &SWAP14;
    jt.table[0x9e] = &SWAP15;
    jt.table[0x9f] = &SWAP16;

    // 0xa0s: Logging Operations
    inline for (0..5) |i| {
        jt.table[0xa0 + i] = &Operation{
            .execute = switch (i) {
                0 => log.op_log0,
                1 => log.op_log1,
                2 => log.op_log2,
                3 => log.op_log3,
                4 => log.op_log4,
                else => unreachable,
            },
            .constant_gas = opcodes.gas_constants.LogGas + opcodes.gas_constants.LogTopicGas * i,
            .min_stack = @as(u32, @intCast(i + 2)),
            .max_stack = Stack.CAPACITY,
        };
    }

    // 0xf0s: System operations
    jt.table[0xf0] = &CREATE;
    jt.table[0xf1] = &CALL;
    jt.table[0xf2] = &CALLCODE;
    jt.table[0xf3] = &RETURN;
    jt.table[0xfe] = &INVALID;
    jt.table[0xff] = &SELFDESTRUCT;

    // Fill remaining with UNDEFINED
    jt.validate();
    return jt;
}

pub fn init_from_hardfork(hardfork: Hardfork) Self {
    var jt = new_frontier_instruction_set_legacy();

    // Guard clause for Frontier
    if (hardfork == .FRONTIER) {
        return jt;
    }

    // Homestead and later additions
    jt.table[0xf4] = &DELEGATECALL;

    // Apply Tangerine Whistle gas cost changes (EIP-150)
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.TANGERINE_WHISTLE)) {
        apply_tangerine_whistle_gas_changes(&jt);
    }

    // Byzantium additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.BYZANTIUM)) {
        jt.table[0x3d] = &RETURNDATASIZE;
        jt.table[0x3e] = &RETURNDATACOPY;
        jt.table[0xfd] = &REVERT;
        jt.table[0xfa] = &STATICCALL;
    }

    // Constantinople additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.CONSTANTINOPLE)) {
        jt.table[0xf5] = &CREATE2;
        jt.table[0x3f] = &EXTCODEHASH;
        jt.table[0x1b] = &SHL;
        jt.table[0x1c] = &SHR;
        jt.table[0x1d] = &SAR;
    }

    // Istanbul additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.ISTANBUL)) {
        jt.table[0x46] = &CHAINID;
        jt.table[0x47] = &SELFBALANCE;
        apply_istanbul_gas_changes(&jt);
    }

    // Berlin additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.BERLIN)) {
        apply_berlin_gas_changes(&jt);
    }

    // London additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.LONDON)) {
        jt.table[0x48] = &BASEFEE;
    }

    // Shanghai additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.SHANGHAI)) {
        jt.table[0x5f] = &PUSH0;
    }

    // Cancun additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.CANCUN)) {
        jt.table[0x49] = &BLOBHASH;
        jt.table[0x4a] = &BLOBBASEFEE;
        jt.table[0x5e] = &MCOPY;
        jt.table[0x5c] = &TLOAD;
        jt.table[0x5d] = &TSTORE;
    }

    return jt;
}

fn apply_tangerine_whistle_gas_changes(jt: *Self) void {
    // BALANCE: 20 -> 400
    if (jt.table[0x31]) |op| {
        @constCast(op).constant_gas = 400;
    }
    // EXTCODESIZE: 20 -> 700
    if (jt.table[0x3b]) |op| {
        @constCast(op).constant_gas = 700;
    }
    // EXTCODECOPY: 20 -> 700
    if (jt.table[0x3c]) |op| {
        @constCast(op).constant_gas = 700;
    }
    // SLOAD: 50 -> 200
    if (jt.table[0x54]) |op| {
        @constCast(op).constant_gas = 200;
    }
    // CALL/CALLCODE/DELEGATECALL: 40 -> 700
    if (jt.table[0xf1]) |op| {
        @constCast(op).constant_gas = 700;
    }
    if (jt.table[0xf2]) |op| {
        @constCast(op).constant_gas = 700;
    }
    if (jt.table[0xf4]) |op| {
        @constCast(op).constant_gas = 700;
    }
    // SELFDESTRUCT: 0 -> 5000
    if (jt.table[0xff]) |op| {
        @constCast(op).constant_gas = 5000;
    }
}

fn apply_istanbul_gas_changes(jt: *Self) void {
    // Istanbul gas cost changes (EIP-1884)
    // BALANCE: 400 -> 700
    if (jt.table[0x31]) |op| {
        @constCast(op).constant_gas = 700;
    }
    // SLOAD: 200 -> 800
    if (jt.table[0x54]) |op| {
        @constCast(op).constant_gas = 800;
    }
    // EXTCODEHASH: 400 -> 700
    if (jt.table[0x3f]) |op| {
        @constCast(op).constant_gas = 700;
    }
}

fn apply_berlin_gas_changes(jt: *Self) void {
    // Berlin gas cost changes (EIP-2929)
    // Note: Berlin introduces cold/warm access with dynamic gas costs
    // These are handled in the opcode implementations rather than base gas
    // Cold access costs:
    // - BALANCE/EXTCODESIZE/EXTCODECOPY/EXTCODEHASH: 2600 (cold), 100 (warm)
    // - SLOAD: 2100 (cold), 100 (warm)
    // - CALL/CALLCODE/DELEGATECALL/STATICCALL: +2600 for cold address

    // Set base gas to 0 for opcodes that now have fully dynamic gas
    if (jt.table[0x31]) |op| { // BALANCE
        @constCast(op).constant_gas = 0;
    }
    if (jt.table[0x3b]) |op| { // EXTCODESIZE
        @constCast(op).constant_gas = 0;
    }
    if (jt.table[0x3c]) |op| { // EXTCODECOPY
        @constCast(op).constant_gas = 0;
    }
    if (jt.table[0x3f]) |op| { // EXTCODEHASH
        @constCast(op).constant_gas = 0;
    }
    if (jt.table[0x54]) |op| { // SLOAD
        @constCast(op).constant_gas = 0;
    }
    // CALL operations keep base gas but add dynamic cold access cost
}

// Tests
test "JumpTable basic operations" {
    const jt = new_frontier_instruction_set();

    // Test a couple of operations
    const stop_op = jt.get_operation(0x00);
    try std.testing.expectEqual(@as(u64, 0), stop_op.constant_gas);

    const add_op = jt.get_operation(0x01);
    try std.testing.expectEqual(@as(u64, opcodes.gas_constants.GasFastestStep), add_op.constant_gas);

    // Test an undefined operation
    const undef_op = jt.get_operation(0xef);
    try std.testing.expect(undef_op.undefined);
}

test "JumpTable initialization and validation" {
    const jt = Self.init();
    try std.testing.expectEqual(@as(usize, 256), jt.table.len);

    // Check that all entries are initially null
    for (0..256) |i| {
        try std.testing.expectEqual(@as(?*const Operation, null), jt.table[i]);
    }

    // Validate should fill all nulls with UNDEFINED
    var mutable_jt = jt;
    mutable_jt.validate();

    // Now check that all entries have been filled
    for (0..256) |i| {
        const entry = mutable_jt.table[i];
        try std.testing.expect(entry != null);
        try std.testing.expectEqual(true, entry.?.undefined);
    }
}

test "JumpTable stack calculation helpers" {
    try std.testing.expectEqual(@as(u32, 2), min_stack(2, 1));
    try std.testing.expectEqual(@as(u32, Stack.CAPACITY), max_stack(2, 1));

    try std.testing.expectEqual(@as(u32, 3), min_dup_stack(3));
    try std.testing.expectEqual(@as(u32, Stack.CAPACITY - 1), max_dup_stack(3));

    try std.testing.expectEqual(@as(u32, 5), min_swap_stack(4));
    try std.testing.expectEqual(@as(u32, Stack.CAPACITY), max_swap_stack(4));
}

test "JumpTable gas constants" {
    try std.testing.expectEqual(@as(u64, 2), opcodes.gas_constants.GasQuickStep);
    try std.testing.expectEqual(@as(u64, 3), opcodes.gas_constants.GasFastestStep);
    try std.testing.expectEqual(@as(u64, 5), opcodes.gas_constants.GasFastStep);
    try std.testing.expectEqual(@as(u64, 8), opcodes.gas_constants.GasMidStep);
    try std.testing.expectEqual(@as(u64, 10), opcodes.gas_constants.GasSlowStep);
    try std.testing.expectEqual(@as(u64, 20), opcodes.gas_constants.GasExtStep);

    try std.testing.expectEqual(@as(u64, 30), opcodes.gas_constants.Keccak256Gas);
    try std.testing.expectEqual(@as(u64, 375), opcodes.gas_constants.LogGas);
    try std.testing.expectEqual(@as(u64, 32000), opcodes.gas_constants.CreateGas);
}

test "JumpTable execute consumes gas before opcode execution" {
    const jt = new_frontier_instruction_set();

    // Create a test frame with some gas
    const test_allocator = std.testing.allocator;
    const ZERO_ADDRESS = [_]u8{0} ** 20;
    var test_contract = Contract{
        .address = ZERO_ADDRESS,
        .caller = ZERO_ADDRESS,
        .value = 0,
        .code = &[_]u8{0x01}, // ADD opcode
        .code_hash = [_]u8{0} ** 32,
        .code_size = 1,
        .analysis = null,
        .gas = 1000,
        .gas_refund = 0,
        .input = &[_]u8{},
        .is_deployment = false,
        .is_system_call = false,
        .is_static = false,
        .storage_access = null,
        .original_storage = null,
        .is_cold = false,
        .has_jumpdests = false,
        .is_empty = false,
    };
    defer test_contract.deinit(null);
    var test_frame = try Frame.init(test_allocator, &test_contract);
    test_frame.memory.finalize_root();
    defer test_frame.deinit();
    test_frame.gas_remaining = 100;

    // Push two values for ADD operation
    try test_frame.stack.append(10);
    try test_frame.stack.append(20);

    // Create interpreter and state pointers
    var test_vm = struct {
        allocator: std.mem.Allocator,
    }{ .allocator = test_allocator };
    const interpreter_ptr: *Operation.Interpreter = @ptrCast(&test_vm);
    const state_ptr: *Operation.State = @ptrCast(&test_frame);

    // Execute ADD opcode (0x01) which has GasFastestStep (3) gas cost
    _ = try jt.execute(0, interpreter_ptr, state_ptr, 0x01);

    // Check that gas was consumed
    try std.testing.expectEqual(@as(u64, 97), test_frame.gas_remaining);

    // Check that ADD operation was performed
    const result = try test_frame.stack.pop();
    try std.testing.expectEqual(@as(u256, 30), result);
}

test "JumpTable Constantinople opcodes" {
    // Test that Constantinople opcodes are properly configured
    const jt_frontier = init_from_hardfork(.FRONTIER);
    const jt_byzantium = init_from_hardfork(.BYZANTIUM);
    const jt_constantinople = init_from_hardfork(.CONSTANTINOPLE);

    // Constantinople opcodes should not be in Frontier
    try std.testing.expect(jt_frontier.get_operation(0xf5).undefined); // CREATE2
    try std.testing.expect(jt_frontier.get_operation(0x3f).undefined); // EXTCODEHASH
    try std.testing.expect(jt_frontier.get_operation(0x1b).undefined); // SHL
    try std.testing.expect(jt_frontier.get_operation(0x1c).undefined); // SHR
    try std.testing.expect(jt_frontier.get_operation(0x1d).undefined); // SAR

    // Constantinople opcodes should not be in Byzantium
    try std.testing.expect(jt_byzantium.get_operation(0xf5).undefined); // CREATE2
    try std.testing.expect(jt_byzantium.get_operation(0x3f).undefined); // EXTCODEHASH
    try std.testing.expect(jt_byzantium.get_operation(0x1b).undefined); // SHL
    try std.testing.expect(jt_byzantium.get_operation(0x1c).undefined); // SHR
    try std.testing.expect(jt_byzantium.get_operation(0x1d).undefined); // SAR

    // Constantinople opcodes should be in Constantinople
    try std.testing.expect(!jt_constantinople.get_operation(0xf5).undefined); // CREATE2
    try std.testing.expect(!jt_constantinople.get_operation(0x3f).undefined); // EXTCODEHASH
    try std.testing.expect(!jt_constantinople.get_operation(0x1b).undefined); // SHL
    try std.testing.expect(!jt_constantinople.get_operation(0x1c).undefined); // SHR
    try std.testing.expect(!jt_constantinople.get_operation(0x1d).undefined); // SAR

    // Verify correct operation properties
    const create2_op = jt_constantinople.get_operation(0xf5);
    try std.testing.expectEqual(@as(u64, opcodes.gas_constants.CreateGas), create2_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 4), create2_op.min_stack);

    const extcodehash_op = jt_constantinople.get_operation(0x3f);
    try std.testing.expectEqual(@as(u64, 700), extcodehash_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 1), extcodehash_op.min_stack);

    const shl_op = jt_constantinople.get_operation(0x1b);
    try std.testing.expectEqual(@as(u64, opcodes.gas_constants.GasFastestStep), shl_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 2), shl_op.min_stack);
}

test "JumpTable Istanbul opcodes" {
    // Test that Istanbul opcodes are properly configured
    const jt_constantinople = init_from_hardfork(.CONSTANTINOPLE);
    const jt_istanbul = init_from_hardfork(.ISTANBUL);
    const jt_london = init_from_hardfork(.LONDON);

    // Istanbul opcodes should not be in Constantinople
    try std.testing.expect(jt_constantinople.get_operation(0x46).undefined); // CHAINID
    try std.testing.expect(jt_constantinople.get_operation(0x47).undefined); // SELFBALANCE

    // Istanbul opcodes should be in Istanbul
    try std.testing.expect(!jt_istanbul.get_operation(0x46).undefined); // CHAINID
    try std.testing.expect(!jt_istanbul.get_operation(0x47).undefined); // SELFBALANCE

    // BASEFEE should not be in Istanbul
    try std.testing.expect(jt_istanbul.get_operation(0x48).undefined); // BASEFEE

    // BASEFEE should be in London
    try std.testing.expect(!jt_london.get_operation(0x48).undefined); // BASEFEE

    // Verify correct operation properties
    const chainid_op = jt_istanbul.get_operation(0x46);
    try std.testing.expectEqual(@as(u64, opcodes.gas_constants.GasQuickStep), chainid_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 0), chainid_op.min_stack);

    const selfbalance_op = jt_istanbul.get_operation(0x47);
    try std.testing.expectEqual(@as(u64, opcodes.gas_constants.GasFastStep), selfbalance_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 0), selfbalance_op.min_stack);

    const basefee_op = jt_london.get_operation(0x48);
    try std.testing.expectEqual(@as(u64, opcodes.gas_constants.GasQuickStep), basefee_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 0), basefee_op.min_stack);
}

test "JumpTable Shanghai opcodes" {
    // Test that Shanghai opcodes are properly configured
    const jt_london = init_from_hardfork(.LONDON);
    const jt_merge = init_from_hardfork(.MERGE);
    const jt_shanghai = init_from_hardfork(.SHANGHAI);

    // PUSH0 should not be in London/Merge
    try std.testing.expect(jt_london.get_operation(0x5f).undefined); // PUSH0
    try std.testing.expect(jt_merge.get_operation(0x5f).undefined); // PUSH0

    // PUSH0 should be in Shanghai
    try std.testing.expect(!jt_shanghai.get_operation(0x5f).undefined); // PUSH0

    // Verify correct operation properties
    const push0_op = jt_shanghai.get_operation(0x5f);
    try std.testing.expectEqual(@as(u64, opcodes.gas_constants.GasQuickStep), push0_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 0), push0_op.min_stack);
    try std.testing.expectEqual(@as(u32, Stack.CAPACITY - 1), push0_op.max_stack);
}

test "JumpTable Cancun opcodes" {
    // Test that Cancun opcodes are properly configured
    const jt_shanghai = init_from_hardfork(.SHANGHAI);
    const jt_cancun = init_from_hardfork(.CANCUN);

    // Cancun opcodes should not be in Shanghai
    try std.testing.expect(jt_shanghai.get_operation(0x49).undefined); // BLOBHASH
    try std.testing.expect(jt_shanghai.get_operation(0x4a).undefined); // BLOBBASEFEE
    try std.testing.expect(jt_shanghai.get_operation(0x5e).undefined); // MCOPY
    try std.testing.expect(jt_shanghai.get_operation(0x5c).undefined); // TLOAD
    try std.testing.expect(jt_shanghai.get_operation(0x5d).undefined); // TSTORE

    // Cancun opcodes should be in Cancun
    try std.testing.expect(!jt_cancun.get_operation(0x49).undefined); // BLOBHASH
    try std.testing.expect(!jt_cancun.get_operation(0x4a).undefined); // BLOBBASEFEE
    try std.testing.expect(!jt_cancun.get_operation(0x5e).undefined); // MCOPY
    try std.testing.expect(!jt_cancun.get_operation(0x5c).undefined); // TLOAD
    try std.testing.expect(!jt_cancun.get_operation(0x5d).undefined); // TSTORE

    // Verify correct operation properties
    const blobhash_op = jt_cancun.get_operation(0x49);
    try std.testing.expectEqual(@as(u64, opcodes.gas_constants.GasFastestStep), blobhash_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 1), blobhash_op.min_stack);

    const blobbasefee_op = jt_cancun.get_operation(0x4a);
    try std.testing.expectEqual(@as(u64, opcodes.gas_constants.GasQuickStep), blobbasefee_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 0), blobbasefee_op.min_stack);

    const mcopy_op = jt_cancun.get_operation(0x5e);
    try std.testing.expectEqual(@as(u64, opcodes.gas_constants.GasFastestStep), mcopy_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 3), mcopy_op.min_stack);

    const tload_op = jt_cancun.get_operation(0x5c);
    try std.testing.expectEqual(@as(u64, 100), tload_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 1), tload_op.min_stack);

    const tstore_op = jt_cancun.get_operation(0x5d);
    try std.testing.expectEqual(@as(u64, 100), tstore_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 2), tstore_op.min_stack);
}
