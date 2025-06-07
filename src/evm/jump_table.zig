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
const Log = @import("log.zig");

const instruction_sets = @import("instruction_sets.zig");
const opcodes = @import("opcodes/package.zig");
const stack_ops = opcodes.stack;
const log = opcodes.log;

/// EVM jump table for efficient opcode dispatch.
///
/// The jump table is a critical performance optimization that maps opcodes
/// to their execution handlers. Instead of using a switch statement with
/// 256 cases, the jump table provides O(1) dispatch by indexing directly
/// into an array of function pointers.
///
/// ## Design Rationale
/// - Array indexing is faster than switch statement branching
/// - Cache-line alignment improves memory access patterns
/// - Hardfork-specific tables allow for efficient versioning
/// - Null entries default to UNDEFINED operation
///
/// ## Hardfork Evolution
/// The jump table evolves with each hardfork:
/// - New opcodes are added (e.g., PUSH0 in Shanghai)
/// - Gas costs change (e.g., SLOAD in Berlin)
/// - Opcodes are removed or modified
///
/// ## Performance Considerations
/// - 64-byte cache line alignment reduces cache misses
/// - Direct indexing eliminates branch prediction overhead
/// - Operation structs are immutable for thread safety
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// const opcode = bytecode[pc];
/// const operation = table.get_operation(opcode);
/// const result = try table.execute(pc, interpreter, state, opcode);
/// ```
const Self = @This();

/// CPU cache line size for optimal memory alignment.
/// Most modern x86/ARM processors use 64-byte cache lines.
const CACHE_LINE_SIZE = 64;

/// Array of operation handlers indexed by opcode value.
/// Aligned to cache line boundaries for optimal performance.
/// Null entries are treated as undefined opcodes.
table: [256]?*const Operation align(CACHE_LINE_SIZE),

/// Create an empty jump table with all entries set to null.
///
/// This creates a blank jump table that must be populated with
/// operations before use. Typically, you'll want to use
/// init_from_hardfork() instead to get a pre-configured table.
///
/// @return An empty jump table
pub fn init() Self {
    return Self{
        .table = [_]?*const Operation{null} ** 256,
    };
}

/// Get the operation handler for a given opcode.
///
/// Returns the operation associated with the opcode, or the NULL
/// operation if the opcode is undefined in this jump table.
///
/// @param self The jump table
/// @param opcode The opcode byte value (0x00-0xFF)
/// @return Operation handler (never null)
///
/// Example:
/// ```zig
/// const op = table.get_operation(0x01); // Get ADD operation
/// ```
pub inline fn get_operation(self: *const Self, opcode: u8) *const Operation {
    return self.table[opcode] orelse &Operation.NULL;
}

/// Execute an opcode using the jump table.
///
/// This is the main dispatch function that:
/// 1. Looks up the operation for the opcode
/// 2. Validates stack requirements
/// 3. Consumes gas
/// 4. Executes the operation
///
/// @param self The jump table
/// @param pc Current program counter
/// @param interpreter VM interpreter context
/// @param state Execution state (cast to Frame internally)
/// @param opcode The opcode to execute
/// @return Execution result with gas consumed
/// @throws InvalidOpcode if opcode is undefined
/// @throws StackUnderflow/Overflow if validation fails
/// @throws OutOfGas if insufficient gas
///
/// Example:
/// ```zig
/// const result = try table.execute(pc, &interpreter, &state, bytecode[pc]);
/// ```
pub fn execute(self: *const Self, pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State, opcode: u8) ExecutionError.Error!Operation.ExecutionResult {
    const operation = self.get_operation(opcode);

    // Cast state to Frame to access gas_remaining and stack
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (operation.undefined) {
        frame.gas_remaining = 0;
        return ExecutionError.Error.InvalidOpcode;
    }

    const stack_validation = @import("stack_validation.zig");
    try stack_validation.validate_stack_requirements(&frame.stack, operation);

    if (operation.constant_gas > 0) {
        try frame.consume_gas(operation.constant_gas);
    }

    const res = try operation.execute(pc, interpreter, state);
    return res;
}

/// Validate and fix the jump table.
///
/// Ensures all entries are valid:
/// - Null entries are replaced with UNDEFINED operation
/// - Operations with memory_size must have dynamic_gas
/// - Invalid operations are logged and replaced
///
/// This should be called after manually constructing a jump table
/// to ensure it's safe for execution.
///
/// @param self The jump table to validate
pub fn validate(self: *Self) void {
    for (0..256) |i| {
        if (self.table[i] == null) {
            self.table[i] = &Operation.NULL;
        } else if (self.table[i].?.memory_size != null and self.table[i].?.dynamic_gas == null) {
            // Log error instead of panicking
            std.debug.print("Warning: Operation 0x{x} has memory size but no dynamic gas calculation\n", .{i});
            // Set to NULL to prevent issues
            self.table[i] = &Operation.NULL;
        }
    }
}

