const std = @import("std");
const builtin = @import("builtin");
const Opcode = @import("../opcodes/opcode.zig");
const operation_module = @import("../opcodes/operation.zig");
const Operation = operation_module.Operation;
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;
const ExecutionError = @import("../execution/execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame/frame.zig");
const Contract = @import("../frame/contract.zig");
const Address = @import("Address");
const Log = @import("../log.zig");

const execution = @import("../execution/package.zig");
const stack_ops = execution.stack;
const log = execution.log;
const operation_config = @import("operation_config.zig");

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
pub const JumpTable = @This();

/// CPU cache line size for optimal memory alignment.
/// Most modern x86/ARM processors use 64-byte cache lines.
const CACHE_LINE_SIZE = 64;

/// Array of operation handlers indexed by opcode value.
/// Aligned to cache line boundaries for optimal performance.
/// Null entries are treated as undefined opcodes.
table: [256]?*const Operation align(CACHE_LINE_SIZE),

/// CANCUN jump table, pre-generated at compile time.
/// This is the latest hardfork configuration.
pub const CANCUN = init_from_hardfork(.CANCUN);

/// Default jump table for the latest hardfork.
/// References CANCUN to avoid generating the same table twice.
/// This is what gets used when no jump table is specified.
pub const DEFAULT = CANCUN;

