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

// Gas constants
pub const GasQuickStep: u64 = 2;
pub const GasFastestStep: u64 = 3;
pub const GasFastStep: u64 = 5;
pub const GasMidStep: u64 = 8;
pub const GasSlowStep: u64 = 10;
pub const GasExtStep: u64 = 20;

// Parameter costs
pub const Keccak256Gas: u64 = 30;
pub const Keccak256WordGas: u64 = 6;
pub const SloadGas: u64 = 50;
pub const SstoreSentryGas: u64 = 2300;
pub const SstoreSetGas: u64 = 20000;
pub const SstoreResetGas: u64 = 5000;
pub const SstoreClearGas: u64 = 5000;
pub const SstoreRefundGas: u64 = 15000;
pub const JumpdestGas: u64 = 1;
pub const LogGas: u64 = 375;
pub const LogDataGas: u64 = 8;
pub const LogTopicGas: u64 = 375;
pub const CreateGas: u64 = 32000;
pub const CallGas: u64 = 40;
pub const CallStipend: u64 = 2300;
pub const CallValueTransferGas: u64 = 9000;
pub const CallNewAccountGas: u64 = 25000;
pub const SelfdestructRefundGas: u64 = 24000;
pub const MemoryGas: u64 = 3;
pub const QuadCoeffDiv: u64 = 512;
pub const CreateDataGas: u64 = 200;
pub const TxGas: u64 = 21000;
pub const TxGasContractCreation: u64 = 53000;
pub const TxDataZeroGas: u64 = 4;
pub const TxDataNonZeroGas: u64 = 16;
pub const CopyGas: u64 = 3;

const Self = @This();

table: [256]?*const Operation,

pub fn init() Self {
    return Self{
        .table = [_]?*const Operation{null} ** 256,
    };
}

pub fn get_operation(self: *const Self, opcode: u8) *const Operation {
    return self.table[opcode] orelse &Operation.NULL;
}

pub fn execute(self: *const Self, pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State, opcode: u8) ExecutionError.Error!Operation.ExecutionResult {
    const operation = self.get_operation(opcode);
    
    // Cast state to Frame to access gas_remaining
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Consume base gas cost before executing the opcode
    if (operation.constant_gas > 0) {
        try frame.consume_gas(operation.constant_gas);
    }
    
    // Execute the opcode handler
    return operation.execute(pc, interpreter, state);
}