pub fn copy(self: *const Self, allocator: std.mem.Allocator) !Self {
    _ = allocator;
    return Self{
        .table = self.table,
    };
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

/// Create a jump table configured for a specific hardfork.
///
/// This is the primary way to create a jump table. It starts with
/// the Frontier base configuration and applies all changes up to
/// the specified hardfork.
///
/// @param hardfork The target hardfork configuration
/// @return A fully configured jump table
///
/// Hardfork progression:
/// - FRONTIER: Base EVM opcodes
/// - HOMESTEAD: DELEGATECALL
/// - TANGERINE_WHISTLE: Gas repricing (EIP-150)
/// - BYZANTIUM: REVERT, RETURNDATASIZE, STATICCALL
/// - CONSTANTINOPLE: CREATE2, SHL/SHR/SAR, EXTCODEHASH
/// - ISTANBUL: CHAINID, SELFBALANCE, more gas changes
/// - BERLIN: Access lists, cold/warm storage
/// - LONDON: BASEFEE
/// - SHANGHAI: PUSH0
/// - CANCUN: BLOBHASH, MCOPY, transient storage
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// // Table includes all opcodes through Cancun
/// ```
pub fn init_from_hardfork(hardfork: Hardfork) Self {
    var jt = new_frontier_instruction_set_legacy();

    // Guard clause for Frontier
    if (hardfork == .FRONTIER) {
        return jt;
    }

    // Homestead and later additions
    jt.table[0xf4] = &instruction_sets.DELEGATECALL;

    // Apply Tangerine Whistle gas cost changes (EIP-150)
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.TANGERINE_WHISTLE)) {
        apply_tangerine_whistle_gas_changes(&jt);
    }

    // Byzantium additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.BYZANTIUM)) {
        jt.table[0x3d] = &instruction_sets.RETURNDATASIZE;
        jt.table[0x3e] = &instruction_sets.RETURNDATACOPY;
        jt.table[0xfd] = &instruction_sets.REVERT;
        jt.table[0xfa] = &instruction_sets.STATICCALL;
    }

    // Constantinople additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.CONSTANTINOPLE)) {
        jt.table[0xf5] = &instruction_sets.CREATE2;
        jt.table[0x3f] = &instruction_sets.EXTCODEHASH;
        jt.table[0x1b] = &instruction_sets.SHL;
        jt.table[0x1c] = &instruction_sets.SHR;
        jt.table[0x1d] = &instruction_sets.SAR;
    }

    // Istanbul additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.ISTANBUL)) {
        jt.table[0x46] = &instruction_sets.CHAINID;
        jt.table[0x47] = &instruction_sets.SELFBALANCE;
        apply_istanbul_gas_changes(&jt);
    }

    // Berlin additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.BERLIN)) {
        apply_berlin_gas_changes(&jt);
    }

    // London additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.LONDON)) {
        jt.table[0x48] = &instruction_sets.BASEFEE;
    }

    // Shanghai additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.SHANGHAI)) {
        jt.table[0x5f] = &instruction_sets.PUSH0;
    }

    // Cancun additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.CANCUN)) {
        jt.table[0x49] = &instruction_sets.BLOBHASH;
        jt.table[0x4a] = &instruction_sets.BLOBBASEFEE;
        jt.table[0x5e] = &instruction_sets.MCOPY;
        jt.table[0x5c] = &instruction_sets.TLOAD;
        jt.table[0x5d] = &instruction_sets.TSTORE;
    }

    return jt;
}

