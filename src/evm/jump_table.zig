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

const operations = @import("operations/package.zig");
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
    jt.table[0xf4] = &operations.system.DELEGATECALL;

    // Apply Tangerine Whistle gas cost changes (EIP-150)
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.TANGERINE_WHISTLE)) {
        apply_tangerine_whistle_gas_changes(&jt);
    }

    // Byzantium additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.BYZANTIUM)) {
        jt.table[0x3d] = &operations.memory.RETURNDATASIZE;
        jt.table[0x3e] = &operations.memory.RETURNDATACOPY;
        jt.table[0xfd] = &operations.control.REVERT;
        jt.table[0xfa] = &operations.system.STATICCALL;
    }

    // Constantinople additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.CONSTANTINOPLE)) {
        jt.table[0xf5] = &operations.system.CREATE2;
        jt.table[0x3f] = &operations.crypto.EXTCODEHASH;
        jt.table[0x1b] = &operations.bitwise.SHL;
        jt.table[0x1c] = &operations.bitwise.SHR;
        jt.table[0x1d] = &operations.bitwise.SAR;
    }

    // Istanbul additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.ISTANBUL)) {
        jt.table[0x46] = &operations.environment.CHAINID;
        jt.table[0x47] = &operations.environment.SELFBALANCE;
        apply_istanbul_gas_changes(&jt);
    }

    // Berlin additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.BERLIN)) {
        apply_berlin_gas_changes(&jt);
    }

    // London additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.LONDON)) {
        jt.table[0x48] = &operations.block.BASEFEE;
    }

    // Shanghai additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.SHANGHAI)) {
        jt.table[0x5f] = &operations.stack.PUSH0;
    }

    // Cancun additions
    if (@intFromEnum(hardfork) >= @intFromEnum(Hardfork.CANCUN)) {
        jt.table[0x49] = &operations.block.BLOBHASH;
        jt.table[0x4a] = &operations.block.BLOBBASEFEE;
        jt.table[0x5e] = &operations.memory.MCOPY;
        jt.table[0x5c] = &operations.storage.TLOAD;
        jt.table[0x5d] = &operations.storage.TSTORE;
    }

    return jt;
}

// Legacy function for backward compatibility
pub fn new_frontier_instruction_set_legacy() Self {
    var jt = Self.init();

    // Setup operation table for Frontier
    jt.table[0x00] = &operations.control.STOP;
    jt.table[0x01] = &operations.arithmetic.ADD;
    jt.table[0x02] = &operations.arithmetic.MUL;
    jt.table[0x03] = &operations.arithmetic.SUB;
    jt.table[0x04] = &operations.arithmetic.DIV;
    jt.table[0x05] = &operations.arithmetic.SDIV;
    jt.table[0x06] = &operations.arithmetic.MOD;
    jt.table[0x07] = &operations.arithmetic.SMOD;
    jt.table[0x08] = &operations.arithmetic.ADDMOD;
    jt.table[0x09] = &operations.arithmetic.MULMOD;
    jt.table[0x0a] = &operations.arithmetic.EXP;
    jt.table[0x0b] = &operations.arithmetic.SIGNEXTEND;

    // 0x10s: Comparison & Bitwise Logic
    jt.table[0x10] = &operations.comparison.LT;
    jt.table[0x11] = &operations.comparison.GT;
    jt.table[0x12] = &operations.comparison.SLT;
    jt.table[0x13] = &operations.comparison.SGT;
    jt.table[0x14] = &operations.comparison.EQ;
    jt.table[0x15] = &operations.comparison.ISZERO;
    jt.table[0x16] = &operations.bitwise.AND;
    jt.table[0x17] = &operations.bitwise.OR;
    jt.table[0x18] = &operations.bitwise.XOR;
    jt.table[0x19] = &operations.bitwise.NOT;
    jt.table[0x1a] = &operations.bitwise.BYTE;

    // 0x20s: SHA3
    jt.table[0x20] = &operations.crypto.SHA3;

    // 0x30s: Environmental Information
    jt.table[0x30] = &operations.environment.ADDRESS;
    jt.table[0x31] = &operations.environment.BALANCE_FRONTIER_TO_TANGERINE;
    jt.table[0x32] = &operations.environment.ORIGIN;
    jt.table[0x33] = &operations.environment.CALLER;
    jt.table[0x34] = &operations.environment.CALLVALUE;
    jt.table[0x35] = &operations.environment.CALLDATALOAD;
    jt.table[0x36] = &operations.environment.CALLDATASIZE;
    jt.table[0x37] = &operations.memory.CALLDATACOPY;
    jt.table[0x38] = &operations.environment.CODESIZE;
    jt.table[0x39] = &operations.environment.CODECOPY;
    jt.table[0x3a] = &operations.environment.GASPRICE;
    jt.table[0x3b] = &operations.misc.EXTCODESIZE_FRONTIER_TO_TANGERINE;
    jt.table[0x3c] = &operations.environment.EXTCODECOPY_FRONTIER_TO_TANGERINE;

    // 0x40s: Block Information
    jt.table[0x40] = &operations.block.BLOCKHASH;
    jt.table[0x41] = &operations.block.COINBASE;
    jt.table[0x42] = &operations.block.TIMESTAMP;
    jt.table[0x43] = &operations.block.NUMBER;
    jt.table[0x44] = &operations.block.DIFFICULTY;
    jt.table[0x45] = &operations.block.GASLIMIT;

    // 0x50s: Stack, Memory, Storage and Flow Operations
    jt.table[0x50] = &operations.stack.POP;
    jt.table[0x51] = &operations.memory.MLOAD;
    jt.table[0x52] = &operations.memory.MSTORE;
    jt.table[0x53] = &operations.memory.MSTORE8;
    jt.table[0x54] = &operations.storage.SLOAD_FRONTIER_TO_TANGERINE;
    jt.table[0x55] = &operations.storage.SSTORE;
    jt.table[0x56] = &operations.control.JUMP;
    jt.table[0x57] = &operations.control.JUMPI;
    jt.table[0x58] = &operations.control.PC;
    jt.table[0x59] = &operations.memory.MSIZE;
    jt.table[0x5a] = &operations.misc.GAS;
    jt.table[0x5b] = &operations.control.JUMPDEST;

    // 0x60s & 0x70s: Push operations
    inline for (0..32) |i| {
        const n = i + 1;
        jt.table[0x60 + i] = &Operation{
            .execute = stack_ops.make_push(n),
            .constant_gas = opcodes.gas_constants.GasFastestStep,
            .min_stack = 0,
            .max_stack = Stack.CAPACITY - 1,
        };
    }

    // 0x80s: Duplication Operations
    inline for (1..17) |n| {
        jt.table[0x80 + n - 1] = &Operation{
            .execute = stack_ops.make_dup(n),
            .constant_gas = opcodes.gas_constants.GasFastestStep,
            .min_stack = @intCast(n),
            .max_stack = Stack.CAPACITY - 1,
        };
    }

    // 0x90s: Exchange Operations
    inline for (1..17) |n| {
        jt.table[0x90 + n - 1] = &Operation{
            .execute = stack_ops.make_swap(n),
            .constant_gas = opcodes.gas_constants.GasFastestStep,
            .min_stack = @intCast(n + 1),
            .max_stack = Stack.CAPACITY,
        };
    }

    // 0xa0s: Logging Operations
    inline for (0..5) |n| {
        jt.table[0xa0 + n] = &Operation{
            .execute = log.make_log(n),
            .constant_gas = opcodes.gas_constants.LogGas + opcodes.gas_constants.LogTopicGas * n,
            .min_stack = @intCast(n + 2),
            .max_stack = Stack.CAPACITY,
        };
    }

    // 0xf0s: System operations
    jt.table[0xf0] = &operations.system.CREATE;
    jt.table[0xf1] = &operations.system.CALL_FRONTIER_TO_TANGERINE;
    jt.table[0xf2] = &operations.system.CALLCODE_FRONTIER_TO_TANGERINE;
    jt.table[0xf3] = &operations.control.RETURN;
    jt.table[0xfe] = &operations.control.INVALID;
    jt.table[0xff] = &operations.control.SELFDESTRUCT_FRONTIER_TO_TANGERINE;

    // Fill remaining with UNDEFINED
    jt.validate();
    return jt;
}

