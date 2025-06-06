const std = @import("std");

/// ExecutionError represents various error conditions that can occur during EVM execution
const Self = @This();

/// Error types for EVM execution
pub const Error = error{
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
    OutOfMemory, // For allocation failures
    InvalidOffset, // For memory offset errors
    InvalidSize, // For memory size errors
    MemoryLimitExceeded, // For memory expansion beyond limits
    ChildContextActive, // For memory context errors
    NoChildContextToRevertOrCommit, // For memory context errors
    EOFNotSupported, // For EOF opcodes that are not yet implemented
};

/// Get a human-readable description for an execution error
pub fn get_description(err: Error) []const u8 {
    return switch (err) {
        Error.STOP => "Normal STOP opcode execution",
        Error.REVERT => "REVERT opcode - state reverted",
        Error.INVALID => "INVALID opcode or invalid operation",
        Error.OutOfGas => "Out of gas",
        Error.StackUnderflow => "Stack underflow",
        Error.StackOverflow => "Stack overflow (beyond 1024 elements)",
        Error.InvalidJump => "Jump to invalid destination",
        Error.InvalidOpcode => "Undefined opcode",
        Error.StaticStateChange => "State modification in static context",
        Error.OutOfOffset => "Memory access out of bounds",
        Error.GasUintOverflow => "Gas calculation overflow",
        Error.WriteProtection => "Write to protected storage",
        Error.ReturnDataOutOfBounds => "Return data access out of bounds",
        Error.DeployCodeTooBig => "Contract creation code too large",
        Error.MaxCodeSizeExceeded => "Contract code size exceeds limit",
        Error.InvalidCodeEntry => "Invalid contract entry code",
        Error.DepthLimit => "Call depth exceeds limit (1024)",
        Error.OutOfMemory => "Out of memory allocation failed",
        Error.InvalidOffset => "Invalid memory offset",
        Error.InvalidSize => "Invalid memory size",
        Error.MemoryLimitExceeded => "Memory limit exceeded",
        Error.ChildContextActive => "Child context is active",
        Error.NoChildContextToRevertOrCommit => "No child context to revert or commit",
        Error.EOFNotSupported => "EOF (EVM Object Format) opcode not supported",
    };
}