// Legacy function for backward compatibility
pub fn new_frontier_instruction_set_legacy() Self {
    var jt = Self.init();

    // Setup operation table for Frontier
    jt.table[0x00] = &instruction_sets.STOP;
    jt.table[0x01] = &instruction_sets.ADD;
    jt.table[0x02] = &instruction_sets.MUL;
    jt.table[0x03] = &instruction_sets.SUB;
    jt.table[0x04] = &instruction_sets.DIV;
    jt.table[0x05] = &instruction_sets.SDIV;
    jt.table[0x06] = &instruction_sets.MOD;
    jt.table[0x07] = &instruction_sets.SMOD;
    jt.table[0x08] = &instruction_sets.ADDMOD;
    jt.table[0x09] = &instruction_sets.MULMOD;
    jt.table[0x0a] = &instruction_sets.EXP;
    jt.table[0x0b] = &instruction_sets.SIGNEXTEND;

    // 0x10s: Comparison & Bitwise Logic
    jt.table[0x10] = &instruction_sets.LT;
    jt.table[0x11] = &instruction_sets.GT;
    jt.table[0x12] = &instruction_sets.SLT;
    jt.table[0x13] = &instruction_sets.SGT;
    jt.table[0x14] = &instruction_sets.EQ;
    jt.table[0x15] = &instruction_sets.ISZERO;
    jt.table[0x16] = &instruction_sets.AND;
    jt.table[0x17] = &instruction_sets.OR;
    jt.table[0x18] = &instruction_sets.XOR;
    jt.table[0x19] = &instruction_sets.NOT;
    jt.table[0x1a] = &instruction_sets.BYTE;

    // 0x20s: SHA3
    jt.table[0x20] = &instruction_sets.SHA3;

    // 0x30s: Environmental Information
    jt.table[0x30] = &instruction_sets.ADDRESS;
    jt.table[0x31] = &instruction_sets.BALANCE_FRONTIER_TO_TANGERINE;
    jt.table[0x32] = &instruction_sets.ORIGIN;
    jt.table[0x33] = &instruction_sets.CALLER;
    jt.table[0x34] = &instruction_sets.CALLVALUE;
    jt.table[0x35] = &instruction_sets.CALLDATALOAD;
    jt.table[0x36] = &instruction_sets.CALLDATASIZE;
    jt.table[0x37] = &instruction_sets.CALLDATACOPY;
    jt.table[0x38] = &instruction_sets.CODESIZE;
    jt.table[0x39] = &instruction_sets.CODECOPY;
    jt.table[0x3a] = &instruction_sets.GASPRICE;
    jt.table[0x3b] = &instruction_sets.EXTCODESIZE_FRONTIER_TO_TANGERINE;
    jt.table[0x3c] = &instruction_sets.EXTCODECOPY_FRONTIER_TO_TANGERINE;

    // 0x40s: Block Information
    jt.table[0x40] = &instruction_sets.BLOCKHASH;
    jt.table[0x41] = &instruction_sets.COINBASE;
    jt.table[0x42] = &instruction_sets.TIMESTAMP;
    jt.table[0x43] = &instruction_sets.NUMBER;
    jt.table[0x44] = &instruction_sets.DIFFICULTY;
    jt.table[0x45] = &instruction_sets.GASLIMIT;

    // 0x50s: Stack, Memory, Storage and Flow Operations
    jt.table[0x50] = &instruction_sets.POP;
    jt.table[0x51] = &instruction_sets.MLOAD;
    jt.table[0x52] = &instruction_sets.MSTORE;
    jt.table[0x53] = &instruction_sets.MSTORE8;
    jt.table[0x54] = &instruction_sets.SLOAD_FRONTIER_TO_TANGERINE;
    jt.table[0x55] = &instruction_sets.SSTORE;
    jt.table[0x56] = &instruction_sets.JUMP;
    jt.table[0x57] = &instruction_sets.JUMPI;
    jt.table[0x58] = &instruction_sets.PC;
    jt.table[0x59] = &instruction_sets.MSIZE;
    jt.table[0x5a] = &instruction_sets.GAS;
    jt.table[0x5b] = &instruction_sets.JUMPDEST;

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
    jt.table[0x80] = &instruction_sets.DUP1;
    jt.table[0x81] = &instruction_sets.DUP2;
    jt.table[0x82] = &instruction_sets.DUP3;
    jt.table[0x83] = &instruction_sets.DUP4;
    jt.table[0x84] = &instruction_sets.DUP5;
    jt.table[0x85] = &instruction_sets.DUP6;
    jt.table[0x86] = &instruction_sets.DUP7;
    jt.table[0x87] = &instruction_sets.DUP8;
    jt.table[0x88] = &instruction_sets.DUP9;
    jt.table[0x89] = &instruction_sets.DUP10;
    jt.table[0x8a] = &instruction_sets.DUP11;
    jt.table[0x8b] = &instruction_sets.DUP12;
    jt.table[0x8c] = &instruction_sets.DUP13;
    jt.table[0x8d] = &instruction_sets.DUP14;
    jt.table[0x8e] = &instruction_sets.DUP15;
    jt.table[0x8f] = &instruction_sets.DUP16;

    // 0x90s: Exchange Operations
    jt.table[0x90] = &instruction_sets.SWAP1;
    jt.table[0x91] = &instruction_sets.SWAP2;
    jt.table[0x92] = &instruction_sets.SWAP3;
    jt.table[0x93] = &instruction_sets.SWAP4;
    jt.table[0x94] = &instruction_sets.SWAP5;
    jt.table[0x95] = &instruction_sets.SWAP6;
    jt.table[0x96] = &instruction_sets.SWAP7;
    jt.table[0x97] = &instruction_sets.SWAP8;
    jt.table[0x98] = &instruction_sets.SWAP9;
    jt.table[0x99] = &instruction_sets.SWAP10;
    jt.table[0x9a] = &instruction_sets.SWAP11;
    jt.table[0x9b] = &instruction_sets.SWAP12;
    jt.table[0x9c] = &instruction_sets.SWAP13;
    jt.table[0x9d] = &instruction_sets.SWAP14;
    jt.table[0x9e] = &instruction_sets.SWAP15;
    jt.table[0x9f] = &instruction_sets.SWAP16;

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
    jt.table[0xf0] = &instruction_sets.CREATE;
    jt.table[0xf1] = &instruction_sets.CALL_FRONTIER_TO_TANGERINE;
    jt.table[0xf2] = &instruction_sets.CALLCODE_FRONTIER_TO_TANGERINE;
    jt.table[0xf3] = &instruction_sets.RETURN;
    jt.table[0xfe] = &instruction_sets.INVALID;
    jt.table[0xff] = &instruction_sets.SELFDESTRUCT_FRONTIER_TO_TANGERINE;

    // Fill remaining with UNDEFINED
    jt.validate();
    return jt;
}

