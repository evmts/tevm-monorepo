const std = @import("std");
const Memory = @import("memory.zig");
const Stack = @import("stack.zig");
const Contract = @import("contract.zig");
const ExecutionError = @import("execution_error.zig");
const Log = @import("log.zig");

/// EVM execution frame representing a single call context.
///
/// A Frame encapsulates all the state needed to execute a contract call,
/// including the stack, memory, gas tracking, and execution context.
/// Each contract call or message creates a new frame.
///
/// ## Frame Hierarchy
/// Frames form a call stack during execution:
/// - External transactions create the root frame
/// - CALL/CREATE operations create child frames
/// - Frames are limited by maximum call depth (1024)
///
/// ## Execution Model
/// The frame tracks:
/// - Computational state (stack, memory, PC)
/// - Gas consumption and limits
/// - Input/output data
/// - Static call restrictions
///
/// ## Memory Management
/// Each frame has its own memory space that:
/// - Starts empty and expands as needed
/// - Is cleared when the frame completes
/// - Charges quadratic gas for expansion
///
/// Example:
/// ```zig
/// var frame = try Frame.init(allocator, &contract);
/// defer frame.deinit();
/// frame.gas_remaining = 1000000;
/// try frame.stack.append(42);
/// ```
const Self = @This();

/// Current opcode being executed (for debugging/tracing).
op: []const u8 = undefined,

/// Program counter position in bytecode.
/// @deprecated Use program_counter instead
pc: usize = 0,

/// Gas cost of current operation.
cost: u64 = 0,

/// Error that occurred during execution, if any.
err: ?ExecutionError.Error = null,

/// Frame's memory space for temporary data storage.
/// Grows dynamically and charges gas quadratically.
memory: Memory,

/// Operand stack for the stack machine.
/// Limited to 1024 elements per EVM rules.
stack: Stack,

/// Contract being executed in this frame.
/// Contains code, address, and contract metadata.
contract: *Contract,

/// Data returned from last call (for RETURNDATASIZE/COPY).
/// @deprecated Use return_data_buffer instead
return_data: ?[]u8 = null,

/// Allocator for dynamic memory allocations.
allocator: std.mem.Allocator,

/// Flag indicating execution should halt.
/// Set by STOP, RETURN, REVERT, or errors.
stop: bool = false,

/// Remaining gas for this execution.
/// Decremented by each operation; execution fails at 0.
gas_remaining: u64 = 0,

/// Whether this is a STATICCALL context.
/// Prohibits state modifications (SSTORE, CREATE, SELFDESTRUCT).
is_static: bool = false,

/// Buffer containing return data from child calls.
/// Used by RETURNDATASIZE and RETURNDATACOPY opcodes.
return_data_buffer: []const u8 = &[_]u8{},

/// Input data for this call (calldata).
/// Accessed by CALLDATALOAD, CALLDATASIZE, CALLDATACOPY.
input: []const u8 = &[_]u8{},

/// Current call depth in the call stack.
/// Limited to 1024 to prevent stack overflow attacks.
depth: u32 = 0,

/// Output data to be returned from this frame.
/// Set by RETURN or REVERT operations.
output: []const u8 = &[_]u8{},

/// Current position in contract bytecode.
/// Incremented by opcode size, modified by JUMP/JUMPI.
program_counter: usize = 0,

/// Create a new execution frame with default settings.
///
/// Initializes a frame with empty stack and memory, ready for execution.
/// Gas and other parameters must be set after initialization.
///
/// @param allocator Memory allocator for dynamic allocations
/// @param contract The contract to execute
/// @return New frame instance
/// @throws OutOfMemory if memory initialization fails
///
/// Example:
/// ```zig
/// var frame = try Frame.init(allocator, &contract);
/// defer frame.deinit();
/// frame.gas_remaining = gas_limit;
/// frame.input = calldata;
/// ```
pub fn init(allocator: std.mem.Allocator, contract: *Contract) std.mem.Allocator.Error!Self {
    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = try Memory.init_default(allocator),
        .stack = .{},
    };
}