fn apply_tangerine_whistle_gas_changes(jt: *Self) void {
    // SAFE: Replace operations with hardfork-specific variants instead of @constCast
    jt.table[0x31] = &operations.environment.BALANCE_TANGERINE_TO_ISTANBUL; // BALANCE: 20 -> 400
    jt.table[0x3b] = &operations.misc.EXTCODESIZE_TANGERINE_TO_BERLIN; // EXTCODESIZE: 20 -> 700
    jt.table[0x3c] = &operations.environment.EXTCODECOPY_TANGERINE_TO_BERLIN; // EXTCODECOPY: 20 -> 700
    jt.table[0x54] = &operations.storage.SLOAD_TANGERINE_TO_ISTANBUL; // SLOAD: 50 -> 200
    jt.table[0xf1] = &operations.system.CALL_TANGERINE_TO_PRESENT; // CALL: 40 -> 700
    jt.table[0xf2] = &operations.system.CALLCODE_TANGERINE_TO_PRESENT; // CALLCODE: 40 -> 700
    jt.table[0xf4] = &operations.system.DELEGATECALL_TANGERINE_TO_PRESENT; // DELEGATECALL: 40 -> 700
    jt.table[0xff] = &operations.control.SELFDESTRUCT_TANGERINE_TO_PRESENT; // SELFDESTRUCT: 0 -> 5000
}

fn apply_istanbul_gas_changes(jt: *Self) void {
    // SAFE: Replace operations with hardfork-specific variants instead of @constCast
    jt.table[0x31] = &operations.environment.BALANCE_ISTANBUL_TO_BERLIN; // BALANCE: 400 -> 700
    jt.table[0x54] = &operations.storage.SLOAD_ISTANBUL_TO_BERLIN; // SLOAD: 200 -> 800
    // EXTCODEHASH gas is handled dynamically in the opcode
}

fn apply_berlin_gas_changes(jt: *Self) void {
    // SAFE: Replace operations with hardfork-specific variants instead of @constCast
    // Berlin introduces cold/warm access with dynamic gas costs
    // These are handled in the opcode implementations rather than base gas
    jt.table[0x31] = &operations.environment.BALANCE_BERLIN_TO_PRESENT; // BALANCE: 700 -> 0 (dynamic)
    jt.table[0x3b] = &operations.misc.EXTCODESIZE; // EXTCODESIZE: 700 -> 0 (dynamic)
    jt.table[0x3c] = &operations.environment.EXTCODECOPY; // EXTCODECOPY: 700 -> 0 (dynamic)
    jt.table[0x3f] = &operations.crypto.EXTCODEHASH; // EXTCODEHASH: 0 -> 0 (dynamic)
    jt.table[0x54] = &operations.storage.SLOAD; // SLOAD: 800 -> 0 (dynamic)
    // CALL operations keep base gas but add dynamic cold access cost
}