fn apply_tangerine_whistle_gas_changes(jt: *Self) void {
    // SAFE: Replace operations with hardfork-specific variants instead of @constCast
    jt.table[0x31] = &instruction_sets.BALANCE_TANGERINE_TO_ISTANBUL; // BALANCE: 20 -> 400
    jt.table[0x3b] = &instruction_sets.EXTCODESIZE_TANGERINE_TO_BERLIN; // EXTCODESIZE: 20 -> 700
    jt.table[0x3c] = &instruction_sets.EXTCODECOPY_TANGERINE_TO_BERLIN; // EXTCODECOPY: 20 -> 700
    jt.table[0x54] = &instruction_sets.SLOAD_TANGERINE_TO_ISTANBUL; // SLOAD: 50 -> 200
    jt.table[0xf1] = &instruction_sets.CALL_TANGERINE_TO_PRESENT; // CALL: 40 -> 700
    jt.table[0xf2] = &instruction_sets.CALLCODE_TANGERINE_TO_PRESENT; // CALLCODE: 40 -> 700
    jt.table[0xf4] = &instruction_sets.DELEGATECALL_TANGERINE_TO_PRESENT; // DELEGATECALL: 40 -> 700
    jt.table[0xff] = &instruction_sets.SELFDESTRUCT_TANGERINE_TO_PRESENT; // SELFDESTRUCT: 0 -> 5000
}

fn apply_istanbul_gas_changes(jt: *Self) void {
    // SAFE: Replace operations with hardfork-specific variants instead of @constCast
    jt.table[0x31] = &instruction_sets.BALANCE_ISTANBUL_TO_BERLIN; // BALANCE: 400 -> 700
    jt.table[0x54] = &instruction_sets.SLOAD_ISTANBUL_TO_BERLIN; // SLOAD: 200 -> 800
    // EXTCODEHASH gas is handled dynamically in the opcode
}

fn apply_berlin_gas_changes(jt: *Self) void {
    // SAFE: Replace operations with hardfork-specific variants instead of @constCast
    // Berlin introduces cold/warm access with dynamic gas costs
    // These are handled in the opcode implementations rather than base gas
    jt.table[0x31] = &instruction_sets.BALANCE_BERLIN_TO_PRESENT; // BALANCE: 700 -> 0 (dynamic)
    jt.table[0x3b] = &instruction_sets.EXTCODESIZE; // EXTCODESIZE: 700 -> 0 (dynamic)
    jt.table[0x3c] = &instruction_sets.EXTCODECOPY; // EXTCODECOPY: 700 -> 0 (dynamic)
    jt.table[0x3f] = &instruction_sets.EXTCODEHASH; // EXTCODEHASH: 0 -> 0 (dynamic)
    jt.table[0x54] = &instruction_sets.SLOAD; // SLOAD: 800 -> 0 (dynamic)
    // CALL operations keep base gas but add dynamic cold access cost
}
