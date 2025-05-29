const std = @import("std");
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;
const Contract = @import("Contract.zig").Contract;

pub const ExecutionError = error{
    STOP,
    REVERT,
    INVALID,
    OutOfGas,
    StackUnderflow,
    StackOverflow,
    InvalidJump,
    InvalidOpcode,
    StaticStateChange,
    OutOfOffset,
    GasUintOverflow,
    WriteProtection,
    ReturnDataOutOfBounds,
    DeployCodeTooBig,
    MaxCodeSizeExceeded,
    InvalidCodeEntry,
    DepthLimit,
};

pub fn getErrorDescription(err: ExecutionError) []const u8 {
    return switch (err) {
        ExecutionError.STOP => "Normal STOP opcode execution",
        ExecutionError.REVERT => "REVERT opcode - state reverted",
        ExecutionError.INVALID => "INVALID opcode or invalid operation",
        ExecutionError.OutOfGas => "Out of gas",
        ExecutionError.StackUnderflow => "Stack underflow",
        ExecutionError.StackOverflow => "Stack overflow (beyond 1024 elements)",
        ExecutionError.InvalidJump => "Jump to invalid destination",
        ExecutionError.InvalidOpcode => "Undefined opcode",
        ExecutionError.StaticStateChange => "State modification in static context",
        ExecutionError.OutOfOffset => "Memory access out of bounds",
        ExecutionError.GasUintOverflow => "Gas calculation overflow",
        ExecutionError.WriteProtection => "Write to protected storage",
        ExecutionError.ReturnDataOutOfBounds => "Return data access out of bounds",
        ExecutionError.DeployCodeTooBig => "Contract creation code too large",
        ExecutionError.MaxCodeSizeExceeded => "Contract code size exceeds limit",
        ExecutionError.InvalidCodeEntry => "Invalid contract entry code",
        ExecutionError.DepthLimit => "Call depth exceeds limit (1024)",
    };
}

pub const Frame = struct {
    const Self = @This();
    /// Current operation bytecode being executed
    op: []const u8 = undefined,
    /// Program counter - position in the bytecode
    pc: usize = 0,
    /// Gas cost accumulated in the current execution step
    cost: u64 = 0,
    /// Error encountered during execution (if any)
    err: ?ExecutionError = null,
    /// EVM memory - a linear byte array that can be accessed via MLOAD/MSTORE
    memory: Memory,
    /// EVM stack - holds up to 1024 items for operation inputs/outputs
    stack: Stack,
    /// Current contract being executed, containing code and execution context
    contract: *Contract,
    /// Return data from the most recent call operation
    returnData: ?[]u8 = null,
    /// Allocator for memory management of the Frame's resources
    allocator: std.mem.Allocator,
    /// Flag to indicate that execution should stop (STOP opcode)
    stop: bool = false,

    pub fn init(allocator: std.mem.Allocator, contract: *Contract) Self {
        return Frame{
            .allocator = allocator,
            .contract = contract,
        };
    }
};