/// Create a frame with specific initial state.
///
/// Used for creating frames with pre-existing state, such as when
/// resuming execution or creating child frames with inherited state.
/// All parameters are optional and default to sensible values.
///
/// @param allocator Memory allocator
/// @param contract Contract to execute
/// @param op Current opcode (optional)
/// @param pc Program counter (optional, deprecated)
/// @param cost Gas cost of current op (optional)
/// @param err Existing error state (optional)
/// @param memory Pre-initialized memory (optional)
/// @param stack Pre-initialized stack (optional)
/// @param return_data Return data buffer (optional, deprecated)
/// @param stop Halt flag (optional)
/// @param gas_remaining Available gas (optional)
/// @param is_static Static call flag (optional)
/// @param return_data_buffer Child return data (optional)
/// @param input Call data (optional)
/// @param depth Call stack depth (optional)
/// @param output Output buffer (optional)
/// @param program_counter Current PC (optional)
/// @return Configured frame instance
/// @throws OutOfMemory if memory initialization fails
///
/// Example:
/// ```zig
/// // Create child frame inheriting depth and static mode
/// const child_frame = try Frame.init_with_state(
///     allocator,
///     &child_contract,
///     .{ .depth = parent.depth + 1, .is_static = parent.is_static }
/// );
/// ```
pub fn init_with_state(
    allocator: std.mem.Allocator,
    contract: *Contract,
    op: ?[]const u8,
    pc: ?usize,
    cost: ?u64,
    err: ?ExecutionError.Error,
    memory: ?Memory,
    stack: ?Stack,
    return_data: ?[]u8,
    stop: ?bool,
    gas_remaining: ?u64,
    is_static: ?bool,
    return_data_buffer: ?[]const u8,
    input: ?[]const u8,
    depth: ?u32,
    output: ?[]const u8,
    program_counter: ?usize,
) std.mem.Allocator.Error!Self {
    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = memory orelse try Memory.init_default(allocator),
        .stack = stack orelse .{},
        .op = op orelse undefined,
        .pc = pc orelse 0,
        .cost = cost orelse 0,
        .err = err,
        .return_data = return_data,
        .stop = stop orelse false,
        .gas_remaining = gas_remaining orelse 0,
        .is_static = is_static orelse false,
        .return_data_buffer = return_data_buffer orelse &[_]u8{},
        .input = input orelse &[_]u8{},
        .depth = depth orelse 0,
        .output = output orelse &[_]u8{},
        .program_counter = program_counter orelse 0,
    };
}

/// Clean up frame resources.
///
/// Releases memory allocated by the frame. Must be called when
/// the frame is no longer needed to prevent memory leaks.
///
/// @param self The frame to clean up
pub fn deinit(self: *Self) void {
    self.memory.deinit();
}

/// Error type for gas consumption operations.
pub const ConsumeGasError = error{
    /// Insufficient gas to complete operation
    OutOfGas,
};

/// Consume gas from the frame's remaining gas.
///
/// Deducts the specified amount from gas_remaining. If insufficient
/// gas is available, returns OutOfGas error and execution should halt.
///
/// @param self The frame consuming gas
/// @param amount Gas units to consume
/// @throws OutOfGas if amount > gas_remaining
///
/// Example:
/// ```zig
/// // Charge gas for operation
/// try frame.consume_gas(operation.constant_gas);
/// 
/// // Charge dynamic gas
/// const memory_cost = calculate_memory_gas(size);
/// try frame.consume_gas(memory_cost);
/// ```
pub fn consume_gas(self: *Self, amount: u64) ConsumeGasError!void {
    if (amount > self.gas_remaining) return ConsumeGasError.OutOfGas;
    self.gas_remaining -= amount;
}