pub fn validate(self: *Self) void {
    for (0..256) |i| {
        if (self.table[i] == null) {
            self.table[i] = &UNDEFINED;
        } else if (self.table[i].?.memory_size != null and self.table[i].?.dynamic_gas == null) {
            @panic("Operation has memory size but no dynamic gas calculation");
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
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const MUL = Operation{
    .execute = arithmetic.op_mul,
    .constant_gas = GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SUB = Operation{
    .execute = arithmetic.op_sub,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const DIV = Operation{
    .execute = arithmetic.op_div,
    .constant_gas = GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SDIV = Operation{
    .execute = arithmetic.op_sdiv,
    .constant_gas = GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const MOD = Operation{
    .execute = arithmetic.op_mod,
    .constant_gas = GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SMOD = Operation{
    .execute = arithmetic.op_smod,
    .constant_gas = GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const ADDMOD = Operation{
    .execute = arithmetic.op_addmod,
    .constant_gas = GasMidStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const MULMOD = Operation{
    .execute = arithmetic.op_mulmod,
    .constant_gas = GasMidStep,
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
    .constant_gas = GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// Comparison operations
const LT = Operation{
    .execute = comparison.op_lt,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const GT = Operation{
    .execute = comparison.op_gt,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SLT = Operation{
    .execute = comparison.op_slt,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SGT = Operation{
    .execute = comparison.op_sgt,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const EQ = Operation{
    .execute = comparison.op_eq,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const ISZERO = Operation{
    .execute = comparison.op_iszero,
    .constant_gas = GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// Bitwise operations
const AND = Operation{
    .execute = bitwise.op_and,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const OR = Operation{
    .execute = bitwise.op_or,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const XOR = Operation{
    .execute = bitwise.op_xor,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const NOT = Operation{
    .execute = bitwise.op_not,
    .constant_gas = GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const BYTE = Operation{
    .execute = bitwise.op_byte,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SHL = Operation{
    .execute = bitwise.op_shl,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SHR = Operation{
    .execute = bitwise.op_shr,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const SAR = Operation{
    .execute = bitwise.op_sar,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// SHA3
const SHA3 = Operation{
    .execute = crypto.op_sha3,
    .constant_gas = Keccak256Gas,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

// Environment operations
const ADDRESS = Operation{
    .execute = environment.op_address,
    .constant_gas = GasQuickStep,
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
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const CALLER = Operation{
    .execute = environment.op_caller,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const CALLVALUE = Operation{
    .execute = environment.op_callvalue,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const CALLDATALOAD = Operation{
    .execute = memory_ops.op_calldataload,
    .constant_gas = GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const CALLDATASIZE = Operation{
    .execute = memory_ops.op_calldatasize,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const CALLDATACOPY = Operation{
    .execute = memory_ops.op_calldatacopy,
    .constant_gas = GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const CODESIZE = Operation{
    .execute = memory_ops.op_codesize,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const CODECOPY = Operation{
    .execute = memory_ops.op_codecopy,
    .constant_gas = GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const GASPRICE = Operation{
    .execute = environment.op_gasprice,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
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
    .constant_gas = GasExtStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const COINBASE = Operation{
    .execute = block.op_coinbase,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const TIMESTAMP = Operation{
    .execute = block.op_timestamp,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const NUMBER = Operation{
    .execute = block.op_number,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const DIFFICULTY = Operation{
    .execute = block.op_difficulty,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const GASLIMIT = Operation{
    .execute = block.op_gaslimit,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// Stack operations
const POP = Operation{
    .execute = stack_ops.op_pop,
    .constant_gas = GasQuickStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const MLOAD = Operation{
    .execute = memory_ops.op_mload,
    .constant_gas = GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const MSTORE = Operation{
    .execute = memory_ops.op_mstore,
    .constant_gas = GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const MSTORE8 = Operation{
    .execute = memory_ops.op_mstore8,
    .constant_gas = GasFastestStep,
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
    .constant_gas = GasMidStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const JUMPI = Operation{
    .execute = control.op_jumpi,
    .constant_gas = GasSlowStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

const PC = Operation{
    .execute = control.op_pc,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const MSIZE = Operation{
    .execute = memory_ops.op_msize,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const GAS = Operation{
    .execute = gas_op,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const JUMPDEST = Operation{
    .execute = control.op_jumpdest,
    .constant_gas = JumpdestGas,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

// System operations
const CREATE = Operation{
    .execute = system.op_create,
    .constant_gas = CreateGas,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

const CALL = Operation{
    .execute = system.op_call,
    .constant_gas = CallGas,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

const CALLCODE = Operation{
    .execute = system.op_callcode,
    .constant_gas = CallGas,
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
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const RETURNDATACOPY = Operation{
    .execute = memory_ops.op_returndatacopy,
    .constant_gas = GasFastestStep,
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
    .constant_gas = CallGas,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

// Constantinople operations
const CREATE2 = Operation{
    .execute = system.op_create2,
    .constant_gas = CreateGas,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

// Homestead operations
const DELEGATECALL = Operation{
    .execute = system.op_delegatecall,
    .constant_gas = CallGas,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

// Istanbul operations
const CHAINID = Operation{
    .execute = environment.op_chainid,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const SELFBALANCE = Operation{
    .execute = environment.op_selfbalance,
    .constant_gas = GasFastStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// London operations
const BASEFEE = Operation{
    .execute = block.op_basefee,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// Shanghai operations
const PUSH0 = Operation{
    .execute = stack_ops.op_push0,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// Cancun operations
const BLOBHASH = Operation{
    .execute = block.op_blobhash,
    .constant_gas = GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

const BLOBBASEFEE = Operation{
    .execute = block.op_blobbasefee,
    .constant_gas = GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

const MCOPY = Operation{
    .execute = memory_ops.op_mcopy,
    .constant_gas = GasFastestStep,
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

// Create jump table for specific hardfork
pub fn new_frontier_instruction_set() Self {
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
            .constant_gas = GasFastestStep,
            .min_stack = 0,
            .max_stack = Stack.CAPACITY - 1,
        };
    }

    // 0x80s: Duplication Operations
    inline for (1..17) |i| {
        jt.table[0x80 + i - 1] = &Operation{
            .execute = switch (i) {
                1 => stack_ops.op_dup1,
                2 => stack_ops.op_dup2,
                3 => stack_ops.op_dup3,
                4 => stack_ops.op_dup4,
                5 => stack_ops.op_dup5,
                6 => stack_ops.op_dup6,
                7 => stack_ops.op_dup7,
                8 => stack_ops.op_dup8,
                9 => stack_ops.op_dup9,
                10 => stack_ops.op_dup10,
                11 => stack_ops.op_dup11,
                12 => stack_ops.op_dup12,
                13 => stack_ops.op_dup13,
                14 => stack_ops.op_dup14,
                15 => stack_ops.op_dup15,
                16 => stack_ops.op_dup16,
                else => unreachable,
            },
            .constant_gas = GasFastestStep,
            .min_stack = min_dup_stack(@as(u32, @intCast(i))),
            .max_stack = max_dup_stack(@as(u32, @intCast(i))),
        };
    }

    // 0x90s: Exchange Operations
    inline for (1..17) |i| {
        jt.table[0x90 + i - 1] = &Operation{
            .execute = switch (i) {
                1 => stack_ops.op_swap1,
                2 => stack_ops.op_swap2,
                3 => stack_ops.op_swap3,
                4 => stack_ops.op_swap4,
                5 => stack_ops.op_swap5,
                6 => stack_ops.op_swap6,
                7 => stack_ops.op_swap7,
                8 => stack_ops.op_swap8,
                9 => stack_ops.op_swap9,
                10 => stack_ops.op_swap10,
                11 => stack_ops.op_swap11,
                12 => stack_ops.op_swap12,
                13 => stack_ops.op_swap13,
                14 => stack_ops.op_swap14,
                15 => stack_ops.op_swap15,
                16 => stack_ops.op_swap16,
                else => unreachable,
            },
            .constant_gas = GasFastestStep,
            .min_stack = min_swap_stack(@as(u32, @intCast(i))),
            .max_stack = max_swap_stack(@as(u32, @intCast(i))),
        };
    }

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
            .constant_gas = LogGas + LogTopicGas * i,
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
    var jt = new_frontier_instruction_set();
    
    // Add hardfork-specific opcodes
    switch (hardfork) {
        .FRONTIER => {},
        .HOMESTEAD, .DAO, .TANGERINE_WHISTLE, .SPURIOUS_DRAGON, .BYZANTIUM, .CONSTANTINOPLE, .PETERSBURG, .ISTANBUL, .MUIR_GLACIER, .BERLIN, .LONDON, .ARROW_GLACIER, .GRAY_GLACIER, .MERGE, .SHANGHAI, .CANCUN => {
            // Homestead adds DELEGATECALL (0xf4)
            jt.table[0xf4] = &DELEGATECALL;
            
            // Apply Tangerine Whistle gas cost changes (EIP-150)
            if (hardfork != .FRONTIER and hardfork != .HOMESTEAD and hardfork != .DAO) {
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
            
            // Continue with other hardforks
            switch (hardfork) {
                .FRONTIER, .HOMESTEAD, .DAO, .TANGERINE_WHISTLE, .SPURIOUS_DRAGON => {},
                .BYZANTIUM, .CONSTANTINOPLE, .PETERSBURG, .ISTANBUL, .MUIR_GLACIER, .BERLIN, .LONDON, .ARROW_GLACIER, .GRAY_GLACIER, .MERGE, .SHANGHAI, .CANCUN => {
                    // Byzantium additions
                    jt.table[0x3d] = &RETURNDATASIZE;
                    jt.table[0x3e] = &RETURNDATACOPY;
                    jt.table[0xfd] = &REVERT;
                    jt.table[0xfa] = &STATICCALL;
                    
                    // Continue with Constantinople and later
                    switch (hardfork) {
                        .FRONTIER, .HOMESTEAD, .DAO, .TANGERINE_WHISTLE, .SPURIOUS_DRAGON, .BYZANTIUM => {},
                        .CONSTANTINOPLE, .PETERSBURG, .ISTANBUL, .MUIR_GLACIER, .BERLIN, .LONDON, .ARROW_GLACIER, .GRAY_GLACIER, .MERGE, .SHANGHAI, .CANCUN => {
                            // Constantinople additions
                            jt.table[0xf5] = &CREATE2;
                            jt.table[0x3f] = &EXTCODEHASH;
                            jt.table[0x1b] = &SHL;
                            jt.table[0x1c] = &SHR;
                            jt.table[0x1d] = &SAR;
                            
                            // Continue with Istanbul and later
                            switch (hardfork) {
                                .FRONTIER, .HOMESTEAD, .DAO, .TANGERINE_WHISTLE, .SPURIOUS_DRAGON, .BYZANTIUM, .CONSTANTINOPLE, .PETERSBURG => {},
                                .ISTANBUL, .MUIR_GLACIER, .BERLIN, .LONDON, .ARROW_GLACIER, .GRAY_GLACIER, .MERGE, .SHANGHAI, .CANCUN => {
                                    // Istanbul additions
                                    jt.table[0x46] = &CHAINID;
                                    jt.table[0x47] = &SELFBALANCE;
                                    
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
                                    
                                    // Continue with Berlin and later
                                    if (hardfork != .FRONTIER and hardfork != .HOMESTEAD and hardfork != .DAO and 
                                        hardfork != .TANGERINE_WHISTLE and hardfork != .SPURIOUS_DRAGON and
                                        hardfork != .BYZANTIUM and hardfork != .CONSTANTINOPLE and
                                        hardfork != .PETERSBURG and hardfork != .ISTANBUL and hardfork != .MUIR_GLACIER) {
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
                                    
                                    // Continue with London and later
                                    switch (hardfork) {
                                        .FRONTIER, .HOMESTEAD, .DAO, .TANGERINE_WHISTLE, .SPURIOUS_DRAGON, .BYZANTIUM, .CONSTANTINOPLE, .PETERSBURG, .ISTANBUL, .MUIR_GLACIER, .BERLIN => {},
                                        .LONDON, .ARROW_GLACIER, .GRAY_GLACIER, .MERGE, .SHANGHAI, .CANCUN => {
                                            // London additions
                                            jt.table[0x48] = &BASEFEE;
                                            
                                            // Continue with Shanghai and later
                                            switch (hardfork) {
                                                .FRONTIER, .HOMESTEAD, .DAO, .TANGERINE_WHISTLE, .SPURIOUS_DRAGON, .BYZANTIUM, .CONSTANTINOPLE, .PETERSBURG, .ISTANBUL, .MUIR_GLACIER, .BERLIN, .LONDON, .ARROW_GLACIER, .GRAY_GLACIER, .MERGE => {},
                                                .SHANGHAI, .CANCUN => {
                                                    // Shanghai additions
                                                    jt.table[0x5f] = &PUSH0;
                                                    
                                                    // Continue with Cancun
                                                    switch (hardfork) {
                                                        .FRONTIER, .HOMESTEAD, .DAO, .TANGERINE_WHISTLE, .SPURIOUS_DRAGON, .BYZANTIUM, .CONSTANTINOPLE, .PETERSBURG, .ISTANBUL, .MUIR_GLACIER, .BERLIN, .LONDON, .ARROW_GLACIER, .GRAY_GLACIER, .MERGE, .SHANGHAI => {},
                                                        .CANCUN => {
                                                            // Cancun additions
                                                            jt.table[0x49] = &BLOBHASH;
                                                            jt.table[0x4a] = &BLOBBASEFEE;
                                                            jt.table[0x5e] = &MCOPY;
                                                            jt.table[0x5c] = &TLOAD;
                                                            jt.table[0x5d] = &TSTORE;
                                                        },
                                                    }
                                                },
                                            }
                                        },
                                    }
                                },
                            }
                        },
                    }
                },
            }
        },
    }
    
    return jt;
}


// Tests
test "JumpTable basic operations" {
    const jt = new_frontier_instruction_set();

    // Test a couple of operations
    const stop_op = jt.get_operation(0x00);
    try std.testing.expectEqual(@as(u64, 0), stop_op.constant_gas);

    const add_op = jt.get_operation(0x01);
    try std.testing.expectEqual(@as(u64, GasFastestStep), add_op.constant_gas);

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
    try std.testing.expectEqual(@as(u64, 2), GasQuickStep);
    try std.testing.expectEqual(@as(u64, 3), GasFastestStep);
    try std.testing.expectEqual(@as(u64, 5), GasFastStep);
    try std.testing.expectEqual(@as(u64, 8), GasMidStep);
    try std.testing.expectEqual(@as(u64, 10), GasSlowStep);
    try std.testing.expectEqual(@as(u64, 20), GasExtStep);

    try std.testing.expectEqual(@as(u64, 30), Keccak256Gas);
    try std.testing.expectEqual(@as(u64, 375), LogGas);
    try std.testing.expectEqual(@as(u64, 32000), CreateGas);
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
    };
    var test_frame = Frame.init(test_allocator, &test_contract);
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
    try std.testing.expectEqual(@as(u64, CreateGas), create2_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 4), create2_op.min_stack);
    
    const extcodehash_op = jt_constantinople.get_operation(0x3f);
    try std.testing.expectEqual(@as(u64, 700), extcodehash_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 1), extcodehash_op.min_stack);
    
    const shl_op = jt_constantinople.get_operation(0x1b);
    try std.testing.expectEqual(@as(u64, GasFastestStep), shl_op.constant_gas);
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
    try std.testing.expectEqual(@as(u64, GasQuickStep), chainid_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 0), chainid_op.min_stack);
    
    const selfbalance_op = jt_istanbul.get_operation(0x47);
    try std.testing.expectEqual(@as(u64, GasFastStep), selfbalance_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 0), selfbalance_op.min_stack);
    
    const basefee_op = jt_london.get_operation(0x48);
    try std.testing.expectEqual(@as(u64, GasQuickStep), basefee_op.constant_gas);
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
    try std.testing.expectEqual(@as(u64, GasQuickStep), push0_op.constant_gas);
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
    try std.testing.expectEqual(@as(u64, GasFastestStep), blobhash_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 1), blobhash_op.min_stack);
    
    const blobbasefee_op = jt_cancun.get_operation(0x4a);
    try std.testing.expectEqual(@as(u64, GasQuickStep), blobbasefee_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 0), blobbasefee_op.min_stack);
    
    const mcopy_op = jt_cancun.get_operation(0x5e);
    try std.testing.expectEqual(@as(u64, GasFastestStep), mcopy_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 3), mcopy_op.min_stack);
    
    const tload_op = jt_cancun.get_operation(0x5c);
    try std.testing.expectEqual(@as(u64, 100), tload_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 1), tload_op.min_stack);
    
    const tstore_op = jt_cancun.get_operation(0x5d);
    try std.testing.expectEqual(@as(u64, 100), tstore_op.constant_gas);
    try std.testing.expectEqual(@as(u32, 2), tstore_op.min_stack);
}