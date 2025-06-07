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
const operation_specs = @import("operation_specs.zig");

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

/// Check if an operation variant is active for a given hardfork.
fn is_variant_active(variant: ?[]const u8, hardfork: Hardfork) bool {
    if (variant == null) return true;
    
    const v = variant.?;
    
    // Parse variant strings like "FRONTIER_TO_TANGERINE" or "BERLIN_TO_PRESENT"
    if (std.mem.eql(u8, v, "FRONTIER_TO_TANGERINE")) {
        return @intFromEnum(hardfork) >= @intFromEnum(Hardfork.FRONTIER) and 
               @intFromEnum(hardfork) < @intFromEnum(Hardfork.TANGERINE_WHISTLE);
    } else if (std.mem.eql(u8, v, "TANGERINE_TO_ISTANBUL")) {
        return @intFromEnum(hardfork) >= @intFromEnum(Hardfork.TANGERINE_WHISTLE) and 
               @intFromEnum(hardfork) < @intFromEnum(Hardfork.ISTANBUL);
    } else if (std.mem.eql(u8, v, "ISTANBUL_TO_BERLIN")) {
        return @intFromEnum(hardfork) >= @intFromEnum(Hardfork.ISTANBUL) and 
               @intFromEnum(hardfork) < @intFromEnum(Hardfork.BERLIN);
    } else if (std.mem.eql(u8, v, "TANGERINE_TO_BERLIN")) {
        return @intFromEnum(hardfork) >= @intFromEnum(Hardfork.TANGERINE_WHISTLE) and 
               @intFromEnum(hardfork) < @intFromEnum(Hardfork.BERLIN);
    } else if (std.mem.eql(u8, v, "TANGERINE_TO_PRESENT")) {
        return @intFromEnum(hardfork) >= @intFromEnum(Hardfork.TANGERINE_WHISTLE);
    } else if (std.mem.eql(u8, v, "BERLIN_TO_PRESENT")) {
        return @intFromEnum(hardfork) >= @intFromEnum(Hardfork.BERLIN);
    }
    
    // Unknown variant, default to active
    return true;
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
    var jt = Self.init();

    // Load all operations from centralized specifications
    inline for (operation_specs.ALL_OPERATIONS) |spec| {
        if (spec.variant == null or is_variant_active(spec.variant, hardfork)) {
            // Create a static operation for each spec
            const op = struct {
                pub const operation = operation_specs.generate_operation(spec);
            };
            jt.table[spec.opcode] = &op.operation;
        }
    }

    // Dynamic operations are still generated inline

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

    // Fill remaining with UNDEFINED
    jt.validate();

    return jt;
}

// Hardfork-specific operation variants are now handled by the centralized
// operation specifications with variant checking in init_from_hardfork()