/// Create an empty jump table with all entries set to null.
///
/// This creates a blank jump table that must be populated with
/// operations before use. Typically, you'll want to use
/// init_from_hardfork() instead to get a pre-configured table.
///
/// @return An empty jump table
pub fn init() JumpTable {
    return JumpTable{
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
pub fn get_operation(self: *const JumpTable, opcode: u8) *const Operation {
    return self.table[opcode] orelse &operation_module.NULL_OPERATION;
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
pub fn execute(self: *const JumpTable, pc: usize, interpreter: *operation_module.Interpreter, state: *operation_module.State, opcode: u8) ExecutionError.Error!operation_module.ExecutionResult {
    const operation = self.get_operation(opcode);

    // Cast state to Frame to access gas_remaining and stack
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    Log.debug("JumpTable.execute: Executing opcode 0x{x:0>2} at pc={}, gas={}, stack_size={}", .{ opcode, pc, frame.gas_remaining, frame.stack.size });

    // Handle undefined opcodes (cold path)
    if (operation.undefined) {
        @branchHint(.cold);
        Log.debug("JumpTable.execute: Invalid opcode 0x{x:0>2}", .{opcode});
        frame.gas_remaining = 0;
        return ExecutionError.Error.InvalidOpcode;
    }

    const stack_validation = @import("../stack/stack_validation.zig");
    try stack_validation.validate_stack_requirements(&frame.stack, operation);

    // Gas consumption (likely path)
    if (operation.constant_gas > 0) {
        @branchHint(.likely);
        Log.debug("JumpTable.execute: Consuming {} gas for opcode 0x{x:0>2}", .{ operation.constant_gas, opcode });
        try frame.consume_gas(operation.constant_gas);
    }

    const res = try operation.execute(pc, interpreter, state);
    Log.debug("JumpTable.execute: Opcode 0x{x:0>2} completed, gas_remaining={}", .{ opcode, frame.gas_remaining });
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
pub fn validate(self: *JumpTable) void {
    for (0..256) |i| {
        // Handle null entries (less common)
        if (self.table[i] == null) {
            @branchHint(.cold);
            self.table[i] = &operation_module.NULL_OPERATION;
            continue;
        }

        // Check for invalid operation configuration (error path)
        const operation = self.table[i].?;
        if (operation.memory_size != null and operation.dynamic_gas == null) {
            @branchHint(.cold);
            // Log error instead of panicking
            Log.debug("Warning: Operation 0x{x} has memory size but no dynamic gas calculation", .{i});
            // Set to NULL to prevent issues
            self.table[i] = &operation_module.NULL_OPERATION;
        }
    }
}

pub fn copy(self: *const JumpTable, allocator: std.mem.Allocator) !JumpTable {
    _ = allocator;
    return JumpTable{
        .table = self.table,
    };
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
pub fn init_from_hardfork(hardfork: Hardfork) JumpTable {
    @setEvalBranchQuota(10000);
    var jt = JumpTable.init();
    // With ALL_OPERATIONS sorted by hardfork, we can iterate once.
    // Each opcode will be set to the latest active version for the target hardfork.
    inline for (operation_config.ALL_OPERATIONS) |spec| {
        const op_hardfork = spec.variant orelse Hardfork.FRONTIER;
        // Most operations are included in hardforks (likely path)
        if (@intFromEnum(op_hardfork) <= @intFromEnum(hardfork)) {
            const op = struct {
                pub const operation = operation_config.generate_operation(spec);
            };
            jt.table[spec.opcode] = &op.operation;
        }
    }
    // 0x60s & 0x70s: Push operations
    if (comptime builtin.mode == .ReleaseSmall) {
        // For size optimization, don't inline
        for (0..32) |i| {
            jt.table[0x60 + i] = &Operation{
                .execute = stack_ops.push_n,
                .constant_gas = execution.gas_constants.GasFastestStep,
                .min_stack = 0,
                .max_stack = Stack.CAPACITY - 1,
            };
        }
    } else {
        // For other modes, inline for performance
        inline for (0..32) |i| {
            const n = i + 1;
            jt.table[0x60 + i] = &Operation{
                .execute = stack_ops.make_push(n),
                .constant_gas = execution.gas_constants.GasFastestStep,
                .min_stack = 0,
                .max_stack = Stack.CAPACITY - 1,
            };
        }
    }
    // 0x80s: Duplication Operations
    if (comptime builtin.mode == .ReleaseSmall) {
        // For size optimization, don't inline
        for (1..17) |n| {
            jt.table[0x80 + n - 1] = &Operation{
                .execute = stack_ops.dup_n,
                .constant_gas = execution.gas_constants.GasFastestStep,
                .min_stack = @intCast(n),
                .max_stack = Stack.CAPACITY - 1,
            };
        }
    } else {
        // For other modes, inline for performance
        inline for (1..17) |n| {
            jt.table[0x80 + n - 1] = &Operation{
                .execute = stack_ops.make_dup(n),
                .constant_gas = execution.gas_constants.GasFastestStep,
                .min_stack = @intCast(n),
                .max_stack = Stack.CAPACITY - 1,
            };
        }
    }
    // 0x90s: Exchange Operations
    if (comptime builtin.mode == .ReleaseSmall) {
        // For size optimization, don't inline
        for (1..17) |n| {
            jt.table[0x90 + n - 1] = &Operation{
                .execute = stack_ops.swap_n,
                .constant_gas = execution.gas_constants.GasFastestStep,
                .min_stack = @intCast(n + 1),
                .max_stack = Stack.CAPACITY,
            };
        }
    } else {
        // For other modes, inline for performance
        inline for (1..17) |n| {
            jt.table[0x90 + n - 1] = &Operation{
                .execute = stack_ops.make_swap(n),
                .constant_gas = execution.gas_constants.GasFastestStep,
                .min_stack = @intCast(n + 1),
                .max_stack = Stack.CAPACITY,
            };
        }
    }
    // 0xa0s: Logging Operations
    if (comptime builtin.mode == .ReleaseSmall) {
        // For size optimization, don't inline
        for (0..5) |n| {
            jt.table[0xa0 + n] = &Operation{
                .execute = log.log_n,
                .constant_gas = execution.gas_constants.LogGas + execution.gas_constants.LogTopicGas * n,
                .min_stack = @intCast(n + 2),
                .max_stack = Stack.CAPACITY,
            };
        }
    } else {
        // For other modes, inline for performance
        inline for (0..5) |n| {
            jt.table[0xa0 + n] = &Operation{
                .execute = log.make_log(n),
                .constant_gas = execution.gas_constants.LogGas + execution.gas_constants.LogTopicGas * n,
                .min_stack = @intCast(n + 2),
                .max_stack = Stack.CAPACITY,
            };
        }
    }
    jt.validate();
    return jt;
}
